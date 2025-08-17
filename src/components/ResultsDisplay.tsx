import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { getPackageTitle } from '../utils/calculations';
import type { Package, InvestmentResults, ProfitResults } from '../types';

interface ResultsDisplayProps {
  package: Package;
  investmentResults: InvestmentResults | null;
  profitResults: ProfitResults | null;
  exchangeRate: number;
}

export function ResultsDisplay({ 
  package: pkg, 
  investmentResults, 
  profitResults, 
  exchangeRate 
}: ResultsDisplayProps) {
  if (!investmentResults || !profitResults) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center text-slate-500">
          Enter values to see calculations
        </div>
      </div>
    );
  }

  const formatValue = (value: number | string | null, isPercent = false): string => {
    if (value === null || value === "N/A") return "N/A";
    if (typeof value === 'string') return value;
    
    if (isPercent) {
      return `${(value * 100).toFixed(2)}%`;
    }
    
    return typeof value === 'number' ? value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) : String(value);
  };

  return (
    <div className="space-y-6">
      {/* Investment Results */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900">
                {getPackageTitle(pkg, 'investment')}
              </h3>
              <p className="text-sm text-slate-600">
                Rate USD→CAD: {exchangeRate}
              </p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  CAD Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  USD Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {investmentResults.rows.map((row, index) => {
                const isTotal = row.label.includes('Total');
                const isDay1 = row.label.includes('Day 1');
                
                return (
                  <tr 
                    key={index} 
                    className={`
                      ${isTotal ? 'bg-blue-50 font-semibold' : 'bg-white'}
                      ${isDay1 ? 'bg-emerald-50 font-medium' : ''}
                    `}
                  >
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono">
                      {formatValue(row.cadAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono">
                      {row.usdAmount !== null ? formatValue(row.usdAmount) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit Results */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">
              {getPackageTitle(pkg, 'profit')}
            </h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  CAD Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  USD Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {profitResults.rows.map((row, index) => {
                const isROI = row.label.includes('ROI %');
                const isProfit = row.label.includes('Profits');
                const isTimeline = row.label.includes('Timeline');
                
                return (
                  <tr 
                    key={index} 
                    className={`
                      ${isProfit ? 'bg-emerald-50' : 'bg-white'}
                      ${isROI ? 'bg-blue-50' : ''}
                    `}
                  >
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono">
                      {isROI 
                        ? formatValue(row.cadAmount, true)
                        : isTimeline 
                          ? formatValue(row.cadAmount) + (row.cadAmount !== "N/A" ? " months" : "")
                          : formatValue(row.cadAmount)
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono">
                      {row.usdAmount !== null ? formatValue(row.usdAmount) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}