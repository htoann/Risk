import { ACCESS_TOKEN, API_ENDPOINT, REFRESH_TOKEN } from '@/utils/const';
import { clearLogoutLocalStorageAndCookie, filterEmptyField } from '@/utils/index';
import { getCookie, setCookie } from '@/utils/storage/cookie';
import axios from 'axios';
import { API_LOGIN } from './apiConst';
import { openModalServerError } from './utils';

const whiteListAPIs = [API_LOGIN];

let refreshTokenPromise = null;
let failedQueue = [];
let refreshAttempts = 0;
let refreshTimeout = null;

const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_INTERVAL = 60000; // 1 minute

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach((prom) => (accessToken ? prom.resolve(accessToken) : prom.reject(error)));
  failedQueue = [];
};

const resetRefreshAttempts = () => {
  refreshAttempts = 0;
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};

const incrementRefreshAttempts = () => {
  refreshAttempts += 1;
  if (refreshAttempts === 1) {
    refreshTimeout = setTimeout(resetRefreshAttempts, REFRESH_INTERVAL);
  }
};

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  authHeader() {
    const token = getCookie(ACCESS_TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  initializeInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        config.headers = { ...config.headers };
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error),
    );
  }

  logout() {
    refreshTokenPromise = null;
    resetRefreshAttempts();
    clearLogoutLocalStorageAndCookie();
  }

  async handleResponseError(error) {
    const { response, config } = error;

    if (error?.response?.status === 500 || error?.code === 'ERR_NETWORK') {
      openModalServerError();
    }

    if (response?.status === 401 && !whiteListAPIs.includes(config.url)) {
      const originalRequest = config;

      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        this.logout();
        return Promise.reject(new Error('Max refresh attempts exceeded'));
      }

      if (refreshTokenPromise) {
        return refreshTokenPromise
          .then((accessToken) => {
            if (accessToken) {
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          })
          .catch((err) => Promise.reject(err));
      }

      refreshTokenPromise = this.refreshAccessToken()
        .then((accessToken) => {
          refreshTokenPromise = null;
          if (accessToken) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          }
        })
        .catch(this.handleRefreshError);

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    return Promise.reject(error);
  }

  async refreshAccessToken() {
    incrementRefreshAttempts();

    const refreshToken = getCookie(REFRESH_TOKEN);
    if (!refreshToken) {
      this.logout();
      return Promise.reject(new Error('No refresh token available'));
    }

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/refresh/`, {
        refresh: refreshToken,
      });

      if (response?.data?.token) {
        const { access_token, refresh_token } = response.data.token;
        setCookie(ACCESS_TOKEN, access_token);
        setCookie(REFRESH_TOKEN, refresh_token);
        return access_token;
      }
    } catch (error) {
      return this.handleRefreshError(error);
    }
  }

  handleRefreshError(error) {
    console.error('Failed to refresh token:', error);
    this.logout();
    return Promise.reject(error);
  }

  async get(path, params = {}, config = {}) {
    return this.client.get(path, { params: filterEmptyField(params), ...config });
  }

  async post(path, data = {}, optionalHeader = {}) {
    return this.client.post(path, data, {
      headers: { ...this.authHeader(), ...optionalHeader },
    });
  }

  async patch(path, data = {}) {
    return this.client.patch(path, data, {
      headers: { ...this.authHeader() },
    });
  }

  async put(path, data = {}) {
    return this.client.put(path, data, {
      headers: { ...this.authHeader() },
    });
  }

  async delete(path) {
    return this.client.delete(path, {
      headers: { ...this.authHeader() },
    });
  }
}

export const apiService = new ApiService();
