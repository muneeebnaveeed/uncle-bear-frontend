import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Label, Row, Table } from 'reactstrap';

// Import Breadcrumb
import GroupedProducts from './GroupedProducts';
import Cart from './Cart';
import BillingFactory from '../../../helpers/BillingFactory';
import CustomerSelect from './CustomerSelect';
import FormatNumber from '../../../components/Common/FormatNumber';
import { When } from 'react-if';
import { useMutation } from 'react-query';
import { post } from '../../../helpers';
import { useSelector } from 'react-redux';
import useAlert from '../../../components/Common/useAlert';

const VIPBill = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('0');
    const [deductionFromBalance, setDeductionFromBalance] = useState('0');
    const [customer, setCustomer] = useState();

    const shop = useSelector(s => s.globals.shop);
    const alert = useAlert();

    const { current: billingFactory } = useRef(new BillingFactory({ products, setProducts, discount, setDiscount, deductionFromBalance, setDeductionFromBalance }));

    const mutation = useMutation(({ payload, shop }) => post('/bills/vip', payload, {}, { shop }), {
        onSuccess: async () => {
            alert.showAlert({ color: 'success', heading: 'Bill Registered' });

            billingFactory.resetBill();
            handleCustomerChange({});
            handleChangeDeductionFromBalance(0);
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to register bill', err });
        },
    });

    const handleCustomerChange = (c) => {
        setCustomer(c);
        billingFactory.setBalance(c.value?.balance || 0);
    };

    const handleChangeDeductionFromBalance = (v) => {
        setDeductionFromBalance(v);
        billingFactory.deductionFromBalance = v;
    };

    const handleSave = () => {
        const payload = { 
            type: 'VIP',
            customer: customer?.value?._id,
            vipBalancePercent: Number(billingFactory.deductionFromBalance),
            discountPercent: Number(billingFactory.discount)
        };
        const products = billingFactory.products.map(p => ({ product: p._id, qty: p.qty }));
        payload.products = products;
        mutation.mutate({ payload, shop: shop?._id });
    }

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
                                <Col xl="6">
                                    <Row className="form-group">
                                        <Col xl="12">
                                            <div className="page-title-box d-flex align-items-center justify-content-between pb-0">
                                                <h4>Customer</h4>
                                            </div>
                                            <CustomerSelect type="vip" width="100%" value={customer} onChange={handleCustomerChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl="12">
                                            <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0">
                                                <h4 className="mb-0">Available Balance</h4>
                                                <When condition={customer?.value?.name}>
                                                    <FormatNumber number={billingFactory.balance} />
                                                </When>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl="6">
                                    
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Cart
                type="vip"
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
                deductionFromBalance={billingFactory.getDeductionFromBalance()}
                isSaving={mutation.isLoading}
                onSave={handleSave}
            >
                <Label>Deduct from Balance (%)</Label>
                <Input type="number" value={deductionFromBalance} onChange={(e) => handleChangeDeductionFromBalance(e.target.value)} />
            </Cart>
            <Row className="tw-mt-4">
                <Col xl={12}>{alert.renderAlert()}</Col>
            </Row>
        </>
    );
};

export default VIPBill;
