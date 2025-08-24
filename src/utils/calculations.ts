import type { Package, InvestmentInputs, ProfitInputs, InvestmentResults, ProfitResults, CalculationRow } from '../types';

// Helper functions - exact replicas from original CLI
function toUSD(cad: number, rate: number): number {
  return cad / rate;
}

function toCAD(usd: number, rate: number): number {
  return usd * rate;
}

function money2(x: number): number {
  return Number(x.toFixed(2));
}

function dec(x: number, places: number = 9): number {
  return Number(x.toFixed(places));
}

function n(x: number): number {
  return Number.isFinite(x) ? x : 0;
}

// Package multipliers for revenue and expenses based on rent
const PACKAGE_MULTIPLIERS = {
  furnished: {
    revenue: 1.58,
    expenses: 1.16
  },
  unfurnished1: {
    revenue: 2.3,
    expenses: 2.7
  },
  unfurnished2: {
    revenue: 2.3,
    expenses: 2.7
  }
};

// Calculate revenue and expenses based on rent and package type
export function calculatePackageValues(pkg: Package, rentUSD: number): { monthlyGrossUSD: number, monthlyExpensesUSD: number } {
  const multipliers = PACKAGE_MULTIPLIERS[pkg];
  const rentValue = n(rentUSD);
  
  return {
    monthlyGrossUSD: money2(rentValue * multipliers.revenue),
    monthlyExpensesUSD: money2(rentValue * multipliers.expenses)
  };
}

export function calculateInvestment(
  pkg: Package,
  inputs: InvestmentInputs,
  rate: number
): InvestmentResults {
  const rows: CalculationRow[] = [];
  const rentUSD = n(inputs.rentUSD);
  const securityUSD = inputs.securityDepositSameAsRent ? rentUSD : n(inputs.securityDepositUSD);

  // USD-entered items
  const items = [
    { label: "Furniture Cost", usd: n(inputs.furnitureUSD) },
    { label: "Est. 1 Month Rent", usd: rentUSD },
    { label: "Est. Security Deposit", usd: securityUSD },
    { label: "Est. LLC + EIN", usd: n(inputs.llcEinUSD) },
    { label: "Est. Utility Deposit", usd: n(inputs.utilityDepositUSD) },
  ];

  if (pkg === "furnished") {
    items.push({ label: "Est. Stocking Essentials", usd: n(inputs.stockingUSD) });
    items.push({ label: "Est. Smart Lock & Tech Setup", usd: n(inputs.smartLockUSD) });
  }

  items.push({ label: "Est. Permits & License", usd: n(inputs.permitsUSD) });

  if (pkg === "furnished") {
    items.push({ label: "Est. Professional Photos", usd: n(inputs.photosUSD) });
  }

  // Additional = sum of USD items converted to CAD (fee excluded)
  let additionalCAD = 0;
  for (const it of items) {
    const cad = toCAD(it.usd, rate);
    additionalCAD += cad;
    rows.push({ 
      label: it.label, 
      cadAmount: money2(cad), 
      usdAmount: money2(it.usd) 
    });
  }

  // Our Fee is typed in CAD. USD is derived only for this element.
  const feeCAD = n(inputs.feeCAD);
  const feeUSD = toUSD(feeCAD, rate);
  rows.push({ 
    label: "Our Fee", 
    cadAmount: money2(feeCAD), 
    usdAmount: money2(feeUSD) 
  });

  // Day 1 equals fee only
  const day1CAD = feeCAD;
  const day1USD = feeUSD;
  rows.push({
    label: "Total Investment Paid to STR Launch (Day 1)",
    cadAmount: money2(day1CAD),
    usdAmount: money2(day1USD)
  });

  // Additional total
  const additionalUSD = toUSD(additionalCAD, rate);
  rows.push({
    label: "Est. Additional Investment Required Over Next 60–90 Days",
    cadAmount: money2(additionalCAD),
    usdAmount: money2(additionalUSD)
  });

  // Total required = Day 1 + Additional
  const totalCAD = day1CAD + additionalCAD;
  const totalUSD = toUSD(totalCAD, rate);
  rows.push({
    label: "Est. Total Investment Required",
    cadAmount: money2(totalCAD),
    usdAmount: money2(totalUSD)
  });

  return { rows, totals: { totalCAD } };
}

