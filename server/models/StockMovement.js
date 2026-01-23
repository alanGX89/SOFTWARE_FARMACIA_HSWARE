const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  movement_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['entrada', 'salida', 'ajuste', 'devolucion', 'venta', 'vencimiento']]
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  previous_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  new_stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reference_type: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'stock_movements'
});

module.exports = StockMovement;
