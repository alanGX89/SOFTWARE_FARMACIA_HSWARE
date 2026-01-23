import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertCircle,
  FiUser,
  FiLoader
} from 'react-icons/fi';
import { RiStethoscopeLine } from 'react-icons/ri';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/logo.png"
            alt="PharmaCare Logo"
            className="login-logo"
          />
          <p>Sistema de Gestión para Farmacias</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FiAlertCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FiMail className="label-icon" />
              Email
            </label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiLock className="label-icon" />
              Contraseña
            </label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="btn-icon spinning" />
                <span>Iniciando...</span>
              </>
            ) : (
              <>
                <FiLogIn className="btn-icon" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <h3>
            <FiUser className="footer-icon" />
            Usuarios de prueba:
          </h3>
          <ul>
            <li>
              <span className="role-badge admin">Admin</span>
              <span>admin@farmacia.com / Admin123!</span>
            </li>
            <li>
              <span className="role-badge pharmacist">
                <RiStethoscopeLine />
                Farm.
              </span>
              <span>farmaceutico@farmacia.com / Farm123!</span>
            </li>
            <li>
              <span className="role-badge cashier">Cajero</span>
              <span>cajero@farmacia.com / Cajero123!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
