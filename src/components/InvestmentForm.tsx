import React from 'react';
import { Calculator } from 'lucide-react';
import { NumberInput } from './NumberInput';
import { CheckboxInput } from './CheckboxInput';
import type { Package, InvestmentInputs } from '../types';

interface InvestmentFormProps {
  package: Package;
  inputs: InvestmentInputs;
  onInputChange: (field: keyof InvestmentInputs, value: number | boolean) => void;
}

export function InvestmentForm({ package: pkg, inputs, onInputChange }: InvestmentFormProps) {
  const showFurnished = pkg === 'furnished';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Investment Details</h2>
      </div>

      <div className="space-y-4">
        {/* Furniture Cost - Hidden for furnished package */}
        {!showFurnished && (
          <NumberInput
            label="Furniture Cost (USD)"
            value={inputs.furnitureUSD}
            onChange={(value) => onInputChange('furnitureUSD', value)}
            placeholder="0.00"
          />
        )}

        <NumberInput
          label="Est. 1 Month Rent (USD)"
          value={inputs.rentUSD}
          onChange={(value) => onInputChange('rentUSD', value)}
          placeholder="0.00"
        />

        <CheckboxInput
          label="Security Deposit same as 1 Month Rent"
          checked={inputs.securityDepositSameAsRent}
          onChange={(checked) => onInputChange('securityDepositSameAsRent', checked)}
        />

        {!inputs.securityDepositSameAsRent && (
          <NumberInput
            label="Est. Security Deposit (USD)"
            value={inputs.securityDepositUSD}
            onChange={(value) => onInputChange('securityDepositUSD', value)}
            placeholder="0.00"
          />
        )}

        <NumberInput
          label="Est. LLC + EIN (USD)"
          value={inputs.llcEinUSD}
          onChange={(value) => onInputChange('llcEinUSD', value)}
          placeholder="0.00"
        />

        <NumberInput
          label="Est. Utility Deposit (USD)"
          value={inputs.utilityDepositUSD}
          onChange={(value) => onInputChange('utilityDepositUSD', value)}
          placeholder="0.00"
        />

        {/* Furnished-specific fields */}
        {showFurnished && (
          <>
            <NumberInput
              label="Est. Stocking Essentials (USD)"
              value={inputs.stockingUSD}
              onChange={(value) => onInputChange('stockingUSD', value)}
              placeholder="0.00"
            />
            <NumberInput
              label="Est. Smart Lock & Tech Setup (USD)"
              value={inputs.smartLockUSD}
              onChange={(value) => onInputChange('smartLockUSD', value)}
              placeholder="0.00"
            />
          </>
        )}

        <NumberInput
          label="Est. Permits & License (USD)"
          value={inputs.permitsUSD}
          onChange={(value) => onInputChange('permitsUSD', value)}
          placeholder="0.00"
        />

        {/* Professional Photos only for furnished */}
        {showFurnished && (
          <NumberInput
            label="Est. Professional Photos (USD)"
            value={inputs.photosUSD}
            onChange={(value) => onInputChange('photosUSD', value)}
            placeholder="0.00"
          />
        )}

        {/* Our Fee - Always in CAD */}
        <div className="pt-4 border-t border-slate-200">
          <NumberInput
            label="Our Fee (CAD)"
            value={inputs.feeCAD}
            onChange={(value) => onInputChange('feeCAD', value)}
            placeholder="0.00"
            className="bg-blue-50 border-blue-200"
            labelClassName="font-semibold text-blue-900"
          />
          <p className="text-xs text-blue-600 mt-1">
            * Our fee is entered in CAD currency
          </p>
        </div>
      </div>
    </div>
  );
}