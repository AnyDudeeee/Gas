import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import { Save, Sliders, Building, Lock, FileCheck } from 'lucide-react';

const ConfiguracionPage: React.FC = () => {
  const { config, updateConfig } = useApp();
  
  const [formData, setFormData] = useState({
    empresa: {
      nombre: config.empresa.nombre,
      direccion: config.empresa.direccion,
      telefono: config.empresa.telefono,
      email: config.empresa.email,
      logo: config.empresa.logo || ''
    },
    auth: {
      usuario: config.auth.usuario,
      password_hash: '••••••••', // Placeholder for password
      session_timeout: config.auth.session_timeout
    },
    certificados: {
      validez_años: config.certificados.validez_años,
      alertas_dias: config.certificados.alertas_dias.join(', ')
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section: 'empresa' | 'auth' | 'certificados'
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
    
    // Reset success message when form is changed
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      try {
        // Convert alertas_dias from string to array of numbers
        const alertas_dias = formData.certificados.alertas_dias
          .split(',')
          .map(day => parseInt(day.trim(), 10))
          .filter(day => !isNaN(day));
        
        updateConfig({
          ...config,
          empresa: formData.empresa,
          auth: {
            ...config.auth,
            usuario: formData.auth.usuario,
            session_timeout: formData.auth.session_timeout
          },
          certificados: {
            validez_años: formData.certificados.validez_años,
            alertas_dias
          }
        });
        
        setSaveSuccess(true);
      } catch (error) {
        console.error('Error saving configuration:', error);
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
          <p className="text-gray-600">Configure los parámetros del sistema</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Empresa Information */}
          <Card className="mb-6">
            <div className="flex items-center mb-4">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-800">Datos de la Empresa</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.empresa.nombre}
                  onChange={e => handleChange(e, 'empresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.empresa.telefono}
                  onChange={e => handleChange(e, 'empresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.empresa.email}
                  onChange={e => handleChange(e, 'empresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  URL del Logo
                </label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.empresa.logo}
                  onChange={e => handleChange(e, 'empresa')}
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.empresa.direccion}
                  onChange={e => handleChange(e, 'empresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </Card>
          
          {/* Authentication Settings */}
          <Card className="mb-6">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-800">Configuración de Acceso</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={formData.auth.usuario}
                  onChange={e => handleChange(e, 'auth')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password_hash" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password_hash"
                  name="password_hash"
                  value={formData.auth.password_hash}
                  onChange={e => handleChange(e, 'auth')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  Por seguridad, la contraseña no se puede editar directamente en esta interfaz.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="session_timeout" className="block text-sm font-medium text-gray-700">
                  Tiempo de inactividad (segundos)
                </label>
                <input
                  type="number"
                  id="session_timeout"
                  name="session_timeout"
                  value={formData.auth.session_timeout}
                  onChange={e => handleChange(e, 'auth')}
                  min="60"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500">
                  Tiempo en segundos antes de cerrar la sesión por inactividad (mínimo 60 segundos).
                </p>
              </div>
            </div>
          </Card>
          
          {/* Certificate Settings */}
          <Card className="mb-6">
            <div className="flex items-center mb-4">
              <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-800">Configuración de Certificados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="validez_años" className="block text-sm font-medium text-gray-700">
                  Validez de certificados (años)
                </label>
                <input
                  type="number"
                  id="validez_años"
                  name="validez_años"
                  value={formData.certificados.validez_años}
                  onChange={e => handleChange(e, 'certificados')}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="alertas_dias" className="block text-sm font-medium text-gray-700">
                  Alertas de vencimiento (días)
                </label>
                <input
                  type="text"
                  id="alertas_dias"
                  name="alertas_dias"
                  value={formData.certificados.alertas_dias}
                  onChange={e => handleChange(e, 'certificados')}
                  placeholder="30, 60, 90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500">
                  Días antes del vencimiento para mostrar alertas. Separar valores con comas.
                </p>
              </div>
            </div>
          </Card>
          
          {/* Advanced Settings */}
          <Card className="mb-6">
            <div className="flex items-center mb-4">
              <Sliders className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-800">Configuración Avanzada</h2>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-sm text-yellow-700">
                Las opciones avanzadas como la configuración de backups, exportación de datos y
                notificaciones automáticas no están disponibles en esta versión de demostración.
              </p>
            </div>
          </Card>
          
          {/* Save Button */}
          <div className="flex justify-end">
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
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
          
          {saveSuccess && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              Configuración guardada correctamente.
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ConfiguracionPage;