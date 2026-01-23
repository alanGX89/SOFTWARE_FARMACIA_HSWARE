const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getSalesReport,
  getTopProducts,
  getInventoryReport,
  getCashierReport
} = require('../controllers/reportController');

// Todas las rutas requieren autenticación
router.use(protect);

// Dashboard general
router.get('/dashboard', getDashboard);

// Reporte de ventas
router.get('/sales', authorize('admin', 'pharmacist'), getSalesReport);

// Productos más vendidos
router.get('/top-products', authorize('admin', 'pharmacist'), getTopProducts);

// Reporte de inventario
router.get('/inventory', authorize('admin', 'pharmacist'), getInventoryReport);

// Reporte de cajeros
router.get('/cashiers', authorize('admin'), getCashierReport);

module.exports = router;
