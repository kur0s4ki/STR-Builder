import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StepperProgress } from './components/StepperProgress';
import { PackageStep } from './components/steps/PackageStep';
import { InvestmentStep } from './components/steps/InvestmentStep';

import { ResultsStep } from './components/steps/ResultsStep';
import { calculateInvestment, calculateProfits, calculatePackageValues } from './utils/calculations';
import { exchangeRateService } from './services/exchangeRateService';
import type { Package, InvestmentInputs, ProfitInputs, InvestmentResults, ProfitResults } from './types';

const STEPS = [
  { id: 1, title: 'Package Selection', description: 'Choose your investment package' },
  { id: 2, title: 'Property Details', description: 'Enter rent and security deposit' },
  { id: 3, title: 'Results & Analysis', description: 'View calculations and ROI' }
];

// Default admin values for each package type
const getDefaultValues = (pkg: Package): InvestmentInputs & ProfitInputs => {
  const baseValues = {
    rentUSD: 0,
    securityDepositSameAsRent: true,
    securityDepositUSD: 0,
  };

  switch (pkg) {
    case 'e2':
      return {
        ...baseValues,
        furnitureUSD: 17500,
        llcEinUSD: 350,
        utilityDepositUSD: 350,
        stockingUSD: 0,
        smartLockUSD: 0,
        permitsUSD: 1000,
        photosUSD: 0,
        feeCAD: 8500,
        monthlyGrossUSD: 6900,
        monthlyExpensesUSD: 3810,
      };
    case 'unfurnished1':
      return {
        ...baseValues,
        furnitureUSD: 12500,
        llcEinUSD: 350,
        utilityDepositUSD: 350,
        stockingUSD: 0,
        smartLockUSD: 0,
        permitsUSD: 0,
        photosUSD: 0,
        feeCAD: 6500,
        monthlyGrossUSD: 5200,
        monthlyExpensesUSD: 2800,
      };
    case 'unfurnished2':
      return {
        ...baseValues,
        furnitureUSD: 17500,
        llcEinUSD: 350,
        utilityDepositUSD: 350,
        stockingUSD: 0,
        smartLockUSD: 0,
        permitsUSD: 0,
        photosUSD: 0,
        feeCAD: 6500,
        monthlyGrossUSD: 6950,
        monthlyExpensesUSD: 3700,
      };
    default:
      return { ...baseValues, furnitureUSD: 0, llcEinUSD: 0, utilityDepositUSD: 0, stockingUSD: 0, smartLockUSD: 0, permitsUSD: 0, photosUSD: 0, feeCAD: 0, monthlyGrossUSD: 0, monthlyExpensesUSD: 0 };
  }
};

const isE2Calculator = window.location.pathname.startsWith('/e2');

