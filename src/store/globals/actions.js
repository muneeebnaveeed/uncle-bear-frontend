import { SET_SHOP, SET_USER } from './actionTypes';

export const setShop = (payload) => ({
    type: SET_SHOP,
    payload,
});

export const setUser = (payload) => ({
    type: SET_USER,
    payload,
});
