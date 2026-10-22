/* Finmatrix — Daily Trending Finance Tips Automation Engine */

const TIP_DATABASE = [
  {
    category: "Savings Alert",
    tag: "HYSA Yield",
    title: "Lock in 4.5%+ APY High-Yield Savings Before Fed Rate Adjustments",
    tip: "If your emergency savings is sitting in a traditional bank earning 0.01%, moving $10,000 to an online High-Yield Savings Account (Marcus, SoFi, Capital One) earns you over $450 in passive interest every year for zero effort.",
    actionText: "Compare HYSA Rates →",
    actionLink: "calculators/emergency-fund-calculator.html"
  },
  {
    category: "Tax Hack",
    tag: "Roth IRA 2025/26",
    title: "Maxing Out Your Roth IRA Early Compounds Tax-Free Wealth Faster",
    tip: "For 2025/2026, the IRS contribution limit is $7,000 ($8,000 if 50+). Contributing $583/month into an S&P 500 index fund gives you 100% tax-free withdrawals in retirement.",
    actionText: "Roth IRA Calculator →",
    actionLink: "calculators/roth-vs-traditional-ira-calculator.html"
  },
  {
    category: "Housing Strategy",
    tag: "Mortgage PMI",
    title: "Request PMI Removal Once You Reach 20% Home Equity",
    tip: "Private Mortgage Insurance (PMI) costs 0.5% to 1.5% of your loan annually. If your home has appreciated or you've paid down 20% of your principal balance, contact your lender to drop PMI and save $150–$300/month.",
    actionText: "Mortgage Calculator →",
    actionLink: "calculators/mortgage-calculator.html"
  },
  {
    category: "Debt Payoff",
    tag: "0% APR Transfer",
    title: "Stop Paying 24% Credit Card APR with 0% Balance Transfers",
    tip: "If you carry credit card balances, transferring to a 0% APR balance transfer credit card for 18–21 months pauses interest completely, allowing 100% of your payment to wipe out principal.",
    actionText: "Credit Card Calculator →",
    actionLink: "calculators/credit-card-payoff-calculator.html"
  },
  {
    category: "Retirement Goal",
    tag: "401(k) Employer Match",
    title: "Never Leave Your 401(k) Employer Match Money on the Table",
    tip: "A 50% or 100% employer 401(k) match is an instant, guaranteed 50–100% return on your money. Always contribute enough to claim the full match before investing anywhere else.",
    actionText: "Retirement Calculator →",
    actionLink: "calculators/retirement-calculator.html"
  },
  {
    category: "Early Retirement",
    tag: "FIRE Movement",
    title: "The 25x Rule: Your Financial Independence Benchmark",
    tip: "Multiply your annual living expenses by 25 to find your FIRE number. Once your investment portfolio reaches this number, a 4% annual withdrawal supports your lifestyle indefinitely without depleting principal.",
    actionText: "FIRE Calculator →",
    actionLink: "calculators/fire-calculator.html"
  },
  {
    category: "Budgeting Rule",
    tag: "Paycheck Allocation",
    title: "Use the 50/30/20 Rule to Automate Paycheck Budgeting",
    tip: "Allocate 50% of take-home pay to Needs (rent, food, utilities), 30% to Wants (dining, fun), and 20% directly to Savings & Debt Payoff. Automate transfers on payday so you never overspend.",
    actionText: "Paycheck Calculator →",
    actionLink: "calculators/paycheck-calculator.html"
  },
  {
    category: "Credit Score",
    tag: "Utilization Hack",
    title: "Pay Credit Cards Before Statement Dates to Boost FICO Scores",
    tip: "Credit card utilization accounts for 30% of your FICO score. Paying down balances 2 days BEFORE your statement closing date ensures a low balance is reported to Experian and TransUnion.",
    actionText: "Credit Score Guide →",
    actionLink: "articles/boost-credit-score-30-days.html"
  },
  {
    category: "College Savings",
    tag: "529 Plan",
    title: "State Tax Deductions Make 529 College Plans a No-Brainer",
    tip: "Over 30 states offer state income tax deductions or credits for contributing to a 529 College Savings Plan. Money grows tax-free for qualified education expenses.",
    actionText: "College Calculator →",
    actionLink: "calculators/college-savings-calculator.html"
  }
];

// Dynamic Daily Selector (Rotates automatically based on UTC Day of the Year)
function getDailyTrendingTips() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Pick 3 distinct tips based on dayOfYear seed
  const count = TIP_DATABASE.length;
  const index1 = dayOfYear % count;
  const index2 = (dayOfYear + 3) % count;
  const index3 = (dayOfYear + 6) % count;

  return [
    TIP_DATABASE[index1],
    TIP_DATABASE[index2],
    TIP_DATABASE[index3]
  ];
}

// Render Daily Trending Tips Widget
function renderDailyTrendingTipsWidget(containerId, isSubFolder = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tips = getDailyTrendingTips();

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <div>
        <div class="section-label">Automated Feed</div>
        <h2 style="font-family:var(--font-heading);font-size:1.6rem;font-weight:800;">🔥 Daily Trending Money Tips</h2>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:0.8rem;background:var(--bg3);padding:6px 12px;border-radius:100px;border:1px solid var(--border);">
        <span style="width:8px;height:8px;border-radius:50%;background:#ff4757;box-shadow:0 0 8px #ff4757;display:inline-block;"></span>
        <span style="color:var(--text-muted);font-weight:600;">Updated Today: <strong>${todayStr}</strong></span>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
  `;

  tips.forEach(t => {
    const linkPath = isSubFolder ? '../' + t.actionLink : t.actionLink;
    html += `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:22px;display:flex;flex-direction:column;justify-content:space-between;transition:border-color 0.2s;" class="daily-tip-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span class="chip" style="font-size:0.68rem;">${t.category}</span>
            <span style="font-size:0.7rem;color:var(--accent);font-family:var(--font-mono);font-weight:700;">${t.tag}</span>
          </div>
          <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:8px;line-height:1.4;">${t.title}</h3>
          <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.6;margin-bottom:16px;">${t.tip}</p>
        </div>
        <a href="${linkPath}" class="btn-ghost" style="padding:8px 14px;font-size:0.85rem;width:100%;justify-content:center;">${t.actionText}</a>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}
