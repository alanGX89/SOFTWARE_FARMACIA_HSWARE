const { Return, ReturnItem, Sale, SaleItem, Product, User, StockMovement, sequelize } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las devoluciones
exports.getAll = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const returns = await Return.findAll({
      where,
      include: [
        { model: Sale, as: 'sale', attributes: ['id', 'sale_number', 'total'] },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: ReturnItem, as: 'items' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener devoluciones' });
  }
};

// Obtener devolución por ID
exports.getById = async (req, res) => {
  try {
    const returnRecord = await Return.findByPk(req.params.id, {
      include: [
        {
          model: Sale,
          as: 'sale',
          include: [{ model: SaleItem, as: 'items' }]
        },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        {
          model: ReturnItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!returnRecord) {
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }

    res.json(returnRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener devolución' });
  }
};

// Crear devolución
exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { sale_id, return_type, reason, items, refund_method, notes } = req.body;

    // Verificar que la venta existe
    const sale = await Sale.findByPk(sale_id, {
      include: [{ model: SaleItem, as: 'items' }]
    });

    if (!sale) {
      await t.rollback();
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    if (sale.status === 'cancelada') {
      await t.rollback();
      return res.status(400).json({ message: 'No se puede devolver una venta cancelada' });
    }

    // Calcular total de la devolución
    let totalAmount = 0;
    const returnItems = [];

    for (const item of items) {
      const saleItem = sale.items.find(si => si.product_id === item.product_id);
      if (!saleItem) {
        await t.rollback();
        return res.status(400).json({ message: `Producto ${item.product_id} no encontrado en la venta` });
      }

      if (item.quantity > saleItem.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Cantidad a devolver excede la cantidad vendida` });
      }

      const subtotal = item.quantity * parseFloat(saleItem.unit_price);
      totalAmount += subtotal;

      returnItems.push({
        product_id: item.product_id,
        product_name: saleItem.product_name,
        quantity: item.quantity,
        unit_price: saleItem.unit_price,
        subtotal,
        return_to_stock: item.return_to_stock !== false
      });
    }

    // Crear la devolución
    const returnRecord = await Return.create({
      sale_id,
      user_id: req.user.id,
      return_type,
      reason,
      total_amount: totalAmount,
      refund_method,
      notes,
      status: 'completada'
    }, { transaction: t });

    // Crear items de devolución y actualizar stock
    for (const item of returnItems) {
      await ReturnItem.create({
        return_id: returnRecord.id,
        ...item
      }, { transaction: t });

      // Si se debe retornar al stock
      if (item.return_to_stock) {
        const product = await Product.findByPk(item.product_id);
        const previousStock = product.stock;
        const newStock = previousStock + item.quantity;

        await product.update({ stock: newStock }, { transaction: t });

        // Registrar movimiento de stock
        await StockMovement.create({
          product_id: item.product_id,
          user_id: req.user.id,
          movement_type: 'devolucion',
          quantity: item.quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reference_type: 'return',
          reference_id: returnRecord.id,
          notes: `Devolución ${returnRecord.return_number}`
        }, { transaction: t });
      }
    }

    await t.commit();

    // Obtener la devolución completa
    const completeReturn = await Return.findByPk(returnRecord.id, {
      include: [
        { model: ReturnItem, as: 'items' },
        { model: Sale, as: 'sale' }
      ]
    });

    res.status(201).json(completeReturn);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al crear devolución' });
  }
};

// Cancelar devolución
exports.cancel = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const returnRecord = await Return.findByPk(req.params.id, {
      include: [{ model: ReturnItem, as: 'items' }]
    });

    if (!returnRecord) {
      await t.rollback();
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }

    if (returnRecord.status === 'cancelada') {
      await t.rollback();
      return res.status(400).json({ message: 'La devolución ya está cancelada' });
    }

    // Revertir el stock si fue retornado
    for (const item of returnRecord.items) {
      if (item.return_to_stock) {
        const product = await Product.findByPk(item.product_id);
        const previousStock = product.stock;
        const newStock = previousStock - item.quantity;

        await product.update({ stock: newStock }, { transaction: t });

        await StockMovement.create({
          product_id: item.product_id,
          user_id: req.user.id,
          movement_type: 'ajuste',
          quantity: -item.quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reference_type: 'return_cancel',
          reference_id: returnRecord.id,
          notes: `Cancelación de devolución ${returnRecord.return_number}`
        }, { transaction: t });
      }
    }

    await returnRecord.update({ status: 'cancelada' }, { transaction: t });
    await t.commit();

    res.json({ message: 'Devolución cancelada correctamente' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al cancelar devolución' });
  }
};

// Obtener productos de una venta para devolución
exports.getSaleItems = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.saleId, {
      include: [{
        model: SaleItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'stock'] }]
      }]
    });

    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Verificar cantidades ya devueltas
    const existingReturns = await Return.findAll({
      where: { sale_id: sale.id, status: 'completada' },
      include: [{ model: ReturnItem, as: 'items' }]
    });

    const returnedQuantities = {};
    existingReturns.forEach(ret => {
      ret.items.forEach(item => {
        returnedQuantities[item.product_id] = (returnedQuantities[item.product_id] || 0) + item.quantity;
      });
    });

    const availableItems = sale.items.map(item => ({
      ...item.toJSON(),
      already_returned: returnedQuantities[item.product_id] || 0,
      available_to_return: item.quantity - (returnedQuantities[item.product_id] || 0)
    }));

    res.json({
      sale: {
        id: sale.id,
        sale_number: sale.sale_number,
        total: sale.total,
        created_at: sale.created_at
      },
      items: availableItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener items de la venta' });
  }
};
