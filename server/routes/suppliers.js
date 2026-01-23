const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// Todas las rutas requieren autenticación
router.use(protect);

// Obtener todos los proveedores
router.get('/', getAllSuppliers);

// Obtener proveedor por ID
router.get('/:id', getSupplierById);

// Crear proveedor
router.post('/', authorize('admin', 'pharmacist'), [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('phone').notEmpty().withMessage('El teléfono es requerido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  validate
], createSupplier);

// Actualizar proveedor
router.put('/:id', authorize('admin', 'pharmacist'), updateSupplier);

// Eliminar proveedor
router.delete('/:id', authorize('admin'), deleteSupplier);

module.exports = router;
