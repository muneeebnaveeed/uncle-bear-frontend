import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { get, useQuery } from '../../helpers';
import { setShop } from '../../store/actions';

const ShopSelect = () => {
    const shop = useSelector((state) => state.globals.shop);
    const dispatch = useDispatch();

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { address: 1 }, search: '' }),
        {
            onSuccess: (data) => {
                if (!shop && data.docs.length) dispatch(setShop(data.docs[0]));
            },
        }
    );

    return (
        <>
            <CreatableSelect
                className="tw-w-full"
                isLoading={shops.isLoading}
                isDisabled={shops.isLoading}
                options={shops.data?.docs.map((doc) => ({ label: doc.address, value: doc }))}
                value={shop ? { label: shop.address, value: shop } : {}}
                onChange={(selectedShop) => dispatch(setShop(selectedShop.value))}
            />
        </>
    );
};

export default ShopSelect;
