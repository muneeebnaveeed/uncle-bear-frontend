import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Input, Row, Spinner, Table } from 'reactstrap';
import { When, Then, Else, If } from 'react-if';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useDebouncedValue } from 'rooks';
import { useMutation, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import cls from 'classnames';
import { del, get, useQuery } from '../../../helpers';
import { setMaterialExpensesData, setMaterialExpensesVisibility } from '../../../store/actions';
import useAlert from '../../../components/Common/useAlert';
import EmptyTableRow from '../../../components/Common/EmptyTableRow';
import FormatNumber from '../../../components/Common/FormatNumber';

const SimpleStat = ({ title, value }) => (
    <h4 className="tw-text-lg">
        <span className="tw-uppercase tw-font-bold">{title}</span> <FormatNumber number={value} />
    </h4>
);

const InputStat = ({ title, value, percentages, _key, onChange }) => {
    const handleChange = (v) => {
        onChange((prev) => ({ ...prev, [_key]: v }));
    };
    return (
        <h4 className="tw-text-lg d-flex tw-items-center tw-gap-4">
            <Input
                type="number"
                className="tw-w-[100px] tw-h-[30px]"
                value={percentages[_key]}
                onChange={(e) => handleChange(e.target.value)}
            />
            <span className="tw-uppercase tw-font-bold">{title}</span> <FormatNumber number={value} />
        </h4>
    );
};

const keys = ['profit1', 'futureCost1', 'profit2', 'futureCost2', 'expense2'];

const ManageProfitLossStatement = ({ startDate, endDate }) => {
    const state = useSelector((s) => s);
    const alert = useAlert();

    const [percentages, setPercentages] = useState({
        profit1: 60,
        futureCost1: 60,
        profit2: 60,
        futureCost2: 60,
        expense2: 60,
    });

    const { profit1, futureCost1, profit2, futureCost2, expense2 } = percentages;

    const query = useQuery(
        ['profit-loss', state.globals.shop],
        () =>
            get(
                '/audit/profit-loss-report',
                { startDate, endDate, profit1, profit2, futureCost1, futureCost2, expense2 },
                { shop: state.globals.shop?._id }
            ),
        {
            onError: (err) => alert.showAlert({ heading: 'Unable to generate profit/loss statement', err }),
            refetchOnWindowFocus: false,
            enabled: false,
        }
    );

    return (
        <>
            <Card className={cls('tw-min-h-[200px]', { 'tw-hidden': query.isIdle })}>
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
                            <Col xl={12}>
                                <div className="tw-flex tw-flex-col tw-items-end tw-justify-center tw-gap-2">
                                    <SimpleStat title="Total Sale:" value={query.data?.totalSellPrice} />
                                    <SimpleStat title="Total Expenses:" value={query.data?.totalExpenses} />
                                    <SimpleStat title="Total Cost Price:" value={query.data?.totalCostPrice} />
                                    <SimpleStat title="Total Earning Value #1:" value={query.data?.totalEarningVal1} />
                                    <SimpleStat title="Total Earning Value #2:" value={query.data?.totalEarningVal2} />
                                    <InputStat
                                        title="Company Profit Value #1:"
                                        value={query.data?.companyProfitVal1}
                                        _key={keys[0]}
                                        percentages={percentages}
                                        onChange={setPercentages}
                                    />
                                    <InputStat
                                        title="Company Future Cost Value #1:"
                                        value={query.data?.companyFutureCostVal1}
                                        _key={keys[1]}
                                        percentages={percentages}
                                        onChange={setPercentages}
                                    />
                                    <InputStat
                                        title="Company Profit Value #2:"
                                        value={query.data?.companyProfitVal2}
                                        _key={keys[2]}
                                        percentages={percentages}
                                        onChange={setPercentages}
                                    />
                                    <InputStat
                                        title="Company Future Cost Value #2:"
                                        value={query.data?.companyFutureCostVal2}
                                        _key={keys[3]}
                                        percentages={percentages}
                                        onChange={setPercentages}
                                    />
                                    <InputStat
                                        title="Company Expense Value #2:"
                                        value={query.data?.totalExpenses}
                                        _key={keys[4]}
                                        percentages={percentages}
                                        onChange={setPercentages}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </When>
                </CardBody>
            </Card>
            <When condition={!query.isLoading}>
                <Row>
                    <Col xl={12}>
                        <Button color="primary" block onClick={query.refetch}>
                            {query.isFetching ? 'Generating' : 'Generate'}
                        </Button>
                    </Col>
                </Row>
            </When>
        </>
    );
};

export default ManageProfitLossStatement;
