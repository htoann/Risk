import i18next from 'i18next';
import { DATE_FORMAT_DASH, LOGGED_IN } from './const';
import dayjs from './dayjs';
import { clearAllCookies } from './storage/cookie';
import { removeLocalStorage } from './storage/localStorage';

export const formatDate = (date, format = DATE_FORMAT_DASH) => {
  return dayjs(date || new Date()).format(format);
};

export const clearLogoutLocalStorageAndCookie = () => {
  clearAllCookies();
  removeLocalStorage(LOGGED_IN);
};

export const watchObject = (object = {}, methods = [], callbackBefore = () => {}, callbackAfter = () => {}) => {
  methods.forEach((method) => {
    const original = object[method].bind(object);
    const newMethod = (...args) => {
      callbackBefore(method, ...args);
      const result = method === 'getItem' ? original(...args) : original(...args);
      if (method === 'getItem') {
        callbackAfter(method, ...args, result);
        return result;
      } else {
        callbackAfter(method, ...args);
        return result;
      }
    };
    object[method] = newMethod.bind(object);
  });
};

export const getI18n = (key, values) => {
  if (values?.length) {
    return values.reduce((str, item, index) => str.replace(`{${index}}`, item), i18next.t(key));
  } else {
    return i18next.t(key);
  }
};

export const filterEmptyField = (arrayObject) => {
  return Object.fromEntries(Object.entries(arrayObject).filter(([, v]) => v));
};
