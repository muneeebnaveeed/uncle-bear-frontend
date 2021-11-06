import React, { Component, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
    const history = useHistory();

    useEffect(() => {
        localStorage.clear();
        history.replace('/');
    }, []);

    return <h1 className="tw-text-xl tw-font-bold tw-m-3">Logging out...</h1>;
};

export default Logout;
