import React, { Component } from 'react';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';

// Import Routes
import { QueryClientProvider, QueryClient } from 'react-query';
import { authProtectedRoutes, publicRoutes } from './routes';
import AppRoute from './routes/route';

// layouts
import VerticalLayout from './components/VerticalLayout';
import NonAuthLayout from './components/NonAuthLayout';

// Import scss
import './assets/app.css';
import './theme.scss';
import './assets/react-datepicker.css';
import './assets/scss/custom/print.css';

import CreateNormalCustomer from './pages/_/customers/CreateNormalCustomer';
import CreateShop from './pages/_/shops/CreateShop';
import CreateVIPCustomer from './pages/_/customers/CreateVIPCustomer';
import CreateEmployee from './pages/_/employees/CreateEmployee';
import CreateMaterialExpense from './pages/_/expenses/CreateMaterialExpense';
import CreateShopExpense from './pages/_/expenses/CreateShopExpense';
import CreateProductGroup from './pages/_/products/CreateProductGroup';
import CreateSalary from './pages/_/expenses/CreateSalary';
import CreateProduct from './pages/_/products/CreateProduct';
import CreateAddInventory from './pages/_/inventory/CreateAddInventory';
import AcceptUser from './pages/_/users/AcceptUser';

const queryClient = new QueryClient();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <QueryClientProvider client={queryClient}>
                <CreateShop />
                <CreateNormalCustomer />
                <CreateVIPCustomer />
                <CreateEmployee />
                <CreateMaterialExpense />
                <CreateShopExpense />
                <CreateProductGroup />
                <CreateSalary />
                <CreateAddInventory />
                <AcceptUser />

                <CreateProduct />
                <Router>
                    <Switch>
                        {publicRoutes.map((route, idx) => (
                            <AppRoute
                                path={route.path}
                                layout={NonAuthLayout}
                                component={route.component}
                                key={idx}
                                isAuthProtected={false}
                            />
                        ))}

                        {authProtectedRoutes.map((route, idx) => (
                            <AppRoute
                                path={route.path}
                                layout={VerticalLayout}
                                component={route.component}
                                key={idx}
                                isAuthProtected
                            />
                        ))}
                    </Switch>
                </Router>
            </QueryClientProvider>
        );
    }
}

export default App;
