import React from 'react';
import { Armchair, Key, Crown, Check } from 'lucide-react';
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
      description: '1BR/2BR/3BR with furniture & amenities',
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
      description: '1BR/2BR properties',
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
      description: '3BR/4BR properties',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <h4 className="font-semibold text-slate-900 mb-1 text-base sm:text-lg">{pkg.name}</h4>
                <p className="text-sm text-slate-600">{pkg.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-1.5 sm:space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>


    </div>
  );
}