import React, { useState } from 'react';
import { Download, BarChart3, AlertCircle, Award, FileText, FileSpreadsheet, File } from 'lucide-react';
import { cx } from '@/utils/helpers';
import type { Student, Violation } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow, TableCell, WidthType, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Stats {
  totalStudents: number;
  totalViolations: number;
  averageScore: number;
  criticalStudents: number;
  excellentStudents: number;
  recentViolations: Violation[];
}

interface ReportsTabProps {
  darkMode: boolean;
  students: Student[];
  violationsByType: [string, number][];
  stats: Stats;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  darkMode,
  students,
  violationsByType,
  stats
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportXLS = () => {
    const wb = XLSX.utils.book_new();

    const wsStudents = XLSX.utils.json_to_sheet(students);
    XLSX.utils.book_append_sheet(wb, wsStudents, "Students");

    const wsViolations = XLSX.utils.json_to_sheet(violationsByType.map(([type, count]) => ({ type, count })));
    XLSX.utils.book_append_sheet(wb, wsViolations, "Violations Summary");

    const wsStats = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, wsStats, "Stats");

    XLSX.writeFile(wb, `conduct-report-${Date.now()}.xlsx`);
    setShowExportMenu(false);
  };

  const handleExportDOCX = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Student Conduct Report", bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Violations Summary", bold: true, size: 24 })],
              spacing: { after: 200 },
            }),
            new DocxTable({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Violation Type")] }),
                    new TableCell({ children: [new Paragraph("Count")] }),
                  ],
                }),
                ...violationsByType.map(([type, count]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(type)] }),
                      new TableCell({ children: [new Paragraph(count.toString())] }),
                    ],
                  })
                ),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Students List", bold: true, size: 24 })],
              spacing: { before: 400, after: 200 },
            }),
            new DocxTable({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("ID")] }),
                    new TableCell({ children: [new Paragraph("Name")] }),
                    new TableCell({ children: [new Paragraph("Class")] }),
                    new TableCell({ children: [new Paragraph("Score")] }),
                  ],
                }),
                ...students.map(s =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(s.studentId)] }),
                      new TableCell({ children: [new Paragraph(s.name)] }),
                      new TableCell({ children: [new Paragraph(s.class)] }),
                      new TableCell({ children: [new Paragraph(s.conductScore.toString())] }),
                    ],
                  })
                ),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `conduct-report-${Date.now()}.docx`);
      setShowExportMenu(false);
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Student Conduct Report', 14, 22);

    doc.setFontSize(14);
    doc.text('Violations Summary', 14, 32);

    autoTable(doc, {
      startY: 36,
      head: [['Type', 'Count']],
      body: violationsByType.map(([type, count]) => [type, count]),
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    doc.text('Students List', 14, finalY + 10);

    autoTable(doc, {
      startY: finalY + 14,
      head: [['ID', 'Name', 'Class', 'Score']],
      body: students.map(s => [s.studentId, s.name, s.class, s.conductScore]),
    });

    doc.save(`conduct-report-${Date.now()}.pdf`);
    setShowExportMenu(false);
  };

  const ScoreBars: React.FC<{ stats: Stats }> = ({ stats }) => {
    const good = stats.totalStudents - stats.excellentStudents - stats.criticalStudents;
    return (
      <div className="space-y-4">
        {[
          {
            label: 'ดีเยี่ยม (90-100)',
            count: stats.excellentStudents,
            width: stats.totalStudents ? (stats.excellentStudents / stats.totalStudents) * 100 : 0,
            cls: 'bg-green-500'
          },
          {
            label: 'ดี (70-89)',
            count: good,
            width: stats.totalStudents ? (good / stats.totalStudents) * 100 : 0,
            cls: 'bg-yellow-500'
          },
          {
            label: 'เสี่ยง (<70)',
            count: stats.criticalStudents,
            width: stats.totalStudents ? (stats.criticalStudents / stats.totalStudents) * 100 : 0,
            cls: 'bg-red-500'
          }
        ].map((r) => (
          <div key={r.label} className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300 text-sm">{r.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={cx(r.cls, 'h-2 rounded-full')} style={{ width: `${r.width}%` }} />
              </div>
              <span className="font-semibold text-sm w-8 text-right text-gray-800 dark:text-white">{r.count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">รายงานและสถิติ</h2>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
          >
            <Download size={18} /> ส่งออกข้อมูล
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700">
              <div className="py-1">
                <button
                  onClick={handleExportXLS}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FileSpreadsheet size={16} className="text-green-600" /> Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportDOCX}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FileText size={16} className="text-blue-600" /> Word (.docx)
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <File size={16} className="text-red-600" /> PDF (.pdf)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <BarChart3 size={20} className="text-indigo-500" />
            สถิติการกระทำผิดตามประเภท
          </h3>
          <div className="space-y-3">
            {violationsByType.length === 0 ? (
              <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูล</p>
            ) : (
              violationsByType.map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{type}</span>
                  <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full font-semibold text-sm">
                    {count} ครั้ง
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <AlertCircle size={20} className="text-red-500" />
            นักเรียนที่มีคะแนนต่ำกว่า 70
          </h3>
          <div className="space-y-3">
            {students.filter((s) => s.conductScore < 70).length === 0 ? (
              <p className="text-gray-500 text-center py-4">ไม่มีนักเรียนที่มีคะแนนต่ำกว่า 70</p>
            ) : (
              students
                .filter((s) => s.conductScore < 70)
                .sort((a, b) => a.conductScore - b.conductScore)
                .map((s) => (
                  <div key={s.studentId} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{s.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {s.studentId} - {s.class}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{s.conductScore}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className={cx('rounded-xl shadow-md p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <Award size={20} className="text-green-500" />
            การกระจายคะแนน
          </h3>
          <ScoreBars stats={stats} />
        </div>
      </div>
    </div>
  );
};