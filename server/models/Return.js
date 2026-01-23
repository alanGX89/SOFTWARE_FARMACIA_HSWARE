const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Return = sequelize.define('Return', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  return_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  sale_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sales',
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
  return_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['devolucion', 'cambio', 'nota_credito']]
    }
  },
  reason: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['defectuoso', 'equivocado', 'no_satisfecho', 'vencido', 'otro']]
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  refund_method: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['efectivo', 'tarjeta', 'nota_credito', 'cambio_producto']]
    }
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'completada',
    validate: {
      isIn: [['pendiente', 'completada', 'cancelada']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'returns',
  hooks: {
    beforeCreate: async (returnRecord) => {
      const count = await Return.count();
      returnRecord.return_number = `DEV-${String(count + 1).padStart(6, '0')}`;
    }
  }
});

module.exports = Return;
