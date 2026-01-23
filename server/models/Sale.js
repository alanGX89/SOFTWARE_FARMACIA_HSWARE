const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sale_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: { min: 0 }
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: { min: 0 }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  payment_method: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['efectivo', 'tarjeta', 'transferencia', 'credito']]
    }
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    validate: { min: 0 }
  },
  change_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: { min: 0 }
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  customer_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cashier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  promotion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'promotions',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'completada',
    validate: {
      isIn: [['completada', 'cancelada', 'pendiente']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sales',
  hooks: {
    beforeCreate: async (sale) => {
      const count = await Sale.count();
      sale.sale_number = `V-${String(count + 1).padStart(6, '0')}`;
    }
  }
});

module.exports = Sale;
