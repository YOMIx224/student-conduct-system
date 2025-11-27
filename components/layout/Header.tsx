import React from 'react';
import { Shield, Sun, Moon, LogOut } from 'lucide-react';
import type { UserAccount } from '@/types';

interface HeaderProps {
  currentUser: UserAccount | null;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, darkMode, setDarkMode, handleLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Shield className="text-indigo-500" size={28} />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              ระบบจัดการความประพฤติ
            </h1>
            {currentUser && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {currentUser.name} ({currentUser.role})
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 sm:gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
