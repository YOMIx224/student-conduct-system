import React from 'react';
import { Shield, Sun, Moon, LogOut, User } from 'lucide-react';
import type { UserAccount } from '@/types';

interface HeaderProps {
  currentUser: UserAccount | null;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, darkMode, setDarkMode, handleLogout }) => {
  return (
    <header className="sticky top-0 z-40 glass shadow-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">ระบบความประพฤติ</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">วิทยาลัยเทคนิคสิงห์บุรี</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-600" size={20} />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 btn-glow"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
