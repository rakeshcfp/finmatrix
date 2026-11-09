/* Finmatrix — Real-time Search Engine & Calculator Directory Handler */

(function() {
    const EMBEDDED_CALCULATORS = [{"id":"payment-calculator","name":"Universal Payment Calculator (Car, Mortgage & Loans)","shortName":"Payment Calculator","category":"loans","url":"/calculators/payment-calculator.html","icon":"💳","badge":"🔥 74K Search Winner","popular":true,"description":"Calculate exact monthly payments, total interest, and amortization schedules with extra prepayments for car, mortgage, and personal loans.","keywords":["payment calculator","loan payment calculator","car payment calculator","mortgage payment calculator","monthly loan payment","payment calculator with interest"]},{"id":"debt-elimination-planner","name":"Debt Snowball vs Avalanche Calculator","shortName":"Debt Avalanche vs Snowball","category":"debt","url":"/calculators/debt-elimination-planner.html","icon":"⚡","badge":"🔥 Flagship Tool","popular":true,"description":"Compare Debt Avalanche vs. Debt Snowball strategies side-by-side and calculate 0% APR balance transfer savings.","keywords":["debt avalanche","debt snowball","credit card payoff","debt elimination","balance transfer savings"]},{"id":"paycheck-calculator","name":"Paycheck & Take-Home Pay Calculator (2026)","shortName":"Paycheck Take-Home Pay","category":"income-tax","url":"/calculators/paycheck-calculator.html","icon":"💵","badge":"2026 Tax Rules","popular":true,"description":"Calculate exact net bi-weekly or monthly take-home pay after Federal, FICA ($184,500 cap), State taxes, and 401(k) deductions.","keywords":["paycheck calculator","take home pay","salary after tax","2026 tax brackets","fica withholding"]},{"id":"mortgage-calculator","name":"Mortgage Payment & Amortization Calculator","shortName":"Mortgage Payment","category":"housing","url":"/calculators/mortgage-calculator.html","icon":"🏠","badge":"PITI & Amortization","popular":true,"description":"Calculate monthly principal, interest, property taxes, home insurance (PITI), and full amortization schedules.","keywords":["mortgage calculator","piti payment","amortization schedule","home loan payment","pmi calculator"]},{"id":"compound-interest-calculator","name":"Compound Interest & Wealth Calculator","shortName":"Compound Interest","category":"savings-investing","url":"/calculators/compound-interest-calculator.html","icon":"📈","badge":"Wealth Multiplier","popular":true,"description":"Simulate future investment wealth with monthly compounding deposits, dividend reinvestment, and total return graphs.","keywords":["compound interest calculator","investment growth","future value","interest compounding"]},{"id":"credit-card-payoff-calculator","name":"Credit Card Payoff Calculator","shortName":"Credit Card Payoff","category":"debt","url":"/calculators/credit-card-payoff-calculator.html","icon":"💳","badge":"Interest Buster","popular":true,"description":"Find how many months to become debt-free and calculate how much interest you save with 0% intro APR balance transfers.","keywords":["credit card payoff","pay off credit cards","interest saved","credit card interest calculator"]},{"id":"refinance-break-even-calculator","name":"Mortgage Refinance Break-Even Calculator","shortName":"Refinance Break-Even","category":"housing","url":"/calculators/refinance-break-even-calculator.html","icon":"🔄","badge":"Break-Even Math","popular":true,"description":"Determine the exact month when your monthly payment savings exceed refinance closing costs.","keywords":["refinance break even","is refinancing worth it","mortgage refinance calculator","closing cost recovery"]},{"id":"rent-vs-buy-calculator","name":"Rent vs. Buy Calculator (True Cost Analysis)","shortName":"Rent vs Buy","category":"housing","url":"/calculators/rent-vs-buy-calculator.html","icon":"🔑","badge":"Opportunity Cost","popular":true,"description":"Compare unrecoverable ownership costs (property taxes, maintenance, PMI) against renting and investing down payment capital in index funds.","keywords":["rent vs buy","is it better to rent or buy","price to rent ratio","opportunity cost housing"]},{"id":"roth-vs-traditional-ira-calculator","name":"Roth vs. Traditional IRA Calculator (2026)","shortName":"Roth vs Traditional IRA","category":"savings-investing","url":"/calculators/roth-vs-traditional-ira-calculator.html","icon":"🏦","badge":"2026 Limits ($7,500)","popular":true,"description":"Compare tax-free Roth retirement withdrawals against upfront Traditional IRA tax deductions side-by-side.","keywords":["roth vs traditional ira","ira contribution limit 2026","roth ira tax free","retirement accounts"]},{"id":"401k-calculator","name":"401(k) Growth & Employer Match Calculator","shortName":"401(k) Growth & Match","category":"savings-investing","url":"/calculators/401k-calculator.html","icon":"💼","badge":"2026 Limits ($24,500)","popular":true,"description":"Project your 401(k) retirement balance with elective employee contributions and employer matching formulas.","keywords":["401k calculator","employer match","401k growth","retirement contribution limits 2026"]},{"id":"hysa-vs-cd-calculator","name":"HYSA vs. CD Calculator: Yield & Liquidity","shortName":"HYSA vs CD","category":"savings-investing","url":"/calculators/hysa-vs-cd-calculator.html","icon":"💰","badge":"Cash Allocation","popular":true,"description":"Compare flexible high-yield savings APYs against fixed Certificate of Deposit (CD) rate locks and early withdrawal penalties.","keywords":["hysa vs cd","high yield savings account vs cd","best cash yield","cd early withdrawal penalty"]},{"id":"self-employed-tax-calculator","name":"Self-Employed (1099) Tax & W-2 Comparison","shortName":"1099 Self-Employed Tax","category":"income-tax","url":"/calculators/self-employed-tax-calculator.html","icon":"📊","badge":"1099 vs W-2","popular":true,"description":"Estimate 15.3% SECA self-employment tax, quarterly estimated payments, and compare 1099 contractor income to W-2 equivalent salary.","keywords":["1099 tax calculator","self employment tax","1099 vs w2","quarterly tax payments","contractor taxes"]},{"id":"bonus-tax-calculator","name":"Bonus & Overtime Withholding Tax Calculator","shortName":"Bonus & Overtime Tax","category":"income-tax","url":"/calculators/bonus-tax-calculator.html","icon":"🎁","badge":"Supplemental Pay","popular":false,"description":"Understand why bonuses are withheld at the 22% statutory supplemental rate and calculate your true net payout.","keywords":["bonus tax calculator","supplemental tax rate 22 percent","overtime tax","bonus take home pay"]},{"id":"hourly-to-salary-calculator","name":"Hourly to Salary After-Tax Calculator","shortName":"Hourly to Salary","category":"income-tax","url":"/calculators/hourly-to-salary-calculator.html","icon":"⏱️","badge":"Wage Converter","popular":false,"description":"Convert hourly wage to annual gross and net after-tax salary based on 2,080 standard annual work hours.","keywords":["hourly to salary","wage to annual salary","hourly after tax","take home wage converter"]},{"id":"home-affordability-calculator","name":"Home Affordability Calculator (28/36 DTI)","shortName":"Home Affordability","category":"housing","url":"/calculators/home-affordability-calculator.html","icon":"🏡","badge":"28/36 Rule","popular":false,"description":"Calculate maximum affordable home price and monthly mortgage budget based on gross income and existing debt obligations.","keywords":["home affordability","how much house can i afford","28 36 rule","debt to income ratio"]},{"id":"debt-to-income-calculator","name":"Debt-to-Income (DTI) Ratio Calculator","shortName":"Debt-to-Income (DTI)","category":"loans","url":"/calculators/debt-to-income-calculator.html","icon":"⚖️","badge":"Lending Benchmark","popular":false,"description":"Calculate front-end and back-end DTI ratios required for conventional, FHA, and VA mortgage approvals.","keywords":["debt to income ratio","dti calculator","mortgage qualification dti","back end dti"]},{"id":"auto-loan-calculator","name":"Auto Loan Calculator with Trade-In & Tax","shortName":"Auto Loan & Trade-In","category":"loans","url":"/calculators/auto-loan-calculator.html","icon":"🚗","badge":"Sales Tax & Equity","popular":false,"description":"Calculate monthly car payments, trade-in equity tax credits, and total financing interest charges.","keywords":["auto loan calculator","car payment with trade in","car sales tax credit","auto financing"]},{"id":"student-loan-calculator","name":"Student Loan Payoff with Extra Payments","shortName":"Student Loan Payoff","category":"loans","url":"/calculators/student-loan-calculator.html","icon":"🎓","badge":"Interest Accelerator","popular":false,"description":"Determine how an extra $50, $100, or $200 per month cuts years off your student loan repayment term.","keywords":["student loan payoff","student loan extra payments","accelerate student loans","pay off college debt"]},{"id":"loan-calculator","name":"Personal Loan Payment & Amortization Calculator","shortName":"Personal Loan Payment","category":"loans","url":"/calculators/loan-calculator.html","icon":"📑","badge":"Fixed Rate","popular":false,"description":"Find fixed monthly payments and total interest costs for personal loans, auto financing, or debt consolidation.","keywords":["loan calculator","personal loan payment","fixed rate loan","loan amortization"]},{"id":"fire-calculator","name":"FIRE Early Retirement Calculator (Rule of 25)","shortName":"FIRE Early Retirement","category":"savings-investing","url":"/calculators/fire-calculator.html","icon":"🔥","badge":"Rule of 25","popular":true,"description":"Calculate your Financial Independence number (25x annual spending), savings rate percentage, and target retirement age.","keywords":["fire calculator","financial independence retire early","rule of 25","safe withdrawal rate 4 percent"]},{"id":"retirement-calculator","name":"Retirement Nest Egg & 4% Withdrawal Calculator","shortName":"Retirement Nest Egg","category":"savings-investing","url":"/calculators/retirement-calculator.html","icon":"🏖️","badge":"4% Trinity Rule","popular":false,"description":"Determine future nest egg accumulation, inflation-adjusted spending, and monthly savings needed to retire safely.","keywords":["retirement calculator","nest egg growth","4 percent rule","trinity study withdrawal"]},{"id":"emergency-fund-calculator","name":"Emergency Fund Calculator (3-6 Months)","shortName":"Emergency Fund","category":"savings-investing","url":"/calculators/emergency-fund-calculator.html","icon":"🛡️","badge":"Safety Net","popular":false,"description":"Calculate your ideal 3 to 6-month safety net size based on essential monthly living expenses and risk factors.","keywords":["emergency fund calculator","3 to 6 months savings","liquid emergency reserve","safety net"]},{"id":"college-savings-calculator","name":"529 College Savings & Tuition Inflation Calculator","shortName":"529 College Savings","category":"savings-investing","url":"/calculators/college-savings-calculator.html","icon":"🎒","badge":"529 Growth","popular":false,"description":"Project future 4-year tuition costs factoring 4%–5% college inflation and calculate necessary monthly 529 plan savings.","keywords":["529 college savings","tuition inflation calculator","college savings planner","529 plan growth"]},{"id":"time-value-of-money-calculator","name":"Time Value of Money (TVM) Calculator (FV & PV)","shortName":"Time Value of Money","category":"savings-investing","url":"/calculators/time-value-of-money-calculator.html","icon":"⌛","badge":"FV / PV Engine","popular":false,"description":"Compute Future Value (FV), Present Value (PV), discount rate, and purchasing power erosion due to inflation.","keywords":["time value of money","tvm calculator","future value","present value","inflation purchasing power"]}];
  let calculatorsData = EMBEDDED_CALCULATORS;

  async function loadCalculators() {
    try {
      const res = await fetch('/config/calculators.json?v=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        calculatorsData = await res.json();
        return calculatorsData;
      }
    } catch (e) {
      // Offline or file protocol fallback
    }
    return calculatorsData || EMBEDDED_CALCULATORS;
  }

  function createCalculatorCard(calc) {
    return `
      <a href="${calc.url}" class="card ${calc.popular ? 'card-popular' : ''}" data-category="${calc.category}" data-id="${calc.id}">
        <div class="card-icon">${calc.icon || '🧮'}</div>
        <h3>${calc.shortName || calc.name}</h3>
        <p>${calc.description}</p>
        <div class="card-footer">
          <span class="chip ${calc.popular ? 'orange' : ''}">${calc.badge || calc.category}</span>
          <span style="color:var(--accent);font-weight:700;">Calculate →</span>
        </div>
      </a>
    `;
  }

  // Initialize Search & Filter Bar
  async function initSearch(inputId, resultsContainerId, options = {}) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(resultsContainerId);
    if (!input || !container) return;

    const tools = await loadCalculators();

    function performFilter() {
      const query = input.value.trim().toLowerCase();
      const categoryFilter = options.category || null;

      let filtered = tools.filter(tool => {
        if (categoryFilter && tool.category !== categoryFilter) return false;
        if (!query) return true;

        const matchName = (tool.name || '').toLowerCase().includes(query);
        const matchShort = (tool.shortName || '').toLowerCase().includes(query);
        const matchDesc = (tool.description || '').toLowerCase().includes(query);
        const matchCat = (tool.category || '').toLowerCase().includes(query);
        const matchKw = (tool.keywords || []).some(k => k.toLowerCase().includes(query));

        return matchName || matchShort || matchDesc || matchCat || matchKw;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding:40px 20px; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius);">
            <div style="font-size:2rem; margin-bottom:10px;">🔍</div>
            <h3 style="margin-bottom:8px;">No matching calculators found</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Try searching for terms like "paycheck", "avalanche", "mortgage", "tax", or "refinance".</p>
            <button type="button" class="btn-ghost" onclick="document.getElementById('${inputId}').value=''; document.getElementById('${inputId}').dispatchEvent(new Event('input'));" style="margin-top:12px;">Reset Search</button>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(createCalculatorCard).join('');
      }

      const counterEl = document.getElementById(options.counterId);
      if (counterEl) {
        counterEl.textContent = `${filtered.length} Calculator${filtered.length === 1 ? '' : 's'}`;
      }
    }

    input.addEventListener('input', performFilter);

    // Check URL Search Params for ?q=... or ?category=...
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      input.value = q;
    }
    performFilter();
  }

  // Render Popular Calculators Grid (for Homepage & Hubs)
  async function renderPopularCalculators(containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tools = await loadCalculators();
    const popular = tools.filter(t => t.popular).slice(0, limit);
    container.innerHTML = popular.map(createCalculatorCard).join('');
  }

  // Render Category Hub Tools
  async function renderCategoryTools(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tools = await loadCalculators();
    const catTools = tools.filter(t => t.category === category);
    container.innerHTML = catTools.map(createCalculatorCard).join('');
  }

  window.FinmatrixSearch = {
    loadCalculators,
    initSearch,
    renderPopularCalculators,
    renderCategoryTools
  };
})();
