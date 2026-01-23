# Documentacion de Modelos de Datos

Este documento describe todos los modelos de la base de datos del sistema PharmaCare Pro.

---

## Indice

1. [User (Usuario)](#user-usuario)
2. [Product (Producto)](#product-producto)
3. [Supplier (Proveedor)](#supplier-proveedor)
4. [Customer (Cliente)](#customer-cliente)
5. [Sale (Venta)](#sale-venta)
6. [SaleItem (Item de Venta)](#saleitem-item-de-venta)
7. [StockMovement (Movimiento de Stock)](#stockmovement-movimiento-de-stock)
8. [Promotion (Promocion)](#promotion-promocion)
9. [Return (Devolucion)](#return-devolucion)
10. [ReturnItem (Item de Devolucion)](#returnitem-item-de-devolucion)
11. [Alert (Alerta)](#alert-alerta)

---

## User (Usuario)

Modelo para gestionar los usuarios del sistema.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| name | STRING(100) | Si | No | Nombre completo |
| email | STRING(100) | Si | Si | Correo electronico |
| password | STRING(255) | Si | No | Contrasena encriptada |
| role | STRING(20) | No | No | Rol: admin, pharmacist, cashier |
| phone | STRING(20) | No | No | Telefono |
| active | BOOLEAN | No | No | Estado activo (default: true) |
| created_at | TIMESTAMP | Auto | No | Fecha de creacion |
| updated_at | TIMESTAMP | Auto | No | Fecha de actualizacion |

### Roles disponibles
- `admin` - Administrador con acceso total
- `pharmacist` - Farmaceutico con acceso a inventario
- `cashier` - Cajero solo punto de venta

### Archivo
`server/models/User.js`

---

## Product (Producto)

Modelo para el catalogo de productos de la farmacia.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| name | STRING(200) | Si | No | Nombre del producto |
| description | TEXT | No | No | Descripcion detallada |
| barcode | STRING(50) | No | Si | Codigo de barras |
| category | STRING(30) | Si | No | Categoria del producto |
| price | DECIMAL(10,2) | Si | No | Precio de venta |
| cost | DECIMAL(10,2) | Si | No | Costo de adquisicion |
| stock | INTEGER | Si | No | Cantidad en inventario |
| min_stock | INTEGER | No | No | Stock minimo (default: 10) |
| supplier_id | INTEGER | No | No | FK a Supplier |
| expiration_date | DATE | No | No | Fecha de vencimiento |
| requires_prescription | BOOLEAN | No | No | Requiere receta (default: false) |
| active | BOOLEAN | No | No | Activo (default: true) |

### Categorias disponibles
- `medicamento` - Medicamentos
- `suplemento` - Suplementos alimenticios
- `cuidado_personal` - Productos de cuidado personal
- `equipamiento` - Equipo medico
- `otro` - Otros productos

### Relaciones
- `belongsTo` Supplier (proveedor)
- `hasMany` SaleItem (items de venta)
- `hasMany` StockMovement (movimientos)
- `hasMany` Alert (alertas)

### Archivo
`server/models/Product.js`

---

## Supplier (Proveedor)

Modelo para gestionar proveedores.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| name | STRING(200) | Si | No | Nombre/Razon social |
| contact_name | STRING(100) | No | No | Nombre de contacto |
| email | STRING(100) | No | No | Correo electronico |
| phone | STRING(20) | Si | No | Telefono principal |
| address_street | STRING(255) | No | No | Calle y numero |
| address_city | STRING(100) | No | No | Ciudad |
| address_state | STRING(100) | No | No | Estado/Provincia |
| address_zip_code | STRING(20) | No | No | Codigo postal |
| address_country | STRING(100) | No | No | Pais (default: Mexico) |
| tax_id | STRING(50) | No | No | RFC/RUT |
| notes | TEXT | No | No | Notas adicionales |
| active | BOOLEAN | No | No | Activo (default: true) |

### Relaciones
- `hasMany` Product (productos)

### Archivo
`server/models/Supplier.js`

---

## Customer (Cliente)

Modelo para clientes registrados con sistema de puntos.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| name | STRING(100) | Si | No | Nombre completo |
| email | STRING(100) | No | No | Correo electronico |
| phone | STRING(20) | No | No | Telefono |
| address | STRING(255) | No | No | Direccion |
| tax_id | STRING(20) | No | No | RFC para facturacion |
| birth_date | DATE | No | No | Fecha de nacimiento |
| notes | TEXT | No | No | Notas |
| points | INTEGER | No | No | Puntos acumulados (default: 0) |
| total_purchases | DECIMAL(12,2) | No | No | Total de compras |
| active | BOOLEAN | No | No | Activo (default: true) |

### Relaciones
- `hasMany` Sale (ventas)

### Archivo
`server/models/Customer.js`

---

## Sale (Venta)

Modelo para el encabezado de ventas.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| sale_number | STRING(20) | Si | Si | Numero de venta (VTA-XXX) |
| subtotal | DECIMAL(10,2) | Si | No | Subtotal sin impuestos |
| tax | DECIMAL(10,2) | No | No | Impuestos |
| discount | DECIMAL(10,2) | No | No | Descuento aplicado |
| total | DECIMAL(10,2) | Si | No | Total de la venta |
| payment_method | STRING(20) | Si | No | Metodo de pago |
| amount_paid | DECIMAL(10,2) | No | No | Monto pagado |
| change_amount | DECIMAL(10,2) | No | No | Cambio |
| customer_name | STRING(100) | No | No | Nombre del cliente |
| customer_phone | STRING(20) | No | No | Telefono del cliente |
| customer_email | STRING(100) | No | No | Email del cliente |
| cashier_id | INTEGER | Si | No | FK a User (cajero) |
| customer_id | INTEGER | No | No | FK a Customer |
| promotion_id | INTEGER | No | No | FK a Promotion |
| status | STRING(20) | No | No | Estado de la venta |
| notes | TEXT | No | No | Notas |

### Metodos de pago
- `efectivo` - Pago en efectivo
- `tarjeta` - Tarjeta de credito/debito
- `transferencia` - Transferencia bancaria
- `mixto` - Pago mixto

### Estados
- `completada` - Venta finalizada
- `cancelada` - Venta cancelada
- `pendiente` - Venta pendiente

### Relaciones
- `belongsTo` User (cajero)
- `belongsTo` Customer (cliente)
- `belongsTo` Promotion (promocion)
- `hasMany` SaleItem (items)
- `hasMany` Return (devoluciones)

### Archivo
`server/models/Sale.js`

---

## SaleItem (Item de Venta)

Modelo para el detalle de productos en una venta.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| sale_id | INTEGER | Si | No | FK a Sale |
| product_id | INTEGER | Si | No | FK a Product |
| product_name | STRING(200) | Si | No | Nombre del producto |
| quantity | INTEGER | Si | No | Cantidad vendida |
| unit_price | DECIMAL(10,2) | Si | No | Precio unitario |
| subtotal | DECIMAL(10,2) | Si | No | Subtotal del item |

### Relaciones
- `belongsTo` Sale (venta)
- `belongsTo` Product (producto)

### Archivo
`server/models/SaleItem.js`

---

## StockMovement (Movimiento de Stock)

Modelo para registrar historial de movimientos de inventario.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| product_id | INTEGER | Si | No | FK a Product |
| user_id | INTEGER | Si | No | FK a User |
| movement_type | STRING(20) | Si | No | Tipo de movimiento |
| quantity | INTEGER | Si | No | Cantidad movida |
| previous_stock | INTEGER | Si | No | Stock anterior |
| new_stock | INTEGER | Si | No | Stock nuevo |
| reference_type | STRING(20) | No | No | Tipo de referencia |
| reference_id | INTEGER | No | No | ID de referencia |
| cost | DECIMAL(10,2) | No | No | Costo del movimiento |
| notes | TEXT | No | No | Notas |

### Tipos de movimiento
- `entrada` - Entrada de mercancia
- `salida` - Salida de mercancia
- `ajuste` - Ajuste de inventario
- `venta` - Salida por venta
- `devolucion` - Entrada por devolucion

### Relaciones
- `belongsTo` Product (producto)
- `belongsTo` User (usuario)

### Archivo
`server/models/StockMovement.js`

---

## Promotion (Promocion)

Modelo para promociones y codigos de descuento.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| name | STRING(100) | Si | No | Nombre de la promocion |
| description | TEXT | No | No | Descripcion |
| discount_type | STRING(20) | Si | No | Tipo de descuento |
| discount_value | DECIMAL(10,2) | Si | No | Valor del descuento |
| min_purchase | DECIMAL(10,2) | No | No | Compra minima |
| max_discount | DECIMAL(10,2) | No | No | Descuento maximo |
| start_date | TIMESTAMP | Si | No | Fecha de inicio |
| end_date | TIMESTAMP | Si | No | Fecha de fin |
| applies_to | STRING(20) | No | No | Aplica a |
| category | STRING(30) | No | No | Categoria especifica |
| product_id | INTEGER | No | No | FK a Product |
| usage_limit | INTEGER | No | No | Limite de usos |
| times_used | INTEGER | No | No | Veces usado |
| code | STRING(20) | No | Si | Codigo promocional |
| active | BOOLEAN | No | No | Activo (default: true) |

### Tipos de descuento
- `porcentaje` - Descuento en porcentaje
- `monto_fijo` - Descuento en monto fijo

### Aplica a
- `todos` - Todos los productos
- `categoria` - Categoria especifica
- `producto` - Producto especifico

### Relaciones
- `belongsTo` Product (producto)
- `hasMany` Sale (ventas)

### Archivo
`server/models/Promotion.js`

---

## Return (Devolucion)

Modelo para el encabezado de devoluciones.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| return_number | STRING(20) | Si | Si | Numero de devolucion |
| sale_id | INTEGER | Si | No | FK a Sale original |
| user_id | INTEGER | Si | No | FK a User |
| return_type | STRING(20) | Si | No | Tipo de devolucion |
| reason | STRING(50) | Si | No | Motivo de devolucion |
| total_amount | DECIMAL(10,2) | Si | No | Monto total devuelto |
| refund_method | STRING(20) | No | No | Metodo de reembolso |
| status | STRING(20) | No | No | Estado |
| notes | TEXT | No | No | Notas |

### Tipos de devolucion
- `total` - Devolucion total
- `parcial` - Devolucion parcial

### Motivos
- `defectuoso` - Producto defectuoso
- `error_venta` - Error en la venta
- `insatisfaccion` - Cliente insatisfecho
- `vencido` - Producto vencido
- `otro` - Otro motivo

### Relaciones
- `belongsTo` Sale (venta original)
- `belongsTo` User (usuario)
- `hasMany` ReturnItem (items)

### Archivo
`server/models/Return.js`

---

## ReturnItem (Item de Devolucion)

Modelo para el detalle de productos devueltos.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| return_id | INTEGER | Si | No | FK a Return |
| product_id | INTEGER | Si | No | FK a Product |
| product_name | STRING(200) | Si | No | Nombre del producto |
| quantity | INTEGER | Si | No | Cantidad devuelta |
| unit_price | DECIMAL(10,2) | Si | No | Precio unitario |
| subtotal | DECIMAL(10,2) | Si | No | Subtotal |
| return_to_stock | BOOLEAN | No | No | Regresar a stock |

### Relaciones
- `belongsTo` Return (devolucion)
- `belongsTo` Product (producto)

### Archivo
`server/models/ReturnItem.js`

---

## Alert (Alerta)

Modelo para alertas del sistema.

### Campos

| Campo | Tipo | Requerido | Unico | Descripcion |
|-------|------|-----------|-------|-------------|
| id | INTEGER | Auto | Si | Identificador unico |
| alert_type | STRING(30) | Si | No | Tipo de alerta |
| severity | STRING(10) | No | No | Severidad |
| title | STRING(100) | Si | No | Titulo |
| message | TEXT | Si | No | Mensaje |
| product_id | INTEGER | No | No | FK a Product |
| is_read | BOOLEAN | No | No | Leida (default: false) |
| read_by | INTEGER | No | No | Leida por (user_id) |
| read_at | TIMESTAMP | No | No | Fecha de lectura |
| auto_generated | BOOLEAN | No | No | Generada automaticamente |

### Tipos de alerta
- `stock_bajo` - Stock por debajo del minimo
- `sin_stock` - Producto agotado
- `por_vencer` - Producto proximo a vencer
- `vencido` - Producto vencido

### Severidad
- `info` - Informativo
- `warning` - Advertencia
- `danger` - Critico

### Relaciones
- `belongsTo` Product (producto)

### Archivo
`server/models/Alert.js`

---

## Relaciones entre Modelos

```
User ──────────────────┐
  │                    │
  │ hasMany            │ hasMany
  ▼                    ▼
Sale              StockMovement
  │                    │
  │ hasMany            │ belongsTo
  ▼                    ▼
SaleItem ──────── Product ──────── Supplier
                   │   │
                   │   │ hasMany
                   │   ▼
                   │  Alert
                   │
                   │ hasOne (opcional)
                   ▼
               Promotion

Return ───────── ReturnItem
  │
  │ belongsTo
  ▼
Sale

Customer ────────── Sale
```

---

## Configuracion de Relaciones

Archivo: `server/models/index.js`

```javascript
// Usuario - Ventas (cajero)
User.hasMany(Sale, { foreignKey: 'cashier_id', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'cashier_id', as: 'cashier' });

// Proveedor - Productos
Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// Venta - Items
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });

// Producto - Items de venta
Product.hasMany(SaleItem, { foreignKey: 'product_id' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });

// Cliente - Ventas
Customer.hasMany(Sale, { foreignKey: 'customer_id', as: 'purchases' });
Sale.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Promocion - Ventas
Promotion.hasMany(Sale, { foreignKey: 'promotion_id' });
Sale.belongsTo(Promotion, { foreignKey: 'promotion_id', as: 'promotion' });

// Producto - Movimientos de stock
Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Usuario - Movimientos de stock
User.hasMany(StockMovement, { foreignKey: 'user_id' });
StockMovement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Venta - Devoluciones
Sale.hasMany(Return, { foreignKey: 'sale_id', as: 'returns' });
Return.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

// Devolucion - Items
Return.hasMany(ReturnItem, { foreignKey: 'return_id', as: 'items' });
ReturnItem.belongsTo(Return, { foreignKey: 'return_id' });

// Producto - Alertas
Product.hasMany(Alert, { foreignKey: 'product_id', as: 'alerts' });
Alert.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
```

---

*Documentacion generada para PharmaCare Pro v2.0*
