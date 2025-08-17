import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Calendar, Percent, RotateCcw } from 'lucide-react';
import { getPackageTitle } from '../../utils/calculations';
import type { Package, InvestmentResults, ProfitResults } from '../../types';

interface ResultsStepProps {
  package: Package;
  investmentResults: InvestmentResults | null;
  profitResults: ProfitResults | null;
  exchangeRate: number;
  onStartNew?: () => void;
}

type TabType = 'investment' | 'profits' | 'summary';

export function ResultsStep({
  package: pkg,
  investmentResults,
  profitResults,
  exchangeRate,
  onStartNew
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
        <div className="bg-gradient-to-br from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg p-4 border border-[#2F80ED]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-[#2F80ED]" />
            <span className="text-sm font-medium text-[#0B1224]">Total Investment</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="currency-display font-bold text-[#0B1224] leading-none">
              {formatValue(totalInvestment)}
            </span>
            <span className="currency-label font-medium text-[#0B1224] leading-none">
              CAD
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#56CCF2]/10 to-[#2F80ED]/10 rounded-lg p-4 border border-[#56CCF2]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-[#56CCF2]" />
            <span className="text-sm font-medium text-[#0B1224]">Monthly Net</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="currency-display font-bold text-[#0B1224] leading-none">
              {formatValue(monthlyNet)}
            </span>
            <span className="currency-label font-medium text-[#0B1224] leading-none">
              CAD
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#112F57]/10 to-[#2F80ED]/10 rounded-lg p-4 border border-[#112F57]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-[#112F57]" />
            <span className="text-sm font-medium text-[#0B1224]">ROI Timeline</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="currency-display font-bold text-[#0B1224] leading-none">
              {roiTimeline === 'N/A' ? 'N/A' : formatValue(roiTimeline)}
            </span>
            {roiTimeline !== 'N/A' && (
              <span className="currency-label font-medium text-[#0B1224] leading-none">
                mo
              </span>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0B1224]/10 to-[#112F57]/10 rounded-lg p-4 border border-[#0B1224]/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-[#0B1224]" />
            <span className="text-sm font-medium text-[#0B1224]">Year 1 ROI</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="currency-display font-bold text-[#0B1224] leading-none">
              {formatValue(year1ROI, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Investment Phases */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 px-6 py-4 border-b border-gray-200/50">
          <h4 className="font-semibold text-[#0B1224]">Investment Timeline</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg border border-[#2F80ED]/20">
              <div>
                <p className="font-medium text-[#0B1224]">Day 1 Payment</p>
                <p className="text-sm text-[#112F57]">Payment to STR Launch</p>
              </div>
              <p className="text-xl font-bold text-[#2F80ED]">{formatValue(day1Payment)} CAD</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#112F57]/10 to-[#0B1224]/10 rounded-lg border border-[#112F57]/20">
              <div>
                <p className="font-medium text-[#0B1224]">60-90 Days</p>
                <p className="text-sm text-[#112F57]">Additional setup costs</p>
              </div>
              <p className="text-xl font-bold text-[#112F57]">
                {formatValue(typeof totalInvestment === 'number' && typeof day1Payment === 'number' ? totalInvestment - day1Payment : 0)} CAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Projections */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-[#56CCF2]/10 to-[#2F80ED]/10 px-6 py-4 border-b border-gray-200/50">
          <h4 className="font-semibold text-[#0B1224]">3-Year Profit Projection</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(year => {
              const yearProfit = profitResults.rows.find(r => r.label.includes(`Year ${year}`))?.cadAmount || 0;
              const yearROI = profitResults.rows.find(r => r.label.includes(`ROI % ( Year ${year})`))?.cadAmount || 0;

              return (
                <div key={year} className="text-center p-4 bg-gradient-to-br from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg border border-[#2F80ED]/20">
                  <p className="text-sm font-medium text-[#0B1224] mb-2">Year {year}</p>
                  <p className="text-lg font-bold text-[#2F80ED] mb-1">
                    {formatValue(yearProfit)} CAD
                  </p>
                  <p className="text-sm text-[#112F57]">
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
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 px-6 py-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-[#2F80ED]" />
          <div>
            <h3 className="font-semibold text-[#0B1224]">
              {getPackageTitle(pkg, 'investment')}
            </h3>
            <div className="inline-block bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 px-3 py-1 rounded border border-[#2F80ED]/20 mt-1">
              <p className="text-sm text-[#0B1224] font-medium">
                Rate USD→CAD: {exchangeRate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#112F57]/5 to-[#2F80ED]/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                CAD Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                USD Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {investmentResults.rows.map((row, index) => {
              const isTotal = row.label.includes('Total');
              const isDay1 = row.label.includes('Day 1');

              return (
                <tr
                  key={index}
                  className={`
                    ${isTotal ? 'bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 font-semibold' : 'bg-white/50'}
                    ${isDay1 ? 'bg-gradient-to-r from-[#56CCF2]/10 to-[#2F80ED]/10 font-medium' : ''}
                    hover:bg-gray-50/50 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4 text-sm text-[#0B1224]">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-[#2F80ED] font-semibold">
                    {formatValue(row.cadAmount)} CAD
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-[#112F57]">
                    {row.usdAmount !== null ? `${formatValue(row.usdAmount)} USD` : '—'}
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
    <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-[#56CCF2]/10 to-[#2F80ED]/10 px-6 py-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-[#56CCF2]" />
          <h3 className="font-semibold text-[#0B1224]">
            {getPackageTitle(pkg, 'profit')}
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#112F57]/5 to-[#56CCF2]/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                Metric
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                CAD Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#0B1224] uppercase tracking-wider">
                USD Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {profitResults.rows.map((row, index) => {
              const isTotal = row.label.includes('Total') || row.label.includes('Profits');
              const isROI = row.label.includes('ROI %');
              const isTimeline = row.label.includes('Timeline');

              return (
                <tr
                  key={index}
                  className={`
                    ${isTotal ? 'bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 font-semibold' : 'bg-white/50'}
                    ${isROI ? 'bg-gradient-to-r from-[#56CCF2]/10 to-[#2F80ED]/10 font-medium' : ''}
                    hover:bg-gray-50/50 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4 text-sm text-[#0B1224]">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-[#2F80ED] font-semibold">
                    {isROI
                      ? formatValue(row.cadAmount, true)
                      : isTimeline
                        ? formatValue(row.cadAmount) + (row.cadAmount !== "N/A" ? " months" : "")
                        : formatValue(row.cadAmount) + (isROI || isTimeline ? "" : " CAD")
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-[#112F57]">
                    {row.usdAmount !== null ? `${formatValue(row.usdAmount)} USD` : '—'}
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
      <div className="border-b border-gray-200/50">
        <nav className="flex justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'border-[#2F80ED] text-[#2F80ED] bg-gradient-to-r from-[#2F80ED]/5 to-[#56CCF2]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
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

      {/* Start New Calculation Button */}
      {onStartNew && (
        <div className="border-t border-gray-200/50 p-6 bg-gradient-to-r from-[#2F80ED]/5 to-[#56CCF2]/5">
          <div className="flex justify-center">
            <button
              onClick={onStartNew}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white rounded-full hover:from-[#4A90E2] hover:to-[#6BDCF7] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <RotateCcw className="h-5 w-5" />
              Start New Calculation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}