import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
    Row,
    Col,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';

import { Link } from 'react-router-dom';

// Import menuDropdown
import { withNamespaces } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// Import i18n

// Import Megamenu
import MegaMenu from './MegaMenu';

// Redux Store
import { toggleRightSidebar } from '../../store/actions';

// Import logo Images
import logosmdark from '../../assets/images/logo-sm-dark.png';
import logodark from '../../assets/images/logo-dark.png';
import logosmlight from '../../assets/images/logo-sm-light.png';
import logolight from '../../assets/images/logo-light.png';

// Import Social Profile Images
import github from '../../assets/images/brands/github.png';
import bitbucket from '../../assets/images/brands/bitbucket.png';
import dribbble from '../../assets/images/brands/dribbble.png';
import dropbox from '../../assets/images/brands/dropbox.png';
import mail_chimp from '../../assets/images/brands/mail_chimp.png';
import slack from '../../assets/images/brands/slack.png';
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

    toggleFullscreen() {
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
    }

    render() {
        return (
            <>
                <header id="page-topbar">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box">
                                <Link to="#" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logosmdark} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logodark} alt="" height="20" />
                                    </span>
                                </Link>

                                <Link to="#" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logosmlight} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logolight} alt="" height="20" />
                                    </span>
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

                            <div className="ml-1 tw-flex tw-items-center tw-min-w-[200px]">
                                <ShopSelect />
                            </div>

                            <ProfileMenu />

                            <div className="dropdown d-inline-block">
                                <Button
                                    color="none"
                                    onClick={this.toggleRightbar}
                                    type="button"
                                    className="header-item noti-icon right-bar-toggle waves-effect"
                                >
                                    <i className="ri-settings-2-line" />
                                </Button>
                            </div>
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

export default connect(mapStatetoProps, { toggleRightSidebar })(withNamespaces()(Header));
