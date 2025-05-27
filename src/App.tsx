import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ClienteFormPage from './pages/ClienteFormPage';
import CertificadosPage from './pages/CertificadosPage';
import CertificadoFormPage from './pages/CertificadoFormPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <ClientesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/clientes/nuevo"
              element={
                <ProtectedRoute>
                  <ClienteFormPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/clientes/:id"
              element={
                <ProtectedRoute>
                  <ClienteFormPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/certificados"
              element={
                <ProtectedRoute>
                  <CertificadosPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/certificados/nuevo"
              element={
                <ProtectedRoute>
                  <CertificadoFormPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <ConfiguracionPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/dashboard\" replace />} />
            <Route path="*" element={<Navigate to="/dashboard\" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;