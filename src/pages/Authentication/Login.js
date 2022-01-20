import React, { Component, useEffect } from 'react';

import { Row, Col, Input, Button, Alert, Container, Label, FormGroup } from 'reactstrap';

// Redux
import { useHistory } from 'react-router-dom';
// import images
import { AiOutlineLogin } from 'react-icons/ai';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { batch, useDispatch, useSelector } from 'react-redux';
import { When } from 'react-if';
import _ from 'lodash';
import useAlert from '../../components/Common/useAlert';
import { get, post } from '../../helpers/server';
import { setUser, setShop } from '../../store/globals/actions';

const Login = () => {
    const history = useHistory();
    const handleSignUp = () => {
        history.push('/register');
        console.log(history);
    };
    const alert = useAlert();
    const user = useSelector((s) => s.globals.user);
    const dispatch = useDispatch();

    const loginMutation = useMutation((payload) => post('/auth/login', payload), {
        onSuccess: (data) => {
            console.log(data);
            localStorage.setItem('authUser', data.token);
            batch(() => {
                dispatch(setUser(_.omit(data, ['token'])));
                dispatch(setShop(data.shop));
            });
            history.push('/');
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to login', err });
        },
    });

    const decodeMutation = useMutation((token) => get(`/auth/decode/${token}`), {
        onSuccess: (data) => {
            batch(() => {
                dispatch(setUser(data));
                dispatch(setShop(data.shop));
            });
            history.push('/');
        },
        onError: (err) => {
            alert.showAlert({ heading: 'Unable to decode token', err });
        },
    });

    const formik = useFormik({
        initialValues: { name: '', password: '' },
        validate: () => ({}),
        onSubmit: (values) => {
            loginMutation.mutate(values);
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('authUser');
        if (token && !user) decodeMutation.mutate(token);
    }, []);

    return (
        <>
            <div className="tw-w-screen tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden ">
                <div className="tw-bg-gray-200 tw-p-4 tw-w-[277px] tw-relative">
                    <When condition={loginMutation.isLoading || decodeMutation.isLoading}>
                        <div className="tw-w-full tw-h-full tw-bg-white tw-opacity-50 tw-absolute tw-top-0 tw-left-0" />
                    </When>
                    <h1 className="tw-text-xl tw-font-bold">Please Login</h1>
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
                    <Button
                        color="primary"
                        className="tw-flex tw-items-center tw-justify-center tw-gap-2"
                        block
                        onClick={formik.handleSubmit}
                    >
                        <AiOutlineLogin />{' '}
                        {loginMutation.isLoading || decodeMutation.isLoading ? 'Logging In...' : 'Login'}
                    </Button>
                    <Button color="link" block onClick={handleSignUp}>
                        Sign Up
                    </Button>
                </div>
                <div className="tw-p-4">{alert.renderAlert()}</div>
            </div>
        </>
    );
};

export default Login;
