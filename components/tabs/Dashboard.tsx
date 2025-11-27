import React from 'react';
import { Users, AlertCircle, Award, TrendingUp, TrendingDown, Clock, Calendar, MapPin } from 'lucide-react';
import { cx, formatThaiDate } from '@/utils/helpers';
import { StatCard } from '@/components/ui/StatCard';
import type { Violation } from '@/types';

interface Stats {
  totalStudents: number;
  totalViolations: number;
  averageScore: number;
  criticalStudents: number;
  excellentStudents: number;
  recentViolations: Violation[];
}

interface DashboardProps {
  darkMode: boolean;
  stats: Stats;
}

export const Dashboard: React.FC<DashboardProps> = ({ darkMode, stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users />}
          label="นักเรียนทั้งหมด"
          value={stats.totalStudents}
          color="blue"
          dark={darkMode}
          trend={<TrendingUp className="text-green-500" size={16} />}
        />
        <StatCard
          icon={<AlertCircle />}
          label="การกระทำผิด"
          value={stats.totalViolations}
          color="red"
          dark={darkMode}
          trend={<TrendingDown className="text-red-500" size={16} />}
        />
        <StatCard
          icon={<Award />}
          label="คะแนนเฉลี่ย"
          value={stats.averageScore}
          color="green"
          dark={darkMode}
        />
        <StatCard
          icon={<AlertCircle />}
          label="เสี่ยง (<70)"
          value={stats.criticalStudents}
          color="orange"
          dark={darkMode}
        />
      </div>

      <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-indigo-500" />
          การกระทำผิดล่าสุด
        </h2>
        <div className="space-y-3">
          {stats.recentViolations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
          ) : (
            stats.recentViolations.map((v) => (
              <div
                key={v.id}
                className={cx(
                  'p-4 rounded-lg border',
                  darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{v.studentName} ({v.studentId})</p>
                    <p className="text-red-500 text-sm mt-1">{v.violationType}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{v.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{formatThaiDate(v.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />{v.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />{v.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600">-{v.pointsDeducted}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};