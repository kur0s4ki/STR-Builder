import React from 'react';
import { Home, Building, Building2 } from 'lucide-react';
import type { Package } from '../types';

interface PackageSelectorProps {
  selectedPackage: Package;
  onPackageChange: (pkg: Package) => void;
}

export function PackageSelector({ selectedPackage, onPackageChange }: PackageSelectorProps) {
  const packages = [
    {
      id: 'furnished' as Package,
      name: 'Furnished Package',
      description: '1BR/2BR/3BR properties',
      icon: Home,
      color: 'bg-emerald-500'
    },
    {
      id: 'unfurnished1' as Package,
      name: 'Unfurnished Package 1',
      description: '1BR/2BR properties',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      id: 'unfurnished2' as Package,
      name: 'Unfurnished Package 2',
      description: '3BR/4BR properties',
      icon: Building2,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Package Type</h2>
      <div className="grid grid-cols-1 gap-3">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const isSelected = selectedPackage === pkg.id;
          
          return (
            <button
              key={pkg.id}
              onClick={() => onPackageChange(pkg.id)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className={`${pkg.color} p-2 rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{pkg.name}</h3>
                <p className="text-sm text-slate-600">{pkg.description}</p>
              </div>
              {isSelected && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}