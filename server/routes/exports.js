const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Tickets de venta (todos los usuarios)
router.get('/ticket/:id', exportController.generateSaleTicket);

// Exportaciones (admin y farmacéutico)
router.get('/sales/excel', authorize('admin', 'pharmacist'), exportController.exportSalesToExcel);
router.get('/sales/pdf', authorize('admin', 'pharmacist'), exportController.exportSalesReportPDF);
router.get('/inventory/excel', authorize('admin', 'pharmacist'), exportController.exportInventoryToExcel);

module.exports = router;
