import {
    SET_NORMAL_CUSTOMERS_VISIBILITY,
    SET_NORMAL_CUSTOMERS_DATA,
    SET_SHOPS_VISIBILITY,
    SET_SHOPS_DATA,
    SET_VIP_CUSTOMERS_VISIBILITY,
    SET_VIP_CUSTOMERS_DATA,
    SET_EMPLOYEES_VISIBILITY,
    SET_EMPLOYEES_DATA,
    SET_SHOP_EXPENSES_VISIBILITY,
    SET_SHOP_EXPENSES_DATA,
    SET_MATERIAL_EXPENSES_VISIBILITY,
    SET_MATERIAL_EXPENSES_DATA,
    SET_SALARIES_VISIBILITY,
    SET_SALARIES_DATA,
    SET_PRODUCTS_VISIBILITY,
    SET_PRODUCTS_DATA,
    SET_PRODUCT_GROUP_VISIBILITY,
    SET_PRODUCT_GROUP_DATA,
    SET_ADD_INVENTORY_VISIBILITY,
    SET_ADD_INVENTORY_DATA,
    SET_CONSUME_INVENTORY_VISIBILITY,
    SET_CONSUME_INVENTORY_DATA,
} from './actionTypes';

export const setNormalCustomersVisibility = (payload) => ({
    type: SET_NORMAL_CUSTOMERS_VISIBILITY,
    payload,
});

export const setNormalCustomersData = (payload) => ({
    type: SET_NORMAL_CUSTOMERS_DATA,
    payload,
});

export const setVipCustomersVisibility = (payload) => ({
    type: SET_VIP_CUSTOMERS_VISIBILITY,
    payload,
});

export const setVipCustomersData = (payload) => ({
    type: SET_VIP_CUSTOMERS_DATA,
    payload,
});

export const setShopsVisibility = (payload) => ({
    type: SET_SHOPS_VISIBILITY,
    payload,
});

export const setShopsData = (payload) => ({
    type: SET_SHOPS_DATA,
    payload,
});

export const setEmployeesVisibility = (payload) => ({
    type: SET_EMPLOYEES_VISIBILITY,
    payload,
});

export const setEmployeesData = (payload) => ({
    type: SET_EMPLOYEES_DATA,
    payload,
});

export const setShopExpensesVisibility = (payload) => ({
    type: SET_SHOP_EXPENSES_VISIBILITY,
    payload,
});

export const setShopExpensesData = (payload) => ({
    type: SET_SHOP_EXPENSES_DATA,
    payload,
});

export const setMaterialExpensesVisibility = (payload) => ({
    type: SET_MATERIAL_EXPENSES_VISIBILITY,
    payload,
});

export const setMaterialExpensesData = (payload) => ({
    type: SET_MATERIAL_EXPENSES_DATA,
    payload,
});

export const setSalariesVisibility = (payload) => ({
    type: SET_SALARIES_VISIBILITY,
    payload,
});

export const setSalariesData = (payload) => ({
    type: SET_SALARIES_DATA,
    payload,
});

export const setProductsVisibility = (payload) => ({
    type: SET_PRODUCTS_VISIBILITY,
    payload,
});

export const setProductsData = (payload) => ({
    type: SET_PRODUCTS_DATA,
    payload,
});

export const setProductGroupsVisibility = (payload) => ({
    type: SET_PRODUCT_GROUP_VISIBILITY,
    payload,
});

export const setProductGroupsData = (payload) => ({
    type: SET_PRODUCT_GROUP_DATA,
    payload,
});

export const setAddInventoryVisibility = (payload) => ({
    type: SET_ADD_INVENTORY_VISIBILITY,
    payload,
});

export const setAddInventoryData = (payload) => ({
    type: SET_ADD_INVENTORY_DATA,
    payload,
});

export const setConsumeInventoryVisibility = (payload) => ({
    type: SET_CONSUME_INVENTORY_VISIBILITY,
    payload,
});

export const setConsumeInventoryData = (payload) => ({
    type: SET_CONSUME_INVENTORY_DATA,
    payload,
});
