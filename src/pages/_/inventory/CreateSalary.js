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
    setEmployeesData,
    setEmployeesVisibility,
    setSalariesData,
    setSalariesVisibility,
    setShopsData,
    setShopsVisibility,
} from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch, get } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateSalary = () => {
    const state = useSelector((s) => s);
    const salariesState = state.modals.salaries;
    const dispatch = useDispatch();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation(({ payload, shop }) => post('/salaries', payload, {}, { shop }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-salaries');
            dispatch(setSalariesVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add salary', err });
        },
    });

    const patchMutation = useMutation(
        ({ payload, shop }) => patch(`/salaries/id/${salariesState.data._id}`, payload, {}, { shop }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries('all-salaries');
                dispatch(setSalariesVisibility(false));
            },
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to edit salary', err });
            },
        }
    );

    const mutation = useMemo(
        () => (salariesState.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, salariesState.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setSalariesVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { employee: '', amount: '', description: '', shop: null },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate({
                payload: { employeeId: values.employee?._id, amount: values.amount, description: values.description },
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
                    const { createdShop } = salariesState.data;
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

    const employees = useQuery(
        ['all-employees', '', state.globals.shop],
        () => get('/employees', { page: 1, limit: 100000, sort: { name: 1 }, search: '' }),
        {
            enabled: false,
            onError: (err) => {
                alert.showAlert({ color: 'danger', heading: 'Unable to fetch shops', err });
            },
        }
    );

    const handleOpened = () => {
        shops.refetch();
        employees.refetch();

        if (salariesState.data.employeeId?.name) formik.setFieldValue('employee', salariesState.data.employeeId);
        if (salariesState.data.amount) formik.setFieldValue('amount', salariesState.data.amount);
        if (salariesState.data.description) formik.setFieldValue('description', salariesState.data.description);

        if (salariesState.data.createdShop && shops.data) {
            const shop = shops.data.docs.find((s) => s._id === salariesState.data.createdShop._id);
            if (shop) formik.setFieldValue('shop', shop);
        } else if (state.globals.shop) formik.setFieldValue('shop', state.globals.shop);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setSalariesData({}));
    };

    return (
        <Modal isOpen={salariesState.visible} toggle={toggle} onOpened={handleOpened} onClosed={handleClosed} centered>
            <When condition={mutation.isLoading || shops.isLoading || employees.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{salariesState.data._id ? 'Edit' : 'Add'} Salary</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Employee</Label>
                    <Creatable
                        isDisabled={employees.isError || employees.isLoading}
                        isLoading={employees.isLoading}
                        placeholder="Select Employee"
                        options={employees.data?.docs.map((doc) => ({ label: doc.name, value: doc }))}
                        value={{ label: formik.values.employee?.name, value: formik.values.employee }}
                        onChange={(employee) => {
                            formik.setFieldValue('employee', employee.value);
                            formik.setFieldValue('amount', employee.value.salary);
                        }}
                        onCreateOption={(name) => {
                            batch(() => {
                                dispatch(setEmployeesData({ name }));
                                dispatch(setEmployeesVisibility(true));
                            });
                        }}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Salary</Label>
                    <Input type="number" name="amount" value={formik.values.amount} onChange={formik.handleChange} />
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
                {/* <FormGroup className="form-required">
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
                </FormGroup> */}
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

export default CreateSalary;
