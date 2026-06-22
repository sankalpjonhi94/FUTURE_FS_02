import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const userData = localStorage.getItem('crm_user');
  if (userData) {
    const { token } = JSON.parse(userData);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
