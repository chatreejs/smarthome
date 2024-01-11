import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_APP_BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});
