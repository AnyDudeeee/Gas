import React from 'react';

interface StatProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const Stat: React.FC<StatProps> = ({
  title,
  value,
  icon,
  trend,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      
      <div className="mt-2">
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stat;