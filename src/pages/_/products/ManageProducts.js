import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import { setProductsData, setProductsVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const ManageProducts = () => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const [search, setSearch] = useState('');
    const [debouncedSearch, updateDebouncedSearch] = useDebouncedValue(search, 500);

    const query = useQuery(['all-products', debouncedSearch, state.globals.shop], () =>
        get('/products', { page: 1, limit: 5, sort: { name: 1 }, search: debouncedSearch })
    );

    const deleteMutation = useMutation((id) => del(`/products/id/${id}`), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'Product deleted successfully' });
            await queryClient.invalidateQueries('all-products');
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to delete product', err });
        },
    });

    const handleEdit = useCallback(
        (employees) => {
            batch(() => {
                dispatch(setProductsData(employees));
                dispatch(setProductsVisibility(true));
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
                            <Button color="info" onClick={() => dispatch(setProductsVisibility(true))}>
                                Add Product
                            </Button>
                            <Input
                                className="float-right tw-max-w-[400px]"
                                placeholder="Search Products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.docs.length} products`
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
                                            <th>Group</th>
                                            <th>Name</th>
                                            <th>Cost Price</th>
                                            <th>Sale Price</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <When condition={query.isLoading}>
                                            <EmptyTableRow columnCount={5}>Loading...</EmptyTableRow>
                                        </When>
                                        <When condition={query.isError}>
                                            <EmptyTableRow columnCount={5}>
                                                <>
                                                    Unable to load products
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
                                                            <td className="tw-align-middle tw-flex tw-items-center tw-gap-2">
                                                                <When condition={e.registeredGroupId}>
                                                                    <div
                                                                        className="tw-w-[20px] tw-h-[20px]"
                                                                        style={{
                                                                            backgroundColor: e.registeredGroupId?.color,
                                                                        }}
                                                                    />
                                                                    {e.registeredGroupId?.name}
                                                                </When>
                                                            </td>
                                                            <td className="tw-align-middle">{e.name}</td>
                                                            <td className="tw-align-middle">
                                                                <FormatNumber number={e.salePrice} />
                                                            </td>
                                                            <td className="tw-align-middle">
                                                                <FormatNumber number={e.costPrice} />
                                                            </td>

                                                            <td className="tw-align-middle">
                                                                <ButtonGroup>
                                                                    <Button
                                                                        color="light"
                                                                        className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                    >
                                                                        <AiFillEye /> View
                                                                    </Button>
                                                                    <Button
                                                                        color="secondary"
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
                                                    <EmptyTableRow columnCount={5}>
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

export default ManageProducts;
