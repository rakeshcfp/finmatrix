import fs from 'fs';

// 1. Read source workflow to preserve node graph, IDs, credentials, and coordinates
const sourcePath = 'C:\\Users\\Rakesh\\.gemini\\antigravity\\brain\\0b073859-daa6-48de-a2bb-926d79f02937\\.user_uploaded\\media_1794424387069_bf7bb5a5.json';
const wf = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Finmatrix Master Sheet ID
const FINMATRIX_SHEET_ID = "1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k";

// Ingest SEMrush keyword CSVs with strict competitor sanitization
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

    // Purge competitor domain names and brands
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

// Node 1 (Schedule Trigger)
const n1 = wf.nodes.find(n => n.name.includes('Cron') || n.type === 'n8n-nodes-base.scheduleTrigger');
if (n1) {
  n1.name = "Cron: Daily 11 AM & 5 PM (Pinterest Peak Hours)";
  n1.parameters.rule = {
    interval: [
      { field: "cronExpression", expression: "0 11,17 * * *" }
    ]
  };
}

// Node 2 (Fetch Boards Registry from Google Sheets)
const n2 = wf.nodes.find(n => n.name.includes('Fetch Boards Registry'));
if (n2) {
  n2.parameters.documentId.value = FINMATRIX_SHEET_ID;
  n2.parameters.sheetName.value = "Finmatrix_Pinterest_Boards";
}

// Node 4 (Fetch Recent Queue History from Google Sheets)
const n4 = wf.nodes.find(n => n.name.includes('Fetch Recent Queue History'));
if (n4) {
  n4.parameters.documentId.value = FINMATRIX_SHEET_ID;
  n4.parameters.sheetName.value = "Finmatrix_Pinterest_Queue";
}

// Node 5 (Pick Next Keyword, Angle, Board & Combinatorial 16-Archetype Engine)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX COMBINATORIAL GENERATIVE ENGINE (16 ARCHETYPES x 8 PALETTES)
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
  if (k.includes('hysa') || k.includes('cd') || k.includes('compound') || k.includes('savings') || k.includes('emergency fund') || k.includes('deposit')) return "High-Yield Savings & Compound Interest";
  return "Personal Finance & Wealth Building";
}

let boardsList = defaultBoardsRegistry;
try {
  const gsheetBoards = $('Consolidate Boards Registry').first().json.boards || [];
  if (gsheetBoards.length > 0) {
    boardsList = defaultBoardsRegistry.map(def => {
      const match = gsheetBoards.find(b => b.BoardName && b.BoardName.toLowerCase() === def.BoardName.toLowerCase());
      if (match) {
        return {
          ...def,
          BoardID: match.BoardID || def.BoardID,
          PreferredDestinationURL: match.PreferredDestinationURL || def.PreferredDestinationURL,
          IsActive: match.IsActive === 'false' || match.IsActive === false ? false : true
        };
      }
      return def;
    }).filter(b => b.IsActive !== false);
  }
} catch (e) {
  boardsList = defaultBoardsRegistry;
}

let pastRows = [];
try {
  pastRows = $('Fetch Recent Queue History from Google Sheets').all().map(i => i.json);
} catch (e) {
  pastRows = [];
}

const pastKeywords = pastRows.slice(-60).map(r => (r.TargetKeyword || r.Keyword || r.Topic || '').toLowerCase().trim()).filter(Boolean);
const pastArchetypes = pastRows.slice(-10).map(r => r.PinStyle || r.pinStyle).filter(Boolean);

let availableKeywords = masterKeywords.filter(k => !pastKeywords.includes(k.keyword.toLowerCase().trim()));
if (availableKeywords.length === 0) availableKeywords = [...masterKeywords];

availableKeywords.sort((a, b) => (a.kd - b.kd) || (b.volume - a.volume));
const candidatePool = availableKeywords.slice(0, Math.min(5, availableKeywords.length));
const selectedKwObj = candidatePool[Math.floor(Math.random() * candidatePool.length)] || availableKeywords[0];

const targetKeyword = selectedKwObj.keyword;
const keywordVolume = selectedKwObj.volume || 1200;
const keywordKD = selectedKwObj.kd || 12;
const keywordIntent = selectedKwObj.intent || 'Commercial';
const keywordPillar = selectedKwObj.pillar || 'Debt & Credit Payoff';

const mappedBoardName = mapKeywordToBoard(targetKeyword);
let selectedBoard = boardsList.find(b => b.BoardName.toLowerCase() === mappedBoardName.toLowerCase()) || boardsList[0];

// DETECT SEARCH INTENT
const kwLower = targetKeyword.toLowerCase();
let intentType = 'CALCULATOR';

if (kwLower.includes(' vs ') || kwLower.includes('versus') || kwLower.includes(' or ') || kwLower.includes('difference between') || kwLower.includes('compare')) {
  intentType = 'COMPARE';
} else if (kwLower.includes('blueprint') || kwLower.includes('steps') || kwLower.includes('roadmap') || kwLower.includes('timeline') || kwLower.includes('phases') || kwLower.includes('how to build') || kwLower.includes('emergency fund') || kwLower.includes('freedom milestone')) {
  intentType = 'ROADMAP';
} else if (kwLower.includes('rule') || kwLower.includes('levers') || kwLower.includes('framework') || kwLower.includes('tips') || kwLower.includes('ways') || kwLower.includes('cheat sheet') || kwLower.includes('hacks') || kwLower.includes('pillars')) {
  intentType = 'FRAMEWORK';
} else if (kwLower.includes('rates') || kwLower.includes('table') || kwLower.includes('matrix') || kwLower.includes('checklist') || kwLower.includes('schedule') || kwLower.includes('audit')) {
  intentType = 'TABLE_CHECKLIST';
}

// 16 FULL ARCHETYPES ACROSS THE 5 INTENTS
const archetypeRegistry = {
  CALCULATOR: [
    { id: 'ARCH_LAPTOP_WORKSPACE', name: 'Bright Laptop Workspace Pin', badge: 'FREE CALCULATOR' },
    { id: 'ARCH_TABLET_MARBLE', name: 'Luxury Marble Tablet Simulator', badge: 'WEALTH SIMULATOR' },
    { id: 'ARCH_MOBILE_APP', name: 'Floating Mobile Payoff App', badge: 'INTERACTIVE TOOL' },
    { id: 'ARCH_BENTO_METRICS', name: 'Asymmetric Bento Metrics Grid', badge: 'FINANCIAL ENGINE' }
  ],
  COMPARE: [
    { id: 'ARCH_COMP_SPLIT', name: 'Dual-Column High-Contrast Split Comparison', badge: 'STRATEGY COMPARISON' },
    { id: 'ARCH_COMP_CARDS', name: 'Side-by-Side Strategy Cards', badge: 'HEAD-TO-HEAD' },
    { id: 'ARCH_BEFORE_AFTER', name: 'Before vs After Debt Transformation', badge: 'TRANSFORMATION' }
  ],
  ROADMAP: [
    { id: 'ARCH_ROADMAP_TIMELINE', name: '4-Phase Stepped Financial Roadmap', badge: 'FINANCIAL BLUEPRINT' },
    { id: 'ARCH_ROADMAP_STAIRS', name: 'Ascending Wealth Milestone Ladder', badge: 'STEP-BY-STEP' },
    { id: 'ARCH_ROADMAP_CHEVRON', name: '4-Stage Process Chevron Journey', badge: 'ACTION ROADMAP' }
  ],
  FRAMEWORK: [
    { id: 'ARCH_GRID_6_CARDS', name: '6-Card Editorial Cheat Sheet Grid', badge: 'WEALTH LEVERS' },
    { id: 'ARCH_GRID_4_PILLARS', name: '4-Pillar Financial Allocation Matrix', badge: 'FINANCIAL FRAMEWORK' },
    { id: 'ARCH_NUMBERED_LIST', name: 'High-Impact Master Rule Checklist', badge: 'EDITORIAL CHEAT SHEET' }
  ],
  TABLE_CHECKLIST: [
    { id: 'ARCH_TABLE_MATRIX', name: 'SaaS Financial Rate Comparison Matrix', badge: 'COMPARISON MATRIX' },
    { id: 'ARCH_CHECKLIST_GATE', name: '5-Point Financial Action Checklist', badge: 'ACTION CHECKLIST' },
    { id: 'ARCH_SCHEDULE_BARS', name: 'Milestone Progress Payoff Tracker', badge: 'SCHEDULE AUDIT' }
  ]
};

const candidates = archetypeRegistry[intentType] || archetypeRegistry.CALCULATOR;
const last5Archs = pastArchetypes.slice(-5);
const filteredCandidates = candidates.filter(c => !last5Archs.includes(c.id));
const chosenArch = (filteredCandidates.length > 0) ? filteredCandidates[Math.floor(Math.random() * filteredCandidates.length)] : candidates[Math.floor(Math.random() * candidates.length)];

// 8 DYNAMIC COLOR PALETTES
const palettes = [
  'PALETTE_DAYLIGHT_DESK',
  'PALETTE_EMERALD_WEALTH',
  'PALETTE_ROYAL_NAVY_GOLD',
  'PALETTE_WARM_EDITORIAL',
  'PALETTE_CARBON_SLATE',
  'PALETTE_MIDNIGHT_AMETHYST',
  'PALETTE_PACIFIC_TEAL',
  'PALETTE_HIGH_CONTRAST_STUDIO'
];
const chosenPalette = palettes[Math.floor(Math.random() * palettes.length)];

const now = new Date();
const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
const pinId = 'FINPIN-' + dateCode + '-' + randSuffix;

const destBaseUrl = selectedKwObj.targetUrl || selectedBoard.PreferredDestinationURL || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';
const utmCamp = 'pin_' + (selectedKwObj.pillar || 'fin').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 15);
const destinationWithUtm = destBaseUrl + '?utm_source=pinterest&utm_medium=organic&utm_campaign=' + utmCamp + '&utm_content=' + pinId;

