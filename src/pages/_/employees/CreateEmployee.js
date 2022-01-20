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
import ReactDatePicker from 'react-datepicker';
import Creatable from 'react-select/creatable';
import { setEmployeesData, setEmployeesVisibility, setShopsData, setShopsVisibility } from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';
import FormatNumber from '../../../components/Common/FormatNumber';

const CreateEmployee = () => {
    const state = useSelector((s) => s);
    const employeesState = state.modals.employees;
    const dispatch = useDispatch();

    const nameRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/employees', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-employees');
            dispatch(setEmployeesVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add employee', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/employees/id/${employeesState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-employees');
                dispatch(setEmployeesVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit employee', err });
            },
        }
    );

    const mutation = useMemo(
        () => (employeesState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, employeesState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setEmployeesVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            idcard: '',
            email: '',
            salary: '',
            shop: null,
            description: '',
            hireDate: new Date(),
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
                    const { createdShop } = employeesState.data;
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

        if (employeesState.data.name) formik.setFieldValue('name', employeesState.data.name);
        if (employeesState.data.phone) formik.setFieldValue('phone', employeesState.data.phone);
        if (employeesState.data.idcard) formik.setFieldValue('idcard', employeesState.data.idcard);
        if (employeesState.data.email) formik.setFieldValue('email', employeesState.data.email);
        if (employeesState.data.salary) formik.setFieldValue('salary', employeesState.data.salary);
        if (employeesState.data.description) formik.setFieldValue('description', employeesState.data.description);
        if (employeesState.data.hireDate) formik.setFieldValue('hireDate', new Date(employeesState.data.hireDate));

        if (employeesState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === employeesState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setEmployeesData({}));
    };

    return (
        <Modal isOpen={employeesState.visible} toggle={toggle} onOpened={handleOpened} onClosed={handleClosed} centered>
            <When condition={mutation.isLoading || shops.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{employeesState.data._id ? 'Edit' : 'Add'} Employee</ModalHeader>
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
                    <Label>ID Card #</Label>
                    <Input type="number" name="idcard" value={formik.values.idcard} onChange={formik.handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    <Input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Salary</Label>
                    <Input type="number" name="salary" value={formik.values.salary} onChange={formik.handleChange} />
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
                <FormGroup>
                    <Label>Hiring Date</Label>
                    <ReactDatePicker
                        selected={formik.values.hireDate}
                        onChange={(date) => formik.setFieldValue('hireDate', date)}
                        dateFormat="dd MMM, yyyy"
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

export default CreateEmployee;
