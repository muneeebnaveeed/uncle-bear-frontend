import React from 'react';
import { When } from 'react-if';
import { Button, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';

const BillTitle = ({ title, value }) => (
    <div className="page-title-box d-flex align-items-center tw-gap-2 pb-0 mb-3">
        <h4 className="mb-0">{title}</h4>
        {value}
    </div>
);

const FilteredBill = ({ _id, customer, type, products, onSelectBill, discount }) => (
    <Card>
        <CardBody>
            <When condition={type !== 'WALKIN'}>
                <BillTitle title="CUSTOMER" value={customer} />
            </When>
            <BillTitle title="TYPE" value={type} />
            <BillTitle title="DISCOUNT" value={`${discount}%`} />

            <ListGroup className="tw-mb-4">
                {products.map((e, index) => (
                    <ListGroupItem key={`bill-product-${index}`}>
                        <p className="tw-mb-0">{`${e.qty}x ${e.name}`}</p>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <Button color="primary" onClick={() => onSelectBill({ products, discount, _id })} block>
                Select Bill
            </Button>
        </CardBody>
    </Card>
);

export default FilteredBill;
