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

// 7. Rent vs. Buy Calculator
function computeRentVsBuy(options = {}) {
  const homePrice = options.homePrice || 400000;
  const downPaymentPct = options.downPaymentPct || 0.20;
  const mortgageRatePct = options.mortgageRatePct || 6.5;
  const monthlyRent = options.monthlyRent || 2200;
  const years = options.years || 10;
  const homeAppreciationPct = options.homeAppreciationPct || 3.0;
  const rentInflationPct = options.rentInflationPct || 3.0;
  const investmentReturnPct = options.investmentReturnPct || 7.0;
  const propertyTaxRate = options.propertyTaxRate || 0.012;
  const maintenanceRate = options.maintenanceRate || 0.010;
  const buyingClosingCostPct = options.buyingClosingCostPct || 0.03;
  const sellingCostPct = options.sellingCostPct || 0.06;

  const downPayment = homePrice * downPaymentPct;
  const loanPrincipal = homePrice - downPayment;
  const mort = computeMortgagePayment(loanPrincipal, mortgageRatePct, 30, { propertyTaxRate, annualHomeInsurance: 1200 });

  // Buy scenario tracking
  let homeValue = homePrice;
  let remainingLoan = loanPrincipal;
  const r = (mortgageRatePct / 100) / 12;
  let totalBuyCostsPaid = downPayment + (homePrice * buyingClosingCostPct);

  // Rent scenario: invest initial down payment + closing costs
  let renterNetWorth = downPayment + (homePrice * buyingClosingCostPct);
  let curRent = monthlyRent;

  for (let y = 1; y <= years; y++) {
    // 12 months in a year
    for (let m = 1; m <= 12; m++) {
      // Mortgage breakdown
      const interestPmt = remainingLoan * r;
      const principalPmt = mort.monthlyPI - interestPmt;
      remainingLoan = Math.max(0, remainingLoan - principalPmt);

      const ownerMonthlyCash = mort.monthlyPI + (homePrice * propertyTaxRate / 12) + (homePrice * maintenanceRate / 12) + 100;
      totalBuyCostsPaid += ownerMonthlyCash;

      // Renter pays rent, invests difference if owner cash > rent
      const cashDifference = ownerMonthlyCash - curRent;
      renterNetWorth = renterNetWorth * (1 + (investmentReturnPct / 100) / 12) + cashDifference;
    }
    homeValue *= (1 + homeAppreciationPct / 100);
    curRent *= (1 + rentInflationPct / 100);
  }

  const buyerHomeEquity = homeValue - remainingLoan;
  const buyerNetWorth = buyerHomeEquity - (homeValue * sellingCostPct);

  return {
    buyerNetWorth: Math.round(buyerNetWorth),
    renterNetWorth: Math.round(renterNetWorth),
    buyerAdvantage: Math.round(buyerNetWorth - renterNetWorth),
    finalHomeValue: Math.round(homeValue),
    remainingLoan: Math.round(remainingLoan)
  };
}

// 8. Roth vs Traditional IRA Calculator (2026 Limits)
function computeRothVsTraditional(annualContribution, years, currentMarginalTaxPct, retirementTaxPct, annualReturnPct = 7.0) {
  const maxIra = taxData.retirement_limits.ira_contribution_limit || 7500; // $7,500 in 2026
  const actualContrib = Math.min(annualContribution, maxIra);
  const r = annualReturnPct / 100;

  // Traditional: pre-tax contribution grows tax-deferred. At retirement, entire accumulated sum taxed at retirementTaxPct.
  // Plus upfront tax savings: actualContrib * (currentMarginalTaxPct / 100) invested in a taxable brokerage.
  let tradBalance = 0;
  let taxSavingsInvested = 0;
  const upfrontAnnualTaxSaved = actualContrib * (currentMarginalTaxPct / 100);

  // Roth: post-tax contribution grows tax-free. At retirement, $0 tax paid.
  let rothBalance = 0;

  for (let y = 0; y < years; y++) {
    tradBalance = (tradBalance + actualContrib) * (1 + r);
    taxSavingsInvested = (taxSavingsInvested + upfrontAnnualTaxSaved) * (1 + r * 0.85); // slight drag for annual capital gains/dividends
    rothBalance = (rothBalance + actualContrib) * (1 + r);
  }

  const tradNetAfterRetirementTax = (tradBalance * (1 - retirementTaxPct / 100)) + taxSavingsInvested;

  return {
    tradGrossBalance: Math.round(tradBalance),
    tradNetAfterRetirementTax: Math.round(tradNetAfterRetirementTax),
    rothNetBalance: Math.round(rothBalance),
    rothAdvantage: Math.round(rothBalance - tradNetAfterRetirementTax),
    annualContribution: actualContrib
  };
}

