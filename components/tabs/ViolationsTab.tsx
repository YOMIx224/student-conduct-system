import React from 'react';
import { PlusCircle, Calendar, Clock, MapPin, User as UserIcon, Check, Edit2, Trash2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">บันทึกการกระทำผิด</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          <PlusCircle size={18} /> บันทึกการกระทำผิด
        </button>
      </div>

      <div className="space-y-4">
        {violations.slice().reverse().map((v) => (
          <div
            key={v.id}
            className={cx('rounded-xl shadow-md p-5', darkMode ? 'bg-gray-800' : 'bg-white')}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{v.studentName}</h3>
                  <span className="text-sm text-gray-500">({v.studentId})</span>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded mb-3">
                  <p className="font-semibold text-red-700 dark:text-red-400">{v.violationType}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{v.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatThaiDate(v.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{v.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{v.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} />
                    <span>{v.recordedBy}</span>
                  </div>
                </div>

                {/* Appeals */}
                <div className="space-y-2">
                  <h4 className="font-semibold">คำร้องอุทธรณ์ ({v.appeals?.length || 0})</h4>
                  {v.appeals && v.appeals.length > 0 ? (
                    v.appeals.slice().reverse().map((ap) => (
                      <div
                        key={ap.id}
                        className={cx(
                          'rounded-md p-3 border',
                          ap.status === 'pending'
                            ? darkMode
                              ? 'border-yellow-700 bg-yellow-900/20'
                              : 'border-yellow-300 bg-yellow-50'
                            : ap.status === 'approved'
                              ? darkMode
                                ? 'border-green-700 bg-green-900/20'
                                : 'border-green-300 bg-green-50'
                              : darkMode
                                ? 'border-red-700 bg-red-900/20'
                                : 'border-red-300 bg-red-50'
                        )}
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">จากนักเรียน: {ap.byStudentId}</p>
                            <p className="text-sm mt-1">{ap.message}</p>
                            {ap.image && (
                              <img
                                src={ap.image}
                                alt="evidence"
                                className="h-24 mt-2 rounded border object-cover"
                              />
                            )}
                            <p className="text-[11px] text-gray-500 mt-1">
                              ยื่นเมื่อ: {new Date(ap.submittedAt).toLocaleString('th-TH')}
                            </p>
                            {ap.teacherResponse && (
                              <p className="text-sm mt-1">
                                ครูตอบ: {ap.teacherResponse}{' '}
                                {ap.restoredPoints ? `(คืน ${ap.restoredPoints} คะแนน)` : ''}
                              </p>
                            )}
                          </div>

                          {ap.status === 'pending' && (
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => {
                                  const ptsStr = prompt('ระบุคะแนนที่จะคืนให้ (ใส่ 0 ได้):', '0') ?? '0';
                                  const pts = Math.max(0, Math.min(100, parseInt(ptsStr)));
                                  const resp = prompt(
                                    'ข้อความถึงนักเรียน (ตัวเลือก):',
                                    'รับพิจารณาและอนุมัติการคืนคะแนน'
                                  );
                                  reviewAppeal(v.id, ap.id, 'approved', resp || 'อนุมัติ', pts);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" /> อนุมัติ
                              </button>
                              <button
                                onClick={() => {
                                  const resp = prompt('เหตุผลในการปฏิเสธ:', 'หลักฐานยังไม่เพียงพอ');
                                  if (resp !== null) reviewAppeal(v.id, ap.id, 'rejected', resp || 'ปฏิเสธ');
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                              >
                                ปฏิเสธ
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">ยังไม่มีคำร้องอุทธรณ์</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-3xl font-bold text-red-600">-{v.pointsDeducted}</div>
                <div className="text-xs text-gray-500">คะแนน</div>

                {/* Edit and Delete buttons */}
                <div className="flex gap-2 mt-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(v)}
                      className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
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
                      className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};