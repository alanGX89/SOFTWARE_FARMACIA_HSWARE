# PharmaCare v2.0 - Documentación de Mejoras

## Resumen de Nuevas Funcionalidades

Este documento describe todas las mejoras implementadas en la versión 2.0 del sistema PharmaCare.

---

## Tabla de Contenidos

1. [Generación de Tickets PDF](#1-generación-de-tickets-pdf)
2. [Búsqueda por Código de Barras](#2-búsqueda-por-código-de-barras)
3. [Sistema de Alertas](#3-sistema-de-alertas)
4. [Exportación de Reportes](#4-exportación-de-reportes)
5. [Módulo de Clientes](#5-módulo-de-clientes)
6. [Movimientos de Stock](#6-movimientos-de-stock)
7. [Promociones y Descuentos](#7-promociones-y-descuentos)
8. [Devoluciones](#8-devoluciones)
9. [Nuevos Endpoints API](#9-nuevos-endpoints-api)
10. [Nuevas Tablas de Base de Datos](#10-nuevas-tablas-de-base-de-datos)

---

## 1. Generación de Tickets PDF

### Descripción
Permite generar tickets de venta en formato PDF para impresión térmica (80mm).

### Endpoint
```
GET /api/exports/ticket/:saleId
```

### Características
- Formato optimizado para impresoras térmicas de 80mm
- Incluye: número de venta, fecha, cajero, productos, totales
- Muestra método de pago, monto pagado y cambio
- Descarga automática del archivo PDF

### Ejemplo de Uso
```javascript
// Descargar ticket de venta
window.open(`/api/exports/ticket/${saleId}`, '_blank');
```

---

## 2. Búsqueda por Código de Barras

### Descripción
Permite buscar productos instantáneamente usando su código de barras.

### Endpoint
```
GET /api/products/barcode/:barcode
```

### Respuesta
```json
{
  "product": {
    "id": 1,
    "name": "Paracetamol 500mg",
    "barcode": "7501234567890",
    "price": 45.00,
    "stock": 100,
    "supplier": {
      "id": 1,
      "name": "Farmacéutica ABC"
    }
  }
}
```

### Uso en Frontend
```javascript
const searchByBarcode = async (barcode) => {
  const response = await api.get(`/products/barcode/${barcode}`);
  return response.data.product;
};
```

---

## 3. Sistema de Alertas

### Descripción
Sistema automático de alertas para:
- Stock bajo
- Productos sin stock
- Productos por vencer (30 días)
- Productos vencidos

### Endpoints

#### Obtener todas las alertas
```
GET /api/alerts
```

**Parámetros de consulta:**
- `is_read` - true/false
- `alert_type` - stock_bajo, sin_stock, por_vencer, vencido
- `severity` - info, warning, danger

#### Obtener conteo de no leídas
```
GET /api/alerts/unread-count
```

#### Obtener resumen
```
GET /api/alerts/summary
```

**Respuesta:**
```json
{
  "stock_bajo": 5,
  "sin_stock": 2,
  "por_vencer": 8,
  "vencido": 1,
  "total": 16
}
```

#### Marcar como leída
```
PUT /api/alerts/:id/read
```

#### Marcar todas como leídas
```
PUT /api/alerts/mark-all-read
```

#### Generar alertas automáticas
```
POST /api/alerts/generate
```

### Tipos de Alerta

| Tipo | Severidad | Descripción |
|------|-----------|-------------|
| `stock_bajo` | warning | Stock menor o igual al mínimo |
| `sin_stock` | danger | Stock en 0 |
| `por_vencer` | warning/danger | Vence en menos de 30 días |
| `vencido` | danger | Producto ya vencido |

---

## 4. Exportación de Reportes

### Descripción
Exportar reportes en formato Excel y PDF.

### Endpoints

#### Exportar ventas a Excel
```
GET /api/exports/sales/excel?startDate=2024-01-01&endDate=2024-12-31
```

#### Exportar ventas a PDF
```
GET /api/exports/sales/pdf?startDate=2024-01-01&endDate=2024-12-31
```

#### Exportar inventario a Excel
```
GET /api/exports/inventory/excel
```

### Características del Excel de Ventas
- Número de venta
- Fecha y hora
- Cajero
- Cliente
- Subtotal, descuento, IVA, total
- Método de pago
- Estado
- Cantidad de productos

### Características del Excel de Inventario
- Código de barras
- Nombre del producto
- Categoría
- Stock actual y mínimo
- Costo y precio
- Valor total del stock
- Fecha de vencimiento
- Estado (OK, BAJO, AGOTADO)

---

## 5. Módulo de Clientes

### Descripción
Gestión completa de clientes frecuentes con sistema de puntos.

### Endpoints

#### CRUD de Clientes
```
GET    /api/customers          # Listar clientes
GET    /api/customers/:id      # Obtener cliente
POST   /api/customers          # Crear cliente
PUT    /api/customers/:id      # Actualizar cliente
DELETE /api/customers/:id      # Desactivar cliente
```

#### Búsqueda rápida
```
GET /api/customers/search?q=juan
```

#### Agregar puntos
```
PUT /api/customers/:id/points
```

### Modelo de Datos

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "5551234567",
  "address": "Calle Principal 123",
  "tax_id": "XAXX010101000",
  "birth_date": "1990-05-15",
  "notes": "Cliente VIP",
  "points": 500,
  "total_purchases": 15000.00,
  "active": true
}
```

### Sistema de Puntos
- Los puntos se acumulan automáticamente con cada compra
- Se puede configurar la tasa de conversión
- Los puntos pueden canjearse por descuentos

---

## 6. Movimientos de Stock

### Descripción
Registro completo de todas las entradas y salidas de inventario.

### Endpoints

#### Ver movimientos
```
GET /api/stock-movements
GET /api/stock-movements/product/:productId
```

**Parámetros:**
- `product_id` - Filtrar por producto
- `movement_type` - entrada, salida, ajuste, devolucion, venta
- `startDate`, `endDate` - Rango de fechas

#### Agregar stock (entrada)
```
POST /api/stock-movements/add
{
  "product_id": 1,
  "quantity": 100,
  "cost": 25.00,
  "notes": "Compra a proveedor"
}
```

#### Reducir stock (salida)
```
POST /api/stock-movements/remove
{
  "product_id": 1,
  "quantity": 10,
  "reason": "vencimiento",
  "notes": "Productos vencidos"
}
```

#### Ajuste de inventario
```
POST /api/stock-movements/adjust
{
  "product_id": 1,
  "new_quantity": 95,
  "notes": "Ajuste por conteo físico"
}
```

### Tipos de Movimiento

| Tipo | Descripción |
|------|-------------|
| `entrada` | Compra/recepción de mercancía |
| `salida` | Salida manual (merma, etc.) |
| `ajuste` | Corrección de inventario |
| `devolucion` | Producto devuelto al stock |
| `venta` | Salida por venta |
| `vencimiento` | Retiro por producto vencido |

---

## 7. Promociones y Descuentos

### Descripción
Sistema completo de promociones con códigos de descuento.

### Endpoints

#### CRUD de Promociones
```
GET    /api/promotions          # Listar promociones
GET    /api/promotions/:id      # Obtener promoción
POST   /api/promotions          # Crear promoción
PUT    /api/promotions/:id      # Actualizar promoción
DELETE /api/promotions/:id      # Desactivar promoción
```

#### Validar código de descuento
```
POST /api/promotions/validate-code
{
  "code": "VERANO2024",
  "subtotal": 500.00,
  "product_ids": [1, 2, 3]
}
```

#### Obtener promociones para un producto
```
GET /api/promotions/product/:productId
```

### Tipos de Descuento

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `porcentaje` | Porcentaje del total | 10% de descuento |
| `monto_fijo` | Cantidad fija | $50 de descuento |
| `2x1` | Paga uno, lleva dos | Promoción 2x1 |
| `3x2` | Paga dos, lleva tres | Promoción 3x2 |

### Modelo de Promoción

```json
{
  "id": 1,
  "name": "Descuento de Verano",
  "description": "10% en todos los productos",
  "discount_type": "porcentaje",
  "discount_value": 10,
  "min_purchase": 100.00,
  "max_discount": 500.00,
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "applies_to": "todos",
  "code": "VERANO2024",
  "usage_limit": 100,
  "times_used": 45,
  "active": true
}
```

### Aplicación de Promociones

| Campo `applies_to` | Descripción |
|--------------------|-------------|
| `todos` | Aplica a todos los productos |
| `categoria` | Solo productos de una categoría |
| `producto` | Solo un producto específico |
| `cliente` | Solo para ciertos clientes |

---

## 8. Devoluciones

### Descripción
Gestión completa de devoluciones y notas de crédito.

### Endpoints

#### CRUD de Devoluciones
```
GET    /api/returns          # Listar devoluciones
GET    /api/returns/:id      # Obtener devolución
POST   /api/returns          # Crear devolución
PUT    /api/returns/:id/cancel  # Cancelar devolución
```

#### Obtener items de una venta para devolver
```
GET /api/returns/sale/:saleId/items
```

### Crear Devolución

```json
POST /api/returns
{
  "sale_id": 123,
  "return_type": "devolucion",
  "reason": "defectuoso",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "return_to_stock": true
    }
  ],
  "refund_method": "efectivo",
  "notes": "Producto dañado"
}
```

### Tipos de Devolución

| Tipo | Descripción |
|------|-------------|
| `devolucion` | Devolución completa del dinero |
| `cambio` | Cambio por otro producto |
| `nota_credito` | Crédito para futuras compras |

### Razones de Devolución

| Razón | Descripción |
|-------|-------------|
| `defectuoso` | Producto defectuoso |
| `equivocado` | Producto equivocado |
| `no_satisfecho` | Cliente no satisfecho |
| `vencido` | Producto vencido |
| `otro` | Otra razón |

### Métodos de Reembolso

| Método | Descripción |
|--------|-------------|
| `efectivo` | Devolución en efectivo |
| `tarjeta` | Reversión a tarjeta |
| `nota_credito` | Crédito en cuenta |
| `cambio_producto` | Cambio por otro producto |

---

## 9. Nuevos Endpoints API

### Resumen de Todos los Nuevos Endpoints

#### Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/customers` | Listar clientes |
| GET | `/api/customers/:id` | Obtener cliente |
| GET | `/api/customers/search` | Buscar clientes |
| POST | `/api/customers` | Crear cliente |
| PUT | `/api/customers/:id` | Actualizar cliente |
| DELETE | `/api/customers/:id` | Desactivar cliente |
| PUT | `/api/customers/:id/points` | Agregar puntos |

#### Movimientos de Stock
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stock-movements` | Listar movimientos |
| GET | `/api/stock-movements/product/:id` | Movimientos por producto |
| POST | `/api/stock-movements/add` | Entrada de stock |
| POST | `/api/stock-movements/remove` | Salida de stock |
| POST | `/api/stock-movements/adjust` | Ajuste de inventario |

#### Promociones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/promotions` | Listar promociones |
| GET | `/api/promotions/:id` | Obtener promoción |
| POST | `/api/promotions` | Crear promoción |
| PUT | `/api/promotions/:id` | Actualizar promoción |
| DELETE | `/api/promotions/:id` | Desactivar promoción |
| POST | `/api/promotions/validate-code` | Validar código |
| GET | `/api/promotions/product/:id` | Promociones de producto |

#### Devoluciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/returns` | Listar devoluciones |
| GET | `/api/returns/:id` | Obtener devolución |
| POST | `/api/returns` | Crear devolución |
| PUT | `/api/returns/:id/cancel` | Cancelar devolución |
| GET | `/api/returns/sale/:id/items` | Items para devolver |

#### Alertas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/alerts` | Listar alertas |
| GET | `/api/alerts/unread-count` | Conteo no leídas |
| GET | `/api/alerts/summary` | Resumen de alertas |
| PUT | `/api/alerts/:id/read` | Marcar como leída |
| PUT | `/api/alerts/mark-all-read` | Marcar todas leídas |
| POST | `/api/alerts/generate` | Generar alertas |
| DELETE | `/api/alerts/:id` | Eliminar alerta |

#### Exportaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/exports/ticket/:id` | Ticket PDF |
| GET | `/api/exports/sales/excel` | Ventas Excel |
| GET | `/api/exports/sales/pdf` | Ventas PDF |
| GET | `/api/exports/inventory/excel` | Inventario Excel |

#### Productos (nuevos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products/barcode/:barcode` | Buscar por código |
| GET | `/api/products/expiring` | Por vencer |
| GET | `/api/products/expired` | Vencidos |

---

## 10. Nuevas Tablas de Base de Datos

### customers (Clientes)
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(255),
  tax_id VARCHAR(20),
  birth_date DATE,
  notes TEXT,
  points INTEGER DEFAULT 0,
  total_purchases DECIMAL(12,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### stock_movements (Movimientos de Stock)
```sql
CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  movement_type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reference_type VARCHAR(20),
  reference_id INTEGER,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### promotions (Promociones)
```sql
CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  applies_to VARCHAR(20) DEFAULT 'todos',
  category VARCHAR(30),
  product_id INTEGER,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  code VARCHAR(20) UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### returns (Devoluciones)
```sql
CREATE TABLE returns (
  id SERIAL PRIMARY KEY,
  return_number VARCHAR(20) UNIQUE NOT NULL,
  sale_id INTEGER REFERENCES sales(id),
  user_id INTEGER REFERENCES users(id),
  return_type VARCHAR(20) NOT NULL,
  reason VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  refund_method VARCHAR(20),
  status VARCHAR(20) DEFAULT 'completada',
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### return_items (Items de Devolución)
```sql
CREATE TABLE return_items (
  id SERIAL PRIMARY KEY,
  return_id INTEGER REFERENCES returns(id),
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  return_to_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### alerts (Alertas)
```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_type VARCHAR(30) NOT NULL,
  severity VARCHAR(10) DEFAULT 'warning',
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id),
  is_read BOOLEAN DEFAULT false,
  read_by INTEGER,
  read_at TIMESTAMP,
  auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Instalación de Nuevas Dependencias

```bash
npm install pdfkit exceljs
```

## Dependencias Agregadas

| Paquete | Versión | Uso |
|---------|---------|-----|
| pdfkit | ^0.13.0 | Generación de PDFs |
| exceljs | ^4.4.0 | Generación de Excel |

---

## Permisos por Rol

### Nuevas Funcionalidades

| Funcionalidad | Admin | Farmacéutico | Cajero |
|---------------|:-----:|:------------:|:------:|
| Ver alertas | ✓ | ✓ | ✓ |
| Generar alertas | ✓ | ✓ | ✗ |
| Ver clientes | ✓ | ✓ | ✓ |
| Crear/editar clientes | ✓ | ✓ | ✗ |
| Ver movimientos stock | ✓ | ✓ | ✗ |
| Crear movimientos | ✓ | ✓ | ✗ |
| Ver promociones | ✓ | ✓ | ✓ |
| Crear promociones | ✓ | ✓ | ✗ |
| Ver devoluciones | ✓ | ✓ | ✗ |
| Crear devoluciones | ✓ | ✓ | ✗ |
| Exportar reportes | ✓ | ✓ | ✗ |
| Generar tickets | ✓ | ✓ | ✓ |

---

## Notas de Actualización

1. Las nuevas tablas se crean automáticamente al iniciar el servidor
2. No se pierden datos existentes
3. Se recomienda hacer backup antes de actualizar
4. Ejecutar `npm install` para instalar nuevas dependencias
