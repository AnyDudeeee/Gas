import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';
import { Cliente } from '../types';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Phone, Mail, Home, Users as UsersIcon } from 'lucide-react';

const ClientesPage: React.FC = () => {
  const { clientes, deleteCliente } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const normalizedSearch = searchTerm.toLowerCase();
      const filtered = clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(normalizedSearch) ||
          cliente.telefono.includes(normalizedSearch) ||
          cliente.email.toLowerCase().includes(normalizedSearch) ||
          cliente.direccion.toLowerCase().includes(normalizedSearch) ||
          (cliente.dni && cliente.dni.toLowerCase().includes(normalizedSearch))
      );
      setFilteredClientes(filtered);
    }
  }, [searchTerm, clientes]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleDelete = (id: string) => {
    setDeleteConfirmation(id);
  };
  
  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteCliente(deleteConfirmation);
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
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
            <p className="text-gray-600">Administre la información de sus clientes</p>
          </div>
          
          <button
            onClick={() => navigate('/clientes/nuevo')}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>
        
        <Card className="mb-6">
          <div className="mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nombre, teléfono, email, dirección o DNI..."
              className="max-w-2xl"
            />
          </div>
          
          {filteredClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo Gas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UsersIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                            <div className="text-sm text-gray-500">{cliente.dni || 'Sin DNI'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center mb-1">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            {cliente.telefono}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {cliente.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Home className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="truncate max-w-xs">{cliente.direccion}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.tipoGas || 'No especificado'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              {searchTerm ? 'No se encontraron clientes con esa búsqueda' : 'No hay clientes registrados'}
            </div>
          )}
        </Card>
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar eliminación</h3>
              <p className="text-gray-500 mb-4">
                ¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.
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

export default ClientesPage;