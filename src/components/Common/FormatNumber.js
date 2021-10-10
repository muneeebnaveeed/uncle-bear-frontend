import React from 'react';

const formatter = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 });

const FormatNumber = ({ number }) => {
    if (typeof number === 'number') return formatter.format(number);
    return number;
};

export default FormatNumber;
