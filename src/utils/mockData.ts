import { Cliente, Certificado, Config, DashboardStats } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Default app configuration
export const defaultConfig: Config = {
  empresa: {
    nombre: 'Revisiones Gas Pro',
    direccion: 'Calle Principal 123',
    telefono: '900 123 456',
    email: 'info@revisionesgas.com',
    logo: 'https://placehold.co/200x80/2563eb/FFFFFF?text=Gas+Pro'
  },
  auth: {
    usuario: 'gestion',
    password_hash: 'gestion123',
    session_timeout: 1800
  },
  certificados: {
    validez_años: 5,
    alertas_dias: [30, 60, 90]
  }
};

// Generate single example client
export const generateMockClientes = (): Cliente[] => {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  
  return [{
    id,
    nombre: 'Cliente Ejemplo',
    telefono: '600123456',
    email: 'cliente@ejemplo.com',
    direccion: 'Calle Ejemplo 1, 28001 Madrid',
    dni: '12345678A',
    tipoInstalacion: 'individual',
    tipoGas: 'natural',
    createdAt,
    updatedAt: createdAt
  }];
};

// Generate example certificate for the client
export const generateMockCertificados = (clientes: Cliente[]): Certificado[] => {
  if (clientes.length === 0) return [];
  
  const now = new Date();
  const emissionDate = now;
  const expiryDate = new Date(now);
  expiryDate.setFullYear(now.getFullYear() + 5);
  
  return [{
    id: uuidv4(),
    numeroSerie: 'CERT-1001',
    clienteId: clientes[0].id,
    fechaEmision: emissionDate.toISOString(),
    fechaCaducidad: expiryDate.toISOString(),
    observacionesTecnicas: 'Instalación en buen estado general.',
    estado: 'vigente',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }];
};

// Generate dashboard stats
export const generateMockDashboardStats = (clientes: Cliente[], certificados: Certificado[]): DashboardStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const revisionesEsteMes = certificados.filter(cert => {
    const emissionDate = new Date(cert.fechaEmision);
    return emissionDate.getMonth() === currentMonth && emissionDate.getFullYear() === currentYear;
  }).length;
  
  const revisionesEsteAño = certificados.filter(cert => {
    const emissionDate = new Date(cert.fechaEmision);
    return emissionDate.getFullYear() === currentYear;
  }).length;
  
  const certificadosVigentes = certificados.filter(cert => cert.estado === 'vigente').length;
  const certificadosProximos = certificados.filter(cert => cert.estado === 'proximo').length;
  const certificadosVencidos = certificados.filter(cert => cert.estado === 'vencido').length;
  
  return {
    totalClientes: clientes.length,
    revisionesEsteMes,
    revisionesEsteAño,
    proximasRenovaciones: certificadosProximos,
    certificadosVigentes,
    certificadosProximos,
    certificadosVencidos
  };
};