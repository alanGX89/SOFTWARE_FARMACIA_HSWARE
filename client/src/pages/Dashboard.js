import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { reportService } from '../services/reportService';
import {
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiAlertTriangle,
  FiShoppingCart,
  FiList,
  FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';
import {
  RiMedicineBottleLine,
  RiStethoscopeLine
} from 'react-icons/ri';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await reportService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <FiRefreshCw className="spinner-icon" />
          <span>Cargando...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>Dashboard</h1>
          <p>Resumen general del sistema</p>
        </div>
        <button className="btn-refresh" onClick={loadDashboard}>
          <FiRefreshCw />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon-container">
            <FiDollarSign className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Ventas Hoy</div>
            <div className="stat-value">
              ${dashboard?.today?.total?.toFixed(2) || '0.00'}
            </div>
            <div className="stat-meta">
              {dashboard?.today?.sales || 0} transacciones
            </div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon-container">
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Ventas del Mes</div>
            <div className="stat-value">
              ${dashboard?.month?.total?.toFixed(2) || '0.00'}
            </div>
            <div className="stat-meta">
              {dashboard?.month?.sales || 0} transacciones
            </div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon-container">
            <RiMedicineBottleLine className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Productos Totales</div>
            <div className="stat-value">
              {dashboard?.inventory?.totalProducts || 0}
            </div>
            <div className="stat-meta">productos activos</div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon-container">
            <FiAlertTriangle className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Stock Bajo</div>
            <div className="stat-value">
              {dashboard?.inventory?.lowStockProducts || 0}
            </div>
            <div className="stat-meta">requieren atención</div>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="card">
          <h2>Accesos Rápidos</h2>
          <div className="quick-actions">
            <a href="/sales/new" className="quick-action">
              <div className="quick-action-icon-container">
                <FiShoppingCart className="quick-action-icon" />
              </div>
              <span>Nueva Venta</span>
            </a>
            <a href="/products" className="quick-action">
              <div className="quick-action-icon-container">
                <RiMedicineBottleLine className="quick-action-icon" />
              </div>
              <span>Ver Productos</span>
            </a>
            <a href="/sales" className="quick-action">
              <div className="quick-action-icon-container">
                <FiList className="quick-action-icon" />
              </div>
              <span>Historial Ventas</span>
            </a>
            <a href="/consultations" className="quick-action">
              <div className="quick-action-icon-container">
                <RiStethoscopeLine className="quick-action-icon" />
              </div>
              <span>Consultas</span>
            </a>
            <a href="/reports" className="quick-action">
              <div className="quick-action-icon-container">
                <FiBarChart2 className="quick-action-icon" />
              </div>
              <span>Reportes</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
