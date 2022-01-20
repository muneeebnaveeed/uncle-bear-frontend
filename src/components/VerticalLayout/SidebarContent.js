import React, { Component } from 'react';

// MetisMenu
import MetisMenu from 'metismenujs';
import { withRouter, Link } from 'react-router-dom';

import { connect } from 'react-redux';
import {
    changeLayout,
    changeLayoutWidth,
    changeSidebarTheme,
    changeSidebarType,
    changePreloader,
} from '../../store/actions';

class SidebarContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.initMenu();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.type !== prevProps.type) {
                this.initMenu();
            }
        }
    }

    activateParentDropdown = (item) => {
        item.classList.add('active');
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add('mm-active');
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add('mm-show');

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add('mm-active'); // li
                    parent3.childNodes[0].classList.add('mm-active'); // a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add('mm-active');
                    }
                }
            }
            return false;
        }
        return false;
    };

    initMenu() {
        new MetisMenu('#side-menu');

        let matchingMenuItem = null;
        const ul = document.getElementById('side-menu');
        const items = ul.getElementsByTagName('a');
        for (let i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }

    render() {
        return (
            <>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">Menu</li>

                        <li>
                            <Link to="/#" className="has-arrow waves-effect">
                                <i className="ri-store-2-line" />
                                <span className="ml-1">Manage</span>
                            </Link>
                            <ul className="sub-menu" aria-expanded="false">
                                <li>
                                    <Link to="customers">Customers</Link>
                                </li>
                                {this.props.user?.role === 'ADMINISTRATOR' && (
                                    <li>
                                        <Link to="shops">Shops</Link>
                                    </li>
                                )}
                                <li>
                                    <Link to="employees">Employees</Link>
                                </li>
                                <li>
                                    <Link to="expenses">Expenses</Link>
                                </li>
                                <li>
                                    <Link to="products">Products</Link>
                                </li>
                                {this.props.user?.role === 'ADMINISTRATOR' && (
                                    <li>
                                        <Link to="users">Users</Link>
                                    </li>
                                )}
                            </ul>
                        </li>

                        <li>
                            <Link to="inventory" className=" waves-effect">
                                <i className="ri-calendar-2-line" />
                                <span className="ml-1">Inventory</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="billing" className="waves-effect">
                                <i className="ri-store-2-line" />
                                <span className="ml-1">Billing</span>
                            </Link>
                        </li>

                        {this.props.user?.role === 'ADMINISTRATOR' && (
                            <li>
                                <Link to="audit" className=" waves-effect">
                                    <i className="ri-chat-1-line" />
                                    <span className="ml-1">Audit</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </>
        );
    }
}

const mapStatetoProps = (state) => ({ ...state.Layout, user: state.globals.user });

export default withRouter(
    connect(mapStatetoProps, {
        changeLayout,
        changeSidebarTheme,
        changeSidebarType,
        changeLayoutWidth,
        changePreloader,
    })(SidebarContent)
);
