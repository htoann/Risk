const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);

  if (data === 'undefined' || data === null) {
    return undefined;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const setLocalStorage = (key: string, value: any) => {
  const stringify = typeof value !== 'string' ? JSON.stringify(value) : value;
  return localStorage.setItem(key, stringify);
};

const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export { getLocalStorage, removeLocalStorage, setLocalStorage };
