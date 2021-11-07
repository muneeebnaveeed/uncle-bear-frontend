import axios from 'axios';
import store from '../store';

export const api = axios.create({ baseURL: 'https://uncle-bear-backend.herokuapp.com' });

export const get = (url, params = {}, headers = {}) => api.get(url, { params, headers }).then((res) => res.data);
export const post = (url, payload, params = {}, headers = {}) =>
    api.post(url, payload, { params, headers }).then((res) => res.data);
export const patch = (url, payload, params = {}, headers = {}) =>
    api.patch(url, payload, { params, headers }).then((res) => res.data);
export const put = (url, payload, params = {}, headers = {}) =>
    api.put(url, payload, { params, headers }).then((res) => res.data);
export const del = (url, params = {}) => api.delete(url, { params }).then((res) => res.data);

api.interceptors.request.use((config) => {
    const { shop } = store.getState().globals;

    if (
        config.method !== 'get' ||
        config.url.includes('/auth/decode') ||
        (config.url === '/shops' && config.method === 'get')
    )
        return config;

    if (!shop) throw new Error('Please select a shop');

    config.headers.shop = shop._id;

    return config;
});
