import { combineReducers } from 'redux';

// Front
import Layout from './layout/reducer';
import modals from './modals/reducer';
import globals from './globals/reducer';

const rootReducer = combineReducers({
    // public
    Layout,
    modals,
    globals,
});

export default rootReducer;
