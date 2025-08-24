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

      <div className="space-y-6">
        {/* Input Fields in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg p-6 border border-[#2F80ED]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-[#2F80ED]" />
              <h4 className="font-medium text-[#0B1224]">Revenue Estimation</h4>
            </div>
            <NumberInput
              label="Est. Monthly Gross Revenue (USD)"
              value={inputs.monthlyGrossUSD}
              onChange={(value) => onInputChange('monthlyGrossUSD', value)}
              placeholder="0.00"
              className="bg-white/90 backdrop-blur-sm border-[#2F80ED]/20 focus:border-[#2F80ED] focus:ring-[#2F80ED]"
              currency="USD"
              disabled={true}
            />
            <p className="text-xs text-[#112F57] mt-2">
              Calculated automatically based on rent (read-only)
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#112F57]/10 to-[#0B1224]/10 rounded-lg p-6 border border-[#112F57]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-[#112F57]" />
              <h4 className="font-medium text-[#0B1224]">Expense Estimation</h4>
            </div>
            <NumberInput
              label="Est. Monthly Expenses (USD)"
              value={inputs.monthlyExpensesUSD}
              onChange={(value) => onInputChange('monthlyExpensesUSD', value)}
              placeholder="0.00"
              className="bg-white/90 backdrop-blur-sm border-[#112F57]/20 focus:border-[#112F57] focus:ring-[#112F57]"
              currency="USD"
              disabled={true}
            />
            <p className="text-xs text-[#112F57] mt-2">
              Calculated automatically based on rent (read-only)
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-lg">
            <h4 className="font-medium text-[#0B1224] mb-4">Monthly Profit Preview</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#112F57]">Gross Revenue:</span>
                <span className="font-mono text-[#2F80ED] font-semibold">
                  {inputs.monthlyGrossUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#112F57]">Expenses:</span>
                <span className="font-mono text-[#112F57] font-semibold">
                  -{inputs.monthlyExpensesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              <div className="border-t border-[#112F57]/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[#0B1224]">Net Profit:</span>
                  <span className={`font-mono font-bold text-lg ${netProfit >= 0 ? 'text-[#2F80ED]' : 'text-[#112F57]'}`}>
                    {netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>
            </div>

            {netProfit <= 0 && inputs.monthlyGrossUSD > 0 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-[#112F57]/10 to-[#0B1224]/10 border border-[#112F57]/30 rounded-lg">
                <p className="text-xs text-[#112F57]">
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
      <div className="bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg p-4 border border-[#2F80ED]/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#112F57]">Profit analysis status:</span>
          <span className="font-medium text-[#0B1224]">
            {inputs.monthlyGrossUSD > 0 ? '✓ Ready to calculate results' : 'Enter revenue to continue'}
          </span>
        </div>
      </div>
    </div>
  );
}