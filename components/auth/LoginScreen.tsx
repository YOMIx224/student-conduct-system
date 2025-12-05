import React, { useState } from 'react';
import { Shield, Sun, Moon, LogIn, User as UserIcon, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cx } from '@/utils/helpers';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  darkMode,
  setDarkMode,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');

    setIsLoading(true);
    const result = await onLogin(username, password);
    setIsLoading(false);
    if (!result) setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  };

  return (
    <div className={cx(
      'min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500',
      darkMode
        ? 'bg-gray-900'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cx(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse',
          darkMode ? 'bg-indigo-900/30' : 'bg-indigo-300/40'
        )} />
        <div className={cx(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000',
          darkMode ? 'bg-purple-900/30' : 'bg-purple-300/40'
        )} />
        <div className={cx(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl',
          darkMode ? 'bg-pink-900/20' : 'bg-pink-200/30'
        )} />
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={cx(
          'absolute top-6 right-6 p-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110',
          darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        )}
      >
        {darkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-700" size={24} />}
      </button>

      <div className="w-full max-w-md mx-4 relative animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl animate-float">
              <Shield className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-6 mb-2">
            <span className="gradient-text">ระบบตัดคะแนนความประพฤติ</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-indigo-500" />
            แผนกวิชาเทคโนโลยีสารสนเทศ • วิทยาลัยเทคนิคสิงห์บุรี
            <Sparkles size={16} className="text-purple-500" />
          </p>
        </div>

        {/* Login Card */}
        <div className={cx(
          'rounded-3xl p-8 glass-card animate-slide-up',
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        )}>
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <LogIn size={24} className="text-indigo-500" />
            เข้าสู่ระบบ
          </h2>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 animate-fade-in">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                ชื่อผู้ใช้
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <UserIcon size={20} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้หรือรหัสนักเรียน"
                  className={cx(
                    'w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 outline-none',
                    'border-gray-200 dark:border-gray-600',
                    'bg-gray-50 dark:bg-gray-700',
                    'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
                    'dark:text-white placeholder:text-gray-400'
                  )}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className={cx(
                    'w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-300 outline-none',
                    'border-gray-200 dark:border-gray-600',
                    'bg-gray-50 dark:bg-gray-700',
                    'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
                    'dark:text-white placeholder:text-gray-400'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cx(
                'w-full py-4 rounded-xl font-semibold text-white transition-all duration-300',
                'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                'hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600',
                'shadow-lg hover:shadow-xl hover:shadow-indigo-500/25',
                'hover:-translate-y-0.5 active:translate-y-0',
                'disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none',
                'btn-glow'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    เข้าสู่ระบบ
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
            <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm mb-2">
              🔐 ข้อมูลทดสอบ:
            </p>
            <div className="space-y-1 text-xs text-indigo-600 dark:text-indigo-400">
              <p>👑 Admin: <code className="bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded">admin / admin123</code></p>
              <p>👨‍🏫 Teacher: <code className="bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded">teacher / teacher123</code></p>
              <p>🎓 Student: <code className="bg-white/50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded">รหัสนักเรียน / student123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
