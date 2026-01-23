import api from './api';

export const saleService = {
  getAll: (params) => api.get('/api/sales', { params }),
  getById: (id) => api.get(`/api/sales/${id}`),
  create: (data) => api.post('/api/sales', data),
  cancel: (id) => api.put(`/api/sales/${id}/cancel`),
  getToday: () => api.get('/api/sales/today')
};
