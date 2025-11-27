import React from 'react';

interface MiniStatProps {
  label: string;
  value: number | string;
}

export const MiniStat: React.FC<MiniStatProps> = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4 text-center shadow-sm">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);