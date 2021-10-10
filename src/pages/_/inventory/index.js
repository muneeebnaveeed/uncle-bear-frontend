import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When, Unless } from 'react-if';
import { AiFillPrinter } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageListInventory from './ManageListInventory';
import ManageShopExpenses from './ManageShopExpenses';
import ManageSalaries from './ManageSalaries';

const breadcrumbItems = [
    { title: 'Uncle Bear', link: '#' },
    { title: 'Inventory', link: '/inventory' },
];

const Inventory = () => {
    const [type, setType] = useState('list');

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Inventory" breadcrumbItems={breadcrumbItems} />
                    <Row className="form-group">
                        <Col xl={6} md={12}>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color={type === 'list' ? 'primary' : 'light'}
                                    className="tw-w-[120px]"
                                    onClick={() => setType('list')}
                                >
                                    List
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'add' ? 'primary' : 'light'}
                                    className="tw-w-[120px]"
                                    onClick={() => setType('add')}
                                >
                                    Add
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'consume' ? 'primary' : 'light'}
                                    className="tw-w-[120px]"
                                    onClick={() => setType('consume')}
                                >
                                    Consume
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col xl={6} md={12}>
                            <div className="tw-float-right tw-flex tw-items-center">
                                <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                <p className="tw-m-0 tw-mr-2">TO</p>
                                <ReactDatePicker selected={new Date()} dateFormat="dd, MMM yyyy" />
                                <Unless condition={type === 'list'}>
                                    <Button
                                        color="success"
                                        className="tw-flex tw-justify-center tw-items-center tw-gap-2"
                                    >
                                        <AiFillPrinter /> Print
                                    </Button>
                                </Unless>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <When condition={type === 'list'}>
                                <ManageListInventory />
                            </When>
                            <When condition={type === 'add'}>
                                <ManageShopExpenses />
                            </When>
                            <When condition={type === 'consume'}>
                                <ManageSalaries />
                            </When>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Inventory;
