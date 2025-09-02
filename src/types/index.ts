export type Package = 'e2' | 'unfurnished1' | 'unfurnished2';

export interface InvestmentInputs {
  furnitureUSD: number;
  rentUSD: number;
  securityDepositSameAsRent: boolean;
  securityDepositUSD: number;
  llcEinUSD: number;
  utilityDepositUSD: number;
  stockingUSD: number;
  smartLockUSD: number;
  permitsUSD: number;
  photosUSD: number;
  feeCAD: number;
}

export interface ProfitInputs {
  monthlyGrossUSD: number;
  monthlyExpensesUSD: number;
}

export interface CalculationRow {
  label: string;
  cadAmount: number | string;
  usdAmount: number | string | null;
}

export interface InvestmentResults {
  rows: CalculationRow[];
  totals: {
    totalCAD: number;
  };
}

export interface ProfitResults {
  rows: CalculationRow[];
}