import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export function NumberInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "0", 
  className = "",
  labelClassName = ""
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange(val);
  };

  return (
    <div>
      <label className={`block text-sm font-medium text-slate-700 mb-2 ${labelClassName}`}>
        {label}
      </label>
      <input
        type="number"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        min="0"
        step="0.01"
        className={`
          w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          placeholder:text-slate-400 transition-colors duration-200
          ${className}
        `}
      />
    </div>
  );
}