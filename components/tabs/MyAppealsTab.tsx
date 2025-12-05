import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { cx, formatThaiDate } from '@/utils/helpers';
import { Textarea } from '@/components/ui/Textarea';
import type { Student, Violation } from '@/types';

interface MyAppealsTabProps {
  darkMode: boolean;
  myViolations: Violation[];
  meStudent: Student | undefined;
  onSubmit: (violationId: string, message: string, image?: string) => void;
}

export const MyAppealsTab: React.FC<MyAppealsTabProps> = ({
  darkMode,
  myViolations,
  meStudent,
  onSubmit
}) => {
  const [selected, setSelected] = useState<string>('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setPreview(res);
      setImageDataUrl(res);
    };
    reader.readAsDataURL(file);
  };

  const myAppeals = myViolations.flatMap((v) =>
    (v.appeals || []).map((a) => ({ ...a, _vId: v.id, _vType: v.violationType }))
  );

  return (
    <div className="space-y-6">
      {meStudent && (
        <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">ยื่นอุทธรณ์/แนบหลักฐาน</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">เลือกรายการความผิด</label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">-- เลือกรายการ --</option>
                {myViolations.filter(v => !(v.appeals && v.appeals.length > 0)).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.violationType} • {formatThaiDate(v.date)} (-{v.pointsDeducted})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">แนบรูปหลักฐาน (ไม่บังคับ)</label>
              <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 w-fit">
                <Image className="w-5 h-5" />
                <span className="text-gray-700 dark:text-gray-300">เลือกไฟล์/เปิดกล้อง</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e.currentTarget.files?.[0])}
                />
              </label>
              {preview && <img src={preview} alt="preview" className="h-24 mt-2 rounded border object-cover" />}
            </div>
          </div>

          <Textarea label="รายละเอียดอุทธรณ์" value={message} onChange={setMessage} />

          <button
            disabled={!selected || !message.trim()}
            onClick={() => {
              onSubmit(selected, message.trim(), imageDataUrl || undefined);
              setSelected('');
              setMessage('');
              setPreview('');
              setImageDataUrl('');
            }}
            className={cx(
              'w-full py-2.5 rounded-md font-medium',
              !selected || !message.trim()
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
          >
            ส่งอุทธรณ์
          </button>
        </div>
      )}

      <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">สถานะคำร้องของฉัน</h3>
        {myAppeals.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีคำร้อง</p>
        ) : (
          <div className="space-y-3">
            {myAppeals.slice().reverse().map((a) => (
              <div
                key={a.id}
                className={cx(
                  'p-4 rounded-lg border',
                  a.status === 'pending'
                    ? darkMode
                      ? 'border-yellow-700 bg-yellow-900/20'
                      : 'border-yellow-300 bg-yellow-50'
                    : a.status === 'approved'
                      ? darkMode
                        ? 'border-green-700 bg-green-900/20'
                        : 'border-green-300 bg-green-50'
                      : darkMode
                        ? 'border-red-700 bg-red-900/20'
                        : 'border-red-300 bg-red-50'
                )}
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-sm">
                      ความผิด: <span className="font-medium">{a._vType}</span>
                    </p>
                    <p className="mt-1 text-gray-800 dark:text-white">{a.message}</p>
                    {a.image && <img src={a.image} className="h-20 mt-2 rounded border object-cover" alt="evidence" />}
                    <p className="text-[11px] text-gray-500 mt-1">
                      ยื่นเมื่อ: {new Date(a.submittedAt).toLocaleString('th-TH')}
                    </p>
                    {a.teacherResponse && (
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        ครูตอบ: {a.teacherResponse} {a.restoredPoints ? `(คืน ${a.restoredPoints} คะแนน)` : ''}
                      </p>
                    )}
                  </div>
                  <span
                    className={cx(
                      'text-xs h-fit px-2 py-1 rounded-full font-semibold',
                      a.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : a.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    )}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};