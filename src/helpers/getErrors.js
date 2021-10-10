const getError = (err) => {
    let errors = [];
    const data = err.response?.data?.data;
    if (data) errors = Array.isArray(data) ? data : [data];
    else errors.push(err.message);
    return errors;
};

export default getError;
