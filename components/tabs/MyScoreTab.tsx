import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cx, formatThaiDate } from '@/utils/helpers';
import { MiniStat } from '@/components/ui/MiniStat';
import type { Student, Violation } from '@/types';

interface MyScoreTabProps {
  darkMode: boolean;
  student: Student | undefined;
  violations: Violation[];
}

export const MyScoreTab: React.FC<MyScoreTabProps> = ({ darkMode, student, violations }) => {
  if (!student) {
    return <div>ไม่พบข้อมูลนักเรียน</div>;
  }

  const totalMinus = violations.reduce((s, v) => s + v.pointsDeducted, 0);

  return (
    <div className="space-y-6">
      <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
        <h2 className="text-xl font-semibold mb-4">คะแนนของฉัน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MiniStat label="คะแนนปัจจุบัน" value={student.conductScore} />
          <MiniStat label="หักสะสม" value={`-${totalMinus}`} />
          <MiniStat label="ชั้น/แผนก" value={student.class} />
        </div>
      </div>

      <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4">รายการที่ถูกหักคะแนน</h3>
        <div className="space-y-3">
          {violations.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีรายการ</p>
          ) : (
            violations.slice().reverse().map((v) => (
              <div
                key={v.id}
                className={cx(
                  'p-4 rounded-lg border',
                  darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{v.violationType}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{v.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatThaiDate(v.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {v.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {v.location}
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