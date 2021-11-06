import React, { Component } from 'react';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';

// Import Routes
import { QueryClientProvider, QueryClient } from 'react-query';
import { authProtectedRoutes, publicRoutes } from './routes';
import AppRoute from './routes/route';

// layouts
import VerticalLayout from './components/VerticalLayout';
import HorizontalLayout from './components/HorizontalLayout';
import NonAuthLayout from './components/NonAuthLayout';

// Import scss
import './assets/app.css';
import './theme.scss';
import './assets/react-datepicker.css';

// Fake backend
import fakeBackend from './helpers/AuthType/fakeBackend';
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
// Activating fake backend
fakeBackend();

const queryClient = new QueryClient();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getLayout = this.getLayout.bind(this);
    }

    /**
     * Returns the layout
     */
    getLayout = () => {
        let layoutCls = VerticalLayout;

        switch (this.props.layout.layoutType) {
            case 'horizontal':
                layoutCls = HorizontalLayout;
                break;
            default:
                layoutCls = VerticalLayout;
                break;
        }
        return layoutCls;
    };

    render() {
        const Layout = this.getLayout();

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
                                layout={Layout}
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

const mapStateToProps = (state) => ({
    layout: state.Layout,
});

export default connect(mapStateToProps, null)(App);
