# PharmaCare Pro v2.0 - Documentacion Completa

## Sistema de Gestion para Farmacias

---

# INDICE

1. [Introduccion](#1-introduccion)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Backend - Explicacion del Codigo](#5-backend---explicacion-del-codigo)
6. [Frontend - Explicacion del Codigo](#6-frontend---explicacion-del-codigo)
7. [Base de Datos](#7-base-de-datos)
8. [API REST - Endpoints](#8-api-rest---endpoints)
9. [Autenticacion y Seguridad](#9-autenticacion-y-seguridad)
10. [Guia de Instalacion](#10-guia-de-instalacion)
11. [Configuracion](#11-configuracion)
12. [Uso del Sistema](#12-uso-del-sistema)

---

# 1. INTRODUCCION

## Que es PharmaCare Pro?

PharmaCare Pro es un sistema completo de gestion para farmacias que permite:

- Gestionar inventario de productos
- Realizar ventas (Punto de Venta)
- Controlar stock y alertas de vencimiento
- Administrar clientes con sistema de puntos
- Gestionar proveedores
- Crear promociones y descuentos
- Procesar devoluciones
- Generar reportes en PDF y Excel
- Control de usuarios por roles
- **Consultas Medicas** (toma de presion, glucosa, inyecciones, curaciones)

## Modelo de Negocio

```
┌─────────────────────────────────────────────────────────────┐
│                      FARMACIA                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PROVEEDORES ──► PRODUCTOS ──► VENTAS ──► CLIENTES          │
│       │              │            │           │              │
│       │              ▼            ▼           │              │
│       │         INVENTARIO    REPORTES       │              │
│       │              │            │           │              │
│       └──────► ALERTAS ◄─────────┴───────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# 2. ARQUITECTURA DEL SISTEMA

## Arquitectura Cliente-Servidor

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                             │
│                  (Chrome, Firefox, etc.)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                    Puerto: 4123                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Paginas: Login, Dashboard, Products, Sales, etc.       ││
│  │  Componentes: Layout, Modal, Navbar, Sidebar            ││
│  │  Servicios: API calls con Axios                         ││
│  │  Estado: Context API (AuthContext)                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)               │
│                    Puerto: 5000                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Middleware: CORS, Morgan, JWT Auth                     ││
│  │  Rutas: /api/auth, /api/products, /api/sales, etc.      ││
│  │  Controladores: Logica de negocio                       ││
│  │  Modelos: Definicion de tablas (Sequelize)              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL (Sequelize ORM)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS (PostgreSQL)                │
│                    Puerto: 5432                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Tablas: users, products, sales, customers, etc.        ││
│  │  Relaciones: Foreign Keys, Constraints                  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Patron MVC (Modelo-Vista-Controlador)

```
FRONTEND (Vista)          BACKEND (Controlador)       BASE DE DATOS (Modelo)
     │                           │                           │
     │  1. Usuario hace clic     │                           │
     │     en "Ver Productos"    │                           │
     │                           │                           │
     │  2. Peticion HTTP ───────►│                           │
     │     GET /api/products     │                           │
     │                           │  3. Controlador           │
     │                           │     procesa peticion      │
     │                           │                           │
     │                           │  4. Consulta ────────────►│
     │                           │     SELECT * FROM products│
     │                           │                           │
     │                           │  5. Datos ◄───────────────│
     │                           │     [productos]           │
     │                           │                           │
     │  6. Respuesta JSON ◄──────│                           │
     │     {products: [...]}     │                           │
     │                           │                           │
     │  7. React renderiza       │                           │
     │     la tabla de productos │                           │
     ▼                           ▼                           ▼
```

---

# 3. TECNOLOGIAS UTILIZADAS

## Backend

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Node.js** | 18+ | Entorno de ejecucion JavaScript del lado del servidor |
| **Express.js** | 4.18.2 | Framework web minimalista para crear APIs REST |
| **PostgreSQL** | 15+ | Base de datos relacional robusta y escalable |
| **Sequelize** | 6.35.2 | ORM (Object-Relational Mapping) para interactuar con la BD |
| **JSON Web Token** | 9.0.2 | Autenticacion stateless mediante tokens |
| **Bcrypt.js** | 2.4.3 | Encriptacion de contrasenas con hash seguro |
| **PDFKit** | 0.13.0 | Generacion de documentos PDF (tickets, reportes) |
| **ExcelJS** | 4.4.0 | Generacion de archivos Excel (.xlsx) |
| **Morgan** | 1.10.0 | Logger de peticiones HTTP para desarrollo |
| **CORS** | 2.8.5 | Permite peticiones desde otros dominios |
| **Dotenv** | 16.3.1 | Carga variables de entorno desde archivo .env |

## Frontend

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **React** | 18 | Biblioteca para construir interfaces de usuario |
| **React Router** | 6 | Navegacion entre paginas (SPA) |
| **Axios** | 1.6 | Cliente HTTP para comunicacion con el backend |
| **Context API** | - | Manejo de estado global (autenticacion) |
| **CSS3** | - | Estilos y diseno responsivo |

---

# 4. ESTRUCTURA DEL PROYECTO

```
software-para-farmacia/
│
├── client/                          # FRONTEND (React)
│   ├── public/
│   │   ├── index.html              # HTML principal
│   │   └── logo.png                # Logo de la farmacia
│   ├── src/
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── Layout.js           # Estructura principal (sidebar + navbar)
│   │   │   ├── Modal.js            # Ventanas modales
│   │   │   ├── Navbar.js           # Barra superior
│   │   │   └── Sidebar.js          # Menu lateral
│   │   ├── context/
│   │   │   └── AuthContext.js      # Estado global de autenticacion
│   │   ├── pages/                  # Paginas/Vistas
│   │   │   ├── Dashboard.js        # Panel principal con estadisticas
│   │   │   ├── Login.js            # Inicio de sesion
│   │   │   ├── Products.js         # CRUD de productos
│   │   │   ├── Sales.js            # Punto de venta
│   │   │   ├── Suppliers.js        # Gestion de proveedores
│   │   │   ├── Users.js            # Administracion de usuarios
│   │   │   └── Reports.js          # Reportes y estadisticas
│   │   ├── services/               # Comunicacion con API
│   │   │   ├── api.js              # Configuracion de Axios
│   │   │   ├── authService.js      # Servicios de autenticacion
│   │   │   ├── productService.js   # Servicios de productos
│   │   │   ├── saleService.js      # Servicios de ventas
│   │   │   └── supplierService.js  # Servicios de proveedores
│   │   ├── App.js                  # Componente raiz y rutas
│   │   ├── index.js                # Punto de entrada
│   │   └── index.css               # Estilos globales
│   ├── .env                        # Variables de entorno frontend
│   └── package.json                # Dependencias frontend
│
├── server/                          # BACKEND (Node.js)
│   ├── config/
│   │   └── database.js             # Configuracion de Sequelize/PostgreSQL
│   ├── controllers/                # Logica de negocio
│   │   ├── authController.js       # Login, registro, cambio password
│   │   ├── productController.js    # CRUD productos, stock, alertas
│   │   ├── saleController.js       # Crear ventas, cancelar
│   │   ├── userController.js       # CRUD usuarios
│   │   ├── supplierController.js   # CRUD proveedores
│   │   ├── customerController.js   # CRUD clientes, puntos
│   │   ├── stockMovementController.js  # Entradas/salidas inventario
│   │   ├── promotionController.js  # CRUD promociones
│   │   ├── returnController.js     # Devoluciones
│   │   ├── alertController.js      # Generar/leer alertas
│   │   ├── exportController.js     # Generar PDF/Excel
│   │   ├── reportController.js     # Estadisticas y reportes
│   │   └── consultationController.js # Consultas medicas
│   ├── middleware/
│   │   ├── auth.js                 # Verificacion JWT y roles
│   │   └── validation.js           # Validacion de datos
│   ├── models/                     # Definicion de tablas
│   │   ├── index.js                # Exporta todos los modelos + relaciones
│   │   ├── User.js                 # Modelo de usuarios
│   │   ├── Product.js              # Modelo de productos
│   │   ├── Sale.js                 # Modelo de ventas
│   │   ├── SaleItem.js             # Items de cada venta
│   │   ├── Supplier.js             # Modelo de proveedores
│   │   ├── Customer.js             # Modelo de clientes
│   │   ├── StockMovement.js        # Movimientos de inventario
│   │   ├── Promotion.js            # Promociones y descuentos
│   │   ├── Return.js               # Devoluciones
│   │   ├── ReturnItem.js           # Items devueltos
│   │   ├── Alert.js                # Alertas del sistema
│   │   └── Consultation.js         # Consultas medicas
│   ├── routes/                     # Definicion de endpoints
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── users.js                # /api/users/*
│   │   ├── products.js             # /api/products/*
│   │   ├── sales.js                # /api/sales/*
│   │   ├── suppliers.js            # /api/suppliers/*
│   │   ├── customers.js            # /api/customers/*
│   │   ├── stockMovements.js       # /api/stock-movements/*
│   │   ├── promotions.js           # /api/promotions/*
│   │   ├── returns.js              # /api/returns/*
│   │   ├── alerts.js               # /api/alerts/*
│   │   ├── exports.js              # /api/exports/*
│   │   ├── reports.js              # /api/reports/*
│   │   └── consultations.js        # /api/consultations/*
│   └── index.js                    # Punto de entrada del servidor
│
├── docs/                            # Documentacion adicional
│   ├── README.md                   # Indice de documentacion
│   ├── MODELOS.md                  # Documentacion de modelos
│   └── CONTROLADORES.md           # Documentacion de controladores
│
├── .env                             # Variables de entorno (credenciales)
├── package.json                     # Dependencias backend
├── README.md                        # Documentacion principal
├── PUBLICIDAD.md                    # Material de marketing
└── DOCUMENTACION_COMPLETA.md        # Este archivo
```

---

# 5. BACKEND - EXPLICACION DEL CODIGO

## 5.1 Punto de Entrada (server/index.js)

Este archivo inicia todo el servidor:

```javascript
// Importaciones
const express = require('express');      // Framework web
const cors = require('cors');            // Permite peticiones de otros dominios
const morgan = require('morgan');        // Log de peticiones HTTP
const path = require('path');            // Manejo de rutas de archivos
require('dotenv').config();              // Carga variables de .env

// Importa modelos y conexion a BD
const { sequelize, User } = require('./models');

// Crea la aplicacion Express
const app = express();

// MIDDLEWARE - Se ejecutan en cada peticion
app.use(cors());                         // Habilita CORS
app.use(express.json());                 // Parsea JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsea formularios
app.use(morgan('dev'));                  // Log: GET /api/products 200 5ms

// RUTAS - Cada ruta maneja un recurso
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
// ... mas rutas

// HEALTH CHECK - Para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// INICIAR SERVIDOR
async function startServer() {
  // 1. Conectar a PostgreSQL
  await sequelize.authenticate();

  // 2. Sincronizar tablas (crear si no existen)
  await sequelize.sync({ alter: true });

  // 3. Crear usuarios por defecto
  await initializeDefaultData();

  // 4. Escuchar en el puerto
  app.listen(5000, () => {
    console.log('Servidor en puerto 5000');
  });
}

startServer();
```

**Flujo de una peticion:**
```
Cliente ──► CORS ──► JSON Parser ──► Morgan ──► Ruta ──► Controlador ──► Respuesta
```

---

## 5.2 Configuracion de Base de Datos (server/config/database.js)

```javascript
const { Sequelize } = require('sequelize');

// Crear conexion a PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre: pharmacare
  process.env.DB_USER,      // Usuario: postgres
  process.env.DB_PASSWORD,  // Password: admin1234.
  {
    host: process.env.DB_HOST,     // localhost
    port: process.env.DB_PORT,     // 5432
    dialect: 'postgres',           // Tipo de BD
    logging: false                 // No mostrar queries en consola
  }
);

module.exports = { sequelize, Sequelize };
```

---

## 5.3 Modelos (server/models/)

Los modelos definen la estructura de las tablas. Ejemplo: **Product.js**

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define la tabla "products"
const Product = sequelize.define('Product', {
  // Columnas de la tabla
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true        // ID autoincremental
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false           // Obligatorio
  },
  barcode: {
    type: DataTypes.STRING(50),
    unique: true               // No puede repetirse
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['medicamento', 'suplemento', 'cuidado_personal', 'otro']]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),  // Ej: 1234567890.12
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  min_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 10           // Alerta si baja de 10
  },
  expiration_date: {
    type: DataTypes.DATE       // Fecha de vencimiento
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true         // Soft delete
  }
}, {
  tableName: 'products',       // Nombre de tabla en BD
  timestamps: true,            // created_at, updated_at
  underscored: true            // snake_case en BD
});

module.exports = Product;
```

**Esto genera en PostgreSQL:**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  barcode VARCHAR(50) UNIQUE,
  category VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 10,
  expiration_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 5.4 Relaciones entre Modelos (server/models/index.js)

```javascript
// Un producto pertenece a un proveedor
Product.belongsTo(Supplier, {
  foreignKey: 'supplier_id',  // Columna en products
  as: 'supplier'              // Alias para incluir
});

// Un proveedor tiene muchos productos
Supplier.hasMany(Product, {
  foreignKey: 'supplier_id',
  as: 'products'
});

// Una venta tiene muchos items
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });
```

**Diagrama de relaciones:**
```
                    ┌─────────────┐
                    │  Supplier   │
                    │  (1)        │
                    └──────┬──────┘
                           │ hasMany
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Product   │     │  Customer   │
│  (Cajero)   │     │    (N)      │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ hasMany           │ hasMany           │ hasMany
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Sale     │◄────│  SaleItem   │     │    Sale     │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 5.5 Controladores (server/controllers/)

Los controladores contienen la logica de negocio. Ejemplo: **productController.js**

```javascript
const { Product, Supplier } = require('../models');

// GET /api/products - Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    // Obtener parametros de busqueda
    const { search, category } = req.query;
    const where = {};

    // Construir filtros
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` }; // Busqueda insensible
    }
    if (category) {
      where.category = category;
    }

    // Consultar BD con Sequelize
    const products = await Product.findAll({
      where,
      include: [{
        model: Supplier,
        as: 'supplier',
        attributes: ['id', 'name'] // Solo estos campos
      }],
      order: [['name', 'ASC']]    // Ordenar por nombre
    });

    // Responder con JSON
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// POST /api/products - Crear producto
exports.createProduct = async (req, res) => {
  try {
    // req.body contiene los datos enviados
    const { name, price, stock, category } = req.body;

    // Crear en BD
    const product = await Product.create({
      name,
      price,
      stock,
      category,
      supplier_id: req.body.supplier
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// PUT /api/products/:id - Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    // req.params.id contiene el ID de la URL
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar campos
    await product.update(req.body);

    res.json({ message: 'Producto actualizado', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar' });
  }
};

// DELETE /api/products/:id - Eliminar (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    // En lugar de eliminar, marcamos como inactivo
    await product.update({ active: false });

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};
```

---

## 5.6 Rutas (server/routes/)

Las rutas conectan URLs con controladores. Ejemplo: **products.js**

```javascript
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Rutas publicas (solo requieren estar logueado)
router.get('/', protect, productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.get('/barcode/:barcode', protect, productController.getByBarcode);

// Rutas protegidas (requieren rol especifico)
router.post('/', protect, authorize('admin', 'pharmacist'), productController.createProduct);
router.put('/:id', protect, authorize('admin', 'pharmacist'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;
```

**Explicacion de middleware:**
```
GET /api/products
        │
        ▼
    protect() ──► Verifica token JWT valido
        │
        ▼
    authorize() ──► Verifica rol del usuario
        │
        ▼
    getAllProducts() ──► Ejecuta la logica
```

---

## 5.7 Middleware de Autenticacion (server/middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verifica que el usuario este logueado
exports.protect = async (req, res, next) => {
  try {
    // 1. Obtener token del header
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // 2. Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: 1, iat: 1234567890, exp: 1234567890 }

    // 3. Buscar usuario en BD
    const user = await User.findByPk(decoded.id);

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // 4. Agregar usuario a la peticion
    req.user = user;

    // 5. Continuar al siguiente middleware/controlador
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalido' });
  }
};

// Verifica que el usuario tenga el rol requerido
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'pharmacist']
    // req.user.role = 'cashier'

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'No tienes permiso para esta accion'
      });
    }

    next();
  };
};
```

---

# 6. FRONTEND - EXPLICACION DEL CODIGO

## 6.1 Punto de Entrada (client/src/index.js)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Renderiza la aplicacion en el elemento con id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 6.2 Componente Principal (client/src/App.js)

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importar paginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';

// Componente que protege rutas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario, redirigir a login
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>  {/* Provee el contexto de autenticacion */}
      <BrowserRouter>
        <Routes>
          {/* Ruta publica */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/products" element={
            <PrivateRoute><Products /></PrivateRoute>
          } />
          <Route path="/sales" element={
            <PrivateRoute><Sales /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 6.3 Contexto de Autenticacion (client/src/context/AuthContext.js)

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificar si hay sesion guardada
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token con el backend
      authService.getMe()
        .then(response => setUser(response.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Funcion para iniciar sesion
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token, user } = response.data;

    // Guardar token en localStorage
    localStorage.setItem('token', token);
    setUser(user);

    return user;
  };

  // Funcion para cerrar sesion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Valores disponibles en todo el arbol de componentes
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 6.4 Servicios API (client/src/services/)

### api.js - Configuracion de Axios

```javascript
import axios from 'axios';

// Crear instancia de axios con configuracion base
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL del backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Agregar token a cada peticion
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado, cerrar sesion
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### productService.js

```javascript
import api from './api';

export const productService = {
  // GET /api/products
  getAll: (params) => api.get('/api/products', { params }),

  // GET /api/products/:id
  getById: (id) => api.get(`/api/products/${id}`),

  // POST /api/products
  create: (data) => api.post('/api/products', data),

  // PUT /api/products/:id
  update: (id, data) => api.put(`/api/products/${id}`, data),

  // DELETE /api/products/:id
  delete: (id) => api.delete(`/api/products/${id}`)
};
```

---

## 6.5 Pagina de Productos (client/src/pages/Products.js)

```javascript
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

const Products = () => {
  // Estado local del componente
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await productService.getAll();
      setProducts(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar
  return (
    <div>
      <h1>Productos</h1>
      <button onClick={() => setShowModal(true)}>
        + Nuevo Producto
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
```

---

# 7. BASE DE DATOS

## 7.1 Diagrama Entidad-Relacion

```
┌─────────────────┐          ┌─────────────────┐
│     USERS       │          │   SUPPLIERS     │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ name            │          │ name            │
│ email (UNIQUE)  │          │ contact_name    │
│ password        │          │ email           │
│ role            │          │ phone           │
│ phone           │          │ address_*       │
│ active          │          │ tax_id          │
│ created_at      │          │ active          │
│ updated_at      │          └────────┬────────┘
└────────┬────────┘                   │
         │                            │ 1:N
         │ 1:N                        ▼
         ▼                   ┌─────────────────┐
┌─────────────────┐          │   PRODUCTS      │
│     SALES       │          ├─────────────────┤
├─────────────────┤          │ id (PK)         │
│ id (PK)         │          │ name            │
│ sale_number     │          │ barcode (UNIQUE)│
│ subtotal        │          │ category        │
│ tax             │          │ price           │
│ discount        │          │ cost            │
│ total           │          │ stock           │
│ payment_method  │          │ min_stock       │
│ cashier_id (FK) │──────────│ supplier_id(FK) │
│ customer_id(FK) │          │ expiration_date │
│ status          │          │ active          │
└────────┬────────┘          └────────┬────────┘
         │                            │
         │ 1:N                        │ 1:N
         ▼                            ▼
┌─────────────────┐          ┌─────────────────┐
│   SALE_ITEMS    │          │ STOCK_MOVEMENTS │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ sale_id (FK)    │          │ product_id (FK) │
│ product_id (FK) │          │ user_id (FK)    │
│ product_name    │          │ movement_type   │
│ quantity        │          │ quantity        │
│ unit_price      │          │ previous_stock  │
│ subtotal        │          │ new_stock       │
└─────────────────┘          │ notes           │
                             └─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│   CUSTOMERS     │          │   PROMOTIONS    │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ name            │          │ name            │
│ email           │          │ discount_type   │
│ phone           │          │ discount_value  │
│ points          │          │ code (UNIQUE)   │
│ total_purchases │          │ start_date      │
│ active          │          │ end_date        │
└─────────────────┘          │ active          │
                             └─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│    RETURNS      │          │     ALERTS      │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ return_number   │          │ alert_type      │
│ sale_id (FK)    │          │ severity        │
│ user_id (FK)    │          │ title           │
│ reason          │          │ message         │
│ total_amount    │          │ product_id (FK) │
│ status          │          │ is_read         │
└────────┬────────┘          └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  RETURN_ITEMS   │
├─────────────────┤
│ id (PK)         │
│ return_id (FK)  │
│ product_id (FK) │
│ quantity        │
│ unit_price      │
└─────────────────┘

┌─────────────────┐
│  CONSULTATIONS  │
├─────────────────┤
│ id (PK)         │
│ consultation_num│
│ patient_name    │
│ patient_age     │
│ patient_phone   │
│ customer_id(FK) │
│ consultation_typ│
│ symptoms        │
│ diagnosis       │
│ treatment       │
│ prescription    │
│ vital_signs     │
│ price           │
│ payment_status  │
│ attended_by(FK) │
│ status          │
└─────────────────┘
```

## 7.2 Descripcion de Tablas

| Tabla | Descripcion | Registros tipicos |
|-------|-------------|-------------------|
| users | Usuarios del sistema (admin, farmaceutico, cajero) | 3-10 |
| products | Catalogo de productos/medicamentos | 100-10,000 |
| suppliers | Proveedores de productos | 10-50 |
| customers | Clientes registrados con puntos | 100-5,000 |
| sales | Encabezado de ventas realizadas | Miles |
| sale_items | Detalle de productos por venta | Muchos miles |
| stock_movements | Historial de entradas/salidas | Muchos miles |
| promotions | Descuentos y codigos promocionales | 5-50 |
| returns | Devoluciones procesadas | Cientos |
| return_items | Productos devueltos | Cientos |
| alerts | Alertas de stock bajo/vencimiento | 10-100 |
| consultations | Consultas medicas realizadas | Cientos |

---

# 8. API REST - ENDPOINTS

## 8.1 Autenticacion

| Metodo | Endpoint | Descripcion | Body |
|--------|----------|-------------|------|
| POST | /api/auth/login | Iniciar sesion | `{email, password}` |
| GET | /api/auth/me | Usuario actual | - |
| PUT | /api/auth/change-password | Cambiar password | `{currentPassword, newPassword}` |

## 8.2 Usuarios

| Metodo | Endpoint | Descripcion | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /api/users | Listar usuarios | admin |
| GET | /api/users/:id | Obtener usuario | admin |
| POST | /api/users | Crear usuario | admin |
| PUT | /api/users/:id | Actualizar | admin |
| DELETE | /api/users/:id | Eliminar | admin |

## 8.3 Productos

| Metodo | Endpoint | Descripcion | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /api/products | Listar productos | Todos |
| GET | /api/products/:id | Obtener producto | Todos |
| GET | /api/products/barcode/:code | Buscar por codigo | Todos |
| GET | /api/products/low-stock | Stock bajo | admin, pharmacist |
| GET | /api/products/expiring | Por vencer | admin, pharmacist |
| POST | /api/products | Crear producto | admin, pharmacist |
| PUT | /api/products/:id | Actualizar | admin, pharmacist |
| DELETE | /api/products/:id | Eliminar | admin |

## 8.4 Ventas

| Metodo | Endpoint | Descripcion | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /api/sales | Listar ventas | admin, pharmacist |
| GET | /api/sales/:id | Obtener venta | Todos |
| POST | /api/sales | Crear venta | Todos |
| PUT | /api/sales/:id/cancel | Cancelar venta | admin |

## 8.5 Clientes

| Metodo | Endpoint | Descripcion | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /api/customers | Listar clientes | Todos |
| POST | /api/customers | Crear cliente | Todos |
| POST | /api/customers/:id/points | Agregar puntos | Todos |

## 8.6 Exportaciones

| Metodo | Endpoint | Descripcion | Formato |
|--------|----------|-------------|---------|
| GET | /api/exports/ticket/:saleId | Ticket de venta | PDF |
| GET | /api/exports/sales/excel | Reporte ventas | Excel |
| GET | /api/exports/inventory/excel | Inventario | Excel |

## 8.7 Consultas Medicas

| Metodo | Endpoint | Descripcion | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /api/consultations | Listar consultas | Todos |
| GET | /api/consultations/:id | Obtener consulta | Todos |
| GET | /api/consultations/types | Tipos de consulta | Todos |
| GET | /api/consultations/today | Consultas del dia | Todos |
| GET | /api/consultations/stats | Estadisticas | admin, pharmacist |
| GET | /api/consultations/patient-history | Historial paciente | Todos |
| POST | /api/consultations | Crear consulta | admin, pharmacist |
| PUT | /api/consultations/:id | Actualizar | admin, pharmacist |

### Tipos de Consulta Disponibles

| Tipo | Descripcion | Precio sugerido |
|------|-------------|-----------------|
| general | Consulta general | $50.00 |
| presion | Toma de presion arterial | $30.00 |
| glucosa | Medicion de glucosa | $40.00 |
| inyeccion | Aplicacion de inyeccion | $35.00 |
| curacion | Curacion de heridas | $60.00 |
| vacuna | Aplicacion de vacuna | $50.00 |
| otro | Otro servicio | Variable |

---

# 9. AUTENTICACION Y SEGURIDAD

## 9.1 Flujo de Autenticacion

```
1. Usuario ingresa email y password
          │
          ▼
2. Frontend envia POST /api/auth/login
          │
          ▼
3. Backend verifica credenciales
   - Busca usuario por email
   - Compara password con bcrypt
          │
          ▼
4. Si es valido, genera token JWT
   jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' })
          │
          ▼
5. Responde con token y datos del usuario
   { token: "eyJ...", user: { id, name, email, role } }
          │
          ▼
6. Frontend guarda token en localStorage
          │
          ▼
7. Cada peticion posterior incluye el token
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 9.2 Estructura del Token JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5MTIzNDU2LCJleHAiOjE3MDk3MjgyNTZ9.xyz123
    │                                    │                                              │
    │                                    │                                              │
  Header                              Payload                                       Signature
  (algoritmo)                    (datos del usuario)                            (verificacion)

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": 1, "iat": 1709123456, "exp": 1709728256 }
Signature: HMACSHA256(header + payload, JWT_SECRET)
```

## 9.3 Roles y Permisos

| Rol | Usuarios | Productos | Ventas | Proveedores | Reportes |
|-----|----------|-----------|--------|-------------|----------|
| admin | CRUD | CRUD | CRUD | CRUD | Todos |
| pharmacist | Ver | CRUD | Crear/Ver | CRUD | Basicos |
| cashier | - | Ver | Crear | - | - |

## 9.4 Seguridad Implementada

- **Passwords encriptados**: bcrypt con salt de 10 rondas
- **Tokens con expiracion**: 7 dias por defecto
- **Validacion de entrada**: express-validator
- **SQL Injection**: Prevenido por Sequelize ORM
- **CORS**: Solo permite origenes autorizados
- **Soft Delete**: Los datos nunca se eliminan fisicamente

---

# 10. GUIA DE INSTALACION

## 10.1 Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 15 o superior
- npm o yarn
- Git (opcional)

## 10.2 Pasos de Instalacion

```bash
# 1. Clonar el repositorio
git clone [url-repositorio]
cd software-para-farmacia

# 2. Instalar dependencias del backend
npm install

# 3. Instalar dependencias del frontend
cd client
npm install
cd ..

# 4. Crear base de datos en PostgreSQL
# Opcion A: Desde psql
psql -U postgres -c "CREATE DATABASE pharmacare;"

# Opcion B: Desde pgAdmin
# Click derecho en Databases > Create > Database
# Nombre: pharmacare

# 5. Configurar variables de entorno
# Copiar .env.example a .env y editar valores

# 6. Iniciar en desarrollo
npm run dev
```

## 10.3 Scripts Disponibles

```bash
npm run dev          # Inicia backend + frontend
npm run server       # Solo backend (puerto 5000)
npm run client       # Solo frontend (puerto 4123)
npm run build        # Compilar frontend para produccion
npm run install-all  # Instalar todas las dependencias
```

---

# 11. CONFIGURACION

## 11.1 Variables de Entorno (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacare
DB_USER=postgres
DB_PASSWORD=admin1234.

# JWT (JSON Web Token)
JWT_SECRET=clave_secreta_muy_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d
```

## 11.2 Configuracion del Frontend (client/.env)

```env
PORT=4123
REACT_APP_API_URL=http://localhost:5000
```

---

# 12. USO DEL SISTEMA

## 12.1 Usuarios por Defecto

| Rol | Email | Password | Acceso |
|-----|-------|----------|--------|
| Admin | admin@farmacia.com | Admin123! | Total |
| Farmaceutico | farmaceutico@farmacia.com | Farm123! | Inventario |
| Cajero | cajero@farmacia.com | Cajero123! | Ventas |

## 12.2 Flujo de Trabajo Tipico

```
1. INICIO DEL DIA
   └── Cajero inicia sesion
   └── Revisa alertas de stock bajo

2. VENTA
   └── Busca producto por nombre o codigo de barras
   └── Agrega productos al carrito
   └── Selecciona cliente (opcional)
   └── Aplica descuento/promocion (opcional)
   └── Procesa pago
   └── Imprime ticket

3. INVENTARIO
   └── Farmaceutico registra entrada de mercancia
   └── Actualiza precios si es necesario
   └── Revisa productos por vencer

4. CIERRE DEL DIA
   └── Admin genera reporte de ventas
   └── Exporta a Excel para contabilidad
   └── Revisa comisiones pendientes
```

## 12.3 URLs de Acceso

| Servicio | URL | Descripcion |
|----------|-----|-------------|
| Frontend | http://localhost:4123 | Interfaz de usuario |
| Backend API | http://localhost:5000 | API REST |
| Health Check | http://localhost:5000/api/health | Verificar servidor |

---

# APENDICE

## A. Glosario de Terminos

| Termino | Significado |
|---------|-------------|
| API | Application Programming Interface - Interfaz para comunicar sistemas |
| REST | Representational State Transfer - Arquitectura de APIs web |
| JWT | JSON Web Token - Estandar para autenticacion |
| ORM | Object-Relational Mapping - Mapeo de objetos a tablas |
| CRUD | Create, Read, Update, Delete - Operaciones basicas |
| SPA | Single Page Application - Aplicacion de una sola pagina |
| Middleware | Codigo que se ejecuta entre la peticion y la respuesta |

## B. Codigos de Estado HTTP

| Codigo | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Peticion exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Error en los datos enviados |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

## C. Comandos Utiles de PostgreSQL

```sql
-- Conectar a la base de datos
psql -U postgres -d pharmacare

-- Ver todas las tablas
\dt

-- Ver estructura de una tabla
\d products

-- Consultar productos
SELECT * FROM products LIMIT 10;

-- Ver ventas del dia
SELECT * FROM sales WHERE DATE(created_at) = CURRENT_DATE;
```

---

# 13. MODULO DE CONSULTAS MEDICAS

## 13.1 Descripcion

El modulo de consultas medicas permite a la farmacia ofrecer servicios de atencion basica como:

- **Toma de presion arterial**: Medicion y registro de signos vitales
- **Medicion de glucosa**: Control para pacientes diabeticos
- **Aplicacion de inyecciones**: Con o sin receta medica
- **Curaciones**: Tratamiento de heridas menores
- **Aplicacion de vacunas**: Servicio de vacunacion
- **Consulta general**: Orientacion farmaceutica

## 13.2 Modelo de Datos (Consultation.js)

```javascript
const Consultation = sequelize.define('Consultation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  consultation_number: { type: DataTypes.STRING(20), unique: true },
  patient_name: { type: DataTypes.STRING(100), allowNull: false },
  patient_age: DataTypes.INTEGER,
  patient_phone: DataTypes.STRING(20),
  customer_id: DataTypes.INTEGER,  // FK a customers (opcional)
  consultation_type: {
    type: DataTypes.STRING(30),
    defaultValue: 'general',
    validate: {
      isIn: [['general', 'presion', 'glucosa', 'inyeccion', 'curacion', 'vacuna', 'otro']]
    }
  },
  symptoms: DataTypes.TEXT,       // Sintomas reportados
  diagnosis: DataTypes.TEXT,      // Diagnostico u observaciones
  treatment: DataTypes.TEXT,      // Tratamiento recomendado
  prescription: DataTypes.TEXT,   // Receta sugerida
  vital_signs: DataTypes.TEXT,    // JSON: {presion, temperatura, peso, glucosa}
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  payment_status: { type: DataTypes.STRING(20), defaultValue: 'pagado' },
  attended_by: DataTypes.INTEGER, // FK a users (farmaceutico)
  status: { type: DataTypes.STRING(20), defaultValue: 'completada' }
});
```

## 13.3 Signos Vitales (JSON)

```json
{
  "presion": "120/80",
  "temperatura": "36.5",
  "peso": "70",
  "glucosa": "95",
  "pulso": "72"
}
```

## 13.4 Flujo de Trabajo

```
1. REGISTRO DE CONSULTA
   └── Seleccionar tipo de consulta
   └── Ingresar datos del paciente
   └── Registrar signos vitales

