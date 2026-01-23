const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alert_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['stock_bajo', 'sin_stock', 'por_vencer', 'vencido', 'sistema']]
    }
  },
  severity: {
    type: DataTypes.STRING(10),
    defaultValue: 'warning',
    validate: {
      isIn: [['info', 'warning', 'danger']]
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  auto_generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'alerts'
});

module.exports = Alert;
