const { StockMovement, Product, User } = require('../models');
const { Op } = require('sequelize');

// Obtener movimientos de stock
exports.getAll = async (req, res) => {
  try {
    const { product_id, movement_type, startDate, endDate, limit = 100 } = req.query;
    const where = {};

    if (product_id) {
      where.product_id = product_id;
    }

    if (movement_type) {
      where.movement_type = movement_type;
    }

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const movements = await StockMovement.findAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'barcode'] },
        { model: User, as: 'user', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener movimientos' });
  }
};

// Obtener movimientos de un producto
exports.getByProduct = async (req, res) => {
  try {
    const movements = await StockMovement.findAll({
      where: { product_id: req.params.productId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener movimientos del producto' });
  }
};

// Registrar entrada de stock
exports.addStock = async (req, res) => {
  try {
    const { product_id, quantity, cost, notes } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const previousStock = product.stock;
    const newStock = previousStock + quantity;

    // Actualizar stock del producto
    await product.update({
      stock: newStock,
      cost: cost || product.cost
    });

    // Registrar movimiento
    const movement = await StockMovement.create({
      product_id,
      user_id: req.user.id,
      movement_type: 'entrada',
      quantity,
      previous_stock: previousStock,
      new_stock: newStock,
      cost,
      notes
    });

    res.status(201).json({
      message: 'Stock actualizado correctamente',
      movement,
      product: {
        id: product.id,
        name: product.name,
        stock: newStock
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar stock' });
  }
};

// Registrar salida de stock (ajuste manual)
exports.removeStock = async (req, res) => {
  try {
    const { product_id, quantity, reason, notes } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    const previousStock = product.stock;
    const newStock = previousStock - quantity;

    await product.update({ stock: newStock });

    const movement = await StockMovement.create({
      product_id,
      user_id: req.user.id,
      movement_type: reason || 'salida',
      quantity: -quantity,
      previous_stock: previousStock,
      new_stock: newStock,
      notes
    });

    res.status(201).json({
      message: 'Stock actualizado correctamente',
      movement,
      product: {
        id: product.id,
        name: product.name,
        stock: newStock
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al reducir stock' });
  }
};

// Ajuste de inventario
exports.adjustStock = async (req, res) => {
  try {
    const { product_id, new_quantity, notes } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const previousStock = product.stock;
    const difference = new_quantity - previousStock;

    await product.update({ stock: new_quantity });

    const movement = await StockMovement.create({
      product_id,
      user_id: req.user.id,
      movement_type: 'ajuste',
      quantity: difference,
      previous_stock: previousStock,
      new_stock: new_quantity,
      notes: notes || `Ajuste de inventario: ${previousStock} → ${new_quantity}`
    });

    res.status(201).json({
      message: 'Inventario ajustado correctamente',
      movement,
      product: {
        id: product.id,
        name: product.name,
        stock: new_quantity
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al ajustar inventario' });
  }
};

// Reporte de movimientos
exports.getReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const movements = await StockMovement.findAll({
      where,
      attributes: [
        'movement_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
      ],
      group: ['movement_type']
    });

    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte' });
  }
};
