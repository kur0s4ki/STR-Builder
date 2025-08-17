import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { PackageSelector } from './components/PackageSelector';
import { InvestmentForm } from './components/InvestmentForm';
import { ProfitForm } from './components/ProfitForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { calculateInvestment, calculateProfits } from './utils/calculations';
import type { Package, InvestmentInputs, ProfitInputs } from './types';

const EXCHANGE_RATE = 1.35; // Hardcoded USD→CAD rate

function App() {
  const [selectedPackage, setSelectedPackage] = useState<Package>('furnished');
  const [investmentInputs, setInvestmentInputs] = useState<InvestmentInputs>({
    furnitureUSD: 0,
    rentUSD: 0,
    securityDepositSameAsRent: true,
    securityDepositUSD: 0,
    llcEinUSD: 0,
    utilityDepositUSD: 0,
    stockingUSD: 0,
    smartLockUSD: 0,
    permitsUSD: 0,
    photosUSD: 0,
    feeCAD: 0,
  });
  const [profitInputs, setProfitInputs] = useState<ProfitInputs>({
    monthlyGrossUSD: 0,
    monthlyExpensesUSD: 0,
  });

  const [investmentResults, setInvestmentResults] = useState<any>(null);
  const [profitResults, setProfitResults] = useState<any>(null);

  // Calculate results whenever inputs change
  useEffect(() => {
    const invResults = calculateInvestment(selectedPackage, investmentInputs, EXCHANGE_RATE);
    setInvestmentResults(invResults);
    
    const profResults = calculateProfits(selectedPackage, investmentInputs, profitInputs, EXCHANGE_RATE, invResults.totals.totalCAD);
    setProfitResults(profResults);
  }, [selectedPackage, investmentInputs, profitInputs]);

  const updateInvestmentInput = (field: keyof InvestmentInputs, value: number | boolean) => {
    setInvestmentInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateProfitInput = (field: keyof ProfitInputs, value: number) => {
    setProfitInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">STR Launch Investment Calculator</h1>
              <p className="text-slate-600 text-sm">Professional short-term rental investment analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Exchange Rate Display */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">Exchange Rate</h2>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-slate-900">
                  1 USD = {EXCHANGE_RATE} CAD
                </p>
                <p className="text-sm text-slate-600 mt-1">Fixed rate for consistent calculations</p>
              </div>
            </div>

            {/* Package Selection */}
            <PackageSelector 
              selectedPackage={selectedPackage}
              onPackageChange={setSelectedPackage}
            />

            {/* Investment Inputs */}
            <InvestmentForm
              package={selectedPackage}
              inputs={investmentInputs}
              onInputChange={updateInvestmentInput}
            />

            {/* Profit Inputs */}
            <ProfitForm
              inputs={profitInputs}
              onInputChange={updateProfitInput}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <ResultsDisplay
              package={selectedPackage}
              investmentResults={investmentResults}
              profitResults={profitResults}
              exchangeRate={EXCHANGE_RATE}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">STR Launch Investment Calculator - Professional Financial Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;