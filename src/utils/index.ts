import i18next from 'i18next';
import { DATE_FORMAT_DASH, LOGGED_IN } from './const';
import dayjs from './dayjs';
import { clearAllCookies } from './storage/cookie';
import { removeLocalStorage } from './storage/localStorage';

export const formatDate = (date: string, format = DATE_FORMAT_DASH) => {
  return dayjs(date || new Date()).format(format);
};

export const clearLogoutLocalStorageAndCookie = () => {
  clearAllCookies();
  removeLocalStorage(LOGGED_IN);
};

export const watchObject = (
  object: Record<string, any> = {},
  methods: string[] = [],
  callbackBefore: (method: string, ...args: any[]) => void = () => {},
  callbackAfter: (method: string, ...args: any[]) => void = () => {},
): void => {
  methods.forEach((method) => {
    if (typeof object[method] !== 'function') return;

    const original = object[method].bind(object);
    const newMethod = (...args: any[]) => {
      callbackBefore(method, ...args);
      const result = original(...args);
      callbackAfter(method, ...args, result);
      return result;
    };
    object[method] = newMethod;
  });
};

export const getI18n = (key: string, values?: string[]) => {
  if (values?.length) {
    return values.reduce((str: string, item: string, index: number) => str.replace(`{${index}}`, item), i18next.t(key));
  } else {
    return i18next.t(key);
  }
};

export const filterEmptyField = (arrayObject: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(Object.entries(arrayObject).filter(([, v]) => v !== null && v !== undefined && v !== ''));
};
