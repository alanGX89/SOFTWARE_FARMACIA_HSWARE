const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Ver movimientos (admin y farmacéutico)
router.get('/', authorize('admin', 'pharmacist'), stockMovementController.getAll);
router.get('/product/:productId', authorize('admin', 'pharmacist'), stockMovementController.getByProduct);

// Operaciones de stock (admin y farmacéutico)
router.post('/add', authorize('admin', 'pharmacist'), stockMovementController.addStock);
router.post('/remove', authorize('admin', 'pharmacist'), stockMovementController.removeStock);
router.post('/adjust', authorize('admin', 'pharmacist'), stockMovementController.adjustStock);

module.exports = router;
