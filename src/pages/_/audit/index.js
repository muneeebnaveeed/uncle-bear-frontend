import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When } from 'react-if';
import { AiFillPrinter } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageSalesReport from './ManageSalesReport';
import ManageProfitLossStatement from './ManageProfitLossStatement';

const breadcrumbItems = [
    { title: `Uncle Bear's`, link: '#' },
    { title: 'Audit', link: '/audit' },
];

const Audit = () => {
    const [type, setType] = useState('profit-loss');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Audit" breadcrumbItems={breadcrumbItems} />
                    <Row className="form-group">
                        <Col xl={6} md={12}>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color={type === 'sales-report' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('sales-report')}
                                >
                                    Sales Report
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'profit-loss' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('profit-loss')}
                                >
                                    Profit/Loss Statement
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col xl={6} md={12}>
                            <div className="tw-float-right tw-flex tw-items-center">
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
                                {/* <Button color="success" className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                                    <AiFillPrinter /> Print
                                </Button> */}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <When condition={type === 'sales-report'}>
                                <ManageSalesReport startDate={startDate} endDate={endDate} />
                            </When>
                            <When condition={type === 'profit-loss'}>
                                <ManageProfitLossStatement startDate={startDate} endDate={endDate} />
                            </When>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Audit;
