const { Promotion, Product } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las promociones
exports.getAll = async (req, res) => {
  try {
    const { active, current } = req.query;
    const where = {};

    if (active !== undefined) {
      where.active = active === 'true';
    }

    if (current === 'true') {
      const now = new Date();
      where.start_date = { [Op.lte]: now };
      where.end_date = { [Op.gte]: now };
      where.active = true;
    }

    const promotions = await Promotion.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name']
      }],
      order: [['end_date', 'ASC']]
    });

    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener promociones' });
  }
};

// Obtener promoción por ID
exports.getById = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    res.json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener promoción' });
  }
};

// Crear promoción
exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      start_date,
      end_date,
      applies_to,
      category,
      product_id,
      usage_limit,
      code
    } = req.body;

    if (code) {
      const existingPromo = await Promotion.findOne({ where: { code } });
      if (existingPromo) {
        return res.status(400).json({ message: 'El código de promoción ya existe' });
      }
    }

    const promotion = await Promotion.create({
      name,
      description,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      start_date,
      end_date,
      applies_to,
      category,
      product_id,
      usage_limit,
      code: code ? code.toUpperCase() : null
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear promoción' });
  }
};

// Actualizar promoción
exports.update = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    await promotion.update(req.body);
    res.json(promotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar promoción' });
  }
};

// Eliminar promoción
exports.delete = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    await promotion.update({ active: false });
    res.json({ message: 'Promoción desactivada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar promoción' });
  }
};

// Validar código de promoción
exports.validateCode = async (req, res) => {
  try {
    const { code, subtotal, product_ids } = req.body;

    const promotion = await Promotion.findOne({
      where: {
        code: code.toUpperCase(),
        active: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() }
      }
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Código de promoción inválido o expirado' });
    }

    if (promotion.usage_limit && promotion.times_used >= promotion.usage_limit) {
      return res.status(400).json({ message: 'Esta promoción ha alcanzado su límite de uso' });
    }

    if (promotion.min_purchase && subtotal < promotion.min_purchase) {
      return res.status(400).json({
        message: `Compra mínima requerida: $${promotion.min_purchase}`
      });
    }

    // Calcular descuento
    let discount = 0;
    if (promotion.discount_type === 'porcentaje') {
      discount = (subtotal * promotion.discount_value) / 100;
      if (promotion.max_discount && discount > promotion.max_discount) {
        discount = promotion.max_discount;
      }
    } else if (promotion.discount_type === 'monto_fijo') {
      discount = promotion.discount_value;
    }

    res.json({
      valid: true,
      promotion: {
        id: promotion.id,
        name: promotion.name,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value
      },
      calculated_discount: discount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al validar código' });
  }
};

// Obtener promociones activas para un producto
exports.getForProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const now = new Date();
    const promotions = await Promotion.findAll({
      where: {
        active: true,
        start_date: { [Op.lte]: now },
        end_date: { [Op.gte]: now },
        [Op.or]: [
          { applies_to: 'todos' },
          { applies_to: 'producto', product_id: product.id },
          { applies_to: 'categoria', category: product.category }
        ]
      }
    });

    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener promociones del producto' });
  }
};
