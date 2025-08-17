import React from 'react';
import { Home, Building, Building2, Check } from 'lucide-react';
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
      icon: Home,
      color: 'bg-emerald-500',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50'
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
      icon: Building,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50'
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
      icon: Building2,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Choose Your Investment Package
        </h3>
        <p className="text-slate-600">
          Select the package that best fits your property type and investment goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const isSelected = selectedPackage === pkg.id;
          
          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 text-left h-full
                ${isSelected 
                  ? `${pkg.borderColor} ${pkg.bgColor} shadow-lg transform scale-105` 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="bg-emerald-600 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Package Icon */}
              <div className={`${pkg.color} p-3 rounded-lg w-fit mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* Package Info */}
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-1">{pkg.name}</h4>
                <p className="text-sm text-slate-600">{pkg.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Selected Package Summary */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            {React.createElement(packages.find(p => p.id === selectedPackage)?.icon || Home, {
              className: "h-5 w-5 text-white"
            })}
          </div>
          <div>
            <p className="font-medium text-slate-900">
              Selected: {packages.find(p => p.id === selectedPackage)?.name}
            </p>
            <p className="text-sm text-slate-600">
              {packages.find(p => p.id === selectedPackage)?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}