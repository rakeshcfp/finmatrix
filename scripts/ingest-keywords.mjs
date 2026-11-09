import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { BLOG_ARTICLES } from '../src/data/blogArticles.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_TS_PATH = path.join(ROOT_DIR, 'src', 'data', 'blogArticles.ts');

// --- Helper Functions ---

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      const cleanHeader = h.trim();
      row[cleanHeader] = (values[idx] || '').trim();
      row[cleanHeader.toLowerCase()] = (values[idx] || '').trim();
    });

    const kw = row['Keyword'] || row['keyword'];
    if (kw) {
      rows.push({
        keyword: kw,
        intent: row['Search Intent'] || row['intent'] || row['search intent'] || 'Informational',
        kd: parseInt(row['KD'] || row['kd'] || row['difficulty'] || row['kd %'] || '0', 10),
        volume: parseInt(row['Search Volume'] || row['volume'] || row['search volume'] || '0', 10),
        topicGroup: row['Topic Group (derived)'] || row['Topic Group'] || row['topic group'] || row['category'] || row['cluster'] || 'Personal Finance & Loans',
        cpc: parseFloat(row['CPC (source value)'] || row['CPC'] || row['cpc'] || '0'),
        raw: row
      });
    }
  }

  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.replace(/^"|"$/g, '').trim());
  return result;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Topic Metadata & Content Mapping ---

function getTopicConfig(topicGroup, keyword) {
  const lower = (topicGroup + ' ' + keyword).toLowerCase();

  if (lower.includes('retirement') || lower.includes('drawdown') || lower.includes('401k') || lower.includes('ira') || lower.includes('pension')) {
    return {
      category: 'Retirement & Drawdown',
      leadMagnetId: 'retirement-longevity-matrix',
      embedUrl: '/embed/payment-calculator/index.html',
      embedTitle: 'Finmatrix Retirement & Longevity Simulator',
      coverImage: '/assets/og/retirement-calculator.png',
      calcLink: '/calculators/retirement-calculator.html',
      calcName: 'Retirement Longevity Calculator'
    };
  }

  if (lower.includes('mortgage') || lower.includes('refinance') || lower.includes('amortization') || lower.includes('home loan') || lower.includes('recast')) {
    return {
      category: 'Mortgage & Refinancing',
      leadMagnetId: 'mortgage-amortization-accelerator',
      embedUrl: '/embed/payment-calculator/index.html',
      embedTitle: 'Finmatrix Mortgage & Amortization Calculator',
      coverImage: '/assets/og/mortgage-calculator.png',
      calcLink: '/calculators/mortgage-calculator.html',
      calcName: 'Mortgage Amortization Calculator'
    };
  }

  if (lower.includes('emergency') || lower.includes('savings') || lower.includes('hysa') || lower.includes('compound') || lower.includes('investing')) {
    return {
      category: 'Savings & Investing',
      leadMagnetId: 'emergency-fund-cushion-blueprint',
      embedUrl: '/embed/payment-calculator/index.html',
      embedTitle: 'Finmatrix Savings & Cash Allocation Widget',
      coverImage: '/assets/og/emergency-fund-calculator.png',
      calcLink: '/calculators/emergency-fund-calculator.html',
      calcName: 'Emergency Cushion Planner'
    };
  }

  // Default Debt & Credit
  return {
    category: 'Debt & Credit',
    leadMagnetId: 'debt-snowball-avalanche-toolkit',
    embedUrl: '/embed/payment-calculator/index.html',
    embedTitle: 'Finmatrix Debt Elimination Planner Widget',
    coverImage: '/assets/og/debt-elimination-planner.png',
    calcLink: '/calculators/debt-elimination-planner.html',
    calcName: 'Multi-Card Debt Payoff Calculator'
  };
}

// --- Category-Specific Dynamic Content Engines (Zero Repetition) ---

