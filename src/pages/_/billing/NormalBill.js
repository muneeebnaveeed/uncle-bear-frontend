import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useReactToPrint } from 'react-to-print';
import GroupedProducts from './GroupedProducts';
import Cart from './Cart';
import BillingFactory from '../../../helpers/BillingFactory';
import CustomerSelect from './CustomerSelect';
import { post } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import Receipt from './Receipt';

const NormalBill = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('');
    const [customer, setCustomer] = useState();

    const shop = useSelector((s) => s.globals.shop);
    const alert = useAlert();

    const [registeredBillId, setRegisteredBillId] = useState(null);
    const receiptRef = useRef();

    const { current: billingFactory } = useRef(new BillingFactory({ products, setProducts, discount, setDiscount }));
    const handleCustomerChange = (c) => {
        setCustomer(c);
    };
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => {
            billingFactory.resetBill();
            handleCustomerChange({});
        },
    });

    const mutation = useMutation(({ payload, s }) => post('/bills', payload, {}, { shop: s }), {
        onSuccess: async (data) => {
            alert.showAlert({ color: 'success', heading: 'Bill Registered' });

            setRegisteredBillId(data.billId);
            handlePrint();
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to register bill', err });
        },
    });

    const handleSave = () => {
        const payload = { type: 'NORMAL', customer: customer?.value?._id };
        const d = billingFactory.discount ? Number(billingFactory.discount) : 0;
        payload.discountPercent = d;
        payload.products = billingFactory.products.map((p) => ({ product: p._id, qty: p.qty }));
        mutation.mutate({ payload, s: shop._id });
    };

    const subtotal = billingFactory.getSubtotal();
    const total = billingFactory.getTotal();

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
                                    <CustomerSelect type="normal" value={customer} onChange={handleCustomerChange} />
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
                subtotal={subtotal}
                discount={billingFactory.discount}
                onChangeDiscount={billingFactory.handleChangeDiscount}
                total={total}
                onSave={handleSave}
                isSaving={mutation.isLoading}
            />
            <Row className="tw-mt-4">
                <Col xl={12}>{alert.renderAlert()}</Col>
            </Row>
            <div className="tw-hidden">
                <Receipt
                    ref={receiptRef}
                    shop={shop}
                    billId={registeredBillId}
                    products={billingFactory.products}
                    subtotal={subtotal}
                    discount={billingFactory.discount}
                    total={total}
                    customer={customer?.value}
                />
            </div>
        </>
    );
};

export default NormalBill;
