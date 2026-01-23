const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateStock,
  getByBarcode,
  getExpiringProducts,
  getExpiredProducts
} = require('../controllers/productController');

// Todas las rutas requieren autenticación
router.use(protect);

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener productos con stock bajo
router.get('/low-stock', getLowStockProducts);

// Obtener productos por vencer
router.get('/expiring', getExpiringProducts);

// Obtener productos vencidos
router.get('/expired', getExpiredProducts);

// Buscar por código de barras
router.get('/barcode/:barcode', getByBarcode);

// Obtener producto por ID
router.get('/:id', getProductById);

// Crear producto
router.post('/', authorize('admin', 'pharmacist'), [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('category')
    .isIn(['medicamento', 'suplemento', 'cuidado_personal', 'equipamiento', 'otro'])
    .withMessage('Categoría inválida'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('cost').isFloat({ min: 0 }).withMessage('El costo debe ser mayor a 0'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser mayor o igual a 0'),
  validate
], createProduct);

// Actualizar producto
router.put('/:id', authorize('admin', 'pharmacist'), updateProduct);

// Actualizar stock
router.patch('/:id/stock', authorize('admin', 'pharmacist'), [
  body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('operation')
    .isIn(['add', 'subtract'])
    .withMessage('Operación inválida'),
  validate
], updateStock);

// Eliminar producto
router.delete('/:id', authorize('admin', 'pharmacist'), deleteProduct);

module.exports = router;
