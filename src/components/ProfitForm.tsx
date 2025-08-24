import React from 'react';
import { TrendingUp } from 'lucide-react';
import { NumberInput } from './NumberInput';
import type { ProfitInputs } from '../types';

interface ProfitFormProps {
  inputs: ProfitInputs;
  onInputChange: (field: keyof ProfitInputs, value: number) => void;
}

export function ProfitForm({ inputs, onInputChange }: ProfitFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-900">Profit Analysis</h2>
      </div>

      <div className="space-y-4">
        <NumberInput
          label="Est. Monthly Gross Revenue (USD)"
          value={inputs.monthlyGrossUSD}
          onChange={(value) => onInputChange('monthlyGrossUSD', value)}
          placeholder="0.00"
          disabled={true}
        />
        <p className="text-xs text-slate-600 -mt-2">
          Calculated automatically based on rent (read-only)
        </p>

        <NumberInput
          label="Est. Monthly Expenses (USD)"
          value={inputs.monthlyExpensesUSD}
          onChange={(value) => onInputChange('monthlyExpensesUSD', value)}
          placeholder="0.00"
          disabled={true}
        />
        <p className="text-xs text-slate-600 -mt-2">
          Calculated automatically based on rent (read-only)
        </p>
      </div>
    </div>
  );
}