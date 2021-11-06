import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import { setAddInventoryData, setAddInventoryVisibility, setConsumeInventoryData, setConsumeInventoryVisibility, setShopExpensesData, setShopExpensesVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const ManageAddInventory = ({ startDate, endDate }) => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const [search, setSearch] = useState('');
    const [debouncedSearch, updateDebouncedSearch] = useDebouncedValue(search, 500);

    const query = useQuery(['all-add-inventory-transactions', startDate, endDate, debouncedSearch, state.globals.shop], () =>
        get('/inventories/transactions/add', { page: 1, limit: 5, search: debouncedSearch, startDate, endDate })
    );

    const deleteMutation = useMutation((id) => del(`/inventories/id/${id}`), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'Transaction deleted successfully' });
            await queryClient.invalidateQueries('all-add-inventory-transactions');
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to delete transaction', err });
        },
    });

    const handleEdit = useCallback(
        (shop) => {
            batch(() => {
                dispatch(setShopExpensesData(shop));
                dispatch(setShopExpensesVisibility(true));
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
                            <Button color="info" onClick={() => batch(() => {
                                dispatch(setAddInventoryData({ type: 'add' }))
                                dispatch(setAddInventoryVisibility(true));
                            })}>
                                Add Inventory
                            </Button>
                            <Input
                                className="float-right tw-max-w-[400px]"
                                placeholder="Search Add Inventory Transactions"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.docs.length} add inventory transactions`
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
                                    <ListGroupItem className="tw-flex tw-items-center tw-justify-between">
                                        Unable to load add inventory transactions
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
                                                    key={`list-inventory-${index}`}
                                                    className="tw-flex tw-justify-between tw-items-center"
                                                >
                                                    <p className="tw-mb-0">{`${e.quantity}x ${e.item}`}</p>
                                                    <div className="tw-flex tw-gap-2">
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
                                                No add inventory transaction found
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

export default ManageAddInventory;
