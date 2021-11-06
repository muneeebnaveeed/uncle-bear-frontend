import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else, When } from 'react-if';
import { AiFillPrinter } from 'react-icons/ai';
import ReactDatePicker from 'react-datepicker';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { get, useQuery } from '../../../helpers';
import WalkIn from './WalkInBill.js';
import NormalBill from './NormalBill';
import VIPBill from './VIPBill';
import RefundBill from './RefundBill/index';

const breadcrumbItems = [
    { title: 'Uncle Bear', link: '#' },
    { title: 'Billing', link: '/billing' },
];

const Billing = () => {
    const [type, setType] = useState('refund');

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Billing" breadcrumbItems={breadcrumbItems} />
                    <Row className="form-group">
                        <Col xl={6} md={12}>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color={type === 'walk-in' ? 'primary' : 'light'}
                                    onClick={() => setType('walk-in')}
                                >
                                    Walk In
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'normal' ? 'primary' : 'light'}
                                    onClick={() => setType('normal')}
                                >
                                    Normal Bill
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'vip' ? 'primary' : 'light'}
                                    onClick={() => setType('vip')}
                                >
                                    VIP Bill
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'refund' ? 'primary' : 'light'}
                                    onClick={() => setType('refund')}
                                >
                                    Refund
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <When condition={type === 'walk-in'}>
                                <WalkIn />
                            </When>
                            <When condition={type === 'normal'}>
                                <NormalBill />
                            </When>
                            <When condition={type === 'vip'}>
                                <VIPBill />
                            </When>
                            <When condition={type === 'refund'}>
                                <RefundBill />
                            </When>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Billing;
