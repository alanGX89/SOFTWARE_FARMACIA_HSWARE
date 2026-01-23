import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { productService } from '../services/productService';
import { supplierService } from '../services/supplierService';
import { useAuth } from '../context/AuthContext';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiBarChart2,
  FiFilter
} from 'react-icons/fi';
import { RiMedicineBottleLine, RiBarcodeLine } from 'react-icons/ri';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useAuth();

  const canEdit = user.role === 'admin' || user.role === 'pharmacist';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    category: 'medicamento',
    price: '',
    cost: '',
    stock: '',
    minStock: '10',
    supplier: '',
    expirationDate: '',
    requiresPrescription: false
  });

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await productService.getAll({ search: searchTerm, category: categoryFilter });
      setProducts(data.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const { data } = await supplierService.getAll({ active: true });
      setSuppliers(data.suppliers);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
      } else {
        await productService.create(formData);
      }

      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert(error.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      barcode: product.barcode || '',
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      minStock: product.min_stock || product.minStock,
      supplier: product.supplier?.id || product.supplier_id || '',
      expirationDate: product.expiration_date ? product.expiration_date.split('T')[0] : '',
      requiresPrescription: product.requires_prescription || product.requiresPrescription
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productService.delete(id);
      loadProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      barcode: '',
      category: 'medicamento',
      price: '',
      cost: '',
      stock: '',
      minStock: '10',
      supplier: '',
      expirationDate: '',
      requiresPrescription: false
    });
    setEditingProduct(null);
  };

  const handleSearch = () => {
    loadProducts();
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'medicamento': return <RiMedicineBottleLine />;
      case 'suplemento': return <FiPackage />;
      default: return <FiPackage />;
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <RiMedicineBottleLine className="page-title-icon" />
            Productos
          </h1>
          <p>Gestión de inventario y productos</p>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
        </div>
        <div className="filter-wrapper">
          <FiFilter className="filter-icon" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option value="medicamento">Medicamento</option>
            <option value="suplemento">Suplemento</option>
            <option value="cuidado_personal">Cuidado Personal</option>
            <option value="equipamiento">Equipamiento</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <button className="btn btn-secondary" onClick={handleSearch}>
          <FiSearch />
          <span>Buscar</span>
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
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Estado</th>
                {canEdit && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info">
                      <div className="product-icon">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div>
                        <div className="product-name">{product.name}</div>
                        {product.barcode && (
                          <div className="product-barcode">
                            <RiBarcodeLine />
                            {product.barcode}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {product.category}
                    </span>
                  </td>
                  <td className="price-cell">${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${product.isLowStock ? 'low-stock' : ''}`}>
                      {product.isLowStock && <FiAlertTriangle />}
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.supplier?.name || '-'}</td>
                  <td>
                    <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                      {product.active ? <FiCheck /> : <FiX />}
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {canEdit && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(product.id)}
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="empty-state">
              <FiPackage className="empty-icon" />
              <p>No se encontraron productos</p>
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
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Código de Barras</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="medicamento">Medicamento</option>
                <option value="suplemento">Suplemento</option>
                <option value="cuidado_personal">Cuidado Personal</option>
                <option value="equipamiento">Equipamiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Proveedor</label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              >
                <option value="">Seleccionar proveedor</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Costo *</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo *</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Expiración</label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                />
                Requiere receta médica
              </label>
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
              <span>{editingProduct ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Products;
