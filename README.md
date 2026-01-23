# PharmaCare Pro v2.0

Sistema integral de gestion para farmacias desarrollado con tecnologias modernas.

## Tabla de Contenidos

- [Descripcion](#descripcion)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Configuracion](#configuracion)
- [Ejecucion](#ejecucion)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Usuarios por Defecto](#usuarios-por-defecto)
- [Licencia](#licencia)

---

## Descripcion

PharmaCare Pro es un sistema completo de gestion para farmacias que incluye:

- Punto de Venta (POS)
- Control de Inventario
- Gestion de Clientes con sistema de puntos
- Gestion de Proveedores
- Promociones y Descuentos
- Devoluciones
- Alertas automaticas (stock bajo, vencimientos)
- Reportes y exportacion (PDF/Excel)
- Control de usuarios por roles

---

## Tecnologias

### Backend
| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| Node.js | 18+ | Entorno de ejecucion JavaScript |
| Express | 4.18.2 | Framework web para Node.js |
| PostgreSQL | 15+ | Base de datos relacional |
| Sequelize | 6.35.2 | ORM para Node.js |
| JWT | 9.0.2 | Autenticacion basada en tokens |
| Bcrypt.js | 2.4.3 | Encriptacion de contrasenas |
| PDFKit | 0.13.0 | Generacion de PDFs |
| ExcelJS | 4.4.0 | Generacion de archivos Excel |

### Frontend
| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| React | 18 | Biblioteca UI |
| React Router | 6 | Navegacion SPA |
| Axios | 1.6 | Cliente HTTP |
| Context API | - | Manejo de estado global |

---

## Requisitos

- Node.js 18 o superior
- PostgreSQL 15 o superior
- npm o yarn
- Git (opcional)

---

## Instalacion

### 1. Clonar o descargar el proyecto

```bash
git clone [url-del-repositorio]
cd software-para-farmacia
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd client
npm install
cd ..
```

### 4. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE pharmacare;
```

O desde la linea de comandos:

```bash
# Windows (PowerShell)
psql -U postgres -c "CREATE DATABASE pharmacare;"

# Linux/Mac
sudo -u postgres psql -c "CREATE DATABASE pharmacare;"
```

---

## Configuracion

### Variables de entorno

Crear archivo `.env` en la raiz del proyecto:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacare
DB_USER=postgres
DB_PASSWORD=tu_contrasena

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d
```

### Configuracion del Frontend

El frontend usa el puerto 4123. Archivo `client/.env`:

```env
PORT=4123
REACT_APP_API_URL=http://localhost:5000
```

---

## Ejecucion

### Desarrollo (Backend + Frontend)

```bash
npm run dev
```

### Solo Backend

```bash
npm run server
```

### Solo Frontend

```bash
npm run client
```

### Produccion

```bash
npm run build
npm start
```

### URLs de acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4123 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |

---

## Estructura del Proyecto

```
software-para-farmacia/
|
├── client/                     # Frontend React
│   ├── public/
│   │   └── logo.png           # Logo de la aplicacion
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Layout.js      # Layout principal
│   │   │   ├── Modal.js       # Componente modal
│   │   │   ├── Navbar.js      # Barra de navegacion
│   │   │   └── Sidebar.js     # Menu lateral
│   │   ├── context/
│   │   │   └── AuthContext.js # Contexto de autenticacion
│   │   ├── pages/             # Paginas/Vistas
│   │   │   ├── Dashboard.js   # Panel principal
│   │   │   ├── Login.js       # Inicio de sesion
│   │   │   ├── Products.js    # Gestion de productos
│   │   │   ├── Sales.js       # Punto de venta
│   │   │   ├── Suppliers.js   # Proveedores
│   │   │   ├── Users.js       # Usuarios
│   │   │   └── Reports.js     # Reportes
│   │   ├── services/          # Servicios API
│   │   │   ├── api.js         # Configuracion Axios
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── saleService.js
│   │   │   └── supplierService.js
│   │   ├── App.js             # Componente principal
│   │   ├── index.js           # Punto de entrada
│   │   └── index.css          # Estilos globales
│   └── package.json
│
├── server/                     # Backend Node.js
│   ├── config/
│   │   └── database.js        # Configuracion Sequelize
│   ├── controllers/           # Logica de negocio
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── saleController.js
│   │   ├── userController.js
│   │   ├── supplierController.js
│   │   ├── customerController.js
│   │   ├── stockMovementController.js
│   │   ├── promotionController.js
│   │   ├── returnController.js
│   │   ├── alertController.js
│   │   ├── exportController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js            # Middleware JWT
│   │   └── validation.js      # Validaciones
│   ├── models/                # Modelos Sequelize
│   │   ├── index.js           # Configuracion y relaciones
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   ├── SaleItem.js
│   │   ├── Supplier.js
│   │   ├── Customer.js
│   │   ├── StockMovement.js
│   │   ├── Promotion.js
│   │   ├── Return.js
│   │   ├── ReturnItem.js
│   │   └── Alert.js
│   ├── routes/                # Rutas API
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── sales.js
│   │   ├── suppliers.js
│   │   ├── customers.js
│   │   ├── stockMovements.js
│   │   ├── promotions.js
│   │   ├── returns.js
│   │   ├── alerts.js
│   │   ├── exports.js
│   │   └── reports.js
│   └── index.js               # Punto de entrada servidor
│
├── .env                        # Variables de entorno
├── package.json                # Dependencias backend
├── PUBLICIDAD.md              # Material publicitario
├── MEJORAS_V2.md              # Documentacion de mejoras
└── README.md                  # Este archivo
```

---

## API Endpoints

### Autenticacion `/api/auth`

| Metodo | Endpoint | Descripcion | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesion | No |
| GET | `/me` | Obtener usuario actual | Si |
| PUT | `/change-password` | Cambiar contrasena | Si |

### Usuarios `/api/users`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar usuarios | admin |
| GET | `/:id` | Obtener usuario | admin |
| POST | `/` | Crear usuario | admin |
| PUT | `/:id` | Actualizar usuario | admin |
| DELETE | `/:id` | Eliminar usuario | admin |

### Productos `/api/products`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar productos | Todos |
| GET | `/:id` | Obtener producto | Todos |
| GET | `/barcode/:barcode` | Buscar por codigo de barras | Todos |
| GET | `/low-stock` | Productos con stock bajo | admin, pharmacist |
| GET | `/expiring` | Productos por vencer | admin, pharmacist |
| GET | `/expired` | Productos vencidos | admin, pharmacist |
| POST | `/` | Crear producto | admin, pharmacist |
| PUT | `/:id` | Actualizar producto | admin, pharmacist |
| PATCH | `/:id/stock` | Actualizar stock | admin, pharmacist |
| DELETE | `/:id` | Eliminar producto | admin |

### Ventas `/api/sales`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar ventas | admin, pharmacist |
| GET | `/:id` | Obtener venta | Todos |
| POST | `/` | Crear venta | Todos |
| PUT | `/:id/cancel` | Cancelar venta | admin |

### Clientes `/api/customers`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar clientes | Todos |
| GET | `/:id` | Obtener cliente | Todos |
| GET | `/search` | Buscar cliente | Todos |
| POST | `/` | Crear cliente | Todos |
| PUT | `/:id` | Actualizar cliente | admin, pharmacist |
| POST | `/:id/points` | Agregar puntos | Todos |
| DELETE | `/:id` | Eliminar cliente | admin |

### Proveedores `/api/suppliers`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar proveedores | admin, pharmacist |
| GET | `/:id` | Obtener proveedor | admin, pharmacist |
| POST | `/` | Crear proveedor | admin |
| PUT | `/:id` | Actualizar proveedor | admin |
| DELETE | `/:id` | Eliminar proveedor | admin |

### Movimientos de Stock `/api/stock-movements`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar movimientos | admin, pharmacist |
| GET | `/product/:productId` | Movimientos por producto | admin, pharmacist |
| POST | `/entry` | Registrar entrada | admin, pharmacist |
| POST | `/exit` | Registrar salida | admin, pharmacist |
| POST | `/adjust` | Ajuste de inventario | admin |

### Promociones `/api/promotions`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar promociones | Todos |
| GET | `/:id` | Obtener promocion | Todos |
| GET | `/code/:code` | Validar codigo | Todos |
| POST | `/` | Crear promocion | admin |
| PUT | `/:id` | Actualizar promocion | admin |
| DELETE | `/:id` | Eliminar promocion | admin |

### Devoluciones `/api/returns`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar devoluciones | admin, pharmacist |
| GET | `/:id` | Obtener devolucion | admin, pharmacist |
| POST | `/` | Crear devolucion | admin, pharmacist |

### Alertas `/api/alerts`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar alertas | admin, pharmacist |
| POST | `/generate` | Generar alertas | admin |
| PUT | `/:id/read` | Marcar como leida | admin, pharmacist |
| DELETE | `/:id` | Eliminar alerta | admin |

### Exportaciones `/api/exports`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/ticket/:saleId` | Generar ticket PDF | Todos |
| GET | `/sales/excel` | Exportar ventas Excel | admin |
| GET | `/inventory/excel` | Exportar inventario Excel | admin, pharmacist |

### Reportes `/api/reports`

| Metodo | Endpoint | Descripcion | Rol |
|--------|----------|-------------|-----|
| GET | `/dashboard` | Estadisticas dashboard | admin, pharmacist |
| GET | `/sales` | Reporte de ventas | admin |
| GET | `/products/top` | Productos mas vendidos | admin, pharmacist |

---

## Base de Datos

### Diagrama de Entidades

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Users     │     │  Suppliers  │     │  Customers  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ name        │     │ name        │     │ name        │
│ email       │     │ contact_name│     │ email       │
│ password    │     │ email       │     │ phone       │
│ role        │     │ phone       │     │ points      │
│ phone       │     │ address_*   │     │ total_purch │
│ active      │     │ tax_id      │     │ active      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sales     │◄────│  Products   │     │ Promotions  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ sale_number │     │ name        │     │ name        │
│ subtotal    │     │ barcode     │     │ discount_*  │
│ tax         │     │ category    │     │ code        │
│ total       │     │ price/cost  │     │ start_date  │
│ cashier_id  │     │ stock       │     │ end_date    │
│ customer_id │     │ min_stock   │     │ active      │
│ promotion_id│     │ supplier_id │     └─────────────┘
└─────────────┘     │ expiration  │
       │            └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Sale_Items  │     │Stock_Movem. │
├─────────────┤     ├─────────────┤
│ id          │     │ id          │
│ sale_id     │     │ product_id  │
│ product_id  │     │ user_id     │
│ quantity    │     │ type        │
│ unit_price  │     │ quantity    │
│ subtotal    │     │ prev_stock  │
└─────────────┘     │ new_stock   │
                    └─────────────┘

┌─────────────┐     ┌─────────────┐
│  Returns    │     │   Alerts    │
├─────────────┤     ├─────────────┤
│ id          │     │ id          │
│ return_num  │     │ alert_type  │
│ sale_id     │     │ severity    │
│ user_id     │     │ title       │
│ reason      │     │ message     │
│ total       │     │ product_id  │
│ status      │     │ is_read     │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│Return_Items │
├─────────────┤
│ id          │
│ return_id   │
│ product_id  │
│ quantity    │
│ unit_price  │
└─────────────┘
```

### Tablas

| Tabla | Descripcion |
|-------|-------------|
| users | Usuarios del sistema |
| products | Catalogo de productos |
| suppliers | Proveedores |
| customers | Clientes registrados |
| sales | Encabezado de ventas |
| sale_items | Detalle de ventas |
| stock_movements | Historial de movimientos de inventario |
| promotions | Promociones y descuentos |
| returns | Encabezado de devoluciones |
| return_items | Detalle de devoluciones |
| alerts | Alertas del sistema |

---

## Usuarios por Defecto

El sistema crea automaticamente estos usuarios al iniciar por primera vez:

| Rol | Email | Contrasena | Permisos |
|-----|-------|------------|----------|
| Administrador | admin@farmacia.com | Admin123! | Control total |
| Farmaceutico | farmaceutico@farmacia.com | Farm123! | Inventario, ventas, reportes |
| Cajero | cajero@farmacia.com | Cajero123! | Solo punto de venta |

---

## Roles y Permisos

### Administrador (admin)
- Acceso completo a todos los modulos
- Gestion de usuarios
- Configuracion del sistema
- Reportes completos
- Exportaciones

### Farmaceutico (pharmacist)
- Gestion de inventario
- Gestion de productos
- Punto de venta
- Reportes basicos
- Gestion de proveedores

### Cajero (cashier)
- Solo punto de venta
- Consulta de productos
- Registro de clientes

---

## Scripts Disponibles

```bash
# Instalar todas las dependencias
npm run install-all

# Desarrollo (backend + frontend)
npm run dev

# Solo backend con nodemon
npm run server

# Solo frontend
npm run client

# Build de produccion
npm run build

# Sincronizar base de datos
npm run db:sync
```

---

## Seguridad

- Contrasenas encriptadas con bcrypt (salt rounds: 10)
- Autenticacion mediante JWT con expiracion configurable
- Middleware de autorizacion por roles
- Validacion de datos de entrada
- Proteccion contra SQL injection (Sequelize ORM)
- CORS configurado

---

## Licencia

MIT License - Ver archivo LICENSE para mas detalles.

---

*PharmaCare Pro v2.0 - Desarrollado con Node.js, React y PostgreSQL*
