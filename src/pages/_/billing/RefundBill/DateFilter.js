import React, { useState } from 'react';
import { AiFillCaretDown, AiFillDelete } from 'react-icons/ai';
import { Else, If, Then, When } from 'react-if';
import { useMutation } from 'react-query';
import { Button, Card, CardBody, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { Collapse } from 'react-collapse';
import cls from 'classnames';
import FormatNumber from '../../../../components/Common/FormatNumber';
import FilteredBill from '../FilteredBill';

const DateFilter = ({ query, onSelectBill }) => {
    const [billExpanded, setBillExpanded] = useState(null);
    return (
        <Row className="form-group">
            <Col xl={12}>
                <ListGroup>
                    <When condition={query.isIdle}>
                        <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                            Please search bills...
                        </ListGroupItem>
                    </When>
                    <When condition={query.isLoading}>
                        <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                            Loading...
                        </ListGroupItem>
                    </When>
                    <When condition={query.isError}>
                        <ListGroupItem className="tw-flex tw-items-center tw-justify-between">
                            Unable to load bills
                            <Button color="danger" onClick={query.refetch} className="tw-ml-2">
                                Retry
                            </Button>
                        </ListGroupItem>
                    </When>
                    <When condition={query.isSuccess}>
                        <If condition={query.data?.docs.length}>
                            <Then>
                                {query.data?.docs.map((e, index) => (
                                    <React.Fragment key={`bill-${index}`}>
                                        <ListGroupItem
                                            onClick={() =>
                                                setBillExpanded((prev) => (prev === e.billId ? null : e.billId))
                                            }
                                            className="tw-flex tw-justify-between tw-items-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all tw-duration-200"
                                        >
                                            <h1 className="tw-mb-0  tw-text-lg">
                                                <span className="tw-font-bold">{e.billId}</span>{' '}
                                                <FormatNumber number={e.total} />
                                            </h1>
                                            <AiFillCaretDown />
                                        </ListGroupItem>
                                        <Collapse isOpened={e.billId === billExpanded}>
                                            <FilteredBill
                                                _id={e._id}
                                                customer={e.customer.name}
                                                type={e.type}
                                                products={e.products}
                                                onSelectBill={onSelectBill}
                                                discount={e.discountPercent}
                                            />
                                        </Collapse>
                                    </React.Fragment>
                                ))}
                            </Then>
                            <Else>
                                <ListGroupItem className="tw-flex tw-items-center tw-justify-between tw-items-center">
                                    No bills found
                                </ListGroupItem>
                            </Else>
                        </If>
                    </When>
                </ListGroup>
            </Col>
        </Row>
    );
};

export default DateFilter;
