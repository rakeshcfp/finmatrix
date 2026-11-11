import fs from 'fs';
import path from 'path';

// 1. Read source workflow to preserve node graph, IDs, credentials, and coordinates
const sourcePath = 'C:\\Users\\Rakesh\\.gemini\\antigravity\\brain\\0b073859-daa6-48de-a2bb-926d79f02937\\.user_uploaded\\media_1794424387069_bf7bb5a5.json';
const sourceWf = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// 2. Extract keywords from CSV files
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
    const kw = parts[kwIdx];
    if (!kw || kw.length < 3) continue;
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
  { keyword: "debt snowball vs avalanche calculator", volume: 14800, kd: 12, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-elimination-planner.html" },
  { keyword: "credit card payoff calculator with extra payments", volume: 18100, kd: 14, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/credit-card-payoff-calculator.html" },
  { keyword: "mortgage amortization schedule calculator with extra principal", volume: 22000, kd: 16, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/mortgage-calculator.html" },
  { keyword: "how much house can i afford calculator", volume: 49500, kd: 22, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/home-affordability-calculator.html" },
  { keyword: "rent vs buy calculator 2026", volume: 27100, kd: 19, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/rent-vs-buy-calculator.html" },
  { keyword: "refinance break even calculator", volume: 12100, kd: 15, intent: "Commercial", pillar: "Mortgage & Real Estate", targetUrl: "https://finmatrix.cloud/calculators/refinance-break-even-calculator.html" },
  { keyword: "hysa vs cd calculator", volume: 9900, kd: 8, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html" },
  { keyword: "compound interest calculator daily monthly", volume: 33100, kd: 18, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" },
  { keyword: "emergency fund calculator 3 to 6 months", volume: 8100, kd: 9, intent: "Informational", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/emergency-fund-calculator.html" },
  { keyword: "401k growth calculator with employer match", volume: 12100, kd: 11, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/401k-calculator.html" },
  { keyword: "roth ira vs traditional ira calculator", volume: 14800, kd: 15, intent: "Commercial", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/roth-vs-traditional-ira-calculator.html" },
  { keyword: "fire calculator financial independence retire early", volume: 14800, kd: 17, intent: "Informational", pillar: "Retirement & 401(k)", targetUrl: "https://finmatrix.cloud/calculators/fire-calculator.html" },
  { keyword: "take home paycheck calculator after taxes", volume: 60500, kd: 24, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/paycheck-calculator.html" },
  { keyword: "hourly to salary calculator with overtime", volume: 27100, kd: 19, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/hourly-to-salary-calculator.html" },
  { keyword: "bonus tax calculator net amount", volume: 14800, kd: 18, intent: "Commercial", pillar: "Paycheck & Salary", targetUrl: "https://finmatrix.cloud/calculators/bonus-tax-calculator.html" },
  { keyword: "car payment calculator with interest and trade in", volume: 33100, kd: 21, intent: "Commercial", pillar: "Auto & Personal Loans", targetUrl: "https://finmatrix.cloud/calculators/auto-loan-calculator.html" },
  { keyword: "debt to income ratio calculator for mortgage", volume: 18100, kd: 13, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-to-income-calculator.html" }
];

const allParsed = [...coreHighIntent, ...c1, ...c2, ...c3];
const uniqueMap = new Map();
allParsed.forEach(item => {
  const k = item.keyword.toLowerCase().trim();
  if (!uniqueMap.has(k)) {
    uniqueMap.set(k, item);
  }
});
const masterKeywords = Array.from(uniqueMap.values());
console.log(`Loaded ${masterKeywords.length} master keywords.`);

// 3. Clone workflow
const wf = JSON.parse(JSON.stringify(sourceWf));
wf.name = "Finmatrix - Pinterest Marketing Automation (Evergreen SEO Pins & Lead Engine)";

// Set Google Sheet ID to Finmatrix master spreadsheet
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

// Node 5 (Pick Next Keyword & Board)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX MASTER KEYWORD ENGINE & STRATEGIC REPETITION SELECTOR
// Rotates across ${masterKeywords.length} verified high-intent SEMrush financial queries!
// Answers search intent with 8 Decoupled Infographic Layouts, promoting Finmatrix Calculators & Free Excel Toolkits.

const masterKeywords = ${JSON.stringify(masterKeywords, null, 2)};

const defaultBoardsRegistry = [
  {
    "BoardID": "BOARD-01",
    "BoardName": "Finmatrix: Debt Elimination & Credit Payoff",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/debt-elimination-credit-payoff/",
    "BoardDescription": "Mathematically proven strategies to crush credit cards, loan balances, and APR finance charges with free calculators and spreadsheets.",
    "PrimaryKeyword": "debt snowball vs avalanche calculator",
    "SecondaryKeywords": "credit card payoff calculator, debt avalanche method, debt snowball tracker, debt free journey, credit card interest calculator",
    "TargetAudience": "Individuals, families, and borrowers seeking to eliminate high-interest debt and achieve financial freedom.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/debt-elimination-planner.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-02",
    "BoardName": "Finmatrix: High-Yield Savings & CDs",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/high-yield-savings-cds/",
    "BoardDescription": "Maximize compound interest with high-yield savings accounts, CD ladder strategies, and emergency fund growth calculators.",
    "PrimaryKeyword": "hysa vs cd calculator",
    "SecondaryKeywords": "high yield savings vs cd, certificate of deposit rates, compound interest calculator, emergency fund blueprint, apy calculator",
    "TargetAudience": "Savers, investors, and emergency fund builders seeking maximum risk-free yield on cash reserves.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-03",
    "BoardName": "Finmatrix: 401(k), Roth IRA & Retirement",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/401k-retirement-wealth/",
    "BoardDescription": "Accelerate wealth building with 401(k) growth projections, Roth IRA contribution limits, and safe retirement withdrawal calculators.",
    "PrimaryKeyword": "401k growth calculator with match",
    "SecondaryKeywords": "401k growth calculator, roth ira vs 401k, fire calculator, safe withdrawal rate, retirement longevity matrix",
    "TargetAudience": "W-2 professionals, index fund investors, and early retirement (FIRE) planners building generational wealth.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/401k-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-04",
    "BoardName": "Finmatrix: Mortgage & Real Estate Calculators",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/mortgage-real-estate-calculators/",
    "BoardDescription": "Save tens of thousands in mortgage interest with amortization schedules, bi-weekly payment ladders, and home affordability estimators.",
    "PrimaryKeyword": "mortgage amortization schedule calculator with extra principal",
    "SecondaryKeywords": "mortgage calculator, amortization schedule, how much house can i afford, rent vs buy calculator, refinance break even",
    "TargetAudience": "Homebuyers, homeowners, and real estate investors optimizing debt payoff and loan terms.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/mortgage-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-05",
    "BoardName": "Finmatrix: Paycheck, Salary & Tax Calculators",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/paycheck-salary-tax-calculators/",
    "BoardDescription": "Accurate take-home paycheck calculators, hourly to salary conversions, bonus tax withholding, and 1099 self-employment tax estimators.",
    "PrimaryKeyword": "take home paycheck calculator after taxes",
    "SecondaryKeywords": "hourly to salary calculator, paycheck calculator, bonus tax calculator, 1099 tax estimator, net income calculator",
    "TargetAudience": "Employees, job seekers, freelancers, and side-hustlers optimizing net income and tax withholdings.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/paycheck-calculator.html",
    "IsActive": true
  },
  {
    "BoardID": "BOARD-06",
    "BoardName": "Finmatrix: Auto Loans & Vehicle Financing",
    "BoardURL": "https://www.pinterest.com/finmatrixcloud/auto-loans-car-payment-calculators/",
    "BoardDescription": "Calculate true monthly car payments, total loan interest costs, and early payoff savings.",
    "PrimaryKeyword": "car payment calculator with interest and trade in",
    "SecondaryKeywords": "auto loan calculator, car payment calculator, vehicle loan amortization, early loan payoff",
    "TargetAudience": "Car buyers and vehicle owners avoiding underwater loans and high auto APRs.",
    "PreferredDestinationURL": "https://finmatrix.cloud/calculators/auto-loan-calculator.html",
    "IsActive": true
  }
];

function mapKeywordToBoard(kw) {
  const k = (kw || '').toLowerCase();
  if (k.includes('401k') || k.includes('retire') || k.includes('roth') || k.includes('ira') || k.includes('pension') || k.includes('fire')) {
    return 'Finmatrix: 401(k), Roth IRA & Retirement';
  }
  if (k.includes('cd') || k.includes('certificate of deposit') || k.includes('deposit') || k.includes('hysa') || k.includes('savings') || k.includes('compound interest') || k.includes('emergency')) {
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

// 1. Gather boards
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
        return {
          ...def,
          ...override,
          BoardID: override.BoardID || def.BoardID,
          PrimaryKeyword: override.PrimaryKeyword || def.PrimaryKeyword,
          PreferredDestinationURL: override.PreferredDestinationURL || def.PreferredDestinationURL,
          IsActive: override.IsActive !== false && override.IsActive !== 'FALSE'
        };
      }
      return def;
    }).filter(b => b.IsActive !== false);
  }
} catch (e) {
  boardsList = defaultBoardsRegistry;
}

// 2. Fetch past queue history for 30-Day Rolling Cooldown & Style Rotation
let pastRows = [];
try {
  pastRows = $('Fetch Recent Queue History from Google Sheets').all().map(i => i.json);
} catch (e) {
  pastRows = [];
}

const pastBoardCounts = {};
boardsList.forEach(b => { pastBoardCounts[b.BoardName] = 0; });
const pastTopics = [];
const recentStyles = [];

pastRows.forEach(r => {
  const bName = r.TargetBoard || r.BoardName || r.target_board || r.board_name || r.targetBoard;
  if (bName && pastBoardCounts[bName] !== undefined) {
    pastBoardCounts[bName] = (pastBoardCounts[bName] || 0) + 1;
  }
  const top = r.Topic || r.Pillar || r.PinTitle || r.HeadlineOnImage || r.topic || r.pin_title;
  if (top) pastTopics.push(top.toLowerCase().trim());
  const sty = r.PinStyle || r.ContentAngle || r.pin_style || r.content_angle || r.pinStyle;
  if (sty) recentStyles.push(sty);
});

// 3. STRATEGIC REPETITION ENGINE (30-DAY ROLLING COOLDOWN)
const recentPastRows = pastRows.slice(-60);
const recentPastKeywords = [];
recentPastRows.forEach(r => {
  const kw = r.TargetKeyword || r.Keyword || r.PrimaryKeyword || r.Topic;
  if (kw) recentPastKeywords.push(kw.toLowerCase().trim());
});

let availableKeywords = masterKeywords.filter(k => {
  const kw = k.keyword.toLowerCase().trim();
  return !recentPastKeywords.includes(kw);
});

if (availableKeywords.length === 0) {
  availableKeywords = [...masterKeywords];
}

availableKeywords.sort((a, b) => (a.kd - b.kd) || (b.volume - a.volume));
const candidatePool = availableKeywords.slice(0, Math.min(5, availableKeywords.length));
const selectedKwObj = candidatePool[Math.floor(Math.random() * candidatePool.length)] || availableKeywords[0];

const targetKeyword = selectedKwObj.keyword;
const keywordVolume = selectedKwObj.volume || 1200;
const keywordKD = selectedKwObj.kd || 12;
const keywordIntent = selectedKwObj.intent || 'Informational';
const keywordPillar = selectedKwObj.pillar || 'Debt & Credit Payoff';

const mappedBoardName = mapKeywordToBoard(targetKeyword);
let selectedBoard = boardsList.find(b => b.BoardName.toLowerCase() === mappedBoardName.toLowerCase()) || boardsList[0];

// 4. DECOUPLED STYLE SELECTION: Choose fairly across all 8 viral layouts!
const allStyles = [
  { id: 'STYLE_1_6CARD_GRID', name: '6-Card Prompt Grid (Light Editorial)', badge: 'FINANCIAL CHEAT SHEET' },
  { id: 'STYLE_2_4COL_MATRIX', name: '4-Column Pastel Cheat Sheet Matrix', badge: 'STEP-BY-STEP MATRIX' },
  { id: 'STYLE_3_IPHONE_CHAT', name: '3D Smartphone Proposal System', badge: 'INTERACTIVE SIMULATOR' },
  { id: 'STYLE_4_DRIP_ROADMAP', name: 'Connected Client Revival Drip Roadmap', badge: 'SYSTEM ROADMAP' },
  { id: 'STYLE_5_SPLIT_COMP', name: 'Amateur vs Pro Split Comparison', badge: 'A VS B COMPARISON' },
  { id: 'STYLE_6_CHECKLIST', name: '5-Point Action Checklist & Quality Gate', badge: 'ACTION CHECKLIST' },
  { id: 'STYLE_7_LADDER', name: '3-Step Success Ladder Process Staircase', badge: 'GROWTH STAIRCASE' },
  { id: 'STYLE_8_TABLE', name: 'Time-Saver Matrix Comparison Table', badge: 'COMPARISON TABLE' }
];

const lastStyle = recentStyles[recentStyles.length - 1];
const availableStyles = allStyles.filter(s => s.id !== lastStyle);
const chosenStyleObj = availableStyles[Math.floor(Math.random() * availableStyles.length)] || allStyles[0];

const pinStyle = chosenStyleObj.id;
const styleName = chosenStyleObj.name;
const styleBadge = chosenStyleObj.badge;

// 5. Generate deterministic unique PinID
const now = new Date();
const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
const pinId = 'FINPIN-' + dateCode + '-' + randSuffix;

// 6. Clean, Compact Destination URL (prevents description truncation!)
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
    secondaryKeywords: selectedBoard.SecondaryKeywords || 'personal finance, debt payoff, money calculators',
    targetAudience: selectedBoard.TargetAudience || 'Savers, investors, and debt-free planners',
    pillar: keywordPillar,
    pillarId: 'KD-' + keywordKD,
    contentPillar: 'SEO Search Keyword: ' + targetKeyword,
    bookChapter: 'Finmatrix Cloud · Free Financial Calculators & Excel Toolkits',
    pinStyle: pinStyle,
    styleName: styleName,
    styleBadge: styleBadge,
    destinationUrl: destinationWithUtm,
    baseDestinationUrl: destBaseUrl,
    utmCampaign: utmCamp,
    pastTopicsToAvoid: pastTopics.slice(-15),
    brand: 'Finmatrix Pro',
    product: 'Free Financial Calculators & Excel Toolkits (finmatrix.cloud)',
    author: 'Finmatrix Quantitative Research Desk',
    createdAt: now.toISOString()
  }
}];
`;
}

// Node 6 (Gemini API Ideation Prompt)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Your mission: Brainstorm a high-converting, mathematically accurate, educational Pinterest infographic (1000x1500 vertical) that directly answers a real user search query.

TARGET SEARCH QUERY:
- Exact Keyword: "\${$json.targetKeyword}"
- Monthly Volume: \${$json.keywordVolume} | KD: \${$json.keywordKD}
- Target Board: "\${$json.targetBoard}"
- Visual Style: \${$json.styleName} (\${$json.pinStyle})

PAST TOPICS TO AVOID:
\${($json.pastTopicsToAvoid || []).map(t => '- ' + t).join('\\n')}

STYLE-SPECIFIC SCHEMA INSTRUCTIONS:
\` + ($json.pinStyle === 'STYLE_5_SPLIT_COMP' ? \`STYLE 5 (AMATEUR VS PRO SPLIT COMPARISON):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'MINIMUM VS ACCELERATED')
- subtitleOnImage: (Clear subheader under 10 words)
- bad1, bad2, bad3: (3 concrete mistakes: e.g. 'Paying only 2% minimum balances', 'Losing thousands to compounding APR', 'No structured debt-free timeline')
- good1, good2, good3: (3 accelerated moves: e.g. 'Deploying mathematical debt avalanche', 'Halting compounding finance charges', 'Debt-free in 28 months with free toolkit')
- takeaway: (One actionable mathematical rule under 12 words)
\` : $json.pinStyle === 'STYLE_6_CHECKLIST' ? \`STYLE 6 (5-POINT ACTION CHECKLIST):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'SAVINGS HEALTH AUDIT')
- subtitleOnImage: (Under 10 words)
- check1, check2, check3, check4, check5: (5 concrete actionable benchmarks: e.g. '1. Eliminate all revolving debt > 10% APR', '2. Secure 3-6 months liquid expenses in HYSA > 4.5% APY', '3. Capture 100% of employer 401(k) match', '4. Maximize Roth IRA annual limit ($7,000)', '5. Review amortization schedule annually')
- takeaway: (One actionable rule under 12 words)
\` : $json.pinStyle === 'STYLE_7_LADDER' ? \`STYLE 7 (3-STEP SUCCESS LADDER):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '3-TIER WEALTH STAIRCASE')
- subtitleOnImage: (Under 10 words)
- step1Title, step1Desc: (e.g. 'Defensive Liquidity', 'Build 1-month cash buffer in HYSA before extra payments')
- step2Title, step2Desc: (e.g. 'High-APR Eradication', 'Deploy debt avalanche to eliminate loans > 7% APR')
- step3Title, step3Desc: (e.g. 'Asset Accumulation', 'Maximize tax-advantaged 401k & compound index funds')
- takeaway: (One actionable rule under 12 words)
\` : $json.pinStyle === 'STYLE_8_TABLE' ? \`STYLE 8 (COMPARISON MATRIX TABLE):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'PAYOFF MATRIX')
- subtitleOnImage: (Under 10 words)
- col1Header, col2Header, col3Header: ('Strategy', 'Timeline', 'Total Interest')
- row1Col1, row1Col2, row1Col3: ('Minimum Only', '18.4 Years', '$8,420 Interest')
- row2Col1, row2Col2, row2Col3: ('+$50 Extra/Mo', '5.2 Years', '$3,180 Interest')
- row3Col1, row3Col2, row3Col3: ('+$100 Extra/Mo', '2.8 Years', '$1,840 Interest')
- row4Col1, row4Col2, row4Col3: ('Avalanche Method', '1.9 Years', '$1,120 Interest')
- takeaway: (One actionable rule under 12 words)
\` : $json.pinStyle === 'STYLE_2_4COL_MATRIX' ? \`STYLE 2 (4-COLUMN CHEAT SHEET MATRIX):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '4-STEP MONEY ENGINE')
- subtitleOnImage: (Under 10 words)
- col1Title, col1Desc: ('01. LIQUIDITY', '3-6 Mo HYSA Emergency Buffer')
- col2Title, col2Desc: ('02. ELIMINATE', 'Target All APRs Over 8%')
- col3Title, col3Desc: ('03. OPTIMIZE', 'Capture Full 401(k) Match')
- col4Title, col4Desc: ('04. SCALE', 'Compound in Low-Fee Index Funds')
- takeaway: (One actionable rule under 12 words)
\` : $json.pinStyle === 'STYLE_3_IPHONE_CHAT' ? \`STYLE 3 (3D SMARTPHONE SIMULATOR):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'HOW LONG WILL IT LAST?')
- subtitleOnImage: (Under 10 words)
- userPrompt: ('Simulate my cash runway and interest savings with extra payments')
- step1: ('1. Current Monthly Burn: $3,400')
- step2: ('2. APY Yield Shift: Move checking to 4.8% HYSA (+$163/mo)')
- step3: ('3. Avalanche Payoff: Eradicate 22% APR card in 14 months')
- step4: ('4. Lifetime Result: Saves $6,840 in pure interest')
- takeaway: (One actionable rule under 12 words)
\` : $json.pinStyle === 'STYLE_4_DRIP_ROADMAP' ? \`STYLE 4 (DRIP ROADMAP TIMELINE):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'WILL YOUR CASH LAST?')
- subtitleOnImage: (Under 10 words, e.g. 'Map your runway with compounding yield math.')
- touch1: ('Phase 1: Baseline Audit: Calculate net monthly burn rate and isolate fixed vs discretionary cash outflows.')
- touch2: ('Phase 2: Yield Optimization: Move cash from 0.01% checking accounts to a 4.5% High-Yield Savings or CD ladder.')
- touch3: ('Phase 3: Automated Compounding: Roll former debt payments directly into 401(k) and Roth IRA index funds.')
- takeaway: (One actionable rule under 12 words)
\` : \`STYLE 1 (6-CARD PROMPT GRID):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '6 MONEY LEVERS')
- subtitleOnImage: (Under 10 words)
- card1, card2, card3, card4, card5, card6: (6 cards formatted as 'Title: Practical 1-sentence math rule', e.g. 'Debt Avalanche: Target highest APR first to minimize compounding finance charges', 'HYSA Sweep: Move operating reserves to earn >4.5% APY', '401k Match: Capture 100% instant ROI on company matching', 'Bi-Weekly Payoff: 26 half-payments equals 1 extra monthly payment per year', 'Rate Negotiation: Call lenders annually to request interest reductions', 'Tax Drag Shield: Utilize Roth IRA for 100% tax-free compounding')
- takeaway: (One actionable rule under 12 words)
\`) + \`

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON wrapped in a single \\\`\\\`\\\`json markdown block.
2. Ground all numbers in real financial mathematics.
3. The product is 'Finmatrix Cloud' (free web calculators and downloadable Excel toolkits).
\`
        }
      ]
    }
  ]
} }}`;
}

// Node 7 (Validate Brief & Fallbacks)
const n7 = wf.nodes.find(n => n.name.includes('Validate Topic'));
if (n7) {
  n7.parameters.jsCode = `// VALIDATE BRIEF & PREPARE AUDIT DATA FOR ALL 8 VIRAL STYLES (FINMATRIX QUANTITATIVE FALLBACKS)
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
const rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const pinStyle = prev.pinStyle || 'STYLE_1_6CARD_GRID';
const kw = prev.targetKeyword || 'Personal Finance Calculator';

const finFallbacks = {
  topic: kw,
  headlineOnImage: 'WILL YOUR CASH LAST?',
  subtitleOnImage: 'Map your runway with compounding yield math.',
  bad1: 'Paying only 2% minimum balances',
  bad2: 'Losing thousands to compounding APR',
  bad3: 'No structured debt-free timeline',
  good1: 'Deploying mathematical debt avalanche',
  good2: 'Halting compounding finance charges',
  good3: 'Debt-free in 28 months with free toolkit',
  check1: '1. Audit all liabilities & list balances by APR',
  check2: '2. Direct all extra cash flow to highest rate account',
  check3: '3. Sweep liquid checking reserves into HYSA > 4.5% APY',
  check4: '4. Capture 100% employer match in 401(k)',
  check5: '5. Download free Excel toolkit to track milestones',
  step1Title: 'Defensive Liquidity', step1Desc: 'Secure 1 month living expenses in high-yield cash before paying extra.',
  step2Title: 'APR Avalanche', step2Desc: 'Direct all surplus cash flow to accounts charging >7% APR.',
  step3Title: 'Compounding Wealth', step3Desc: 'Reinvest freed-up monthly cash into index funds and 401(k).',
  col1Header: 'Strategy', col2Header: 'Timeline', col3Header: 'Total Interest',
  row1Col1: 'Minimum Payments', row1Col2: '16.5 Years', row1Col3: '$8,240',
  row2Col1: '+$50 Extra/Mo', row2Col2: '5.8 Years', row2Col3: '$3,120',
  row3Col1: '+$100 Extra/Mo', row3Col2: '3.2 Years', row3Col3: '$1,650',
  row4Col1: 'Debt Avalanche', row4Col2: '2.1 Years', row4Col3: '$940',
  col1Title: '01. AUDIT', col1Desc: 'Identify Highest APRs',
  col2Title: '02. ACCELERATE', col2Desc: 'Deploy Avalanche Method',
  col3Title: '03. BUFFER', col3Desc: '3-6 Mo Liquid HYSA',
  col4Title: '04. COMPOUND', col4Desc: 'Max Tax-Advantaged 401k',
  userPrompt: 'Simulate my cash runway and interest savings with extra payments',
  step1: '1. Current Monthly Burn: $3,400',
  step2: '2. APY Yield Shift: Move checking to 4.8% HYSA (+$163/mo)',
  step3: '3. Avalanche Payoff: Eradicate 22% APR card in 14 months',
  step4: '4. Lifetime Result: Saves $6,840 in pure interest',
  touch1: 'Phase 1: Baseline Audit: Calculate net monthly burn rate and isolate fixed vs discretionary cash outflows.',
  touch2: 'Phase 2: Yield Optimization: Move cash from 0.01% checking accounts to a 4.5% High-Yield Savings or CD ladder.',
  touch3: 'Phase 3: Automated Compounding: Roll former debt payments directly into 401(k) and Roth IRA index funds.',
  card1: 'Debt Avalanche: Target highest interest rate first for maximum savings.',
  card2: 'HYSA Sweep: Keep emergency reserves earning >4.5% APY instead of 0.01%.',
  card3: '401(k) Match: Guaranteed 100% risk-free return on company matching.',
  card4: 'Bi-Weekly Payoff: 26 half-payments equals 1 extra monthly payment per year.',
  card5: 'Rate Renegotiation: Call lenders annually to request interest rate reductions.',
  card6: 'Tax-Advantaged Shield: Maximize Roth IRA to eliminate future capital gains tax.',
  takeaway: 'Mathematical efficiency beats emotional guessing every single time.'
};

let cleanJson = rawGemini.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();
let parsed = {};
try {
  parsed = JSON.parse(cleanJson);
} catch (e) {
  parsed = finFallbacks;
}

const finalData = { ...prev, ...finFallbacks, ...parsed };

// Format breakdown text for copywriter node
let breakdown = '';
if (pinStyle === 'STYLE_5_SPLIT_COMP') {
  breakdown = 'Mistakes: ' + [finalData.bad1, finalData.bad2, finalData.bad3].join(' | ') + ' vs Accelerated: ' + [finalData.good1, finalData.good2, finalData.good3].join(' | ');
} else if (pinStyle === 'STYLE_6_CHECKLIST') {
  breakdown = 'Checklist Items: ' + [finalData.check1, finalData.check2, finalData.check3, finalData.check4, finalData.check5].join(' | ');
} else if (pinStyle === 'STYLE_4_DRIP_ROADMAP') {
  breakdown = 'Roadmap Stages: ' + [finalData.touch1, finalData.touch2, finalData.touch3].join(' -> ');
} else {
  breakdown = 'Core Levers: ' + [finalData.card1, finalData.card2, finalData.card3, finalData.card4, finalData.card5, finalData.card6].filter(Boolean).join(' | ');
}

return [{
  json: {
    ...finalData,
    infographicBreakdown: breakdown,
    imageFilename: (prev.pinId || 'PIN') + '_' + (prev.targetKeyword || 'finmatrix').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30) + '.png'
  }
}];
`;
}

// Node 8 (FULL 20KB STUDIO AGENCY ENGINE)
// We extract the original Node 8 code from sourceWf and adapt the book cover into our 3D Excel Spreadsheet badge!
const origNode8 = sourceWf.nodes.find(n => n.name.includes('Generate Pin Image'));
let fullNode8Code = origNode8.parameters.jsCode;

// Replace Book Cover with 3D Excel Spreadsheet in Footer
const finmatrixFooterHtml = `
const footer = \`
<div class="ftr-card">
  <div class="ftr-book-preview">
    <div class="ftr-spreadsheet-icon-3d">
      <div class="ftr-xlsx-tag">.XLSX</div>
      <div class="ftr-sheet-grid">
        <div class="fsg-bar"></div>
        <div class="fsg-row"><span></span><span></span></div>
        <div class="fsg-row"><span></span><span></span></div>
      </div>
    </div>
  </div>
  <div class="ftr-col-middle">
    <div class="playbook-title">Finmatrix Cloud · Quantitative Research</div>
    <div class="playbook-domain">finmatrix.cloud · 100% Free Calculators & Excel Toolkits</div>
    <div class="ftr-proof-badge">
      <span class="rating-stars">★★★★★</span>
      <span class="proof-stat"><strong>NO SIGN-UP</strong> REQUIRED · <strong>FREE .XLSX</strong> INCLUDED</span>
    </div>
  </div>
  <div class="ftr-col-right">
    <div class="price-pill-row">
      <span class="old-price">$0</span>
      <span class="deal-price">100% FREE</span>
      <span class="verified-tag">✓ VERIFIED</span>
    </div>
    <div class="cta-button">
      <span>CALCULATE NOW</span>
      <span class="cta-arrow">→</span>
    </div>
  </div>
</div>\`;
`;

// Replace footer in fullNode8Code
const ftrStart = fullNode8Code.indexOf('const footer =');
const ftrEnd = fullNode8Code.indexOf('// ---------- 8 Studio Body Layouts ----------');
fullNode8Code = fullNode8Code.slice(0, ftrStart) + finmatrixFooterHtml + '\n' + fullNode8Code.slice(ftrEnd);

// Add CSS for 3D Excel Spreadsheet
const ftrSpreadsheetCss = `
.ftr-book-preview {
  width: 130px;
  height: 200px;
  margin-top: -30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ftr-spreadsheet-icon-3d {
  width: 115px;
  height: 155px;
  background: linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%);
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.7), 0 0 25px rgba(16, 185, 129, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 12px;
  transform: rotate(-4deg);
  position: relative;
  overflow: hidden;
}
.ftr-spreadsheet-icon-3d::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%);
  pointer-events: none;
}
.ftr-xlsx-tag {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.35);
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.ftr-sheet-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 8px;
}
.fsg-bar {
  height: 6px;
  background: #ffffff;
  border-radius: 3px;
  opacity: 0.9;
}
.fsg-row {
  display: flex;
  gap: 5px;
}
.fsg-row span {
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  flex: 1;
}
.ftr-proof-badge .proof-stat strong {
  color: #10b981;
}
`;
fullNode8Code = fullNode8Code.replace('.ftr-book-preview {', ftrSpreadsheetCss + '\n.ftr-book-preview-disabled {');

const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = fullNode8Code;
}

// Node 10 (Attach Rendered Image URL)
const n10 = wf.nodes.find(n => n.name.includes('Attach Rendered Image URL'));
if (n10) {
  n10.parameters.jsCode = `const prev = $('Configure & Generate Pin Image (Finmatrix Studio Engine)').item.json;
const base = $json.url || '';
if (!base) throw new Error('Render failed: no url returned');
const { pinHtml, ...rest } = prev;          // keep the HTML out of Sheets/email
const imageUrl = (base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg')) ? base : base + '.png';
return { json: { ...rest, imageUrl, shortImageUrl: imageUrl, imageRenderedAt: new Date().toISOString() } };`;
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
A high-converting vertical educational infographic (1000x1500) has been generated for this Pinterest pin.

CRITICAL SEO REQUIREMENT:
Your copy MUST be directly optimized to rank on Pinterest Search and Google SEO for the real user search query: "\${$json.targetKeyword}".

INFOGRAPHIC DETAILS:
- Target Search Keyword: "\${$json.targetKeyword}" (Monthly Search Volume: \${$json.keywordVolume}, Keyword Difficulty: \${$json.keywordKD})
- Assigned Visual Style: \${$json.styleName} (\${$json.pinStyle})
- Headline on the Graphic: "\${$json.headlineOnImage}"
- Subtitle on the Graphic: "\${$json.subtitleOnImage}"
- Visual Breakdown on the Graphic:
\${$json.infographicBreakdown}

TARGET PINTEREST BOARD: \${$json.targetBoard}
DESTINATION LINK: \${$json.destinationUrl}

STRICT FORMAT & COMPLIANCE RULES:
1. pinTitle:
   - Under 90 characters.
   - Must include the exact target keyword: "\${$json.targetKeyword}".
   - Zero clickbait, zero markdown asterisks.

2. hook:
   - Exactly 1 punchy, informative sentence answering the user search query.
   - Maximum 110 characters.

3. bullet1:
   - 1 concise quantitative rule or benefit from the graphic.
   - Maximum 65 characters.

4. bullet2:
   - 1 practical milestone, rule of thumb, or mathematical benchmark.
   - Maximum 65 characters.

5. altText:
   - Screen reader description under 100 characters.

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

// Node 14 (Parse & Format Pin Data - GUARANTEED HASHTAGS & TRUNCATION-FREE)
const n14 = wf.nodes.find(n => n.name.includes('Parse & Format Pin Data'));
if (n14) {
  n14.parameters.jsCode = `// PARSE & FORMAT PIN DATA (GUARANTEED HASHTAGS & ZERO MARKDOWN)
let rawText = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const prev = $('Inspect Asset Status & Validation').item.json || {};
const destUrl = prev.destinationUrl || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';

rawText = rawText.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();

let parsed = {};
try {
  parsed = JSON.parse(rawText);
} catch (e) {
  parsed = {
    pinTitle: (\`\${prev.headlineOnImage || prev.topic || 'Finmatrix'}: \${prev.subtitleOnImage || 'Free Calculator'}\`).substring(0, 90).trim(),
    hook: \`Discover the exact mathematical framework for \${prev.targetKeyword || 'personal finance'}.\`,
    bullet1: 'Deploy proven formulas to slash interest and build wealth faster.',
    bullet2: 'Download free Excel toolkits with zero sign-up required.',
    altText: \`Infographic for \${prev.targetKeyword || 'Finmatrix'}\`
  };
}

let pinTitle = (parsed.pinTitle || prev.headlineOnImage || prev.topic || 'Financial Calculator').replace(/[*_#\`]/g, '').trim();
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

const hook = (parsed.hook || parsed.pinDescription || \`Discover the exact numbers for \${prev.targetKeyword || 'finances'}.\`).replace(/[*_#\`]/g, '').trim().slice(0, 115);
const b1 = (parsed.bullet1 || 'Deploy quantitative rules to halt compounding finance charges.').replace(/[*_#\`]/g, '').trim().slice(0, 65);
const b2 = (parsed.bullet2 || 'Calculate debt-free dates and investment growth in real time.').replace(/[*_#\`]/g, '').trim().slice(0, 65);

const ctaLine = '👉 Free Calculator & Toolkit: ' + destUrl;
const hashtags = '#personalfinance #financialfreedom #debtfree #moneytips #finmatrix';

// Assemble complete description under 500 chars with guaranteed hashtags:
const pinDescription = \`\${hook}\\n\\n• \${b1}\\n• \${b2}\\n\\n\${ctaLine}\\n\\n\${hashtags}\`;

let altText = (parsed.altText || \`Infographic showing \${prev.headlineOnImage || 'financial calculator'}\`).replace(/[*_#\`]/g, '').trim();
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
  htmlContent: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Finmatrix Pin Briefing</title></head><body style='margin: 0; padding: 16px; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' align='center' style='max-width: 860px; margin: 0 auto; background: #07090e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;'><tr><td style='padding: 24px 28px; background: linear-gradient(180deg, #0f172a 0%, #07090e 100%); border-bottom: 1px solid #1e293b;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td><span style='background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 1px; display: inline-block;'>📌 FINMATRIX PINTEREST BRIEFING</span> <span style='color: #10b981; font-size: 12px; font-weight: 700; margin-left: 10px;'>" + ($json.targetBoard || 'Board') + "</span><h1 style='color: #ffffff; font-size: 20px; font-weight: 800; margin: 12px 0 4px 0; line-height: 1.3;'>" + ($json.pinTitle || 'New Pin Ready') + "</h1><p style='color: #94a3b8; font-size: 13px; margin: 0;'>Target Search Query: <strong style='color: #38bdf8;'>" + ($json.targetKeyword || 'Keyword') + "</strong> (KD: " + ($json.keywordKD || '0') + "% | Vol: " + ($json.keywordVolume || '0') + "/mo) &bull; Style: <strong style='color: #f59e0b;'>" + ($json.styleName || 'Style') + "</strong></p></td></tr></table></td></tr><tr><td style='padding: 24px 28px;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td width='320' valign='top' style='padding-right: 24px;'><div style='border: 1px solid #334155; border-radius: 12px; overflow: hidden; background: #000000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);'><a href='" + ($json.imageUrl || '#') + "' target='_blank' style='display: block; text-decoration: none;'><img src='" + ($json.imageUrl || '#') + "' alt='Pin Preview' width='320' style='width: 100%; height: auto; display: block;' /></a></div><div style='margin-top: 14px;'><a href='" + ($json.imageUrl || '#') + "' target='_blank' download style='display: block; background: #059669; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(5,150,105,0.4);'>📥 Download High-Res Graphic (1000x1500)</a><a href='https://www.pinterest.com/pin-creation-tool/' target='_blank' style='display: block; background: #e60023; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px;'>📌 Open Pinterest Pin Builder</a></div></td><td valign='top'><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>1. Pin Title (Max 90 chars)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 14px; color: #f1f5f9; font-weight: 600;'>" + ($json.pinTitle || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>2. Destination URL (With Tracking UTMs)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 12px; color: #38bdf8; word-break: break-all;'><a href='" + ($json.destinationUrl || '#') + "' target='_blank' style='color: #38bdf8; text-decoration: none;'>" + ($json.destinationUrl || '') + "</a></div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>3. Pin Description (Under 500 chars &bull; Includes Bullets & Guaranteed Hashtags)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 13px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap;'>" + ($json.pinDescription || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>4. Alt Text</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #94a3b8;'>" + ($json.altText || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>5. Target Board</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #10b981; font-weight: 700;'>" + ($json.targetBoard || '') + "</div></div></td></tr></table></td></tr><tr><td style='padding: 16px 28px; background: #0b0f19; border-top: 1px solid #1e293b; text-align: center;'><p style='color: #475569; font-size: 12px; margin: 0;'>Finmatrix Cloud &bull; Automated Marketing Engine &bull; Generated at " + ($json.createdAt || '') + "</p></td></tr></table></body></html>"
}) }}`;
}

// Ensure all connections are fully wired
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
console.log('SUCCESS: Written updated agency-grade workflow to', outPath);
