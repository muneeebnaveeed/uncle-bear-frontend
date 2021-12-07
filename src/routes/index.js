import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = React.lazy(() => import('../pages/Authentication/Login'));
const Logout = React.lazy(() => import('../pages/Authentication/Logout'));
const Register = React.lazy(() => import('../pages/Authentication/Register'));

const Audit = React.lazy(() => import('../pages/_/audit'));
const Customers = React.lazy(() => import('../pages/_/customers'));
const Shops = React.lazy(() => import('../pages/_/shops'));
const Employees = React.lazy(() => import('../pages/_/employees'));
const Expenses = React.lazy(() => import('../pages/_/expenses'));
const Products = React.lazy(() => import('../pages/_/products'));
const Inventory = React.lazy(() => import('../pages/_/inventory'));
const Billing = React.lazy(() => import('../pages/_/billing'));
const Users = React.lazy(() => import('../pages/_/users'));

const authProtectedRoutes = [
    // chat
    { path: '/audit', component: Audit },

    { path: '/customers', component: Customers },
    { path: '/shops', component: Shops },
    { path: '/employees', component: Employees },
    { path: '/expenses', component: Expenses },
    { path: '/products', component: Products },
    { path: '/users', component: Users },

    { path: '/inventory', component: Inventory },
    { path: '/billing', component: Billing },

    // this route should be at the end of all other routes
    { path: '/', exact: true, component: () => <Redirect to="/billing" /> },
];

const publicRoutes = [
    { path: '/logout', component: Logout },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
];

export { authProtectedRoutes, publicRoutes };
