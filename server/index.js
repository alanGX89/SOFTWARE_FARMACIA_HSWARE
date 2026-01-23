const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { sequelize, User } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/stock-movements', require('./routes/stockMovements'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/exports', require('./routes/exports'));
app.use('/api/consultations', require('./routes/consultations'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente', database: 'PostgreSQL' });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize default data
async function initializeDefaultData() {
  try {
    const userCount = await User.count();

    if (userCount === 0) {
      console.log('Creando usuarios por defecto...');

      const defaultUsers = [
        {
          name: 'Administrador',
          email: 'admin@farmacia.com',
          password: 'Admin123!',
          role: 'admin',
          phone: '1234567890'
        },
        {
          name: 'Farmacéutico Principal',
          email: 'farmaceutico@farmacia.com',
          password: 'Farm123!',
          role: 'pharmacist',
          phone: '1234567891'
        },
        {
          name: 'Cajero Principal',
          email: 'cajero@farmacia.com',
          password: 'Cajero123!',
          role: 'cashier',
          phone: '1234567892'
        }
      ];

      for (const userData of defaultUsers) {
        await User.create(userData);
        console.log(`✓ Usuario creado: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error('Error al crear usuarios por defecto:', error);
  }
}

// Connect to database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.authenticate();
    console.log('✓ Conectado a PostgreSQL');

    // Sincronizar tablas (alter: true para actualizar sin perder datos)
    await sequelize.sync({ alter: true });
    console.log('✓ Tablas sincronizadas');

    // Crear datos iniciales
    await initializeDefaultData();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
      console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Base de datos: PostgreSQL - ${process.env.DB_NAME || 'postgres'}`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