function generateCategorySpecificContent(category, kw, capitalizedKw, topicConfig) {
  if (category === 'Retirement & Drawdown') {
    return {
      mathHeading: 'The Safe Withdrawal Rate & Capital Depletion Mechanics',
      mathHtml: `
        <p>Retirement capital sustainability hinges on safe withdrawal rate (SWR) dynamics, inflation indexing, and sequence of returns risk. Rather than relying on simple averages, analysts measure the probability of non-depletion over 30-year horizons using the standard SWR model:</p>
        <div class="code-block-wrapper">
          <div class="code-header">
            <span>Safe Withdrawal Rate (SWR) Equation</span>
            <button class="copy-btn" onclick="copyCodeSnippet(this)">Copy Formula</button>
          </div>
          <pre><code>Annual Distribution = Portfolio Starting Balance * SWR

Adjusted Year (t) = Distribution (t-1) * (1 + Annual Inflation CPI)

Where:
  Portfolio Survival Probability >= 95% at SWR = 3.5% to 4.0%
  Target Horizon = 30 to 35 Years</code></pre>
        </div>
        <p>A withdrawal rate exceeding 4.5% during the first 5 years of market downturns drastically increases sequence of returns risk, reducing terminal survival probability.</p>
      `,
      caseStudyHtml: `
        <div class="table-responsive">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Starting Portfolio</th>
                <th>3.5% Conservative Rate</th>
                <th>4.0% Standard Rule</th>
                <th>4.5% Aggressive Rate</th>
                <th>30-Year Survival Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$500,000</td>
                <td>$17,500 / year</td>
                <td>$20,000 / year</td>
                <td>$22,500 / year</td>
                <td><strong style="color:#00d4aa;">96% Survival</strong></td>
              </tr>
              <tr>
                <td>$1,000,000</td>
                <td>$35,000 / year</td>
                <td>$40,000 / year</td>
                <td>$45,000 / year</td>
                <td><strong style="color:#00d4aa;">95% Survival</strong></td>
              </tr>
              <tr>
                <td>$2,000,000</td>
                <td>$70,000 / year</td>
                <td>$80,000 / year</td>
                <td>$90,000 / year</td>
                <td><strong style="color:#00d4aa;">93% Survival</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      faqs: [
        {
          question: `How much can I safely withdraw annually for ${kw}?`,
          answer: `Historical market stress tests (the Trinity Study) establish that a 3.5% to 4.0% initial withdrawal rate adjusted annually for inflation sustains a balanced 60/40 equity/bond portfolio for 30+ years with over 95% probability.`
        },
        {
          question: `How does sequence of returns risk impact ${kw}?`,
          answer: `Experiencing negative market returns in the first 3 to 5 years of drawdown forces retirees to liquidate depreciated shares, permanently crippling portfolio recovery. Maintaining 1 to 2 years of liquid cash reserves mitigates this risk.`
        },
        {
          question: `Where can I download the retirement distribution spreadsheet?`,
          answer: `You can download the free Finmatrix 4% Rule & Retirement Longevity Matrix directly on this page for Excel and Google Sheets.`
        }
      ]
    };
  }

  if (category === 'Mortgage & Refinancing') {
    return {
      mathHeading: 'Front-Loaded Amortization & Principal Prepayment Mechanics',
      mathHtml: `
        <p>Mortgage contracts front-load finance charges so that up to 75% of your early payments go directly toward interest rather than equity. Calculating your exact amortization curve exposes how prepayments alter the compounding equation:</p>
        <div class="code-block-wrapper">
          <div class="code-header">
            <span>Monthly Payment & Principal Recast Formula</span>
            <button class="copy-btn" onclick="copyCodeSnippet(this)">Copy Formula</button>
          </div>
          <pre><code>M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]

Interest Paid in Period (t) = Balance (t-1) * (Annual APR / 12)
Principal Paid in Period (t) = (Scheduled Payment - Interest Paid) + Extra Principal</code></pre>
        </div>
        <p>Because interest recalculates monthly on remaining principal, every extra dollar paid reduces all future interest accrual for the rest of the 30-year term.</p>
      `,
      caseStudyHtml: `
        <div class="table-responsive">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Loan Scenario ($350,000 @ 6.5%)</th>
                <th>Monthly Payment</th>
                <th>Total Interest Paid</th>
                <th>Payoff Horizon</th>
                <th>Net Lifetime Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard 30-Year Amortization</td>
                <td>$2,212 / month</td>
                <td>$446,400</td>
                <td>360 Months (30 Years)</td>
                <td>Baseline ($0 Saved)</td>
              </tr>
              <tr>
                <td>+$200/mo Accelerated Principal</td>
                <td>$2,412 / month</td>
                <td>$356,800</td>
                <td>298 Months (24.8 Years)</td>
                <td><strong style="color:#00d4aa;">+$89,600 Interest Saved</strong></td>
              </tr>
              <tr>
                <td>Bi-Weekly Payment Schedule</td>
                <td>$1,106 bi-weekly</td>
                <td>$372,200</td>
                <td>308 Months (25.6 Years)</td>
                <td><strong style="color:#00d4aa;">+$74,200 Interest Saved</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      faqs: [
        {
          question: `How does an extra payment affect ${kw}?`,
          answer: `Making just one additional monthly payment per year (or adding extra principal monthly) directly wipes out the compound interest calculation, cutting 4 to 6 years off a standard 30-year amortization schedule.`
        },
        {
          question: `Does an amortization schedule change if I refinance?`,
          answer: `Yes. Refinancing resets the amortization clock back to Year 1, which restarts front-loaded interest payments unless you choose a shorter term (like 15 or 20 years).`
        },
        {
          question: `Where can I get the automated amortization spreadsheet?`,
          answer: `Download the Finmatrix Mortgage Amortization & Early Payoff Accelerator Excel workbook on this page to simulate your exact loan schedule with extra principal.`
        }
      ]
    };
  }

  if (category === 'Savings & Investing') {
    return {
      mathHeading: 'Compound Yield Optimization & Inflation Drag Mechanics',
      mathHtml: `
        <p>Building high-yield liquidity balances safety with inflation defense. Keeping capital in low-yield traditional savings guarantees a silent loss in purchasing power, whereas optimized compound interest creates risk-free balance sheet expansion:</p>
        <div class="code-block-wrapper">
          <div class="code-header">
            <span>Daily Compounding APY Equation</span>
            <button class="copy-btn" onclick="copyCodeSnippet(this)">Copy Formula</button>
          </div>
          <pre><code>A = P * (1 + r/n)^(n*t)

Where:
  A = Terminal cash balance
  P = Initial liquid reserve
  r = Annual nominal interest rate
  n = Compounding periods per year (365 for daily compounding)
  t = Number of years elapsed</code></pre>
        </div>
        <p>On a $20,000 cash reserve, the difference between a 0.01% standard bank account and a 4.50% FDIC High-Yield Savings Account is over $900 every single year in risk-free interest.</p>
      `,
      caseStudyHtml: `
        <div class="table-responsive">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Emergency Buffer Tier</th>
                <th>Target Amount</th>
                <th>Traditional Bank (0.01% APY)</th>
                <th>Top HYSA (4.50% APY)</th>
                <th>5-Year Compound Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tier 1: Starter Buffer (1 Month)</td>
                <td>$3,200</td>
                <td>$0.32 / year</td>
                <td>$144.00 / year</td>
                <td><strong style="color:#00d4aa;">+$788 Gain</strong></td>
              </tr>
              <tr>
                <td>Tier 2: Standard Cushion (3 Months)</td>
                <td>$9,600</td>
                <td>$0.96 / year</td>
                <td>$432.00 / year</td>
                <td><strong style="color:#00d4aa;">+$2,364 Gain</strong></td>
              </tr>
              <tr>
                <td>Tier 3: Peace of Mind (6 Months)</td>
                <td>$19,200</td>
                <td>$1.92 / year</td>
                <td>$864.00 / year</td>
                <td><strong style="color:#00d4aa;">+$4,728 Gain</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      faqs: [
        {
          question: `How many months of expenses should I hold for ${kw}?`,
          answer: `Most financial advisors recommend 3 months of essential survival expenses for dual-income households with steady jobs, and 6 months for single-income, freelance, or commission-based earners.`
        },
        {
          question: `Are high-yield savings accounts safe for ${kw}?`,
          answer: `Yes. Top online HYSAs carry full FDIC insurance up to $250,000 per depositor per institution, ensuring zero risk of capital loss.`
        },
        {
          question: `Where can I download the survival budget planner?`,
          answer: `Download the free Finmatrix 3-to-6 Month Emergency Fund Planner spreadsheet on this page to calculate your exact monthly survival numbers.`
        }
      ]
    };
  }

  // Default: Debt & Credit
  return {
    mathHeading: 'Mathematical Debt Avalanche vs. Behavioral Snowball Mechanics',
    mathHtml: `
      <p>Eliminating multi-account debt requires choosing between purely mathematical interest minimization (Avalanche) and psychological momentum maximization (Snowball):</p>
      <div class="code-block-wrapper">
        <div class="code-header">
          <span>Debt Roll-Over Acceleration Mechanics</span>
          <button class="copy-btn" onclick="copyCodeSnippet(this)">Copy Formula</button>
        </div>
        <pre><code>Avalanche Strategy: Rank all debts by descending APR (Highest % First)
Snowball Strategy: Rank all debts by ascending balance (Smallest $ First)

Roll-Over Acceleration (Month t):
Payment on Target Account = Minimum Payment + Extra Prepayment + Sum(Minimums of Paid-Off Debts)</code></pre>
      </div>
      <p>While the Avalanche method mathematically minimizes total interest charges, the Snowball method produces quick psychological wins by clearing smaller balances early.</p>
    `,
    caseStudyHtml: `
      <div class="table-responsive">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Method Strategy ($27,700 Total Debt)</th>
              <th>Monthly Budget</th>
              <th>Total Interest Paid</th>
              <th>Months to Debt-Free</th>
              <th>Net Efficiency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Minimum Payments Only</td>
              <td>$810 / month</td>
              <td>$14,820</td>
              <td>98 Months (8.1 Years)</td>
              <td>Expensive baseline</td>
            </tr>
            <tr>
              <td>Debt Snowball (+$350 Prepayment)</td>
              <td>$1,160 / month</td>
              <td>$5,410</td>
              <td>38 Months</td>
              <td><strong style="color:#00d4aa;">Fastest Momentum</strong></td>
            </tr>
            <tr>
              <td>Debt Avalanche (+$350 Prepayment)</td>
              <td>$1,160 / month</td>
              <td>$4,268</td>
              <td>35 Months</td>
              <td><strong style="color:#00d4aa;">+$1,142 Extra Interest Saved</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    faqs: [
      {
        question: `Which method is mathematically better for ${kw}?`,
        answer: `The Debt Avalanche method is mathematically superior because directing extra payments to your highest APR debt first minimizes compounding finance charges, saving the most money.`
      },
      {
        question: `When should I choose Snowball over Avalanche for ${kw}?`,
        answer: `Choose the Snowball method if you need immediate motivational wins. Wiping out a small $800 balance in 2 months creates powerful psychological momentum to stick with the plan.`
      },
      {
        question: `Where can I download the debt payoff spreadsheet?`,
        answer: `Download the free Finmatrix Debt Snowball vs. Avalanche Payoff Tracker on this page for Excel and Google Sheets.`
      }
    ]
  };
}

