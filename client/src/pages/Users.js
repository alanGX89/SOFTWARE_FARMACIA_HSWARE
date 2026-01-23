import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { userService } from '../services/userService';
import {
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiShield,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { RiStethoscopeLine, RiShieldUserLine } from 'react-icons/ri';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cashier',
    phone: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await userService.getAll();
      setUsers(data.users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.update(editingUser.id, updateData);
      } else {
        await userService.create(formData);
      }

      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await userService.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'cashier',
      phone: ''
    });
    setEditingUser(null);
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      pharmacist: 'Farmacéutico',
      cashier: 'Cajero'
    };
    return labels[role] || role;
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <RiShieldUserLine />;
      case 'pharmacist': return <RiStethoscopeLine />;
      default: return <FiUser />;
    }
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'role-admin',
      pharmacist: 'role-pharmacist',
      cashier: 'role-cashier'
    };
    return classes[role] || 'role-cashier';
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FiUsers className="page-title-icon" />
            Usuarios
          </h1>
          <p>Gestión de usuarios del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className={`user-avatar ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <FiMail className="cell-icon" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    {user.phone ? (
                      <div className="phone-cell">
                        <FiPhone className="cell-icon" />
                        {user.phone}
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? <FiCheck /> : <FiX />}
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <FiUsers className="empty-icon" />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FiUser />
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Nombre completo"
            />
          </div>

          <div className="form-group">
            <label>
              <FiMail />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock />
              Contraseña {editingUser ? '(dejar en blanco para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>
              <FiShield />
              Rol *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="cashier">Cajero</option>
              <option value="pharmacist">Farmacéutico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FiPhone />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Número de teléfono"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              <FiX />
              <span>Cancelar</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <FiCheck />
              <span>{editingUser ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Users;
