import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When } from 'react-if';
import { AiFillPrinter } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageMaterialExpenses from './ManageMaterialExpenses';
import ManageShopExpenses from './ManageShopExpenses';
import ManageSalaries from './ManageSalaries';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Expenses', link: '/expenses' },
];

const Expenses = () => {
    const [type, setType] = useState('material');

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
                                <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                <p className="tw-m-0 tw-mr-2">TO</p>
                                <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                <Button color="success" className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                                    <AiFillPrinter /> Print
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
