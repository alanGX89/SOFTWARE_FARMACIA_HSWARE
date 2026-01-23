const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del producto es requerido' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['medicamento', 'suplemento', 'cuidado_personal', 'equipamiento', 'otro']]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  min_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  expiration_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  requires_prescription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  getterMethods: {
    isLowStock() {
      return this.stock <= this.min_stock;
    },
    profit() {
      return parseFloat(this.price) - parseFloat(this.cost);
    }
  }
});

module.exports = Product;
