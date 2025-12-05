import React from 'react';
import { cx } from '@/utils/helpers';
import { LayoutDashboard, Users, FileWarning, BarChart3, Award, MessageSquare } from 'lucide-react';

type TabName = 'dashboard' | 'students' | 'violations' | 'reports' | 'myScore' | 'myAppeals' | 'profile';

interface TabButtonProps {
  name: TabName;
  activeTab: TabName;
  setActiveTab: (name: TabName) => void;
  children: React.ReactNode;
}

const tabIcons: Record<TabName, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} />,
  students: <Users size={18} />,
  violations: <FileWarning size={18} />,
  reports: <BarChart3 size={18} />,
  myScore: <Award size={18} />,
  myAppeals: <MessageSquare size={18} />,
  profile: <Users size={18} />,
};

export const TabButton: React.FC<TabButtonProps> = ({ name, activeTab, setActiveTab, children }) => {
  const isActive = name === activeTab;

  return (
    <button
      onClick={() => setActiveTab(name)}
      className={cx(
        'group relative flex items-center gap-2 py-3.5 px-4 text-sm font-medium transition-all duration-300 whitespace-nowrap',
        isActive
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      )}
    >
      {/* Icon */}
      <span className={cx(
        'transition-all duration-300',
        isActive ? 'scale-110' : 'group-hover:scale-110'
      )}>
        {tabIcons[name]}
      </span>

      {/* Text */}
      <span>{children}</span>

      {/* Active Indicator */}
      <span
        className={cx(
          'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-full transition-all duration-300',
          isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
        )}
      />

      {/* Hover Glow */}
      {isActive && (
        <span className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-400/10 rounded-lg -z-10" />
      )}
    </button>
  );
};
