export interface User {
  username: string;
  password: string;
}

export interface Config {
  empresa: {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    logo?: string;
  };
  auth: {
    usuario: string;
    password_hash: string;
    session_timeout: number;
  };
  certificados: {
    validez_años: number;
    alertas_dias: number[];
  };
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  dni?: string;
  telefonoAlternativo?: string;
  observaciones?: string;
  tipoInstalacion?: 'individual' | 'comunitaria';
  numeroContrato?: string;
  empresaInstaladora?: string;
  tipoGas?: 'natural' | 'butano' | 'propano';
  createdAt: string;
  updatedAt: string;
}

export interface Certificado {
  id: string;
  numeroSerie: string;
  clienteId: string;
  fechaEmision: string;
  fechaCaducidad: string;
  observacionesTecnicas?: string;
  estado: 'vigente' | 'proximo' | 'vencido';
  createdAt: string;
  updatedAt: string;
}

export type EstadoCertificado = 'vigente' | 'proximo' | 'vencido';

export interface DashboardStats {
  totalClientes: number;
  revisionesEsteMes: number;
  revisionesEsteAño: number;
  proximasRenovaciones: number;
  certificadosVigentes: number;
  certificadosProximos: number;
  certificadosVencidos: number;
}