const { User } = require('../models');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const { role, active } = req.query;
    const where = {};

    if (role) where.role = role;
    if (active !== undefined) where.active = active === 'true';

    const users = await User.findAll({
      where,
      order: [['name', 'ASC']]
    });

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Crear usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir cambio de email si ya existe
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await User.findOne({ where: { email: updateData.email } });
      if (emailExists) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    await user.update(updateData);

    if (password) {
      user.password = password;
      await user.save();
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.update({ active: false });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// Reactivar usuario
exports.reactivateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.update({ active: true });

    res.json({ message: 'Usuario reactivado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al reactivar usuario' });
  }
};
