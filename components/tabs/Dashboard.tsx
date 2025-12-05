import React from 'react';
import { Users, AlertCircle, Award, TrendingUp, TrendingDown, Clock, Calendar, MapPin, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className={cx(
        'relative overflow-hidden rounded-2xl p-6 shadow-lg',
        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
      )}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="text-white" size={32} />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">ยินดีต้อนรับสู่ระบบ</h1>
            <p className="opacity-90">ระบบตัดคะแนนความประพฤตินักเรียน-นักศึกษา</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={24} />}
          label="นักเรียนทั้งหมด"
          value={stats.totalStudents}
          color="blue"
          dark={darkMode}
          trend={<TrendingUp className="text-green-500" size={16} />}
        />
        <StatCard
          icon={<AlertCircle size={24} />}
          label="การกระทำผิด"
          value={stats.totalViolations}
          color="red"
          dark={darkMode}
          trend={<TrendingDown className="text-red-500" size={16} />}
        />
        <StatCard
          icon={<Award size={24} />}
          label="คะแนนเฉลี่ย"
          value={stats.averageScore}
          color="green"
          dark={darkMode}
        />
        <StatCard
          icon={<AlertCircle size={24} />}
          label="เสี่ยง (<70)"
          value={stats.criticalStudents}
          color="orange"
          dark={darkMode}
        />
      </div>

      {/* Recent Violations */}
      <div className={cx(
        'rounded-2xl shadow-lg p-6 card-hover',
        darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      )}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
            <Clock size={20} className="text-white" />
          </div>
          <span className="text-gray-800 dark:text-white">การกระทำผิดล่าสุด</span>
        </h2>
        <div className="space-y-3">
          {stats.recentViolations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500">ยังไม่มีข้อมูลการกระทำผิด</p>
            </div>
          ) : (
            stats.recentViolations.map((v, index) => (
              <div
                key={v.id}
                className={cx(
                  'p-4 rounded-xl border transition-all duration-300 hover:shadow-md',
                  darkMode
                    ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700/70'
                    : 'border-gray-100 bg-gray-50/50 hover:bg-white'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {v.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{v.studentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">({v.studentId})</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-10">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                        {v.violationType}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{v.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{formatThaiDate(v.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />{v.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />{v.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
                      -{v.pointsDeducted}
                    </span>
                    <span className="text-xs text-gray-400">คะแนน</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};