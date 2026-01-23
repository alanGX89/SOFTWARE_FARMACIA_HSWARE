const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser
} = require('../controllers/userController');

// Todas las rutas requieren autenticación
router.use(protect);

// Obtener todos los usuarios
router.get('/', authorize('admin'), getAllUsers);

// Obtener usuario por ID
router.get('/:id', getUserById);

// Crear usuario
router.post('/', authorize('admin'), [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role')
    .isIn(['admin', 'pharmacist', 'cashier'])
    .withMessage('Rol inválido'),
  validate
], createUser);

// Actualizar usuario
router.put('/:id', [
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate
], updateUser);

// Eliminar usuario
router.delete('/:id', authorize('admin'), deleteUser);

// Reactivar usuario
router.put('/:id/reactivate', authorize('admin'), reactivateUser);

module.exports = router;
