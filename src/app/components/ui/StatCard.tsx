// src/components/ui/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  onClick?: () => void; // Tambahkan prop onClick
}

const StatCard: React.FC<StatCardProps> = ({ title, value, onClick }) => {
  return (
    // Tambahkan onClick dan kelas hover
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
    >
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500 mt-1">{title}</p>
    </div>
  );
};

export default StatCard;