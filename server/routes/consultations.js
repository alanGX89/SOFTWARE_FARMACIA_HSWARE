const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/auth');

// Obtener tipos de consulta (publico con auth)
router.get('/types', protect, consultationController.getConsultationTypes);

// Estadisticas
router.get('/stats', protect, authorize('admin', 'pharmacist'), consultationController.getConsultationStats);

// Consultas del dia
router.get('/today', protect, consultationController.getTodayConsultations);

// Historial de paciente
router.get('/patient-history', protect, consultationController.getPatientHistory);

// CRUD basico
router.get('/', protect, consultationController.getAllConsultations);
router.get('/:id', protect, consultationController.getConsultationById);
router.post('/', protect, authorize('admin', 'pharmacist'), consultationController.createConsultation);
router.put('/:id', protect, authorize('admin', 'pharmacist'), consultationController.updateConsultation);

module.exports = router;