function App() {
  const initialPackage = isE2Calculator ? 'e2' : 'unfurnished1';
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package>(initialPackage);

  // Initialize with default values
  const defaultValues = getDefaultValues(initialPackage);
  const [investmentInputs, setInvestmentInputs] = useState<InvestmentInputs>({
    furnitureUSD: defaultValues.furnitureUSD,
    rentUSD: defaultValues.rentUSD,
    securityDepositSameAsRent: defaultValues.securityDepositSameAsRent,
    securityDepositUSD: defaultValues.securityDepositUSD,
    llcEinUSD: defaultValues.llcEinUSD,
    utilityDepositUSD: defaultValues.utilityDepositUSD,
    stockingUSD: defaultValues.stockingUSD,
    smartLockUSD: defaultValues.smartLockUSD,
    permitsUSD: defaultValues.permitsUSD,
    photosUSD: defaultValues.photosUSD,
    feeCAD: defaultValues.feeCAD,
  });
  const [profitInputs, setProfitInputs] = useState<ProfitInputs>({
    monthlyGrossUSD: defaultValues.monthlyGrossUSD,
    monthlyExpensesUSD: defaultValues.monthlyExpensesUSD,
  });

  const [investmentResults, setInvestmentResults] = useState<InvestmentResults | null>(null);
  const [profitResults, setProfitResults] = useState<ProfitResults | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1.35); // Default fallback rate
  const [isLiveRate, setIsLiveRate] = useState<boolean>(false); // Track if rate is live or fixed
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  useEffect(() => {
    document.title = isE2Calculator ? 'E2 Investment Calculator' : 'Investment Calculator';
  }, []);

  // Fetch exchange rate on app load
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingExchangeRate(true);
        const rateData = await exchangeRateService.getExchangeRateInfo();
        setExchangeRate(rateData.usdToCAD);
        setIsLiveRate(rateData.isLive);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Keep the default rate and mark as fixed if fetch fails
        setIsLiveRate(false);
      } finally {
        setIsLoadingExchangeRate(false);
      }
    };

    fetchExchangeRate();
  }, []);

  // Calculate results when on results step (now step 3)
  useEffect(() => {
    if (currentStep === 3 && !isLoadingExchangeRate) {
      const invResults = calculateInvestment(selectedPackage, investmentInputs, exchangeRate);
      setInvestmentResults(invResults);

      const profResults = calculateProfits(selectedPackage, investmentInputs, profitInputs, exchangeRate, invResults.totals.totalCAD);
      setProfitResults(profResults);
    }
  }, [currentStep, selectedPackage, investmentInputs, profitInputs, exchangeRate, isLoadingExchangeRate]);

  const handlePackageChange = (pkg: Package) => {
    setSelectedPackage(pkg);
    const defaults = getDefaultValues(pkg);
    
    // Preserve the current rent value
    const currentRentUSD = investmentInputs.rentUSD;

    // Update investment inputs with defaults, preserving user-entered rent values
    setInvestmentInputs(prev => ({
      ...defaults,
      rentUSD: prev.rentUSD, // Keep user's rent input
      securityDepositUSD: prev.securityDepositSameAsRent ? prev.rentUSD : prev.securityDepositUSD, // Keep user's security deposit logic
      securityDepositSameAsRent: prev.securityDepositSameAsRent,
    }));

    // If user has entered a rent value, calculate profit inputs based on that
    if (currentRentUSD > 0) {
      const { monthlyGrossUSD, monthlyExpensesUSD } = calculatePackageValues(pkg, currentRentUSD);
      setProfitInputs({
        monthlyGrossUSD,
        monthlyExpensesUSD,
      });
    } else {
      // Otherwise use default values
      setProfitInputs({
        monthlyGrossUSD: defaults.monthlyGrossUSD,
        monthlyExpensesUSD: defaults.monthlyExpensesUSD,
      });
    }
  };

  const updateInvestmentInput = (field: keyof InvestmentInputs, value: number | boolean) => {
    setInvestmentInputs(prev => ({ ...prev, [field]: value }));
    
    // If rent is updated, automatically calculate revenue and expenses based on package
    if (field === 'rentUSD' && typeof value === 'number') {
      const { monthlyGrossUSD, monthlyExpensesUSD } = calculatePackageValues(selectedPackage, value);
      setProfitInputs(prev => ({ 
        ...prev,
        monthlyGrossUSD,
        monthlyExpensesUSD
      }));
    }
  };



  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      // If going to results step (step 3), show loading for 1.5 seconds
      if (currentStep === 2) {
        setIsCalculating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsCalculating(false);
      }
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
    setSelectedPackage(initialPackage);
    const defaults = getDefaultValues(initialPackage);
    setInvestmentInputs({
      furnitureUSD: defaults.furnitureUSD,
      rentUSD: 0, // Reset user input
      securityDepositSameAsRent: true,
      securityDepositUSD: 0, // Reset user input
      llcEinUSD: defaults.llcEinUSD,
      utilityDepositUSD: defaults.utilityDepositUSD,
      stockingUSD: defaults.stockingUSD,
      smartLockUSD: defaults.smartLockUSD,
      permitsUSD: defaults.permitsUSD,
      photosUSD: defaults.photosUSD,
      feeCAD: defaults.feeCAD,
    });
    setProfitInputs({
      monthlyGrossUSD: defaults.monthlyGrossUSD,
      monthlyExpensesUSD: defaults.monthlyExpensesUSD,
    });
    setInvestmentResults(null);
    setProfitResults(null);
  };

  const handleStepClick = (stepId: number) => {
    // Only allow navigation to completed steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Package is always selected
      case 2:
        return investmentInputs.rentUSD > 0; // Only require rent to be entered
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    // Show calculation loading indicator
    if (isCalculating) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F80ED]"></div>
            <span className="text-[#0B1224]">Calculating your investment results...</span>
          </div>
        </div>
      );
    }

    // Show loading indicator while fetching exchange rate (except for step 1 which doesn't need it)
    if (isLoadingExchangeRate && currentStep > 1) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F80ED]"></div>
            <span className="text-[#0B1224]">Loading exchange rates...</span>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <PackageStep
            selectedPackage={selectedPackage}
            onPackageChange={handlePackageChange}
            isE2Calculator={isE2Calculator}
          />
        );
      case 2:
        return (
          <InvestmentStep
            inputs={investmentInputs}
            onInputChange={updateInvestmentInput}
            exchangeRate={exchangeRate}
            isLiveRate={isLiveRate}
          />
        );
      case 3:
        return (
          <ResultsStep
            package={selectedPackage}
            investmentResults={investmentResults}
            profitResults={profitResults}
            exchangeRate={exchangeRate}
            isLiveRate={isLiveRate}
            onStartNew={handleStartNew}
            isE2Calculator={isE2Calculator}
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
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <StepperProgress steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Step Content */}
          <div className="p-4 sm:p-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="bg-white/50 backdrop-blur-sm px-4 sm:px-6 py-4 border-t border-gray-200/30">
              <div className="flex items-center justify-between gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all duration-200 font-medium min-h-[44px] min-w-[44px] text-sm sm:text-base bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-lg"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden xs:inline">Previous</span>
                  </button>
                )}
                {currentStep === 1 && <div></div>}

                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isCalculating}
                  className={`
                    flex items-center justify-center gap-2 px-4 sm:px-8 py-3 rounded-full transition-all duration-200 font-medium min-h-[44px] text-sm sm:text-base
                    ${!canProceed() || isCalculating
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white hover:from-[#4A90E2] hover:to-[#6BDCF7] shadow-lg hover:shadow-xl transform hover:scale-105'
                    }
                  `}
                >
                  <span className="hidden xs:inline">{currentStep === 2 ? 'Calculate Results' : 'Next'}</span>
                  <span className="xs:hidden">{currentStep === 2 ? 'Calculate' : 'Next'}</span>
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