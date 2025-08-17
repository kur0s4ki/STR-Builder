import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-[20px] sm:min-h-[20px]
          ${checked
            ? 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] border-[#2F80ED] shadow-md'
            : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }
        `}
      >
        {checked && <Check className="w-4 h-4 sm:w-3 sm:h-3 text-white" />}
      </button>
      <label
        onClick={() => onChange(!checked)}
        className="text-base sm:text-sm font-medium text-gray-700 cursor-pointer select-none flex-1 py-2 sm:py-0"
      >
        {label}
      </label>
    </div>
  );
}