import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    UncontrolledAlert,
} from 'reactstrap';
import { useFormik } from 'formik';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { When } from 'react-if';
import Creatable from 'react-select/creatable';
import {
    setAddInventoryData,
    setAddInventoryVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import { quantity } from 'chartist';

const CreateAddInventory = () => {
    const state = useSelector((s) => s);
    const addInventoriesState = state.modals.addInventories;
    const dispatch = useDispatch();

    const productNameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const mutation = useMutation(({ payload, shop }) => post('/inventories', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-add-inventory-transactions');
            dispatch(setAddInventoryVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add inventory', err });
        },
    });

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setAddInventoryVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { item: '', quantity: '', shop: null },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        validate: (values) => {
            let errors = {};
            if (values.quantity === 0) {
                const msg = 'Quantity cannot be zero';
                errors.quantity = msg;
                alert.showAlert({ color: 'danger', heading: 'Unable to add inventory', err: { response: { data: { data: msg } }} });

            }
            return errors;
        },
        onSubmit: (values) => {
            const { type } = addInventoriesState.data;
            const quantity = type === 'add' ? values.quantity : -values.quantity;
            mutation.mutate({ payload: { ...values, quantity }, shop: values.shop?._id });
        },
    });

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!formik.values.shop) {
                    const { createdShop } = addInventoriesState.data;
                    if (!createdShop && data.docs.length) formik.setFieldValue('shop', data.docs[0]);
                    else if (createdShop)
                        formik.setFieldValue(
                            'shop',
                            data.docs.find((shop) => shop._id === createdShop._id)
                        );
                }
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to fetch shops', err });
            },
        }
    );

    const handleOpened = () => {
        productNameRef.current.focus();
        shops.refetch();

        if (addInventoriesState.data.item) formik.setFieldValue('item', addInventoriesState.data.item);
        if (addInventoriesState.data.quantity) formik.setFieldValue('quantity', addInventoriesState.data.quantity);
        if (addInventoriesState.data.description) formik.setFieldValue('description', addInventoriesState.data.description);

        if (addInventoriesState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === addInventoriesState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setAddInventoryData({}));
    };

    return (
        <Modal
            isOpen={addInventoriesState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{addInventoriesState.data._id ? 'Edit' : addInventoriesState.data.type === 'add' ? 'Add' : 'Consume'} Inventory</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Item</Label>
                    <Input
                        innerRef={productNameRef}
                        type="text"
                        name="item"
                        value={formik.values.item}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Quantity</Label>
                    <Input type="number" name="quantity" value={formik.values.quantity} onChange={formik.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        type="textarea"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        className="tw-resize-y tw-min-h-[80px] tw-max-h-[120px]"
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Shop</Label>
                    <Creatable
                        isDisabled={shops.isError || shops.isLoading}
                        isLoading={shops.isLoading}
                        placeholder="Select Shop"
                        options={shops.data?.docs.map((doc) => ({ label: doc.address, value: doc }))}
                        value={{ label: formik.values.shop?.address, value: formik.values.shop }}
                        onChange={(shop) => formik.setFieldValue('shop', shop.value)}
                        onCreateOption={(address) => {
                            batch(() => {
                                dispatch(setShopsData({ address }));
                                dispatch(setShopsVisibility(true));
                            });
                        }}
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    <Button color="light" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={formik.handleSubmit}>
                        Save
                    </Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    );
};

export default CreateAddInventory;
