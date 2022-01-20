import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
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
import ReactDatePicker from 'react-datepicker';
import { SketchPicker } from 'react-color';
import ColorPicker from '@vtaits/react-color-picker';
import Creatable from 'react-select/creatable';
import {
    setProductGroupsData,
    setProductGroupsVisibility,
    setProductsData,
    setProductsVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import FormatNumber from '../../../components/Common/FormatNumber';

const CreateProduct = () => {
    const state = useSelector((s) => s);
    const productsState = state.modals.products;

    const dispatch = useDispatch();

    const nameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/products', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-products');
            dispatch(setProductsVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add product', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/products/id/${productsState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-products');
                dispatch(setProductsVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit product', err });
            },
        }
    );

    const mutation = useMemo(
        () => (productsState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, productsState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setProductsVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: {
            name: '',
            salePrice: '',
            costPrice: '',
            description: '',
            registeredGroupId: null,
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate({
                payload: { ...values, registeredGroupId: values.registeredGroupId?._id },
                shop: values.shop?._id,
            });
        },
    });

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!formik.values.shop) {
                    const { createdShop } = productsState.data;
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

    const groups = useQuery(
        ['all-product-groups', state.globals.shop],
        () => get('/product-groups', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to fetch product groups', err });
            },
        }
    );

    const handleOpened = () => {
        nameRef.current.focus();
        shops.refetch();
        groups.refetch();

        if (productsState.data.name) formik.setFieldValue('name', productsState.data.name);
        if (productsState.data.costPrice) formik.setFieldValue('costPrice', productsState.data.costPrice);
        if (productsState.data.salePrice) formik.setFieldValue('salePrice', productsState.data.salePrice);
        if (productsState.data.registeredGroupId)
            formik.setFieldValue('registeredGroupId', productsState.data.registeredGroupId);
        if (productsState.data.description) formik.setFieldValue('description', productsState.data.description);

        if (productsState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === productsState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setProductsData({}));
    };

    return (
        <Modal isOpen={productsState.visible} toggle={toggle} onOpened={handleOpened} onClosed={handleClosed} centered>
            <When condition={mutation.isLoading || shops.isLoading || groups.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{productsState.data._id ? 'Edit' : 'Add'} Product</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Name</Label>
                    <Input
                        innerRef={nameRef}
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Cost Price</Label>
                    <Input
                        type="number"
                        name="costPrice"
                        value={formik.values.costPrice}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Sale Price</Label>
                    <Input
                        type="number"
                        name="salePrice"
                        value={formik.values.salePrice}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Group</Label>
                    <Creatable
                        isDisabled={groups.isError || groups.isLoading}
                        isLoading={groups.isLoading}
                        placeholder="Select Group"
                        options={groups.data?.docs.map((doc) => ({ label: doc.name, value: doc }))}
                        value={{ label: formik.values.registeredGroupId?.name, value: formik.values.registeredGroupId }}
                        onChange={(group) => {
                            formik.setFieldValue('registeredGroupId', group.value);
                        }}
                        onCreateOption={(name) => {
                            batch(() => {
                                dispatch(setProductGroupsData({ name }));
                                dispatch(setProductGroupsVisibility(true));
                            });
                        }}
                    />
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
                {state.globals.user?.role === 'ADMINISTRATOR' && (
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
                )}
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

export default CreateProduct;
