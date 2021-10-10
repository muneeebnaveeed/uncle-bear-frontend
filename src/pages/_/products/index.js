import React, { useState } from 'react';
import {
    AiFillCaretDown,
    AiFillCaretUp,
    AiFillDelete,
    AiFillEdit,
    AiFillPlusCircle,
    AiOutlinePlus,
} from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import {
    Button,
    ButtonGroup,
    ButtonToggle,
    Card,
    CardBody,
    Col,
    Collapse,
    Container,
    Input,
    ListGroup,
    ListGroupItem,
    Row,
    Table,
} from 'reactstrap';

import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { setProductGroupsVisibility } from '../../../store/actions';
import ManageProductGroups from './ManageProductGroups';
import ManageProducts from './ManageProducts';

const breadcrumbItems = [
    { title: 'Manage', link: '#' },
    { title: 'Products', link: '/products' },
];

const Products = () => {
    const dispatch = useDispatch();
    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Mange Product Groups" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xl={12}>
                            <ManageProductGroups />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0">Manage Products</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <ManageProducts />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Products;
