const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Rutas para ver devoluciones
router.get('/', authorize('admin', 'pharmacist'), returnController.getAll);
router.get('/:id', authorize('admin', 'pharmacist'), returnController.getById);
router.get('/sale/:saleId/items', returnController.getSaleItems);

// Crear y cancelar devoluciones
router.post('/', authorize('admin', 'pharmacist'), returnController.create);
router.put('/:id/cancel', authorize('admin'), returnController.cancel);

module.exports = router;