export function calculateProfits(
  pkg: Package,
  investmentInputs: InvestmentInputs,
  profitInputs: ProfitInputs,
  rate: number,
  totalCAD: number
): ProfitResults {
  const rows: CalculationRow[] = [];
  const grossUSD = n(profitInputs.monthlyGrossUSD);
  const expUSD = n(profitInputs.monthlyExpensesUSD);
  const grossCAD = toCAD(grossUSD, rate);
  const expCAD = toCAD(expUSD, rate);
  const netCAD = grossCAD - expCAD;
  const netUSD = toUSD(netCAD, rate);

  rows.push({ 
    label: "Est. Monthly Gross Revenue", 
    cadAmount: money2(grossCAD), 
    usdAmount: money2(grossUSD) 
  });
  rows.push({ 
    label: "Est. Expenses", 
    cadAmount: money2(expCAD), 
    usdAmount: money2(expUSD) 
  });
  rows.push({ 
    label: "Est. Monthly Net Profits", 
    cadAmount: money2(netCAD), 
    usdAmount: money2(netUSD) 
  });

  const roiMonths = netCAD > 0 ? totalCAD / netCAD : null;
  rows.push({ 
    label: "Est. ROI Timeline (months)", 
    cadAmount: roiMonths === null ? "N/A" : dec(roiMonths, 9), 
    usdAmount: null 
  });

  // Year calculations - exact logic from CLI
  const year1 = netCAD * 12 - totalCAD;
  const year2 = netCAD * 24 + year1;
  const year3 = netCAD * 36 + year1;

  rows.push({ 
    label: "Est. Total Profits Year 1", 
    cadAmount: money2(year1), 
    usdAmount: money2(toUSD(year1, rate)) 
  });
  rows.push({ 
    label: "Est. Total Profits Year 2", 
    cadAmount: money2(year2), 
    usdAmount: money2(toUSD(year2, rate)) 
  });
  rows.push({ 
    label: "Est. Total Profits Year 3", 
    cadAmount: money2(year3), 
    usdAmount: money2(toUSD(year3, rate)) 
  });

  const roi1 = totalCAD !== 0 ? year1 / totalCAD : null;
  const roi2 = totalCAD !== 0 ? year2 / totalCAD : null;
  const roi3 = totalCAD !== 0 ? year3 / totalCAD : null;

  rows.push({ 
    label: "Est. ROI % (Year 1)", 
    cadAmount: roi1 === null ? "N/A" : dec(roi1, 6), 
    usdAmount: null 
  });
  rows.push({ 
    label: "Est. ROI % (Year 2)", 
    cadAmount: roi2 === null ? "N/A" : dec(roi2, 6), 
    usdAmount: null 
  });
  rows.push({ 
    label: "Est. ROI % (Year 3)", 
    cadAmount: roi3 === null ? "N/A" : dec(roi3, 6), 
    usdAmount: null 
  });

  return { rows };
}

export function getPackageTitle(pkg: Package, section: 'investment' | 'profit'): string {
  if (pkg === "furnished") {
    return section === "investment"
      ? "FURNISHED PACKAGE (1BR/2BR/3BR) Investment"
      : "FURNISHED PACKAGE (1BR/2BR/3BR) Profits/ROI";
  }
  if (pkg === "unfurnished1") {
    return section === "investment"
      ? "UNFURNISHED PACKAGE 1 (1BR/2BR) Investment"
      : "UNFURNISHED PACKAGE 1 (1BR/2BR) Profits/ROI";
  }
  return section === "investment"
    ? "UNFURNISHED PACKAGE 2 (3BR/4BR) Investment"
    : "UNFURNISHED PACKAGE 2 (3BR/4BR) Profits/ROI";
}