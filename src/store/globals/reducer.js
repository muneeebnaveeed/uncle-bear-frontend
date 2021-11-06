import { SET_SHOP, SET_USER } from './actionTypes';

const INIT_STATE = {
    shop: null,
    user: null,
};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_SHOP:
            return {
                ...state,
                shop: action.payload,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export default Layout;
