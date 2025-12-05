import React from 'react';
import { PlusCircle, Calendar, Clock, MapPin, User as UserIcon, Check, Edit2, Trash2, FileWarning, X } from 'lucide-react';
import { cx, formatThaiDate } from '@/utils/helpers';
import type { Violation, AppealStatus } from '@/types';

interface ViolationsTabProps {
  darkMode: boolean;
  violations: Violation[];
  onAdd: () => void;
  reviewAppeal: (violationId: string, appealId: string, status: AppealStatus, teacherResponse: string, restoredPoints?: number) => void;
  onEdit?: (violation: Violation) => void;
  onDelete?: (violationId: string) => void;
}

export const ViolationsTab: React.FC<ViolationsTabProps> = ({
  darkMode,
  violations,
  onAdd,
  reviewAppeal,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
            <FileWarning className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">บันทึกการกระทำผิด</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">ทั้งหมด {violations.length} รายการ</p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 btn-glow"
        >
          <PlusCircle size={18} /> บันทึกการกระทำผิด
        </button>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {violations.length === 0 ? (
          <div className={cx(
            'rounded-2xl p-12 text-center',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FileWarning className="text-gray-400" size={40} />
            </div>
            <p className="text-gray-500 text-lg">ยังไม่มีบันทึกการกระทำผิด</p>
          </div>
        ) : (
          violations.slice().reverse().map((v, index) => (
            <div
              key={v.id}
              className={cx(
                'rounded-2xl shadow-lg p-6 card-hover transition-all duration-300',
                darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {v.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{v.studentName}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">รหัส: {v.studentId}</span>
                    </div>
                  </div>

                  {/* Violation Info */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                    <p className="font-bold text-red-600 dark:text-red-400">{v.violationType}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{v.description}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <Calendar size={16} className="text-indigo-500" />
                      <span>{formatThaiDate(v.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <Clock size={16} className="text-purple-500" />
                      <span>{v.time}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <MapPin size={16} className="text-pink-500" />
                      <span>{v.location}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <UserIcon size={16} className="text-blue-500" />
                      <span>{v.recordedBy}</span>
                    </div>
                  </div>

                  {/* Appeals */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span>คำร้องอุทธรณ์</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700">{v.appeals?.length || 0}</span>
                    </h4>
                    {v.appeals && v.appeals.length > 0 ? (
                      v.appeals.slice().reverse().map((ap) => (
                        <div
                          key={ap.id}
                          className={cx(
                            'rounded-xl p-4 border-l-4 transition-all',
                            ap.status === 'pending'
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                              : ap.status === 'approved'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          )}
                        >
                          <div className="flex flex-wrap justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cx(
                                  'px-2 py-0.5 rounded-full text-xs font-medium',
                                  ap.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    ap.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                )}>
                                  {ap.status === 'pending' ? '⏳ รอพิจารณา' : ap.status === 'approved' ? '✅ อนุมัติ' : '❌ ปฏิเสธ'}
                                </span>
                              </div>
                              <p className="text-sm">{ap.message}</p>
                              {ap.image && (
                                <img src={ap.image} alt="evidence" className="h-20 mt-2 rounded-lg object-cover" />
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                ยื่นเมื่อ: {new Date(ap.submittedAt).toLocaleString('th-TH')}
                              </p>
                              {ap.teacherResponse && (
                                <p className="text-sm mt-2 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                  💬 ครูตอบ: {ap.teacherResponse}
                                  {ap.restoredPoints ? ` (คืน ${ap.restoredPoints} คะแนน)` : ''}
                                </p>
                              )}
                            </div>

                            {ap.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const ptsStr = prompt('ระบุคะแนนที่จะคืนให้ (ใส่ 0 ได้):', '0') ?? '0';
                                    const pts = Math.max(0, Math.min(100, parseInt(ptsStr)));
                                    const resp = prompt('ข้อความถึงนักเรียน:', 'อนุมัติการคืนคะแนน');
                                    reviewAppeal(v.id, ap.id, 'approved', resp || 'อนุมัติ', pts);
                                  }}
                                  className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25 transition-all"
                                  title="อนุมัติ"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    const resp = prompt('เหตุผลในการปฏิเสธ:', 'หลักฐานไม่เพียงพอ');
                                    if (resp !== null) reviewAppeal(v.id, ap.id, 'rejected', resp || 'ปฏิเสธ');
                                  }}
                                  className="p-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-red-500/25 transition-all"
                                  title="ปฏิเสธ"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">ยังไม่มีคำร้องอุทธรณ์</p>
                    )}
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-center">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
                      -{v.pointsDeducted}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">คะแนน</div>
                  </div>

                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(v)}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                        title="แก้ไข"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm(`ต้องการลบการกระทำผิดของ ${v.studentName} หรือไม่?`)) {
                            onDelete(v.id);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-red-500 hover:to-rose-600 shadow-lg transition-all hover:-translate-y-0.5"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};