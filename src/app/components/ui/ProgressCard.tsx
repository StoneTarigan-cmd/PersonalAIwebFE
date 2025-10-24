// src/components/ui/ProgressCard.tsx
import React from 'react';

interface ProgressCardProps {
  title: string;
  percentage: number;
  accentColor: 'cyan' | 'blue' | 'orange'; // Warna aksen yang lebih tegas
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, percentage, accentColor }) => {
  const colorSchemes = {
    cyan: {
      ring: 'stroke-cyan-400',
      glow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    },
    blue: {
      ring: 'stroke-blue-400',
      glow: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]',
    },
    orange: {
      ring: 'stroke-orange-400',
      glow: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]',
    },
  };

  const theme = colorSchemes[accentColor];
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-slate-600">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
      
      {/* Progress Chart */}
      <div className="flex justify-center">
        <div className={`relative ${theme.glow}`}>
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Lingkaran Latar */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="rgba(148, 163, 184, 0.1)" // slate-400 dengan opacity sangat rendah
              strokeWidth="10"
              fill="none"
            />
            {/* Lingkaran Progress */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={theme.ring}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.6s ease-out',
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;