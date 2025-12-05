'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, Edit, Trash2, Upload, Download, Users } from 'lucide-react';
import { cx } from '@/utils/helpers';
import type { Student, UserAccount } from '@/types';
import * as XLSX from 'xlsx';
import { ImportStudentsModal } from '@/components/modals/ImportStudentsModal';

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
  const [showImportModal, setShowImportModal] = useState(false);

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
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">รายชื่อนักเรียน</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">ทั้งหมด {filteredStudents.length} คน</p>
            </div>
          </div>

          {currentUser?.role === 'admin' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
              >
                <Download size={18} /> Template
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
              >
                <Upload size={18} /> Import
              </button>
              <button
                onClick={() => setShowAddStudent(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                <PlusCircle size={18} /> เพิ่มนักเรียน
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className={cx(
          'flex flex-wrap gap-3 p-4 rounded-xl',
          darkMode ? 'bg-gray-800/50' : 'bg-white/50 backdrop-blur-sm'
        )}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหานักเรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-transparent bg-gray-100 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border-2 border-transparent bg-gray-100 dark:bg-gray-700 dark:text-white focus:border-indigo-500 outline-none transition-all"
          >
            <option value="">ทุกชั้นเรียน</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value as any)}
            className="px-4 py-2.5 text-sm rounded-xl border-2 border-transparent bg-gray-100 dark:bg-gray-700 dark:text-white focus:border-indigo-500 outline-none transition-all"
          >
            <option value="all">คะแนนทั้งหมด</option>
            <option value="excellent">ดีเยี่ยม (≥90)</option>
            <option value="good">ดี (70-89)</option>
            <option value="warning">เสี่ยง (&lt;70)</option>
          </select>
        </div>

        {/* Table */}
        <div className={cx(
          'overflow-x-auto rounded-2xl shadow-lg',
          darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
        )}>
          <table className="min-w-full text-sm">
            <thead className={cx(
              'text-left',
              darkMode ? 'bg-gray-700/50 text-gray-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700'
            )}>
              <tr>
                <th className="py-4 px-4 font-semibold">รหัส</th>
                <th className="py-4 px-4 font-semibold">ชื่อ-นามสกุล</th>
                <th className="py-4 px-4 font-semibold">ชั้น</th>
                <th className="py-4 px-4 font-semibold">แผนก</th>
                <th className="py-4 px-4 text-center font-semibold">คะแนน</th>
                <th className="py-4 px-4 text-center font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, index) => (
                <tr
                  key={s.id}
                  className={cx(
                    'border-t transition-all duration-200',
                    darkMode
                      ? 'border-gray-700 hover:bg-indigo-900/20'
                      : 'border-gray-100 hover:bg-indigo-50/50'
                  )}
                >
                  <td className="py-3 px-4 font-mono text-sm text-gray-700 dark:text-gray-300">{s.studentId}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{s.class}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{s.department}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={cx(
                        'inline-block px-3 py-1.5 rounded-full font-bold text-sm shadow-sm',
                        s.conductScore >= 90
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                          : s.conductScore >= 70
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                            : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                      )}
                    >
                      {s.conductScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {currentUser?.role === 'admin' && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingStudent(s)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all hover:scale-110"
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-all hover:scale-110"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showImportModal && (
        <ImportStudentsModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            refreshStudents();
            setShowImportModal(false);
          }}
        />
      )}
    </>
  );
};
