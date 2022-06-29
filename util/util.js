import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Delete Product from List By Id
export const deleteProduct = (list, {id, variant}) => {
    const filter = list.filter((item) => {
        if (item.variant) {
            return item.id !== id || item.variant !== variant;
        }
        return item.id !== id;
    });
    return filter;
};

// Find Product Index From List
export const findProductIndex = (list, slug) => {
    const index = list.findIndex((item) => item.slug === slug);
    return index;
};
export const findProductIndexById = (list, id) => {
    const index = list.findIndex((item) => item.id === id);
    return index;
};

export const findProductIndexByIdAndVariant = (list, { id, variant }) => {
    const index = list.findIndex((item) => {
        if (item.variant) {
            return item.id === id && item.variant === variant;
        }
        return item.id === id;
    });
    return index;
};



export const getMonthName = (monthIndex) => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[monthIndex];
}

export const getMonthNameGerman = (monthIndex) => {
  const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  return months[monthIndex];
}

export const isPasswordValidated = (pw) => {
    return /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[0-9]/.test(pw) &&
        /[^A-Za-z0-9]/.test(pw) &&
        pw.length > 6;
};

export const fetcher = url => axios.get(url).then(res => res.data);
