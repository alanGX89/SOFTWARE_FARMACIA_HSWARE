import axios from 'axios';

// En producción (puerto 80/443 via Nginx), usar rutas relativas
// En desarrollo, apuntar al backend en puerto 5000
const getApiUrl = () => {
  const { hostname, port, protocol } = window.location;
  const isDev = port === '4123' || port === '3000';
  return isDev ? `http://${hostname}:5000` : '';
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
