import React from 'react';
import { Armchair, Key, Crown, Check, Info } from 'lucide-react';
import type { Package } from '../../types';

interface PackageStepProps {
  selectedPackage: Package;
  onPackageChange: (pkg: Package) => void;
}

export function PackageStep({ selectedPackage, onPackageChange }: PackageStepProps) {
  const packages = [
    {
      id: 'furnished' as Package,
      name: 'Furnished Package',
      description: '1BR/2BR/3BR',
      features: [
        'Furniture included in package',
        'Stocking essentials setup',
        'Smart lock & tech installation',
        'Professional photography',
        'Complete turnkey solution'
      ],
      icon: Armchair,
      color: 'bg-gradient-to-r from-[#2F80ED] to-[#56CCF2]',
      borderColor: 'border-[#2F80ED]',
      bgColor: 'bg-gradient-to-br from-[#2F80ED]/10 to-[#56CCF2]/10'
    },
    {
      id: 'unfurnished1' as Package,
      name: 'Unfurnished Package 1',
      description: '1BR/2BR',
      features: [
        'Suitable for 1-2 bedroom units',
        'You provide furniture',
        'Basic setup and permits',
        'Cost-effective option',
        'Flexible customization'
      ],
      icon: Key,
      color: 'bg-gradient-to-r from-[#112F57] to-[#2F80ED]',
      borderColor: 'border-[#112F57]',
      bgColor: 'bg-gradient-to-br from-[#112F57]/10 to-[#2F80ED]/10'
    },
    {
      id: 'unfurnished2' as Package,
      name: 'Unfurnished Package 2',
      description: '1BR/2BR',
      features: [
        'Designed for larger properties',
        'You provide furniture',
        'Enhanced setup services',
        'Higher revenue potential',
        'Premium market positioning'
      ],
      icon: Crown,
      color: 'bg-gradient-to-r from-[#0B1224] to-[#112F57]',
      borderColor: 'border-[#0B1224]',
      bgColor: 'bg-gradient-to-br from-[#0B1224]/10 to-[#112F57]/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <img
          src="/assets/images/logo.png"
          alt="STR Launch Logo"
          className="h-16 sm:h-20 w-auto"
        />
      </div>

      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Choose Your Investment Package
        </h3>
        <p className="text-slate-600">
          Select the package that best fits your property type and investment goals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const isSelected = selectedPackage === pkg.id;

          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className={`
                relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left h-full min-h-[200px] sm:min-h-[auto]
                ${isSelected
                  ? `border-[#2F80ED] bg-gradient-to-br from-[#2F80ED]/10 to-[#56CCF2]/10 shadow-xl transform scale-105 ring-2 ring-[#2F80ED]/30`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white/90 backdrop-blur-sm hover:scale-102'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <div className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] rounded-full p-1 shadow-lg">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Package Icon */}
              <div className={`${pkg.color} p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>

              {/* Package Info */}
              <div className="mb-3 sm:mb-4">
                <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-xs md:text-sm lg:text-base leading-tight">
                  {pkg.name.includes('Package') ? (
                    <>
                      <span className="inline sm:block md:inline">{pkg.name.split(' Package')[0]}</span>
                      <span className="whitespace-nowrap"> Package{pkg.name.includes('Package 1') ? '\u00A01' : pkg.name.includes('Package 2') ? '\u00A02' : ''}</span>
                    </>
                  ) : (
                    <span>{pkg.name}</span>
                  )}
                </h4>
                <p className="text-sm text-slate-600">{pkg.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimer Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Disclaimer</h4>
            <div className="text-sm text-blue-800 space-y-2 leading-relaxed">
              <p>
                The revenue and expense estimates provided by STR Launch are for informational and planning purposes only. These projections are generated using third-party software tools, market data, and comparable short-term rental performance. While we use reliable technology and data sources to create these estimates, they are not guaranteed and should not be relied upon as exact outcomes.
              </p>
              <p>
                These figures represent averages we have seen across the market, our properties, client properties and are provided for illustrative purposes only. Your actual results may be higher or lower depending on your specific property, location, and management. No promises or guarantees of performance are being made.
              </p>
              <p>
                Short-term rental markets can fluctuate due to seasonality, local regulations, pricing trends, competition, and other variables beyond our control. Actual results may be higher or lower than projected.
              </p>
              <p>
                The calculator includes general assumptions such as average nightly rates, occupancy, maintenance reserves, and vacancy estimates, all of which are subject to change. These figures are meant to help you assess the potential performance of your STR business — not to guarantee returns.
              </p>
              <p>
                STR Launch is not a financial advisor, real estate brokerage, or licensed investment firm. You should perform your own due diligence and consult with licensed professionals (such as real estate agents, mortgage brokers, and tax advisors) before making any investment decisions.
              </p>
              <p>
                By using this calculator or reviewing any data provided, you acknowledge that all investments carry risk, and STR Launch is not liable for any decisions made based on these projections.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}