import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageEmployees from './ManageEmployees';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Employees', link: '/employees' },
];

const Employees = () => (
    <>
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Mange Employees" breadcrumbItems={breadcrumbItems} />
                <Row>
                    <Col xs={12}>
                        <ManageEmployees />
                    </Col>
                </Row>
            </Container>
        </div>
    </>
);

export default Employees;
