import fs from 'fs';

// Load base workflow
const sourcePath = 'C:\\Users\\Rakesh\\.gemini\\antigravity\\brain\\0b073859-daa6-48de-a2bb-926d79f02937\\.user_uploaded\\media_1794424387069_bf7bb5a5.json';
const wf = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Master Sheet ID
const FINMATRIX_SHEET_ID = "1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k";

// Ingest CSVs with strict competitor domain & name sanitization
function parseCsv(filePath, defaultPillar, defaultUrl) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const results = [];
  let header = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (i === 0) {
      header = parts.map(p => p.trim().toLowerCase());
      continue;
    }
    const kwIdx = header.indexOf('keyword');
    const volIdx = header.indexOf('volume');
    const kdIdx = header.indexOf('keyword difficulty');
    const intIdx = header.indexOf('intent');

    let kw = parts[kwIdx];
    if (!kw || kw.length < 3) continue;

    kw = kw.replace(/myusfinance(\.com)?/gi, '')
           .replace(/nerdwallet(\.com)?/gi, '')
           .replace(/bankrate(\.com)?/gi, '')
           .replace(/smartasset(\.com)?/gi, '')
           .trim();
    if (!kw || kw.length < 3) continue;

    const vol = parseInt(parts[volIdx], 10) || 500;
    const kd = parseInt(parts[kdIdx], 10) || 15;
    const intent = parts[intIdx] || 'Commercial';

    results.push({
      keyword: kw,
      volume: vol,
      kd: kd,
      intent: intent,
      pillar: defaultPillar,
      targetUrl: defaultUrl
    });
  }
  return results;
}

const kw401k = parseCsv('data/401k-growth-calculator_saved-keywords_2026-11-08.csv', 'Retirement & 401(k)', 'https://finmatrix.cloud/calculators/401k-calculator.html');
const kwCredit = parseCsv('data/credit-card_saved-keywords_2026-11-06.csv', 'Debt & Credit Payoff', 'https://finmatrix.cloud/calculators/debt-elimination-planner.html');

