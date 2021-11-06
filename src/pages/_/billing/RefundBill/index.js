import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Row,
    Table,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';

// Import Breadcrumb
import { Else, If, Then, When } from 'react-if';
import ReactDatePicker from 'react-datepicker';
import { AiOutlineSearch } from 'react-icons/ai';
import _ from 'lodash';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import GroupedProducts from '../GroupedProducts';
import Cart from '../Cart';
import RefundFactory from '../../../../helpers/RefundFactory';
import CustomerSelect from '../CustomerSelect';
import DateFilter from './DateFilter';
import { get, post, useQuery } from '../../../../helpers';
import IdFilter from './IdFilter';
import useAlert from '../../../../components/Common/useAlert';
import Receipt from '../Receipt';

const RefundBill = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState('');
    const [customer, setCustomer] = useState();

    const [filterBillBy, setFilterBillBy] = useState('date');
    const [billId, setBillId] = useState('');
    const [startDate, setStartDate] = useState(new Date('2021-10-20'));
    const [endDate, setEndDate] = useState(new Date());
    const [selectedBill, setSelectedBill] = useState(null);

    const shop = useSelector((s) => s.globals.shop);

    const [registeredBillId, setRegisteredBillId] = useState(null);
    const receiptRef = useRef();

    const { current: refundFactory } = useRef(new RefundFactory({ products, setProducts, discount, setDiscount }));

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => {
            refundFactory.resetBill();
            refundFactory.resetBill();
            refundFactory.setInitialProducts([]);
        },
    });

    const dateFilterQuery = useQuery(
        ['bills', 1, 20, startDate, endDate],
        () => get('/bills', { page: 1, limit: 20, startDate, endDate }),
        { enabled: false }
    );

    const idFilterQuery = useQuery([`bill`, billId], () => get(`/bills/id/${billId || null}`), {
        enabled: false,
    });

    const alert = useAlert();

    const refundMutation = useMutation(
        ({ payload, shopId }) => post(`/bills/refund/${selectedBill}`, payload, {}, { shop: shopId }),
        {
            onSuccess: async (data) => {
                alert.showAlert({ color: 'success', heading: 'Bill Registered' });

                setRegisteredBillId(data.billId);
                setCustomer(data.customer);
                handlePrint();
            },
            onError: (err) => {
                alert.showAlert({ heading: 'Unable to register bill', err });
            },
        }
    );

    const handleChangeBillId = (e) => {
        setBillId(e.target.value);
    };

    const handleSearch = () => {
        const query = {
            date: dateFilterQuery,
            id: idFilterQuery,
        };
        query[filterBillBy].refetch();
    };

    const handleSelectBill = (bill) => {
        setSelectedBill(bill._id);
        refundFactory.products = _.cloneDeep([...bill.products]);
        refundFactory.setProducts(_.cloneDeep([...bill.products]));
        refundFactory.setInitialProducts(_.cloneDeep([...bill.products]));
        refundFactory.discount = bill.discount;
        refundFactory.setDiscount(bill.discount);
    };

    const handleSave = () => {
        const payload = refundFactory.products.map((p) => ({ product: p._id, qty: p.qty }));
        refundMutation.mutate({ payload, shopId: shop._id });
    };

    const subtotal = refundFactory.getSubtotal();
    const total = refundFactory.getTotal();

    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <div className="page-title-box d-flex align-items-center justify-content-between pb-0 mb-3">
                                <h4 className="mb-0">Find bill by</h4>
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
                                    color={filterBillBy === 'id' ? 'info' : 'light'}
                                    onClick={() => setFilterBillBy('id')}
                                >
                                    ID
                                </Button>
                            </ButtonGroup>
                            <div className="tw-flex tw-items-center tw-max-w-[600px]">
                                <If condition={filterBillBy === 'date'}>
                                    <Then>
                                        <ReactDatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="dd, MMM yyyy"
                                        />
                                        <p className="tw-m-0 tw-mr-2">TO</p>
                                        <ReactDatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            dateFormat="dd, MMM yyyy"
                                        />
                                    </Then>
                                    <Else>
                                        <Input
                                            type="text"
                                            placeholder="Enter Bill ID..."
                                            value={billId}
                                            onChange={handleChangeBillId}
                                        />
                                    </Else>
                                </If>
                                <Button
                                    color="primary"
                                    className="tw-flex tw-items-center tw-gap-1 tw-ml-2"
                                    onClick={handleSearch}
                                >
                                    <AiOutlineSearch /> Search
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <If condition={filterBillBy === 'date'}>
                <Then>
                    <DateFilter query={dateFilterQuery} onSelectBill={handleSelectBill} />
                </Then>
                <Else>
                    <IdFilter query={idFilterQuery} onSelectBill={handleSelectBill} />
                </Else>
            </If>
            <Cart
                type="refund"
                products={refundFactory.products}
                onIncrease={refundFactory.handleIncrease}
                onDecrease={refundFactory.handleDecrease}
                onDelete={refundFactory.handleDelete}
                subtotal={subtotal}
                discount={refundFactory.discount}
                onChangeDiscount={refundFactory.handleChangeDiscount}
                total={total}
                balance={refundFactory.balance}
                change={refundFactory.getChange()}
                isSaving={refundMutation.isLoading}
                onSave={handleSave}
            />
            <Row className="tw-mt-4">
                <Col xl={12}>{alert.renderAlert()}</Col>
            </Row>
            <div className="tw-hidden">
                <Receipt
                    ref={receiptRef}
                    shop={shop}
                    billId={registeredBillId}
                    products={refundFactory.products}
                    subtotal={subtotal}
                    discount={refundFactory.discount}
                    total={total}
                    customer={customer}
                />
            </div>
        </>
    );
};

export default RefundBill;
