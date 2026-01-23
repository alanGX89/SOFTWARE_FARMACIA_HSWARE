const { Op, fn, col, literal } = require('sequelize');
const { sequelize, Sale, SaleItem, Product, User } = require('../models');

// Dashboard general
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Ventas del día
    const todaySales = await Sale.findAll({
      where: {
        created_at: { [Op.gte]: today },
        status: 'completada'
      }
    });

    // Ventas del mes
    const monthSales = await Sale.findAll({
      where: {
        created_at: { [Op.gte]: thisMonth },
        status: 'completada'
      }
    });

    // Productos con stock bajo
    const products = await Product.findAll({ where: { active: true } });
    const lowStockProducts = products.filter(p => p.stock <= p.min_stock).length;

    // Total de productos
    const totalProducts = await Product.count({ where: { active: true } });

    // Usuarios activos
    const activeUsers = await User.count({ where: { active: true } });

    const todayTotal = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const monthTotal = monthSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);

    res.json({
      today: {
        sales: todaySales.length,
        total: todayTotal
      },
      month: {
        sales: monthSales.length,
        total: monthTotal
      },
      inventory: {
        totalProducts,
        lowStockProducts
      },
      users: {
        active: activeUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener dashboard' });
  }
};

// Reporte de ventas
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { status: 'completada' };

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const sales = await Sale.findAll({
      where,
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'totalSales'],
        [fn('SUM', col('total')), 'totalAmount']
      ],
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'DESC']]
    });

    res.json({ report: sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte de ventas' });
  }
};

// Productos más vendidos
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await SaleItem.findAll({
      attributes: [
        'product_id',
        'product_name',
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('subtotal')), 'totalRevenue']
      ],
      include: [{
        model: Sale,
        as: 'sale',
        attributes: [],
        where: { status: 'completada' }
      }],
      group: ['product_id', 'product_name'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    const formatted = topProducts.map(p => ({
      _id: p.product_id,
      productName: p.product_name,
      totalQuantity: parseInt(p.getDataValue('totalQuantity')),
      totalRevenue: parseFloat(p.getDataValue('totalRevenue'))
    }));

    res.json({ topProducts: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos más vendidos' });
  }
};

// Reporte de inventario
exports.getInventoryReport = async (req, res) => {
  try {
    const totalProducts = await Product.count({ where: { active: true } });

    const products = await Product.findAll({ where: { active: true } });

    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.cost) * p.stock), 0);
    const totalRetailValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);

    const lowStock = products.filter(p => p.stock <= p.min_stock).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    // Agrupar por categoría
    const byCategory = await Product.findAll({
      where: { active: true },
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('stock')), 'totalStock'],
        [fn('SUM', literal('cost * stock')), 'totalValue']
      ],
      group: ['category']
    });

    const formattedByCategory = byCategory.map(c => ({
      _id: c.category,
      count: parseInt(c.getDataValue('count')),
      totalStock: parseInt(c.getDataValue('totalStock')) || 0,
      totalValue: parseFloat(c.getDataValue('totalValue')) || 0
    }));

    res.json({
      summary: {
        totalProducts,
        lowStock,
        outOfStock,
        totalCostValue: totalValue,
        totalRetailValue: totalRetailValue,
        potentialProfit: totalRetailValue - totalValue
      },
      byCategory: formattedByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte de inventario' });
  }
};

// Reporte de cajeros
exports.getCashierReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { status: 'completada' };

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const cashierStats = await Sale.findAll({
      where,
      attributes: [
        'cashier_id',
        [fn('COUNT', col('Sale.id')), 'totalSales'],
        [fn('SUM', col('total')), 'totalAmount'],
        [fn('AVG', col('total')), 'averageTicket']
      ],
      include: [{
        model: User,
        as: 'cashier',
        attributes: ['id', 'name', 'email']
      }],
      group: ['cashier_id', 'cashier.id', 'cashier.name', 'cashier.email'],
      order: [[fn('SUM', col('total')), 'DESC']]
    });

    const formatted = cashierStats.map(s => ({
      cashierName: s.cashier?.name,
      cashierEmail: s.cashier?.email,
      totalSales: parseInt(s.getDataValue('totalSales')),
      totalAmount: parseFloat(s.getDataValue('totalAmount')),
      averageTicket: parseFloat(s.getDataValue('averageTicket'))
    }));

    res.json({ cashierStats: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte de cajeros' });
  }
};
