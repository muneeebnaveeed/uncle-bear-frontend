import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, ListGroup, ListGroupItem, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import {} from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const ManageListInventory = () => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const [search, setSearch] = useState('');
    const [debouncedSearch, updateDebouncedSearch] = useDebouncedValue(search, 500);

    const query = useQuery(['list-inventory', debouncedSearch, state.globals.shop], () =>
        get('/inventories', { search: debouncedSearch })
    );

    return (
        <>
            <Card>
                <CardBody>
                    <Row className="form-group">
                        <Col xl={12}>
                            <Input
                                className="float-right tw-max-w-[400px]"
                                placeholder="Search Inventory"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <p className="card-title-desc">
                                {!query.isLoading && !query.isError
                                    ? `Showing ${query.data?.length} inventory items`
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
                                        Unable to load inventory items
                                        <Button color="danger" onClick={query.refetch} className="tw-ml-2">
                                            Retry
                                        </Button>
                                    </ListGroupItem>
                                </When>
                                <When condition={query.isSuccess}>
                                    <If condition={query.data?.length}>
                                        <Then>
                                            {query.data?.map((e, index) => (
                                                <ListGroupItem
                                                    key={`list-inventory-${index}`}
                                                    className="tw-flex tw-items-center"
                                                >
                                                    <p className="tw-mb-0">{`${e.item} - ${e.quantity}`}</p>
                                                </ListGroupItem>
                                            ))}
                                        </Then>
                                        <Else>
                                            <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                                No inventory added yet
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

export default ManageListInventory;
