import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VITE_APP_API,
});

export const httpClient = instance;
