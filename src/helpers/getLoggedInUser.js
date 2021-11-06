import store from '../store/index';

const getLoggedInUser = () => {
    const { user } = store.getState().globals;
    return user;
};

export default getLoggedInUser;
