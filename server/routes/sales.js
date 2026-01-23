const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllSales,
  getSaleById,
  createSale,
  cancelSale,
  getTodaySales
} = require('../controllers/saleController');

// Todas las rutas requieren autenticación
router.use(protect);

// Obtener todas las ventas
router.get('/', getAllSales);

// Obtener ventas del día
router.get('/today', getTodaySales);

// Obtener venta por ID
router.get('/:id', getSaleById);

// Crear venta
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('items.*.product').notEmpty().withMessage('El ID del producto es requerido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('paymentMethod')
    .isIn(['efectivo', 'tarjeta', 'transferencia', 'credito'])
    .withMessage('Método de pago inválido'),
  validate
], createSale);

// Cancelar venta
router.put('/:id/cancel', authorize('admin', 'pharmacist'), cancelSale);

module.exports = router;
