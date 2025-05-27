import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';
import StatusBadge from '../components/ui/StatusBadge';
import { Certificado, Cliente } from '../types';
import { useNavigate } from 'react-router-dom';
import { formatDate, getDaysRemaining } from '../utils/dateUtils';
import { Plus, FileCheck, RefreshCw, Printer, Trash2, Download } from 'lucide-react';
import { generateCertificatePDF } from '../utils/pdfUtils';

const CertificadosPage: React.FC = () => {
  const { certificados, clientes, getCliente, renovarCertificado, deleteCertificado, config } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'vigente' | 'proximo' | 'vencido'>('todos');
  const [filteredCertificados, setFilteredCertificados] = useState<Certificado[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [clientesMap, setClientesMap] = useState<Record<string, Cliente>>({});
  
  useEffect(() => {
    // Create a map of clientId -> Cliente for quicker lookups
    const map: Record<string, Cliente> = {};
    clientes.forEach(cliente => {
      map[cliente.id] = cliente;
    });
    setClientesMap(map);
  }, [clientes]);
  
  useEffect(() => {
    let filtered = [...certificados];
    
    // Apply status filter
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(cert => cert.estado === filterStatus);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(cert => {
        const cliente = clientesMap[cert.clienteId];
        return (
          cert.numeroSerie.toLowerCase().includes(normalizedSearch) ||
          (cliente?.nombre && cliente.nombre.toLowerCase().includes(normalizedSearch)) ||
          (cliente?.telefono && cliente.telefono.includes(normalizedSearch)) ||
          (cliente?.dni && cliente.dni.toLowerCase().includes(normalizedSearch))
        );
      });
    }
    
    // Sort by emission date, newest first
    filtered = filtered.sort((a, b) => 
      new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
    );
    
    setFilteredCertificados(filtered);
  }, [certificados, searchTerm, filterStatus, clientesMap]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as 'todos' | 'vigente' | 'proximo' | 'vencido');
  };
  
  const handleRenovar = (certificadoId: string) => {
    renovarCertificado(certificadoId);
  };
  
  const handleImprimir = (certificadoId: string) => {
    const certificado = certificados.find(c => c.id === certificadoId);
    if (!certificado) return;
    
    const cliente = getCliente(certificado.clienteId);
    if (!cliente) return;
    
    const doc = generateCertificatePDF(cliente, certificado, config);
    doc.save(`certificado_${certificado.numeroSerie}.pdf`);
  };
  
  const handleDelete = (id: string) => {
    setDeleteConfirmation(id);
  };
  
  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteCertificado(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Certificados de Revisión</h1>
            <p className="text-gray-600">Gestione los certificados de revisión de gas</p>
          </div>
          
          <button
            onClick={() => navigate('/certificados/nuevo')}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Certificado
          </button>
        </div>
        
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nº certificado, cliente o DNI..."
              className="md:w-1/2"
            />
            
            <div className="md:w-1/4">
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="todos">Todos los estados</option>
                <option value="vigente">Vigentes</option>
                <option value="proximo">Próximos a vencer</option>
                <option value="vencido">Vencidos</option>
              </select>
            </div>
            
            <div className="md:w-1/4 flex justify-end">
              <button
                onClick={() => {
                  // Download all filtered certificates as a single PDF
                  // This is a placeholder for now
                  alert('Función de exportación no implementada en esta versión de demostración');
                }}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar lista
              </button>
            </div>
          </div>
          
          {filteredCertificados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nº Certificado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Emisión
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Caducidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCertificados.map(certificado => {
                    const cliente = clientesMap[certificado.clienteId];
                    const daysRemaining = getDaysRemaining(certificado.fechaCaducidad);
                    
                    return (
                      <tr key={certificado.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {certificado.numeroSerie}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {cliente ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                              <div className="text-xs text-gray-500">{cliente.telefono}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Cliente no encontrado</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(certificado.fechaEmision)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(certificado.fechaCaducidad)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={certificado.estado} daysRemaining={daysRemaining} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleImprimir(certificado.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Imprimir certificado"
                            >
                              <Printer className="h-5 w-5" />
                            </button>
                            
                            {certificado.estado !== 'vigente' && (
                              <button
                                onClick={() => handleRenovar(certificado.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Renovar certificado"
                              >
                                <RefreshCw className="h-5 w-5" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDelete(certificado.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              {searchTerm || filterStatus !== 'todos'
                ? 'No se encontraron certificados con esos criterios'
                : 'No hay certificados registrados'}
            </div>
          )}
        </Card>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
              <p className="text-gray-500 mb-4">
                ¿Está seguro de que desea eliminar este certificado? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CertificadosPage;