import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import NewSale from './pages/NewSale';
import Users from './pages/Users';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
          <Route path="/sales/new" element={<PrivateRoute><NewSale /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute roles={['admin', 'pharmacist']}><Suppliers /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute roles={['admin', 'pharmacist']}><Reports /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
