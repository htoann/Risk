import { API_LOGIN, API_USER_INFO, apiService } from '@/service';
import { ACCESS_TOKEN, APP_VERSION, CURRENT_APP_VERSION, LOGGED_IN, REFRESH_TOKEN } from '@/utils/const';
import { setCookie } from '@/utils/storage/cookie';
import { getLocalStorage, setLocalStorage } from '@/utils/storage/localStorage';
import { notification } from 'antd';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clearLogoutLocalStorageAndCookie } from '../utils';
import { watchObject } from './../utils/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  const [authState, setAuthState] = useState({
    isLoggedIn: getLocalStorage(LOGGED_IN) || false,
    loading: false,
    userInfo: null,
    loadingUserInfo: true,
    serverError: false,
  });

  const { userInfo, isLoggedIn, loading, loadingUserInfo, serverError } = authState || {};

  useEffect(() => {
    if (getLocalStorage(APP_VERSION) != CURRENT_APP_VERSION) {
      clearLogoutLocalStorageAndCookie();
      setLocalStorage(APP_VERSION, CURRENT_APP_VERSION);
    }
  }, []);

  useEffect(() => {
    if (!userInfo && isLoggedIn) {
      getProfileInfo();
    }
  }, [userInfo, isLoggedIn]);

  watchObject(window.localStorage, ['removeItem'], (method, key) => {
    if (method === 'removeItem' && key === LOGGED_IN && isLoggedIn) {
      setAuthState({ isLoggedIn: false, loading: false });
    }
  });

  const getProfileInfo = async () => {
    setState({ loadingUserInfo: true });
    try {
      const response = await apiService.get(API_USER_INFO);

      if (response) {
        setState({ userInfo: response.data });
      }
    } catch (err) {
      setState({ serverError: true });
      console.error(err);
    } finally {
      setState({ loadingUserInfo: false });
    }
  };

  const handleAuthSuccess = (token) => {
    const { access_token, refresh_token } = token;
    setCookie(ACCESS_TOKEN, access_token);
    setCookie(REFRESH_TOKEN, refresh_token);
    setLocalStorage(LOGGED_IN, true);
    setAuthState({ isLoggedIn: true, loading: false });
  };

  const handleAuthError = (err, msg) => {
    console.error(err);
    setState({ isLoggedIn: false, loading: false });
    notification.error({
      message: msg,
      description: t('Auth_Failed_Credential'),
    });
  };

  const login = async (values, handleSuccess) => {
    setState({ loading: true });
    try {
      const { data } = await apiService.post(API_LOGIN, values);
      handleAuthSuccess(data.token);
      handleSuccess && handleSuccess();
    } catch (err) {
      handleAuthError(err, t(`Auth_SignIn`));
    }
  };

  const logout = useCallback(() => {
    setState({ loading: true });
    setAuthState({ isLoggedIn: false, loading: false });
    clearLogoutLocalStorageAndCookie();
  }, []);

  const setState = (updateState) => {
    setAuthState((prevState) => ({
      ...prevState,
      ...updateState,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loading,
        login,
        logout,
        userInfo,
        loadingUserInfo,
        serverError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
