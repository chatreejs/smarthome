import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_APP_BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<AxiosRequestConfig>): any => {
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
