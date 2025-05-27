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
    password_hash: 'gestion123', // This would be hashed in a real application
    session_timeout: 1800
  },
  certificados: {
    validez_años: 5,
    alertas_dias: [30, 60, 90]
  }
};

// Generate mock clients
export const generateMockClientes = (count: number): Cliente[] => {
  const clientes: Cliente[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
    
    clientes.push({
      id,
      nombre: `Cliente ${i + 1}`,
      telefono: `6${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `cliente${i + 1}@example.com`,
      direccion: `Calle Ejemplo ${i + 1}, 28001 Madrid`,
      dni: `${Math.floor(10000000 + Math.random() * 90000000)}A`,
      tipoInstalacion: Math.random() > 0.5 ? 'individual' : 'comunitaria',
      tipoGas: ['natural', 'butano', 'propano'][Math.floor(Math.random() * 3)] as 'natural' | 'butano' | 'propano',
      createdAt,
      updatedAt: createdAt
    });
  }
  
  return clientes;
};

// Generate mock certificates
export const generateMockCertificados = (clientes: Cliente[]): Certificado[] => {
  const certificados: Certificado[] = [];
  const now = new Date();
  let counter = 1001;
  
  clientes.forEach(cliente => {
    // Random date in the past 4 years
    const emissionDate = new Date(now.getTime() - Math.random() * 4 * 365 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(emissionDate);
    expiryDate.setFullYear(emissionDate.getFullYear() + 5);
    
    // Calculate status
    let estado: 'vigente' | 'proximo' | 'vencido' = 'vigente';
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      estado = 'vencido';
    } else if (daysUntilExpiry < 90) {
      estado = 'proximo';
    }
    
    certificados.push({
      id: uuidv4(),
      numeroSerie: `CERT-${counter++}`,
      clienteId: cliente.id,
      fechaEmision: emissionDate.toISOString(),
      fechaCaducidad: expiryDate.toISOString(),
      observacionesTecnicas: Math.random() > 0.7 ? 'Instalación en buen estado general.' : undefined,
      estado,
      createdAt: emissionDate.toISOString(),
      updatedAt: emissionDate.toISOString()
    });
  });
  
  return certificados;
};

// Generate mock dashboard stats
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