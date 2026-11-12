import fs from 'fs';

// 1. Read source workflow to preserve node graph, IDs, credentials, and coordinates
const sourcePath = 'C:\\Users\\Rakesh\\.gemini\\antigravity\\brain\\0b073859-daa6-48de-a2bb-926d79f02937\\.user_uploaded\\media_1794424387069_bf7bb5a5.json';
const sourceWf = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// 2. Extract and SANITIZE keywords from CSV files (PURGE ALL COMPETITOR BRANDS)
function parseCsv(filePath, defaultPillar, defaultUrl) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(/[,\t]/).map(h => h.replace(/[\"']/g, '').trim().toLowerCase());
  
  const kwIdx = headers.findIndex(h => h === 'keyword' || h.includes('keyword'));
  const volIdx = headers.findIndex(h => h === 'search volume' || h === 'volume');
  const kdIdx = headers.findIndex(h => h === 'keyword difficulty' || h === 'kd');
  const intentIdx = headers.findIndex(h => h === 'intent');
  
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,\t]/).map(p => p.replace(/[\"']/g, '').trim());
    if (parts.length <= kwIdx) continue;
    let kw = parts[kwIdx];
    if (!kw || kw.length < 3) continue;

    // Purge competitor domain names and brands
    kw = kw.replace(/myusfinance(\.com)?/gi, '')
           .replace(/nerdwallet(\.com)?/gi, '')
           .replace(/bankrate(\.com)?/gi, '')
           .replace(/smartasset(\.com)?/gi, '')
           .replace(/calculator\.net/gi, '')
           .replace(/creditkarma(\.com)?/gi, '')
           .replace(/\s+/g, ' ')
           .trim();

    if (kw.length < 3) continue;

    const vol = parseInt(parts[volIdx], 10) || 100;
    const kd = Math.round(parseFloat(parts[kdIdx]) || 15);
    const intent = (intentIdx !== -1 && parts[intentIdx]) ? parts[intentIdx] : 'Informational';
    results.push({ keyword: kw, volume: vol, kd: kd, intent, pillar: defaultPillar, targetUrl: defaultUrl });
  }
  return results;
}

const c1 = parseCsv('data/credit-card_saved-keywords_2026-11-06.csv', 'Debt & Credit Payoff', 'https://finmatrix.cloud/calculators/debt-elimination-planner.html');
const c2 = parseCsv('data/CERTIFICATE-OD-DEPOSITS-CD_saved-keywords_2026-11-08.csv', 'Savings & CDs', 'https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html');
const c3 = parseCsv('data/401k-growth-calculator_saved-keywords_2026-11-08.csv', 'Retirement & 401(k)', 'https://finmatrix.cloud/calculators/401k-calculator.html');

const coreHighIntent = [
  { keyword: "amortization schedule calculator extra payments", volume: 22000, kd: 16, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/mortgage-calculator.html" },
  { keyword: "debt snowball vs avalanche calculator", volume: 14800, kd: 12, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-elimination-planner.html" },
  { keyword: "credit card payoff calculator with extra payments", volume: 18100, kd: 14, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/credit-card-payoff-calculator.html" },
  { keyword: "mortgage amortization schedule calculator with extra principal", volume: 22000, kd: 16, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/mortgage-calculator.html" },
  { keyword: "how much house can i afford calculator", volume: 49500, kd: 22, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/home-affordability-calculator.html" },
  { keyword: "rent vs buy calculator 2026", volume: 27100, kd: 19, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/rent-vs-buy-calculator.html" },
  { keyword: "refinance break even calculator", volume: 12100, kd: 15, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/refinance-break-even-calculator.html" },
  { keyword: "hysa vs cd calculator rates", volume: 9900, kd: 8, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html" },
  { keyword: "compound interest calculator daily monthly", volume: 33100, kd: 18, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "emergency fund blueprint 3 to 6 months", volume: 8100, kd: 9, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/emergency-fund-calculator.html" },
  { keyword: "401k growth calculator with employer match", volume: 12100, kd: 11, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/401k-calculator.html" },
  { keyword: "roth ira vs traditional ira calculator", volume: 14800, kd: 15, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/roth-vs-traditional-ira-calculator.html" },
  { keyword: "fire calculator financial independence retire early", volume: 14800, kd: 17, intent: "Informational", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/fire-calculator.html" },
  { keyword: "take home paycheck calculator after taxes", volume: 60500, kd: 24, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/paycheck-calculator.html" },
  { keyword: "hourly to salary calculator with overtime", volume: 27100, kd: 19, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/hourly-to-salary-calculator.html" },
  { keyword: "bonus tax calculator net amount", volume: 14800, kd: 18, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/bonus-tax-calculator.html" },
  { keyword: "car payment calculator with interest and trade in", volume: 33100, kd: 21, intent: "Commercial", pillar: "Auto & Personal Loans", targetUrl: "https://finmatrix.cloud/calculators/auto-loan-calculator.html" },
  { keyword: "debt to income ratio calculator for mortgage", volume: 18100, kd: 13, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-to-income-calculator.html" },
  { keyword: "fd interest calculator fixed deposit maturity", volume: 40500, kd: 14, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "6 levers to build wealth faster", volume: 5400, kd: 7, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" }
];

const allParsed = [...coreHighIntent, ...c1, ...c2, ...c3];
const uniqueMap = new Map();
allParsed.forEach(item => {
  const k = item.keyword.toLowerCase().trim();
  if (!uniqueMap.has(k) && !k.includes('myusfinance') && !k.includes('nerdwallet') && !k.includes('.com') && !k.includes('.net')) {
    uniqueMap.set(k, item);
  }
});
const masterKeywords = Array.from(uniqueMap.values());
console.log(`Loaded ${masterKeywords.length} sanitized master keywords (100% competitor-free).`);

// 3. Clone workflow
const wf = JSON.parse(JSON.stringify(sourceWf));
wf.name = "Finmatrix - Pinterest Marketing Automation (Evergreen SEO Pins & Lead Engine)";

const FINMATRIX_SHEET_ID = "1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k";

// Node 2 (Fetch Boards Registry)
const n2 = wf.nodes.find(n => n.name.includes('Fetch Boards Registry'));
if (n2) {
  n2.parameters.documentId.value = FINMATRIX_SHEET_ID;
  n2.parameters.sheetName.value = "Finmatrix_Pinterest_Boards";
  n2.alwaysOutputData = true;
  n2.continueOnFail = true;
}

// Node 4 (Fetch Recent Queue History)
const n4 = wf.nodes.find(n => n.name.includes('Fetch Recent Queue History'));
if (n4) {
  n4.parameters.documentId.value = FINMATRIX_SHEET_ID;
  n4.parameters.sheetName.value = "Finmatrix_Pinterest_Queue";
  n4.alwaysOutputData = true;
  n4.continueOnFail = true;
}

// Node 5 (DYNAMIC SEARCH INTENT & ARCHETYPE SELECTOR)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX DYNAMIC INTENT & MULTI-ARCHETYPE ENGINE
// Selects across ${masterKeywords.length} verified SEMrush keywords.
// Dynamically routes to 5 Layout Families & 8 Curated Luxury Color Palettes!

const masterKeywords = ${JSON.stringify(masterKeywords, null, 2)};

const defaultBoardsRegistry = [
  {
    "BoardID": "BOARD-01",
    "BoardName": "Finmatrix: Debt Elimination & Credit Payoff",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/debt-elimination-credit-payoff/",
    "BoardDescription": "Mathematically proven strategies to crush credit cards, loan balances, and APR finance charges with free calculators and spreadsheets.",
    "PrimaryKeyword": "debt snowball vs avalanche calculator",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/debt-elimination-planner.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-02",
    "BoardName": "Finmatrix: High-Yield Savings & CDs",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/high-yield-savings-cds/",
    "BoardDescription": "Maximize compound interest with high-yield savings accounts, CD ladder strategies, and emergency fund growth calculators.",
    "PrimaryKeyword": "hysa vs cd calculator",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-03",
    "BoardName": "Finmatrix: 401(k), Roth IRA & Retirement",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/401k-retirement-wealth/",
    "BoardDescription": "Accelerate wealth building with 401(k) growth projections, Roth IRA contribution limits, and safe retirement withdrawal calculators.",
    "PrimaryKeyword": "401k growth calculator with match",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/401k-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-04",
    "BoardName": "Finmatrix: Mortgage & Real Estate Calculators",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/mortgage-real-estate-calculators/",
    "BoardDescription": "Save tens of thousands in mortgage interest with amortization schedules, bi-weekly payment ladders, and home affordability estimators.",
    "PrimaryKeyword": "mortgage amortization schedule calculator with extra principal",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/mortgage-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-05",
    "BoardName": "Finmatrix: Paycheck, Salary & Tax Calculators",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/paycheck-salary-tax-calculators/",
    "BoardDescription": "Accurate take-home paycheck calculators, hourly to salary conversions, bonus tax withholding, and 1099 self-employment tax estimators.",
    "PrimaryKeyword": "take home paycheck calculator after taxes",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/paycheck-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-06",
    "BoardName": "Finmatrix: Auto Loans & Vehicle Financing",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/auto-loans-car-payment-calculators/",
    "BoardDescription": "Calculate true monthly car payments, total loan interest costs, and early payoff savings.",
    "PrimaryKeyword": "car payment calculator with interest and trade in",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/auto-loan-calculator.html",
    "IsActive": true
  }
];

function mapKeywordToBoard(kw) {
  const k = (kw || '').toLowerCase();
  if (k.includes('401k') || k.includes('retire') || k.includes('roth') || k.includes('ira') || k.includes('pension') || k.includes('fire')) {
    return 'Finmatrix: 401(k), Roth IRA & Retirement';
  }
  if (k.includes('cd') || k.includes('certificate of deposit') || k.includes('deposit') || k.includes('hysa') || k.includes('savings') || k.includes('compound interest') || k.includes('emergency') || k.includes('fd ')) {
    return 'Finmatrix: High-Yield Savings & CDs';
  }
  if (k.includes('mortgage') || k.includes('amortiz') || k.includes('house') || k.includes('home afford') || k.includes('rent vs buy') || k.includes('refinance')) {
    return 'Finmatrix: Mortgage & Real Estate Calculators';
  }
  if (k.includes('paycheck') || k.includes('salary') || k.includes('hourly') || k.includes('bonus') || k.includes('take home') || k.includes('w2') || k.includes('1099') || k.includes('tax')) {
    return 'Finmatrix: Paycheck, Salary & Tax Calculators';
  }
  if (k.includes('auto') || k.includes('car') || k.includes('vehicle') || k.includes('car payment')) {
    return 'Finmatrix: Auto Loans & Vehicle Financing';
  }
  return 'Finmatrix: Debt Elimination & Credit Payoff';
}

// 1. Boards List
let boardsList = [...defaultBoardsRegistry];
try {
  const sheetData = $('Consolidate Boards Registry').first()?.json?.boardsFromSheet || [];
  if (Array.isArray(sheetData) && sheetData.length > 0) {
    const sheetBoardMap = {};
    sheetData.forEach(b => {
      const name = b.BoardName || b.board_name;
      if (name) sheetBoardMap[name.trim().toLowerCase()] = b;
    });
    boardsList = defaultBoardsRegistry.map(def => {
      const override = sheetBoardMap[def.BoardName.trim().toLowerCase()];
      if (override) {
        return { ...def, ...override, IsActive: override.IsActive !== false && override.IsActive !== 'FALSE' };
      }
      return def;
    }).filter(b => b.IsActive !== false);
  }
} catch (e) {
  boardsList = defaultBoardsRegistry;
}

// 2. Fetch past queue history for 30-Day Rolling Cooldown & Variety Protection
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

// 3. DETECT SEARCH INTENT & MAP TO VISUAL ARCHETYPE FAMILIES
const kwLower = targetKeyword.toLowerCase();
let intentType = 'CALCULATOR';

if (kwLower.includes(' vs ') || kwLower.includes('versus') || kwLower.includes(' or ') || kwLower.includes('difference between') || kwLower.includes('compare')) {
  intentType = 'COMPARE';
} else if (kwLower.includes('blueprint') || kwLower.includes('steps') || kwLower.includes('roadmap') || kwLower.includes('timeline') || kwLower.includes('phases') || kwLower.includes('how to build') || kwLower.includes('emergency fund')) {
  intentType = 'ROADMAP';
} else if (kwLower.includes('rule') || kwLower.includes('levers') || kwLower.includes('framework') || kwLower.includes('tips') || kwLower.includes('ways') || kwLower.includes('cheat sheet') || kwLower.includes('hacks')) {
  intentType = 'FRAMEWORK';
} else if (kwLower.includes('rates') || kwLower.includes('table') || kwLower.includes('matrix') || kwLower.includes('checklist') || kwLower.includes('schedule') || kwLower.includes('audit')) {
  intentType = 'TABLE_CHECKLIST';
}

// 4. PICK SUB-VARIETY WITHIN THE DETECTED INTENT
const archetypeRegistry = {
  CALCULATOR: [
    { id: 'ARCH_LAPTOP_WORKSPACE', name: 'Bright Laptop Workspace Pin', badge: 'FREE CALCULATOR' },
    { id: 'ARCH_CALC_SHIELD', name: '3D Gold Wealth Shield Simulator', badge: 'INSTANT SIMULATOR' },
    { id: 'ARCH_MINIMAL_CARD', name: 'Editorial Financial Card Display', badge: 'FINANCIAL TOOL' }
  ],
  COMPARE: [
    { id: 'ARCH_COMP_SPLIT', name: 'Dual-Column High-Contrast Split Comparison', badge: 'STRATEGY COMPARISON' },
    { id: 'ARCH_COMP_CARDS', name: 'Side-by-Side Strategy Cards', badge: 'HEAD-TO-HEAD' }
  ],
  ROADMAP: [
    { id: 'ARCH_ROADMAP_TIMELINE', name: '4-Phase Stepped Financial Roadmap', badge: 'FINANCIAL BLUEPRINT' },
    { id: 'ARCH_ROADMAP_STAIRS', name: 'Ascending Wealth Milestone Ladder', badge: 'STEP-BY-STEP' }
  ],
  FRAMEWORK: [
    { id: 'ARCH_GRID_6_CARDS', name: '6-Card Editorial Cheat Sheet Grid', badge: 'WEALTH LEVERS' },
    { id: 'ARCH_GRID_4_PILLARS', name: '4-Pillar Financial Allocation Matrix', badge: 'FINANCIAL FRAMEWORK' }
  ],
  TABLE_CHECKLIST: [
    { id: 'ARCH_TABLE_MATRIX', name: 'SaaS Financial Rate Comparison Matrix', badge: 'COMPARISON MATRIX' },
    { id: 'ARCH_CHECKLIST_GATE', name: '5-Point Financial Action Checklist', badge: 'ACTION CHECKLIST' }
  ]
};

const candidates = archetypeRegistry[intentType] || archetypeRegistry.CALCULATOR;
const lastArch = pastArchetypes[pastArchetypes.length - 1];
const filteredCandidates = candidates.filter(c => c.id !== lastArch);
const chosenArch = filteredCandidates[Math.floor(Math.random() * filteredCandidates.length)] || candidates[0];

// 5. PICK FROM 8 DYNAMIC COLOR PALETTES
const palettes = [
  'PALETTE_DAYLIGHT_DESK',
  'PALETTE_EMERALD_WEALTH',
  'PALETTE_ROYAL_NAVY_GOLD',
  'PALETTE_MIDNIGHT_AMETHYST',
  'PALETTE_CARBON_SLATE',
  'PALETTE_WARM_EDITORIAL',
  'PALETTE_PACIFIC_TEAL',
  'PALETTE_BORDEAUX_GOLD'
];
const chosenPalette = palettes[Math.floor(Math.random() * palettes.length)];

// 6. Generate deterministic unique PinID & short tracking URL
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

// Node 6 (Gemini API Ideation Prompt - MULTI-ARCHETYPE SCHEMA)
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
- sideATitle: (e.g. "Debt Snowball" or "Minimum Payments")
- sideATag: (e.g. "Psychological Method")
- sideBTitle: (e.g. "Debt Avalanche" or "Accelerated Payoff")
- sideBTag: (e.g. "Mathematical Winner")
- point1A, point1B: (Target strategy comparison)
- point2A, point2B: (Primary benefit comparison)
- point3A, point3B: (Finance cost comparison)
- metricNumA, metricNumB: (e.g. "$12,480" vs "$4,120")
- verdictText: (1-sentence quantitative summary showing which method wins)

IF INTENT IS 'ROADMAP' (\${$json.pinStyle}):
- phase1Title, phase1Amount, phase1Desc: (Phase 1 milestone)
- phase2Title, phase2Amount, phase2Desc: (Phase 2 milestone)
- phase3Title, phase3Amount, phase3Desc: (Phase 3 milestone)
- phase4Title, phase4Amount, phase4Desc: (Phase 4 milestone)

IF INTENT IS 'FRAMEWORK' (\${$json.pinStyle}):
- card1Title, card1Desc: (Actionable Lever 1)
- card2Title, card2Desc: (Actionable Lever 2)
- card3Title, card3Desc: (Actionable Lever 3)
- card4Title, card4Desc: (Actionable Lever 4)
- card5Title, card5Desc: (Actionable Lever 5)
- card6Title, card6Desc: (Actionable Lever 6)
- takeaway: (1-sentence golden rule)

IF INTENT IS 'TABLE_CHECKLIST' (\${$json.pinStyle}):
- col1, col2, col3, col4: (Table Column Headers)
- row1: [Item, Metric, Speed, Feature]
- row2: [Item, Metric, Speed, Feature]
- row3Highlight: [Winner Item, Winner Metric, Winner Speed, Winner Feature]
- row4: [Item, Metric, Speed, Feature]
- summaryCallout: (Quantitative takeaway)

IF INTENT IS 'CALCULATOR' (\${$json.pinStyle}):
- input1Label, input1Val: (e.g. "Loan Amount:", "$ 250,000")
- input2Label, input2Val: (e.g. "Interest Rate (%):", "6.5%")
- input3Label, input3Val: (e.g. "Loan Term:", "30 Years")
- heroResultLabel, heroResultVal: (e.g. "Monthly Payment", "$1,580.74")
- subResult1Label, subResult1Val: (e.g. "Total Paid:", "$569,064")
- subResult2Label, subResult2Val: (e.g. "Interest:", "$319,064")

RETURN ONLY VALID JSON wrapped in a single \\\`\\\`\\\`json markdown block.
\`
        }
      ]
    }
  ]
} }}`;
}

// Node 7 (Validate Brief & Sanitize Competitor Names)
const n7 = wf.nodes.find(n => n.name.includes('Validate Topic'));
if (n7) {
  n7.parameters.jsCode = `// VALIDATE BRIEF & ENFORCE STRICT FINMATRIX BRANDING
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
let rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const kw = prev.targetKeyword || 'Financial Calculator';
const pillar = (prev.pillar || '').toLowerCase();
const intent = prev.intentType || 'CALCULATOR';

// Context-aware defaults
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
  check1: 'Monthly Payment', check2: 'Total Interest', check3: 'Loan Balance', check4: 'Amortization Schedule'
};

// Purge any competitor brand names
rawGemini = rawGemini.replace(/myusfinance(\.com)?/gi, 'Finmatrix')
                     .replace(/nerdwallet(\.com)?/gi, 'Finmatrix')
                     .replace(/bankrate(\.com)?/gi, 'Finmatrix')
                     .replace(/smartasset(\.com)?/gi, 'Finmatrix');

let cleanJson = rawGemini.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();
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
const breakdown = \`Archetype: \${finalData.pinStyle} | Tool: \${finalData.calcHeaderTitle} | Headline: \${finalData.headlineOnImage}\`;

return [{
  json: {
    ...finalData,
    infographicBreakdown: breakdown,
    imageFilename: (prev.pinId || 'PIN') + '_' + (prev.targetKeyword || 'finmatrix').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30) + '.png'
  }
}];
`;
}

// Node 8 (DYNAMIC MULTI-ARCHETYPE & COLOR STUDIO ENGINE)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = `// FINMATRIX MULTI-ARCHETYPE & DYNAMIC COLOR STUDIO ENGINE
const item = $json;
const arch = item.pinStyle || 'ARCH_LAPTOP_WORKSPACE';
const palette = item.paletteTheme || 'PALETTE_DAYLIGHT_DESK';

const headline = item.headlineOnImage || 'Financial Calculator';
const subtitle = item.subtitleOnImage || 'Calculate exact numbers, compound yield and interest';
const calcHeader = item.calcHeaderTitle || 'Finmatrix Financial Engine';

let bodyHtml = '';

// 1. LAPTOP WORKSPACE ARCHETYPE
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

// 2. COMPARISON SPLIT SCREEN ARCHETYPE
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
      <div class="cta-pill">FREE CALCULATOR & TOOLKIT →</div>
    </div>
  </div>\`;
}

// 3. STEPPED GROWTH ROADMAP ARCHETYPE
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

// 4. 6-CARD CHEAT SHEET GRID ARCHETYPE
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

// 5. DEFAULT / TABLE COMPARISON MATRIX ARCHETYPE
else {
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

const masterCss = \`
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 48px 45px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }

/* Light Theme (Daylight Desk & Grid) */
.daylight-theme { background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 42%, #f8fafc 75%, #e2e8f0 100%); color: #0f172a; }
.grid-theme { background: linear-gradient(180deg, #f5f5f4 0%, #fafaf9 40%, #f4f4f5 100%); color: #1c1917; }
.desk-surface { position: absolute; bottom: 0; left: 0; right: 0; height: 540px; background: linear-gradient(180deg, #dfd5c6 0%, #d2c3b0 35%, #c5b39e 100%); border-top: 3px solid rgba(255, 255, 255, 0.7); box-shadow: inset 0 12px 30px rgba(0,0,0,0.06); }

/* Dark Themes */
.dark-theme { background: radial-gradient(circle at 50% 12%, #111827 0%, #030712 100%); color: #ffffff; }
.roadmap-theme { background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); color: #ffffff; }
.table-theme { background: radial-gradient(circle at 50% 15%, #1c2541 0%, #0b132b 100%); color: #ffffff; }

/* Headers */
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 12px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.08; letter-spacing: -1.2px; margin-bottom: 10px; color: #ffffff; }
.daylight-theme .main-title { font-family: 'Outfit', sans-serif; font-size: 68px; font-weight: 900; line-height: 1.05; letter-spacing: -1.5px; color: #0c2340; text-transform: uppercase; margin-bottom: 12px; }
.grid-theme .title { color: #0f172a; }
.subtitle { font-size: 22px; font-weight: 600; color: #94a3b8; }
.grid-theme .subtitle { color: #64748b; }
.script-tag { font-family: 'Caveat', cursive; font-size: 40px; font-weight: 700; color: #0369a1; transform: rotate(-3deg); display: inline-block; margin-bottom: 2px; }
.highlight-pill { display: inline-block; background: #fde047; color: #0f172a; font-size: 26px; font-weight: 800; padding: 9px 36px; border-radius: 999px; box-shadow: 0 4px 14px rgba(253, 224, 71, 0.45); margin-bottom: 20px; }

/* Footers */
.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
.grid-theme .footer-bar { background: #ffffff; border: 1.5px solid #e2e8f0; }
.brand-name { font-size: 20px; font-weight: 900; color: #ffffff; }
.grid-theme .brand-name { color: #0f172a; }
.brand-domain { font-size: 14px; color: #38bdf8; font-weight: 600; margin-left: 10px; }
.cta-pill { background: #0284c7; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }

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

// Node 10 (Attach Rendered Image URL)
const n10 = wf.nodes.find(n => n.name.includes('Attach Rendered Image URL'));
if (n10) {
  n10.parameters.jsCode = `const prev = $('Configure & Generate Pin Image (Finmatrix Studio Engine)').item.json;
const base = $json.url || '';
if (!base) throw new Error('Render failed: no url returned');
const { pinHtml, ...rest } = prev;
const imageUrl = (base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg')) ? base : base + '.png';
return [{ json: { ...rest, imageUrl, shortImageUrl: imageUrl, imageRenderedAt: new Date().toISOString() } }];`;
}

// Node 13 (Gemini Copywriter)
const n13 = wf.nodes.find(n => n.name.includes('Generate Pin SEO Title'));
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

RETURN ONLY VALID JSON wrapped in a single \\\`\\\`\\\`json markdown block:
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

// Node 14 (Parse & Format Pin Data)
const n14 = wf.nodes.find(n => n.name.includes('Parse & Format Pin Data'));
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

rawText = rawText.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();

let parsed = {};
try {
  parsed = JSON.parse(rawText);
} catch (e) {
  parsed = {
    pinTitle: (\`\${prev.headlineOnImage || prev.topic || 'Finmatrix'}: \${prev.subtitleOnImage || 'Free Financial Guide'}\`).substring(0, 90).trim(),
    hook: \`Discover the exact mathematical numbers with Finmatrix.\`,
    bullet1: 'Calculate exact payoff dates and slash compounding interest.',
    bullet2: 'Download free Excel toolkits with zero sign-up required.',
    altText: \`Infographic for Finmatrix \${prev.targetKeyword || 'Calculator'}\`
  };
}

let pinTitle = (parsed.pinTitle || prev.headlineOnImage || 'Finmatrix Financial Guide').replace(/[*_#\`]/g, '').trim();
pinTitle = pinTitle.replace(/myusfinance(\.com)?/gi, 'Finmatrix');
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

let hook = (parsed.hook || \`Discover the exact numbers for \${prev.targetKeyword || 'finances'} on Finmatrix.\`).replace(/[*_#\`]/g, '').trim();
hook = hook.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 115);

let b1 = (parsed.bullet1 || 'Deploy quantitative rules to halt compounding finance charges.').replace(/[*_#\`]/g, '').trim();
b1 = b1.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

let b2 = (parsed.bullet2 || 'Calculate payoff dates and investment growth in real time.').replace(/[*_#\`]/g, '').trim();
b2 = b2.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

const ctaLine = '👉 Free Tool & Toolkit: ' + destUrl;
const hashtags = '#personalfinance #financialfreedom #debtfree #moneytips #finmatrix';

const pinDescription = \`\${hook}\\n\\n• \${b1}\\n• \${b2}\\n\\n\${ctaLine}\\n\\n\${hashtags}\`;

let altText = (parsed.altText || \`Infographic showing Finmatrix \${prev.headlineOnImage || 'financial calculator'}\`).replace(/[*_#\`]/g, '').trim();
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
console.log('SUCCESS: Written updated multi-archetype workflow to', outPath);