2. ATENCION
   └── Farmaceutico atiende al paciente
   └── Registra observaciones/diagnostico
   └── Recomienda tratamiento si aplica

3. COBRO
   └── Se cobra el servicio
   └── Se registra el pago
   └── Se vincula con cliente (opcional)

4. HISTORIAL
   └── El paciente puede consultar su historial
   └── Se generan estadisticas de consultas
```

## 13.5 Estadisticas Disponibles

El endpoint `/api/consultations/stats` proporciona:

- Total de consultas del dia
- Ingresos del dia por consultas
- Consultas por tipo (presion, glucosa, etc.)
- Promedio de consultas diarias
- Distribucion de pagos

---

# 14. SCRIPT DE DATOS DE EJEMPLO

## 14.1 Ejecutar el Script

Para poblar la base de datos con datos de ejemplo:

```bash
# Desde la raiz del proyecto
node server/scripts/seedData.js
```

## 14.2 Datos que se Crean

| Tipo | Cantidad | Descripcion |
|------|----------|-------------|
| Proveedores | 4 | Distribuidores farmaceuticos |
| Productos | 30 | Medicamentos y material de curacion |
| Clientes | 12 | Clientes frecuentes |
| Ventas | 15 | Ventas de ejemplo (ultimos 30 dias) |
| Movimientos Stock | 20 | Entradas y salidas |
| Consultas | 12 | Consultas medicas (ultimos 14 dias) |

## 14.3 Categorias de Productos

- Analgesicos (Paracetamol, Ibuprofeno, etc.)
- Antibioticos (Amoxicilina, Azitromicina, etc.)
- Antihipertensivos (Losartan, Enalapril, etc.)
- Antidiabeticos (Metformina, Glibenclamida)
- Gastrointestinales (Omeprazol, Ranitidina)
- Antigripales y jarabes
- Vitaminas y suplementos
- Dermatologicos
- Material de curacion
- Antiinflamatorios
- Antihistaminicos

---

*Documentacion generada para PharmaCare Pro v2.0*
*Sistema de Gestion para Farmacias*
