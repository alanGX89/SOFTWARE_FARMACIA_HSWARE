import React from 'react';
import Layout from '../components/Layout';
import { RiStethoscopeLine } from 'react-icons/ri';
import { FiLock } from 'react-icons/fi';
import './Consultations.css';

const Consultations = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <RiStethoscopeLine className="page-title-icon" />
            Consultas
          </h1>
          <p>Módulo de consultas farmacéuticas</p>
        </div>
      </div>

      <div className="card module-disabled">
        <div className="module-disabled-icon">
          <FiLock />
        </div>
        <h2>Este módulo no está habilitado</h2>
        <p>Solicita la habilitación del módulo a su proveedor comercial.</p>
      </div>
    </Layout>
  );
};

export default Consultations;