// --- Dynamic Content Synthesis Engine ---

function synthesizeArticle(row, clusterRows) {
  const kw = row.keyword;
  const capitalizedKw = toTitleCase(kw);
  const topicConfig = getTopicConfig(row.topicGroup, kw);
  const slug = slugify(kw);
  const catContent = generateCategorySpecificContent(topicConfig.category, kw, capitalizedKw, topicConfig);

  const secondaryKeywords = clusterRows
    .map(r => r.keyword)
    .filter(k => k.toLowerCase() !== kw.toLowerCase())
    .slice(0, 5);

  if (secondaryKeywords.length === 0) {
    secondaryKeywords.push(
      `${kw} calculator`,
      `${kw} 2026`,
      `how to calculate ${kw}`,
      `${kw} formulas`
    );
  }

  let title = `${capitalizedKw}: Step-by-Step Guide & Calculator (2026)`;
  if (title.length > 65) title = `${capitalizedKw} (2026 Guide & Calculator)`;
  if (title.length < 50) title = `${capitalizedKw}: The Definitive Guide & Calculator (2026)`;

  const metaDesc = `Calculate and master ${kw}. Compare mathematical formulas, real-world case scenarios, and download your free 2026 strategy workbook & spreadsheet.`.slice(0, 158);
  const excerpt = `An exhaustive quantitative guide to ${kw}. Discover exact mathematical formulas, practical case studies, interactive tools, and download your free strategy workbook.`;
  const today = new Date().toISOString().split('T')[0];

  const tableOfContents = [
    { id: 'overview', text: `Overview: Understanding ${capitalizedKw}` },
    { id: 'mathematical-model', text: catContent.mathHeading },
    { id: 'step-by-step', text: 'Step-by-Step Implementation Framework' },
    { id: 'case-study', text: 'Scenario Analysis: Real-World Case Study' },
    { id: 'interactive-tool', text: 'Interactive Calculation Simulator' },
    { id: 'common-pitfalls', text: 'Strategic Hazards & Costly Mistakes to Avoid' },
    { id: 'faqs', text: 'Frequently Asked Questions' }
  ];

  const content = `
<section id="overview" class="article-section">
  <h2>Overview: Understanding ${capitalizedKw}</h2>
  <p>Navigating personal finance decisions requires cutting through superficial rules of thumb and examining the hard quantitative mechanics. Whether you are optimizing <strong>${kw}</strong> for wealth acceleration, debt reduction, or cash flow stability, understanding the underlying mathematical formulas is essential to maximizing your capital efficiency.</p>

  <p>Financial institutions, lenders, and asset managers construct their terms around compound interest dynamics. When you master how <em>${kw}</em> functions, you shift leverage back to your personal balance sheet.</p>

  <div class="callout callout-framework">
    <div class="callout-header">
      <span class="callout-icon">📐</span>
      <span class="callout-title">THE QUANTITATIVE FOUNDATION</span>
    </div>
    <div class="callout-body">
      Every successful strategy for <strong>${kw}</strong> balances two competing forces: <em>mathematical yield optimization</em> and <em>risk-adjusted liquidity</em>. Prioritizing pure mathematical efficiency without a liquidity buffer creates systemic vulnerability, whereas excessive conservatism forfeits compound growth.
    </div>
  </div>
</section>

<section id="mathematical-model" class="article-section">
  <h2>${catContent.mathHeading}</h2>
  ${catContent.mathHtml}
</section>

<section id="step-by-step" class="article-section">
  <h2>Step-by-Step Implementation Framework</h2>
  <p>Follow this 4-step framework to execute your strategy with precision:</p>

  <ol class="step-framework">
    <li><strong>Baseline Data Gathering:</strong> Inventory your exact starting principal, nominal interest rates, billing frequency, and contractual obligations.</li>
    <li><strong>Surplus Cash Flow Calibration:</strong> Audit monthly discretionary surplus to establish a sustainable ongoing allocation that will not jeopardize your liquid emergency reserves.</li>
    <li><strong>Scenario Simulation:</strong> Test conservative, moderate, and aggressive prepayment or withdrawal models to identify the optimal breakeven point.</li>
    <li><strong>Systematic Automation:</strong> Establish recurring bank transfers scheduled immediately following primary income deposits to remove emotional hesitation.</li>
  </ol>
</section>

<!-- MIDWAY IN-ARTICLE LEAD MAGNET INJECTION -->
<div class="finmatrix-lead-capture" data-magnet-id="${topicConfig.leadMagnetId}"></div>

<section id="case-study" class="article-section">
  <h2>Scenario Analysis: Real-World Case Study</h2>
  <p>To visualize the concrete impact of strategic optimization in <strong>${kw}</strong>, examine this side-by-side comparison across realistic consumer scenarios:</p>
  ${catContent.caseStudyHtml}
</section>

<section id="interactive-tool" class="article-section">
  <h2>Interactive Calculation Simulator</h2>
  <p>Input your own financial parameters into the live Finmatrix simulator below to see your customized timeline and savings output:</p>

  <div class="calculator-embed-container">
    <iframe 
      src="${topicConfig.embedUrl}" 
      title="${escapeHtml(topicConfig.embedTitle)}" 
      loading="lazy" 
      class="responsive-embed-frame"
    ></iframe>
    <div class="embed-caption">
      <span>Interactive Tool: Explore the full <a href="${topicConfig.calcLink}" target="_blank">${topicConfig.calcName}</a> on Finmatrix</span>
    </div>
  </div>
</section>

<section id="common-pitfalls" class="article-section">
  <h2>Strategic Hazards & Costly Mistakes to Avoid</h2>
  <p>When implementing changes around <em>${kw}</em>, watch out for these common analytical pitfalls:</p>

  <div class="callout callout-warning">
    <div class="callout-header">
      <span class="callout-icon">⚠️</span>
      <span class="callout-title">CRITICAL HAZARDS TO MITIGATE</span>
    </div>
    <div class="callout-body">
      <strong>1. Ignoring Cash Flow Volatility:</strong> Over-committing to rigid structures without liquid buffers creates refinancing penalties during temporary income interruptions.<br/><br/>
      <strong>2. Overlooking Opportunity Cost:</strong> Comparing returns directly against after-tax equity market expectations ensures your capital is directed to its highest-yield application.<br/><br/>
      <strong>3. Front-Loaded Fees:</strong> Ensure terms or distribution vehicles do not assess administrative early-termination penalties before accelerating schedules.
    </div>
  </div>
</section>

<!-- END-OF-ARTICLE LEAD MAGNET INJECTION -->
<div class="finmatrix-lead-capture" data-magnet-id="${topicConfig.leadMagnetId}"></div>

<section id="faqs" class="article-section">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-accordion-container">
    <!-- Populated automatically from faqs array -->
  </div>
</section>
`;

  return {
    slug,
    title,
    metaDescription: metaDesc,
    excerpt,
    category: topicConfig.category,
    readTime: '8 min read',
    publishedDate: today,
    lastUpdated: today,
    author: {
      name: 'Finmatrix Quantitative Desk',
      role: 'Financial Research & Mathematical Modeling Team',
      avatar: '/assets/icons/favicon.svg'
    },
    coverImage: topicConfig.coverImage,
    targetKeywords: {
      primary: kw,
      secondary: secondaryKeywords,
      searchIntent: row.intent,
      monthlyVolume: row.volume,
      keywordDifficulty: row.kd
    },
    tableOfContents,
    content,
    faqs: catContent.faqs,
    leadMagnetId: topicConfig.leadMagnetId
  };
}

