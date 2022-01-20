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
    setShopExpensesData,
    setShopExpensesVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateShopExpense = () => {
    const state = useSelector((s) => s);
    const shopExpensesState = state.modals.shopExpenses;
    const dispatch = useDispatch();

    const expenseNameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/shop-expenses', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-shop-expenses');
            dispatch(setShopExpensesVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add shop expense', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/shop-expenses/id/${shopExpensesState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-shop-expenses');
                dispatch(setShopExpensesVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit shop expense', err });
            },
        }
    );

    const mutation = useMemo(
        () => (shopExpensesState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, shopExpensesState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setShopExpensesVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { expenseName: '', price: '', detail: '', shop: null },
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
                    const { createdShop } = shopExpensesState.data;
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
        expenseNameRef.current.focus();
        shops.refetch();

        if (shopExpensesState.data.expenseName) formik.setFieldValue('expenseName', shopExpensesState.data.expenseName);
        if (shopExpensesState.data.price) formik.setFieldValue('price', shopExpensesState.data.price);
        if (shopExpensesState.data.detail) formik.setFieldValue('detail', shopExpensesState.data.detail);

        if (shopExpensesState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === shopExpensesState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setShopExpensesData({}));
    };

    return (
        <Modal
            isOpen={shopExpensesState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{shopExpensesState.data._id ? 'Edit' : 'Add'} Shop Expense</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Expense</Label>
                    <Input
                        innerRef={expenseNameRef}
                        type="text"
                        name="expenseName"
                        value={formik.values.expenseName}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Price</Label>
                    <Input type="number" name="price" value={formik.values.price} onChange={formik.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        type="textarea"
                        name="detail"
                        value={formik.values.detail}
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

export default CreateShopExpense;
