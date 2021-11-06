import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import cls from 'classnames';
import { del, get, useQuery } from '../../../helpers';
import { setAcceptUserData, setAcceptUserVisibility, setShopsData, setShopsVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';

const ManageUsers = () => {
    const user = useSelector((s) => s.globals.user);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const [search, setSearch] = useState('');
    const [debouncedSearch, updateDebouncedSearch] = useDebouncedValue(search, 500);

    const query = useQuery(['all-users', debouncedSearch], () =>
        get('/auth', { page: 1, limit: 100000, sort: { name: 1 }, search: debouncedSearch })
    );

    const deleteMutation = useMutation((id) => del(`/auth/id/${id}`), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'User deleted successfully' });
            await queryClient.invalidateQueries('all-users');
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to delete user', err });
        },
    });

    const handleAccept = useCallback(
        (userId) => {
            batch(() => {
                dispatch(setAcceptUserData({ _id: userId }));
                dispatch(setAcceptUserVisibility(true));
            });
        },
        [dispatch]
    );

    const handleDelete = useCallback(
        (id) => {
            swal({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover it!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    deleteMutation.mutate(id);
                }
            });
        },
        [deleteMutation]
    );

    return (
        <>
            <Card>
                <CardBody>
                    <Row className="form-group">
                        <Col xl={12}>
                            {/* <Button color="info" onClick={() => dispatch(setShopsVisibility(true))}>
                                Add Shop
                            </Button> */}
                            <Input
                                className="float-right tw-max-w-[400px]"
                                placeholder="Search Users"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.docs.length} users`
                                    : '...'}
                            </p>
                        </Col>
                        <Col xl={12}>{alert.renderAlert()}</Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <div className="table-responsive">
                                <Table className="mb-0 table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <When condition={query.isLoading}>
                                            <EmptyTableRow columnCount={4}>Loading...</EmptyTableRow>
                                        </When>
                                        <When condition={query.isError}>
                                            <EmptyTableRow columnCount={4}>
                                                <>
                                                    Unable to load users
                                                    <Button color="danger" onClick={query.refetch} className="tw-ml-2">
                                                        Retry
                                                    </Button>
                                                </>
                                            </EmptyTableRow>
                                        </When>
                                        <When condition={query.isSuccess}>
                                            <If condition={query.data?.docs.length}>
                                                <Then>
                                                    {query.data?.docs.map((e, index) => (
                                                        <tr key={`user-${index}`}>
                                                            <td className="tw-align-middle">
                                                                {query.data?.pagingCounter + index}
                                                            </td>
                                                            <td className="tw-align-middle">{e.name}</td>
                                                            <td
                                                                className={cls('tw-align-middle', {
                                                                    'tw-font-bold': !e.role,
                                                                })}
                                                            >
                                                                <If condition={!e.role}>
                                                                    <Then>
                                                                        <h1 className="tw-text-lg tw-font-bold tw-mb-0">
                                                                            PENDING
                                                                        </h1>
                                                                    </Then>
                                                                    <Else>{e.role || 'PENDING'}</Else>
                                                                </If>
                                                            </td>
                                                            <td className="tw-align-middle">
                                                                <When condition={!e.role}>
                                                                    <div className="tw-flex tw-gap-[6px]">
                                                                        <Button
                                                                            color="success"
                                                                            className="tw-w-[97px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                            onClick={() => handleAccept(e._id)}
                                                                        >
                                                                            <AiOutlineCheck />
                                                                            Accept
                                                                        </Button>
                                                                        <Button
                                                                            color="danger"
                                                                            className="tw-w-[97px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                            onClick={() => handleDelete(e._id)}
                                                                        >
                                                                            <AiOutlineClose />
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                </When>
                                                                <When condition={e.role && e._id !== user?._id}>
                                                                    <Button
                                                                        color="danger"
                                                                        className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                        onClick={() => handleAccept(e._id)}
                                                                    >
                                                                        <AiFillDelete />
                                                                        Delete
                                                                    </Button>
                                                                </When>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </Then>
                                                <Else>
                                                    <EmptyTableRow columnCount={4}>No users found</EmptyTableRow>
                                                </Else>
                                            </If>
                                        </When>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};

export default ManageUsers;
