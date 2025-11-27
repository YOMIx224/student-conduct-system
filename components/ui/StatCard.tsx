import React from 'react';
import { cx } from '@/utils/helpers';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: 'blue' | 'red' | 'green' | 'orange';
  dark: boolean;
  trend?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, dark, trend }) => {
  const colors: Record<string, string> = {
    blue: dark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600',
    red: dark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600',
    green: dark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600',
    orange: dark ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600',
  };

  return (
    <div className={cx('p-5 rounded-xl shadow-md transition hover:shadow-lg', dark ? 'bg-gray-800' : 'bg-white')}>
      <div className="flex items-start justify-between mb-3">
        <div className={cx('p-3 rounded-lg', colors[color])}>{icon}</div>
        {trend && <div>{trend}</div>}
      </div>
      <p className="text-sm opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};