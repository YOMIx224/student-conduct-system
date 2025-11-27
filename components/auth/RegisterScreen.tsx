import React, { useState } from 'react';
import { Shield, Sun, Moon, User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cx } from '@/utils/helpers';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Role } from '@/types';

interface RegisterScreenProps {
  onRegister: (payload: {
    username: string;
    password: string;
    role: Role;
    name: string;
    email: string;
    studentId?: string;
    class?: string;
    department?: string;
  }) => Promise<boolean> | boolean | void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onSwitchLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  darkMode,
  setDarkMode,
  onSwitchLogin
}) => {
  const [role, setRole] = useState<Role>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [klass, setKlass] = useState('');
  const [department, setDepartment] = useState('เทคโนโลยีสารสนเทศ');
  const [showPw, setShowPw] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !name || !email) return alert('กรอกข้อมูลให้ครบ');
    if (role === 'student' && !studentId) return alert('กรอก Student ID');
    await onRegister({ username, password, role, name, email, studentId, class: klass, department });
  };

  return (
    <div className={cx(
      'min-h-screen flex items-center justify-center transition-colors duration-300',
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50'
    )}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
      >
        {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-700" size={24} />}
      </button>

      <div className="w-full max-w-xl mx-4 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold">สมัครสมาชิก</h1>
          <p className="text-gray-600 dark:text-gray-400">สร้างบัญชีใหม่เพื่อใช้งานระบบ</p>
        </div>

        <div className={cx('rounded-2xl shadow-2xl p-8', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="บทบาท"
                value={role}
                onChange={v => setRole(v as Role)}
                options={['student', 'teacher']}
              />

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon size={18} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">อีเมล</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">ชื่อผู้ใช้</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon size={18} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  className="w-full pl-11 pr-11 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {role === 'student' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="รหัสนักเรียน (Student ID) *"
                    value={studentId}
                    onChange={setStudentId}
                  />
                  <Input
                    label="ชั้นเรียน"
                    value={klass}
                    onChange={setKlass}
                    placeholder="เช่น ปวส.1/1"
                  />
                  <Input
                    label="แผนก"
                    value={department}
                    onChange={setDepartment}
                  />
                </div>
                <p className="text-xs text-gray-500">* ระบบจะสร้างข้อมูลนักเรียนอัตโนมัติหากยังไม่มี</p>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition shadow-lg"
            >
              สร้างบัญชี
            </button>
          </form>

          <div className="mt-6 text-sm text-center">
            มีบัญชีอยู่แล้ว?{' '}
            <button onClick={onSwitchLogin} className="text-indigo-600 hover:underline">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};