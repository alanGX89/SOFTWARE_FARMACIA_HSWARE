const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  consultation_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  patient_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  patient_age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  patient_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  patient_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  consultation_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'general',
    validate: {
      isIn: [['general', 'presion', 'glucosa', 'inyeccion', 'curacion', 'vacuna', 'otro']]
    }
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vital_signs: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('vital_signs');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('vital_signs', value ? JSON.stringify(value) : null);
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  payment_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pagado',
    validate: {
      isIn: [['pendiente', 'pagado']]
    }
  },
  payment_method: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  attended_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  follow_up_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'completada',
    validate: {
      isIn: [['en_espera', 'en_curso', 'completada', 'cancelada']]
    }
  }
}, {
  tableName: 'consultations',
  timestamps: true,
  underscored: true
});

module.exports = Consultation;
