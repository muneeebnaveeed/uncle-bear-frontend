import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, Row, Spinner, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { del, get, useQuery } from '../../../helpers';
import { setMaterialExpensesData, setMaterialExpensesVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const ManageSalesReport = ({ startDate, endDate }) => {
    const shop = useSelector((s) => s.globals.shop);
    const dispatch = useDispatch();
    const alert = useAlert();

    const query = useQuery(
        ['sales-report', startDate, endDate, shop],
        () => get('/audit/sales-report', { startDate, endDate }, { shop: shop?._id }),
        { onError: (err) => alert.showAlert({ heading: 'Unable to generate sales report', err }) }
    );

    return (
        <>
            <Card className="tw-min-h-[200px]">
                <CardBody>
                    <Row>
                        <Col xl={12}>{alert.renderAlert()}</Col>
                    </Row>
                    <When condition={query.isLoading}>
                        <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-transform -tw-translate-x-1/2 tw-translate-y-[-60%]">
                            <Spinner />
                        </div>
                    </When>
                    <When condition={query.isSuccess}>
                        <Row>
                            <Col xl={6}>
                                <div className="page-title-box">
                                    <h4 className="mb-0">Total Sales</h4>
                                </div>
                                <div className="table-responsive">
                                    <Table className="mb-0 table-striped">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Group</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Sale Price</th>
                                                <th>Cost Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <When condition={query.isSuccess}>
                                                <If condition={query.data}>
                                                    <Then>
                                                        {query.data?.totalSales.map((e, index) => (
                                                            <tr key={`sale-${index}`}>
                                                                <td className="tw-align-middle">{index + 1}</td>
                                                                <td className="tw-align-middle">
                                                                    {e.registeredGroupId.name}
                                                                </td>
                                                                <td className="tw-align-middle">{e.name}</td>
                                                                <td className="tw-align-middle">{e.qty}</td>

                                                                <td className="tw-align-middle">
                                                                    <FormatNumber number={e.salePrice} />
                                                                </td>
                                                                <td className="tw-align-middle">
                                                                    <FormatNumber number={e.costPrice} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td />
                                                            <td />
                                                            <td />
                                                            <td />
                                                            <td className="tw-align-middle">
                                                                <div className="page-title-box tw-p-0">
                                                                    <h4 className="tw-mb-0">
                                                                        <FormatNumber
                                                                            number={query.data?.prices?.totalSellPrice}
                                                                        />
                                                                    </h4>
                                                                </div>
                                                            </td>
                                                            <td className="tw-align-middle">
                                                                <div className="page-title-box tw-p-0">
                                                                    <h4 className="tw-mb-0">
                                                                        <FormatNumber
                                                                            number={query.data?.prices?.totalCostPrice}
                                                                        />
                                                                    </h4>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Then>
                                                    <Else>
                                                        <EmptyTableRow columnCount={6}>No sales found</EmptyTableRow>
                                                    </Else>
                                                </If>
                                            </When>
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <div className="page-title-box">
                                    <h4 className="mb-0">Total Expenses</h4>
                                </div>
                                <div className="table-responsive">
                                    <Table className="mb-0 table-striped">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <When condition={query.isSuccess}>
                                                <tr>
                                                    <td className="tw-align-middle">1</td>
                                                    <td className="tw-align-middle">Raw Material</td>
                                                    <td className="tw-align-middle">
                                                        <FormatNumber
                                                            number={query.data?.expenses.rawMaterialExpenses}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="tw-align-middle">2</td>
                                                    <td className="tw-align-middle">Shop</td>
                                                    <td className="tw-align-middle">
                                                        <FormatNumber number={query.data?.expenses.shopExpenses} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="tw-align-middle">3</td>
                                                    <td className="tw-align-middle">Salaries</td>
                                                    <td className="tw-align-middle">
                                                        <FormatNumber number={query.data?.expenses.salariesExpenses} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td />
                                                    <td />
                                                    <td className="tw-align-middle">
                                                        <div className="page-title-box tw-p-0">
                                                            <h4 className="tw-mb-0">
                                                                <FormatNumber
                                                                    number={query.data?.expenses.totalExpenses}
                                                                />
                                                            </h4>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </When>
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12}>
                                <h4 className="tw-text-lg">
                                    <span className="tw-uppercase tw-font-bold">Total Earning #1:</span>{' '}
                                    <span
                                        style={{
                                            color:
                                                query.data?.earningValues.totalEarningVal1 > 0
                                                    ? 'forestgreen'
                                                    : 'crimson',
                                        }}
                                    >
                                        <FormatNumber number={query.data?.earningValues.totalEarningVal1} />
                                    </span>
                                </h4>
                                <h4 className="tw-text-lg">
                                    <span className="tw-uppercase tw-font-bold">Total Cost Price:</span>{' '}
                                    <FormatNumber number={query.data?.prices.totalCostPrice} />
                                </h4>
                                <h4 className="tw-text-lg">
                                    <span className="tw-uppercase tw-font-bold">Total Earning #2:</span>{' '}
                                    <FormatNumber number={query.data?.earningValues.totalEarningVal2} />
                                </h4>
                            </Col>
                        </Row>
                    </When>
                </CardBody>
            </Card>
        </>
    );
};

export default ManageSalesReport;
