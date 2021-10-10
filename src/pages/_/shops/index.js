import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Col, Container, Input, Row, Table } from 'reactstrap';

// Import Breadcrumb
import { If, Then, Else } from 'react-if';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import ManageShops from './ManageShops';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Shops', link: '/shops' },
];

const Shops = () => {
    const [type, setType] = useState('normal');

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Shops" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xs={12}>
                            <ManageShops />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Shops;
