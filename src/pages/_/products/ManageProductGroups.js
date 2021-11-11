import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import {
    setProductGroupsData,
    setProductGroupsVisibility,
    setProductsData,
    setProductsVisibility,
} from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const ManageProductGroups = () => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const query = useQuery(['all-product-groups', state.globals.shop], () =>
        get('/product-groups', { page: 1, limit: 5, sort: { name: 1 }, search: '' })
    );

    const deleteMutation = useMutation((id) => del(`/product-groups/id/${id}`), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'Product group deleted successfully' });
            await Promise.all([
                queryClient.invalidateQueries('all-product-groups'),
                queryClient.invalidateQueries('all-products'),
            ]);
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to delete product', err });
        },
    });

    const handleEdit = useCallback(
        (employees) => {
            batch(() => {
                dispatch(setProductGroupsData(employees));
                dispatch(setProductGroupsVisibility(true));
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
                            <Button color="info" onClick={() => dispatch(setProductGroupsVisibility(true))}>
                                Add Product Group
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc mb-2">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.docs.length} product groups`
                                    : '...'}
                            </p>
                        </Col>
                        <Col xl={12}>{alert.renderAlert()}</Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <ListGroup>
                                <When condition={query.isLoading}>
                                    <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                        Loading...
                                    </ListGroupItem>
                                </When>
                                <When condition={query.isError}>
                                    <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                        Unable to load products
                                        <Button color="danger" onClick={query.refetch} className="tw-ml-2">
                                            Retry
                                        </Button>
                                    </ListGroupItem>
                                </When>
                                <When condition={query.isSuccess}>
                                    <If condition={query.data?.docs.length}>
                                        <Then>
                                            {query.data?.docs.map((e, index) => (
                                                <ListGroupItem
                                                    key={`product-group-${index}`}
                                                    className="tw-flex tw-items-center tw-justify-between tw-items-center"
                                                >
                                                    <div className="tw-flex tw-gap-2">
                                                        <div
                                                            className="tw-w-[20px] tw-h-[20px]"
                                                            style={{ backgroundColor: e.color }}
                                                        />
                                                        <p className="tw-mb-0">{`${e.name}${e.description ? `, ${e.description}` : ''
                                                            }`}</p>
                                                    </div>
                                                    <div className="tw-flex tw-gap-2">
                                                        <Button
                                                            color="light"
                                                            className="tw-flex tw-items-center tw-gap-2"
                                                            onClick={() => handleEdit(e)}
                                                        >
                                                            <AiFillEdit /> Edit
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            className="tw-flex tw-items-center tw-gap-2"
                                                            onClick={() => handleDelete(e._id)}
                                                        >
                                                            <AiFillDelete /> Delete
                                                        </Button>
                                                    </div>
                                                </ListGroupItem>
                                            ))}
                                        </Then>
                                        <Else>
                                            <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                                No product groups created yet
                                            </ListGroupItem>
                                        </Else>
                                    </If>
                                </When>
                            </ListGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    );
};

export default ManageProductGroups;
