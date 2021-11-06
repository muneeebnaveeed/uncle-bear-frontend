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
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import {
    setAcceptUserData,
    setAcceptUserVisibility,
    setProductGroupsData,
    setProductGroupsVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get, put } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import FormatNumber from '../../../components/Common/FormatNumber';

const roles = [
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Administrator', value: 'ADMINISTRATOR' },
];

const AcceptUser = () => {
    const state = useSelector((s) => s);
    const acceptUserState = state.modals.acceptUser;
    const dispatch = useDispatch();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const mutation = useMutation(
        ({ role, shop }) => put(`/auth/confirm/${acceptUserState.data._id}/${role}`, null, {}, { shop }),
        {
            onSuccess: async () => {
                // await queryClient.invalidateQueries('all-product-groups', 'all-products');
                queryClient.invalidateQueries('all-users');
                dispatch(setAcceptUserVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to accept user', err });
            },
        }
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setAcceptUserVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: {
            role: roles[0],
            shop: null,
        },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate({ role: values.role?.value, shop: values.shop?._id });
        },
    });

    const shops = useQuery(
        ['all-shops', ''],
        () => get('/shops', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (!formik.values.shop) {
                    const { createdShop } = acceptUserState.data;
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
        shops.refetch();

        if (acceptUserState.data.role) formik.setFieldValue('role', acceptUserState.data.role);

        if (acceptUserState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === acceptUserState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setAcceptUserData({}));
    };

    return (
        <Modal
            isOpen={acceptUserState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>Accept User</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Role</Label>
                    <Select
                        placeholder="Select Role"
                        options={roles}
                        value={formik.values.role}
                        onChange={(r) => formik.setFieldValue('role', r)}
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

export default AcceptUser;
