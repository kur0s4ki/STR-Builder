import React from 'react';
import { DollarSign } from 'lucide-react';
import { NumberInput } from '../NumberInput';
import { CheckboxInput } from '../CheckboxInput';
import type { Package, InvestmentInputs } from '../../types';

interface InvestmentStepProps {
  package: Package;
  inputs: InvestmentInputs;
  onInputChange: (field: keyof InvestmentInputs, value: number | boolean) => void;
  exchangeRate: number;
  isLiveRate: boolean;
}

export function InvestmentStep({ inputs, onInputChange, exchangeRate, isLiveRate }: Omit<InvestmentStepProps, 'package'>) {

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Investment Details
        </h3>
        <p className="text-slate-600">
          Enter the estimated costs for your STR launch investment
        </p>
      </div>

      {/* Exchange Rate Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Exchange Rate</p>
            <p className="text-sm text-blue-800">1 USD = {exchangeRate.toFixed(4)} CAD ({isLiveRate ? 'Live rate' : 'Fixed rate'})</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property Details Section */}
        <div>
          <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Property Details (USD)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <NumberInput
                label="Est. 1 Month Rent"
                value={inputs.rentUSD}
                onChange={(value) => onInputChange('rentUSD', value)}
                placeholder="0.00"
                currency="USD"
              />
            </div>

            {!inputs.securityDepositSameAsRent && (
              <div className="sm:col-span-2">
                <NumberInput
                  label="Est. Security Deposit"
                  value={inputs.securityDepositUSD}
                  onChange={(value) => onInputChange('securityDepositUSD', value)}
                  placeholder="0.00"
                  currency="USD"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <CheckboxInput
              label="Security Deposit same as 1 Month Rent"
              checked={inputs.securityDepositSameAsRent}
              onChange={(checked) => onInputChange('securityDepositSameAsRent', checked)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}