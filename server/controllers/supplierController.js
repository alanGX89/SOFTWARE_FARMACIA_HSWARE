const { Supplier } = require('../models');

// Obtener todos los proveedores
exports.getAllSuppliers = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};

    if (active !== undefined) where.active = active === 'true';

    const suppliers = await Supplier.findAll({
      where,
      order: [['name', 'ASC']]
    });

    // Formatear para el frontend
    const formattedSuppliers = suppliers.map(s => {
      const supplier = s.toJSON();
      supplier.contactName = s.contact_name;
      supplier.taxId = s.tax_id;
      supplier.address = {
        street: s.address_street,
        city: s.address_city,
        state: s.address_state,
        zipCode: s.address_zip_code,
        country: s.address_country
      };
      return supplier;
    });

    res.json({
      count: formattedSuppliers.length,
      suppliers: formattedSuppliers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
};

// Obtener proveedor por ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    res.json({ supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proveedor' });
  }
};

// Crear proveedor
exports.createSupplier = async (req, res) => {
  try {
    const data = { ...req.body };

    // Mapear campos del frontend
    if (req.body.contactName) data.contact_name = req.body.contactName;
    if (req.body.taxId) data.tax_id = req.body.taxId;
    if (req.body.address) {
      data.address_street = req.body.address.street;
      data.address_city = req.body.address.city;
      data.address_state = req.body.address.state;
      data.address_zip_code = req.body.address.zipCode;
      data.address_country = req.body.address.country;
    }

    const supplier = await Supplier.create(data);

    res.status(201).json({
      message: 'Proveedor creado exitosamente',
      supplier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear proveedor' });
  }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    const data = { ...req.body };

    // Mapear campos del frontend
    if (req.body.contactName) data.contact_name = req.body.contactName;
    if (req.body.taxId) data.tax_id = req.body.taxId;
    if (req.body.address) {
      data.address_street = req.body.address.street;
      data.address_city = req.body.address.city;
      data.address_state = req.body.address.state;
      data.address_zip_code = req.body.address.zipCode;
      data.address_country = req.body.address.country;
    }

    await supplier.update(data);

    res.json({
      message: 'Proveedor actualizado exitosamente',
      supplier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar proveedor' });
  }
};

// Eliminar proveedor (soft delete)
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    await supplier.update({ active: false });

    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar proveedor' });
  }
};
