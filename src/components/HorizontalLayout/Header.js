import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

// reactstrap
import {
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    Button,
    FormGroup,
} from 'reactstrap';

// Import menuDropdown
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// Import Logos
import logoSmLight from '../../assets/images/logo-sm-light.png';
import logoLight from '../../assets/images/logo-light.png';
import logoDark from '../../assets/images/logo-dark.png';
import logoSmDark from '../../assets/images/logo-sm-dark.png';

// profile images
import github from '../../assets/images/brands/github.png';
import bitbucket from '../../assets/images/brands/bitbucket.png';
import dribbble from '../../assets/images/brands/dribbble.png';
import dropbox from '../../assets/images/brands/dropbox.png';
import mail_chimp from '../../assets/images/brands/mail_chimp.png';
import slack from '../../assets/images/brands/slack.png';

// Import mega menu image
import megamenuImg from '../../assets/images/megamenu-img.png';

// Redux Store
import { toggleRightSidebar } from '../../store/actions';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isMegaMenu: false,
            isProfile: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleRightbar = this.toggleRightbar.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
    }

    toggleSearch = () => {
        this.setState({ isSearch: !this.state.isSearch });
    };

    /**
     * Toggle sidebar
     */
    toggleMenu() {
        this.props.openLeftMenuCallBack();
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
                            <div className="navbar-brand-box">
                                <Link to="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSmDark} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="20" />
                                    </span>
                                </Link>

                                <Link to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSmLight} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="20" />
                                    </span>
                                </Link>
                            </div>

                            <Button
                                color="none"
                                type="button"
                                size="sm"
                                onClick={this.toggleMenu}
                                className="px-3 font-size-24 d-lg-none header-item"
                                data-toggle="collapse"
                                data-target="#topnav-menu-content"
                            >
                                <i className="ri-menu-2-line align-middle" />
                            </Button>

                            <Form className="app-search d-none d-lg-block">
                                <div className="position-relative">
                                    <Input type="text" className="form-control" placeholder={this.props.t('Search')} />
                                    <span className="ri-search-line" />
                                </div>
                            </Form>
                        </div>

                        <div className="dropdown d-none d-lg-inline-block ml-1">
                            <Button
                                type="button"
                                color="none"
                                onClick={this.toggleFullscreen}
                                className="header-item noti-icon waves-effect"
                                data-toggle="fullscreen"
                            >
                                <i className="ri-fullscreen-line" />
                            </Button>
                        </div>

                        <ProfileMenu />

                        <div onClick={this.toggleRightbar} className="dropdown d-inline-block">
                            <Button
                                type="button"
                                color="none"
                                className="header-item noti-icon right-bar-toggle waves-effect"
                            >
                                <i className="ri-settings-2-line" />
                            </Button>
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

const mapStatetoProps = (state) => {
    const { layoutType } = state.Layout;
    return { layoutType };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(Header);
