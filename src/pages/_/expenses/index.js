import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When } from 'react-if';
import { AiFillPrinter, AiOutlineExport } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import { useMutation } from 'react-query';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageMaterialExpenses from './ManageMaterialExpenses';
import ManageShopExpenses from './ManageShopExpenses';
import ManageSalaries from './ManageSalaries';
import { api, get } from '../../../helpers';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Expenses', link: '/expenses' },
];

const Expenses = () => {
    const [type, setType] = useState('material');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const exportMutation = useMutation((endpoint) =>
        get(`/${endpoint}/get-csv`, { page: 1, limit: 10000, startDate, endDate })
    );

    const handleExport = () => {
        let endpoint = 'raw-material-expenses';

        if (type === 'shop') endpoint = 'shop-expenses';
        else if (type === 'salary') endpoint = 'salaries';

        exportMutation.mutate(endpoint);
    };

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Expenses" breadcrumbItems={breadcrumbItems} />
                    <Row className="form-group">
                        <Col xl={6} md={12}>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color={type === 'material' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('material')}
                                >
                                    Material Expenses
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'shop' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('shop')}
                                >
                                    Shop Expenses
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'salary' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('salary')}
                                >
                                    Salaries
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
                                <Button
                                    color="success"
                                    className="tw-flex tw-justify-center tw-items-center tw-gap-2"
                                    onClick={handleExport}
                                >
                                    <AiOutlineExport /> Export
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <When condition={type === 'material'}>
                                <ManageMaterialExpenses />
                            </When>
                            <When condition={type === 'shop'}>
                                <ManageShopExpenses />
                            </When>
                            <When condition={type === 'salary'}>
                                <ManageSalaries />
                            </When>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Expenses;
