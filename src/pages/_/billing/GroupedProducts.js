import React from 'react';
import { Else, If, Then, When } from 'react-if';
import { useSelector } from 'react-redux';
import { Button, Card, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import CardBody from 'reactstrap/lib/CardBody';
import OwlCarousel from 'react-owl-carousel';
import cls from 'classnames';
import FormatNumber from '../../../components/Common/FormatNumber';
import { get, useQuery } from '../../../helpers';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const settings = {
    autoWidth: true,
    dots: false,
    margin: 15,
};

const ProductCard = ({ onClick, name, salePrice, color }) => (
    <div onClick={onClick}>
        <Card
            className="mb-0 tw-cursor-pointer hover:tw-bg-gray-200 tw-transition tw-mr-2 tw-w-[200px] tw-mr-0 tw-min-h-[129px]"
            style={{ backgroundColor: color }}
        >
            <CardBody>
                <h3 className="tw-text-black tw-font-bold">{name}</h3>
                <p className="mb-0 tw-text-black tw-font-bold">
                    <FormatNumber number={salePrice} />
                </p>
            </CardBody>
        </Card>
    </div>
);

const GroupedProducts = ({ onAdd }) => {
    const shop = useSelector((s) => s.globals.shop);
    const products = useQuery(['grouped-products', shop], () => get('/products/groups', { sort: { createdAt: -1 } }));

    return (
        <div className="tw-max-h-[655px] tw-bg-gray-200 tw-overflow-y-auto">
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
                                className={cls('min-w-full tw-p-4', { 'tw-pb-0': i1 < products.data?.length - 1 })}
                                // style={{ backgroundColor: productGroup.group.color }}
                                key={`grouped-product-${i1}`}
                            >
                                <OwlCarousel {...settings}>
                                    {productGroup.products.map((product, i2) => (
                                        <ProductCard
                                            color={productGroup.group.color}
                                            key={`product-${i2}`}
                                            onClick={() => onAdd(product)}
                                            {...product}
                                        />
                                    ))}
                                </OwlCarousel>
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
