import React from 'react';
import { DollarSign, Info } from 'lucide-react';
import { NumberInput } from '../NumberInput';
import { CheckboxInput } from '../CheckboxInput';
import type { Package, InvestmentInputs } from '../../types';

interface InvestmentStepProps {
  package: Package;
  inputs: InvestmentInputs;
  onInputChange: (field: keyof InvestmentInputs, value: number | boolean) => void;
  exchangeRate: number;
}

export function InvestmentStep({ package: pkg, inputs, onInputChange, exchangeRate }: InvestmentStepProps) {
  const showFurnished = pkg === 'furnished';

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
            <p className="text-sm text-blue-700">1 USD = {exchangeRate} CAD (Fixed rate)</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property & Setup Costs Section */}
        <div>
          <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Property & Setup Costs (USD)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Furniture Cost - Hidden for furnished package */}
            {!showFurnished && (
              <NumberInput
                label="Furniture Cost"
                value={inputs.furnitureUSD}
                onChange={(value) => onInputChange('furnitureUSD', value)}
                placeholder="0.00"
                currency="USD"
              />
            )}

            <div className={showFurnished ? "md:col-span-2" : ""}>
              <NumberInput
                label="Est. 1 Month Rent"
                value={inputs.rentUSD}
                onChange={(value) => onInputChange('rentUSD', value)}
                placeholder="0.00"
                currency="USD"
              />
            </div>

            <NumberInput
              label="Est. LLC + EIN"
              value={inputs.llcEinUSD}
              onChange={(value) => onInputChange('llcEinUSD', value)}
              placeholder="0.00"
              currency="USD"
            />

            <NumberInput
              label="Est. Utility Deposit"
              value={inputs.utilityDepositUSD}
              onChange={(value) => onInputChange('utilityDepositUSD', value)}
              placeholder="0.00"
              currency="USD"
            />

            {!inputs.securityDepositSameAsRent && (
              <div className="md:col-span-2">
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

        {/* Additional Services Section */}
        <div>
          <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Additional Services (USD)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Furnished-specific fields */}
            {showFurnished && (
              <>
                <NumberInput
                  label="Est. Stocking Essentials"
                  value={inputs.stockingUSD}
                  onChange={(value) => onInputChange('stockingUSD', value)}
                  placeholder="0.00"
                  currency="USD"
                />
                <NumberInput
                  label="Est. Smart Lock & Tech Setup"
                  value={inputs.smartLockUSD}
                  onChange={(value) => onInputChange('smartLockUSD', value)}
                  placeholder="0.00"
                  currency="USD"
                />
              </>
            )}

            <div className={!showFurnished ? "md:col-span-2" : ""}>
              <NumberInput
                label="Est. Permits & License"
                value={inputs.permitsUSD}
                onChange={(value) => onInputChange('permitsUSD', value)}
                placeholder="0.00"
                currency="USD"
              />
            </div>

            {/* Professional Photos only for furnished */}
            {showFurnished && (
              <NumberInput
                label="Est. Professional Photos"
                value={inputs.photosUSD}
                onChange={(value) => onInputChange('photosUSD', value)}
                placeholder="0.00"
                currency="USD"
              />
            )}
          </div>
        </div>

        {/* Our Fee Section */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <NumberInput
                label="Our Fee (CAD)"
                value={inputs.feeCAD}
                onChange={(value) => onInputChange('feeCAD', value)}
                placeholder="0.00"
                className="bg-emerald-50 border-emerald-200"
                labelClassName="font-semibold text-emerald-900"
                currency="CAD"
              />
              <div className="flex items-start gap-2 mt-2">
                <Info className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-700">
                  Our fee is entered in CAD currency and represents the Day 1 payment to STR Launch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gradient-to-r from-[#2F80ED]/10 to-[#56CCF2]/10 rounded-lg p-4 border border-[#2F80ED]/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#112F57]">Required fields completed:</span>
          <span className="font-medium text-[#0B1224]">
            {inputs.feeCAD > 0 ? '✓ Ready to proceed' : 'Enter Our Fee to continue'}
          </span>
        </div>
      </div>
    </div>
  );
}