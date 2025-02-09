import Cookies from 'js-cookie';

const getCookie = (key: string) => {
  const data = Cookies.get(key) as string;

  if (data === 'undefined' || data === null) {
    return undefined;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const setCookie = (key: string, value: any) => {
  const stringify = typeof value !== 'string' ? JSON.stringify(value) : value;
  return Cookies.set(key, stringify);
};

const removeCookie = (key: string) => {
  Cookies.remove(key);
};

const clearAllCookies = () => {
  const allCookies = Cookies.get();
  for (const cookie in allCookies) {
    Cookies.remove(cookie, { path: '/' });
  }
};

export { clearAllCookies, getCookie, removeCookie, setCookie };
