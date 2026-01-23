const { Op } = require('sequelize');
const { sequelize, Sale, SaleItem, Product, User } = require('../models');

// Obtener todas las ventas
exports.getAllSales = async (req, res) => {
  try {
    const { startDate, endDate, status, cashier } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (status) where.status = status;
    if (cashier) where.cashier_id = cashier;

    const sales = await Sale.findAll({
      where,
      include: [
        { model: User, as: 'cashier', attributes: ['id', 'name', 'email'] },
        {
          model: SaleItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Formatear ventas para el frontend
    const formattedSales = sales.map(sale => {
      const s = sale.toJSON();
      s.saleNumber = s.sale_number;
      s.paymentMethod = s.payment_method;
      s.createdAt = s.created_at;
      return s;
    });

    res.json({
      count: formattedSales.length,
      sales: formattedSales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Obtener venta por ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: User, as: 'cashier', attributes: ['id', 'name', 'email'] },
        {
          model: SaleItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'barcode'] }]
        }
      ]
    });

    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json({ sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener venta' });
  }
};

// Crear venta
exports.createSale = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, paymentMethod, amountPaid, customer, notes, discount = 0 } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'La venta debe tener al menos un producto' });
    }

    // Verificar stock y calcular totales
    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        });
      }

      // Actualizar stock
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });

      const itemSubtotal = parseFloat(product.price) * item.quantity;
      subtotal += itemSubtotal;

      saleItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemSubtotal
      });
    }

    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax - discount;
    const change = amountPaid ? amountPaid - total : 0;

    // Generar número de venta
    const count = await Sale.count({ transaction: t });
    const saleNumber = `V-${String(count + 1).padStart(6, '0')}`;

    const sale = await Sale.create({
      sale_number: saleNumber,
      subtotal,
      tax,
      discount,
      total,
      payment_method: paymentMethod,
      amount_paid: amountPaid || total,
      change_amount: change > 0 ? change : 0,
      customer_name: customer?.name,
      customer_phone: customer?.phone,
      customer_email: customer?.email,
      cashier_id: req.user.id,
      notes,
      status: 'completada'
    }, { transaction: t });

    // Crear items de venta
    for (const item of saleItems) {
      await SaleItem.create({
        sale_id: sale.id,
        ...item
      }, { transaction: t });
    }

    await t.commit();

    // Obtener venta con relaciones
    const populatedSale = await Sale.findByPk(sale.id, {
      include: [
        { model: User, as: 'cashier', attributes: ['id', 'name', 'email'] },
        {
          model: SaleItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }]
        }
      ]
    });

    res.status(201).json({
      message: 'Venta registrada exitosamente',
      sale: populatedSale
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al crear venta' });
  }
};

// Cancelar venta
exports.cancelSale = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [{ model: SaleItem, as: 'items' }],
      transaction: t
    });

    if (!sale) {
      await t.rollback();
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    if (sale.status === 'cancelada') {
      await t.rollback();
      return res.status(400).json({ message: 'La venta ya está cancelada' });
    }

    // Restaurar stock
    for (const item of sale.items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (product) {
        await product.update({ stock: product.stock + item.quantity }, { transaction: t });
      }
    }

    await sale.update({ status: 'cancelada' }, { transaction: t });

    await t.commit();

    res.json({ message: 'Venta cancelada exitosamente', sale });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al cancelar venta' });
  }
};

// Obtener ventas del día
exports.getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.findAll({
      where: {
        created_at: { [Op.gte]: today },
        status: 'completada'
      },
      include: [{ model: User, as: 'cashier', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });

    const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);

    res.json({
      count: sales.length,
      totalAmount,
      sales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ventas del día' });
  }
};
