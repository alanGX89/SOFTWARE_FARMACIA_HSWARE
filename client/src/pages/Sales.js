import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { saleService } from '../services/saleService';
import {
  FiShoppingCart,
  FiPlus,
  FiCalendar,
  FiFilter,
  FiRefreshCw,
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiHash
} from 'react-icons/fi';
import './Sales.css';

const Sales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await saleService.getAll(params);
      setSales(data.sales);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completada': return <FiCheckCircle />;
      case 'cancelada': return <FiXCircle />;
      case 'pendiente': return <FiClock />;
      default: return <FiClock />;
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      completada: 'status-success',
      cancelada: 'status-danger',
      pendiente: 'status-warning'
    };
    return classes[status] || 'status-info';
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'efectivo': return <FiDollarSign />;
      case 'tarjeta': return <FiCreditCard />;
      default: return <FiCreditCard />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      credito: 'Crédito'
    };
    return labels[method] || method;
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FiShoppingCart className="page-title-icon" />
            Ventas
          </h1>
          <p>Historial de transacciones</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/sales/new')}>
          <FiPlus />
          <span>Nueva Venta</span>
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <FiCalendar className="filter-icon" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
          />
        </div>
        <div className="filter-group">
          <FiCalendar className="filter-icon" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha fin"
          />
        </div>
        <button className="btn btn-secondary" onClick={loadSales}>
          <FiFilter />
          <span>Filtrar</span>
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            setStartDate('');
            setEndDate('');
            loadSales();
          }}
        >
          <FiRefreshCw />
          <span>Limpiar</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <FiRefreshCw className="spinner-icon" />
          <span>Cargando ventas...</span>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cajero</th>
                <th>Items</th>
                <th>Método Pago</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>
                    <div className="sale-number-cell">
                      <FiHash className="cell-icon" />
                      <span className="sale-number">{sale.saleNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FiCalendar className="cell-icon" />
                      {formatDate(sale.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="cashier-cell">
                      <FiUser className="cell-icon" />
                      {sale.cashier?.name}
                    </div>
                  </td>
                  <td>
                    <span className="items-badge">{sale.items.length}</span>
                  </td>
                  <td>
                    <div className="payment-cell">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span>{getPaymentMethodLabel(sale.paymentMethod)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="sale-total">${sale.total.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(sale.status)}`}>
                      {getStatusIcon(sale.status)}
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sales.length === 0 && (
            <div className="empty-state">
              <FiShoppingCart className="empty-icon" />
              <p>No se encontraron ventas</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Sales;
