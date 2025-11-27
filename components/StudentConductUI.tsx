
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Sun, Moon, LogOut } from 'lucide-react';

// Import types
import type { Student, Violation, UserAccount, Role, AppealStatus } from '@/types';

// Import utils
import { cx, formatThaiDate } from '@/utils/helpers';

// Import components
import { LoginScreen } from '@/components/auth/LoginScreen';
import { RegisterScreen } from '@/components/auth/RegisterScreen';
import { Dashboard } from '@/components/tabs/Dashboard';
import { StudentsTab } from '@/components/tabs/StudentsTab';
import { ViolationsTab } from '@/components/tabs/ViolationsTab';
import { ReportsTab } from '@/components/tabs/ReportsTab';
import { MyScoreTab } from '@/components/tabs/MyScoreTab';
import { MyAppealsTab } from '@/components/tabs/MyAppealsTab';
import { AddStudentModal } from '@/components/modals/AddStudentModal';
import { EditStudentModal } from '@/components/modals/EditStudentModal';
import { EditViolationModal } from '@/components/modals/EditViolationModal';
import { AddViolationModal } from '@/components/modals/AddViolationModal';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/modals/Modal';
import { Input } from '@/components/ui/Input';
import { TabButton } from '@/components/ui/TabButton';

export default function StudentConductUI() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'violations' | 'reports' | 'myScore' | 'myAppeals'>('dashboard');

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
    setAuthMode('login');
  };

  const handleRegister = async (payload: {
    username: string; password: string; role: Role; name: string; email: string;
    studentId?: string; class?: string; department?: string;
  }) => {
    try {
      const userPayload: UserAccount = {
        username: payload.username,
        password: payload.password,
        role: payload.role,
        name: payload.name,
        email: payload.email,
        studentId: payload.role === 'student' ? payload.studentId : undefined
      };

      const userResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        alert(errorData.message || 'User registration failed');
        return false;
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during user registration.');
      return false;
    }

    if (payload.role === 'student') {
      if (!payload.studentId || !payload.name) {
        alert('นักเรียนต้องใส่ Student ID และชื่อ-นามสกุล');
        return false;
      }

      const exists = students.some(s => s.studentId === payload.studentId);
      if (!exists) {
        const newStu: Omit<Student, 'id' | 'conductScore'> = {
          studentId: payload.studentId!,
          name: payload.name,
          class: payload.class || 'ไม่ระบุ',
          department: payload.department || 'เทคโนโลยีสารสนเทศ',
          email: payload.email
        };

        try {
          const studentResponse = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStu),
          });
          if (!studentResponse.ok) throw new Error('Failed to create student record');
          await fetchStudents();
        } catch (error) {
          console.error(error);
          alert('เกิดข้อผิดพลาดในการสร้างข้อมูลนักเรียน');
          return false;
        }
      }
    }

    alert('สมัครสมาชิกสำเร็จ! ลองเข้าสู่ระบบได้เลย');
    setAuthMode('login');
    return true;
  };

  const classes = useMemo(() => Array.from(new Set(students.map(s => s.class))), [students]);

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
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) throw new Error('Failed to add student');
      setShowAddStudent(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddViolation = async (violationData: Omit<Violation, 'id' | 'studentName' | 'appeals'>) => {
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
        body: JSON.stringify({ conductScore: newScore }),
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
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) throw new Error('Failed to update student');
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete student');
      fetchStudents();
    } catch (error) {
      console.error(error);
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
    return authMode === 'login' ? (
      <LoginScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSwitchRegister={() => setAuthMode('register')}
      />
    ) : (
      <RegisterScreen
        onRegister={handleRegister}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSwitchLogin={() => setAuthMode('login')}
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

      <nav className="bg-white dark:bg-gray-800 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 sm:space-x-4 min-w-max">
            {currentUser?.role !== 'student' ? (
              <>
                <TabButton name="dashboard" activeTab={activeTab} setActiveTab={setActiveTab}>Dashboard</TabButton>
                <TabButton name="students" activeTab={activeTab} setActiveTab={setActiveTab}>Students</TabButton>
                <TabButton name="violations" activeTab={activeTab} setActiveTab={setActiveTab}>Violations</TabButton>
                <TabButton name="reports" activeTab={activeTab} setActiveTab={setActiveTab}>Reports</TabButton>
              </>
            ) : (
              <>
                <TabButton name="myScore" activeTab={activeTab} setActiveTab={setActiveTab}>My Score</TabButton>
                <TabButton name="myAppeals" activeTab={activeTab} setActiveTab={setActiveTab}>My Appeals</TabButton>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
