import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import { setNormalCustomersData, setNormalCustomersVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';

const ManageNormalCustomers = () => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const [search, setSearch] = useState('');
    const [debouncedSearch, updateDebouncedSearch] = useDebouncedValue(search, 500);

    const query = useQuery(['all-normal-customers', debouncedSearch, state.globals.shop], () =>
        get('/normal-customers', { page: 1, limit: 5, sort: { name: 1 }, search: debouncedSearch })
    );

    const deleteMutation = useMutation((id) => del(`/normal-customers/id/${id}`), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'Normal customer deleted successfully' });
            await queryClient.invalidateQueries('all-normal-customers');
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to delete normal customer', err });
        },
    });

    const handleEdit = useCallback(
        (shop) => {
            batch(() => {
                dispatch(setNormalCustomersData(shop));
                dispatch(setNormalCustomersVisibility(true));
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
                            <Button color="info" onClick={() => dispatch(setNormalCustomersVisibility(true))}>
                                Add Normal Customer
                            </Button>
                            <Input
                                className="float-right tw-max-w-[400px]"
                                placeholder="Search Normal Customers"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.docs.length} normal customers`
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
                                            <th>Phone</th>
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
                                                    Unable to load normal customers
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
                                                        <tr key={`customer-${index}`}>
                                                            <td className="tw-align-middle">
                                                                {query.data?.pagingCounter + index}
                                                            </td>
                                                            <td className="tw-align-middle">{e.name}</td>
                                                            <td className="tw-align-middle">{e.phone}</td>
                                                            <td className="tw-align-middle">
                                                                <ButtonGroup>
                                                                    <Button
                                                                        color="light"
                                                                        className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                        onClick={() => handleEdit(e)}
                                                                    >
                                                                        <AiFillEdit /> Edit
                                                                    </Button>
                                                                    <Button
                                                                        color="danger"
                                                                        className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                        onClick={() => handleDelete(e._id)}
                                                                    >
                                                                        <AiFillDelete /> Delete
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </Then>
                                                <Else>
                                                    <EmptyTableRow columnCount={4}>
                                                        No normal customers created yet
                                                    </EmptyTableRow>
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

export default ManageNormalCustomers;
