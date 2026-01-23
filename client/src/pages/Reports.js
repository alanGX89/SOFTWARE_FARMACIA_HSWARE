import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { reportService } from '../services/reportService';
import {
  FiBarChart2,
  FiPackage,
  FiAlertTriangle,
  FiAlertOctagon,
  FiDollarSign,
  FiTrendingUp,
  FiAward,
  FiRefreshCw
} from 'react-icons/fi';
import { RiMedicineBottleLine } from 'react-icons/ri';
import './Reports.css';

const Reports = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [topProductsRes, inventoryRes] = await Promise.all([
        reportService.getTopProducts({ limit: 10 }),
        reportService.getInventoryReport()
      ]);

      setTopProducts(topProductsRes.data.topProducts);
      setInventoryReport(inventoryRes.data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <FiRefreshCw className="spinner-icon" />
          <span>Cargando reportes...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FiBarChart2 className="page-title-icon" />
            Reportes
          </h1>
          <p>Análisis y estadísticas del negocio</p>
        </div>
        <button className="btn btn-secondary" onClick={loadReports}>
          <FiRefreshCw />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="reports-grid">
        <div className="card report-card">
          <div className="card-header">
            <FiPackage className="card-icon" />
            <h2>Resumen de Inventario</h2>
          </div>
          <div className="report-summary">
            <div className="summary-item">
              <div className="summary-icon-container primary">
                <RiMedicineBottleLine />
              </div>
              <div className="summary-label">Total Productos</div>
              <div className="summary-value">{inventoryReport?.summary.totalProducts}</div>
            </div>
            <div className="summary-item">
              <div className="summary-icon-container warning">
                <FiAlertTriangle />
              </div>
              <div className="summary-label">Stock Bajo</div>
              <div className="summary-value warning">{inventoryReport?.summary.lowStock}</div>
            </div>
            <div className="summary-item">
              <div className="summary-icon-container danger">
                <FiAlertOctagon />
              </div>
              <div className="summary-label">Sin Stock</div>
              <div className="summary-value danger">{inventoryReport?.summary.outOfStock}</div>
            </div>
            <div className="summary-item">
              <div className="summary-icon-container info">
                <FiDollarSign />
              </div>
              <div className="summary-label">Valor Total Costo</div>
              <div className="summary-value">
                ${inventoryReport?.summary.totalCostValue?.toFixed(2)}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon-container success">
                <FiTrendingUp />
              </div>
              <div className="summary-label">Valor Total Venta</div>
              <div className="summary-value success">
                ${inventoryReport?.summary.totalRetailValue?.toFixed(2)}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-icon-container primary">
                <FiDollarSign />
              </div>
              <div className="summary-label">Ganancia Potencial</div>
              <div className="summary-value primary">
                ${inventoryReport?.summary.potentialProfit?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="card report-card">
          <div className="card-header">
            <RiMedicineBottleLine className="card-icon" />
            <h2>Productos por Categoría</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Stock Total</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {inventoryReport?.byCategory.map((cat, index) => (
                <tr key={index}>
                  <td>
                    <span className="category-badge">{cat._id}</span>
                  </td>
                  <td>
                    <span className="count-value">{cat.count}</span>
                  </td>
                  <td>
                    <span className="stock-value">{cat.totalStock}</span>
                  </td>
                  <td className="value-cell">${cat.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card report-card full-width">
          <div className="card-header">
            <FiAward className="card-icon" />
            <h2>Top 10 Productos Más Vendidos</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Producto</th>
                <th>Cantidad Vendida</th>
                <th>Ingresos Generados</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>
                    <span className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td>
                    <div className="product-info">
                      <RiMedicineBottleLine className="product-icon" />
                      <span>{product.productName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="quantity-badge">{product.totalQuantity}</span>
                  </td>
                  <td className="revenue">${product.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {topProducts.length === 0 && (
            <div className="empty-state">
              <FiBarChart2 className="empty-icon" />
              <p>No hay datos de ventas disponibles</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
