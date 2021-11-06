import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AppRoute = ({ component: Component, layout: Layout, isAuthProtected, ...rest }) => {
    const user = useSelector((s) => s.globals.user);
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthProtected && !user) {
                    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
                }

                return (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                );
            }}
        />
    );
};

export default AppRoute;
