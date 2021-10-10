import React from 'react';
import { Else, If, Then, When } from 'react-if';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import { Button, Card, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import CardBody from 'reactstrap/lib/CardBody';
import FormatNumber from '../../../components/Common/FormatNumber';
import { get, useQuery } from '../../../helpers';

const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    variableWidth: true,
    adaptiveHeight: true,
    infinite: false,
    centerPadding: '0',
};

const ProductCard = ({ onClick, name, salePrice }) => (
    <div onClick={onClick}>
        <Card className="mb-0 tw-cursor-pointer hover:tw-bg-gray-200 tw-transition tw-mr-2">
            <CardBody>
                <h3>{name}</h3>
                <p className="mb-0">
                    <FormatNumber number={salePrice} />
                </p>
            </CardBody>
        </Card>
    </div>
);

const GroupedProducts = ({ onAdd }) => {
    const shop = useSelector((s) => s.globals.shop);
    const products = useQuery(['grouped-products', shop], () => get('/products/groups'));

    return (
        <div className="tw-max-h-[720px] tw-bg-gray-200 tw-overflow-y-auto">
            <When condition={products.isLoading}>
                <ListGroup>
                    <ListGroupItem>Loading...</ListGroupItem>
                </ListGroup>
            </When>
            <When condition={products.isError}>
                <ListGroup>
                    <ListGroupItem className="tw-flex tw-items-center tw-gap-2">
                        <p className="mb-0">Unable to load products</p>
                        <Button color="danger">Retry</Button>
                    </ListGroupItem>
                </ListGroup>
            </When>
            <When condition={products.isSuccess}>
                <If condition={products.data?.length}>
                    <Then>
                        {products.data?.map((productGroup, i1) => (
                            <div
                                className="min-w-full tw-p-4"
                                style={{ backgroundColor: productGroup.group.color }}
                                key={`grouped-product-${i1}`}
                            >
                                <Slider {...settings}>
                                    {productGroup.products.map((product, i2) => (
                                        <ProductCard
                                            key={`product-${i2}`}
                                            onClick={() => onAdd(product)}
                                            {...product}
                                        />
                                    ))}
                                </Slider>
                            </div>
                        ))}
                    </Then>
                    <Else>
                        <ListGroup>
                            <ListGroupItem>No products created</ListGroupItem>
                        </ListGroup>
                    </Else>
                </If>
            </When>
        </div>
    );
};

export default GroupedProducts;
