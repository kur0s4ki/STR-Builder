import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Calendar, Percent } from 'lucide-react';
import { getPackageTitle } from '../../utils/calculations';
import type { Package, InvestmentResults, ProfitResults } from '../../types';

interface ResultsStepProps {
  package: Package;
  investmentResults: InvestmentResults | null;
  profitResults: ProfitResults | null;
  exchangeRate: number;
}

type TabType = 'investment' | 'profits' | 'summary';

export function ResultsStep({ 
  package: pkg, 
  investmentResults, 
  profitResults, 
  exchangeRate 
}: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  if (!investmentResults || !profitResults) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500">Calculating results...</div>
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

  const tabs = [
    { id: 'summary' as TabType, label: 'Executive Summary', icon: Target },
    { id: 'investment' as TabType, label: 'Investment Breakdown', icon: BarChart3 },
    { id: 'profits' as TabType, label: 'Profit Analysis', icon: TrendingUp }
  ];

  // Extract key metrics for summary
  const totalInvestment = investmentResults.totals.totalCAD;
  const day1Payment = investmentResults.rows.find(r => r.label.includes('Day 1'))?.cadAmount || 0;
  const monthlyNet = profitResults.rows.find(r => r.label.includes('Monthly Net'))?.cadAmount || 0;
  const roiTimeline = profitResults.rows.find(r => r.label.includes('Timeline'))?.cadAmount || 'N/A';
  const year1Profit = profitResults.rows.find(r => r.label.includes('Year 1'))?.cadAmount || 0;
  const year1ROI = profitResults.rows.find(r => r.label.includes('ROI % ( Year 1)'))?.cadAmount || 0;

  const renderSummaryTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Investment</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            ${formatValue(totalInvestment)} CAD
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Monthly Net</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">
            ${formatValue(monthlyNet)} CAD
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">ROI Timeline</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {roiTimeline === 'N/A' ? 'N/A' : `${formatValue(roiTimeline)} mo`}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Year 1 ROI</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {formatValue(year1ROI, true)}
          </p>
        </div>
      </div>

      {/* Investment Phases */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-900">Investment Timeline</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Day 1 Payment</p>
                <p className="text-sm text-blue-700">Payment to STR Launch</p>
              </div>
              <p className="text-xl font-bold text-blue-900">${formatValue(day1Payment)} CAD</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">60-90 Days</p>
                <p className="text-sm text-slate-600">Additional setup costs</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                ${formatValue(typeof totalInvestment === 'number' && typeof day1Payment === 'number' ? totalInvestment - day1Payment : 0)} CAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Projections */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-900">3-Year Profit Projection</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(year => {
              const yearProfit = profitResults.rows.find(r => r.label.includes(`Year ${year}`))?.cadAmount || 0;
              const yearROI = profitResults.rows.find(r => r.label.includes(`ROI % ( Year ${year})`))?.cadAmount || 0;
              
              return (
                <div key={year} className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-900 mb-2">Year {year}</p>
                  <p className="text-lg font-bold text-emerald-900 mb-1">
                    ${formatValue(yearProfit)} CAD
                  </p>
                  <p className="text-sm text-emerald-700">
                    ROI: {formatValue(yearROI, true)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestmentTab = () => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
  );

  const renderProfitsTab = () => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Investment Analysis Complete
        </h3>
        <p className="text-slate-600">
          Review your investment breakdown, profit projections, and ROI analysis
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'summary' && renderSummaryTab()}
        {activeTab === 'investment' && renderInvestmentTab()}
        {activeTab === 'profits' && renderProfitsTab()}
      </div>
    </div>
  );
}