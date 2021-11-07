import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { Link } from 'react-router-dom';

import { When } from 'react-if';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// Redux Store
import { toggleRightSidebar } from '../../store/actions';

import ShopSelect from './ShopSelect';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isSocialPf: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleRightbar = this.toggleRightbar.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
    }

    /**
     * Toggle sidebar
     */
    toggleMenu() {
        this.props.toggleMenuCallback();
    }

    /**
     * Toggles the sidebar
     */
    toggleRightbar() {
        this.props.toggleRightSidebar();
    }

    toggleFullscreen = () => {
        if (
            !document.fullscreenElement &&
            /* alternative standard method */ !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };

    render() {
        return (
            <>
                <header id="page-topbar">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box d-flex tw-justify-center tw-items-center">
                                <Link to="#" className="logo logo-light">
                                    <h1 className="tw-text-white tw-font-bold tw-mt-3 tw-text-xl tw-text-center tw-my-auto m-0">
                                        Uncle Bear's
                                    </h1>
                                </Link>
                            </div>

                            <Button
                                size="sm"
                                color="none"
                                type="button"
                                onClick={this.toggleMenu}
                                className="px-3 font-size-24 header-item waves-effect"
                                id="vertical-menu-btn"
                            >
                                <i className="ri-menu-2-line align-middle" />
                            </Button>
                        </div>

                        <div className="d-flex">
                            <div className="dropdown d-none d-lg-inline-block ml-1">
                                <Button
                                    color="none"
                                    type="button"
                                    className="header-item noti-icon waves-effect"
                                    onClick={this.toggleFullscreen}
                                >
                                    <i className="ri-fullscreen-line" />
                                </Button>
                            </div>

                            <When condition={this.props.user.role === 'ADMINISTRATOR'}>
                                <div className="ml-1 tw-flex tw-items-center tw-min-w-[200px]">
                                    <ShopSelect />
                                </div>
                            </When>

                            <ProfileMenu />
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

const mapStatetoProps = (state) => {
    const { layoutType } = state.Layout;
    return { layoutType, user: state.globals.user };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(Header);
