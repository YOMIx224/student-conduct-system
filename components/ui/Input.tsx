import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'text', placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 sm:px-3 py-2.5 sm:py-2 text-base sm:text-sm rounded-md border text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none transition"
      />
    </div>
  );
};