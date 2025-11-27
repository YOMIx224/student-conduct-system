import React from 'react';
import { cx } from '@/utils/helpers';

type TabName = 'dashboard' | 'students' | 'violations' | 'reports' | 'myScore' | 'myAppeals';

interface TabButtonProps {
  name: TabName;
  activeTab: TabName;
  setActiveTab: (name: TabName) => void;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ name, activeTab, setActiveTab, children }) => {
  const isActive = name === activeTab;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={cx(
        'py-3 px-3 sm:px-4 text-sm sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
        isActive
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      )}
    >
      {children}
    </button>
  );
};
