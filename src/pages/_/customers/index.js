import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else } from 'react-if';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageNormalCustomers from './ManageNormalCustomers';
import ManageVIPCustomers from './ManageVIPCustomers';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Customers', link: '/customers' },
];

const Customers = () => {
    const [type, setType] = useState('normal');

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Customers" breadcrumbItems={breadcrumbItems} />
                    <Row className="no-gutters form-group">
                        <Col xl={12}>
                            <ButtonGroup>
                                <Button
                                    size="lg"
                                    color={type === 'normal' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('normal')}
                                >
                                    Normal Customers
                                </Button>
                                <Button
                                    size="lg"
                                    color={type === 'VIP' ? 'primary' : 'light'}
                                    // className="tw-py-4"
                                    onClick={() => setType('VIP')}
                                >
                                    VIP Customers
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <If condition={type === 'normal'}>
                                <Then>
                                    <ManageNormalCustomers />
                                </Then>
                                <Else>
                                    <ManageVIPCustomers />
                                </Else>
                            </If>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Customers;
