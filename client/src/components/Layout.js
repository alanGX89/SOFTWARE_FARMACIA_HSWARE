import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiPlusCircle,
  FiTruck,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import {
  RiMedicineBottleLine,
  RiStethoscopeLine
} from 'react-icons/ri';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FiHome, roles: ['admin', 'pharmacist', 'cashier'] },
    { path: '/products', label: 'Productos', icon: RiMedicineBottleLine, roles: ['admin', 'pharmacist', 'cashier'] },
    { path: '/sales', label: 'Ventas', icon: FiShoppingCart, roles: ['admin', 'pharmacist', 'cashier'] },
    { path: '/sales/new', label: 'Nueva Venta', icon: FiPlusCircle, roles: ['admin', 'pharmacist', 'cashier'] },
    { path: '/consultations', label: 'Consultas', icon: RiStethoscopeLine, roles: ['admin', 'pharmacist'] },
    { path: '/suppliers', label: 'Proveedores', icon: FiTruck, roles: ['admin', 'pharmacist'] },
    { path: '/users', label: 'Usuarios', icon: FiUsers, roles: ['admin'] },
    { path: '/reports', label: 'Reportes', icon: FiBarChart2, roles: ['admin', 'pharmacist'] }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels = {
    admin: 'Administrador',
    pharmacist: 'Farmacéutico',
    cashier: 'Cajero'
  };

  const roleIcons = {
    admin: <FiUser className="role-icon" />,
    pharmacist: <RiStethoscopeLine className="role-icon" />,
    cashier: <FiShoppingCart className="role-icon" />
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src="/logo.png"
            alt="PharmaCare Logo"
            className="sidebar-logo"
          />
        </div>

        <nav className="sidebar-nav">
          {filteredMenu.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <IconComponent className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {roleIcons[user.role]}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{roleLabels[user.role]}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
