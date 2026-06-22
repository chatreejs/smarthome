import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

import Config from './Config';

export const axiosInstance = axios.create({
  baseURL: Config.baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => {
    return new Promise((resolve) => {
      if (config.headers && !config.headers.Authorization) {
        const token = localStorage.getItem('sh-token');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          } as AxiosRequestHeaders;
        }
      }
      resolve(config);
    });
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
