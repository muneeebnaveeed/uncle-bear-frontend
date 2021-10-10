import { SET_SHOP } from './actionTypes';

const INIT_STATE = {
    shop: null,
};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_SHOP:
            return {
                ...state,
                shop: action.payload,
            };
        default:
            return state;
    }
};

export default Layout;
