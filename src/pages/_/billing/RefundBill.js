import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { Else, If, Then, When } from 'react-if';
import ReactDatePicker from 'react-datepicker';
import GroupedProducts from './GroupedProducts';
import Cart from './Cart';
import BillingFactory from '../../../helpers/BillingFactory';
import CustomerSelect from './CustomerSelect';

const RefundBill = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('');
    const [customer, setCustomer] = useState();

    const [filterBillBy, setFilterBillBy] = useState('date');
    const [billNumber, setBillNumber] = useState('');

    const { current: billingFactory } = useRef(new BillingFactory({ products, setProducts, discount, setDiscount }));

    const handleCustomerChange = (c) => {
        setCustomer(c.value);
        billingFactory.setBalance(c.value.balance);
    };

    const handleChangeBillNumber = (e) => {
        setBillNumber(e.target.value);
    };

    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <div className="page-title-box d-flex align-items-center justify-content-between pb-0 mb-3">
                                <h4 className="mb-0">Find order by</h4>
                            </div>
                            <ButtonGroup className="mb-3">
                                <Button
                                    size="lg"
                                    color={filterBillBy === 'date' ? 'info' : 'light'}
                                    onClick={() => setFilterBillBy('date')}
                                >
                                    Date
                                </Button>
                                <Button
                                    size="lg"
                                    color={filterBillBy === 'number' ? 'info' : 'light'}
                                    onClick={() => setFilterBillBy('number')}
                                >
                                    Number
                                </Button>
                            </ButtonGroup>
                            <div className="tw-flex tw-items-center tw-max-w-[600px]">
                                <If condition={filterBillBy === 'date'}>
                                    <Then>
                                        <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                        <p className="tw-m-0 tw-mr-2">TO</p>
                                        <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                    </Then>
                                    <Else>
                                        <Input
                                            type="text"
                                            placeholder="Enter Bill Number..."
                                            value={billNumber}
                                            onChange={handleChangeBillNumber}
                                        />
                                    </Else>
                                </If>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <Row className="form-group">
                                <Col xl={12}>
                                    <div className="page-title-box d-flex align-items-center justify-content-between pb-0">
                                        <h4 className="mb-0">Customer</h4>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col xl={12}>
                                    <CustomerSelect type="vip" onChange={handleCustomerChange} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Cart
                products={billingFactory.products}
                onIncrease={billingFactory.handleIncrease}
                onDecrease={billingFactory.handleDecrease}
                onDelete={billingFactory.handleDelete}
                subtotal={billingFactory.getSubtotal()}
                discount={billingFactory.discount}
                onChangeDiscount={billingFactory.handleChangeDiscount}
                total={billingFactory.getTotal()}
                balance={billingFactory.balance}
                change={billingFactory.getChange()}
            />
        </>
    );
};

export default RefundBill;
