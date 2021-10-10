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
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import FormatNumber from '../../../components/Common/FormatNumber';

const CreateProductGroup = () => {
    const state = useSelector((s) => s);
    const productGroupsState = state.modals.productGroups;
    const dispatch = useDispatch();

    const nameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const [showColorPicker, setShowColorPicker] = useState(false);

    const postMutation = useMutation(({ payload, shop }) => post('/product-groups', payload, {}, { shop }), {
        onSuccess: async () => {
            // await queryClient.invalidateQueries('all-product-groups', 'all-products');
            await Promise.all([
                queryClient.invalidateQueries('all-product-groups'),
                queryClient.invalidateQueries('all-products'),
            ]);
            dispatch(setProductGroupsVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add product group', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/product-groups/id/${productGroupsState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                // await queryClient.invalidateQueries('all-product-groups', 'all-products');
                await Promise.all([
                    queryClient.invalidateQueries('all-product-groups'),
                    queryClient.invalidateQueries('all-products'),
                ]);

                dispatch(setProductGroupsVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit product group', err });
            },
        }
    );

    const mutation = useMemo(
        () => (productGroupsState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, productGroupsState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setProductGroupsVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: {
            name: '',
            color: '#000000',
            description: '',
        },
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
                    const { createdShop } = productGroupsState.data;
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

        if (productGroupsState.data.name) formik.setFieldValue('name', productGroupsState.data.name);
        if (productGroupsState.data.color) formik.setFieldValue('color', productGroupsState.data.color);
        if (productGroupsState.data.description)
            formik.setFieldValue('description', productGroupsState.data.description);

        if (productGroupsState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === productGroupsState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setProductGroupsData({}));
    };

    const handleChangeColor = (color) => {
        formik.setFieldValue('color', color);
        // console.log(color.rgb)
    };

    return (
        <Modal
            isOpen={productGroupsState.visible}
            toggle={toggle}
            onOpened={handleOpened}
            onClosed={handleClosed}
            centered
        >
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{productGroupsState.data._id ? 'Edit' : 'Add'} Product Group</ModalHeader>
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
                <FormGroup className="m-b-0 form-required">
                    <Label>Color</Label>

                    <InputGroup
                        className="colorpicker-default tw-cursor-pointer"
                        title="Using format option"
                        onClick={() => setShowColorPicker((prev) => !prev)}
                    >
                        <Input readOnly value={formik.values.color} type="text" className="form-control input-lg" />
                        <InputGroupAddon addonType="append">
                            <span className="input-group-text colorpicker-input-addon">
                                <i
                                    style={{
                                        height: '16px',
                                        width: '16px',
                                        background: formik.values.color,
                                    }}
                                />
                            </span>
                        </InputGroupAddon>
                    </InputGroup>
                    <When condition={showColorPicker}>
                        <ColorPicker
                            saturationHeight={100}
                            saturationWidth={100}
                            value={formik.values.color}
                            onDrag={handleChangeColor}
                        />
                    </When>
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

export default CreateProductGroup;
