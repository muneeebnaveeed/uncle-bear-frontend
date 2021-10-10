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
    setNormalCustomersVisibility,
    setNormalCustomersData,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateNormalCustomer = () => {
    const state = useSelector((s) => s);
    const normalCustomersState = state.modals.normalCustomers;
    const dispatch = useDispatch();

    const addressRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/normal-customers', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-normal-customers');
            dispatch(setNormalCustomersVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add normal customer', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/normal-customers/id/${normalCustomersState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-normal-customers');
                dispatch(setNormalCustomersVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit normal customer', err });
            },
        }
    );

    const mutation = useMemo(
        () => (normalCustomersState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, normalCustomersState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setNormalCustomersVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { name: '', phone: '', shop: null },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate({ payload: values, shop: values.shop?._id });
        },
    });

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { address: 1 }, search: '' }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!formik.values.shop) {
                    const { createdShop } = normalCustomersState.data;
                    if (createdShop)
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
        addressRef.current.focus();
        shops.refetch();

        if (normalCustomersState.data.name) formik.setFieldValue('name', normalCustomersState.data.name);
        if (normalCustomersState.data.phone) formik.setFieldValue('phone', normalCustomersState.data.phone);
        if (normalCustomersState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === normalCustomersState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setNormalCustomersData({}));
    };

    return (
        <Modal
            isOpen={normalCustomersState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{normalCustomersState.data._id ? 'Edit' : 'Add'} Normal Customer</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Name</Label>
                    <Input
                        innerRef={addressRef}
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Phone</Label>
                    <Input type="number" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
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

export default CreateNormalCustomer;
