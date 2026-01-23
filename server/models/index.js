const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Supplier = require('./Supplier');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Customer = require('./Customer');
const StockMovement = require('./StockMovement');
const Promotion = require('./Promotion');
const Return = require('./Return');
const ReturnItem = require('./ReturnItem');
const Alert = require('./Alert');
const Consultation = require('./Consultation');

// Relaciones Producto - Proveedor
Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });

// Relaciones Venta - Usuario
Sale.belongsTo(User, { foreignKey: 'cashier_id', as: 'cashier' });
User.hasMany(Sale, { foreignKey: 'cashier_id', as: 'sales' });

// Relaciones Venta - Items
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });

// Relaciones Items - Producto
SaleItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(SaleItem, { foreignKey: 'product_id', as: 'saleItems' });

// Relaciones Venta - Cliente
Sale.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Sale, { foreignKey: 'customer_id', as: 'purchases' });

// Relaciones Movimientos de Stock
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
StockMovement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Relaciones Promociones
Promotion.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Relaciones Devoluciones
Return.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });
Sale.hasMany(Return, { foreignKey: 'sale_id', as: 'returns' });
Return.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Return.hasMany(ReturnItem, { foreignKey: 'return_id', as: 'items' });
ReturnItem.belongsTo(Return, { foreignKey: 'return_id', as: 'return' });
ReturnItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Relaciones Alertas
Alert.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Relaciones Consultas
Consultation.belongsTo(User, { foreignKey: 'attended_by', as: 'attendant' });
Consultation.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Consultation, { foreignKey: 'customer_id', as: 'consultations' });

module.exports = {
  sequelize,
  User,
  Product,
  Supplier,
  Sale,
  SaleItem,
  Customer,
  StockMovement,
  Promotion,
  Return,
  ReturnItem,
  Alert,
  Consultation
};
