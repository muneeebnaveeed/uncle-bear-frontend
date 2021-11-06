import React, { useState } from 'react';
import { AiFillCaretDown, AiFillDelete } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useMutation } from 'react-query';
import { Button, Card, CardBody, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { Collapse } from 'react-collapse';
import cls from 'classnames';
import FormatNumber from '../../../../components/Common/FormatNumber';
import FilteredBill from '../FilteredBill';

const IdFilter = ({ query, onSelectBill }) => {
    const [billExpanded, setBillExpanded] = useState(null);
    return (
        <Row className="form-group">
            <Col xl={12}>
                <ListGroup>
                    <When condition={query.isIdle}>
                        <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                            Please search bill...
                        </ListGroupItem>
                    </When>
                    <When condition={query.isLoading}>
                        <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                            Loading...
                        </ListGroupItem>
                    </When>
                    <When condition={query.isError}>
                        <ListGroupItem className="tw-flex tw-items-center">
                            Unable to load bill
                            <Button color="danger" onClick={query.refetch} className="tw-ml-2">
                                Retry
                            </Button>
                        </ListGroupItem>
                    </When>
                    <When condition={query.isSuccess}>
                        <If condition={query.data}>
                            <Then>
                                <ListGroupItem className="tw-flex tw-justify-between tw-items-center">
                                    <h1 className="tw-mb-0  tw-text-lg">
                                        <span className="tw-font-bold">{query.data?.billId}</span>{' '}
                                        <FormatNumber number={query.data?.total} />
                                    </h1>
                                </ListGroupItem>
                                <FilteredBill
                                    _id={query.data?._id}
                                    customer={query.data?.customer?.name}
                                    type={query.data?.type}
                                    products={query.data?.products}
                                    onSelectBill={onSelectBill}
                                    discount={query.data?.discountPercent}
                                />
                            </Then>
                            <Else>
                                <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                    Bill not found
                                </ListGroupItem>
                            </Else>
                        </If>
                    </When>
                </ListGroup>
            </Col>
        </Row>
    );
};

export default IdFilter;
