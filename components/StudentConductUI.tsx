
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Sun, Moon, LogOut } from 'lucide-react';

// Import types
import type { Student, Violation, UserAccount, Role, AppealStatus } from '@/types';

// Import utils
import { cx, formatThaiDate } from '@/utils/helpers';

// Import components
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Dashboard } from '@/components/tabs/Dashboard';
import { StudentsTab } from '@/components/tabs/StudentsTab';
import { ViolationsTab } from '@/components/tabs/ViolationsTab';
import { ReportsTab } from '@/components/tabs/ReportsTab';
import { MyScoreTab } from '@/components/tabs/MyScoreTab';
import { MyAppealsTab } from '@/components/tabs/MyAppealsTab';
import { ProfileTab } from '@/components/tabs/ProfileTab';
import { AddStudentModal } from '@/components/modals/AddStudentModal';
import { EditStudentModal } from '@/components/modals/EditStudentModal';
import { EditViolationModal } from '@/components/modals/EditViolationModal';
import { AddViolationModal } from '@/components/modals/AddViolationModal';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/modals/Modal';
import { Input } from '@/components/ui/Input';
import { TabButton } from '@/components/ui/TabButton';
import { CLASS_LIST } from '@/utils/classList';

export default function StudentConductUI() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'violations' | 'reports' | 'myScore' | 'myAppeals' | 'profile'>('dashboard');

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddViolation, setShowAddViolation] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Violation | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [filterClass, setFilterClass] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'excellent' | 'good' | 'warning'>('all');

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchViolations = async () => {
    try {
      const response = await fetch('/api/violations');
      if (!response.ok) throw new Error('Failed to fetch violations');
      const data = await response.json();
      setViolations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStudents();
      fetchViolations();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
        return false;
      }

      const user = await response.json();
      setCurrentUser(user);
      setIsLoggedIn(true);
      setActiveTab(user.role === 'student' ? 'myScore' : 'dashboard');
      return true;
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const classes = CLASS_LIST;

  const filteredStudents = useMemo(() => {
    return students
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm))
      .filter(s => filterClass === '' || s.class === filterClass)
      .filter(s => {
        if (filterScore === 'all') return true;
        if (filterScore === 'excellent') return s.conductScore >= 90;
        if (filterScore === 'good') return s.conductScore >= 70 && s.conductScore < 90;
        if (filterScore === 'warning') return s.conductScore < 70;
        return true;
      });
  }, [students, searchTerm, filterClass, filterScore]);

  const violationsByType = useMemo(() => {
    const result: { [key: string]: number } = {};
    for (const v of violations) {
      result[v.violationType] = (result[v.violationType] || 0) + 1;
    }
    return Object.entries(result).sort((a, b) => b[1] - a[1]);
  }, [violations]);

  const stats = useMemo(() => ({
    totalStudents: students.length,
    totalViolations: violations.length,
    averageScore: students.length ? Math.round(students.reduce((s, x) => s + x.conductScore, 0) / students.length) : 100,
    criticalStudents: students.filter(s => s.conductScore < 70).length,
    excellentStudents: students.filter(s => s.conductScore >= 90).length,
    recentViolations: violations.slice(-5).reverse(),
  }), [students, violations]);

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'conductScore'>) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Forbidden: Only admin can add students');
      return;
    }
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentData, role: currentUser.role }),
      });
      if (!response.ok) throw new Error('Failed to add student');
      setShowAddStudent(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding student.');
    }
  };

  const handleAddViolation = async (violationData: Omit<Violation, 'id' | 'studentName' | 'appeals'> & { recordedBy: string }) => {
    const student = students.find(s => s.studentId === violationData.studentId);
    if (!student) {
      alert('ไม่พบนักเรียน');
      return;
    }

    const newViolation = { ...violationData, studentName: student.name };
    try {
      const violationResponse = await fetch('/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newViolation),
      });
      if (!violationResponse.ok) {
        const errorData = await violationResponse.json();
        throw new Error(errorData.message || 'Failed to add violation');
      }

      const newScore = student.conductScore - violationData.pointsDeducted;
      const scoreResponse = await fetch(`/api/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conductScore: newScore, role: currentUser?.role }),
      });
      if (!scoreResponse.ok) throw new Error("Failed to update student's score");

      setShowAddViolation(false);
      fetchViolations();
      fetchStudents();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleEditStudent = async (id: string, studentData: Partial<Student>) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Forbidden: Only admin can edit students');
      return;
    }
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentData, role: currentUser.role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update student');
      }
      setEditingStudent(null);
      fetchStudents();
      alert('แก้ไขข้อมูลนักเรียนสำเร็จ');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Forbidden: Only admin can delete students');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentUser.role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete student');
      }
      fetchStudents();
      alert('ลบนักเรียนสำเร็จ');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const reviewAppeal = async (violationId: string, appealId: string, status: AppealStatus, teacherResponse: string, restoredPoints?: number) => {
    try {
      const response = await fetch(`/api/violations/${violationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealId, status, teacherResponse, restoredPoints }),
      });
      if (!response.ok) throw new Error('Failed to review appeal');
      fetchViolations();
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAppeal = async (violationId: string, message: string, image?: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    try {
      const response = await fetch(`/api/violations/${violationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, image, byStudentId: currentUser.studentId }),
      });
      if (!response.ok) throw new Error('Failed to submit appeal');
      fetchViolations();
      alert('ส่งอุทธรณ์สำเร็จ');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการส่งอุทธรณ์');
    }
  };

  const handleEditViolation = (violation: Violation) => {
    setEditingViolation(violation);
  };

  const handleSaveEditedViolation = async (violationId: string, updatedData: Partial<Violation>) => {
    try {
      // Calculate point difference
      const oldViolation = violations.find(v => v.id === violationId);
      if (!oldViolation) return;

      const pointDifference = (updatedData.pointsDeducted || oldViolation.pointsDeducted) - oldViolation.pointsDeducted;

      // Update violation
      const response = await fetch(`/api/violations/${violationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update violation');

      // Update student score if points changed
      if (pointDifference !== 0) {
        const student = students.find(s => s.studentId === oldViolation.studentId);
        if (student) {
          const newScore = Math.max(0, Math.min(100, student.conductScore - pointDifference));
          await fetch(`/api/students/${student.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conductScore: newScore }),
          });
        }
      }

      setEditingViolation(null);
      fetchViolations();
      fetchStudents();
      alert('แก้ไขการกระทำผิดสำเร็จ');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const handleDeleteViolation = async (violationId: string) => {
    try {
      const response = await fetch(`/api/violations/${violationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete violation');
      fetchViolations();
      fetchStudents(); // Refresh to update scores
      alert('ลบการกระทำผิดสำเร็จ');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <div className={cx(
      'min-h-screen transition-colors duration-300',
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-sky-50 to-indigo-50 text-gray-800'
    )}>
      <Header
        currentUser={currentUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
      />

      <nav className="glass shadow-sm overflow-x-auto border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
            {currentUser?.role !== 'student' ? (
              <>
                <TabButton name="dashboard" activeTab={activeTab} setActiveTab={setActiveTab}>ประกาศ</TabButton>
                <TabButton name="students" activeTab={activeTab} setActiveTab={setActiveTab}>นักเรียน</TabButton>
                <TabButton name="violations" activeTab={activeTab} setActiveTab={setActiveTab}>บันทึกการกระทำผิด</TabButton>
                <TabButton name="reports" activeTab={activeTab} setActiveTab={setActiveTab}>รายงาน</TabButton>
                <TabButton name="profile" activeTab={activeTab} setActiveTab={setActiveTab}>โปรไฟล์</TabButton>
              </>
            ) : (
              <>
                <TabButton name="myScore" activeTab={activeTab} setActiveTab={setActiveTab}>คะแนนของฉัน</TabButton>
                <TabButton name="myAppeals" activeTab={activeTab} setActiveTab={setActiveTab}>ส่งคำขอแก้คะแนน</TabButton>
                <TabButton name="profile" activeTab={activeTab} setActiveTab={setActiveTab}>โปรไฟล์</TabButton>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        {activeTab === 'dashboard' && currentUser?.role !== 'student' && (
          <Dashboard darkMode={darkMode} stats={stats} />
        )}
        {activeTab === 'students' && currentUser?.role !== 'student' && (
          <StudentsTab
            darkMode={darkMode}
            currentUser={currentUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            classes={classes}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            filterScore={filterScore}
            setFilterScore={setFilterScore}
            filteredStudents={filteredStudents}
            setShowAddStudent={setShowAddStudent}
            setEditingStudent={setEditingStudent}
            handleDeleteStudent={handleDeleteStudent}
            refreshStudents={fetchStudents}
          />
        )}
        {activeTab === 'violations' && currentUser?.role !== 'student' && (
          <ViolationsTab
            darkMode={darkMode}
            violations={violations}
            onAdd={() => setShowAddViolation(true)}
            reviewAppeal={reviewAppeal}
            onEdit={handleEditViolation}
            onDelete={handleDeleteViolation}
          />
        )}
        {activeTab === 'reports' && currentUser?.role !== 'student' && (
          <ReportsTab
            darkMode={darkMode}
            students={students}
            violationsByType={violationsByType}
            stats={stats}
          />
        )}
        {activeTab === 'myScore' && currentUser?.role === 'student' && (
          <MyScoreTab
            darkMode={darkMode}
            student={students.find(s => s.studentId === currentUser.studentId)}
            violations={violations.filter(v => v.studentId === currentUser.studentId)}
          />
        )}
        {activeTab === 'myAppeals' && currentUser?.role === 'student' && (
          <MyAppealsTab
            darkMode={darkMode}
            myViolations={violations.filter(v => v.studentId === currentUser.studentId)}
            meStudent={students.find(s => s.studentId === currentUser.studentId)}
            onSubmit={handleSubmitAppeal}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            darkMode={darkMode}
            currentUser={currentUser}
            onUpdateProfile={async (updates) => {
              try {
                const response = await fetch('/api/profile', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...updates, username: currentUser?.username }),
                });
                if (!response.ok) throw new Error('Failed to update profile');
                const updated = await response.json();
                setCurrentUser(updated);
              } catch (error) {
                console.error(error);
                throw error;
              }
            }}
          />
        )}
      </div>

      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}
      {showAddViolation && (
        <AddViolationModal
          students={students}
          onClose={() => setShowAddViolation(false)}
          onAdd={handleAddViolation}
          currentUser={currentUser}
        />
      )}
      {editingViolation && (
        <EditViolationModal
          violation={editingViolation}
          onClose={() => setEditingViolation(null)}
          onSave={handleSaveEditedViolation}
        />
      )}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleEditStudent}
        />
      )}
    </div>
  );
}
