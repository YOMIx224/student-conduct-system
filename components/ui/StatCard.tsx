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

const gradients: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-600',
  red: 'from-red-500 to-rose-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-amber-600',
};

const glowColors: Record<string, string> = {
  blue: 'group-hover:shadow-blue-500/20',
  red: 'group-hover:shadow-red-500/20',
  green: 'group-hover:shadow-emerald-500/20',
  orange: 'group-hover:shadow-orange-500/20',
};

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, dark, trend }) => {
  return (
    <div
      className={cx(
        'group relative p-6 rounded-2xl transition-all duration-300 card-hover overflow-hidden',
        dark ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm',
        'shadow-lg hover:shadow-2xl',
        glowColors[color]
      )}
    >
      {/* Background Gradient Decoration */}
      <div
        className={cx(
          'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl transition-opacity group-hover:opacity-20',
          gradients[color]
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div
            className={cx(
              'p-3 rounded-xl bg-gradient-to-br shadow-lg',
              gradients[color]
            )}
          >
            <span className="text-white">{icon}</span>
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
              {trend}
            </div>
          )}
        </div>

        {/* Label */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>

        {/* Value */}
        <p className="text-4xl font-bold tracking-tight">
          <span className={cx('bg-gradient-to-r bg-clip-text text-transparent', gradients[color])}>
            {value}
          </span>
        </p>
      </div>
    </div>
  );
};