const coreHighIntent = [
  { keyword: "debt snowball vs avalanche calculator", volume: 14800, kd: 12, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-elimination-planner.html" },
  { keyword: "how much house can i afford calculator", volume: 49500, kd: 22, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/home-affordability-calculator.html" },
  { keyword: "rent vs buy calculator 2026", volume: 27100, kd: 19, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/rent-vs-buy-calculator.html" },
  { keyword: "refinance break even calculator", volume: 12100, kd: 15, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/refinance-break-even-calculator.html" },
  { keyword: "hysa vs cd calculator rates", volume: 9900, kd: 8, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html" },
  { keyword: "compound interest calculator daily monthly", volume: 33100, kd: 18, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "emergency fund blueprint 3 to 6 months", volume: 8100, kd: 9, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/emergency-fund-calculator.html" },
  { keyword: "401k growth calculator with employer match", volume: 12100, kd: 11, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/401k-calculator.html" },
  { keyword: "roth ira vs traditional ira calculator", volume: 14800, kd: 15, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/roth-vs-traditional-ira-calculator.html" },
  { keyword: "fire calculator financial independence retire early", volume: 14800, kd: 17, intent: "Informational", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/fire-calculator.html" },
  { keyword: "minimum payment calculator credit card trap", volume: 22200, kd: 16, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-elimination-planner.html" },
  { keyword: "paycheck tax calculator take home pay by state", volume: 60500, kd: 28, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/take-home-pay-calculator.html" },
  { keyword: "bonus tax calculator net amount", volume: 14800, kd: 18, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/bonus-tax-calculator.html" },
  { keyword: "car payment calculator with interest and trade in", volume: 33100, kd: 21, intent: "Commercial", pillar: "Auto & Personal Loans", targetUrl: "https://finmatrix.cloud/calculators/auto-loan-calculator.html" },
  { keyword: "debt to income ratio calculator for mortgage", volume: 18100, kd: 13, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-to-income-calculator.html" },
  { keyword: "fd interest calculator fixed deposit maturity", volume: 40500, kd: 14, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "6 levers to build wealth faster", volume: 5400, kd: 7, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "the 4 pillars of cash flow allocation", volume: 4200, kd: 6, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/emergency-fund-calculator.html" },
  { keyword: "debt freedom milestone roadmap", volume: 6800, kd: 9, intent: "Informational", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-elimination-planner.html" }
];

const masterKeywords = [];
const uniqueMap = new Set();

for (const kObj of [...coreHighIntent, ...kwCredit, ...kw401k]) {
  const k = kObj.keyword.toLowerCase().trim();
  if (!uniqueMap.has(k) && !k.includes('myusfinance') && !k.includes('nerdwallet') && !k.includes('.com') && !k.includes('.net')) {
    uniqueMap.add(k);
    masterKeywords.push(kObj);
  }
}

console.log(`Loaded ${masterKeywords.length} sanitized master keywords (100% competitor-free).`);

// Node 1 (Cron)
const n1 = wf.nodes.find(n => n.name.includes('Cron') || n.type === 'n8n-nodes-base.scheduleTrigger');
if (n1) {
  n1.name = "Cron: Daily 11 AM & 5 PM (Pinterest Peak Hours)";
  n1.parameters.rule = {
    interval: [
      { field: "cronExpression", expression: "0 11,17 * * *" }
    ]
  };
}

// Node 2 (Fetch Boards Registry)
const n2 = wf.nodes.find(n => n.name.includes('Fetch Boards Registry'));
if (n2) {
  n2.name = "Fetch Boards Registry from Google Sheets";
  n2.parameters.documentId = { __rl: true, value: FINMATRIX_SHEET_ID, mode: "id" };
  n2.parameters.sheetName = { __rl: true, value: "Finmatrix_Pinterest_Boards", mode: "name" };
}

// Node 4 (Fetch Queue History)
const n4 = wf.nodes.find(n => n.name.includes('Fetch Recent Queue History'));
if (n4) {
  n4.name = "Fetch Recent Queue History from Google Sheets";
  n4.parameters.documentId = { __rl: true, value: FINMATRIX_SHEET_ID, mode: "id" };
  n4.parameters.sheetName = { __rl: true, value: "Finmatrix_Pinterest_Queue", mode: "name" };
}

// Node 5 (Pick Next Finmatrix Keyword, Angle & Board)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX COMBINATORIAL GENERATIVE ENGINE
const masterKeywords = ${JSON.stringify(masterKeywords)};

const defaultBoardsRegistry = [
  { BoardID: "BOARD-01", BoardName: "Personal Finance & Wealth Building", PreferredDestinationURL: "https://finmatrix.cloud/calculators/debt-elimination-planner.html", IsActive: true },
  { BoardID: "BOARD-02", BoardName: "Debt Free Journey & Payoff Strategies", PreferredDestinationURL: "https://finmatrix.cloud/calculators/debt-elimination-planner.html", IsActive: true },
  { BoardID: "BOARD-03", BoardName: "Retirement Planning & 401(k) Calculators", PreferredDestinationURL: "https://finmatrix.cloud/calculators/401k-calculator.html", IsActive: true },
  { BoardID: "BOARD-04", BoardName: "Mortgage, Home Loans & Refinance", PreferredDestinationURL: "https://finmatrix.cloud/calculators/home-affordability-calculator.html", IsActive: true },
  { BoardID: "BOARD-05", BoardName: "High-Yield Savings & Compound Interest", PreferredDestinationURL: "https://finmatrix.cloud/calculators/compound-interest-calculator.html", IsActive: true }
];

function mapKeywordToBoard(kw) {
  const k = kw.toLowerCase();
  if (k.includes('debt') || k.includes('credit') || k.includes('payoff') || k.includes('avalanche') || k.includes('snowball')) return "Debt Free Journey & Payoff Strategies";
  if (k.includes('401k') || k.includes('roth') || k.includes('ira') || k.includes('retire') || k.includes('fire')) return "Retirement Planning & 401(k) Calculators";
  if (k.includes('mortgage') || k.includes('home') || k.includes('rent') || k.includes('refinance') || k.includes('house')) return "Mortgage, Home Loans & Refinance";
  if (k.includes('hysa') || k.includes('cd') || k.includes('compound') || k.includes('savings') || k.includes('emergency fund') || k.includes('deposit') || k.includes('drain')) return "High-Yield Savings & Compound Interest";
  return "Personal Finance & Wealth Building";
}

let boardsList = defaultBoardsRegistry;
try {
  const gsheetBoards = $('Consolidate Boards Registry').first().json.boards || [];
  if (gsheetBoards.length > 0) {
    boardsList = defaultBoardsRegistry.map(def => {
      const match = gsheetBoards.find(b => b.BoardName && b.BoardName.toLowerCase() === def.BoardName.toLowerCase());
      return match ? { ...def, ...match } : def;
    });
  }
} catch (e) {}

let pastKeywords = [];
let pastArchetypes = [];
try {
  const recentHistory = $('Fetch Recent Queue History from Google Sheets').all();
  pastKeywords = recentHistory.map(item => (item.json.PrimaryKeyword || item.json.TargetKeyword || '').toLowerCase().trim()).filter(Boolean);
  pastArchetypes = recentHistory.map(item => item.json.PinStyle || item.json.Archetype || '').filter(Boolean);
} catch (e) {}

const recentWindow = pastKeywords.slice(-15);
let availableKeywords = masterKeywords.filter(k => !recentWindow.includes(k.keyword.toLowerCase().trim()));
if (availableKeywords.length === 0) availableKeywords = masterKeywords;

const selectedKwObj = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
const targetKeyword = selectedKwObj.keyword;
const keywordVolume = selectedKwObj.volume || 1000;
const keywordKD = selectedKwObj.kd || 15;
const keywordIntent = selectedKwObj.intent || 'Commercial';
const keywordPillar = selectedKwObj.pillar || 'Personal Finance';

const targetBoardName = mapKeywordToBoard(targetKeyword);
const selectedBoard = boardsList.find(b => b.BoardName === targetBoardName) || boardsList[0];

// Determine Intent Type
let intentType = 'CALCULATOR';
const kwLower = targetKeyword.toLowerCase();
if (kwLower.includes('vs') || kwLower.includes('difference') || kwLower.includes('compare') || kwLower.includes('or')) {
  intentType = 'COMPARE';
} else if (kwLower.includes('roadmap') || kwLower.includes('plan') || kwLower.includes('blueprint') || kwLower.includes('steps') || kwLower.includes('milestone') || kwLower.includes('journey')) {
  intentType = 'ROADMAP';
} else if (kwLower.includes('rule') || kwLower.includes('levers') || kwLower.includes('framework') || kwLower.includes('tips') || kwLower.includes('ways') || kwLower.includes('cheat sheet') || kwLower.includes('hacks') || kwLower.includes('pillars')) {
  intentType = 'FRAMEWORK';
} else if (kwLower.includes('rates') || kwLower.includes('table') || kwLower.includes('matrix') || kwLower.includes('checklist') || kwLower.includes('schedule') || kwLower.includes('audit')) {
  intentType = 'TABLE_CHECKLIST';
}

const archetypeRegistry = {
  CALCULATOR: [
    { id: 'ARCH_LAPTOP_WORKSPACE', name: 'Architectural Daylight Desk Calculator', badge: 'FREE CALCULATOR' },
    { id: 'ARCH_TABLET_MARBLE', name: 'Executive Tablet Wealth Simulator', badge: 'WEALTH SIMULATOR' }
  ],
  COMPARE: [
    { id: 'ARCH_COMP_MATRIX', name: '8-Row Head-to-Head Comparison Matrix', badge: 'STRATEGY COMPARISON' },
    { id: 'ARCH_BEFORE_AFTER', name: 'Quantitative Transformation Switch', badge: 'TRANSFORMATION' }
  ],
  ROADMAP: [
    { id: 'ARCH_ROADMAP_TIMELINE', name: '4-Phase Dense Action Blueprint', badge: 'FINANCIAL BLUEPRINT' }
  ],
  FRAMEWORK: [
    { id: 'ARCH_GRID_6_CARDS', name: '6-Card Wealth Levers Matrix', badge: 'WEALTH LEVERS' }
  ],
  TABLE_CHECKLIST: [
    { id: 'ARCH_TABLE_MATRIX', name: 'Financial Rate Matrix & Action Audit', badge: 'COMPARISON MATRIX' }
  ]
};

const candidates = archetypeRegistry[intentType] || archetypeRegistry.CALCULATOR;
const chosenArch = candidates[Math.floor(Math.random() * candidates.length)];

const pinId = 'FINPIN-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
const destinationBase = selectedBoard.PreferredDestinationURL || selectedKwObj.targetUrl || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';
const utmUrl = destinationBase + '?utm_source=pinterest&utm_medium=social&utm_campaign=' + (selectedBoard.BoardID || 'pin') + '&utm_content=' + pinId;

return [{
  json: {
    pinId: pinId,
    targetKeyword: targetKeyword,
    keywordVolume: keywordVolume,
    keywordKD: keywordKD,
    intentType: intentType,
    keywordIntent: keywordIntent,
    pillar: keywordPillar,
    boardId: selectedBoard.BoardID,
    targetBoard: selectedBoard.BoardName,
    destinationUrl: utmUrl,
    pinStyle: chosenArch.id,
    styleName: chosenArch.name,
    badgeText: chosenArch.badge,
    createdAt: new Date().toISOString()
  }
}];
`;
}

// Node 6 (Gemini API Ideation Prompt - High-Density Mathematical Output)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Generate mathematically accurate data for an ultra-dense, agency-grade Pinterest Infographic (1000x1500 vertical) tailored specifically to this user query:

TARGET SEARCH QUERY:
- Keyword: "\${$json.targetKeyword}" (Vol: \${$json.keywordVolume} | KD: \${$json.keywordKD})
- Search Intent: \${$json.intentType}
- Assigned Archetype: \${$json.pinStyle} (\${$json.styleName})
- Assigned Board: "\${$json.targetBoard}"

STRICT BRAND COMPLIANCE:
1. Brand is strictly "Finmatrix" (https://finmatrix.cloud).
2. NEVER mention any other brand or domain (e.g. MyUSFinance, NerdWallet, Bankrate, SmartAsset, etc.).
3. The tool name must always be "Finmatrix " + Tool Name (e.g. "Finmatrix Amortization Engine", "Finmatrix Cash Depletion Simulator").

DATA REQUIREMENTS TO FILL 1000x1500 WITH ZERO BLANK SPACE:
- scriptTag: (Catchy handwritten badge, e.g. "Free & Easy to Use", "Head-to-Head Comparison", "Step-by-Step Blueprint")
- headlineOnImage: (Punchy 2-4 word uppercase title matching the query)
- subtitleOnImage: (Under 10 words clear educational subtitle)
- calcHeaderTitle: ("Finmatrix " + Specific Tool Name)

IF INTENT IS 'COMPARE':
- sideATitle, sideATag, sideBTitle, sideBTag
- row1Label, row1ValA, row1ValB (e.g. "Annual Contribution Limit", "$7,000 / year", "$23,000 / year")
- row2Label, row2ValA, row2ValB (e.g. "Current Tax Deduction", "No immediate deduction", "Immediate Tax Deduction")
- row3Label, row3ValA, row3ValB (e.g. "Company Employer Match", "None available", "50% - 100% Match")
- row4Label, row4ValA, row4ValB (e.g. "Retirement Withdrawals", "100% TAX-FREE", "Taxed as Ordinary Income")
- row5Label, row5ValA, row5ValB (e.g. "Early Withdrawal Penalty", "Withdraw contributions anytime", "10% IRS Penalty")
- row6Label, row6ValA, row6ValB (e.g. "Required Minimum Distributions", "ZERO RMDs Ever", "Mandatory at Age 73")
- row7Label, row7ValA, row7ValB (e.g. "Optimal Strategy Alignment", "Best if tax bracket is lower now", "Best if peak earning years")
- metricNumA, metricNumB: (e.g. "$1,480,000" vs "$2,140,000")
- verdictText: (1-sentence quantitative rule)

IF INTENT IS 'CALCULATOR':
- input1Label, input1Val, input2Label, input2Val, input3Label, input3Val, input4Label, input4Val
- heroResultLabel: (e.g. "Monthly Payment" or "Estimated Cash Runway")
- heroResultVal: (e.g. "$1,580.74" or "28.4 Months")
- subResult1Val, subResult2Val (e.g. "$569,064", "$319,064")
- check1, check2, check3, check4: (4 key quantitative takeaways)
- takeaway: (1-sentence practical rule for the notebook)

IF INTENT IS 'ROADMAP':
- phase1Title, phase1Amount, phase1Desc, phase1Action1, phase1Action2, phase1Action3
- phase2Title, phase2Amount, phase2Desc, phase2Action1, phase2Action2, phase2Action3
- phase3Title, phase3Amount, phase3Desc, phase3Action1, phase3Action2, phase3Action3
- phase4Title, phase4Amount, phase4Desc, phase4Action1, phase4Action2, phase4Action3
- takeaway: (1-sentence practical rule)

IF INTENT IS 'FRAMEWORK':
- card1Title, card1Badge, card1Desc
- card2Title, card2Badge, card2Desc
- card3Title, card3Badge, card3Desc
- card4Title, card4Badge, card4Desc
- card5Title, card5Badge, card5Desc
- card6Title, card6Badge, card6Desc
- takeaway: (1-sentence practical rule)

IF INTENT IS 'TABLE_CHECKLIST':
- col1, col2, col3, col4
- check1, check2, check3, check4, check5
- summaryCallout: (1-sentence benchmark)

RETURN ONLY VALID JSON wrapped in a single json code block.\`
        }
      ]
    }
  ]
} }}`;
}

// Node 7 (Data Parser with Smart Pillar-Aware Fallbacks)
const n7 = wf.nodes.find(n => n.name.includes('Inspect Asset Status') || n.name.includes('Validate'));
if (n7) {
  n7.parameters.jsCode = `// PARSE & VALIDATE GEMINI DATA WITH PILLAR-AWARE FALLBACKS
let rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
const kw = (prev.targetKeyword || 'Financial Calculator').toLowerCase();
const pillar = (prev.pillar || '').toLowerCase();
const intent = prev.intentType || 'CALCULATOR';

// Smart Default Fallbacks
let dynamicFallbacks = {
  scriptTag: 'Free & Easy to Use',
  headlineOnImage: prev.targetKeyword ? prev.targetKeyword.toUpperCase() : 'AMORTIZATION CALCULATOR',
  subtitleOnImage: 'Calculate Your Monthly Loan Payment & Total Interest',
  calcHeaderTitle: 'Finmatrix Quantitative Engine',
  takeaway: 'Adding an extra $150/mo to principal eliminates over $42,000 in compounding interest.',
  check1: 'Monthly Payment & Balance Amortization',
  check2: 'Total Compounding Interest Calculation',
  check3: 'Principal vs Interest Lifetime Ratio',
  check4: 'Optimized Extra Payment Payoff Acceleration',
  input1Label: 'Loan Amount', input1Val: '$ 250,000',
  input2Label: 'Interest Rate (%)', input2Val: '6.5%',
  input3Label: 'Loan Term', input3Val: '30 Years',
  input4Label: 'Extra Monthly', input4Val: '+$150 / mo',
  heroResultLabel: 'Monthly Payment', heroResultVal: '$1,580.74',
  subResult1Val: '$569,064', subResult2Val: '$319,064',
  sideATitle: 'Roth IRA', sideATag: 'POST-TAX WEALTH',
  sideBTitle: 'Traditional 401(k)', sideBTag: 'PRE-TAX COMPOUNDING',
  row1Label: 'Annual Contribution Limit', row1ValA: '$7,000 / year', row1ValB: '$23,000 / year',
  row2Label: 'Current Tax Deduction', row2ValA: 'No immediate deduction', row2ValB: 'Immediate Tax Deduction',
  row3Label: 'Company Employer Match', row3ValA: 'None available', row3ValB: '50% - 100% Match',
  row4Label: 'Retirement Withdrawals', row4ValA: '100% TAX-FREE', row4ValB: 'Taxed as Ordinary Income',
  row5Label: 'Early Withdrawal Penalty', row5ValA: 'Withdraw contributions anytime', row5ValB: '10% IRS Penalty',
  row6Label: 'Required Minimum Distributions', row6ValA: 'ZERO RMDs Ever', row6ValB: 'Mandatory at Age 73',
  row7Label: 'Optimal Strategy Alignment', row7ValA: 'Best if tax bracket lower now', row7ValB: 'Best if peak earning years',
  metricNumA: '$1,480,000', metricNumB: '$2,140,000',
  verdictText: 'Capture 100% company match first (guaranteed return), then max out Roth IRA for tax diversification.',
  phase1Title: 'Defensive Starter Cushion', phase1Amount: '$1,000 CASH', phase1Desc: 'Stops minor unexpected emergencies from creating high-interest revolving debt.',
  phase1Action1: 'Target: Save in 30 days', phase1Action2: 'Location: Dedicated sub-savings account', phase1Action3: 'Rule: Zero debit card attached',
  phase2Title: 'Baseline Survival Audit', phase2Amount: '1 MONTH BUFFER', phase2Desc: 'Calculate absolute minimum essential survival costs: housing, basic food, and minimum debt.',
  phase2Action1: 'Eliminate recurring subscriptions', phase2Action2: 'Audit last 90 days expenses', phase2Action3: 'Calculate exact daily burn rate',
  phase3Title: 'High-Yield Liquidity Shield', phase3Amount: '3 MONTHS CASH', phase3Desc: 'Transfer liquid reserves into a 5.0% APY High-Yield Savings Account for compound growth.',
  phase3Action1: 'FDIC insured to $250k', phase3Action2: 'Zero maintenance fees', phase3Action3: 'Earns $1,250+/yr on $25,000 cash',
  phase4Title: 'Complete Wealth Fortress', phase4Amount: '6 MONTHS BUFFER', phase4Desc: 'Full cash reserve unlocked. Frees 100% of future cash flow to compound into index funds.',
  phase4Action1: 'Automate monthly index fund sweep', phase4Action2: 'Immunize against job disruptions', phase4Action3: 'Zero debt refinancing required',
  card1Title: '1. APR Avalanche', card1Badge: 'High Impact', card1Desc: 'Target accounts charging >10% APR first to eliminate compounding finance charges immediately.',
  card2Title: '2. HYSA Cash Sweep', card2Badge: '5.0% APY', card2Desc: 'Keep cash reserves earning >4.5% APY instead of 0.01% in traditional checking accounts.',
  card3Title: '3. 100% 401(k) Match', card3Badge: 'Guaranteed', card3Desc: 'Capture your full employer 401(k) match. Instant, guaranteed 100% risk-free return.',
  card4Title: '4. Bi-Weekly Pay', card4Badge: '1 Extra/Yr', card4Desc: 'Make 26 half-payments per year. Automatically pays 1 extra monthly payment yearly.',
  card5Title: '5. Roth IRA Shield', card5Badge: 'Tax-Free', card5Desc: 'Utilize Roth IRA contributions to compound index funds completely tax-free.',
  card6Title: '6. S&P 500 Automation', card6Badge: '10% Avg', card6Desc: 'Automate low-cost index funds. S&P 500 historically doubles money every 7-10 years.',
  col1: 'Account Type', col2: 'APY Rate', col3: 'Liquidity Access', col4: 'Lock Term',
  summaryCallout: 'Keeping $50,000 in HYSA earns $2,550/year in interest vs just $5/year at a traditional brick-and-mortar bank.'
};

// Specialized Retirement Adjustments
if (kw.includes('roth') || kw.includes('401k') || kw.includes('ira') || pillar.includes('retire')) {
  dynamicFallbacks.scriptTag = 'Head-to-Head Comparison';
  dynamicFallbacks.headlineOnImage = 'ROTH IRA VS 401(K)';
  dynamicFallbacks.subtitleOnImage = 'The Mathematical Breakdown of Tax-Advantaged Wealth';
}

// Purge any competitor brand names
rawGemini = rawGemini.replace(/myusfinance(\\.com)?/gi, 'Finmatrix')
                     .replace(/nerdwallet(\\.com)?/gi, 'Finmatrix')
                     .replace(/bankrate(\\.com)?/gi, 'Finmatrix')
                     .replace(/smartasset(\\.com)?/gi, 'Finmatrix');

const fence = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);
let cleanJson = rawGemini.split(fence + 'json').join('').split(fence).join('').trim();
let parsed = {};
try {
  parsed = JSON.parse(cleanJson);
} catch (e) {
  parsed = dynamicFallbacks;
}

let calcHead = (parsed.calcHeaderTitle || dynamicFallbacks.calcHeaderTitle);
calcHead = calcHead.replace(/myusfinance/gi, 'Finmatrix').replace(/calculator/gi, 'Engine');
if (!calcHead.toLowerCase().includes('finmatrix')) calcHead = 'Finmatrix ' + calcHead;

const finalData = { ...prev, ...dynamicFallbacks, ...parsed, calcHeaderTitle: calcHead };
const breakdown = 'Archetype: ' + (finalData.pinStyle || '') + ' | Tool: ' + (finalData.calcHeaderTitle || '') + ' | Headline: ' + (finalData.headlineOnImage || '');

return [{
  json: {
    ...finalData,
    infographicBreakdown: breakdown,
    imageFilename: (prev.pinId || 'PIN') + '_' + (prev.targetKeyword || 'finmatrix').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30) + '.png'
  }
}];
`;
}

// Node 8 (Unified Ultra-Dense Finmatrix Studio Engine)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = `// UNIFIED ULTRA-DENSE AGENCY-GRADE FINMATRIX STUDIO ENGINE
const item = $json;
const headline = item.headlineOnImage || 'FINANCIAL CALCULATOR';
const subtitle = item.subtitleOnImage || 'Calculate Your Numbers & Grow Wealth';
const calcHeader = item.calcHeaderTitle || 'Finmatrix Engine';
const scriptTag = item.scriptTag || 'Free & Easy to Use';
const intent = item.intentType || 'CALCULATOR';

// Dynamic Category Pills based on pillar / search query
function getPills(pillar, kw) {
  const p = (pillar || '').toLowerCase();
  const k = (kw || '').toLowerCase();
  if (p.includes('retire') || k.includes('roth') || k.includes('401k') || k.includes('ira')) {
    return [
      { icon: '🏦', label: '401(k) Match' },
      { icon: '🛡️', label: 'Roth IRA' },
      { icon: '💼', label: 'Trad IRA' },
      { icon: '📈', label: 'Index Funds' },
      { icon: '🏖️', label: 'Early FIRE' }
    ];
  }
  if (p.includes('debt') || k.includes('debt') || k.includes('payoff') || k.includes('credit')) {
    return [
      { icon: '💳', label: 'Credit Card' },
      { icon: '❄️', label: 'Snowball' },
      { icon: '⚡', label: 'Avalanche' },
      { icon: '📉', label: 'APR Slash' },
      { icon: '🏆', label: 'Debt Free' }
    ];
  }
  if (p.includes('mortgage') || k.includes('mortgage') || k.includes('house') || k.includes('home')) {
    return [
      { icon: '🏠', label: 'Mortgage' },
      { icon: '🚗', label: 'Auto Loan' },
      { icon: '💰', label: 'Personal' },
      { icon: '🤝', label: 'Refinance' },
      { icon: '🏢', label: 'Commercial' }
    ];
  }
  return [
    { icon: '💰', label: 'HYSA 5.0%' },
    { icon: '📜', label: '12-Mo CD' },
    { icon: '🛡️', label: 'Emergency' },
    { icon: '💧', label: 'Cash Sweep' },
    { icon: '📈', label: 'S&P 500' }
  ];
}

const pills = getPills(item.pillar, item.targetKeyword);
const pillsHtml = pills.map(p => \`
  <div class="pill-item">
    <div class="pill-icon">\${p.icon}</div>
    <span class="pill-lbl">\${p.label}</span>
  </div>
\`).join('');

let midHtml = '';

// ==========================================
// 1. COMPARE INTENT (8-ROW AGENCY COMPARISON MATRIX)
// ==========================================
if (intent === 'COMPARE') {
  const sideA = item.sideATitle || 'Roth IRA';
  const tagA = item.sideATag || 'POST-TAX WEALTH';
  const sideB = item.sideBTitle || 'Traditional 401(k)';
  const tagB = item.sideBTag || 'PRE-TAX COMPOUNDING';

  midHtml = \`
  <div class="comparison-matrix-wrapper">
    <div class="comp-table-header">
      <div class="col-th-feature">Key Parameter</div>
      <div class="col-th-side">
        <div class="th-title">\${sideA}</div>
        <span class="th-tag-roth">\${tagA}</span>
      </div>
      <div class="col-th-side">
        <div class="th-title">\${sideB}</div>
        <span class="th-tag-401k">\${tagB}</span>
      </div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>💵</span> \${item.row1Label || 'Annual Contribution Limit'}</div>
      <div class="row-val-a"><strong>\${item.row1ValA || '$7,000 / year'}</strong><br><span style="font-size:12px; color:#64748b;">(2026 IRS Cap)</span></div>
      <div class="row-val-b"><strong>\${item.row1ValB || '$23,000 / year'}</strong><br><span class="badge-winner">3.3x Higher Limit</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>📉</span> \${item.row2Label || 'Current Tax Deduction'}</div>
      <div class="row-val-a">\${item.row2ValA || 'No immediate deduction'}<br><span style="font-size:12px; color:#64748b;">(Funded with post-tax $)</span></div>
      <div class="row-val-b">\${item.row2ValB || 'Immediate Tax Deduction'}<br><span class="badge-winner">Lowers W-2 Tax Today</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>💼</span> \${item.row3Label || 'Company Employer Match'}</div>
      <div class="row-val-a">\${item.row3ValA || 'None available'}<br><span style="font-size:12px; color:#64748b;">(Individual account)</span></div>
      <div class="row-val-b">\${item.row3ValB || '50% - 100% Match'}<br><span class="badge-winner">Instant Guaranteed Return</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>🏖️</span> \${item.row4Label || 'Retirement Withdrawals'}</div>
      <div class="row-val-a"><strong>\${item.row4ValA || '100% TAX-FREE'}</strong><br><span class="badge-winner">0% Federal & State Tax</span></div>
      <div class="row-val-b">\${item.row4ValB || 'Taxed as Ordinary Income'}<br><span style="font-size:12px; color:#64748b;">(Subject to future rates)</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>⚡</span> \${item.row5Label || 'Early Withdrawal Penalty'}</div>
      <div class="row-val-a">\${item.row5ValA || 'Withdraw contributions anytime'}<br><span class="badge-highlight-blue">100% Penalty-Free</span></div>
      <div class="row-val-b">\${item.row5ValB || '10% IRS Penalty'}<br><span style="font-size:12px; color:#dc2626;">(Locked until age 59½)</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>📜</span> \${item.row6Label || 'Required Minimum Distributions'}</div>
      <div class="row-val-a"><strong>\${item.row6ValA || 'ZERO RMDs Ever'}</strong><br><span class="badge-winner">Compound Forever</span></div>
      <div class="row-val-b">\${item.row6ValB || 'Mandatory at Age 73'}<br><span style="font-size:12px; color:#64748b;">(Forces taxable withdrawals)</span></div>
    </div>

    <div class="comp-row">
      <div class="row-feature-title"><span>🎯</span> \${item.row7Label || 'Optimal Strategy Alignment'}</div>
      <div class="row-val-a">\${item.row7ValA || 'Best if tax bracket is lower now'}<br><span style="font-size:12px; color:#64748b;">(Younger or growing income)</span></div>
      <div class="row-val-b">\${item.row7ValB || 'Best if peak earning years'}<br><span style="font-size:12px; color:#64748b;">(Slash high marginal rate today)</span></div>
    </div>

    <div class="comp-row row-hero-metric">
      <div class="row-feature-title"><span>🏆</span> Projected Balance (30 Yrs)</div>
      <div class="row-val-a">\${item.metricNumA || '$1,480,000'}<br><span style="font-size:12px; color:#38bdf8; font-weight:700;">100% Net In Pocket</span></div>
      <div class="row-val-b">\${item.metricNumB || '$2,140,000'}<br><span style="font-size:12px; color:#4ade80; font-weight:700;">Pre-Tax ($1.6M After Tax)</span></div>
    </div>
  </div>

  <div class="verdict-rule-box">
    <div class="verdict-icon">💡</div>
    <div>
      <div class="verdict-tag">Finmatrix Quantitative Rule</div>
      <div class="verdict-text">\${item.verdictText || 'Capture 100% company match first (guaranteed return), then max out Roth IRA for tax diversification.'}</div>
    </div>
  </div>\`;
}

// ==========================================
// 2. CALCULATOR INTENT (PHOTOGRAPHIC DESK + MACBOOK WORKSPACE)
// ==========================================
else if (intent === 'CALCULATOR') {
  midHtml = \`
  <div class="workspace-stage">
    <div class="left-sidebar-stack">
      <div class="checklist-card">
        <div class="checklist-title">Know Your Numbers!</div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check1 || 'Monthly Payment'}</span></div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check2 || 'Total Interest Calculation'}</span></div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check3 || 'Compounding Balance Growth'}</span></div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check4 || 'Amortization & Payoff Table'}</span></div>
      </div>

      <div class="spiral-notepad-realistic">
        <div class="spiral-rings">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="np-title">Plan • Protect • Achieve</div>
        <div class="np-quote">"\${item.takeaway || 'Adding an extra $150/mo to principal eliminates over $42,000 in compounding interest.'}"</div>
        <div class="np-sign">Finmatrix :)</div>
      </div>
    </div>

    <div class="macbook-wrapper">
      <div class="macbook-screen-lid">
        <div class="webcam-dot"></div>
        <div class="laptop-display-content">
          <div class="display-app-bar">
            <span class="display-app-title">🧮 \${calcHeader}</span>
            <div class="app-dots"><span></span><span></span><span></span></div>
          </div>
          <div class="calc-grid-inputs">
            <div class="input-cell"><div class="input-cell-lbl">\${item.input1Label || 'Loan Amount'}</div><div class="input-cell-val">\${item.input1Val || '$ 250,000'}</div></div>
            <div class="input-cell"><div class="input-cell-lbl">\${item.input2Label || 'Interest Rate (%)'}</div><div class="input-cell-val">\${item.input2Val || '6.5%'}</div></div>
            <div class="input-cell"><div class="input-cell-lbl">\${item.input3Label || 'Loan Term'}</div><div class="input-cell-val">\${item.input3Val || '30 Years'}</div></div>
            <div class="input-cell"><div class="input-cell-lbl">\${item.input4Label || 'Extra Monthly'}</div><div class="input-cell-val">\${item.input4Val || '+$150 / mo'}</div></div>
          </div>
          <div class="hero-payment-box">
            <div class="hero-payment-lbl">\${item.heroResultLabel || 'Monthly Payment'}</div>
            <div class="hero-payment-val">\${item.heroResultVal || '$1,580.74'}</div>
          </div>
          <div class="sub-summary-row">
            <div>Total Paid: <strong style="color: #0f172a;">\${item.subResult1Val || '$569,064'}</strong></div>
            <div>Interest: <strong style="color: #dc2626;">\${item.subResult2Val || '$319,064'}</strong></div>
          </div>
          <table class="schedule-table-preview">
            <thead><tr><th>Yr</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>
              <tr><td>Yr 1</td><td>$3,980</td><td>$12,236</td><td>$246,019</td></tr>
              <tr><td>Yr 2</td><td>$4,054</td><td>$12,162</td><td>$241,964</td></tr>
              <tr><td>Yr 3</td><td>$4,131</td><td>$12,085</td><td>$237,833</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="macbook-base"><div class="macbook-notch"></div></div>
    </div>
  </div>\`;
}

// ==========================================
// 3. ROADMAP INTENT (4-PHASE ULTRA-DENSE BLUEPRINT)
// ==========================================
else if (intent === 'ROADMAP') {
  midHtml = \`
  <div class="roadmap-stack-wrapper">
    <div class="stage-card-dense">
      <div class="stage-num-box">01</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 1: STARTER DEFENSE</span><span class="stage-amount">\${item.phase1Amount || '$1,000 CASH'}</span></div>
        <div class="stage-title">\${item.phase1Title || 'Defensive Starter Cushion'}</div>
        <div class="stage-desc">\${item.phase1Desc || 'Stops minor unexpected emergencies from creating high-interest revolving debt.'}</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase1Action1 || 'Target: Save in 30 days'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase1Action2 || 'Location: Dedicated sub-savings account'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase1Action3 || 'Rule: Zero debit card attached'}</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">02</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 2: SURVIVAL AUDIT</span><span class="stage-amount">\${item.phase2Amount || '1 MONTH BUFFER'}</span></div>
        <div class="stage-title">\${item.phase2Title || 'Baseline Survival Audit'}</div>
        <div class="stage-desc">\${item.phase2Desc || 'Calculate absolute minimum essential survival costs: housing, basic food, and minimum debt.'}</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase2Action1 || 'Eliminate recurring subscriptions'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase2Action2 || 'Audit last 90 days expenses'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase2Action3 || 'Calculate exact daily burn rate'}</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">03</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 3: HYSA SWEEP</span><span class="stage-amount">\${item.phase3Amount || '3 MONTHS CASH'}</span></div>
        <div class="stage-title">\${item.phase3Title || 'High-Yield Liquidity Shield'}</div>
        <div class="stage-desc">\${item.phase3Desc || 'Transfer liquid reserves into a 5.0% APY High-Yield Savings Account for compound growth.'}</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase3Action1 || 'FDIC insured to $250k'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase3Action2 || 'Zero maintenance fees'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase3Action3 || 'Earns $1,250+/yr on $25,000 cash'}</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">04</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 4: TOTAL FORTRESS</span><span class="stage-amount">\${item.phase4Amount || '6 MONTHS BUFFER'}</span></div>
        <div class="stage-title">\${item.phase4Title || 'Complete Financial Sovereignty'}</div>
        <div class="stage-desc">\${item.phase4Desc || 'Full cash reserve unlocked. Frees 100% of future cash flow to compound into index funds.'}</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase4Action1 || 'Automate monthly index fund sweep'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase4Action2 || 'Immunize against job disruptions'}</div>
          <div class="stage-action-item"><span class="action-check">✓</span> \${item.phase4Action3 || 'Zero debt refinancing required'}</div>
        </div>
      </div>
    </div>

    <div class="verdict-rule-box">
      <div class="verdict-icon">🗺️</div>
      <div>
        <div class="verdict-tag">Finmatrix Blueprint Rule</div>
        <div class="verdict-text">\${item.takeaway || 'Follow the order of operations strictly: Defense first, liquidity second, exponential compounding third.'}</div>
      </div>
    </div>
  </div>\`;
}

// ==========================================
// 4. FRAMEWORK INTENT (6-CARD DENSE GRID)
// ==========================================
else if (intent === 'FRAMEWORK') {
  midHtml = \`
  <div class="framework-grid-wrapper">
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card1Title || '1. APR Avalanche'}</span><span class="fw-badge">\${item.card1Badge || 'High Impact'}</span></div>
      <div class="fw-desc">\${item.card1Desc || 'Target accounts charging >10% APR first to eliminate compounding finance charges immediately.'}</div>
    </div>
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card2Title || '2. HYSA Cash Sweep'}</span><span class="fw-badge">\${item.card2Badge || '5.0% APY'}</span></div>
      <div class="fw-desc">\${item.card2Desc || 'Keep cash reserves earning >4.5% APY instead of 0.01% in traditional checking accounts.'}</div>
    </div>
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card3Title || '3. 100% 401(k) Match'}</span><span class="fw-badge">\${item.card3Badge || 'Guaranteed'}</span></div>
      <div class="fw-desc">\${item.card3Desc || 'Capture your full employer 401(k) match. Instant, guaranteed 100% risk-free return.'}</div>
    </div>
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card4Title || '4. Bi-Weekly Pay'}</span><span class="fw-badge">\${item.card4Badge || '1 Extra/Yr'}</span></div>
      <div class="fw-desc">\${item.card4Desc || 'Make 26 half-payments per year. Automatically pays 1 extra full payment each year.'}</div>
    </div>
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card5Title || '5. Roth IRA Shield'}</span><span class="fw-badge">\${item.card5Badge || 'Tax-Free'}</span></div>
      <div class="fw-desc">\${item.card5Desc || 'Max out Roth IRA contributions to compound diversified index funds completely tax-free.'}</div>
    </div>
    <div class="framework-card">
      <div class="fw-card-head"><span class="fw-title">\${item.card6Title || '6. S&P 500 Automation'}</span><span class="fw-badge">\${item.card6Badge || '10% Avg'}</span></div>
      <div class="fw-desc">\${item.card6Desc || 'Automate low-cost index funds. Historically doubles wealth every 7-10 years.'}</div>
    </div>
  </div>
  <div class="verdict-rule-box">
    <div class="verdict-icon">⚡</div>
    <div>
      <div class="verdict-tag">Finmatrix Master Takeaway</div>
      <div class="verdict-text">\${item.takeaway || 'Automate every step. Systems remove emotional friction and guarantee mathematical execution.'}</div>
    </div>
  </div>\`;
}

// ==========================================
// 5. TABLE MATRIX INTENT
// ==========================================
else {
  midHtml = \`
  <div class="matrix-layout-wrapper">
    <table class="table-full-matrix">
      <thead>
        <tr>
          <th>\${item.col1 || 'Account Type'}</th>
          <th>\${item.col2 || 'APY Rate'}</th>
          <th>\${item.col3 || 'Liquidity Access'}</th>
          <th>\${item.col4 || 'Lock Term'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Traditional Checking</td>
          <td>0.01%</td>
          <td>Instant ATM</td>
          <td>None</td>
        </tr>
        <tr>
          <td>Traditional Savings</td>
          <td>0.05%</td>
          <td>6 Withdrawals/Mo</td>
          <td>None</td>
        </tr>
        <tr class="highlighted-winner-row">
          <td>High-Yield Savings (HYSA) <span class="winner-tag">WINNER</span></td>
          <td>4.50% - 5.10%</td>
          <td>1-2 Day ACH</td>
          <td>Zero Lock</td>
        </tr>
        <tr>
          <td>12-Month CD Ladder</td>
          <td>4.75% - 5.25%</td>
          <td>Locked</td>
          <td>12 Months</td>
        </tr>
      </tbody>
    </table>

    <div class="checklist-card" style="margin-top: 14px;">
      <div class="checklist-title">Actionable Audit Rules</div>
      <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check1 || 'Sweep checking cash balances above 1 month expenses to HYSA.'}</span></div>
      <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check2 || 'Confirm FDIC / NCUA insurance up to $250,000 per depositor.'}</span></div>
      <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">\${item.check3 || 'Avoid accounts charging monthly maintenance or wire fees.'}</span></div>
    </div>

    <div class="verdict-rule-box">
      <div class="verdict-icon">📊</div>
      <div>
        <div class="verdict-tag">Finmatrix Quantitative Benchmark</div>
        <div class="verdict-text">\${item.summaryCallout || 'Keeping $50,000 in HYSA earns $2,550/year in interest vs just $5/year at a traditional brick-and-mortar bank.'}</div>
      </div>
    </div>
  </div>\`;
}

const bgStyle = (intent === 'CALCULATOR')
  ? \`background-image: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 20%, rgba(255,255,255,0.1) 48%, rgba(0,0,0,0.15) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80'); background-size: cover; background-position: center bottom;\`
  : \`background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 28%, #f8fafc 65%, #f1f5f9 100%);\`;

const fullHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1000px;
  height: 1500px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  background: #f8fafc;
}
.pin-wrapper {
  width: 1000px;
  height: 1500px;
  padding: 34px 34px 24px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  \${bgStyle}
}

/* Header */
.top-header { text-align: center; }
.script-tag { font-family: 'Caveat', cursive; font-size: 38px; font-weight: 700; color: #0284c7; margin-bottom: 2px; }
.main-title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.02; color: #0b192c; letter-spacing: -0.5px; text-transform: uppercase; margin-bottom: 8px; }
.highlight-pill { display: inline-block; background: #facc15; color: #0f172a; padding: 8px 30px; border-radius: 999px; font-size: 22px; font-weight: 800; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.4); margin-bottom: 12px; }
.pillar-pills-row { display: flex; justify-content: center; align-items: center; gap: 20px; }
.pill-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pill-icon { width: 50px; height: 50px; border-radius: 50%; background: #ffffff; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 23px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
.pill-lbl { font-size: 12.5px; font-weight: 800; color: #334155; }

/* Middle Stage */
.mid-stage { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }

/* Comparison Matrix */
.comparison-matrix-wrapper { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: hidden; }
.comp-table-header { display: grid; grid-template-columns: 220px 1fr 1fr; background: #0f172a; color: #ffffff; padding: 16px 20px; align-items: center; }
.col-th-feature { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
.col-th-side { text-align: center; }
.th-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; line-height: 1.1; }
.th-tag-roth { display: inline-block; background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 4px; margin-top: 4px; letter-spacing: 0.5px; }
.th-tag-401k { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 4px; margin-top: 4px; letter-spacing: 0.5px; }
.comp-row { display: grid; grid-template-columns: 220px 1fr 1fr; padding: 14px 20px; align-items: center; border-bottom: 1px solid #f1f5f9; }
.comp-row:nth-child(even) { background: #f8fafc; }
.row-feature-title { font-size: 15px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.row-val-a { padding: 0 16px; text-align: center; font-size: 15.5px; font-weight: 700; color: #0369a1; line-height: 1.35; }
.row-val-b { padding: 0 16px; text-align: center; font-size: 15.5px; font-weight: 700; color: #15803d; line-height: 1.35; }
.badge-winner { background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 4px; }
.badge-highlight-blue { background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 4px; }
.row-hero-metric { background: #0b192c !important; color: #ffffff; padding: 16px 20px; }
.row-hero-metric .row-feature-title { color: #facc15; font-size: 16px; }
.row-hero-metric .row-val-a { color: #38bdf8; font-size: 26px; font-weight: 900; font-family: 'Outfit', sans-serif; }
.row-hero-metric .row-val-b { color: #4ade80; font-size: 26px; font-weight: 900; font-family: 'Outfit', sans-serif; }

/* Calculator Desk Workspace */
.workspace-stage { display: flex; justify-content: space-between; align-items: flex-end; height: 1000px; position: relative; }
.left-sidebar-stack { width: 310px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; z-index: 2; }
.checklist-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 18px; padding: 22px 18px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08); }
.checklist-title { font-family: 'Caveat', cursive; font-size: 34px; font-weight: 700; color: #0284c7; margin-bottom: 16px; line-height: 1; }
.checklist-item { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.check-circle { width: 26px; height: 26px; border-radius: 50%; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4); }
.check-label { font-size: 17px; font-weight: 800; color: #0f172a; }
.spiral-notepad-realistic { background: #fffef8; border: 1px solid #e7ddc4; border-radius: 16px; padding: 24px 20px 20px 20px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12); transform: rotate(-2deg); border-left: 8px solid #d4c39c; position: relative; }
.spiral-rings { position: absolute; top: -12px; left: 20px; right: 20px; display: flex; justify-content: space-around; }
.spiral-rings span { width: 8px; height: 22px; background: #94a3b8; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.np-title { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; color: #0284c7; margin-bottom: 8px; }
.np-quote { font-size: 15px; font-weight: 700; color: #475569; line-height: 1.45; }
.np-sign { font-family: 'Caveat', cursive; font-size: 24px; color: #10b981; font-weight: 700; margin-top: 8px; text-align: right; }
.macbook-wrapper { width: 610px; display: flex; flex-direction: column; align-items: center; z-index: 2; }
.macbook-screen-lid { width: 100%; background: #0f172a; border: 3px solid #334155; border-radius: 18px 18px 0 0; padding: 12px 12px 8px 12px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.28); }
.webcam-dot { width: 6px; height: 6px; background: #334155; border-radius: 50%; margin: 0 auto 8px auto; }
.laptop-display-content { background: #ffffff; border-radius: 8px; padding: 18px; color: #0f172a; }
.display-app-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; margin-bottom: 12px; }
.display-app-title { font-size: 15px; font-weight: 900; color: #0b192c; display: flex; align-items: gap: 6px; }
.app-dots span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; margin-left: 4px; }
.calc-grid-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.input-cell { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
.input-cell-lbl { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.input-cell-val { font-size: 17px; font-weight: 800; color: #0f172a; }
.hero-payment-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px; }
.hero-payment-lbl { font-size: 12px; font-weight: 800; color: #15803d; text-transform: uppercase; }
.hero-payment-val { font-size: 38px; font-weight: 900; color: #166534; line-height: 1.05; }
.sub-summary-row { display: flex; justify-content: space-around; background: #f8fafc; border-radius: 8px; padding: 10px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #475569; }
.schedule-table-preview { width: 100%; font-size: 12px; border-collapse: collapse; }
.schedule-table-preview th { text-align: left; padding: 6px 10px; background: #f1f5f9; color: #475569; font-weight: 800; border-radius: 4px; }
.schedule-table-preview td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #1e293b; }
.macbook-base { width: 105%; height: 14px; background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%); border-radius: 0 0 16px 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); position: relative; }
.macbook-notch { width: 80px; height: 6px; background: #475569; border-radius: 0 0 6px 6px; margin: 0 auto; }

/* Roadmap Ultra-Dense */
.roadmap-stack-wrapper { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; }
.stage-card-dense { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 22px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: flex; gap: 22px; border-left: 8px solid #0284c7; }
.stage-num-box { width: 68px; height: 68px; border-radius: 16px; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; flex-shrink: 0; box-shadow: 0 6px 16px rgba(15,23,42,0.3); }
.stage-info { flex: 1; }
.stage-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.stage-badge { font-size: 13px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
.stage-amount { font-size: 18px; font-weight: 900; color: #10b981; background: #dcfce7; padding: 4px 12px; border-radius: 6px; }
.stage-title { font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
.stage-desc { font-size: 15px; font-weight: 600; color: #475569; line-height: 1.45; margin-bottom: 8px; }
.stage-action-row { display: flex; gap: 20px; font-size: 13.5px; font-weight: 700; color: #1e293b; }
.stage-action-item { display: flex; align-items: center; gap: 6px; }
.action-check { color: #10b981; font-weight: 900; }

/* Framework Grid */
.framework-grid-wrapper { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 16px; height: 840px; }
.framework-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 18px; box-shadow: 0 8px 22px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; border-top: 6px solid #0284c7; }
.fw-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.fw-title { font-size: 18px; font-weight: 800; color: #0f172a; }
.fw-badge { background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 6px; }
.fw-desc { font-size: 14px; font-weight: 600; color: #64748b; line-height: 1.45; }

/* Table Matrix */
.matrix-layout-wrapper { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; }
.table-full-matrix { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); background: #ffffff; border: 1px solid #e2e8f0; }
.table-full-matrix th { background: #0f172a; color: #ffffff; padding: 16px 18px; font-size: 14px; font-weight: 800; text-align: left; letter-spacing: 0.5px; }
.table-full-matrix td { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14.5px; font-weight: 600; color: #334155; }
.highlighted-winner-row td { background: #f0fdf4; color: #166534; font-weight: 800; border-top: 2px solid #86efac; border-bottom: 2px solid #86efac; }
.winner-tag { background: #10b981; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; margin-left: 6px; }

/* Verdict Box & Footer */
.verdict-rule-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 16px 22px; display: flex; align-items: center; gap: 16px; color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.12); border: 1px solid #334155; }
.verdict-icon { font-size: 38px; flex-shrink: 0; }
.verdict-tag { font-size: 12px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.5px; }
.verdict-text { font-size: 15.5px; font-weight: 600; color: #f8fafc; line-height: 1.4; }
.bottom-banner { height: 120px; background: #070e1c; border-radius: 16px; padding: 16px 26px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 15px 35px rgba(0,0,0,0.3); border: 1px solid #1e293b; z-index: 2; }
.brand-info { display: flex; align-items: center; gap: 14px; }
.brand-logo { width: 48px; height: 48px; background: #1e293b; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.brand-title { font-family: 'Outfit', sans-serif; font-size: 25px; font-weight: 900; color: #ffffff; }
.brand-sub { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
.cta-button { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 15px; font-weight: 800; padding: 14px 24px; border-radius: 10px; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4); }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="top-header">
    <div class="script-tag">\${scriptTag}</div>
    <h1 class="main-title">\${headline}</h1>
    <div class="highlight-pill">\${subtitle}</div>
    <div class="pillar-pills-row">\${pillsHtml}</div>
  </div>

  <div class="mid-stage">
    \${midHtml}
  </div>

  <div class="bottom-banner">
    <div class="brand-info">
      <div class="brand-logo">🧮</div>
      <div>
        <div class="brand-title">Finmatrix.cloud</div>
        <div class="brand-sub">Simple • Fast • Accurate</div>
      </div>
    </div>
    <div class="cta-button">Visit Site &amp; Calculate →</div>
  </div>
</div>
</body>
</html>\`;

return [{
  json: {
    ...item,
    pinHtml: fullHtml
  }
}];
`;
}

// Node 9 (Render Pin Image on VPS)
const n9 = wf.nodes.find(n => n.name.includes('Render Pin Image'));
if (n9) {
  n9.parameters.url = "http://31.97.232.154:3000/render";
  n9.parameters.jsonBody = "={{ { html: $json.pinHtml } }}";
}

// Node 13 (Attach Rendered Image URL) - Synchronized reference
const n13 = wf.nodes.find(n => n.name.includes('Attach Rendered Image URL'));
if (n13) {
  n13.parameters.jsCode = `const prev = $('Configure & Generate Pin Image (Finmatrix Studio Engine)').item.json;
const base = $json.url || '';
if (!base) throw new Error('Render failed: no url returned');
const { pinHtml, ...rest } = prev;
const imageUrl = (base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg')) ? base : base + '.png';
return { json: { ...rest, imageUrl, shortImageUrl: imageUrl, imageRenderedAt: new Date().toISOString() } };
`;
}

// Node 14 (Parse & Format Pin Data)
const n14 = wf.nodes.find(n => n.name.includes('Parse & Format Pin Data'));
if (n14) {
  n14.parameters.jsCode = `// FORMAT PIN DATA FOR PINTEREST WITH 450-CHAR CEILING & CLEAN COPY
const prev = $json;
const destUrl = prev.destinationUrl || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';
const rawGemini = (prev.pinCopyRaw || '').trim();

let parsed = {};
try {
  const fence = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);
  const cleanJson = rawGemini.split(fence + 'json').join('').split(fence).join('').trim();
  parsed = JSON.parse(cleanJson);
} catch (e) {
  parsed = {};
}

let pinTitle = (parsed.title || (prev.headlineOnImage || prev.targetKeyword || 'Financial Calculator') + ' | Finmatrix').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
pinTitle = pinTitle.replace(/myusfinance(\\.com)?/gi, 'Finmatrix');
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

let hook = (parsed.hook || ('Discover the exact numbers for ' + (prev.targetKeyword || 'finances') + ' on Finmatrix.')).replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
hook = hook.replace(/myusfinance(\\.com)?/gi, 'Finmatrix').slice(0, 115);

let b1 = (parsed.bullet1 || 'Deploy quantitative rules to halt compounding finance charges.').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
b1 = b1.replace(/myusfinance(\\.com)?/gi, 'Finmatrix').slice(0, 65);

let b2 = (parsed.bullet2 || 'Calculate payoff dates and investment growth in real time.').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
b2 = b2.replace(/myusfinance(\\.com)?/gi, 'Finmatrix').slice(0, 65);

const ctaLine = '👉 Free Tool & Toolkit: ' + destUrl;
const hashtags = '#personalfinance #financialfreedom #debtfree #moneytips #finmatrix';
const pinDescription = hook + '\\n\\n• ' + b1 + '\\n• ' + b2 + '\\n\\n' + ctaLine + '\\n\\n' + hashtags;

let altText = (parsed.altText || ('Infographic showing Finmatrix ' + (prev.headlineOnImage || 'financial calculator'))).replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
altText = altText.replace(/myusfinance(\\.com)?/gi, 'Finmatrix');
if (altText.length > 100) altText = altText.substring(0, 97) + '...';

const taggedTopics = ['Personal Finance', 'Debt Free', 'Investing', 'Saving Money', 'Money Tips'];

return [{
  json: {
    ...prev,
    pinTitle: pinTitle,
    pinDescription: pinDescription,
    altText: altText,
    taggedTopics: taggedTopics,
    taggedTopicsText: taggedTopics.join(', '),
    hashtags: hashtags,
    status: 'Ready to Pin'
  }
}];
`;
}

// Node 15 (Log to Google Sheets)
const n15 = wf.nodes.find(n => n.name.includes('Log 25-Column Audit'));
if (n15) {
  n15.parameters.documentId = { __rl: true, value: FINMATRIX_SHEET_ID, mode: "id" };
  n15.parameters.sheetName = { __rl: true, value: "Finmatrix_Pinterest_Queue", mode: "name" };
}

// Node 16 (Brevo Email Preview)
const n16 = wf.nodes.find(n => n.name.includes('Send Action Kit Email'));
if (n16) {
  n16.parameters.headerParameters.parameters = [
    { name: "api-key", value: "YOUR_BREVO_API_KEY" },
    { name: "Content-Type", value: "application/json" },
    { name: "X-Mailin-Tag", value: "finmatrix-internal-briefing" },
    { name: "X-Priority", value: "1" },
    { name: "X-Auto-Response-Suppress", value: "All" }
  ];
  n16.parameters.jsonBody = `={{ JSON.stringify({
  sender: {
    name: "Finmatrix Research Desk",
    email: "rakeshcfp@gmail.com"
  },
  to: [
    {
      email: "rakeshcfp@gmail.com",
      name: "Rakesh Kumar"
    }
  ],
  subject: "Finmatrix Daily Pin Briefing: " + ($json.targetKeyword || 'Personal Finance') + " (" + ($json.pinId || '') + ")",
  htmlContent: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Finmatrix Pin Briefing</title></head><body style='margin: 0; padding: 16px; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' align='center' style='max-width: 860px; margin: 0 auto; background: #07090e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;'><tr><td style='padding: 24px 28px; background: linear-gradient(180deg, #0f172a 0%, #07090e 100%); border-bottom: 1px solid #1e293b;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td><span style='background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 1px; display: inline-block;'>📌 FINMATRIX PINTEREST BRIEFING</span> <span style='color: #10b981; font-size: 12px; font-weight: 700; margin-left: 10px;'>" + ($json.targetBoard || 'Board') + "</span><h1 style='color: #ffffff; font-size: 20px; font-weight: 800; margin: 12px 0 4px 0; line-height: 1.3;'>" + ($json.pinTitle || 'New Pin Ready') + "</h1><p style='color: #94a3b8; font-size: 13px; margin: 0;'>Target Query: <strong style='color: #38bdf8;'>" + ($json.targetKeyword || 'Keyword') + "</strong> (KD: " + ($json.keywordKD || '0') + "% | Vol: " + ($json.keywordVolume || '0') + "/mo) &bull; Layout: <strong style='color: #f59e0b;'>" + ($json.styleName || 'Style') + "</strong></p></td></tr></table></td></tr><tr><td style='padding: 24px 28px;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td width='320' valign='top' style='padding-right: 24px;'><div style='border: 1px solid #334155; border-radius: 12px; overflow: hidden; background: #000000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);'><a href='" + ($json.imageUrl || '#') + "' target='_blank' style='display: block; text-decoration: none;'><img src='" + ($json.imageUrl || '#') + "' alt='Pin Preview' width='320' style='width: 100%; height: auto; display: block;' /></a></div><div style='margin-top: 14px;'><a href='" + ($json.imageUrl || '#') + "' target='_blank' download style='display: block; background: #059669; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(5,150,105,0.4);'>📥 Download High-Res Graphic (1000x1500)</a><a href='https://www.pinterest.com/pin-creation-tool/' target='_blank' style='display: block; background: #e60023; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px;'>📌 Open Pinterest Pin Builder</a></div></td><td valign='top'><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>1. Pin Title (Max 90 chars)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 14px; color: #f1f5f9; font-weight: 600;'>" + ($json.pinTitle || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>2. Destination URL (With Tracking UTMs)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 12px; color: #38bdf8; word-break: break-all;'><a href='" + ($json.destinationUrl || '#') + "' target='_blank' style='color: #38bdf8; text-decoration: none;'>" + ($json.destinationUrl || '') + "</a></div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>3. Pin Description (Under 500 chars &bull; Includes Bullets & Guaranteed Hashtags)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 13px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap;'>" + ($json.pinDescription || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>4. Alt Text</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #94a3b8;'>" + ($json.altText || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>5. Target Board</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #10b981; font-weight: 700;'>" + ($json.targetBoard || '') + "</div></div></td></tr></table></td></tr><tr><td style='padding: 16px 28px; background: #0b0f19; border-top: 1px solid #1e293b; text-align: center;'><p style='color: #475569; font-size: 12px; margin: 0;'>Finmatrix Cloud &bull; Automated Marketing Engine &bull; Generated at " + ($json.createdAt || '') + "</p></td></tr></table></body></html>"
}) }}`;
}

// Global pass: replace any references across all node parameters
for (const node of wf.nodes) {
  if (node.parameters && typeof node.parameters.jsCode === 'string') {
    node.parameters.jsCode = node.parameters.jsCode
      .split('Configure & Generate Pin Image (Dynamic Photo CDN Engine)')
      .join('Configure & Generate Pin Image (Finmatrix Studio Engine)')
      .split('Pick Next Pinterest Ebook Angle & Board')
      .join('Pick Next Finmatrix Keyword, Angle & Board');
  }
}

// Clean connections
if (wf.connections['Pick Next Pinterest Ebook Angle & Board']) {
  wf.connections['Pick Next Finmatrix Keyword, Angle & Board'] = wf.connections['Pick Next Pinterest Ebook Angle & Board'];
  delete wf.connections['Pick Next Pinterest Ebook Angle & Board'];
}
if (wf.connections['Configure & Generate Pin Image (Dynamic Photo CDN Engine)']) {
  wf.connections['Configure & Generate Pin Image (Finmatrix Studio Engine)'] = wf.connections['Configure & Generate Pin Image (Dynamic Photo CDN Engine)'];
  delete wf.connections['Configure & Generate Pin Image (Dynamic Photo CDN Engine)'];
}

for (const [src, conns] of Object.entries(wf.connections)) {
  for (const list of conns.main || []) {
    for (const target of list) {
      if (target.node === 'Pick Next Pinterest Ebook Angle & Board') {
        target.node = 'Pick Next Finmatrix Keyword, Angle & Board';
      }
      if (target.node === 'Configure & Generate Pin Image (Dynamic Photo CDN Engine)') {
        target.node = 'Configure & Generate Pin Image (Finmatrix Studio Engine)';
      }
    }
  }
}

// Save output workflow file
const outPath = 'workflows/finmatrix-pinterest-marketing-automation.json';
let jsonStr = JSON.stringify(wf, null, 2);
// Sanitize all API keys
jsonStr = jsonStr.replace(/key=AQ\.[a-zA-Z0-9_\-]+/g, 'key=YOUR_GEMINI_API_KEY');
jsonStr = jsonStr.replace(/xkeysib-[a-zA-Z0-9_\-]+/g, 'YOUR_BREVO_API_KEY');

fs.writeFileSync(outPath, jsonStr, 'utf8');
console.log('SUCCESS: Written ultra-dense, agency-grade studio workflow (fully sanitized) to', outPath);
