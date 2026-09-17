import axios from 'axios';

// 1. 创建一个 axios 实例
const api = axios.create({
  // 基础 URL，会自动加在每个请求前面
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 5000, // 5秒超时
});

// 2. 请求拦截器（可选：比如自动带上 token）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器（可选：统一处理错误）
api.interceptors.response.use(
  (response) => {
    return response.data; // 直接返回 data，不用每次都 .data
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;