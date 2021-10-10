import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import GroupedProducts from './GroupedProducts';
import Cart from './Cart';
import BillingFactory from '../../../helpers/BillingFactory';
import CustomerSelect from './CustomerSelect';

const VIPBill = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('');
    const [customer, setCustomer] = useState();

    const { current: billingFactory } = useRef(new BillingFactory({ products, setProducts, discount, setDiscount }));

    const handleCustomerChange = (c) => {
        setCustomer(c.value);
        billingFactory.setBalance(c.value.balance);
    };

    return (
        <>
            <Row className="form-group">
                <Col xl={12}>
                    <GroupedProducts onAdd={billingFactory.handleAdd} />
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

export default VIPBill;