return [{
  json: {
    pinId: pinId,
    targetKeyword: targetKeyword,
    keywordVolume: keywordVolume,
    keywordKD: keywordKD,
    keywordIntent: keywordIntent,
    topic: targetKeyword,
    boardId: selectedBoard.BoardID || 'BOARD-01',
    targetBoard: selectedBoard.BoardName,
    boardUrl: selectedBoard.BoardURL || 'https://www.pinterest.com/pin-creation-tool/',
    boardDescription: selectedBoard.BoardDescription || '',
    primaryKeyword: targetKeyword,
    secondaryKeywords: 'personal finance, financial calculators, money tips, debt free',
    targetAudience: 'Savers, investors, and debt-free planners',
    pillar: keywordPillar,
    pillarId: 'KD-' + keywordKD,
    contentPillar: 'SEO Search Query: ' + targetKeyword,
    intentType: intentType,
    pinStyle: chosenArch.id,
    styleName: chosenArch.name,
    styleBadge: chosenArch.badge,
    paletteTheme: chosenPalette,
    destinationUrl: destinationWithUtm,
    baseDestinationUrl: destBaseUrl,
    utmCampaign: utmCamp,
    brand: 'Finmatrix Cloud',
    product: 'Free Financial Calculators & Excel Toolkits (finmatrix.cloud)',
    author: 'Finmatrix Quantitative Research Desk',
    createdAt: now.toISOString()
  }
}];
`;
}

// Node 6 (Gemini API Ideation Prompt - COMPREHENSIVE 16-ARCHETYPE SCHEMA)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Generate mathematically accurate data for a high-converting Pinterest Infographic (1000x1500 vertical) tailored specifically to this user query:

TARGET SEARCH QUERY:
- Keyword: "\${$json.targetKeyword}" (Vol: \${$json.keywordVolume} | KD: \${$json.keywordKD})
- Search Intent: \${$json.intentType}
- Assigned Layout Archetype: \${$json.pinStyle} (\${$json.styleName})
- Assigned Board: "\${$json.targetBoard}"

STRICT BRAND COMPLIANCE:
1. The brand is strictly "Finmatrix" (https://finmatrix.cloud).
2. NEVER mention any other brand or website (e.g. MyUSFinance, NerdWallet, Bankrate, etc.).
3. The tool name must always be "Finmatrix " + Tool Name (e.g. "Finmatrix Amortization Engine", "Finmatrix Debt Eliminator").

DATA TO GENERATE BASED ON ARCHETYPE:
- headlineOnImage: (Punchy 2-4 word uppercase title)
- subtitleOnImage: (Under 10 words clear educational subtitle)
- calcHeaderTitle: ("Finmatrix " + Specific Tool Name)

IF INTENT IS 'COMPARE' (\${$json.pinStyle}):
- sideATitle, sideATag, sideBTitle, sideBTag
- point1A, point1B, point2A, point2B, point3A, point3B
- metricNumA, metricNumB: (e.g. "$12,480" vs "$4,120")
- verdictText: (1-sentence quantitative summary showing which method wins)

IF INTENT IS 'ROADMAP' (\${$json.pinStyle}):
- phase1Title, phase1Amount, phase1Desc
- phase2Title, phase2Amount, phase2Desc
- phase3Title, phase3Amount, phase3Desc
- phase4Title, phase4Amount, phase4Desc

IF INTENT IS 'FRAMEWORK' (\${$json.pinStyle}):
- card1Title, card1Desc, card2Title, card2Desc, card3Title, card3Desc
- card4Title, card4Desc, card5Title, card5Desc, card6Title, card6Desc
- pct1: "50%", pct2: "20%", pct3: "15%", pct4: "15%" (if pillars)
- takeaway: (1-sentence practical math rule)

IF INTENT IS 'TABLE_CHECKLIST' (\${$json.pinStyle}):
- col1, col2, col3, col4: (Table column headers)
- row1: ["Checking", "0.01%", "Instant ATM", "None"]
- row2: ["Traditional Savings", "0.05%", "6 Transfers/Mo", "None"]
- row3Highlight: ["High-Yield Savings (HYSA)", "4.50% - 5.10%", "1-2 Day ACH", "Zero Lock (Winner)"]
- row4: ["12-Month CD Ladder", "4.80% - 5.25%", "Locked", "12 Months"]
- check1, check2, check3, check4, check5: (Actionable audit rules)
- summaryCallout: (1-sentence financial takeaway)

IF INTENT IS 'CALCULATOR' (\${$json.pinStyle}):
- input1Label, input1Val, input2Label, input2Val, input3Label, input3Val
- heroResultLabel: (e.g. "Monthly Payment" or "Total Interest Saved")
- heroResultVal: (e.g. "$1,580.74" or "$8,450")
- subResult1Label, subResult1Val, subResult2Label, subResult2Val
- tableRow1: ["1", "$3,980", "$12,236", "$246,019"]
- tableRow2: ["2", "$4,054", "$12,162", "$241,964"]
- tableRow3: ["3", "$4,131", "$12,085", "$237,833"]

RETURN ONLY VALID JSON wrapped in a single json code block.\`
        }
      ]
    }
  ]
} }}`;
}

