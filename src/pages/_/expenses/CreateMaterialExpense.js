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
    setMaterialExpensesData,
    setMaterialExpensesVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateMaterialExpense = () => {
    const state = useSelector((s) => s);
    const materialExpensesState = state.modals.materialExpenses;
    const dispatch = useDispatch();

    const materialRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/raw-material-expenses', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-raw-material-expenses');
            dispatch(setMaterialExpensesVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add material expense', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) =>
            patch(`/raw-material-expenses/id/${materialExpensesState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-raw-material-expenses');
                dispatch(setMaterialExpensesVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit material expense', err });
            },
        }
    );

    const mutation = useMemo(
        () => (materialExpensesState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, materialExpensesState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setMaterialExpensesVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { product_bought: '', qty: '', price: '', detail: '', shop: null },
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
                    const { createdShop } = materialExpensesState.data;
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
        materialRef.current.focus();
        shops.refetch();

        if (materialExpensesState.data.product_bought)
            formik.setFieldValue('product_bought', materialExpensesState.data.product_bought);
        if (materialExpensesState.data.qty) formik.setFieldValue('qty', materialExpensesState.data.qty);
        if (materialExpensesState.data.price) formik.setFieldValue('price', materialExpensesState.data.price);
        if (materialExpensesState.data.detail) formik.setFieldValue('detail', materialExpensesState.data.detail);

        if (materialExpensesState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === materialExpensesState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setMaterialExpensesData({}));
    };

    return (
        <Modal
            isOpen={materialExpensesState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>
                {materialExpensesState.data._id ? 'Edit' : 'Add'} Material Expense
            </ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Material</Label>
                    <Input
                        innerRef={materialRef}
                        type="text"
                        name="product_bought"
                        value={formik.values.product_bought}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Quantity</Label>
                    <Input type="number" name="qty" value={formik.values.qty} onChange={formik.handleChange} />
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

export default CreateMaterialExpense;
