import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-500 mt-1">{title}</p>
    </div>
  );
};

export default StatCard;