import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import { Save, ArrowLeft } from 'lucide-react';

const ClienteFormPage: React.FC = () => {
  const { addCliente, updateCliente, getCliente } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    dni: '',
    telefonoAlternativo: '',
    observaciones: '',
    tipoInstalacion: '',
    numeroContrato: '',
    empresaInstaladora: '',
    tipoGas: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (isEditing && id) {
      const cliente = getCliente(id);
      if (cliente) {
        setFormData({
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          email: cliente.email,
          direccion: cliente.direccion,
          dni: cliente.dni || '',
          telefonoAlternativo: cliente.telefonoAlternativo || '',
          observaciones: cliente.observaciones || '',
          tipoInstalacion: cliente.tipoInstalacion || '',
          numeroContrato: cliente.numeroContrato || '',
          empresaInstaladora: cliente.empresaInstaladora || '',
          tipoGas: cliente.tipoGas || ''
        });
      } else {
        navigate('/clientes');
      }
    }
  }, [isEditing, id, getCliente, navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    // Phone validation
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{9}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'El email no es válido';
    }
    
    // Address validation
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    
    // Optional phone validation
    if (
      formData.telefonoAlternativo.trim() &&
      !/^\d{9}$/.test(formData.telefonoAlternativo.trim())
    ) {
      newErrors.telefonoAlternativo = 'El teléfono alternativo debe tener 9 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      try {
        if (isEditing && id) {
          const cliente = getCliente(id);
          if (cliente) {
            updateCliente({
              ...cliente,
              ...formData,
              tipoInstalacion: (formData.tipoInstalacion as 'individual' | 'comunitaria' | undefined) || undefined,
              tipoGas: (formData.tipoGas as 'natural' | 'butano' | 'propano' | undefined) || undefined
            });
          }
        } else {
          addCliente({
            ...formData,
            tipoInstalacion: (formData.tipoInstalacion as 'individual' | 'comunitaria' | undefined) || undefined,
            tipoGas: (formData.tipoGas as 'natural' | 'butano' | 'propano' | undefined) || undefined
          });
        }
        
        navigate('/clientes');
      } catch (error) {
        console.error('Error saving client:', error);
        setIsSaving(false);
      }
    }, 500);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/clientes')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? 'Actualice la información del cliente'
                : 'Ingrese la información del nuevo cliente'}
            </p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datos Personales */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Datos Personales</h2>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                  DNI/NIF
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefonoAlternativo" className="block text-sm font-medium text-gray-700">
                  Teléfono alternativo
                </label>
                <input
                  type="tel"
                  id="telefonoAlternativo"
                  name="telefonoAlternativo"
                  value={formData.telefonoAlternativo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.telefonoAlternativo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.telefonoAlternativo && (
                  <p className="text-sm text-red-500">{errors.telefonoAlternativo}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
              </div>
              
              {/* Datos de la Instalación */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Datos de la Instalación</h2>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tipoInstalacion" className="block text-sm font-medium text-gray-700">
                  Tipo de instalación
                </label>
                <select
                  id="tipoInstalacion"
                  name="tipoInstalacion"
                  value={formData.tipoInstalacion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="individual">Individual</option>
                  <option value="comunitaria">Comunitaria</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tipoGas" className="block text-sm font-medium text-gray-700">
                  Tipo de gas
                </label>
                <select
                  id="tipoGas"
                  name="tipoGas"
                  value={formData.tipoGas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="natural">Natural</option>
                  <option value="butano">Butano</option>
                  <option value="propano">Propano</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="numeroContrato" className="block text-sm font-medium text-gray-700">
                  Número de contrato
                </label>
                <input
                  type="text"
                  id="numeroContrato"
                  name="numeroContrato"
                  value={formData.numeroContrato}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="empresaInstaladora" className="block text-sm font-medium text-gray-700">
                  Empresa instaladora
                </label>
                <input
                  type="text"
                  id="empresaInstaladora"
                  name="empresaInstaladora"
                  value={formData.empresaInstaladora}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  rows={3}
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/clientes')}
                className="px-4 py-2 mr-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-4 py-2 ${
                  isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-md transition-colors`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ClienteFormPage;