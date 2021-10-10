import { useQuery as useReactQuery } from 'react-query';

export const useQuery = (q = '', fn, settings = {}) => {
    const query = useReactQuery(q, fn, { retry: 0, ...settings });
    return query;
};
