import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit, AiFillPlusSquare, AiFillSave, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Form from 'reactstrap/lib/Form';
import { del, get, useQuery } from '../../../helpers';
import { setMaterialExpensesData, setMaterialExpensesVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const Cart = ({
    products,
    subtotal,
    discount,
    total,
    onIncrease,
    onDecrease,
    onDelete,
    onChangeDiscount,
    balance,
    change,
}) => {
    const state = useSelector((s) => s);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const alert = useAlert();

    return (
        <>
            <Card className="tw-min-h-[320px] mb-0">
                <CardBody>
                    <Row className="form-group">
                        <Col xl={12}>
                            <div className="page-title-box d-flex align-items-center justify-content-between pb-0">
                                <h4 className="mb-0">Cart</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12}>
                            <div className="table-responsive">
                                <Table className="mb-0 table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Product</th>
                                            <th />
                                            <th>Price</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <If condition={products.length}>
                                            <Then>
                                                {products.map((e, index) => (
                                                    <tr key={`customer-${index}`}>
                                                        <td className="tw-align-middle">{index + 1}</td>
                                                        <td className="tw-align-middle">{e.name}</td>
                                                        <td className="tw-align-middle">
                                                            {`${e.qty}x`} <FormatNumber number={e.salePrice} />
                                                        </td>
                                                        <td className="tw-align-middle">
                                                            <FormatNumber number={e.qty * e.salePrice} />
                                                        </td>
                                                        <td className="tw-align-middle">
                                                            <ButtonGroup>
                                                                <Button
                                                                    color="light"
                                                                    className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                    onClick={() => onIncrease(e.name)}
                                                                >
                                                                    <AiOutlinePlus /> Increase
                                                                </Button>
                                                                <Button
                                                                    color="light"
                                                                    className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                    onClick={() => onDecrease(e.name)}
                                                                >
                                                                    <AiOutlineMinus /> Decrease
                                                                </Button>
                                                                <Button
                                                                    color="danger"
                                                                    className="tw-min-w-[200px] tw-flex tw-justify-center tw-items-center tw-gap-2"
                                                                    onClick={() => onDelete(e.name)}
                                                                >
                                                                    <AiFillDelete /> Remove
                                                                </Button>
                                                            </ButtonGroup>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Then>
                                            <Else>
                                                <EmptyTableRow columnCount={5}>No products added yet</EmptyTableRow>
                                            </Else>
                                        </If>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <When condition={products.length > 0}>
                            <Col xl={12} className="tw-flex tw-items-center tw-justify-between tw-my-2">
                                <FormGroup className="form-required">
                                    <Label>Discount (%)</Label>
                                    <Input type="number" value={discount} onChange={onChangeDiscount} />
                                </FormGroup>
                                <div className="tw-float-right">
                                    <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0 tw-justify-end">
                                        <h4 className="mb-0">Subtotal</h4>
                                        <FormatNumber number={subtotal} />
                                    </div>
                                    <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0 tw-justify-end">
                                        <h4 className="mb-0">Total</h4>
                                        <FormatNumber number={total} />
                                    </div>
                                    <When condition={balance >= 0}>
                                        <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0 tw-justify-end">
                                            <h4 className="mb-0">Balance</h4>
                                            <FormatNumber number={balance} />
                                        </div>
                                        <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0 tw-justify-end">
                                            <h4 className="mb-0">Change</h4>
                                            <FormatNumber number={change} />
                                        </div>
                                    </When>
                                </div>
                            </Col>
                        </When>
                    </Row>
                </CardBody>
            </Card>

            <When condition={products.length > 0}>
                <Row className="tw-my-5">
                    <Col xl={12}>
                        <Button
                            block
                            color="info"
                            size="lg"
                            className="tw-flex tw-items-center tw-justify-center tw-gap-2"
                        >
                            <AiFillSave /> Save
                        </Button>
                    </Col>
                </Row>
            </When>
        </>
    );
};

export default Cart;
