import axios from 'axios';

import { server } from '.';
import { getLocalStorageJWT, isLoggedIn } from './auth';

const isDev = import.meta.env.MODE === 'development';

const API_HOST = isDev ? 'http://localhost:5000' : '';

const API = axios.create({
  baseURL: `${API_HOST}/api/v1`,
});

API.interceptors.request.use(function (config) {
  const token = getLocalStorageJWT();
  config.headers['Authorization'] = isLoggedIn() ? `Bearer ${token}` : '';
  return config;
});

API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      server.auth.logout();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default API;
