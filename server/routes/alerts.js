const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Ver alertas
router.get('/', alertController.getAll);
router.get('/unread-count', alertController.getUnreadCount);
router.get('/summary', alertController.getSummary);

// Gestionar alertas
router.put('/:id/read', alertController.markAsRead);
router.put('/mark-all-read', alertController.markAllAsRead);
router.delete('/:id', authorize('admin', 'pharmacist'), alertController.delete);

// Generar alertas (admin)
router.post('/generate', authorize('admin', 'pharmacist'), alertController.generateStockAlerts);

module.exports = router;
