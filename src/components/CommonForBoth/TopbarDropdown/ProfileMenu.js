import React, { Component, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// users
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import avatar2 from '../../../assets/images/users/avatar-2.jpg';

const ProfileMenu = () => {
    const [menu, setMenu] = useState(false);
    const user = useSelector((s) => s.globals.user);

    const toggle = () => {
        setMenu((prevState) => !prevState.menu);
    };

    return (
        <>
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block user-dropdown">
                <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
                    <div className="d-flex tw-items-center">
                        <Avatar round name={user?.name} size="30" className="tw-mr-1" />
                        {/* <img className="rounded-circle header-profile-user tw-mx-auto" src={avatar2} alt="Header Avatar"/> */}
                        <span className="d-none d-xl-inline-block ml-1 text-transform tw-text-md tw-capitalize">
                            {user?.name}
                        </span>
                        <i className="mdi mdi-chevron-down d-none ml-1 d-xl-inline-block" />
                    </div>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem className="text-danger" href="/logout">
                        <i className="ri-shut-down-line align-middle mr-1 text-danger" /> Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export default ProfileMenu;
