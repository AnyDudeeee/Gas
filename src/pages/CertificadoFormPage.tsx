import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import { formatDate, calculateExpiryDate } from '../utils/dateUtils';
import { Save, ArrowLeft, Calendar } from 'lucide-react';

const CertificadoFormPage: React.FC = () => {
  const { clientes, addCertificado, config } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    clienteId: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    observacionesTecnicas: ''
  });
  
  const [fechaCaducidad, setFechaCaducidad] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Calculate expiry date when emission date changes
  useEffect(() => {
    if (formData.fechaEmision) {
      const emissionDate = new Date(formData.fechaEmision);
      const expiryDate = calculateExpiryDate(emissionDate, config.certificados.validez_años);
      setFechaCaducidad(expiryDate.toISOString().split('T')[0]);
    }
  }, [formData.fechaEmision, config.certificados.validez_años]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clienteId) {
      newErrors.clienteId = 'Debe seleccionar un cliente';
    }
    
    if (!formData.fechaEmision) {
      newErrors.fechaEmision = 'La fecha de emisión es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Add the certificate with the calculated expiry date
      const certificadoId = addCertificado({
        ...formData,
        fechaCaducidad
      });
      
      if (certificadoId) {
        navigate('/certificados');
      } else {
        setErrors({ submit: 'Error al crear el certificado' });
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error creating certificate:', error);
      setErrors({ submit: 'Error al crear el certificado' });
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/certificados')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nuevo Certificado</h1>
            <p className="text-gray-600">Cree un nuevo certificado de revisión de gas</p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  id="clienteId"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.clienteId ? 'border-red-500' : 'border-gray-300'
                  } bg-white`}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.telefono}
                    </option>
                  ))}
                </select>
                {errors.clienteId && <p className="text-sm text-red-500">{errors.clienteId}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fechaEmision" className="block text-sm font-medium text-gray-700">
                  Fecha de emisión <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    value={formData.fechaEmision}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.fechaEmision ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.fechaEmision && (
                  <p className="text-sm text-red-500">{errors.fechaEmision}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fechaCaducidad" className="block text-sm font-medium text-gray-700">
                  Fecha de caducidad ({config.certificados.validez_años} años)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="fechaCaducidad"
                    value={fechaCaducidad}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  La validez del certificado es de {config.certificados.validez_años} años desde la
                  fecha de emisión
                </p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="observacionesTecnicas"
                  className="block text-sm font-medium text-gray-700"
                >
                  Observaciones técnicas
                </label>
                <textarea
                  id="observacionesTecnicas"
                  name="observacionesTecnicas"
                  rows={4}
                  value={formData.observacionesTecnicas}
                  onChange={handleChange}
                  placeholder="Detalles técnicos de la instalación, estado, recomendaciones..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              {formData.clienteId && (
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Información sobre este certificado
                  </h3>
                  <p className="text-sm text-blue-700">
                    Este certificado será emitido con fecha {formatDate(formData.fechaEmision)} y
                    tendrá validez hasta {formatDate(fechaCaducidad)}.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Se generará automáticamente un número de serie único para este certificado.
                  </p>
                </div>
              )}
              
              {errors.submit && (
                <div className="md:col-span-2 p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/certificados')}
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Generar Certificado
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

export default CertificadoFormPage;