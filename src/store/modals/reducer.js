import {
    SET_ACCEPT_USER_DATA,
    SET_ACCEPT_USER_VISIBILITY,
    SET_ADD_INVENTORY_DATA,
    SET_ADD_INVENTORY_VISIBILITY,
    SET_CONSUME_INVENTORY_DATA,
    SET_CONSUME_INVENTORY_VISIBILITY,
    SET_EMPLOYEES_DATA,
    SET_EMPLOYEES_VISIBILITY,
    SET_MATERIAL_EXPENSES_DATA,
    SET_MATERIAL_EXPENSES_VISIBILITY,
    SET_NORMAL_CUSTOMERS_DATA,
    SET_NORMAL_CUSTOMERS_VISIBILITY,
    SET_PRODUCTS_DATA,
    SET_PRODUCTS_VISIBILITY,
    SET_PRODUCT_GROUP_DATA,
    SET_PRODUCT_GROUP_VISIBILITY,
    SET_SALARIES_DATA,
    SET_SALARIES_VISIBILITY,
    SET_SHOPS_DATA,
    SET_SHOPS_VISIBILITY,
    SET_SHOP_EXPENSES_DATA,
    SET_SHOP_EXPENSES_VISIBILITY,
    SET_VIP_CUSTOMERS_DATA,
    SET_VIP_CUSTOMERS_VISIBILITY,
} from './actionTypes';

const INIT_STATE = {
    normalCustomers: {
        visible: false,
        data: {},
    },
    vipCustomers: {
        visible: false,
        data: {},
    },
    shops: {
        visible: false,
        data: {},
    },
    employees: {
        visible: false,
        data: {},
    },
    materialExpenses: {
        visible: false,
        data: {},
    },
    shopExpenses: {
        visible: false,
        data: {},
    },
    salaries: {
        visible: false,
        data: {},
    },
    products: {
        visible: false,
        data: {},
    },
    productGroups: {
        visible: false,
        data: {},
    },
    addInventories: {
        visible: false,
        data: {},
    },
    consumeInventories: {
        visible: false,
        data: {},
    },
    acceptUser: {
        visible: false,
        data: {},
    },
};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_NORMAL_CUSTOMERS_VISIBILITY:
            return {
                ...state,
                normalCustomers: {
                    ...state.normalCustomers,
                    visible: action.payload,
                },
            };
        case SET_NORMAL_CUSTOMERS_DATA:
            return {
                ...state,
                normalCustomers: {
                    ...state.normalCustomers,
                    data: action.payload,
                },
            };
        case SET_VIP_CUSTOMERS_VISIBILITY:
            return {
                ...state,
                vipCustomers: {
                    ...state.vipCustomers,
                    visible: action.payload,
                },
            };
        case SET_VIP_CUSTOMERS_DATA:
            return {
                ...state,
                vipCustomers: {
                    ...state.vipCustomers,
                    data: action.payload,
                },
            };
        case SET_SHOPS_VISIBILITY:
            return {
                ...state,
                shops: {
                    ...state.shops,
                    visible: action.payload,
                },
            };
        case SET_SHOPS_DATA:
            return {
                ...state,
                shops: {
                    ...state.shops,
                    data: action.payload,
                },
            };
        case SET_EMPLOYEES_VISIBILITY:
            return {
                ...state,
                employees: {
                    ...state.employees,
                    visible: action.payload,
                },
            };
        case SET_EMPLOYEES_DATA:
            return {
                ...state,
                employees: {
                    ...state.employees,
                    data: action.payload,
                },
            };
        case SET_MATERIAL_EXPENSES_VISIBILITY:
            return {
                ...state,
                materialExpenses: {
                    ...state.materialExpenses,
                    visible: action.payload,
                },
            };
        case SET_MATERIAL_EXPENSES_DATA:
            return {
                ...state,
                materialExpenses: {
                    ...state.materialExpenses,
                    data: action.payload,
                },
            };
        case SET_SHOP_EXPENSES_VISIBILITY:
            return {
                ...state,
                shopExpenses: {
                    ...state.shopExpenses,
                    visible: action.payload,
                },
            };
        case SET_SHOP_EXPENSES_DATA:
            return {
                ...state,
                shopExpenses: {
                    ...state.shopExpenses,
                    data: action.payload,
                },
            };
        case SET_SALARIES_VISIBILITY:
            return {
                ...state,
                salaries: {
                    ...state.salaries,
                    visible: action.payload,
                },
            };
        case SET_SALARIES_DATA:
            return {
                ...state,
                salaries: {
                    ...state.salaries,
                    data: action.payload,
                },
            };
        case SET_PRODUCTS_VISIBILITY:
            return {
                ...state,
                products: {
                    ...state.products,
                    visible: action.payload,
                },
            };
        case SET_PRODUCTS_DATA:
            return {
                ...state,
                products: {
                    ...state.products,
                    data: action.payload,
                },
            };
        case SET_PRODUCT_GROUP_VISIBILITY:
            return {
                ...state,
                productGroups: {
                    ...state.productGroups,
                    visible: action.payload,
                },
            };
        case SET_PRODUCT_GROUP_DATA:
            return {
                ...state,
                productGroups: {
                    ...state.productGroups,
                    data: action.payload,
                },
            };
        case SET_ADD_INVENTORY_VISIBILITY:
            return {
                ...state,
                addInventories: {
                    ...state.addInventories,
                    visible: action.payload,
                },
            };
        case SET_ADD_INVENTORY_DATA:
            return {
                ...state,
                addInventories: {
                    ...state.addInventories,
                    data: action.payload,
                },
            };
        case SET_CONSUME_INVENTORY_VISIBILITY:
            return {
                ...state,
                consumeInventories: {
                    ...state.consumeInventories,
                    visible: action.payload,
                },
            };
        case SET_CONSUME_INVENTORY_DATA:
            return {
                ...state,
                consumeInventories: {
                    ...state.consumeInventories,
                    data: action.payload,
                },
            };
        case SET_ACCEPT_USER_VISIBILITY:
            return {
                ...state,
                acceptUser: {
                    ...state.acceptUser,
                    visible: action.payload,
                },
            };
        case SET_ACCEPT_USER_DATA:
            return {
                ...state,
                acceptUser: {
                    ...state.acceptUser,
                    data: action.payload,
                },
            };
        default:
            return state;
    }
};

export default Layout;
