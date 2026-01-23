const { Customer, Sale } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los clientes
exports.getAll = async (req, res) => {
  try {
    const { search, active } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (active !== undefined) {
      where.active = active === 'true';
    }

    const customers = await Customer.findAll({
      where,
      order: [['name', 'ASC']]
    });

    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// Obtener cliente por ID
exports.getById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Sale,
        as: 'purchases',
        limit: 10,
        order: [['created_at', 'DESC']]
      }]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
};

// Crear cliente
exports.create = async (req, res) => {
  try {
    const { name, email, phone, address, tax_id, birth_date, notes } = req.body;

    if (email) {
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Ya existe un cliente con ese email' });
      }
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      tax_id,
      birth_date,
      notes
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

// Actualizar cliente
exports.update = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const { name, email, phone, address, tax_id, birth_date, notes, active } = req.body;

    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Ya existe un cliente con ese email' });
      }
    }

    await customer.update({
      name: name || customer.name,
      email: email !== undefined ? email : customer.email,
      phone: phone !== undefined ? phone : customer.phone,
      address: address !== undefined ? address : customer.address,
      tax_id: tax_id !== undefined ? tax_id : customer.tax_id,
      birth_date: birth_date !== undefined ? birth_date : customer.birth_date,
      notes: notes !== undefined ? notes : customer.notes,
      active: active !== undefined ? active : customer.active
    });

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

// Eliminar cliente (soft delete)
exports.delete = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await customer.update({ active: false });
    res.json({ message: 'Cliente desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};

// Buscar cliente por teléfono o email
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 3) {
      return res.json([]);
    }

    const customers = await Customer.findAll({
      where: {
        active: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { phone: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } }
        ]
      },
      limit: 10
    });

    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar clientes' });
  }
};

// Agregar puntos a cliente
exports.addPoints = async (req, res) => {
  try {
    const { points, purchase_amount } = req.body;
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await customer.update({
      points: customer.points + (points || 0),
      total_purchases: parseFloat(customer.total_purchases) + (purchase_amount || 0)
    });

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar puntos' });
  }
};
