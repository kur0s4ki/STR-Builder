import React from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { NumberInput } from '../NumberInput';
import type { ProfitInputs } from '../../types';

interface ProfitStepProps {
  inputs: ProfitInputs;
  onInputChange: (field: keyof ProfitInputs, value: number) => void;
}

export function ProfitStep({ inputs, onInputChange }: ProfitStepProps) {
  const netProfit = inputs.monthlyGrossUSD - inputs.monthlyExpensesUSD;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Profit Analysis
        </h3>
        <p className="text-slate-600">
          Estimate your monthly revenue and expenses to calculate ROI projections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h4 className="font-medium text-emerald-900">Revenue Estimation</h4>
            </div>
            <NumberInput
              label="Est. Monthly Gross Revenue (USD)"
              value={inputs.monthlyGrossUSD}
              onChange={(value) => onInputChange('monthlyGrossUSD', value)}
              placeholder="0.00"
              className="bg-white"
            />
            <p className="text-xs text-emerald-700 mt-2">
              Include all rental income before expenses
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-900">Expense Estimation</h4>
            </div>
            <NumberInput
              label="Est. Monthly Expenses (USD)"
              value={inputs.monthlyExpensesUSD}
              onChange={(value) => onInputChange('monthlyExpensesUSD', value)}
              placeholder="0.00"
              className="bg-white"
            />
            <p className="text-xs text-red-700 mt-2">
              Include utilities, cleaning, maintenance, management fees, etc.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h4 className="font-medium text-slate-900 mb-4">Monthly Profit Preview</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Gross Revenue:</span>
                <span className="font-mono text-emerald-600">
                  ${inputs.monthlyGrossUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Expenses:</span>
                <span className="font-mono text-red-600">
                  -${inputs.monthlyExpensesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="border-t border-slate-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">Net Profit:</span>
                  <span className={`font-mono font-semibold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {netProfit <= 0 && inputs.monthlyGrossUSD > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  ⚠️ Your expenses exceed revenue. Consider adjusting your estimates for accurate ROI calculations.
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h5 className="font-medium text-blue-900 mb-2">Expense Categories to Consider:</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Utilities (electricity, water, internet)</li>
              <li>• Cleaning and maintenance</li>
              <li>• Property management fees</li>
              <li>• Insurance and taxes</li>
              <li>• Marketing and platform fees</li>
              <li>• Supplies and amenities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Profit analysis status:</span>
          <span className="font-medium text-slate-900">
            {inputs.monthlyGrossUSD > 0 ? '✓ Ready to calculate results' : 'Enter revenue to continue'}
          </span>
        </div>
      </div>
    </div>
  );
}