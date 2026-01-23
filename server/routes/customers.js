const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas públicas (cualquier usuario autenticado)
router.get('/search', customerController.search);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);

// Rutas restringidas (admin y farmacéutico)
router.post('/', authorize('admin', 'pharmacist'), customerController.create);
router.put('/:id', authorize('admin', 'pharmacist'), customerController.update);
router.delete('/:id', authorize('admin'), customerController.delete);
router.put('/:id/points', authorize('admin', 'pharmacist', 'cashier'), customerController.addPoints);

module.exports = router;
