const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del proveedor es requerido' }
    }
  },
  contact_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El teléfono es requerido' }
    }
  },
  address_street: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  address_city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address_state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address_zip_code: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  address_country: {
    type: DataTypes.STRING(100),
    defaultValue: 'México'
  },
  tax_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'suppliers'
});

module.exports = Supplier;
