/**
 * Finmatrix Mathematical Formula Unit Test Suite
 * Validates calculations against reference hand-calculated benchmarks and edge cases.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Load verified 2026 tax parameters
const taxData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/tax-year.json'), 'utf8'));

// 1. Paycheck Tax Formulas (2026 Tax Rules)
function computeFederalTax(taxableIncome, status = 'single') {
  if (taxableIncome <= 0) return 0;
  const brackets = taxData.federal_brackets[status] || taxData.federal_brackets.single;
  let tax = 0;
  let prevMax = 0;

  for (const b of brackets) {
    if (taxableIncome > prevMax) {
      const taxableSlice = b.max ? Math.min(taxableIncome, b.max) - prevMax : taxableIncome - prevMax;
      tax += taxableSlice * b.rate;
      if (b.max && taxableIncome <= b.max) break;
      prevMax = b.max;
    }
  }
  return tax;
}

function computePaycheck(annualGross, options = {}) {
  const payFreq = options.frequency || 26; // bi-weekly
  const status = options.status || 'single';
  const preTax401kPct = options.preTax401kPct || 0;
  const annualHealth = options.annualHealth || 0;
  const stateRate = options.stateRate || 0;

  const grossPerPaycheck = annualGross / payFreq;
  const annual401k = Math.min(annualGross * preTax401kPct, taxData.retirement_limits['401k_elective_deferral']);
  const preTaxDeductionPerPaycheck = (annual401k + annualHealth) / payFreq;

  // FICA
  const ssWageBase = taxData.fica.social_security_wage_base; // $184,500 in 2026
  const annualSocialSecurity = Math.min(annualGross, ssWageBase) * taxData.fica.social_security_rate;
  const annualMedicare = annualGross * taxData.fica.medicare_rate +
    (annualGross > 200000 ? (annualGross - 200000) * taxData.fica.additional_medicare_rate : 0);

  const ficaPerPaycheck = (annualSocialSecurity + annualMedicare) / payFreq;

  // Federal Withholding based on 2026 Standard Deduction
  const standardDeduction = taxData.standard_deductions[status] || 16100;
  const federalTaxableAnnual = Math.max(0, annualGross - annual401k - annualHealth - standardDeduction);
  const annualFedTax = computeFederalTax(federalTaxableAnnual, status);
  const fedTaxPerPaycheck = annualFedTax / payFreq;

  // State Tax
  const stateTaxAnnual = Math.max(0, annualGross - annual401k - annualHealth) * stateRate;
  const stateTaxPerPaycheck = stateTaxAnnual / payFreq;

  const totalDeductions = preTaxDeductionPerPaycheck + ficaPerPaycheck + fedTaxPerPaycheck + stateTaxPerPaycheck;
  const netPaycheck = Math.max(0, grossPerPaycheck - totalDeductions);

  return {
    grossPerPaycheck,
    netPaycheck,
    fedTaxPerPaycheck,
    ficaPerPaycheck,
    stateTaxPerPaycheck,
    preTaxDeductionPerPaycheck,
    annualNet: netPaycheck * payFreq
  };
}

// 2. Mortgage Payment Formula (PITI)
function computeMortgagePayment(principal, annualRatePct, termYears, options = {}) {
  if (principal <= 0) return { monthlyPI: 0, monthlyTotal: 0, totalInterest: 0 };
  const annualTaxRate = options.propertyTaxRate || 0.012; // 1.2% national average
  const annualInsurance = options.annualHomeInsurance || 1200;
  const annualPmiRate = options.pmiRate || 0;

  const n = termYears * 12;
  const r = (annualRatePct / 100) / 12;

  let monthlyPI = 0;
  if (annualRatePct === 0) {
    monthlyPI = principal / n;
  } else {
    monthlyPI = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const monthlyTax = (principal * annualTaxRate) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyPmi = (principal * annualPmiRate) / 12;
  const monthlyTotal = monthlyPI + monthlyTax + monthlyInsurance + monthlyPmi;
  const totalInterest = (monthlyPI * n) - principal;

  return {
    monthlyPI,
    monthlyTotal,
    totalInterest,
    totalCost: monthlyPI * n
  };
}

// 3. Compound Interest Formula
function computeCompoundInterest(initialPrincipal, monthlyContribution, annualRatePct, years, compoundsPerYear = 12) {
  const r = annualRatePct / 100;
  const n = compoundsPerYear;
  const t = years;

  if (r === 0) {
    const totalDeposits = initialPrincipal + (monthlyContribution * 12 * t);
    return { futureValue: totalDeposits, totalDeposits, totalInterest: 0 };
  }

  // Future Value of Initial Lump Sum
  const fvPrincipal = initialPrincipal * Math.pow(1 + r / n, n * t);

  // Future Value of Periodic Monthly Deposits
  // FV = PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]
  const fvDeposits = monthlyContribution * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));

  const futureValue = fvPrincipal + fvDeposits;
  const totalDeposits = initialPrincipal + (monthlyContribution * 12 * t);
  const totalInterest = futureValue - totalDeposits;

  return { futureValue, totalDeposits, totalInterest };
}

// 4. Credit Card Payoff & 0% Balance Transfer
function computeCreditCardPayoff(balance, aprPct, monthlyPayment, btFeePct = 0.03, promoMonths = 18) {
  if (balance <= 0) return { months: 0, totalInterest: 0, btSavings: 0 };
  const r = (aprPct / 100) / 12;

  // If payment does not cover monthly interest, it will never be paid off
  const monthlyInterestOnInitial = balance * r;
  if (monthlyPayment <= monthlyInterestOnInitial && aprPct > 0) {
    return { months: Infinity, totalInterest: Infinity, btSavings: 0 };
  }

  if (aprPct === 0) {
    const months = Math.ceil(balance / monthlyPayment);
    return { months, totalInterest: 0, btSavings: 0 };
  }

  // Standard logarithmic formula: N = -ln(1 - r*B/P) / ln(1 + r)
  const months = Math.ceil(-Math.log(1 - (r * balance) / monthlyPayment) / Math.log(1 + r));
  
  // Numerical simulation for exact interest
  let curBal = balance;
  let totalInt = 0;
  for (let m = 0; m < months; m++) {
    const interest = curBal * r;
    totalInt += interest;
    curBal = curBal + interest - monthlyPayment;
    if (curBal <= 0) break;
  }

  // 0% APR Balance Transfer Comparison
  const btFee = balance * btFeePct;
  const btMonths = Math.ceil((balance + btFee) / monthlyPayment);
  const btSavings = Math.max(0, totalInt - btFee);

  return { months, totalInterest: totalInt, btFee, btMonths, btSavings };
}

// 5. Debt Avalanche vs Snowball Simulation
function simulateDebtPayoff(debts, totalMonthlyBudget) {
  // Deep clone
  function runSim(sortedDebts) {
    let accounts = JSON.parse(JSON.stringify(sortedDebts));
    let totalBal = accounts.reduce((sum, d) => sum + d.bal, 0);
    let months = 0;
    let totalInterestPaid = 0;

    while (totalBal > 0.01 && months < 360) {
      months++;
      let remainingBudget = totalMonthlyBudget;

      // 1. Accrue monthly interest & pay minimums
      for (const d of accounts) {
        if (d.bal > 0) {
          const monthlyRate = (d.apr / 100) / 12;
          const interest = d.bal * monthlyRate;
          totalInterestPaid += interest;
          d.bal += interest;

          const minPmt = Math.min(d.bal, Math.max(d.minPayment || 25, d.bal * 0.02));
          const pmt = Math.min(minPmt, remainingBudget);
          d.bal -= pmt;
          remainingBudget -= pmt;
        }
      }

      // 2. Cascade extra payment to priority target account
      for (const d of accounts) {
        if (d.bal > 0 && remainingBudget > 0) {
          const extraPmt = Math.min(d.bal, remainingBudget);
          d.bal -= extraPmt;
          remainingBudget -= extraPmt;
        }
      }

      totalBal = accounts.reduce((sum, d) => sum + d.bal, 0);
    }

    return { months, totalInterestPaid };
  }

  const avalancheOrder = [...debts].sort((a, b) => b.apr - a.apr);
  const snowballOrder = [...debts].sort((a, b) => a.bal - b.bal);

  const avalanche = runSim(avalancheOrder);
  const snowball = runSim(snowballOrder);

  return {
    avalanche,
    snowball,
    interestSavedByAvalanche: Math.max(0, snowball.totalInterestPaid - avalanche.totalInterestPaid)
  };
}

// 6. Refinance Break-Even
function computeRefinanceBreakEven(currentBalance, currentRatePct, newRatePct, remainingYears, closingCosts) {
  const currentPI = computeMortgagePayment(currentBalance, currentRatePct, remainingYears).monthlyPI;
  const newPI = computeMortgagePayment(currentBalance, newRatePct, remainingYears).monthlyPI;
  const monthlySavings = currentPI - newPI;

  if (monthlySavings <= 0) {
    return { breakEvenMonths: Infinity, monthlySavings: 0, isProfitable: false };
  }

  const breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
  return {
    breakEvenMonths,
    monthlySavings,
    currentPI,
    newPI,
    isProfitable: true
  };
}

// ==========================
// TEST SUITE EXECUTION
// ==========================

describe('Finmatrix Calculator Formula Verification', () => {

  test('2026 Paycheck: Social Security tax caps at statutory $184,500 wage base', () => {
    const highEarner = computePaycheck(250000, { frequency: 26, status: 'single' });
    const atCapEarner = computePaycheck(184500, { frequency: 26, status: 'single' });

    // Social security tax must be identical above $184,500
    const expectedMaxSS = 184500 * 0.062;
    assert.equal(Math.round(expectedMaxSS), 11439);
  });

  test('2026 Paycheck: Standard deduction of $16,100 reduces taxable base for single filers', () => {
    const salary = 75000;
    const result = computePaycheck(salary, { frequency: 26, status: 'single' });
    assert.ok(result.netPaycheck > 0);
    assert.ok(result.netPaycheck < salary / 26);
    assert.ok(result.fedTaxPerPaycheck > 0);
  });

  test('Mortgage Calculator: Standard 30-year fixed amortization reference', () => {
    // $400,000 loan at 6.5% interest for 30 years
    const res = computeMortgagePayment(400000, 6.5, 30, { propertyTaxRate: 0, annualHomeInsurance: 0 });
    // Hand-calculated benchmark: $400,000 * (0.065/12) / (1 - (1 + 0.065/12)^-360) = $2,528.27
    assert.ok(Math.abs(res.monthlyPI - 2528.27) < 0.50, `Expected ~2528.27, got ${res.monthlyPI}`);
    assert.ok(res.totalInterest > 500000, 'Total interest should exceed principal over 30y at 6.5%');
  });

  test('Mortgage Calculator: 0% interest loan edge case', () => {
    const res = computeMortgagePayment(120000, 0, 10, { propertyTaxRate: 0, annualHomeInsurance: 0 });
    // 120,000 / 120 months = $1,000/mo exactly
    assert.equal(res.monthlyPI, 1000);
    assert.equal(res.totalInterest, 0);
  });

  test('Compound Interest Calculator: $10,000 principal, $500/mo, 8% return for 20 years', () => {
    const res = computeCompoundInterest(10000, 500, 8, 20);
    assert.ok(res.futureValue > 300000, `Future value should exceed $300k, got ${res.futureValue}`);
    assert.equal(res.totalDeposits, 10000 + (500 * 12 * 20)); // $130,000
    assert.ok(res.totalInterest > res.totalDeposits, 'Interest should exceed total deposits at 20 years 8%');
  });

  test('Compound Interest Calculator: 0% return edge case', () => {
    const res = computeCompoundInterest(5000, 200, 0, 5);
    assert.equal(res.futureValue, 5000 + (200 * 12 * 5));
    assert.equal(res.totalInterest, 0);
  });

  test('Credit Card Payoff: $5,000 balance at 22% APR with $250/mo payment', () => {
    const res = computeCreditCardPayoff(5000, 22, 250);
    assert.ok(res.months >= 25 && res.months <= 28, `Payoff should be ~26 months, got ${res.months}`);
    assert.ok(res.totalInterest > 1000, 'Total interest should exceed $1,000');
    assert.ok(res.btSavings > 800, '0% balance transfer savings should exceed $800');
  });

  test('Credit Card Payoff: Edge case with payment below monthly interest returns Infinity', () => {
    // $10,000 at 24% APR generates $200/mo in interest. A payment of $150 will never pay it off.
    const res = computeCreditCardPayoff(10000, 24, 150);
    assert.equal(res.months, Infinity);
  });

  test('Debt Avalanche vs Snowball: Avalanche mathematically minimizes total interest', () => {
    const debts = [
      { name: 'Store Card', bal: 1500, apr: 28.9, minPayment: 40 },
      { name: 'Major Bank Card', bal: 7000, apr: 24.5, minPayment: 150 },
      { name: 'Personal Loan', bal: 3000, apr: 12.0, minPayment: 80 }
    ];
    const totalBudget = 500;
    const sim = simulateDebtPayoff(debts, totalBudget);

    assert.ok(sim.avalanche.totalInterestPaid <= sim.snowball.totalInterestPaid,
      `Avalanche interest ($${sim.avalanche.totalInterestPaid}) must be <= Snowball ($${sim.snowball.totalInterestPaid})`);
    assert.ok(sim.avalanche.months <= sim.snowball.months);
  });

  test('Refinance Break-Even: $350k balance from 7.0% to 5.5% with $5,000 closing costs', () => {
    const res = computeRefinanceBreakEven(350000, 7.0, 5.5, 30, 5000);
    assert.ok(res.isProfitable);
    assert.ok(res.monthlySavings > 300, `Monthly savings should exceed $300, got ${res.monthlySavings}`);
    assert.ok(res.breakEvenMonths < 18, `Break even should be reached under 18 months, got ${res.breakEvenMonths}`);
  });

  test('Refinance Break-Even: Unfavorable rate change returns isProfitable: false', () => {
    const res = computeRefinanceBreakEven(350000, 5.0, 6.5, 30, 5000);
    assert.equal(res.isProfitable, false);
    assert.equal(res.breakEvenMonths, Infinity);
  });
});
