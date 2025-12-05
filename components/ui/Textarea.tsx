import React from 'react';

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ label, value, onChange, rows = 3 }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none"
      />
    </div>
  );
};