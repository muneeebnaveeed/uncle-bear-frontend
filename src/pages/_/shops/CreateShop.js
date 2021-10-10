import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useMutation, useQueryClient } from 'react-query';
import { When } from 'react-if';
import { setShopsData, setShopsVisibility } from '../../../store/actions';
import SpinnerOverlay from '../../../components/Common/SpinnerOverlay';
import { post, patch } from '../../../helpers';
import useAlert from '../../../components/Common/useAlert';

const CreateShop = () => {
    const state = useSelector((s) => s.modals.shops);
    const dispatch = useDispatch();

    const addressRef = useRef();

    const queryClient = useQueryClient();
    const alert = useAlert();

    const postMutation = useMutation((payload) => post('/shops', payload), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-shops');
            dispatch(setShopsVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to add shop', err });
        },
    });

    const patchMutation = useMutation((payload) => patch(`/shops/id/${state.data._id}`, payload), {
        onSuccess: async () => {
            await queryClient.invalidateQueries('all-shops');
            dispatch(setShopsVisibility(false));
        },
        onError: (err) => {
            alert.showAlert({ color: 'danger', heading: 'Unable to edit shop', err });
        },
    });

    const mutation = useMemo(
        () => (state.data._id ? patchMutation : postMutation),
        [patchMutation, postMutation, state.data._id]
    );

    const toggle = useCallback(() => {
        if (!mutation.isLoading) dispatch(setShopsVisibility(false));
    }, [dispatch, mutation.isLoading]);

    const formik = useFormik({
        initialValues: { address: '', phone: '' },
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    const handleOpened = () => {
        addressRef.current.focus();

        if (state.data.address) formik.setFieldValue('address', state.data.address);
        if (state.data.phone) formik.setFieldValue('phone', state.data.phone);
    };

    const handleClosed = () => {
        formik.resetForm();
        dispatch(setShopsData({}));
    };

    return (
        <Modal isOpen={state.visible} toggle={toggle} onOpened={handleOpened} onClosed={handleClosed} centered>
            <When condition={mutation.isLoading}>
                <SpinnerOverlay />
            </When>

            <ModalHeader toggle={toggle}>{state.data._id ? 'Edit' : 'Add'} Shop</ModalHeader>
            <ModalBody>
                {alert.renderAlert()}
                <FormGroup className="form-required">
                    <Label>Address</Label>
                    <Input
                        innerRef={addressRef}
                        type="text"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <FormGroup className="form-required">
                    <Label>Phone</Label>
                    <Input type="number" name="phone" value={formik.values.phone} onChange={formik.handleChange} />
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

export default CreateShop;
