const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Rutas públicas (usuarios autenticados)
router.get('/', promotionController.getAll);
router.get('/:id', promotionController.getById);
router.post('/validate-code', promotionController.validateCode);
router.get('/product/:productId', promotionController.getForProduct);

// Rutas restringidas (admin y farmacéutico)
router.post('/', authorize('admin', 'pharmacist'), promotionController.create);
router.put('/:id', authorize('admin', 'pharmacist'), promotionController.update);
router.delete('/:id', authorize('admin'), promotionController.delete);

module.exports = router;
