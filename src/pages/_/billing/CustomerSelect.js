import React from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import Creatable from 'react-select/creatable';
import { get, useQuery } from '../../../helpers';
import { setNormalCustomersData, setNormalCustomersVisibility } from '../../../store/actions';

const selectStyles = {
    menu: (provided) => {
        provided.minWidth = '300px';
        provided.width = '30%';
        return provided;
    },
    control: (provided) => {
        provided.minWidth = '300px';
        provided.width = '30%';
        return provided;
    },
};

const CustomerSelect = ({ type, onChange }) => {
    const shop = useSelector((s) => s.globals.shop);
    const dispatch = useDispatch();

    const customers = useQuery([`all-${type}-customers`, '', shop], () =>
        get(`/${type}-customers`, { page: 1, limit: 5, sort: { name: 1 }, search: '' })
    );

    const handleCreate = (name) => {
        batch(() => {
            dispatch(setNormalCustomersData({ name }));
            dispatch(setNormalCustomersVisibility(true));
        });
    };

    return (
        <Creatable
            onCreateOption={handleCreate}
            onChange={onChange}
            isLoading={customers.isLoading}
            isDisabled={customers.isLoading || customers.isError}
            styles={selectStyles}
            options={customers.data?.docs.map((d) => ({ label: d.name, value: d }))}
        />
    );
};

export default CustomerSelect;
