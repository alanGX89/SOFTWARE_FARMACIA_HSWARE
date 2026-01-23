const { Op } = require('sequelize');
const { Consultation, Customer, User, sequelize } = require('../models');

// Generar numero de consulta unico
const generateConsultationNumber = async () => {
  const today = new Date();
  const prefix = `CON-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;

  const lastConsultation = await Consultation.findOne({
    where: {
      consultation_number: { [Op.like]: `${prefix}%` }
    },
    order: [['consultation_number', 'DESC']]
  });

  let sequence = 1;
  if (lastConsultation) {
    const lastSequence = parseInt(lastConsultation.consultation_number.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Obtener todas las consultas
exports.getAllConsultations = async (req, res) => {
  try {
    const { startDate, endDate, type, status, attendedBy } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, `${endDate} 23:59:59`] };
    }
    if (type) where.consultation_type = type;
    if (status) where.status = status;
    if (attendedBy) where.attended_by = attendedBy;

    const consultations = await Consultation.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'attendant', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      count: consultations.length,
      consultations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener consultas' });
  }
};

// Obtener consulta por ID
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: User, as: 'attendant', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consulta no encontrada' });
    }

    res.json({ consultation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener consulta' });
  }
};

// Crear consulta
exports.createConsultation = async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientPhone,
      patientEmail,
      customerId,
      consultationType,
      symptoms,
      diagnosis,
      treatment,
      prescription,
      vitalSigns,
      price,
      paymentMethod,
      notes,
      followUpDate
    } = req.body;

    const consultationNumber = await generateConsultationNumber();

    const consultation = await Consultation.create({
      consultation_number: consultationNumber,
      patient_name: patientName,
      patient_age: patientAge,
      patient_phone: patientPhone,
      patient_email: patientEmail,
      customer_id: customerId,
      consultation_type: consultationType || 'general',
      symptoms,
      diagnosis,
      treatment,
      prescription,
      vital_signs: vitalSigns,
      price: price || 0,
      payment_status: price > 0 ? 'pagado' : 'pendiente',
      payment_method: paymentMethod,
      attended_by: req.user.id,
      notes,
      follow_up_date: followUpDate,
      status: 'completada'
    });

    res.status(201).json({
      message: 'Consulta registrada exitosamente',
      consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear consulta' });
  }
};

// Actualizar consulta
exports.updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consulta no encontrada' });
    }

    const updateData = {};
    if (req.body.patientName) updateData.patient_name = req.body.patientName;
    if (req.body.patientAge) updateData.patient_age = req.body.patientAge;
    if (req.body.patientPhone) updateData.patient_phone = req.body.patientPhone;
    if (req.body.consultationType) updateData.consultation_type = req.body.consultationType;
    if (req.body.symptoms) updateData.symptoms = req.body.symptoms;
    if (req.body.diagnosis) updateData.diagnosis = req.body.diagnosis;
    if (req.body.treatment) updateData.treatment = req.body.treatment;
    if (req.body.prescription) updateData.prescription = req.body.prescription;
    if (req.body.vitalSigns) updateData.vital_signs = req.body.vitalSigns;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;
    if (req.body.followUpDate) updateData.follow_up_date = req.body.followUpDate;
    if (req.body.status) updateData.status = req.body.status;

    await consultation.update(updateData);

    res.json({
      message: 'Consulta actualizada exitosamente',
      consultation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar consulta' });
  }
};

// Obtener consultas del dia
exports.getTodayConsultations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const consultations = await Consultation.findAll({
      where: {
        created_at: { [Op.between]: [today, tomorrow] }
      },
      include: [
        { model: User, as: 'attendant', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const stats = {
      total: consultations.length,
      byType: {},
      totalRevenue: 0
    };

    consultations.forEach(c => {
      stats.byType[c.consultation_type] = (stats.byType[c.consultation_type] || 0) + 1;
      stats.totalRevenue += parseFloat(c.price) || 0;
    });

    res.json({
      date: today.toISOString().split('T')[0],
      stats,
      consultations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener consultas del dia' });
  }
};

// Obtener historial de consultas de un paciente
exports.getPatientHistory = async (req, res) => {
  try {
    const { customerId, phone, name } = req.query;
    const where = {};

    if (customerId) {
      where.customer_id = customerId;
    } else if (phone) {
      where.patient_phone = phone;
    } else if (name) {
      where.patient_name = { [Op.iLike]: `%${name}%` };
    } else {
      return res.status(400).json({ message: 'Se requiere customerId, phone o name' });
    }

    const consultations = await Consultation.findAll({
      where,
      include: [
        { model: User, as: 'attendant', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      count: consultations.length,
      consultations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};

// Estadisticas de consultas
exports.getConsultationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, `${endDate} 23:59:59`] };
    }

    // Total de consultas
    const totalConsultations = await Consultation.count({ where });

    // Por tipo
    const byType = await Consultation.findAll({
      where,
      attributes: [
        'consultation_type',
        [sequelize.fn('COUNT', sequelize.col('consultation_type')), 'count']
      ],
      group: ['consultation_type']
    });

    // Ingresos totales
    const totalRevenue = await Consultation.sum('price', { where }) || 0;

    // Consultas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayConsultations = await Consultation.count({
      where: { created_at: { [Op.between]: [today, tomorrow] } }
    });

    // Por atendiente
    const byAttendant = await Consultation.findAll({
      where,
      attributes: [
        'attended_by',
        [sequelize.fn('COUNT', sequelize.col('attended_by')), 'count']
      ],
      include: [{ model: User, as: 'attendant', attributes: ['name'] }],
      group: ['attended_by', 'attendant.id', 'attendant.name']
    });

    res.json({
      totalConsultations,
      todayConsultations,
      totalRevenue,
      byType: byType.map(t => ({
        type: t.consultation_type,
        count: parseInt(t.get('count'))
      })),
      byAttendant: byAttendant.map(a => ({
        attendant: a.attendant?.name,
        count: parseInt(a.get('count'))
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadisticas' });
  }
};

// Tipos de consulta con precios sugeridos
exports.getConsultationTypes = async (req, res) => {
  try {
    const types = [
      { type: 'general', name: 'Consulta General', suggestedPrice: 50.00 },
      { type: 'presion', name: 'Toma de Presion', suggestedPrice: 20.00 },
      { type: 'glucosa', name: 'Medicion de Glucosa', suggestedPrice: 30.00 },
      { type: 'inyeccion', name: 'Aplicacion de Inyeccion', suggestedPrice: 40.00 },
      { type: 'curacion', name: 'Curacion', suggestedPrice: 60.00 },
      { type: 'vacuna', name: 'Aplicacion de Vacuna', suggestedPrice: 50.00 },
      { type: 'otro', name: 'Otro Servicio', suggestedPrice: 0.00 }
    ];

    res.json({ types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tipos de consulta' });
  }
};
