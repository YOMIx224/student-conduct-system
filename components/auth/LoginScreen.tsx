import React, { useState } from 'react';
import { Shield, Sun, Moon, LogIn, User as UserIcon, Lock, Eye, EyeOff } from 'lucide-react';
import { cx } from '@/utils/helpers';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onSwitchRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  darkMode,
  setDarkMode,
  onSwitchRegister
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
    const result = await onLogin(username, password);
    if (!result) setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
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

      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold">ระบบบันทึกพฤติกรรมนักเรียน</h1>
          <p className="text-gray-600 dark:text-gray-400">วิทยาลัยเทคนิค • แผนกเทคโนโลยีสารสนเทศ</p>
        </div>

        <div className={cx('rounded-2xl shadow-2xl p-8', darkMode ? 'bg-gray-800' : 'bg-white')}>
          <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">ชื่อผู้ใช้</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon size={20} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  className="w-full pl-11 pr-11 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition shadow-lg"
            >
              <span className="inline-flex items-center gap-2">
                <LogIn size={20} />เข้าสู่ระบบ
              </span>
            </button>
          </form>

          <div className="mt-6 text-sm text-center">
            ยังไม่มีบัญชี?{' '}
            <button onClick={onSwitchRegister} className="text-indigo-600 hover:underline">
              สมัครสมาชิก
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
            <p className="font-medium">ข้อมูลทดสอบ:</p>
            <p>Admin: admin / admin123</p>
            <p>Teacher: teacher / teacher123</p>
            <p>Student: student / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
};