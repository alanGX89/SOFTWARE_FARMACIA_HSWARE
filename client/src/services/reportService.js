import api from './api';

export const reportService = {
  getDashboard: () => api.get('/api/reports/dashboard'),
  getSalesReport: (params) => api.get('/api/reports/sales', { params }),
  getTopProducts: (params) => api.get('/api/reports/top-products', { params }),
  getInventoryReport: () => api.get('/api/reports/inventory'),
  getCashierReport: (params) => api.get('/api/reports/cashiers', { params })
};
