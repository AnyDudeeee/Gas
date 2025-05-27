import React from 'react';
import { EstadoCertificado } from '../../types';

interface StatusBadgeProps {
  status: EstadoCertificado;
  daysRemaining?: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, daysRemaining }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  
  switch (status) {
    case 'vigente':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Vigente';
      break;
    case 'proximo':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = daysRemaining !== undefined 
        ? `Vence en ${daysRemaining} días` 
        : 'Próximo a vencer';
      break;
    case 'vencido':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Vencido';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Desconocido';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;