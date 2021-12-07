import React, { Component, useEffect } from 'react';

import { Row, Col, Input, Button, Alert, Container, Label, FormGroup } from 'reactstrap';

// Redux
import { useHistory } from 'react-router-dom';
// import images
import { AiOutlineLogin } from 'react-icons/ai';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { When } from 'react-if';
import useAlert from '../../components/Common/useAlert';
import { get, post } from '../../helpers/server';
import { setUser } from '../../store/globals/actions';

const Register = () => {
    const history = useHistory();
    const handleLogin = () => history.push('/login');
    const alert = useAlert();

    const registerMutation = useMutation((payload) => post('/auth/register', payload), {
        onSuccess: () => {
            alert.showAlert({ color: 'success', heading: 'Access requested successfully' });
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to login', err });
        },
    });

    const formik = useFormik({
        initialValues: { name: '', password: '', passwordConfirm: '' },
        validate: () => ({}),
        onSubmit: (values) => {
            registerMutation.mutate(values);
        },
    });

    return (
        <>
            <div className="tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden ">
                <div className="tw-bg-gray-200 tw-p-4 tw-w-[277px] tw-relative">
                    <When condition={registerMutation.isLoading}>
                        <div className="tw-w-full tw-h-full tw-bg-white tw-opacity-50 tw-absolute tw-top-0 tw-left-0" />
                    </When>
                    <h1 className="tw-text-xl tw-font-bold">Request Access</h1>
                    <FormGroup className="form-required">
                        <Label>Username</Label>
                        <Input
                            autoComplete="none"
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                    <FormGroup className="form-required">
                        <Label>Password</Label>
                        <Input
                            autoComplete="none"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                    <FormGroup className="form-required">
                        <Label>Confirm Password</Label>
                        <Input
                            autoComplete="none"
                            type="password"
                            name="passwordConfirm"
                            value={formik.values.passwordConfirm}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                    <Button
                        color="primary"
                        className="tw-flex tw-items-center tw-justify-center tw-gap-2"
                        block
                        onClick={formik.handleSubmit}
                    >
                        <AiOutlineLogin /> {registerMutation.isLoading ? 'Requesting...' : 'Request'}
                    </Button>
                    <Button color="link" block onClick={handleLogin}>
                        I already have an access
                    </Button>
                </div>
                <div className="tw-p-4">{alert.renderAlert()}</div>
            </div>
        </>
    );
};

export default Register;
