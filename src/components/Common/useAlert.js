import React, { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'reactstrap';
import cls from 'classnames';
import getErrors from '../../helpers/getErrors';

const useAlert = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [color, setColor] = useState('danger');
    const [heading, setHeading] = useState('');
    const [errors, setErrors] = useState([]);

    const timeoutRef = useRef();

    useEffect(() => {
        timeoutRef.current = null;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const renderedErrors = useMemo(
        () =>
            errors.map((e, i, a) => (
                <p key={`alert-error-${e}`} className="mb-0">
                    {e}
                </p>
            )),
        [errors]
    );

    const renderAlert = useCallback(
        () => (
            <Alert color={color} isOpen={isVisible} toggle={() => setIsVisible(false)}>
                <p className="mb-0 tw-font-bold">{heading}</p>
                {renderedErrors}
            </Alert>
        ),
        [heading, isVisible, renderedErrors, color]
    );

    const showAlert = useCallback(({ color: c = 'danger', heading: h = '', err, duration = 3000, cb = null }) => {
        setIsVisible(true);
        setColor(c);
        setHeading(h);
        setErrors(err ? getErrors(err) : []);
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            if (cb) cb();

            timeoutRef.current = null;
        }, duration);
    }, []);

    const returns = useMemo(() => ({ renderAlert, showAlert }), [renderAlert, showAlert]);

    return returns;
};

export default useAlert;
