import React from 'react';
import { X } from 'lucide-react';
import { cx } from '@/utils/helpers';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  large?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, large }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-0 sm:p-4 overflow-y-auto">
      <div className={cx(
        'bg-white dark:bg-gray-800 shadow-2xl w-full relative',
        'sm:rounded-2xl sm:my-8',
        large ? 'sm:max-w-2xl' : 'sm:max-w-md',
        'min-h-screen sm:min-h-0',
        'p-4 sm:p-6'
      )}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 transition p-2 sm:p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 sm:hover:bg-transparent"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-white pr-12 sm:pr-8">{title}</h2>
        {children}
      </div>
    </div>
  );
};