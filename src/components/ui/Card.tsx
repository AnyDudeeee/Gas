import React from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;