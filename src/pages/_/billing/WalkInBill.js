import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When } from 'react-if';
import { AiFillPrinter } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useReactToPrint } from 'react-to-print';
import { get, post, useQuery } from '../../../helpers';
import GroupedProducts from './GroupedProducts';
import Cart from './Cart';
import BillingFactory from '../../../helpers/BillingFactory';
import useAlert from '../../../components/Common/useAlert';
import Receipt from './Receipt';

const WalkIn = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('');

    const shop = useSelector((s) => s.globals.shop);
    const alert = useAlert();

    const [registeredBillId, setRegisteredBillId] = useState(null);
    const receiptRef = useRef();

    const { current: billingFactory } = useRef(new BillingFactory({ products, setProducts, discount, setDiscount }));

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => billingFactory.resetBill(),
    });

    const mutation = useMutation(({ payload, shop }) => post('/bills', payload, {}, { shop }), {
        onSuccess: async (data) => {
            alert.showAlert({ color: 'success', heading: 'Bill Registered' });
            setRegisteredBillId(data.billId);
            handlePrint();
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to register bill', err });
        },
    });

    // useEffect(() => {
    //     handlePrint();
    // }, []);

    const handleSave = () => {
        const payload = { type: 'WALKIN' };
        const discount = billingFactory.discount ? Number(billingFactory.discount) : 0;
        payload.discountPercent = discount;
        payload.products = billingFactory.products.map((p) => ({ product: p._id, qty: p.qty }));
        mutation.mutate({ payload, shop: shop._id });
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
                />
            </div>
        </>
    );
};

export default WalkIn;
