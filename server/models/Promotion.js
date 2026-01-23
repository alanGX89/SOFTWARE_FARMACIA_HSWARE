const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  discount_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['porcentaje', 'monto_fijo', '2x1', '3x2']]
    }
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  min_purchase: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  max_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  applies_to: {
    type: DataTypes.STRING(20),
    defaultValue: 'todos',
    validate: {
      isIn: [['todos', 'categoria', 'producto', 'cliente']]
    }
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  times_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'promotions'
});

module.exports = Promotion;
