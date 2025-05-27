import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Cliente, 
  Certificado, 
  Config,
  DashboardStats
} from '../types';
import { 
  defaultConfig, 
  generateMockClientes, 
  generateMockCertificados,
  generateMockDashboardStats
} from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import { calculateExpiryDate } from '../utils/dateUtils';

interface AppContextType {
  config: Config;
  updateConfig: (newConfig: Config) => void;
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCliente: (cliente: Cliente) => void;
  deleteCliente: (id: string) => void;
  getCliente: (id: string) => Cliente | undefined;
  certificados: Certificado[];
  addCertificado: (certificado: Omit<Certificado, 'id' | 'numeroSerie' | 'estado' | 'createdAt' | 'updatedAt'>) => string;
  updateCertificado: (certificado: Certificado) => void;
  deleteCertificado: (id: string) => void;
  getCertificado: (id: string) => Certificado | undefined;
  getCertificadosByCliente: (clienteId: string) => Certificado[];
  renovarCertificado: (certificadoId: string) => string | null;
  stats: DashboardStats;
  refreshStats: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    revisionesEsteMes: 0,
    revisionesEsteAño: 0,
    proximasRenovaciones: 0,
    certificadosVigentes: 0,
    certificadosProximos: 0,
    certificadosVencidos: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nextCertNumber, setNextCertNumber] = useState<number>(1001);
  
  // Initialize data
  useEffect(() => {
    // Load mock data
    const mockClientes = generateMockClientes(50);
    const mockCertificados = generateMockCertificados(mockClientes);
    const mockStats = generateMockDashboardStats(mockClientes, mockCertificados);
    
    setClientes(mockClientes);
    setCertificados(mockCertificados);
    setStats(mockStats);
    
    // Find the highest certificate number and set the next one
    const highestNumber = mockCertificados.reduce((max, cert) => {
      const num = parseInt(cert.numeroSerie.replace('CERT-', ''), 10);
      return num > max ? num : max;
    }, 1000);
    
    setNextCertNumber(highestNumber + 1);
    setIsLoading(false);
  }, []);
  
  // Update certificates status
  useEffect(() => {
    const updateCertificadosStatus = () => {
      const now = new Date();
      const updatedCertificados = certificados.map(cert => {
        const expiryDate = new Date(cert.fechaCaducidad);
        let estado: 'vigente' | 'proximo' | 'vencido' = 'vigente';
        
        if (expiryDate < now) {
          estado = 'vencido';
        } else {
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilExpiry <= Math.max(...config.certificados.alertas_dias)) {
            estado = 'proximo';
          }
        }
        
        return { ...cert, estado };
      });
      
      setCertificados(updatedCertificados);
    };
    
    updateCertificadosStatus();
    
    // Update statuses daily
    const intervalId = setInterval(updateCertificadosStatus, 86400000);
    
    return () => clearInterval(intervalId);
  }, [certificados, config.certificados.alertas_dias]);
  
  const updateConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };
  
  const addCliente = (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString();
    const id = uuidv4();
    const newCliente: Cliente = {
      ...clienteData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    setClientes(prevClientes => [...prevClientes, newCliente]);
    refreshStats();
    
    return id;
  };
  
  const updateCliente = (cliente: Cliente) => {
    setClientes(prevClientes => 
      prevClientes.map(c => c.id === cliente.id ? 
        { ...cliente, updatedAt: new Date().toISOString() } : c
      )
    );
  };
  
  const deleteCliente = (id: string) => {
    // In a real app, you might want to check if the client has certificates
    // and handle those appropriately
    setClientes(prevClientes => prevClientes.filter(c => c.id !== id));
    refreshStats();
  };
  
  const getCliente = (id: string): Cliente | undefined => {
    return clientes.find(c => c.id === id);
  };
  
  const addCertificado = (certificadoData: Omit<Certificado, 'id' | 'numeroSerie' | 'estado' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString();
    const id = uuidv4();
    const numeroSerie = `CERT-${nextCertNumber}`;
    
    const expiryDate = new Date(certificadoData.fechaCaducidad);
    const currentDate = new Date();
    
    let estado: 'vigente' | 'proximo' | 'vencido' = 'vigente';
    
    if (expiryDate < currentDate) {
      estado = 'vencido';
    } else {
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= Math.max(...config.certificados.alertas_dias)) {
        estado = 'proximo';
      }
    }
    
    const newCertificado: Certificado = {
      ...certificadoData,
      id,
      numeroSerie,
      estado,
      createdAt: now,
      updatedAt: now
    };
    
    setCertificados(prevCerts => [...prevCerts, newCertificado]);
    setNextCertNumber(prevNum => prevNum + 1);
    refreshStats();
    
    return id;
  };
  
  const updateCertificado = (certificado: Certificado) => {
    setCertificados(prevCerts => 
      prevCerts.map(c => c.id === certificado.id ? 
        { ...certificado, updatedAt: new Date().toISOString() } : c
      )
    );
  };
  
  const deleteCertificado = (id: string) => {
    setCertificados(prevCerts => prevCerts.filter(c => c.id !== id));
    refreshStats();
  };
  
  const getCertificado = (id: string): Certificado | undefined => {
    return certificados.find(c => c.id === id);
  };
  
  const getCertificadosByCliente = (clienteId: string): Certificado[] => {
    return certificados.filter(c => c.clienteId === clienteId);
  };
  
  const renovarCertificado = (certificadoId: string): string | null => {
    const certificado = getCertificado(certificadoId);
    
    if (!certificado) {
      return null;
    }
    
    const now = new Date();
    const fechaEmision = now.toISOString();
    const fechaCaducidad = calculateExpiryDate(now, config.certificados.validez_años).toISOString();
    
    // Create a new certificate based on the old one
    const newCertId = addCertificado({
      clienteId: certificado.clienteId,
      fechaEmision,
      fechaCaducidad,
      observacionesTecnicas: certificado.observacionesTecnicas
    });
    
    return newCertId;
  };
  
  const refreshStats = () => {
    setStats(generateMockDashboardStats(clientes, certificados));
  };
  
  return (
    <AppContext.Provider
      value={{
        config,
        updateConfig,
        clientes,
        addCliente,
        updateCliente,
        deleteCliente,
        getCliente,
        certificados,
        addCertificado,
        updateCertificado,
        deleteCertificado,
        getCertificado,
        getCertificadosByCliente,
        renovarCertificado,
        stats,
        refreshStats,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};