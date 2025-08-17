import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { StepperProgress } from './components/StepperProgress';
import { PackageStep } from './components/steps/PackageStep';
import { InvestmentStep } from './components/steps/InvestmentStep';
import { ProfitStep } from './components/steps/ProfitStep';
import { ResultsStep } from './components/steps/ResultsStep';
import { calculateInvestment, calculateProfits } from './utils/calculations';
import type { Package, InvestmentInputs, ProfitInputs } from './types';

const EXCHANGE_RATE = 1.35; // Hardcoded USD→CAD rate

const STEPS = [
  { id: 1, title: 'Package Selection', description: 'Choose your investment package' },
  { id: 2, title: 'Investment Details', description: 'Enter investment costs and fees' },
  { id: 3, title: 'Profit Analysis', description: 'Estimate revenue and expenses' },
  { id: 4, title: 'Results & Analysis', description: 'View calculations and ROI' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Calculate results when on results step
  useEffect(() => {
    if (currentStep === 4) {
      const invResults = calculateInvestment(selectedPackage, investmentInputs, EXCHANGE_RATE);
      setInvestmentResults(invResults);
      
      const profResults = calculateProfits(selectedPackage, investmentInputs, profitInputs, EXCHANGE_RATE, invResults.totals.totalCAD);
      setProfitResults(profResults);
    }
  }, [currentStep, selectedPackage, investmentInputs, profitInputs]);

  const updateInvestmentInput = (field: keyof InvestmentInputs, value: number | boolean) => {
    setInvestmentInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateProfitInput = (field: keyof ProfitInputs, value: number) => {
    setProfitInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartNew = () => {
    setCurrentStep(1);
    setSelectedPackage('furnished');
    setInvestmentInputs({
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
    setProfitInputs({
      monthlyGrossUSD: 0,
      monthlyExpensesUSD: 0,
    });
    setInvestmentResults(null);
    setProfitResults(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Package is always selected
      case 2:
        return investmentInputs.feeCAD > 0; // At minimum, fee should be entered
      case 3:
        return profitInputs.monthlyGrossUSD > 0; // At minimum, gross revenue should be entered
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PackageStep
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
          />
        );
      case 2:
        return (
          <InvestmentStep
            package={selectedPackage}
            inputs={investmentInputs}
            onInputChange={updateInvestmentInput}
            exchangeRate={EXCHANGE_RATE}
          />
        );
      case 3:
        return (
          <ProfitStep
            inputs={profitInputs}
            onInputChange={updateProfitInput}
          />
        );
      case 4:
        return (
          <ResultsStep
            package={selectedPackage}
            investmentResults={investmentResults}
            profitResults={profitResults}
            exchangeRate={EXCHANGE_RATE}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">STR Launch Investment Calculator</h1>
                <p className="text-slate-600 text-sm">Professional short-term rental investment analysis</p>
              </div>
            </div>
            {currentStep === 4 && (
              <button
                onClick={handleStartNew}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Start New Calculation
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <StepperProgress steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Step Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Step {currentStep}: {STEPS[currentStep - 1].title}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {STEPS[currentStep - 1].description}
                </p>
              </div>
              <div className="text-sm text-slate-500">
                {currentStep} of {STEPS.length}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
                    ${currentStep === 1
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-600 text-white hover:bg-slate-700'
                    }
                  `}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200
                    ${!canProceed()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {currentStep === 3 ? 'Calculate Results' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Calculator className="h-4 w-4" />
            <span className="text-sm">STR Launch Investment Calculator - Professional Financial Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;