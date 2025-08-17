import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
          ${checked 
            ? 'bg-blue-600 border-blue-600' 
            : 'bg-white border-slate-300 hover:border-slate-400'
          }
        `}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </button>
      <label 
        onClick={() => onChange(!checked)}
        className="text-sm font-medium text-slate-700 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}