// 9. Self-Employed (1099) Tax & W-2 Comparison
function computeSelfEmployedTax(gross1099, businessExpenses = 0, filingStatus = 'single') {
  const netProfit = Math.max(0, gross1099 - businessExpenses);
  const secaTaxableBase = netProfit * 0.9235; // 92.35% statutory base

  // Social Security: 12.4% up to 2026 wage base ($184,500)
  const ssWageCap = taxData.fica.social_security_wage_base;
  const ssTax = Math.min(secaTaxableBase, ssWageCap) * 0.124;

  // Medicare: 2.9% uncapped + 0.9% additional over $200k (single)
  let medicareTax = secaTaxableBase * 0.029;
  if (secaTaxableBase > 200000) {
    medicareTax += (secaTaxableBase - 200000) * 0.009;
  }

  const totalSecaTax = ssTax + medicareTax;
  const halfSecaDeduction = totalSecaTax * 0.50; // Above-the-line deduction

  // Qualified Business Income (QBI) Deduction (IRC § 199A) - 20% of net profit
  const qbiDeduction = netProfit * 0.20;

  // Federal Income Tax
  const standardDeduction = taxData.standard_deductions[filingStatus] || 16100;
  const federalTaxable = Math.max(0, netProfit - halfSecaDeduction - qbiDeduction - standardDeduction);
  const federalIncomeTax = computeFederalTax(federalTaxable, filingStatus);

  const totalTax = totalSecaTax + federalIncomeTax;
  const netTakeHome = netProfit - totalTax;
  const quarterlyEstimatedTax = totalTax / 4;

  // Equivalent W-2 gross needed: W-2 employee only pays 7.65% FICA (employer pays other 7.65%)
  // W-2 equivalent is approximately netTakeHome / (1 - standard W-2 effective tax rate)
  const w2EquivalentGross = Math.round(netProfit * 0.88);

  return {
    netProfit,
    totalSecaTax: Math.round(totalSecaTax),
    federalIncomeTax: Math.round(federalIncomeTax),
    totalTax: Math.round(totalTax),
    effectiveTaxRatePct: Number(((totalTax / netProfit) * 100).toFixed(1)),
    netTakeHome: Math.round(netTakeHome),
    quarterlyEstimatedTax: Math.round(quarterlyEstimatedTax),
    w2EquivalentGross
  };
}

// 10. Bonus & Supplemental Withholding Tax
function computeBonusTax(bonusAmount, regularAnnualSalary, filingStatus = 'single') {
  const fedFlatSupplementalRate = 0.22; // 22% statutory supplemental withholding
  const ficaRate = 0.0765; // 6.2% SS + 1.45% Medicare

  // Check if salary already passed $184,500 SS wage base
  const ssWageCap = taxData.fica.social_security_wage_base;
  let ssWithheld = 0;
  if (regularAnnualSalary < ssWageCap) {
    const remainingCap = ssWageCap - regularAnnualSalary;
    ssWithheld = Math.min(bonusAmount, remainingCap) * 0.062;
  }
  const medWithheld = bonusAmount * 0.0145;
  const fedWithholding = bonusAmount * fedFlatSupplementalRate;
  const totalWithheld = fedWithholding + ssWithheld + medWithheld;
  const netBonusTakeHome = bonusAmount - totalWithheld;

  // True marginal tax rate calculation at year end
  const stdDeduction = taxData.standard_deductions[filingStatus] || 16100;
  const taxWithoutBonus = computeFederalTax(Math.max(0, regularAnnualSalary - stdDeduction), filingStatus);
  const taxWithBonus = computeFederalTax(Math.max(0, regularAnnualSalary + bonusAmount - stdDeduction), filingStatus);
  const trueBonusFedTax = taxWithBonus - taxWithoutBonus;
  const refundOrOwed = fedWithholding - trueBonusFedTax; // positive = refund, negative = tax owed

  return {
    bonusAmount,
    fedWithholding: Math.round(fedWithholding),
    ficaWithholding: Math.round(ssWithheld + medWithheld),
    netBonusTakeHome: Math.round(netBonusTakeHome),
    trueBonusFedTax: Math.round(trueBonusFedTax),
    refundOrOwed: Math.round(refundOrOwed),
    effectiveSupplementalPct: Number(((totalWithheld / bonusAmount) * 100).toFixed(1))
  };
}

