import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { supplierService } from '../services/supplierService';
import {
  FiTruck,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiCheck,
  FiX,
  FiHash,
  FiGlobe
} from 'react-icons/fi';
import './Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'México'
    },
    taxId: '',
    notes: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const { data } = await supplierService.getAll();
      setSuppliers(data.suppliers);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, formData);
      } else {
        await supplierService.create(formData);
      }

      setShowModal(false);
      resetForm();
      loadSuppliers();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert(error.response?.data?.message || 'Error al guardar proveedor');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactName: supplier.contactName || '',
      email: supplier.email || '',
      phone: supplier.phone,
      address: supplier.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México'
      },
      taxId: supplier.taxId || '',
      notes: supplier.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
      await supplierService.delete(id);
      loadSuppliers();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      alert('Error al eliminar proveedor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México'
      },
      taxId: '',
      notes: ''
    });
    setEditingSupplier(null);
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FiTruck className="page-title-icon" />
            Proveedores
          </h1>
          <p>Gestión de proveedores</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          <span>Nuevo Proveedor</span>
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
                <th>Proveedor</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>
                    <div className="supplier-info">
                      <div className="supplier-icon">
                        <FiTruck />
                      </div>
                      <div className="supplier-details">
                        <span className="supplier-name">{supplier.name}</span>
                        {supplier.email && (
                          <span className="supplier-email">
                            <FiMail className="mini-icon" />
                            {supplier.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {supplier.contactName ? (
                      <div className="contact-cell">
                        <FiUser className="cell-icon" />
                        {supplier.contactName}
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="phone-cell">
                      <FiPhone className="cell-icon" />
                      {supplier.phone}
                    </div>
                  </td>
                  <td>
                    {supplier.address?.city ? (
                      <div className="city-cell">
                        <FiMapPin className="cell-icon" />
                        {supplier.address.city}
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${supplier.active ? 'active' : 'inactive'}`}>
                      {supplier.active ? <FiCheck /> : <FiX />}
                      {supplier.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(supplier)}
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(supplier.id)}
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

          {suppliers.length === 0 && (
            <div className="empty-state">
              <FiTruck className="empty-icon" />
              <p>No se encontraron proveedores</p>
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
        title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FiTruck />
                Nombre Comercial *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Nombre del proveedor"
              />
            </div>

            <div className="form-group">
              <label>
                <FiUser />
                Nombre de Contacto
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="Persona de contacto"
              />
            </div>

            <div className="form-group">
              <label>
                <FiMail />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@proveedor.com"
              />
            </div>

            <div className="form-group">
              <label>
                <FiPhone />
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="Número de teléfono"
              />
            </div>

            <div className="form-group">
              <label>
                <FiHash />
                RFC/Tax ID
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="RFC del proveedor"
              />
            </div>

            <div className="form-group full-width section-title">
              <h3>
                <FiMapPin />
                Dirección
              </h3>
            </div>

            <div className="form-group full-width">
              <label>
                <FiMapPin />
                Calle
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
                placeholder="Calle y número"
              />
            </div>

            <div className="form-group">
              <label>
                <FiMapPin />
                Ciudad
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                placeholder="Ciudad"
              />
            </div>

            <div className="form-group">
              <label>
                <FiMapPin />
                Estado
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                placeholder="Estado"
              />
            </div>

            <div className="form-group">
              <label>
                <FiHash />
                Código Postal
              </label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                placeholder="C.P."
              />
            </div>

            <div className="form-group">
              <label>
                <FiGlobe />
                País
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, country: e.target.value }
                })}
                placeholder="País"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <FiFileText />
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Notas adicionales sobre el proveedor"
              ></textarea>
            </div>
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
              <span>{editingSupplier ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Suppliers;