function saveArticlesToTs(newArticlesMap) {
  const mergedMap = { ...BLOG_ARTICLES, ...newArticlesMap };
  const contentLines = [
    `/**`,
    ` * Finmatrix Programmatic SEO Blog Articles Registry`,
    ` * Single Source of Truth for Quantitative Pillar Content`,
    ` * Auto-generated and maintained by scripts/ingest-keywords.mjs`,
    ` */`,
    ``,
    `export interface BlogArticle {`,
    `  slug: string;`,
    `  title: string;`,
    `  metaDescription: string;`,
    `  excerpt: string;`,
    `  category: string;`,
    `  readTime: string;`,
    `  publishedDate: string;`,
    `  lastUpdated: string;`,
    `  author: {`,
    `    name: string;`,
    `    role: string;`,
    `    avatar: string;`,
    `  };`,
    `  coverImage: string;`,
    `  targetKeywords: {`,
    `    primary: string;`,
    `    secondary: string[];`,
    `    searchIntent: 'Informational' | 'Commercial' | 'Transactional';`,
    `    monthlyVolume?: number;`,
    `    keywordDifficulty?: number;`,
    `  };`,
    `  tableOfContents: { id: string; text: string }[];`,
    `  content: string;`,
    `  faqs: { question: string; answer: string }[];`,
    `  leadMagnetId?: string;`,
    `}`,
    ``,
    `export const BLOG_ARTICLES: Record<string, BlogArticle> = ${JSON.stringify(mergedMap, null, 2)};`,
    ``
  ];

  fs.writeFileSync(ARTICLES_TS_PATH, contentLines.join('\n'), 'utf8');
  console.log(`[OK] Successfully updated ${ARTICLES_TS_PATH} (Total articles: ${Object.keys(mergedMap).length})`);
}

