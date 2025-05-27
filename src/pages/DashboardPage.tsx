import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Stat from '../components/ui/Stat';
import StatusBadge from '../components/ui/StatusBadge';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { formatDate, getDaysRemaining, getMonthName } from '../utils/dateUtils';
import { 
  Users, 
  FileCheck, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { stats, certificados, clientes, isLoading } = useApp();
  const [monthlyData, setMonthlyData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: []
  });
  const [certificadosEstados, setCertificadosEstados] = useState<{ labels: string[]; data: number[] }>({
    labels: ['Vigentes', 'Próximos a vencer', 'Vencidos'],
    data: [0, 0, 0]
  });
  
  useEffect(() => {
    if (!isLoading) {
      // Generate monthly data for the bar chart (last 6 months)
      const months: string[] = [];
      const data: number[] = [];
      
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push(getMonthName(month));
        
        // Count certificates issued in this month
        const count = certificados.filter(cert => {
          const date = new Date(cert.fechaEmision);
          return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
        }).length;
        
        data.push(count);
      }
      
      setMonthlyData({ labels: months, data });
      
      // Update certificate status data
      setCertificadosEstados({
        labels: ['Vigentes', 'Próximos a vencer', 'Vencidos'],
        data: [stats.certificadosVigentes, stats.certificadosProximos, stats.certificadosVencidos]
      });
    }
  }, [isLoading, certificados, stats]);
  
  // Get certificates about to expire
  const proximosVencer = certificados
    .filter(cert => cert.estado === 'proximo')
    .sort((a, b) => new Date(a.fechaCaducidad).getTime() - new Date(b.fechaCaducidad).getTime())
    .slice(0, 5);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al sistema de gestión de revisiones de gas</p>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat
            title="Total Clientes"
            value={stats.totalClientes}
            icon={<Users className="h-6 w-6" />}
          />
          <Stat
            title="Revisiones este Mes"
            value={stats.revisionesEsteMes}
            icon={<FileCheck className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <Stat
            title="Revisiones Año Actual"
            value={stats.revisionesEsteAño}
            icon={<Calendar className="h-6 w-6" />}
          />
          <Stat
            title="Próximas Renovaciones"
            value={stats.proximasRenovaciones}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChart
            title="Revisiones por Mes"
            labels={monthlyData.labels}
            data={monthlyData.data}
          />
          <PieChart
            title="Estado de Certificados"
            labels={certificadosEstados.labels}
            data={certificadosEstados.data}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </div>
        
        {/* Upcoming Renewals */}
        <Card title="Próximas Renovaciones" className="mb-6">
          {proximosVencer.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nº Certificado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Caducidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proximosVencer.map(cert => {
                    const cliente = clientes.find(c => c.id === cert.clienteId);
                    const daysRemaining = getDaysRemaining(cert.fechaCaducidad);
                    
                    return (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {cliente ? cliente.nombre : 'Cliente desconocido'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cliente ? cliente.telefono : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {cert.numeroSerie}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(cert.fechaCaducidad)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={cert.estado} daysRemaining={daysRemaining} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay certificados próximos a vencer
            </div>
          )}
        </Card>
        
        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.certificadosVigentes}</h3>
              <p className="text-sm text-gray-500">Certificados vigentes</p>
            </div>
          </Card>
          
          <Card className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.certificadosProximos}</h3>
              <p className="text-sm text-gray-500">Próximos a vencer</p>
            </div>
          </Card>
          
          <Card className="flex items-center">
            <div className="mr-4 p-3 rounded-full bg-red-100 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stats.certificadosVencidos}</h3>
              <p className="text-sm text-gray-500">Certificados vencidos</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;