// Node 7 (Data Parser & Validation with Strict Brand Sanitization)
const n7 = wf.nodes.find(n => n.name.includes('Inspect Asset Status') || n.name.includes('Validate'));
if (n7) {
  n7.parameters.jsCode = `// PARSE & VALIDATE GEMINI DATA WITH STRICT FINMATRIX BRAND PROTECTION
let rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
const kw = prev.targetKeyword || 'Financial Calculator';
const pillar = (prev.pillar || '').toLowerCase();
const intent = prev.intentType || 'CALCULATOR';

const finFallbacks = {
  headlineOnImage: 'Amortization Calculator',
  subtitleOnImage: 'Calculate Your Monthly Loan Payment',
  calcHeaderTitle: 'Finmatrix Amortization Engine',
  sideATitle: 'Minimum Payments', sideATag: 'Standard Baseline',
  sideBTitle: 'Debt Avalanche', sideBTag: 'Mathematical Winner',
  point1A: 'Pay 2% minimum balances each month', point1B: 'Direct all surplus cash to highest APR account',
  point2A: 'Takes 16+ years to become debt-free', point2B: 'Debt-free in 28 months with free toolkit',
  point3A: 'Accumulates tens of thousands in finance fees', point3B: 'Halts compounding APR charges immediately',
  metricNumA: '$14,820 Interest', metricNumB: '$4,120 Interest',
  verdictText: 'Finmatrix Verdict: Debt Avalanche saves $10,700 in interest and eliminates debt 13 years sooner.',
  phase1Title: 'Defensive Starter Buffer', phase1Amount: '$1,000 CASH', phase1Desc: 'Prevents minor unexpected emergencies from creating new high-interest debt.',
  phase2Title: 'Baseline Survival Audit', phase2Amount: '1 MONTH BUFFER', phase2Desc: 'Calculate absolute minimum monthly living expenses: rent, food, and minimum debt.',
  phase3Title: 'High-Yield Liquidity Sweep', phase3Amount: '3 MONTHS CASH', phase3Desc: 'Move cash reserves to a 4.5%+ APY High-Yield Savings Account to earn risk-free yield.',
  phase4Title: 'Total Wealth Fortress', phase4Amount: '6 MONTHS BUFFER', phase4Desc: 'Full cash reserve unlocked. Frees 100% of future cash flow to compound in index funds.',
  card1Title: 'APR Avalanche', card1Desc: 'Target accounts charging >10% APR first to eliminate compounding finance charges.',
  card2Title: 'HYSA Sweep', card2Desc: 'Keep cash in high-yield accounts earning >4.5% APY instead of 0.01% checking.',
  card3Title: '100% Match', card3Desc: 'Capture full company 401(k) match. Instant, guaranteed 100% risk-free return.',
  card4Title: 'Bi-Weekly Pay', card4Desc: 'Make 26 half-payments per year. Automatically pays 1 extra monthly payment yearly.',
  card5Title: 'Roth Shield', card5Desc: 'Utilize Roth IRA contributions to compound index funds completely tax-free.',
  card6Title: 'Index Compounding', card6Desc: 'Automate low-cost index funds. S&P 500 historically doubles money every 7 years.',
  pct1: '50%', pct2: '20%', pct3: '15%', pct4: '15%',
  takeaway: 'Mathematical consistency beats emotional guessing every single time.',
  col1: 'Account Type', col2: 'APY Rate', col3: 'Liquidity', col4: 'Lock Term',
  row1: ['Traditional Checking', '0.01%', 'Instant ATM', 'None'],
  row2: ['Traditional Savings', '0.05%', '6 Transfers/Mo', 'None'],
  row3Highlight: ['High-Yield Savings (HYSA)', '4.50% - 5.10%', '1-2 Day ACH', 'Zero Lock (Winner)'],
  row4: ['12-Month CD Ladder', '4.80% - 5.25%', 'Locked', '12 Months'],
  summaryCallout: 'HYSA earns $2,550/yr on $50,000 vs Traditional Bank earning just $5/yr',
  input1Label: 'Loan Amount:', input1Val: '$ 250,000',
  input2Label: 'Interest Rate (%):', input2Val: '6.5%',
  input3Label: 'Loan Term:', input3Val: '30 Years',
  btnText: '🧮 CALCULATE PAYMENT',
  heroResultLabel: 'Monthly Payment', heroResultVal: '$1,580.74',
  subResult1Label: 'Total Paid:', subResult1Val: '$569,064',
  subResult2Label: 'Interest:', subResult2Val: '$319,064',
  tableRow1: ['1', '$3,980', '$12,236', '$246,019'],
  tableRow2: ['2', '$4,054', '$12,162', '$241,964'],
  tableRow3: ['3', '$4,131', '$12,085', '$237,833'],
  check1: 'Calculate exact baseline monthly living costs',
  check2: 'Eliminate all revolving accounts with APR > 15%',
  check3: 'Capture full 100% employer 401(k) company match',
  check4: 'Automate weekly deposit to High-Yield Savings Account',
  check5: 'Review debt-to-income ratio before any loan application'
};

// Purge any competitor brand names
rawGemini = rawGemini.replace(/myusfinance(\.com)?/gi, 'Finmatrix')
                     .replace(/nerdwallet(\.com)?/gi, 'Finmatrix')
                     .replace(/bankrate(\.com)?/gi, 'Finmatrix')
                     .replace(/smartasset(\.com)?/gi, 'Finmatrix');

const fence = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);
let cleanJson = rawGemini.split(fence + 'json').join('').split(fence).join('').trim();
let parsed = {};
try {
  parsed = JSON.parse(cleanJson);
} catch (e) {
  parsed = finFallbacks;
}

let calcHead = (parsed.calcHeaderTitle || finFallbacks.calcHeaderTitle);
calcHead = calcHead.replace(/myusfinance/gi, 'Finmatrix').replace(/calculator/gi, 'Engine');
if (!calcHead.toLowerCase().includes('finmatrix')) calcHead = 'Finmatrix ' + calcHead;

const finalData = { ...prev, ...finFallbacks, ...parsed, calcHeaderTitle: calcHead };
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

// Node 8 (DYNAMIC MULTI-ARCHETYPE & COLOR STUDIO ENGINE - 16 FULL LAYOUTS)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = `// FINMATRIX COMBINATORIAL 16-ARCHETYPE & 8-PALETTE STUDIO ENGINE
const item = $json;
const arch = item.pinStyle || 'ARCH_LAPTOP_WORKSPACE';
const palette = item.paletteTheme || 'PALETTE_DAYLIGHT_DESK';

const headline = item.headlineOnImage || 'Financial Calculator';
const subtitle = item.subtitleOnImage || 'Calculate exact numbers, compound yield and interest';
const calcHeader = item.calcHeaderTitle || 'Finmatrix Financial Engine';

let bodyHtml = '';

// ==========================================
// 1. ARCH_LAPTOP_WORKSPACE (Daylight Desk & Laptop)
// ==========================================
if (arch === 'ARCH_LAPTOP_WORKSPACE') {
  const in1L = item.input1Label || 'Loan Amount';
  const in1V = item.input1Val || '$ 250,000';
  const in2L = item.input2Label || 'Interest Rate (%)';
  const in2V = item.input2Val || '6.5%';
  const in3L = item.input3Label || 'Loan Term';
  const in3V = item.input3Val || '30 Years';
  const heroL = item.heroResultLabel || 'Monthly Payment';
  const heroV = item.heroResultVal || '$1,580.74';
  const sub1L = item.subResult1Label || 'Total Paid:';
  const sub1V = item.subResult1Val || '$569,064';
  const sub2L = item.subResult2Label || 'Interest:';
  const sub2V = item.subResult2Val || '$319,064';
  const t1 = item.tableRow1 || ['1', '$3,980', '$12,236', '$246,019'];
  const t2 = item.tableRow2 || ['2', '$4,054', '$12,162', '$241,964'];
  const t3 = item.tableRow3 || ['3', '$4,131', '$12,085', '$237,833'];

  bodyHtml = \`
  <div class="pin-wrapper daylight-theme">
    <div class="desk-surface"></div>
    <div class="top-content">
      <div class="script-tag">Free &amp; Easy to Use</div>
      <h1 class="main-title">\${headline}</h1>
      <div class="highlight-pill">\${subtitle}</div>
      <div class="categories-row">
        <div class="cat-item"><div class="cat-icon-circle">🏠</div><span class="cat-label">Mortgage</span></div>
        <div class="cat-item"><div class="cat-icon-circle">🚗</div><span class="cat-label">Auto Loan</span></div>
        <div class="cat-item"><div class="cat-icon-circle">💰</div><span class="cat-label">Personal Loan</span></div>
        <div class="cat-item"><div class="cat-icon-circle">🤝</div><span class="cat-label">Refinance</span></div>
        <div class="cat-item"><div class="cat-icon-circle">🏢</div><span class="cat-label">Business</span></div>
      </div>
    </div>
    <div class="mid-hero-container">
      <div class="left-col">
        <div class="script-checklist-title">Know Your Numbers!</div>
        <div class="checklist-item"><div class="check-icon">✓</div><span class="check-text">Monthly Payment</span></div>
        <div class="checklist-item"><div class="check-icon">✓</div><span class="check-text">Total Interest</span></div>
        <div class="checklist-item"><div class="check-icon">✓</div><span class="check-text">Loan Balance</span></div>
        <div class="checklist-item"><div class="check-icon">✓</div><span class="check-text">Payoff Schedule</span></div>
        <div class="notepad-sticky">
          <div class="np-line1">Plan • Calculate • Achieve</div>
          <div class="np-line2">100% Free • Finmatrix :)</div>
        </div>
      </div>
      <div class="laptop-mockup-wrapper">
        <div class="laptop-screen">
          <div class="laptop-webcam"></div>
          <div class="laptop-display">
            <div class="app-header">
              <span class="app-brand">\${calcHeader}</span>
              <div class="app-dots"><span></span><span></span><span></span></div>
            </div>
            <div class="app-body">
              <div class="app-inputs-col">
                <div class="app-row"><span class="app-label">\${in1L}</span><div class="app-input">\${in1V}</div></div>
                <div class="app-row"><span class="app-label">\${in2L}</span><div class="app-input">\${in2V}</div></div>
                <div class="app-row"><span class="app-label">\${in3L}</span><div class="app-input">\${in3V}</div></div>
                <div class="app-calc-btn">🧮 CALCULATE NOW</div>
              </div>
              <div class="app-results-col">
                <div class="res-hero">
                  <div class="res-hero-lbl">\${heroL}</div>
                  <div class="res-hero-val">\${heroV}</div>
                </div>
                <div class="res-sub-grid">
                  <div>\${sub1L} <strong>\${sub1V}</strong></div>
                  <div>\${sub2L} <strong>\${sub2V}</strong></div>
                </div>
                <table class="mini-schedule-table">
                  <thead><tr><th>Yr</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
                  <tbody>
                    <tr><td>\${t1[0]}</td><td>\${t1[1]}</td><td>\${t1[2]}</td><td>\${t1[3]}</td></tr>
                    <tr><td>\${t2[0]}</td><td>\${t2[1]}</td><td>\${t2[2]}</td><td>\${t2[3]}</td></tr>
                    <tr><td>\${t3[0]}</td><td>\${t3[1]}</td><td>\${t3[2]}</td><td>\${t3[3]}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="laptop-base"><div class="laptop-notch"></div></div>
      </div>
    </div>
    <div class="bottom-brand-banner">
      <div class="brand-top-row"><div class="brand-logo-icon">🧮</div><div class="brand-domain-text">Finmatrix.cloud</div></div>
      <div class="brand-tagline-text">Simple • Fast • Accurate</div>
      <div class="bottom-cta-ribbon">Make Smarter Financial Decisions →</div>
    </div>
  </div>\`;
}

// ==========================================
// 2. ARCH_TABLET_MARBLE (Marble Desk & iPad Pro)
// ==========================================
else if (arch === 'ARCH_TABLET_MARBLE') {
  bodyHtml = \`
  <div class="pin-wrapper tablet-theme">
    <div class="marble-surface"></div>
    <div class="top-box">
      <div class="script-tag">100% Free Financial Simulator</div>
      <h1 class="title">\${headline}</h1>
      <div class="badge-pill">\${subtitle}</div>
    </div>
    <div class="mid-container">
      <div class="coffee-mug"><div class="coffee-liquid">☕</div></div>
      <div class="tablet-mockup">
        <div class="tablet-screen">
          <div class="tab-header">
            <span class="tab-logo">\${calcHeader}</span>
            <span class="tab-status">Live Model Loaded</span>
          </div>
          <div class="tab-grid">
            <div class="tab-card"><div class="tab-card-lbl">\${item.input1Label || 'Starting Balance'}</div><div class="tab-card-val">\${item.input1Val || '$45,000'}</div></div>
            <div class="tab-card"><div class="tab-card-lbl">\${item.input2Label || 'Annual Return'}</div><div class="tab-card-val">\${item.input2Val || '8.5% S&P 500'}</div></div>
            <div class="tab-card card-green"><div class="tab-card-lbl">\${item.subResult1Label || 'Interest Saved'}</div><div class="tab-card-val">\${item.subResult1Val || '+$38,400'}</div></div>
            <div class="tab-card card-green"><div class="tab-card-lbl">\${item.heroResultLabel || 'Projected Balance'}</div><div class="tab-card-val">\${item.heroResultVal || '$1,482,000'}</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bar tablet-footer">
      <div><span class="brand-name">Finmatrix</span><span class="brand-sub">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">SIMULATE YOUR NUMBERS →</div>
    </div>
  </div>\`;
}

// ==========================================
// 3. ARCH_MOBILE_APP (Floating Smartphone & Interactive Dials)
// ==========================================
else if (arch === 'ARCH_MOBILE_APP') {
  bodyHtml = \`
  <div class="pin-wrapper mobile-theme">
    <div class="top-box text-center">
      <div class="pill-badge">📱 Interactive App Preview</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="phone-scene">
      <div class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="phone-app-bar"><span>Finmatrix App</span><span>⚡ Live</span></div>
          <div class="phone-metric-dial">
            <div class="dial-circle">
              <span class="dial-pct">100%</span>
              <span class="dial-lbl">Optimized</span>
            </div>
            <div class="dial-stat-val">\${item.heroResultVal || '$1,580/mo'}</div>
            <div class="dial-stat-lbl">\${item.heroResultLabel || 'Target Monthly Payment'}</div>
          </div>
          <div class="phone-slider-box">
            <div class="slider-row"><span>Balance</span><strong>\${item.input1Val || '$250,000'}</strong></div>
            <div class="slider-track"><div class="slider-fill" style="width: 70%;"></div></div>
            <div class="slider-row"><span>Interest Rate</span><strong>\${item.input2Val || '6.5%'}</strong></div>
            <div class="slider-track"><div class="slider-fill" style="width: 45%;"></div></div>
          </div>
          <div class="phone-btn">COMPUTE SAVINGS →</div>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">FREE MOBILE TOOLKIT →</div>
    </div>
  </div>\`;
}

// ==========================================
// 4. ARCH_BENTO_METRICS (Asymmetric Bento Financial Card Grid)
// ==========================================
else if (arch === 'ARCH_BENTO_METRICS') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme bento-theme">
    <div class="header-box">
      <div class="pill-badge">⚡ Finmatrix Bento Grid</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="bento-container">
      <div class="bento-hero-card">
        <div class="bento-tag">PRIMARY PROJECTION</div>
        <div class="bento-hero-num">\${item.heroResultVal || '$1,580.74'}</div>
        <div class="bento-hero-desc">\${item.heroResultLabel || 'Calculated Monthly Payment'} &bull; Slashes compounding interest at maximum speed</div>
      </div>
      <div class="bento-split-row">
        <div class="bento-sub-card">
          <div class="bento-sub-lbl">Baseline Inputs</div>
          <div class="bento-sub-val">\${item.input1Val || '$250,000'}</div>
          <div class="bento-sub-desc">Fixed loan balance at \${item.input2Val || '6.5% APR'}</div>
        </div>
        <div class="bento-sub-card bento-accent">
          <div class="bento-sub-lbl">Total Interest Paid</div>
          <div class="bento-sub-val text-green">\${item.subResult2Val || '$319,064'}</div>
          <div class="bento-sub-desc">Over 30-year amortization schedule</div>
        </div>
      </div>
      <div class="bento-full-card">
        <div class="bento-takeaway-lbl">💡 QUANTITATIVE FORMULA</div>
        <div class="bento-takeaway-text">\${item.takeaway || 'Adding just $150 extra per month to principal saves over $42,000 in interest.'}</div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">OPEN BENTO CALCULATOR →</div>
    </div>
  </div>\`;
}

// ==========================================
// 5. ARCH_COMP_SPLIT (Dual-Column High-Contrast Split Comparison)
// ==========================================
else if (arch === 'ARCH_COMP_SPLIT') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme comp-split-theme">
    <div class="header-box">
      <div class="pill-badge">⚡ Strategy Comparison</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="split-container">
      <div class="vs-circle">VS</div>
      <div class="col-side col-a">
        <div class="side-header">
          <div class="side-tag">\${item.sideATag || 'Method A'}</div>
          <div class="side-name">\${item.sideATitle || 'Debt Snowball'}</div>
        </div>
        <div class="side-points">
          <div class="point-row"><div class="point-lbl">Strategy</div><div class="point-val">\${item.point1A || 'Pay smallest balance first'}</div></div>
          <div class="point-row"><div class="point-lbl">Primary Benefit</div><div class="point-val">\${item.point2A || 'Early psychological momentum'}</div></div>
          <div class="point-row"><div class="point-lbl">Finance Cost</div><div class="point-val">\${item.point3A || 'High compounding finance charges'}</div></div>
        </div>
        <div class="side-hero-metric"><div class="metric-lbl">Total Interest Paid</div><div class="metric-num col-a-color">\${item.metricNumA || '$12,480'}</div></div>
      </div>
      <div class="col-side col-b">
        <div class="side-header">
          <div class="side-tag">\${item.sideBTag || 'Mathematical Winner'}</div>
          <div class="side-name">\${item.sideBTitle || 'Debt Avalanche'}</div>
        </div>
        <div class="side-points">
          <div class="point-row"><div class="point-lbl">Strategy</div><div class="point-val">\${item.point1B || 'Target highest APR accounts first'}</div></div>
          <div class="point-row"><div class="point-lbl">Primary Benefit</div><div class="point-val">\${item.point2B || 'Halts compounding APR charges'}</div></div>
          <div class="point-row"><div class="point-lbl">Finance Cost</div><div class="point-val">\${item.point3B || 'Slashes total interest up to 68%'}</div></div>
        </div>
        <div class="side-hero-metric"><div class="metric-lbl">Total Interest Paid</div><div class="metric-num col-b-color">\${item.metricNumB || '$4,120'}</div></div>
      </div>
    </div>
    <div class="verdict-box"><span class="verdict-text">🏆 <strong>Finmatrix Verdict:</strong> \${item.verdictText || 'Avalanche saves thousands in interest and finishes months sooner.'}</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">FREE CALCULATOR &amp; TOOLKIT →</div>
    </div>
  </div>\`;
}

// ==========================================
// 6. ARCH_COMP_CARDS (Side-by-Side Strategy Cards)
// ==========================================
else if (arch === 'ARCH_COMP_CARDS') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme comp-cards-theme">
    <div class="header-box">
      <div class="pill-badge">⚖️ Head-to-Head Analysis</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="cards-duo-container">
      <div class="strategy-card">
        <div class="strat-header">
          <div class="strat-title">\${item.sideATitle || 'Minimum Payments'}</div>
          <div class="strat-badge badge-warning">Standard Route</div>
        </div>
        <div class="strat-bullets">
          <div class="strat-bullet">❌ \${item.point1A || 'Extends debt across 15+ years'}</div>
          <div class="strat-bullet">❌ \${item.point2A || 'Accumulates compounding finance fees'}</div>
          <div class="strat-bullet">❌ \${item.point3A || 'Leaves credit utilization high'}</div>
        </div>
        <div class="strat-metric-box">
          <div class="sm-lbl">Total Interest</div>
          <div class="sm-val text-red">\${item.metricNumA || '$14,820'}</div>
        </div>
      </div>
      <div class="strategy-card card-winner">
        <div class="strat-header">
          <div class="strat-title">\${item.sideBTitle || 'Finmatrix Accelerated Payoff'}</div>
          <div class="strat-badge badge-winner">🏆 Winner</div>
        </div>
        <div class="strat-bullets">
          <div class="strat-bullet">✅ \${item.point1B || 'Debt-free in just 28 months'}</div>
          <div class="strat-bullet">✅ \${item.point2B || 'Slashes interest charges by over $10,000'}</div>
          <div class="strat-bullet">✅ \${item.point3B || 'Reclaims 100% of future cash flow'}</div>
        </div>
        <div class="strat-metric-box">
          <div class="sm-lbl">Total Interest</div>
          <div class="sm-val text-green">\${item.metricNumB || '$4,120'}</div>
        </div>
      </div>
    </div>
    <div class="verdict-box"><span class="verdict-text">🏆 <strong>Takeaway:</strong> \${item.verdictText || 'Finmatrix rules eliminate the bank’s compound interest advantage.'}</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">COMPARE LIVE STRATEGIES →</div>
    </div>
  </div>\`;
}

// ==========================================
// 7. ARCH_BEFORE_AFTER (Before vs After Debt Transformation)
// ==========================================
else if (arch === 'ARCH_BEFORE_AFTER') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme before-after-theme">
    <div class="header-box">
      <div class="pill-badge">🔄 Financial Transformation</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="ba-stack">
      <div class="ba-card ba-before">
        <div class="ba-header"><span class="ba-tag">BEFORE: THE MINIMUM TRAP</span><span class="ba-status">❌ 18+ Years</span></div>
        <div class="ba-title">Paying Bank Minimums Only</div>
        <div class="ba-desc">Revolving 21% APR debt compounds monthly, trapping you in interest while balances barely budge.</div>
        <div class="ba-metric-row"><span class="ba-lbl">Compounding Interest:</span><strong class="text-red">$18,450</strong></div>
      </div>
      <div class="ba-arrow-divider">⬇️ FINMATRIX MATHEMATICAL SWITCH ⬇️</div>
      <div class="ba-card ba-after">
        <div class="ba-header"><span class="ba-tag">AFTER: ACCELERATED AVALANCHE</span><span class="ba-status">✅ 28 Months</span></div>
        <div class="ba-title">Automated Debt Payoff Engine</div>
        <div class="ba-desc">Extra cash flow attacks highest APR accounts first. Halts finance charges and fast-tracks freedom.</div>
        <div class="ba-metric-row"><span class="ba-lbl">Interest Saved:</span><strong class="text-green">+$14,330 CASH</strong></div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">CALCULATE YOUR SWITCH →</div>
    </div>
  </div>\`;
}

// ==========================================
// 8. ARCH_ROADMAP_TIMELINE (4-Phase Stepped Roadmap)
// ==========================================
else if (arch === 'ARCH_ROADMAP_TIMELINE') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme roadmap-theme">
    <div class="header-box">
      <div class="pill-badge">🗺️ Financial Blueprint</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="timeline-container">
      <div class="timeline-rail"></div>
      <div class="stage-card stage-1">
        <div class="stage-badge-circle">01</div>
        <div class="stage-content">
          <div class="stage-header-row"><span class="stage-phase">PHASE 1: STARTER CUSHION</span><span class="stage-amount">\${item.phase1Amount || '$1,000'}</span></div>
          <div class="stage-title">\${item.phase1Title || 'Defensive Buffer'}</div>
          <div class="stage-desc">\${item.phase1Desc || 'Stops minor unexpected emergencies from creating new high-interest debt.'}</div>
        </div>
      </div>
      <div class="stage-card stage-2">
        <div class="stage-badge-circle">02</div>
        <div class="stage-content">
          <div class="stage-header-row"><span class="stage-phase">PHASE 2: SURVIVAL AUDIT</span><span class="stage-amount">\${item.phase2Amount || '1 MONTH BUFFER'}</span></div>
          <div class="stage-title">\${item.phase2Title || 'Core Baseline Expenses'}</div>
          <div class="stage-desc">\${item.phase2Desc || 'Calculate absolute minimum monthly living expenses: rent, food, and minimum debt.'}</div>
        </div>
      </div>
      <div class="stage-card stage-3">
        <div class="stage-badge-circle">03</div>
        <div class="stage-content">
          <div class="stage-header-row"><span class="stage-phase">PHASE 3: HYSA SWEEP</span><span class="stage-amount">\${item.phase3Amount || '3 MONTHS CASH'}</span></div>
          <div class="stage-title">\${item.phase3Title || 'High-Yield Liquidity Shield'}</div>
          <div class="stage-desc">\${item.phase3Desc || 'Move cash to a 4.5%+ APY High-Yield Savings Account to earn risk-free interest.'}</div>
        </div>
      </div>
      <div class="stage-card stage-4">
        <div class="stage-badge-circle">04</div>
        <div class="stage-content">
          <div class="stage-header-row"><span class="stage-phase">PHASE 4: FULL FORTRESS</span><span class="stage-amount">\${item.phase4Amount || '6 MONTHS BUFFER'}</span></div>
          <div class="stage-title">\${item.phase4Title || 'Total Financial Sovereignty'}</div>
          <div class="stage-desc">\${item.phase4Desc || 'Full cash reserve unlocked. Frees future cash flow to compound inside index funds.'}</div>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">DOWNLOAD FREE BLUEPRINT →</div>
    </div>
  </div>\`;
}

// ==========================================
// 9. ARCH_ROADMAP_STAIRS (Ascending Wealth Milestone Ladder)
// ==========================================
else if (arch === 'ARCH_ROADMAP_STAIRS') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme stairs-theme">
    <div class="header-box">
      <div class="pill-badge">🪜 Wealth Milestone Ladder</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="stairs-container">
      <div class="stair-step step-4">
        <div class="stair-badge">04 • SOVEREIGNTY</div>
        <div class="stair-title">\${item.phase4Title || '100% Financial Independence'}</div>
        <div class="stair-metric">\${item.phase4Amount || '$1,000,000+'}</div>
      </div>
      <div class="stair-step step-3">
        <div class="stair-badge">03 • FREEDOM</div>
        <div class="stair-title">\${item.phase3Title || '6-Month Liquid Cash Reserve'}</div>
        <div class="stair-metric">\${item.phase3Amount || '$30,000'}</div>
      </div>
      <div class="stair-step step-2">
        <div class="stair-badge">02 • DEFENSE</div>
        <div class="stair-title">\${item.phase2Title || 'High-APR Debt Elimination'}</div>
        <div class="stair-metric">\${item.phase2Amount || '$0 REVOLVING DEBT'}</div>
      </div>
      <div class="stair-step step-1">
        <div class="stair-badge">01 • FOUNDATION</div>
        <div class="stair-title">\${item.phase1Title || 'Starter Emergency Buffer'}</div>
        <div class="stair-metric">\${item.phase1Amount || '$1,000'}</div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">CLIMB THE LADDER →</div>
    </div>
  </div>\`;
}

// ==========================================
// 10. ARCH_ROADMAP_CHEVRON (4-Stage Process Journey)
// ==========================================
else if (arch === 'ARCH_ROADMAP_CHEVRON') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme chevron-theme">
    <div class="header-box">
      <div class="pill-badge">🧭 Execution Process Flow</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="chevron-list">
      <div class="chevron-card ch-1">
        <div class="ch-num">STAGE 01</div>
        <div class="ch-title">\${item.phase1Title || 'Audit High-Interest Accounts'}</div>
        <div class="ch-desc">\${item.phase1Desc || 'List all debts ordered by APR to locate your biggest compound interest drain.'}</div>
      </div>
      <div class="chevron-card ch-2">
        <div class="ch-num">STAGE 02</div>
        <div class="ch-title">\${item.phase2Title || 'Automate Minimums Everywhere'}</div>
        <div class="ch-desc">\${item.phase2Desc || 'Lock in minimum auto-pay to guarantee 100% on-time credit score growth.'}</div>
      </div>
      <div class="chevron-card ch-3">
        <div class="ch-num">STAGE 03</div>
        <div class="ch-title">\${item.phase3Title || 'Direct Surplus Cash to Target'}</div>
        <div class="ch-desc">\${item.phase3Desc || 'Funnel 100% of available extra cash to account #1 until balance reaches zero.'}</div>
      </div>
      <div class="chevron-card ch-4">
        <div class="ch-num">STAGE 04</div>
        <div class="ch-title">\${item.phase4Title || 'Compound the Reclaimed Cash Flow'}</div>
        <div class="ch-desc">\${item.phase4Desc || 'Roll the freed payments into index funds to double purchasing power.'}</div>
      </div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">START PROCESS TODAY →</div>
    </div>
  </div>\`;
}

// ==========================================
// 11. ARCH_GRID_6_CARDS (6-Card Editorial Cheat Sheet Grid)
// ==========================================
else if (arch === 'ARCH_GRID_6_CARDS') {
  bodyHtml = \`
  <div class="pin-wrapper light-theme grid-theme">
    <div class="header-box">
      <div class="pill-badge">📊 Financial Framework</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="grid-cards">
      <div class="grid-card card-1"><div class="card-icon-badge">⚡</div><div class="card-num">LEVER 01</div><div class="card-title">\${item.card1Title || 'APR Avalanche'}</div><div class="card-desc">\${item.card1Desc || 'Target accounts charging >10% APR first to eliminate compounding finance charges.'}</div></div>
      <div class="grid-card card-2"><div class="card-icon-badge">🏦</div><div class="card-num">LEVER 02</div><div class="card-title">\${item.card2Title || 'HYSA Sweep'}</div><div class="card-desc">\${item.card2Desc || 'Keep cash in high-yield accounts earning >4.5% APY instead of 0.01% checking.'}</div></div>
      <div class="grid-card card-3"><div class="card-icon-badge">💼</div><div class="card-num">LEVER 03</div><div class="card-title">\${item.card3Title || '100% Match'}</div><div class="card-desc">\${item.card3Desc || 'Capture full company 401(k) match. Instant, guaranteed 100% risk-free return.'}</div></div>
      <div class="grid-card card-4"><div class="card-icon-badge">📅</div><div class="card-num">LEVER 04</div><div class="card-title">\${item.card4Title || 'Bi-Weekly Pay'}</div><div class="card-desc">\${item.card4Desc || 'Make 26 half-payments per year. Automatically pays 1 extra monthly payment yearly.'}</div></div>
      <div class="grid-card card-5"><div class="card-icon-badge">🛡️</div><div class="card-num">LEVER 05</div><div class="card-title">\${item.card5Title || 'Roth Shield'}</div><div class="card-desc">\${item.card5Desc || 'Utilize Roth IRA contributions to compound index funds completely tax-free.'}</div></div>
      <div class="grid-card card-6"><div class="card-icon-badge">📈</div><div class="card-num">LEVER 06</div><div class="card-title">\${item.card6Title || 'Index Compounding'}</div><div class="card-desc">\${item.card6Desc || 'Automate low-cost index funds. S&P 500 historically doubles money every 7 years.'}</div></div>
    </div>
    <div class="takeaway-banner"><span class="tw-text">💡 <strong>Finmatrix Rule:</strong> \${item.takeaway || 'Mathematical consistency beats emotional guessing every single time.'}</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">FREE EXCEL TOOLKIT →</div>
    </div>
  </div>\`;
}

// ==========================================
// 12. ARCH_GRID_4_PILLARS (4-Quadrant Wealth Allocation Matrix)
// ==========================================
else if (arch === 'ARCH_GRID_4_PILLARS') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme pillars-theme">
    <div class="header-box">
      <div class="pill-badge">🏛️ Wealth Allocation Matrix</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="pillars-grid">
      <div class="pillar-card p1">
        <div>
          <div class="p-header"><span class="p-icon">🛡️</span><span class="p-pct">\${item.pct1 || '50%'}</span></div>
          <div class="p-title">\${item.card1Title || 'Essential Living'}</div>
          <div class="p-desc">\${item.card1Desc || 'Housing, groceries, core utilities, and minimum required debt payments.'}</div>
        </div>
      </div>
      <div class="pillar-card p2">
        <div>
          <div class="p-header"><span class="p-icon">📈</span><span class="p-pct">\${item.pct2 || '20%'}</span></div>
          <div class="p-title">\${item.card2Title || 'Compounding Wealth'}</div>
          <div class="p-desc">\${item.card2Desc || '401(k) company match, Roth IRA, and automated low-cost index funds.'}</div>
        </div>
      </div>
      <div class="pillar-card p3">
        <div>
          <div class="p-header"><span class="p-icon">⚡</span><span class="p-pct">\${item.pct3 || '15%'}</span></div>
          <div class="p-title">\${item.card3Title || 'Accelerated Payoff'}</div>
          <div class="p-desc">\${item.card3Desc || 'Surplus principal payments to eliminate high APR debt at highest math rate.'}</div>
        </div>
      </div>
      <div class="pillar-card p4">
        <div>
          <div class="p-header"><span class="p-icon">☕</span><span class="p-pct">\${item.pct4 || '15%'}</span></div>
          <div class="p-title">\${item.card4Title || 'Guilt-Free Life'}</div>
          <div class="p-desc">\${item.card4Desc || 'Dining, hobbies, travel, and personal enjoyment with zero financial stress.'}</div>
        </div>
      </div>
    </div>
    <div class="verdict-box"><span class="verdict-text">💡 <strong>Finmatrix Rule:</strong> \${item.takeaway || 'Automate every dollar before discretionary spending begins.'}</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">DOWNLOAD ALLOCATION MATRIX →</div>
    </div>
  </div>\`;
}

// ==========================================
// 13. ARCH_NUMBERED_LIST (High-Impact Master Rule Checklist)
// ==========================================
else if (arch === 'ARCH_NUMBERED_LIST') {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme list-theme">
    <div class="header-box">
      <div class="pill-badge">📋 Quantitative Rules</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="num-list-container">
      <div class="num-row"><div class="num-badge">01</div><div class="num-text"><div class="num-title">\${item.card1Title || 'Capture 100% Employer Match'}</div><div class="num-desc">Guaranteed 100% instant return before any other investment.</div></div></div>
      <div class="num-row"><div class="num-badge">02</div><div class="num-text"><div class="num-title">\${item.card2Title || 'Halt APR > 10% Immediately'}</div><div class="num-desc">Credit card interest destroys compound gains faster than stocks grow.</div></div></div>
      <div class="num-row"><div class="num-badge">03</div><div class="num-text"><div class="num-title">\${item.card3Title || 'Maintain 3-to-6 Month Cash Fortress'}</div><div class="num-desc">Keep liquid cash in high-yield accounts earning over 4.5% APY.</div></div></div>
      <div class="num-row"><div class="num-badge">04</div><div class="num-text"><div class="num-title">\${item.card4Title || 'Max Out Tax-Advantaged Roth Accounts'}</div><div class="num-desc">Tax-free growth ensures zero capital gains tax at retirement.</div></div></div>
      <div class="num-row"><div class="num-badge">05</div><div class="num-text"><div class="num-title">\${item.card5Title || 'Automate Low-Cost Index Funds'}</div><div class="num-desc">Consistently reinvest to leverage the mathematical Rule of 72.</div></div></div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">GET THE MASTER LIST →</div>
    </div>
  </div>\`;
}

// ==========================================
// 14. ARCH_TABLE_MATRIX (SaaS Rate Comparison Matrix)
// ==========================================
else if (arch === 'ARCH_TABLE_MATRIX') {
  const r1 = item.row1 || ['Traditional Checking', '0.01%', 'Instant ATM', 'None'];
  const r2 = item.row2 || ['Traditional Savings', '0.05%', '6 Transfers/Mo', 'None'];
  const r3 = item.row3Highlight || ['High-Yield Savings (HYSA)', '4.50% - 5.10%', '1-2 Day ACH', 'Zero Lock (Winner)'];
  const r4 = item.row4 || ['12-Month CD Ladder', '4.80% - 5.25%', 'Locked', '12 Months'];

  bodyHtml = \`
  <div class="pin-wrapper dark-theme table-theme">
    <div class="header-box">
      <div class="pill-badge">📊 Interest Matrix</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="table-card">
      <table class="data-table">
        <thead><tr><th>\${item.col1 || 'Account Type'}</th><th>\${item.col2 || 'Typical APY'}</th><th>\${item.col3 || 'Liquidity'}</th><th>\${item.col4 || 'Lock Term'}</th></tr></thead>
        <tbody>
          <tr><td>\${r1[0]}</td><td><span class="rate-val">\${r1[1]}</span></td><td>\${r1[2]}</td><td>\${r1[3]}</td></tr>
          <tr><td>\${r2[0]}</td><td><span class="rate-val">\${r2[1]}</span></td><td>\${r2[2]}</td><td>\${r2[3]}</td></tr>
          <tr class="row-highlight"><td>\${r3[0]} <span class="tag-winner">WINNER</span></td><td><span class="rate-val">\${r3[1]}</span></td><td>\${r3[2]}</td><td>\${r3[3]}</td></tr>
          <tr><td>\${r4[0]}</td><td><span class="rate-val">\${r4[1]}</span></td><td>\${r4[2]}</td><td>\${r4[3]}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="summary-card">
      <div class="sum-left"><div class="sum-title">Annual Yield Comparison</div><div class="sum-desc">\${item.summaryCallout || 'Earn over $2,500/yr more on cash reserves with high-yield savings.'}</div></div>
      <div class="sum-badge">+$2,545 CASH</div>
    </div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">COMPARE LIVE RATES →</div>
    </div>
  </div>\`;
}

// ==========================================
// 15. ARCH_CHECKLIST_GATE (5-Point Action Audit Checklist)
// ==========================================
else if (arch === 'ARCH_CHECKLIST_GATE') {
  bodyHtml = \`
  <div class="pin-wrapper light-theme checklist-gate-theme">
    <div class="header-box">
      <div class="pill-badge">✅ Action Audit Checklist</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="gate-checklist-box">
      <div class="gate-item"><div class="gate-check">✓</div><div class="gate-content"><div class="gate-title">\${item.check1 || 'Audit Monthly Fixed Baseline Expenses'}</div><div class="gate-desc">Calculate housing, groceries, utilities, and loan minimums.</div></div><div class="gate-status">DONE</div></div>
      <div class="gate-item"><div class="gate-check">✓</div><div class="gate-content"><div class="gate-title">\${item.check2 || 'Eradicate High APR Cards (>15%)'}</div><div class="gate-desc">Halt compounding finance charges with accelerated avalanche.</div></div><div class="gate-status">DONE</div></div>
      <div class="gate-item"><div class="gate-check">✓</div><div class="gate-content"><div class="gate-title">\${item.check3 || 'Capture 100% Employer 401(k) Match'}</div><div class="gate-desc">Claim free guaranteed matching funds before extra payments.</div></div><div class="gate-status">DONE</div></div>
      <div class="gate-item"><div class="gate-check">✓</div><div class="gate-content"><div class="gate-title">\${item.check4 || 'Fund 3-to-6 Month HYSA Cash Reserve'}</div><div class="gate-desc">Deposit liquid cash into high-yield 4.5%+ APY account.</div></div><div class="gate-status">DONE</div></div>
      <div class="gate-item"><div class="gate-check">✓</div><div class="gate-content"><div class="gate-title">\${item.check5 || 'Automate Low-Cost Index Investments'}</div><div class="gate-desc">Set recurring monthly buys to double wealth every 7 years.</div></div><div class="gate-status">DONE</div></div>
    </div>
    <div class="verdict-box"><span class="verdict-text">🏆 <strong>Finmatrix Score:</strong> 5/5 Completed &bull; Ready for Long-Term Wealth Compounding</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">DOWNLOAD CHECKLIST →</div>
    </div>
  </div>\`;
}

// ==========================================
// 16. ARCH_SCHEDULE_BARS (Milestone Payoff Schedule Tracker)
// ==========================================
else {
  bodyHtml = \`
  <div class="pin-wrapper dark-theme schedule-bars-theme">
    <div class="header-box">
      <div class="pill-badge">📊 Payoff Schedule Tracker</div>
      <h1 class="title">\${headline}</h1>
      <p class="subtitle">\${subtitle}</p>
    </div>
    <div class="bars-container">
      <div class="bar-row">
        <div class="bar-header"><span>Month 01 (Starting Balance)</span><strong>$25,000</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width: 100%; background: #f43f5e;"></div></div>
      </div>
      <div class="bar-row">
        <div class="bar-header"><span>Month 08 (First Card Eradicated)</span><strong>$17,200</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width: 68%; background: #f59e0b;"></div></div>
      </div>
      <div class="bar-row">
        <div class="bar-header"><span>Month 16 (Halfway Freedom Mark)</span><strong>$9,800</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width: 39%; background: #38bdf8;"></div></div>
      </div>
      <div class="bar-row">
        <div class="bar-header"><span>Month 24 (100% Debt Sovereignty)</span><strong class="text-green">$0 (DEBT FREE)</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width: 0%; background: #10b981;"></div></div>
      </div>
    </div>
    <div class="verdict-box"><span class="verdict-text">🏆 <strong>Schedule Result:</strong> Slashes <strong>14 years</strong> off standard bank payoff schedule.</span></div>
    <div class="footer-bar">
      <div><span class="brand-name">Finmatrix</span><span class="brand-domain">finmatrix.cloud · Quantitative Finance</span></div>
      <div class="cta-pill">PROJECT YOUR TIMELINE →</div>
    </div>
  </div>\`;
}

const masterCss = \`
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 48px 45px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }

/* Themes & Backgrounds */
.daylight-theme { background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 42%, #f8fafc 75%, #e2e8f0 100%); color: #0f172a; }
.grid-theme { background: linear-gradient(180deg, #f5f5f4 0%, #fafaf9 40%, #f4f4f5 100%); color: #1c1917; }
.dark-theme { background: radial-gradient(circle at 50% 12%, #111827 0%, #030712 100%); color: #ffffff; }
.tablet-theme { background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 45%, #cbd5e1 100%); color: #0f172a; }
.mobile-theme { background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #030712 100%); color: #ffffff; }
.bento-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }
.comp-split-theme { background: radial-gradient(circle at 50% 10%, #111827 0%, #030712 100%); color: #ffffff; }
.comp-cards-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }
.before-after-theme { background: radial-gradient(circle at 50% 15%, #18181b 0%, #09090b 100%); color: #ffffff; }
.roadmap-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }
.stairs-theme { background: radial-gradient(circle at 50% 15%, #1e1b4b 0%, #09090b 100%); color: #ffffff; }
.chevron-theme { background: radial-gradient(circle at 50% 15%, #0c1e33 0%, #030712 100%); color: #ffffff; }
.pillars-theme { background: radial-gradient(circle at 50% 15%, #1c2541 0%, #0b132b 100%); color: #ffffff; }
.list-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }
.table-theme { background: radial-gradient(circle at 50% 15%, #1c2541 0%, #0b132b 100%); color: #ffffff; }
.checklist-gate-theme { background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%); color: #0f172a; }
.schedule-bars-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }

.desk-surface { position: absolute; bottom: 0; left: 0; right: 0; height: 540px; background: linear-gradient(180deg, #dfd5c6 0%, #d2c3b0 35%, #c5b39e 100%); border-top: 3px solid rgba(255, 255, 255, 0.7); box-shadow: inset 0 12px 30px rgba(0,0,0,0.06); }
.marble-surface { position: absolute; bottom: 0; left: 0; right: 0; height: 600px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%); border-top: 4px solid #ffffff; box-shadow: inset 0 20px 40px rgba(0,0,0,0.05); }

/* Headers */
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 12px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.08; letter-spacing: -1.2px; margin-bottom: 10px; color: #ffffff; }
.daylight-theme .main-title { font-family: 'Outfit', sans-serif; font-size: 68px; font-weight: 900; line-height: 1.05; letter-spacing: -1.5px; color: #0c2340; text-transform: uppercase; margin-bottom: 12px; }
.grid-theme .title, .checklist-gate-theme .title { color: #0f172a; }
.tablet-theme .title { color: #064e3b; }
.subtitle { font-size: 22px; font-weight: 600; color: #94a3b8; }
.grid-theme .subtitle, .checklist-gate-theme .subtitle { color: #64748b; }
.script-tag { font-family: 'Caveat', cursive; font-size: 40px; font-weight: 700; color: #0369a1; transform: rotate(-3deg); display: inline-block; margin-bottom: 2px; }
.tablet-theme .script-tag { color: #059669; }
.highlight-pill { display: inline-block; background: #fde047; color: #0f172a; font-size: 26px; font-weight: 800; padding: 9px 36px; border-radius: 999px; box-shadow: 0 4px 14px rgba(253, 224, 71, 0.45); margin-bottom: 20px; }
.badge-pill { display: inline-block; background: #10b981; color: #ffffff; font-size: 24px; font-weight: 800; padding: 8px 32px; border-radius: 999px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); margin-bottom: 24px; }

/* Footers */
.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); position: relative; z-index: 20; }
.grid-theme .footer-bar, .checklist-gate-theme .footer-bar { background: #ffffff; border: 1.5px solid #e2e8f0; }
.tablet-footer { background: #064e3b; box-shadow: 0 10px 25px rgba(6, 78, 59, 0.4); }
.brand-name { font-size: 20px; font-weight: 900; color: #ffffff; }
.grid-theme .brand-name, .checklist-gate-theme .brand-name { color: #0f172a; }
.brand-domain { font-size: 14px; color: #38bdf8; font-weight: 600; margin-left: 10px; }
.brand-sub { font-size: 14px; color: #6ee7b7; font-weight: 600; margin-left: 8px; }
.cta-pill { background: #0284c7; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }
.tablet-footer .cta-pill { background: #10b981; }

/* Laptop Workspace CSS */
.top-content { position: relative; z-index: 10; padding: 0 10px; text-align: center; }
.categories-row { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 18px; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.cat-icon-circle { width: 66px; height: 66px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); border: 2px solid #ffffff; background: #e0f2fe; }
.cat-label { font-size: 14px; font-weight: 800; color: #1e293b; }
.mid-hero-container { position: relative; z-index: 10; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 20px 20px 20px; flex: 1; }
.left-col { width: 270px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 30px; }
.script-checklist-title { font-family: 'Caveat', cursive; font-size: 38px; font-weight: 700; color: #0369a1; transform: rotate(-2deg); }
.checklist-item { display: flex; align-items: center; gap: 12px; }
.check-icon { width: 28px; height: 28px; border-radius: 50%; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; flex-shrink: 0; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.35); }
.check-text { font-size: 20px; font-weight: 800; color: #0c2340; }
.notepad-sticky { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; width: 215px; box-shadow: 0 10px 22px rgba(0,0,0,0.09); transform: rotate(-4deg); margin-top: 8px; }
.np-line1 { font-family: 'Caveat', cursive; font-size: 24px; font-weight: 700; color: #0284c7; line-height: 1.2; }
.np-line2 { font-family: 'Caveat', cursive; font-size: 21px; font-weight: 700; color: #64748b; }
.laptop-mockup-wrapper { position: relative; width: 615px; margin-bottom: 10px; }
.laptop-screen { width: 590px; height: 385px; background: #0f172a; border: 11px solid #1e293b; border-radius: 18px 18px 0 0; margin: 0 auto; box-shadow: 0 25px 50px rgba(0,0,0,0.35); overflow: hidden; position: relative; }
.laptop-webcam { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #475569; border-radius: 50%; z-index: 20; }
.laptop-display { width: 100%; height: 100%; background: #ffffff; display: flex; flex-direction: column; }
.app-header { background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 9px 16px; display: flex; align-items: center; justify-content: space-between; }
.app-brand { font-size: 14px; font-weight: 800; color: #0c2340; }
.app-dots { display: flex; gap: 5px; }
.app-dots span { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; }
.app-body { padding: 12px 16px; display: flex; gap: 14px; flex: 1; background: #ffffff; }
.app-inputs-col { width: 48%; display: flex; flex-direction: column; gap: 7px; }
.app-row { display: flex; flex-direction: column; gap: 2px; }
.app-label { font-size: 11px; font-weight: 700; color: #475569; }
.app-input { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 10px; font-size: 14px; font-weight: 800; color: #0f172a; }
.app-calc-btn { background: #0284c7; color: #ffffff; font-size: 13px; font-weight: 800; padding: 8px; border-radius: 6px; text-align: center; margin-top: 3px; box-shadow: 0 3px 8px rgba(2, 132, 199, 0.4); }
.app-results-col { width: 52%; display: flex; flex-direction: column; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
.res-hero { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; }
.res-hero-lbl { font-size: 11px; font-weight: 700; color: #166534; }
.res-hero-val { font-size: 26px; font-weight: 900; color: #15803d; letter-spacing: -0.5px; }
.res-sub-grid { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 6px; }
.res-sub-grid strong { color: #0f172a; font-weight: 800; }
.mini-schedule-table { width: 100%; border-collapse: collapse; font-size: 9.5px; margin-top: 2px; }
.mini-schedule-table th { background: #e2e8f0; color: #334155; font-weight: 800; padding: 3px 4px; text-align: right; }
.mini-schedule-table th:first-child { text-align: left; }
.mini-schedule-table td { padding: 3px 4px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #475569; font-weight: 600; }
.mini-schedule-table td:first-child { text-align: left; font-weight: 700; color: #0f172a; }
.laptop-base { width: 620px; height: 16px; background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%); border-radius: 0 0 16px 16px; position: relative; box-shadow: 0 18px 30px rgba(0,0,0,0.32); }
.laptop-notch { width: 80px; height: 5px; background: #475569; border-radius: 0 0 6px 6px; position: absolute; top: 0; left: 50%; transform: translateX(-50%); }
.bottom-brand-banner { position: relative; z-index: 20; background: #0c2340; padding: 22px 45px 28px 45px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 -10px 25px rgba(0,0,0,0.18); }
.brand-top-row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.brand-logo-icon { width: 38px; height: 38px; border-radius: 8px; background: #0284c7; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 22px; }
.brand-domain-text { font-family: 'Outfit', sans-serif; font-size: 38px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
.brand-tagline-text { font-size: 15px; font-weight: 700; color: #93c5fd; letter-spacing: 2px; text-transform: uppercase; }
.bottom-cta-ribbon { background: #0284c7; color: #ffffff; font-size: 16px; font-weight: 800; padding: 8px 34px; border-radius: 999px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.45); }

/* Tablet CSS */
.top-box { position: relative; z-index: 10; text-align: center; }
.mid-container { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; flex: 1; padding: 20px 0; }
.coffee-mug { width: 140px; height: 140px; border-radius: 50%; background: #ffffff; border: 12px solid #e2e8f0; box-shadow: 0 15px 35px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; }
.coffee-liquid { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #3d2314 0%, #1c0f08 100%); display: flex; align-items: center; justify-content: center; font-size: 28px; }
.tablet-mockup { width: 680px; height: 490px; background: #0f172a; border: 16px solid #1e293b; border-radius: 36px; box-shadow: 0 30px 60px rgba(0,0,0,0.35); overflow: hidden; display: flex; flex-direction: column; }
.tablet-screen { background: #ffffff; flex: 1; padding: 24px 28px; display: flex; flex-direction: column; justify-content: space-between; }
.tab-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 14px; }
.tab-logo { font-size: 16px; font-weight: 900; color: #064e3b; }
.tab-status { background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; }
.tab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.tab-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
.tab-card-lbl { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
.tab-card-val { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #0f172a; }
.card-green { background: #ecfdf5; border-color: #a7f3d0; }
.card-green .tab-card-val { color: #059669; }

/* Phone CSS */
.phone-scene { display: flex; justify-content: center; align-items: center; flex: 1; margin: 20px 0; }
.phone-frame { width: 440px; height: 760px; background: #020617; border: 14px solid #1e293b; border-radius: 54px; box-shadow: 0 35px 70px rgba(0,0,0,0.6); position: relative; overflow: hidden; padding: 18px; }
.phone-notch { width: 140px; height: 24px; background: #1e293b; border-radius: 0 0 16px 16px; position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 30; }
.phone-screen { background: #0f172a; border-radius: 36px; height: 100%; padding: 24px 20px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.08); }
.phone-app-bar { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #38bdf8; margin-top: 10px; }
.phone-metric-dial { text-align: center; margin: 20px 0; }
.dial-circle { width: 120px; height: 120px; border-radius: 50%; border: 6px solid #10b981; margin: 0 auto 12px auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(16,185,129,0.1); }
.dial-pct { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #34d399; }
.dial-lbl { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
.dial-stat-val { font-family: 'Outfit', sans-serif; font-size: 40px; font-weight: 900; color: #ffffff; }
.dial-stat-lbl { font-size: 13px; font-weight: 700; color: #94a3b8; }
.phone-slider-box { background: rgba(30, 41, 59, 0.6); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.slider-row { display: flex; justify-content: space-between; font-size: 12px; color: #cbd5e1; }
.slider-track { height: 6px; background: #334155; border-radius: 3px; overflow: hidden; }
.slider-fill { height: 100%; background: #38bdf8; }
.phone-btn { background: #10b981; color: #ffffff; text-align: center; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 14px; }

/* Bento Grid CSS */
.bento-container { display: flex; flex-direction: column; gap: 20px; margin: 25px 0; flex: 1; justify-content: center; }
.bento-hero-card { background: rgba(15, 23, 42, 0.85); border: 2px solid rgba(56, 189, 248, 0.4); border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
.bento-tag { font-size: 13px; font-weight: 800; letter-spacing: 2px; color: #38bdf8; margin-bottom: 8px; }
.bento-hero-num { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
.bento-hero-desc { font-size: 17px; font-weight: 600; color: #cbd5e1; }
.bento-split-row { display: flex; gap: 20px; }
.bento-sub-card { flex: 1; background: rgba(15, 23, 42, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 22px; }
.bento-sub-lbl { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }
.bento-sub-val { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 4px; }
.bento-sub-desc { font-size: 14px; font-weight: 600; color: #cbd5e1; }
.bento-accent { border-color: rgba(16, 185, 129, 0.4); }
.bento-full-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 18px; padding: 20px 24px; text-align: center; }
.bento-takeaway-lbl { font-size: 12px; font-weight: 800; color: #fde047; letter-spacing: 1.5px; margin-bottom: 4px; }
.bento-takeaway-text { font-size: 17px; font-weight: 700; color: #e2e8f0; }

/* Comparison Split CSS */
.split-container { display: flex; gap: 24px; position: relative; margin: 20px 0; flex: 1; align-items: stretch; }
.vs-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; border-radius: 50%; background: #f59e0b; color: #000000; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(245, 158, 11, 0.6); z-index: 20; border: 4px solid #030712; }
.col-side { flex: 1; border-radius: 24px; padding: 30px 26px; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid; position: relative; overflow: hidden; }
.col-side.col-a { background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%); border-color: rgba(244, 63, 94, 0.35); }
.col-side.col-b { background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); border-color: rgba(16, 185, 129, 0.5); box-shadow: 0 0 40px rgba(16, 185, 129, 0.2); }
.side-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 18px; margin-bottom: 18px; }
.side-tag { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
.col-a .side-tag { color: #fb7185; }
.col-b .side-tag { color: #34d399; }
.side-name { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 900; line-height: 1.1; color: #ffffff; }
.side-points { display: flex; flex-direction: column; gap: 18px; flex: 1; }
.point-row { background: rgba(0,0,0,0.25); border-radius: 14px; padding: 14px; border: 1px solid rgba(255,255,255,0.06); }
.point-lbl { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.point-val { font-size: 18px; font-weight: 800; color: #f1f5f9; line-height: 1.3; }
.side-hero-metric { text-align: center; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); }
.metric-lbl { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.metric-num { font-size: 36px; font-weight: 900; }
.col-a-color { color: #f43f5e; }
.col-b-color { color: #10b981; }
.verdict-box { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 18px; padding: 16px 24px; text-align: center; margin-bottom: 16px; }
.verdict-text { font-size: 18px; font-weight: 700; color: #cbd5e1; }
.verdict-text strong { color: #10b981; }

/* Comparison Cards Duo CSS */
.cards-duo-container { display: flex; gap: 24px; margin: 25px 0; flex: 1; align-items: stretch; }
.strategy-card { flex: 1; background: rgba(15, 23, 42, 0.7); border: 2px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 28px 24px; display: flex; flex-direction: column; justify-content: space-between; }
.card-winner { border-color: rgba(16, 185, 129, 0.5); background: linear-gradient(180deg, rgba(6,78,59,0.3) 0%, rgba(15,23,42,0.8) 100%); box-shadow: 0 10px 30px rgba(16,185,129,0.15); }
.strat-header { margin-bottom: 16px; }
.strat-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
.strat-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; }
.badge-warning { background: rgba(244, 63, 94, 0.2); color: #fb7185; }
.badge-winner { background: #10b981; color: #ffffff; }
.strat-bullets { display: flex; flex-direction: column; gap: 14px; flex: 1; margin: 15px 0; }
.strat-bullet { font-size: 16px; font-weight: 700; color: #cbd5e1; line-height: 1.35; }
.strat-metric-box { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; text-align: center; }
.sm-lbl { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.sm-val { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 900; }
.text-red { color: #f43f5e; }
.text-green { color: #10b981; }

/* Before After CSS */
.ba-stack { display: flex; flex-direction: column; gap: 16px; margin: 25px 0; flex: 1; justify-content: center; }
.ba-card { border-radius: 22px; padding: 24px 28px; border: 1.5px solid; }
.ba-before { background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%); border-color: rgba(244, 63, 94, 0.4); }
.ba-after { background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); border-color: rgba(16, 185, 129, 0.5); }
.ba-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.ba-tag { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; }
.ba-before .ba-tag { color: #fb7185; }
.ba-after .ba-tag { color: #34d399; }
.ba-status { font-size: 13px; font-weight: 800; }
.ba-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
.ba-desc { font-size: 15px; font-weight: 600; color: #cbd5e1; line-height: 1.4; margin-bottom: 12px; }
.ba-metric-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; font-size: 16px; font-weight: 700; color: #94a3b8; }
.ba-metric-row strong { font-size: 24px; font-family: 'Outfit', sans-serif; }
.ba-arrow-divider { text-align: center; font-size: 14px; font-weight: 800; letter-spacing: 2px; color: #f59e0b; }

/* Roadmap Timeline CSS */
.timeline-container { position: relative; margin: 25px 0; display: flex; flex-direction: column; gap: 24px; }
.timeline-rail { position: absolute; top: 40px; bottom: 40px; left: 45px; width: 4px; background: linear-gradient(180deg, #10b981 0%, #0284c7 60%, #a855f7 100%); z-index: 1; }
.stage-card { position: relative; z-index: 10; display: flex; gap: 24px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 22px 24px; backdrop-filter: blur(15px); }
.stage-badge-circle { width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; flex-shrink: 0; border: 3px solid #ffffff; box-shadow: 0 8px 20px rgba(0,0,0,0.5); }
.stage-1 .stage-badge-circle { background: #10b981; color: #ffffff; }
.stage-2 .stage-badge-circle { background: #0284c7; color: #ffffff; }
.stage-3 .stage-badge-circle { background: #6366f1; color: #ffffff; }
.stage-4 .stage-badge-circle { background: #a855f7; color: #ffffff; }
.stage-content { flex: 1; }
.stage-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.stage-phase { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8; }
.stage-amount { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #fde047; }
.stage-title { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
.stage-desc { font-size: 16px; font-weight: 600; color: #cbd5e1; line-height: 1.4; }

/* Stairs CSS */
.stairs-container { display: flex; flex-direction: column; gap: 16px; margin: 25px 0; flex: 1; justify-content: center; }
.stair-step { border-radius: 18px; padding: 22px 26px; border: 1.5px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: space-between; }
.step-1 { background: rgba(15, 23, 42, 0.7); width: 70%; align-self: flex-start; }
.step-2 { background: rgba(30, 41, 59, 0.8); width: 80%; align-self: flex-start; border-color: rgba(56, 189, 248, 0.4); }
.step-3 { background: rgba(49, 46, 129, 0.8); width: 90%; align-self: flex-start; border-color: rgba(99, 102, 241, 0.5); }
.step-4 { background: linear-gradient(90deg, #064e3b 0%, #047857 100%); width: 100%; border-color: rgba(16, 185, 129, 0.6); box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); }
.stair-badge { font-size: 12px; font-weight: 800; letter-spacing: 1px; color: #38bdf8; }
.step-4 .stair-badge { color: #a7f3d0; }
.stair-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 900; color: #ffffff; }
.stair-metric { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #fde047; }

/* Chevron CSS */
.chevron-list { display: flex; flex-direction: column; gap: 16px; margin: 25px 0; flex: 1; justify-content: center; }
.chevron-card { background: rgba(15, 23, 42, 0.75); border: 1.5px solid rgba(255,255,255,0.12); border-left: 8px solid; border-radius: 18px; padding: 20px 24px; }
.ch-1 { border-left-color: #38bdf8; }
.ch-2 { border-left-color: #10b981; }
.ch-3 { border-left-color: #f59e0b; }
.ch-4 { border-left-color: #a855f7; }
.ch-num { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8; margin-bottom: 4px; }
.ch-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 4px; }
.ch-desc { font-size: 15px; font-weight: 600; color: #cbd5e1; }

/* Grid 6-Cards CSS */
.grid-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
.grid-card { background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; }
.card-icon-badge { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px; }
.card-1 .card-icon-badge { background: #fee2e2; }
.card-2 .card-icon-badge { background: #e0e7ff; }
.card-3 .card-icon-badge { background: #dcfce7; }
.card-4 .card-icon-badge { background: #fef3c7; }
.card-5 .card-icon-badge { background: #f3e8ff; }
.card-6 .card-icon-badge { background: #ccfbf1; }
.card-num { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.card-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px; line-height: 1.2; }
.card-desc { font-size: 15px; font-weight: 600; color: #475569; line-height: 1.4; }
.takeaway-banner { background: #0f172a; color: #ffffff; border-radius: 18px; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.tw-text { font-size: 18px; font-weight: 700; color: #e2e8f0; }
.tw-text strong { color: #38bdf8; }

/* Pillars 4 CSS */
.pillars-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 25px 0; }
.pillar-card { background: rgba(15, 23, 42, 0.75); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 30px 26px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 15px 35px rgba(0,0,0,0.4); backdrop-filter: blur(15px); }
.p1 { border-color: rgba(56, 189, 248, 0.4); }
.p2 { border-color: rgba(16, 185, 129, 0.4); }
.p3 { border-color: rgba(245, 158, 11, 0.4); }
.p4 { border-color: rgba(168, 85, 247, 0.4); }
.p-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.p-icon { font-size: 32px; }
.p-pct { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 900; }
.p1 .p-pct { color: #38bdf8; }
.p2 .p-pct { color: #34d399; }
.p3 .p-pct { color: #fde047; }
.p4 .p-pct { color: #c084fc; }
.p-title { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; color: #ffffff; margin-bottom: 8px; }
.p-desc { font-size: 16px; font-weight: 600; color: #cbd5e1; line-height: 1.4; }

/* Numbered List CSS */
.num-list-container { display: flex; flex-direction: column; gap: 16px; margin: 25px 0; flex: 1; justify-content: center; }
.num-row { display: flex; gap: 20px; align-items: center; background: rgba(15, 23, 42, 0.75); border: 1.5px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 20px 24px; }
.num-badge { width: 56px; height: 56px; border-radius: 16px; background: #0284c7; color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); }
.num-text { flex: 1; }
.num-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 900; color: #ffffff; margin-bottom: 4px; }
.num-desc { font-size: 15px; font-weight: 600; color: #94a3b8; }

/* Table Matrix CSS */
.table-card { background: rgba(15, 23, 42, 0.75); border: 1.5px solid rgba(255, 255, 255, 0.15); border-radius: 24px; overflow: hidden; margin: 25px 0; box-shadow: 0 25px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { background: #1e293b; color: #cbd5e1; font-size: 15px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.data-table td { padding: 20px 20px; font-size: 17px; font-weight: 700; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.row-highlight { background: rgba(16, 185, 129, 0.15); }
.row-highlight td { color: #ffffff; font-weight: 800; border-top: 1px solid rgba(16, 185, 129, 0.4); border-bottom: 1px solid rgba(16, 185, 129, 0.4); }
.tag-winner { background: #10b981; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; margin-left: 8px; display: inline-block; vertical-align: middle; }
.rate-val { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #38bdf8; }
.row-highlight .rate-val { color: #34d399; font-size: 26px; }
.summary-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 20px 26px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.sum-left { display: flex; flex-direction: column; gap: 4px; }
.sum-title { font-size: 18px; font-weight: 800; color: #ffffff; }
.sum-desc { font-size: 14px; font-weight: 600; color: #94a3b8; }
.sum-badge { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #fde047; }

/* Checklist Gate CSS */
.gate-checklist-box { display: flex; flex-direction: column; gap: 16px; margin: 25px 0; flex: 1; justify-content: center; }
.gate-item { display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 18px 24px; box-shadow: 0 6px 16px rgba(0,0,0,0.03); }
.gate-check { width: 36px; height: 36px; border-radius: 50%; background: #10b981; color: #ffffff; font-size: 18px; font-weight: 900; display: flex; align-items: center; justify-content: center; margin-right: 18px; flex-shrink: 0; }
.gate-content { flex: 1; }
.gate-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
.gate-desc { font-size: 14px; font-weight: 600; color: #64748b; }
.gate-status { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 4px 14px; border-radius: 999px; }

/* Schedule Bars CSS */
.bars-container { display: flex; flex-direction: column; gap: 20px; margin: 25px 0; flex: 1; justify-content: center; }
.bar-row { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 18px 22px; }
.bar-header { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #cbd5e1; margin-bottom: 10px; }
.bar-header strong { font-family: 'Outfit', sans-serif; font-size: 20px; color: #ffffff; }
.progress-track { height: 12px; background: #1e293b; border-radius: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 6px; }
\`;

const pinHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Finmatrix Dynamic Pin Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>\${masterCss}</style>
</head>
<body>
\${bodyHtml}
</body>
</html>\`;

return [{
  json: {
    ...item,
    pinHtml: pinHtml,
    renderViewport: { width: 1000, height: 1500 },
    imageGeneratedAt: new Date().toISOString()
  }
}];
`;
}

// Node 13 (Gemini Description Prompt - Strictly Finmatrix Branded)
const n13 = wf.nodes.find(n => n.name.includes('Generate Pin SEO Title') || n.name.includes('Generate SEO Description') || n.name.includes('Generate Pin Copy'));
if (n13) {
  n13.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n13.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are an elite Pinterest SEO Strategist and Financial Copywriter for Finmatrix (https://finmatrix.cloud).
A high-converting vertical educational infographic (1000x1500) has been generated for this pin.

CRITICAL BRAND REQUIREMENT:
1. The brand is strictly "Finmatrix" (https://finmatrix.cloud).
2. NEVER mention or reference any competitor brand names (like MyUSFinance, NerdWallet, Bankrate, SmartAsset, etc.) anywhere.
3. Your copy MUST be directly optimized to rank on Pinterest Search for: "\${$json.targetKeyword}".

INFOGRAPHIC DETAILS:
- Target Search Keyword: "\${$json.targetKeyword}"
- Intent: "\${$json.intentType}"
- Visual Title on Graphic: "\${$json.headlineOnImage}"
- Subtitle on Graphic: "\${$json.subtitleOnImage}"
- Breakdown: "\${$json.infographicBreakdown}"

TARGET PINTEREST BOARD: \${$json.targetBoard}
DESTINATION LINK: \${$json.destinationUrl}

STRICT FORMAT & COMPLIANCE RULES:
1. pinTitle: Under 90 characters, must include the search query topic: "\${$json.targetKeyword}".
2. hook: Exactly 1 punchy sentence answering the search query (max 110 chars).
3. bullet1: 1 concise quantitative rule or benefit from the graphic (max 65 chars).
4. bullet2: 1 practical milestone, rule of thumb, or benchmark (max 65 chars).
5. altText: Screen reader description under 100 characters.

RETURN ONLY VALID JSON wrapped in a single json code block:
{
  "pinTitle": "...",
  "hook": "...",
  "bullet1": "...",
  "bullet2": "...",
  "altText": "..."
}
\`
        }
      ]
    }
  ]
} }}`;
}

// Node 14 (Format & Sanitize Pin Description)
const n14 = wf.nodes.find(n => n.name.includes('Parse & Format Pin Data') || n.name.includes('Format & Sanitize Pin Description'));
if (n14) {
  n14.parameters.jsCode = `// PARSE & FORMAT PIN DATA (STRICT BRAND SANITIZER & GUARANTEED HASHTAGS)
let rawText = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const prev = $('Inspect Asset Status & Validation').item.json || {};
const destUrl = prev.destinationUrl || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';

// SANITIZE ANY COMPETITOR DOMAINS OR BRANDS
rawText = rawText.replace(/myusfinance(\.com)?/gi, 'Finmatrix')
                 .replace(/nerdwallet(\.com)?/gi, 'Finmatrix')
                 .replace(/bankrate(\.com)?/gi, 'Finmatrix')
                 .replace(/smartasset(\.com)?/gi, 'Finmatrix');

const fence = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96);
rawText = rawText.split(fence + 'json').join('').split(fence).join('').trim();

let parsed = {};
try {
  parsed = JSON.parse(rawText);
} catch (e) {
  parsed = {
    pinTitle: ((prev.headlineOnImage || prev.topic || 'Finmatrix') + ': ' + (prev.subtitleOnImage || 'Free Financial Guide')).substring(0, 90).trim(),
    hook: 'Discover the exact mathematical numbers with Finmatrix.',
    bullet1: 'Calculate exact payoff dates and slash compounding interest.',
    bullet2: 'Download free Excel toolkits with zero sign-up required.',
    altText: 'Infographic for Finmatrix ' + (prev.targetKeyword || 'Calculator')
  };
}

let pinTitle = (parsed.pinTitle || prev.headlineOnImage || 'Finmatrix Financial Guide').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
pinTitle = pinTitle.replace(/myusfinance(\.com)?/gi, 'Finmatrix');
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

let hook = (parsed.hook || ('Discover the exact numbers for ' + (prev.targetKeyword || 'finances') + ' on Finmatrix.')).replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
hook = hook.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 115);

let b1 = (parsed.bullet1 || 'Deploy quantitative rules to halt compounding finance charges.').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
b1 = b1.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

let b2 = (parsed.bullet2 || 'Calculate payoff dates and investment growth in real time.').replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
b2 = b2.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

const ctaLine = '👉 Free Tool & Toolkit: ' + destUrl;
const hashtags = '#personalfinance #financialfreedom #debtfree #moneytips #finmatrix';

const pinDescription = hook + '\\n\\n• ' + b1 + '\\n• ' + b2 + '\\n\\n' + ctaLine + '\\n\\n' + hashtags;

let altText = (parsed.altText || ('Infographic showing Finmatrix ' + (prev.headlineOnImage || 'financial calculator'))).replace(/[*_#]/g, '').split(String.fromCharCode(96)).join('').trim();
altText = altText.replace(/myusfinance(\.com)?/gi, 'Finmatrix');
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
  n15.parameters.documentId.value = FINMATRIX_SHEET_ID;
  n15.parameters.sheetName.value = "Finmatrix_Pinterest_Queue";
}

// Node 16 (Send Action Kit Email - PRIMARY INBOX OPTIMIZED)
const n16 = wf.nodes.find(n => n.name.includes('Send Action Kit Email'));
if (n16) {
  n16.parameters.headerParameters = {
    parameters: [
      { name: "api-key", value: "YOUR_BREVO_API_KEY" },
      { name: "Content-Type", value: "application/json" },
      { name: "X-Mailin-Tag", value: "finmatrix-internal-briefing" },
      { name: "X-Priority", value: "1" },
      { name: "X-Auto-Response-Suppress", value: "All" }
    ]
  };
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

// Wire connections cleanly
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
fs.writeFileSync(outPath, JSON.stringify(wf, null, 2), 'utf8');
console.log('SUCCESS: Written updated 16-archetype combinatorial workflow to', outPath);