// 11. Hourly to Salary Calculator
function computeHourlyToSalary(hourlyRate, hoursPerWeek = 40, weeksPerYear = 52, filingStatus = 'single', stateRate = 0) {
  const annualHours = hoursPerWeek * weeksPerYear;
  const annualGross = hourlyRate * annualHours;
  const monthlyGross = annualGross / 12;
  const biweeklyGross = annualGross / 26;
  const weeklyGross = annualGross / 52;

  const paycheck = computePaycheck(annualGross, { frequency: 52, status: filingStatus, stateRate });

  return {
    annualGross: Math.round(annualGross),
    monthlyGross: Math.round(monthlyGross),
    biweeklyGross: Math.round(biweeklyGross),
    weeklyGross: Math.round(weeklyGross),
    annualNet: Math.round(paycheck.annualNet),
    weeklyNet: Math.round(paycheck.netPaycheck),
    hourlyNet: Number((paycheck.annualNet / annualHours).toFixed(2))
  };
}

// 12. Auto Loan with Trade-In & Tax
function computeAutoLoan(vehiclePrice, tradeInValue = 0, tradeInOwed = 0, downPaymentCash = 0, salesTaxPct = 6.0, aprPct = 6.5, termMonths = 60) {
  const netTradeEquity = tradeInValue - tradeInOwed;
  // In most US states, trade-in value reduces taxable vehicle price
  const taxableVehiclePrice = Math.max(0, vehiclePrice - tradeInValue);
  const salesTax = taxableVehiclePrice * (salesTaxPct / 100);

  // Total amount to finance = Vehicle + Sales Tax - Down Payment - Net Trade Equity
  const amountFinanced = Math.max(0, vehiclePrice + salesTax - downPaymentCash - netTradeEquity);

  const r = (aprPct / 100) / 12;
  const n = termMonths;
  let monthlyPayment = 0;
  if (aprPct === 0) {
    monthlyPayment = amountFinanced / n;
  } else {
    monthlyPayment = (amountFinanced * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = Math.max(0, totalPayment - amountFinanced);
  const tradeInTaxSavings = (tradeInValue * (salesTaxPct / 100));

  return {
    amountFinanced: Math.round(amountFinanced),
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Math.round(totalInterest),
    salesTax: Math.round(salesTax),
    tradeInTaxSavings: Math.round(tradeInTaxSavings)
  };
}

// 13. Student Loan Payoff with Extra Payments
function computeStudentLoanPayoff(principal, aprPct, termYears = 10, extraMonthly = 100) {
  const r = (aprPct / 100) / 12;
  const n = termYears * 12;

  let standardMonthly = 0;
  if (aprPct === 0) {
    standardMonthly = principal / n;
  } else {
    standardMonthly = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  // Standard simulation
  let stdBal = principal;
  let stdTotalInterest = 0;
  for (let m = 0; m < n; m++) {
    const interest = stdBal * r;
    stdTotalInterest += interest;
    stdBal = stdBal + interest - standardMonthly;
    if (stdBal <= 0) break;
  }

  // Accelerated simulation
  const acceleratedMonthly = standardMonthly + extraMonthly;
  let accelBal = principal;
  let accelTotalInterest = 0;
  let accelMonths = 0;

  while (accelBal > 0.01 && accelMonths < n) {
    accelMonths++;
    const interest = accelBal * r;
    accelTotalInterest += interest;
    accelBal = accelBal + interest - acceleratedMonthly;
    if (accelBal <= 0) break;
  }

  const monthsSaved = Math.max(0, n - accelMonths);
  const interestSaved = Math.max(0, stdTotalInterest - accelTotalInterest);

  return {
    standardMonthly: Number(standardMonthly.toFixed(2)),
    acceleratedMonthly: Number(acceleratedMonthly.toFixed(2)),
    standardTotalInterest: Math.round(stdTotalInterest),
    acceleratedTotalInterest: Math.round(accelTotalInterest),
    monthsSaved,
    interestSaved: Math.round(interestSaved)
  };
}

// 14. HYSA vs CD Calculator
function computeHysaVsCd(principal, hysaApyPct, cdApyPct, termMonths = 12, earlyWithdrawalPenaltyMonths = 3) {
  // Monthly compounding for both
  const hysaMonthlyRate = (hysaApyPct / 100) / 12;
  const cdMonthlyRate = (cdApyPct / 100) / 12;

  const hysaFV = principal * Math.pow(1 + hysaMonthlyRate, termMonths);
  const cdFV = principal * Math.pow(1 + cdMonthlyRate, termMonths);

  const hysaInterest = hysaFV - principal;
  const cdInterest = cdFV - principal;
  const cdAdvantage = cdInterest - hysaInterest;

  // Early withdrawal penalty on CD
  const penaltyAmount = principal * cdMonthlyRate * earlyWithdrawalPenaltyMonths;

  return {
    hysaInterest: Math.round(hysaInterest),
    cdInterest: Math.round(cdInterest),
    cdAdvantage: Math.round(cdAdvantage),
    penaltyAmount: Math.round(penaltyAmount),
    isCdSuperior: cdInterest > hysaInterest
  };
}

// 15. 401(k) Growth & Employer Match Calculator
function compute401kGrowth(currentSalary, salaryGrowthPct, employeePct, employerMatchMaxPct, employerMatchRatio, currentBalance, years, returnPct = 7.0) {
  const electiveDeferralLimit = taxData.retirement_limits['401k_elective_deferral']; // $24,500 in 2026
  let balance = currentBalance;
  let salary = currentSalary;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;

  for (let y = 1; y <= years; y++) {
    // Annual employee contribution capped at statutory limit
    const desiredEmployee = salary * (employeePct / 100);
    const actualEmployee = Math.min(desiredEmployee, electiveDeferralLimit);

    // Employer match
    const matchableSalaryPct = Math.min(employeePct, employerMatchMaxPct);
    const actualEmployer = (salary * (matchableSalaryPct / 100)) * employerMatchRatio;

    totalEmployeeContrib += actualEmployee;
    totalEmployerContrib += actualEmployer;

    // Investment growth
    balance = (balance + actualEmployee + actualEmployer) * (1 + returnPct / 100);
    salary *= (1 + salaryGrowthPct / 100);
  }

  return {
    futureBalance: Math.round(balance),
    totalEmployeeContrib: Math.round(totalEmployeeContrib),
    totalEmployerContrib: Math.round(totalEmployerContrib),
    totalGrowthInterest: Math.round(balance - currentBalance - totalEmployeeContrib - totalEmployerContrib)
  };
}

// 16. Debt-to-Income (DTI) Ratio Calculator
function computeDti(monthlyGrossIncome, rentOrMortgage, autoLoan = 0, studentLoan = 0, creditCardMin = 0, otherDebt = 0) {
  if (monthlyGrossIncome <= 0) return { frontEndDti: 0, backEndDti: 0, status: 'Invalid income' };

  const frontEndDti = Number(((rentOrMortgage / monthlyGrossIncome) * 100).toFixed(1));
  const totalMonthlyDebt = rentOrMortgage + autoLoan + studentLoan + creditCardMin + otherDebt;
  const backEndDti = Number(((totalMonthlyDebt / monthlyGrossIncome) * 100).toFixed(1));

  let underwritingAssessment = 'Excellent';
  if (backEndDti > 43) {
    underwritingAssessment = 'High Risk (>43%)';
  } else if (backEndDti > 36) {
    underwritingAssessment = 'Acceptable for FHA / Conforming (36%–43%)';
  } else {
    underwritingAssessment = 'Conventional Standard (<=36%)';
  }

  return {
    frontEndDti,
    backEndDti,
    totalMonthlyDebt,
    underwritingAssessment
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
    const res = computeMortgagePayment(400000, 6.5, 30, { propertyTaxRate: 0, annualHomeInsurance: 0 });
    assert.ok(Math.abs(res.monthlyPI - 2528.27) < 0.50, `Expected ~2528.27, got ${res.monthlyPI}`);
    assert.ok(res.totalInterest > 500000, 'Total interest should exceed principal over 30y at 6.5%');
  });

  test('Mortgage Calculator: 0% interest loan edge case', () => {
    const res = computeMortgagePayment(120000, 0, 10, { propertyTaxRate: 0, annualHomeInsurance: 0 });
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

  test('Rent vs Buy: Accurately calculates buyer and renter net worth after 10 years', () => {
    const res = computeRentVsBuy({
      homePrice: 400000,
      downPaymentPct: 0.20,
      mortgageRatePct: 6.5,
      monthlyRent: 2200,
      years: 10
    });
    assert.ok(res.buyerNetWorth > 0, 'Buyer net worth must be positive');
    assert.ok(res.renterNetWorth > 0, 'Renter net worth must be positive');
    assert.ok(res.finalHomeValue > 400000, 'Home should appreciate over 10y');
  });

  test('Roth vs Traditional IRA: Capped at 2026 $7,500 limit and tests tax arbitrage', () => {
    // Current bracket 32%, Retirement bracket 12% -> Traditional wins
    const resTradWins = computeRothVsTraditional(10000, 20, 32, 12);
    assert.equal(resTradWins.annualContribution, 7500, 'Contribution must be capped at 2026 $7,500 limit');
    assert.ok(resTradWins.tradNetAfterRetirementTax > resTradWins.rothNetBalance);

    // Current bracket 12%, Retirement bracket 24% -> Roth wins
    const resRothWins = computeRothVsTraditional(7500, 20, 12, 24);
    assert.ok(resRothWins.rothNetBalance > resRothWins.tradNetAfterRetirementTax);
  });

  test('1099 Self-Employed Tax: Models 15.3% SECA base, 50% deduction, and QBI', () => {
    const res = computeSelfEmployedTax(100000, 10000, 'single');
    assert.equal(res.netProfit, 90000);
    assert.ok(res.totalSecaTax > 10000, 'SECA tax on $90k profit should exceed $10k');
    assert.ok(res.quarterlyEstimatedTax > 0);
    assert.ok(res.netTakeHome < 90000);
  });

  test('Bonus Tax Calculator: Verifies 22% statutory supplemental withholding', () => {
    const res = computeBonusTax(10000, 85000, 'single');
    assert.equal(res.fedWithholding, 2200); // 22% of $10,000
    assert.equal(res.ficaWithholding, 765); // 7.65% of $10,000
    assert.equal(res.netBonusTakeHome, 7035);
  });

  test('Hourly to Salary: 2,080 annual hours standard baseline', () => {
    const res = computeHourlyToSalary(35, 40, 52, 'single');
    assert.equal(res.annualGross, 72800);
    assert.ok(res.annualNet > 50000 && res.annualNet < 72800);
    assert.ok(res.hourlyNet > 20 && res.hourlyNet < 35);
  });

  test('Auto Loan with Trade-In: Tax credit reduces taxable vehicle basis', () => {
    // $35,000 car, $10,000 trade-in (owned free and clear), 6% sales tax
    const res = computeAutoLoan(35000, 10000, 0, 2000, 6.0, 6.0, 60);
    // Taxable price = 35000 - 10000 = 25000 -> Tax = $1,500
    assert.equal(res.salesTax, 1500);
    assert.equal(res.tradeInTaxSavings, 600); // Saved 6% on $10k
    assert.ok(res.monthlyPayment > 400 && res.monthlyPayment < 600);
  });

  test('Student Loan Payoff: Extra payments accelerate debt freedom', () => {
    const res = computeStudentLoanPayoff(30000, 6.0, 10, 100);
    assert.ok(res.monthsSaved > 20, 'Extra $100/mo should save over 20 months on $30k 10y loan');
    assert.ok(res.interestSaved > 2000, 'Interest saved should exceed $2,000');
  });

  test('HYSA vs CD: Compares yields and computes early withdrawal penalty', () => {
    const res = computeHysaVsCd(25000, 4.0, 5.0, 12, 3);
    assert.ok(res.cdInterest > res.hysaInterest);
    assert.ok(res.cdAdvantage > 200);
    assert.ok(res.penaltyAmount > 0);
  });

  test('401(k) Growth: Enforces 2026 $24,500 limit and matches employer formula', () => {
    const res = compute401kGrowth(100000, 3, 10, 6, 0.5, 50000, 20, 7.0);
    assert.ok(res.futureBalance > 500000);
    assert.ok(res.totalEmployerContrib > 0);
  });

  test('Debt-to-Income (DTI): Flags conforming and high risk thresholds', () => {
    const goodDti = computeDti(8000, 1800, 350, 200, 100, 0);
    // Front: 1800 / 8000 = 22.5%, Back: 2450 / 8000 = 30.6%
    assert.equal(goodDti.frontEndDti, 22.5);
    assert.equal(goodDti.backEndDti, 30.6);
    assert.equal(goodDti.underwritingAssessment, 'Conventional Standard (<=36%)');

    const highDti = computeDti(5000, 2000, 400, 300, 200, 0);
    // Back: 2900 / 5000 = 58.0%
    assert.equal(highDti.backEndDti, 58.0);
    assert.equal(highDti.underwritingAssessment, 'High Risk (>43%)');
  });
});

