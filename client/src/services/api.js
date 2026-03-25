import axios from 'axios';

// Detectar automáticamente la URL del servidor basándose en el host actual
const getApiUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:5000`;
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
