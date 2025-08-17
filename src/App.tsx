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
    <div className="min-h-screen bg-gradient-to-br from-[#112F57] via-[#0B1224] to-[#0B1224] relative">
      {/* Soft radial gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-radial from-[#112F57]/30 via-transparent to-transparent pointer-events-none"></div>

      {/* Progress Bar */}
      <div className="bg-[#0B1224] border-b border-[#112F57]/50 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <StepperProgress steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Step Content */}
          <div className="p-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="bg-white/50 backdrop-blur-sm px-6 py-4 border-t border-gray-200/30">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium
                    ${currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-lg'
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
                    flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-200 font-medium
                    ${!canProceed()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white hover:from-[#4A90E2] hover:to-[#6BDCF7] shadow-lg hover:shadow-xl transform hover:scale-105'
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


    </div>
  );
}

export default App;