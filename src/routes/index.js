import React from 'react';
import { Redirect } from 'react-router-dom';

// Authentication related pages
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import Register from '../pages/Authentication/Register';

// Dashboard
import Dashboard from '../pages/Dashboard/index';

// Pages Component
import Audit from '../pages/_/audit';

import Customers from '../pages/_/customers';
import Shops from '../pages/_/shops';
import Employees from '../pages/_/employees';
import Expenses from '../pages/_/expenses';
import Products from '../pages/_/products';
import Inventory from '../pages/_/inventory';
import Billing from '../pages/_/billing';
import Users from '../pages/_/users';

const authProtectedRoutes = [
    // chat
    { path: '/audit', component: Audit },
    { path: '/dashboard', component: Dashboard },

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
