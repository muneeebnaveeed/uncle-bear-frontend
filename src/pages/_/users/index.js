import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else } from 'react-if';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageUsers from './ManageUsers';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Users', link: '/users' },
];

const Users = () => {
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Users" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xs={12}>
                            <ManageUsers />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Users;
