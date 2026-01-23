const { Op } = require('sequelize');
const { Product, Supplier } = require('../models');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, lowStock, active } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { barcode: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) where.category = category;
    if (active !== undefined) where.active = active === 'true';

    const products = await Product.findAll({
      where,
      include: [{ model: Supplier, as: 'supplier', attributes: ['id', 'name', 'phone'] }],
      order: [['name', 'ASC']]
    });

    // Filtrar por stock bajo si es necesario
    let filteredProducts = products;
    if (lowStock === 'true') {
      filteredProducts = products.filter(p => p.stock <= p.min_stock);
    }

    // Agregar campos virtuales
    const productsWithVirtuals = filteredProducts.map(p => {
      const product = p.toJSON();
      product.isLowStock = p.stock <= p.min_stock;
      product.minStock = p.min_stock;
      return product;
    });

    res.json({
      count: productsWithVirtuals.length,
      products: productsWithVirtuals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, as: 'supplier' }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Mapear campos del frontend al backend
    if (req.body.minStock) productData.min_stock = req.body.minStock;
    if (req.body.expirationDate) productData.expiration_date = req.body.expirationDate;
    if (req.body.requiresPrescription !== undefined) productData.requires_prescription = req.body.requiresPrescription;
    if (req.body.supplier) productData.supplier_id = req.body.supplier;

    const product = await Product.create(productData);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El código de barras ya existe' });
    }
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updateData = { ...req.body };
    if (req.body.minStock) updateData.min_stock = req.body.minStock;
    if (req.body.expirationDate) updateData.expiration_date = req.body.expirationDate;
    if (req.body.requiresPrescription !== undefined) updateData.requires_prescription = req.body.requiresPrescription;
    if (req.body.supplier) updateData.supplier_id = req.body.supplier;

    await product.update(updateData);

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar producto (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.update({ active: false });

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

// Obtener productos con stock bajo
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { active: true },
      include: [{ model: Supplier, as: 'supplier', attributes: ['id', 'name', 'phone'] }]
    });

    const lowStockProducts = products.filter(p => p.stock <= p.min_stock);

    res.json({
      count: lowStockProducts.length,
      products: lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos con stock bajo' });
  }
};

// Actualizar stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let newStock = product.stock;
    if (operation === 'add') {
      newStock += quantity;
    } else if (operation === 'subtract') {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      newStock -= quantity;
    }

    await product.update({ stock: newStock });

    res.json({
      message: 'Stock actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar stock' });
  }
};

// Buscar producto por código de barras
exports.getByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({
      where: { barcode, active: true },
      include: [{ model: Supplier, as: 'supplier', attributes: ['id', 'name'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar producto' });
  }
};

// Obtener productos por vencer
exports.getExpiringProducts = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const products = await Product.findAll({
      where: {
        active: true,
        expiration_date: {
          [Op.not]: null,
          [Op.lte]: futureDate,
          [Op.gte]: new Date()
        }
      },
      order: [['expiration_date', 'ASC']]
    });

    const productsWithDays = products.map(p => {
      const product = p.toJSON();
      product.daysUntilExpiration = Math.ceil(
        (new Date(p.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return product;
    });

    res.json({
      count: productsWithDays.length,
      products: productsWithDays
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos por vencer' });
  }
};

// Obtener productos vencidos
exports.getExpiredProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        active: true,
        expiration_date: {
          [Op.not]: null,
          [Op.lt]: new Date()
        }
      },
      order: [['expiration_date', 'ASC']]
    });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos vencidos' });
  }
};
