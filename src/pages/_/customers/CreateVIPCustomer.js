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
    setVipCustomersVisibility,
    setVipCustomersData,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateVIPCustomer = () => {
    const state = useSelector((s) => s);
    const vipCustomersState = state.modals.vipCustomers;
    const dispatch = useDispatch();

    const nameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/vip-customers', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-vip-customers');
            dispatch(setVipCustomersVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add VIP customer', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/vip-customers/id/${vipCustomersState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-vip-customers');
                dispatch(setVipCustomersVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit VIP customer', err });
            },
        }
    );

    const mutation = useMemo(
        () => (vipCustomersState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, vipCustomersState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setVipCustomersVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { name: '', phone: '', balance: '', shop: null },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate({ payload: values, shop: values.shop?._id });
        },
    });

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!formik.values.shop) {
                    const { createdShop } = vipCustomersState;
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
        nameRef.current.focus();
        shops.refetch();

        if (vipCustomersState.data.name) formik.setFieldValue('name', vipCustomersState.data.name);
        if (vipCustomersState.data.phone) formik.setFieldValue('phone', vipCustomersState.data.phone);
        if (vipCustomersState.data.balance) formik.setFieldValue('balance', vipCustomersState.data.balance);

        if (vipCustomersState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === vipCustomersState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setVipCustomersData({}));
    };

    return (
        <Modal
            isOpen={vipCustomersState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{vipCustomersState.data._id ? 'Edit' : 'Add'} VIP Customer</ModalHeader>
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
                    <Label>Phone</Label>
                    <Input type="number" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Balance</Label>
                    <Input type="number" name="balance" value={formik.values.balance} onChange={formik.handleChange} />
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

export default CreateVIPCustomer;
