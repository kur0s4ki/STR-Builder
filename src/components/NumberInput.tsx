import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  currency?: 'USD' | 'CAD';
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className = "",
  labelClassName = "",
  currency
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange(val);
  };

  return (
    <div>
      <label className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          min="0"
          step="0.01"
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
            focus:ring-2 focus:ring-[#2F80ED] focus:border-[#2F80ED]
            placeholder:text-gray-400 transition-all duration-200
            bg-white/90 backdrop-blur-sm
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            hover:border-gray-400 hover:shadow-md
            ${currency ? 'pr-12' : ''}
            ${className}
          `}
        />
        {currency && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-sm font-medium text-[#112F57] bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 px-2 py-1 rounded border border-[#2F80ED]/20">
              {currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}