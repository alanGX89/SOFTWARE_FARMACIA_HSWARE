const { Alert, Product } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las alertas
exports.getAll = async (req, res) => {
  try {
    const { is_read, alert_type, severity } = req.query;
    const where = {};

    if (is_read !== undefined) {
      where.is_read = is_read === 'true';
    }

    if (alert_type) {
      where.alert_type = alert_type;
    }

    if (severity) {
      where.severity = severity;
    }

    const alerts = await Alert.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'stock', 'min_stock']
      }],
      order: [['created_at', 'DESC']],
      limit: 100
    });

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener alertas' });
  }
};

// Obtener alertas no leídas (para el badge)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.count({
      where: { is_read: false }
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener conteo de alertas' });
  }
};

// Marcar alerta como leída
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    await alert.update({
      is_read: true,
      read_by: req.user.id,
      read_at: new Date()
    });

    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al marcar alerta como leída' });
  }
};

// Marcar todas como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.update(
      {
        is_read: true,
        read_by: req.user.id,
        read_at: new Date()
      },
      { where: { is_read: false } }
    );

    res.json({ message: 'Todas las alertas marcadas como leídas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al marcar alertas como leídas' });
  }
};

// Eliminar alerta
exports.delete = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    await alert.destroy();
    res.json({ message: 'Alerta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar alerta' });
  }
};

// Generar alertas de stock bajo
exports.generateStockAlerts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { active: true }
    });

    let created = 0;

    for (const product of products) {
      // Alerta de stock bajo
      if (product.stock <= product.min_stock && product.stock > 0) {
        const existingAlert = await Alert.findOne({
          where: {
            product_id: product.id,
            alert_type: 'stock_bajo',
            is_read: false
          }
        });

        if (!existingAlert) {
          await Alert.create({
            alert_type: 'stock_bajo',
            severity: 'warning',
            title: 'Stock Bajo',
            message: `El producto "${product.name}" tiene stock bajo (${product.stock} unidades). Mínimo requerido: ${product.min_stock}`,
            product_id: product.id,
            auto_generated: true
          });
          created++;
        }
      }

      // Alerta sin stock
      if (product.stock === 0) {
        const existingAlert = await Alert.findOne({
          where: {
            product_id: product.id,
            alert_type: 'sin_stock',
            is_read: false
          }
        });

        if (!existingAlert) {
          await Alert.create({
            alert_type: 'sin_stock',
            severity: 'danger',
            title: 'Sin Stock',
            message: `El producto "${product.name}" está agotado`,
            product_id: product.id,
            auto_generated: true
          });
          created++;
        }
      }

      // Alerta productos por vencer (30 días)
      if (product.expiration_date) {
        const daysUntilExpiration = Math.ceil(
          (new Date(product.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiration <= 30 && daysUntilExpiration > 0) {
          const existingAlert = await Alert.findOne({
            where: {
              product_id: product.id,
              alert_type: 'por_vencer',
              is_read: false
            }
          });

          if (!existingAlert) {
            await Alert.create({
              alert_type: 'por_vencer',
              severity: daysUntilExpiration <= 7 ? 'danger' : 'warning',
              title: 'Producto por Vencer',
              message: `El producto "${product.name}" vence en ${daysUntilExpiration} días (${product.expiration_date})`,
              product_id: product.id,
              auto_generated: true
            });
            created++;
          }
        }

        // Alerta productos vencidos
        if (daysUntilExpiration <= 0) {
          const existingAlert = await Alert.findOne({
            where: {
              product_id: product.id,
              alert_type: 'vencido',
              is_read: false
            }
          });

          if (!existingAlert) {
            await Alert.create({
              alert_type: 'vencido',
              severity: 'danger',
              title: 'Producto Vencido',
              message: `El producto "${product.name}" está VENCIDO desde ${product.expiration_date}`,
              product_id: product.id,
              auto_generated: true
            });
            created++;
          }
        }
      }
    }

    res.json({ message: `Se generaron ${created} nuevas alertas` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar alertas' });
  }
};

// Obtener resumen de alertas
exports.getSummary = async (req, res) => {
  try {
    const [stockBajo, sinStock, porVencer, vencido, total] = await Promise.all([
      Alert.count({ where: { alert_type: 'stock_bajo', is_read: false } }),
      Alert.count({ where: { alert_type: 'sin_stock', is_read: false } }),
      Alert.count({ where: { alert_type: 'por_vencer', is_read: false } }),
      Alert.count({ where: { alert_type: 'vencido', is_read: false } }),
      Alert.count({ where: { is_read: false } })
    ]);

    res.json({
      stock_bajo: stockBajo,
      sin_stock: sinStock,
      por_vencer: porVencer,
      vencido: vencido,
      total: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener resumen de alertas' });
  }
};
