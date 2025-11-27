import React, { useRef } from 'react';
import { Search, PlusCircle, Edit, Trash2, Upload, Download } from 'lucide-react';
import { cx } from '@/utils/helpers';
import type { Student, UserAccount } from '@/types';
import * as XLSX from 'xlsx';

interface StudentsTabProps {
  darkMode: boolean;
  currentUser: UserAccount | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  classes: string[];
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterScore: 'all' | 'excellent' | 'good' | 'warning';
  setFilterScore: (value: 'all' | 'excellent' | 'good' | 'warning') => void;
  filteredStudents: Student[];
  setShowAddStudent: (show: boolean) => void;
  setEditingStudent: (student: Student) => void;
  handleDeleteStudent: (id: string) => void;
  refreshStudents: () => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  darkMode,
  currentUser,
  searchTerm,
  setSearchTerm,
  classes,
  filterClass,
  setFilterClass,
  filterScore,
  setFilterScore,
  filteredStudents,
  setShowAddStudent,
  setEditingStudent,
  handleDeleteStudent,
  refreshStudents,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/students/import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Students imported successfully!');
        refreshStudents();
      } else {
        const result = await response.json();
        alert(`Failed to import students: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('An error occurred while importing students.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        studentId: '66010001',
        name: 'ตัวอย่าง นักเรียน',
        class: 'ปวส.1/1',
        department: 'เทคโนโลยีสารสนเทศ',
        phone: '0812345678',
        email: 'example@student.ac.th',
        conductScore: 100
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'student-import-template.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหานักเรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 text-sm rounded-md border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">ทุกชั้นเรียน</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-md border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="all">คะแนนทั้งหมด</option>
            <option value="excellent">ดีเยี่ยม (≥90)</option>
            <option value="good">ดี (70-89)</option>
            <option value="warning">เสี่ยง (&lt;70)</option>
          </select>
        </div>

        {(currentUser?.role === 'admin' || currentUser?.role === 'teacher') && (
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls"
            />
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <Download size={18} /> Template
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              <Upload size={18} /> Import
            </button>
            <button
              onClick={() => setShowAddStudent(true)}
              className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
            >
              <PlusCircle size={18} /> เพิ่มนักเรียน
            </button>
          </div>
        )}
      </div>

      <div className={cx('overflow-x-auto rounded-xl shadow-md', darkMode ? 'bg-gray-800' : 'bg-white')}>
        <table className="min-w-full text-sm">
          <thead className={cx(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-indigo-100 text-gray-700')}>
            <tr>
              <th className="py-3 px-4 text-left">รหัส</th>
              <th className="py-3 px-4 text-left">ชื่อ-นามสกุล</th>
              <th className="py-3 px-4 text-left">ชั้น</th>
              <th className="py-3 px-4 text-left">แผนก</th>
              <th className="py-3 px-4 text-center">คะแนน</th>
              <th className="py-3 px-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className={cx(
                  'border-t',
                  darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-indigo-50'
                )}
              >
                <td className="py-3 px-4">{s.studentId}</td>
                <td className="py-3 px-4 font-medium">{s.name}</td>
                <td className="py-3 px-4">{s.class}</td>
                <td className="py-3 px-4">{s.department}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={cx(
                      'inline-block px-3 py-1 rounded-full font-semibold text-sm',
                      s.conductScore >= 90
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : s.conductScore >= 70
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    )}
                  >
                    {s.conductScore}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingStudent(s)}
                      className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600"
                      title="แก้ไข"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(s.id)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};