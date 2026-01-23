# Documentacion de Controladores

Este documento describe la logica de negocio implementada en cada controlador.

---

## Indice

1. [authController](#authcontroller)
2. [userController](#usercontroller)
3. [productController](#productcontroller)
4. [saleController](#salecontroller)
5. [supplierController](#suppliercontroller)
6. [customerController](#customercontroller)
7. [stockMovementController](#stockmovementcontroller)
8. [promotionController](#promotioncontroller)
9. [returnController](#returncontroller)
10. [alertController](#alertcontroller)
11. [exportController](#exportcontroller)
12. [reportController](#reportcontroller)

---

## authController

Maneja la autenticacion de usuarios.

**Archivo:** `server/controllers/authController.js`

### Metodos

#### `login(req, res)`
Autentica un usuario y genera un token JWT.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contrasena123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "usuario@email.com",
    "role": "admin"
  }
}
```

#### `getMe(req, res)`
Obtiene el usuario autenticado actual.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "usuario@email.com",
    "role": "admin"
  }
}
```

#### `changePassword(req, res)`
Cambia la contrasena del usuario autenticado.

**Request Body:**
```json
{
  "currentPassword": "contrasenaActual",
  "newPassword": "nuevaContrasena"
}
```

---

## userController

Gestiona los usuarios del sistema (solo administradores).

**Archivo:** `server/controllers/userController.js`

### Metodos

#### `getAllUsers(req, res)`
Lista todos los usuarios con filtros opcionales.

**Query Params:**
- `active` - Filtrar por estado activo
- `role` - Filtrar por rol

#### `getUserById(req, res)`
Obtiene un usuario por ID.

#### `createUser(req, res)`
Crea un nuevo usuario.

**Request Body:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@email.com",
  "password": "Password123!",
  "role": "cashier",
  "phone": "1234567890"
}
```

#### `updateUser(req, res)`
Actualiza un usuario existente.

#### `deleteUser(req, res)`
Desactiva un usuario (soft delete).

---

## productController

Gestiona el catalogo de productos.

**Archivo:** `server/controllers/productController.js`

### Metodos

#### `getAllProducts(req, res)`
Lista productos con filtros y busqueda.

**Query Params:**
- `search` - Buscar por nombre, descripcion o codigo de barras
- `category` - Filtrar por categoria
- `lowStock` - Solo productos con stock bajo
- `active` - Filtrar por estado

**Response:**
```json
{
  "count": 10,
  "products": [
    {
      "id": 1,
      "name": "Aspirina 500mg",
      "barcode": "7501001234567",
      "price": "45.50",
      "stock": 100,
      "isLowStock": false,
      "supplier": {
        "id": 1,
        "name": "Farmaceutica SA"
      }
    }
  ]
}
```

#### `getProductById(req, res)`
Obtiene un producto por ID con informacion del proveedor.

#### `getByBarcode(req, res)`
Busca un producto por codigo de barras.

**Params:** `barcode`

#### `createProduct(req, res)`
Crea un nuevo producto.

**Request Body:**
```json
{
  "name": "Producto Nuevo",
  "category": "medicamento",
  "price": 50.00,
  "cost": 35.00,
  "stock": 100,
  "minStock": 10,
  "barcode": "1234567890123",
  "supplier": 1,
  "expirationDate": "2025-12-31",
  "requiresPrescription": false
}
```

#### `updateProduct(req, res)`
Actualiza un producto existente.

#### `deleteProduct(req, res)`
Desactiva un producto (soft delete).

#### `getLowStockProducts(req, res)`
Obtiene productos con stock igual o menor al minimo.

#### `updateStock(req, res)`
Actualiza el stock de un producto.

**Request Body:**
```json
{
  "quantity": 50,
  "operation": "add" // o "subtract"
}
```

#### `getExpiringProducts(req, res)`
Obtiene productos proximos a vencer.

**Query Params:**
- `days` - Dias hasta vencimiento (default: 30)

#### `getExpiredProducts(req, res)`
Obtiene productos ya vencidos.

---

## saleController

Gestiona las ventas del sistema.

**Archivo:** `server/controllers/saleController.js`

### Metodos

#### `getAllSales(req, res)`
Lista ventas con filtros.

**Query Params:**
- `startDate` - Fecha inicial
- `endDate` - Fecha final
- `status` - Estado de la venta
- `cashier` - ID del cajero

#### `getSaleById(req, res)`
Obtiene una venta con todos sus items.

#### `createSale(req, res)`
Crea una nueva venta.

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "paymentMethod": "efectivo",
  "amountPaid": 100.00,
  "customerId": 1,
  "promotionId": null
}
```

**Proceso:**
1. Valida existencia de productos
2. Verifica stock disponible
3. Calcula subtotales
4. Aplica promocion si existe
5. Genera numero de venta unico
6. Descuenta stock de productos
7. Agrega puntos al cliente (si aplica)
8. Registra movimientos de stock

#### `cancelSale(req, res)`
Cancela una venta y restaura el stock.

---

## supplierController

Gestiona los proveedores.

**Archivo:** `server/controllers/supplierController.js`

### Metodos

#### `getAllSuppliers(req, res)`
Lista todos los proveedores.

#### `getSupplierById(req, res)`
Obtiene un proveedor por ID con sus productos.

#### `createSupplier(req, res)`
Crea un nuevo proveedor.

**Request Body:**
```json
{
  "name": "Distribuidora Medica SA",
  "contactName": "Juan Perez",
  "email": "contacto@distribuidora.com",
  "phone": "5551234567",
  "addressStreet": "Av. Principal 123",
  "addressCity": "Ciudad de Mexico",
  "taxId": "DIS123456ABC"
}
```

#### `updateSupplier(req, res)`
Actualiza un proveedor.

#### `deleteSupplier(req, res)`
Desactiva un proveedor (soft delete).

---

## customerController

Gestiona los clientes y sistema de puntos.

**Archivo:** `server/controllers/customerController.js`

### Metodos

#### `getAllCustomers(req, res)`
Lista todos los clientes.

#### `getCustomerById(req, res)`
Obtiene un cliente con su historial de compras.

#### `searchCustomers(req, res)`
Busca clientes por nombre, email o telefono.

**Query Params:**
- `q` - Termino de busqueda

#### `createCustomer(req, res)`
Crea un nuevo cliente.

**Request Body:**
```json
{
  "name": "Maria Garcia",
  "email": "maria@email.com",
  "phone": "5559876543",
  "taxId": "GARM901231ABC"
}
```

#### `updateCustomer(req, res)`
Actualiza un cliente.

#### `addPoints(req, res)`
Agrega puntos a un cliente.

**Request Body:**
```json
{
  "points": 100,
  "reason": "Compra realizada"
}
```

#### `deleteCustomer(req, res)`
Desactiva un cliente (soft delete).

---

## stockMovementController

Registra y consulta movimientos de inventario.

**Archivo:** `server/controllers/stockMovementController.js`

### Metodos

#### `getAllMovements(req, res)`
Lista movimientos con filtros.

**Query Params:**
- `startDate` - Fecha inicial
- `endDate` - Fecha final
- `type` - Tipo de movimiento
- `productId` - ID del producto

#### `getProductMovements(req, res)`
Obtiene historial de movimientos de un producto.

**Params:** `productId`

#### `createEntry(req, res)`
Registra entrada de mercancia.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 100,
  "cost": 3500.00,
  "notes": "Compra a proveedor"
}
```

#### `createExit(req, res)`
Registra salida de mercancia.

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 10,
  "notes": "Merma por dano"
}
```

#### `createAdjust(req, res)`
Registra ajuste de inventario.

**Request Body:**
```json
{
  "productId": 1,
  "newStock": 95,
  "notes": "Ajuste por inventario fisico"
}
```

---

## promotionController

Gestiona promociones y codigos de descuento.

**Archivo:** `server/controllers/promotionController.js`

### Metodos

#### `getAllPromotions(req, res)`
Lista todas las promociones.

#### `getPromotionById(req, res)`
Obtiene una promocion por ID.

#### `validateCode(req, res)`
Valida un codigo promocional.

**Params:** `code`

**Validaciones:**
- Codigo existe y esta activo
- Dentro de fechas de vigencia
- No ha excedido limite de uso

#### `createPromotion(req, res)`
Crea una nueva promocion.

**Request Body:**
```json
{
  "name": "Descuento Verano",
  "description": "20% en todos los productos",
  "discountType": "porcentaje",
  "discountValue": 20,
  "minPurchase": 100.00,
  "maxDiscount": 500.00,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "appliesTo": "todos",
  "code": "VERANO20",
  "usageLimit": 100
}
```

#### `updatePromotion(req, res)`
Actualiza una promocion.

#### `deletePromotion(req, res)`
Desactiva una promocion.

---

## returnController

Gestiona devoluciones de productos.

**Archivo:** `server/controllers/returnController.js`

### Metodos

#### `getAllReturns(req, res)`
Lista todas las devoluciones.

#### `getReturnById(req, res)`
Obtiene una devolucion con sus items.

#### `createReturn(req, res)`
Crea una devolucion.

**Request Body:**
```json
{
  "saleId": 1,
  "returnType": "parcial",
  "reason": "defectuoso",
  "refundMethod": "efectivo",
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "returnToStock": true
    }
  ],
  "notes": "Producto danado"
}
```

**Proceso:**
1. Valida que la venta exista
2. Valida cantidades vs venta original
3. Genera numero de devolucion
4. Restaura stock si aplica
5. Registra movimientos de stock

---

## alertController

Gestiona alertas del sistema.

**Archivo:** `server/controllers/alertController.js`

### Metodos

#### `getAllAlerts(req, res)`
Lista alertas con filtros.

**Query Params:**
- `type` - Tipo de alerta
- `read` - Solo leidas/no leidas
- `severity` - Severidad

#### `generateAlerts(req, res)`
Genera alertas automaticas.

**Proceso:**
1. Busca productos con stock bajo
2. Busca productos sin stock
3. Busca productos proximos a vencer (30 dias)
4. Busca productos vencidos
5. Crea alertas nuevas (evita duplicados)

#### `markAsRead(req, res)`
Marca una alerta como leida.

#### `deleteAlert(req, res)`
Elimina una alerta.

---

## exportController

Genera archivos PDF y Excel.

**Archivo:** `server/controllers/exportController.js`

### Metodos

#### `generateTicket(req, res)`
Genera ticket de venta en PDF.

**Params:** `saleId`

**Response:** Archivo PDF descargable

**Contenido del ticket:**
- Logo y datos de la farmacia
- Numero de venta y fecha
- Lista de productos
- Subtotal, impuestos, descuentos
- Total
- Metodo de pago
- Datos del cliente (si aplica)

#### `exportSalesExcel(req, res)`
Exporta ventas a Excel.

**Query Params:**
- `startDate` - Fecha inicial
- `endDate` - Fecha final

**Response:** Archivo .xlsx descargable

#### `exportInventoryExcel(req, res)`
Exporta inventario a Excel.

**Response:** Archivo .xlsx con:
- Nombre del producto
- Codigo de barras
- Categoria
- Precio
- Costo
- Stock actual
- Stock minimo
- Proveedor
- Fecha de vencimiento

---

## reportController

Genera reportes y estadisticas.

**Archivo:** `server/controllers/reportController.js`

### Metodos

#### `getDashboard(req, res)`
Obtiene estadisticas para el dashboard.

**Response:**
```json
{
  "salesTotal": 15000.00,
  "salesToday": 2500.00,
  "ordersCount": 45,
  "productsCount": 150,
  "lowStockCount": 12,
  "topProducts": [...],
  "recentSales": [...]
}
```

#### `getSalesReport(req, res)`
Genera reporte de ventas.

**Query Params:**
- `startDate` - Fecha inicial
- `endDate` - Fecha final
- `groupBy` - Agrupar por (day, week, month)

#### `getTopProducts(req, res)`
Obtiene productos mas vendidos.

**Query Params:**
- `limit` - Cantidad (default: 10)
- `startDate` - Fecha inicial
- `endDate` - Fecha final

---

## Middleware de Autorizacion

Todos los controladores utilizan middleware para verificar autenticacion y roles.

**Archivo:** `server/middleware/auth.js`

### `protect`
Verifica que el usuario este autenticado (token JWT valido).

### `authorize(...roles)`
Verifica que el usuario tenga uno de los roles permitidos.

**Ejemplo de uso:**
```javascript
router.get('/', protect, authorize('admin'), controller.method);
```

---

*Documentacion generada para PharmaCare Pro v2.0*