// --- Main CLI Runner ---

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Finmatrix Multi-CSV SEMrush Keyword Ingestion & Dynamic Blog Engine

Usage:
  1. From CSV File or Folder:
     npm run ingest -- data/my-keywords.csv --top 2 --build
     npm run ingest -- data/ --sort-kd --top 2 --build

  2. Direct Single Keyword (No CSV Needed):
     npm run keyword -- --keyword "car loan payoff calculator" --volume 8100 --kd 14 --build

Options:
  --sort-kd             Prioritize lowest Keyword Difficulty (KD) first (easiest to rank)
  --keyword "<keyword>" Target keyword directly
  --volume <number>     Monthly search volume (default: 5000)
  --kd <number>         Keyword difficulty percentage 0-100 (default: 20)
  --cluster "<name>"    Topic Category (e.g. "Debt & Credit", "Mortgage & Refinancing")
  --top <number>        Number of top keywords to ingest (default: 1)
  --build               Automatically run 'npm run build' after ingestion
  --dry-run             Preview generation without saving
    `);
    process.exit(0);
  }

  const kwIdx = args.indexOf('--keyword');
  const targetKeyword = kwIdx !== -1 && args[kwIdx + 1] ? args[kwIdx + 1].trim() : null;

  const clusterIdx = args.indexOf('--cluster');
  const targetCluster = clusterIdx !== -1 && args[clusterIdx + 1] ? args[clusterIdx + 1].trim() : null;

  const volIdx = args.indexOf('--volume');
  const inputVolume = volIdx !== -1 && args[volIdx + 1] ? parseInt(args[volIdx + 1], 10) : 5000;

  const kdIdx = args.indexOf('--kd');
  const inputKd = kdIdx !== -1 && args[kdIdx + 1] ? parseInt(args[kdIdx + 1], 10) : 20;

  const topIdx = args.indexOf('--top');
  const topN = topIdx !== -1 && args[topIdx + 1] ? parseInt(args[topIdx + 1], 10) : 1;

  const shouldSortKd = args.includes('--sort-kd');
  const shouldBuild = args.includes('--build');
  const isDryRun = args.includes('--dry-run');

  let selectedRows = [];
  let clusterRows = [];

  const firstArg = args[0] || '';
  const resolvedPath = path.resolve(ROOT_DIR, firstArg);
  const isExistingPath = fs.existsSync(resolvedPath);

  if (isExistingPath) {
    let csvFiles = [];
    const stat = fs.statSync(resolvedPath);

    if (stat.isDirectory()) {
      // Multiple CSV support: Read all .csv files in folder!
      const allFiles = fs.readdirSync(resolvedPath);
      csvFiles = allFiles
        .filter(f => f.endsWith('.csv'))
        .map(f => path.join(resolvedPath, f));
      console.log(`[OK] Detected ${csvFiles.length} CSV file(s) in folder: ${firstArg}`);
    } else if (resolvedPath.endsWith('.csv')) {
      csvFiles = [resolvedPath];
    }

    let allRows = [];
    for (const file of csvFiles) {
      console.log(`--- Reading: ${path.basename(file)} ---`);
      const content = fs.readFileSync(file, 'utf8');
      const parsed = parseCsv(content);
      allRows.push(...parsed);
    }

    // Deduplicate by keyword
    const seen = new Set();
    let rows = [];
    for (const r of allRows) {
      const k = r.keyword.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        rows.push(r);
      }
    }
    console.log(`[OK] Total unique keywords gathered: ${rows.length}`);

    if (targetCluster) {
      rows = rows.filter(r => r.topicGroup.toLowerCase().includes(targetCluster.toLowerCase()));
      console.log(`[OK] Filtered to ${rows.length} rows for cluster: "${targetCluster}"`);
    }

    // Sort: Lowest KD first if --sort-kd, otherwise by Volume
    if (shouldSortKd) {
      console.log(`[SORT] Ordering by lowest Keyword Difficulty (KD) first, then highest volume.`);
      rows.sort((a, b) => a.kd - b.kd || b.volume - a.volume);
    } else {
      console.log(`[SORT] Ordering by highest Search Volume first.`);
      rows.sort((a, b) => b.volume - a.volume);
    }

    if (targetKeyword) {
      const match = rows.find(r => r.keyword.toLowerCase() === targetKeyword.toLowerCase());
      if (!match) {
        console.error(`Error: Keyword "${targetKeyword}" not found in CSVs.`);
        process.exit(1);
      }
      selectedRows = [match];
      clusterRows = rows.filter(r => r.topicGroup === match.topicGroup);
    } else {
      selectedRows = rows.slice(0, topN);
      clusterRows = rows;
    }
  } else {
    // Direct keyword mode
    if (!targetKeyword) {
      console.error('Error: Please provide a CSV file/folder or --keyword "<keyword>".');
      process.exit(1);
    }

    console.log(`--- Processing Direct Single Keyword: "${targetKeyword}" ---`);
    const directRow = {
      keyword: targetKeyword,
      intent: 'Commercial',
      kd: inputKd,
      volume: inputVolume,
      topicGroup: targetCluster || 'Personal Finance & Loans',
      cpc: 1.50
    };
    selectedRows = [directRow];
    clusterRows = [directRow];
  }

  console.log(`\nSelected ${selectedRows.length} keyword(s) for generation:`);
  selectedRows.forEach((r, idx) => {
    console.log(`  ${idx + 1}. "${r.keyword}" (Vol: ${r.volume.toLocaleString()}, KD: ${r.kd}%, Category: ${r.topicGroup})`);
  });

  const newArticles = {};
  for (const row of selectedRows) {
    const relatedRows = clusterRows.filter(r => r.topicGroup === row.topicGroup);
    const article = synthesizeArticle(row, relatedRows.length ? relatedRows : [row]);
    newArticles[article.slug] = article;
    console.log(`[OK] Generated unique article for slug: "${article.slug}"`);
  }

  if (isDryRun) {
    console.log('\n[DRY RUN] Complete. No files modified.');
    return;
  }

  saveArticlesToTs(newArticles);

  if (shouldBuild) {
    console.log('\n--- Running Master Site Build & Sitemap Sync ---');
    try {
      execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });
      console.log('\n[SUCCESS] Site build complete! New pages, navbars, and sitemap updated.');
    } catch (err) {
      console.error('\n[ERROR] Build step encountered an issue:', err.message);
    }
  }
}

main();
