import fs from 'fs';
import path from 'path';

// Load source workflow
const sourcePath = 'C:\\Users\\Rakesh\\.gemini\\antigravity\\brain\\0b073859-daa6-48de-a2bb-926d79f02937\\.user_uploaded\\media_1794424387069_bf7bb5a5.json';
const sourceWf = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Load all keywords
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
console.log(`Ready with ${masterKeywords.length} master keywords.`);

// Clone workflow
const wf = JSON.parse(JSON.stringify(sourceWf));
wf.name = "Finmatrix - Pinterest Marketing Automation (Evergreen SEO Pins & Lead Engine)";

// Update Node 2 (Fetch Boards Registry)
const n2 = wf.nodes.find(n => n.name.includes('Fetch Boards Registry'));
if (n2) {
  n2.parameters.sheetName.value = "Finmatrix_Pinterest_Boards";
}

// Update Node 4 (Fetch Recent Queue History)
const n4 = wf.nodes.find(n => n.name.includes('Fetch Recent Queue History'));
if (n4) {
  n4.parameters.sheetName.value = "Finmatrix_Pinterest_Queue";
}

// Update Node 5 (Pick Next Finmatrix Keyword, Angle & Board)
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
// Prevents back-to-back spamming while intentionally allowing high-volume keywords to be recycled with new styles!
// Runs 2x daily = 60 pins per 30 days
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

// If all keywords were used recently, recycle the pool
if (availableKeywords.length === 0) {
  availableKeywords = [...masterKeywords];
}

// Prioritize lowest KD keywords first (fast ranking opportunities), picking fairly among top 5
availableKeywords.sort((a, b) => (a.kd - b.kd) || (b.volume - a.volume));
const candidatePool = availableKeywords.slice(0, Math.min(5, availableKeywords.length));
const selectedKwObj = candidatePool[Math.floor(Math.random() * candidatePool.length)] || availableKeywords[0];

const targetKeyword = selectedKwObj.keyword;
const keywordVolume = selectedKwObj.volume || 1200;
const keywordKD = selectedKwObj.kd || 12;
const keywordIntent = selectedKwObj.intent || 'Informational';
const keywordPillar = selectedKwObj.pillar || 'Debt & Credit Payoff';

// Map keyword to best fitting board
const mappedBoardName = mapKeywordToBoard(targetKeyword);
let selectedBoard = boardsList.find(b => b.BoardName.toLowerCase() === mappedBoardName.toLowerCase()) || boardsList[0];

// 4. DECOUPLED STYLE SELECTION: Choose fairly across all 8 viral layouts!
// Ensures the same visual style is NEVER repeated back-to-back!
const allStyles = [
  { id: 'STYLE_1_6CARD_GRID', name: '6-Card High-Yield Money Moves Grid', badge: 'FINANCIAL CHEAT SHEET' },
  { id: 'STYLE_2_4COL_MATRIX', name: '4-Column Wealth Building Matrix', badge: 'STEP-BY-STEP MATRIX' },
  { id: 'STYLE_3_SMARTPHONE_MOCKUP', name: '3D Interactive Finmatrix Calculator UI', badge: 'INTERACTIVE TOOL' },
  { id: 'STYLE_4_DRIP_ROADMAP', name: 'Compound Growth & Payoff Drip Roadmap', badge: 'SYSTEM ROADMAP' },
  { id: 'STYLE_5_SPLIT_COMP', name: 'Side-by-Side Mathematical Comparison', badge: 'A VS B COMPARISON' },
  { id: 'STYLE_6_CHECKLIST', name: '5-Point Financial Health & Quality Audit', badge: 'ACTION CHECKLIST' },
  { id: 'STYLE_7_LADDER', name: '3-Step Financial Freedom Value Staircase', badge: 'FREEDOM LADDER' },
  { id: 'STYLE_8_TABLE', name: 'Quantitative Payoff & Yield Matrix Table', badge: 'COMPARISON TABLE' }
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

// 6. Destination URL & UTM parameters
const destBaseUrl = selectedKwObj.targetUrl || selectedBoard.PreferredDestinationURL || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';
const sanitizedKeyword = targetKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '_');
const utmCampaign = 'pinterest_seo_' + sanitizedKeyword.slice(0, 25);

let destinationWithUtm = destBaseUrl;
try {
  const urlObj = new URL(destBaseUrl);
  urlObj.searchParams.set('utm_source', 'pinterest');
  urlObj.searchParams.set('utm_medium', 'organic');
  urlObj.searchParams.set('utm_campaign', utmCampaign);
  urlObj.searchParams.set('utm_content', pinId);
  urlObj.searchParams.set('utm_term', sanitizedKeyword);
  destinationWithUtm = urlObj.toString();
} catch (e) {
  const sep = destBaseUrl.includes('?') ? '&' : '?';
  destinationWithUtm = destBaseUrl + sep + 'utm_source=pinterest&utm_medium=organic&utm_campaign=' + utmCampaign + '&utm_content=' + pinId + '&utm_term=' + sanitizedKeyword;
}

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
    utmCampaign: utmCampaign,
    pastTopicsToAvoid: pastTopics.slice(-15),
    brand: 'Finmatrix Pro',
    product: 'Free Financial Calculators & Excel Toolkits (finmatrix.cloud)',
    author: 'Finmatrix Quantitative Research Desk',
    createdAt: now.toISOString()
  }
}];
`;
}

// Update Node 6 (Gemini API Ideation Prompt)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Your mission: Brainstorm a high-converting, mathematically accurate, educational Pinterest infographic (1000x1500 vertical) that directly answers a real user search query.

TARGET SEARCH QUERY (PEOPLE ARE ACTIVELY SEARCHING FOR THIS):
- Exact Search Keyword: "\${$json.targetKeyword}"
- Monthly Search Volume: \${$json.keywordVolume} | Keyword Difficulty: \${$json.keywordKD} | Intent: \${$json.keywordIntent}
- Target Pinterest Board: "\${$json.targetBoard}"
- Content Pillar: \${$json.pillar}
- Assigned Visual Style: \${$json.styleName} (\${$json.pinStyle})
- Target Audience: \${$json.targetAudience}

PAST TOPICS ALREADY GENERATED (DO NOT REPEAT THESE):
\${($json.pastTopicsToAvoid || []).map(t => '- ' + t).join('\\n')}

STYLE-SPECIFIC SCHEMA INSTRUCTIONS:
\` + ($json.pinStyle === 'STYLE_5_SPLIT_COMP' ? \`STYLE 5 (SIDE-BY-SIDE MATHEMATICAL COMPARISON):
- topic: (Actionable topic name answering "\${$json.targetKeyword}", e.g. 'Minimum Payment Trap vs Accelerated Avalanche')
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'MINIMUM VS ACCELERATED' or 'SNOWBALL VS AVALANCHE' or 'HYSA VS 1-YEAR CD')
- subtitleOnImage: (Clear subheader under 10 words, e.g. 'The Mathematical Difference on a $15,000 Debt Balance')
- badTitle: (Negative / Default approach, e.g. 'Standard Minimum Payment (2% / Mo)')
- bad1, bad2, bad3: (3 concrete drawbacks or numbers, e.g. '$8,420 Paid in Pure Interest', '18.4 Years Until Debt Free', 'Lenders Compound APR Against You')
- goodTitle: (Finmatrix Optimized approach, e.g. 'Accelerated Avalanche + $100/Mo')
- good1, good2, good3: (3 concrete advantages or numbers, e.g. 'Saves $6,140 in Total Interest', 'Debt Free in Only 28 Months', 'Interest Compounding Halts Immediately')
- statsBad: (Summary metric, e.g. '$23,420 Total Cost')
- statsGood: (Summary metric, e.g. '$17,280 Total Cost')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_6_CHECKLIST' ? \`STYLE 6 (5-POINT FINANCIAL HEALTH CHECKLIST):
- topic: (Actionable topic name answering "\${$json.targetKeyword}", e.g. '5-Point High-Yield Savings & Emergency Audit')
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'SAVINGS HEALTH AUDIT' or 'DEBT PAYOFF GATE')
- subtitleOnImage: (Under 10 words, e.g. '5 Non-Negotiable Benchmarks Before Investing')
- check1, check2, check3, check4, check5: (5 concrete actionable checklist items with math benchmarks, e.g. '1. Eliminate all revolving debt > 10% APR', '2. Secure 3-6 months liquid expenses in HYSA > 4.5% APY', '3. Capture 100% of employer 401(k) match', '4. Maximize Roth IRA annual limit ($7,000)', '5. Review amortization schedule annually')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_7_LADDER' ? \`STYLE 7 (3-STEP SUCCESS LADDER STAIRCASE):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '3-TIER WEALTH STAIRCASE')
- subtitleOnImage: (Under 10 words, e.g. 'The Proven Financial Order of Operations')
- step1Title, step1Desc: (Step 1 Foundation, e.g. 'Defensive Liquidity', 'Build 1-month buffer & capture 401(k) company match')
- step2Title, step2Desc: (Step 2 Acceleration, e.g. 'High-APR Eradication', 'Deploy debt avalanche to eliminate all loans > 7% APR')
- step3Title, step3Desc: (Step 3 Compounding, e.g. 'Asset Accumulation', 'Maximize tax-advantaged accounts & compound index funds')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_8_TABLE' ? \`STYLE 8 (MATHEMATICAL COMPARISON TABLE):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'PAYOFF MATRIX' or 'YIELD COMPARISON')
- subtitleOnImage: (Under 10 words, e.g. 'Mathematical Breakdown Across 4 Common Scenarios')
- row1Col1, row1Col2, row1Col3: (e.g. 'Minimum Only', '18.4 Years', '$8,420 Interest')
- row2Col1, row2Col2, row2Col3: (e.g. '+$50 Extra/Mo', '5.2 Years', '$3,180 Interest')
- row3Col1, row3Col2, row3Col3: (e.g. '+$100 Extra/Mo', '2.8 Years', '$1,840 Interest')
- row4Col1, row4Col2, row4Col3: (e.g. 'Avalanche Method', '1.9 Years', '$1,120 Interest')
- colHeader1, colHeader2, colHeader3: (e.g. 'Payoff Strategy', 'Timeline', 'Total Interest Paid')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_2_4COL_MATRIX' ? \`STYLE 2 (4-COLUMN WEALTH BUILDING MATRIX):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '4-STEP MONEY ENGINE')
- subtitleOnImage: (Under 10 words, e.g. 'Save • Payoff • Invest • Compound')
- col1Title, col1Desc: (Step 1, e.g. '01. LIQUIDITY', '3-6 Mo HYSA Emergency Buffer')
- col2Title, col2Desc: (Step 2, e.g. '02. ELIMINATE', 'Target All APRs Over 8%')
- col3Title, col3Desc: (Step 3, e.g. '03. OPTIMIZE', 'Capture Full 401(k) Match')
- col4Title, col4Desc: (Step 4, e.g. '04. SCALE', 'Compound in Low-Fee Index Funds')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_3_SMARTPHONE_MOCKUP' ? \`STYLE 3 (3D INTERACTIVE CALCULATOR SCREEN):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'CALCULATE YOUR NUMBER')
- subtitleOnImage: (Under 10 words, e.g. 'Interactive Real-Time Financial Simulator')
- metric1Label, metric1Value: (e.g. 'Monthly Interest Saved', '$412.50 / Mo')
- metric2Label, metric2Value: (e.g. 'Accelerated Payoff Date', '14 Months Earlier')
- metric3Label, metric3Value: (e.g. 'Total Lifetime Savings', '$6,840.00')
- toolFeatures: (Array of 3 features: e.g. ['Instant Compound Math', 'Zero Login Required', 'Free .XLSX Download'])
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : $json.pinStyle === 'STYLE_4_DRIP_ROADMAP' ? \`STYLE 4 (COMPOUND GROWTH DRIP ROADMAP):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. 'THE 3-PHASE ROADMAP')
- subtitleOnImage: (Under 10 words, e.g. 'From Debt Friction to Compounding Wealth')
- phase1Title, phase1Desc: (e.g. 'Phase 1: Stabilization', 'Stop debt bleed & establish automated minimums')
- phase2Title, phase2Desc: (e.g. 'Phase 2: Acceleration', 'Direct all discretionary cash to highest APR')
- phase3Title, phase3Desc: (e.g. 'Phase 3: Compounding', 'Roll former debt payments directly into 401k/HYSA')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\` : \`STYLE 1 (6-CARD HIGH-YIELD MONEY MOVES GRID):
- topic: (Actionable topic name answering "\${$json.targetKeyword}")
- headlineOnImage: (Punchy 2-4 word uppercase headline, e.g. '6 MONEY LEVERS')
- subtitleOnImage: (Under 10 words, e.g. 'Quantitative Rules to Slash Interest & Compound Faster')
- card1, card2, card3, card4, card5, card6: (6 distinct cards formatted as 'Title: Practical 1-sentence math rule', e.g. 'Debt Avalanche: Direct extra cash to highest APR to save the most interest', 'HYSA Sweep: Move operating checking balances to >4.5% APY', '401k Match Capture: Instant 100% risk-free ROI on employer match', 'Bi-Weekly Mortgage: 26 half-payments = 1 extra principal payment/year', 'APR Renegotiation: Call card issuers to request rate reductions', 'Tax Drag Shield: Utilize Roth IRA for 100% tax-free growth')
- takeaway: (One actionable mathematical rule of thumb under 12 words)
\`) + \`

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON wrapped in a single \\\`\\\`\\\`json markdown block.
2. Ground all numbers in real financial mathematics (no ridiculous claims).
3. Do NOT mention other brands or ebooks. The product is 'Finmatrix Cloud' (free web calculators and downloadable Excel toolkits).
\`
        }
      ]
    }
  ]
} }}`;
}

// Update Node 7 (Validate Brief & Fallbacks)
const n7 = wf.nodes.find(n => n.name.includes('Validate Topic'));
if (n7) {
  n7.parameters.jsCode = `// VALIDATE BRIEF & PREPARE AUDIT DATA FOR ALL 8 VIRAL STYLES (FINMATRIX QUANTITATIVE FALLBACKS)
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
const rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const pinStyle = prev.pinStyle || 'STYLE_1_6CARD_GRID';
const kw = prev.targetKeyword || 'Personal Finance Calculator';

const finFallbacks = {
  topic: kw,
  headlineOnImage: 'QUANTITATIVE MONEY GUIDE',
  subtitleOnImage: 'Proven Mathematical Rules to Cut Costs & Compound Wealth',
  badTitle: 'Standard Traditional Path',
  bad1: 'Paying only minimum balance amounts',
  bad2: 'Losing 18%+ to revolving compounding APR',
  bad3: 'No structured mathematical timeline',
  statsBad: '+$7,400 Lost in Pure Interest',
  goodTitle: 'Finmatrix Accelerated Math',
  good1: 'Targeting highest APR balances first',
  good2: 'Halting compounding interest permanently',
  good3: 'Automated debt-free acceleration date',
  statsGood: 'Saves $5,820 & Cuts 4.2 Years',
  check1: '1. Audit all liabilities & list balances by APR',
  check2: '2. Direct all extra cash flow to highest rate account',
  check3: '3. Sweep liquid checking reserves into HYSA > 4.5% APY',
  check4: '4. Capture 100% employer match in 401(k)',
  check5: '5. Download free Excel toolkit to track milestones',
  step1Title: 'Step 1: Liquidity Buffer',
  step1Desc: 'Secure 1 month living expenses in high-yield cash before paying extra.',
  step2Title: 'Step 2: APR Avalanche',
  step2Desc: 'Direct all surplus cash flow to accounts charging >7% APR.',
  step3Title: 'Step 3: Compounding Wealth',
  step3Desc: 'Reinvest freed-up monthly cash into index funds and 401(k).',
  colHeader1: 'Strategy',
  colHeader2: 'Time to Debt-Free',
  colHeader3: 'Interest Paid',
  row1Col1: 'Minimum Payments', row1Col2: '16.5 Years', row1Col3: '$8,240',
  row2Col1: '+$50 Extra/Mo', row2Col2: '5.8 Years', row2Col3: '$3,120',
  row3Col1: '+$100 Extra/Mo', row3Col2: '3.2 Years', row3Col3: '$1,650',
  row4Col1: 'Debt Avalanche', row4Col2: '2.1 Years', row4Col3: '$940',
  col1Title: '01. AUDIT', col1Desc: 'Identify Highest APRs',
  col2Title: '02. ACCELERATE', col2Desc: 'Deploy Avalanche Method',
  col3Title: '03. BUFFER', col3Desc: '3-6 Mo Liquid HYSA',
  col4Title: '04. COMPOUND', col4Desc: 'Max Tax-Advantaged 401k',
  metric1Label: 'Monthly Interest Cut', metric1Value: '$340.00 / Mo',
  metric2Label: 'Debt-Free Accelerated', metric2Value: '18 Months Sooner',
  metric3Label: 'Lifetime Wealth Delta', metric3Value: '$14,200 Saved',
  phase1Title: 'Phase 1: Defense', phase1Desc: 'Automate minimums & stop new balance accumulation.',
  phase2Title: 'Phase 2: Offense', phase2Desc: 'Deploy debt avalanche to eliminate high-APR debt.',
  phase3Title: 'Phase 3: Freedom', phase3Desc: 'Roll former debt payments into automatic wealth compounding.',
  card1: 'Debt Avalanche: Target highest interest rate first for maximum savings.',
  card2: 'HYSA Sweep: Keep emergency reserves earning >4.5% APY instead of 0.01%.',
  card3: '401(k) Match: Guaranteed 100% risk-free return on company matching.',
  card4: 'Bi-Weekly Payoff: 26 half-payments equals 1 extra monthly payment per year.',
  card5: 'Rate Renegotiation: Call lenders annually to request interest rate reductions.',
  card6: 'Tax-Advantaged Shield: Maximize Roth IRA to eliminate future capital gains tax.',
  takeaway: 'Mathematical efficiency beats emotional guessing every single time.'
};

let cleanJson = rawGemini.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
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
  breakdown = 'Side A (' + (finalData.badTitle || 'Traditional') + '): ' + finalData.bad1 + ' | ' + finalData.bad2 + ' | ' + finalData.bad3 + ' | Stat: ' + finalData.statsBad + '\\n' +
              'Side B (' + (finalData.goodTitle || 'Accelerated') + '): ' + finalData.good1 + ' | ' + finalData.good2 + ' | ' + finalData.good3 + ' | Stat: ' + finalData.statsGood;
} else if (pinStyle === 'STYLE_6_CHECKLIST') {
  breakdown = 'Checklist Items: ' + [finalData.check1, finalData.check2, finalData.check3, finalData.check4, finalData.check5].join(' | ');
} else if (pinStyle === 'STYLE_7_LADDER') {
  breakdown = 'Ladder Steps: ' + finalData.step1Title + ' (' + finalData.step1Desc + ') -> ' + finalData.step2Title + ' (' + finalData.step2Desc + ') -> ' + finalData.step3Title + ' (' + finalData.step3Desc + ')';
} else if (pinStyle === 'STYLE_8_TABLE') {
  breakdown = 'Table Data: ' + finalData.row1Col1 + ': ' + finalData.row1Col2 + ' (' + finalData.row1Col3 + ') | ' + finalData.row2Col1 + ': ' + finalData.row2Col2 + ' (' + finalData.row2Col3 + ') | ' + finalData.row4Col1 + ': ' + finalData.row4Col2 + ' (' + finalData.row4Col3 + ')';
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

// Update Node 8 (HTML Canvas Studio Engine)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  // We'll replace the jsCode with clean, high-performance HTML/CSS generator with Finmatrix branding
  n8.parameters.jsCode = `// FINMATRIX STUDIO DESIGNER: Agency-Grade Financial Infographic Generator (1000x1500)
// Outputs: item + pinHtml -> rendered to PNG via Chromium Engine.
// Every run rotates curated color palettes, fonts, and procedural vector patterns.

const item = $json;

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const split2 = (val, fbT, fbD) => {
  const str = String(val ?? '').trim();
  if (!str) return [fbT, fbD];
  const idx = str.indexOf(':');
  if (idx > -1 && idx < 45) {
    return [str.slice(0, idx).trim(), str.slice(idx + 1).trim() || fbD];
  }
  const words = str.split(' ');
  if (words.length <= 4) return [str, fbD];
  return [words.slice(0, 3).join(' '), words.slice(3).join(' ')];
};

// 6 Curated Financial Color Palettes
const PALETTES = [
  {
    name: 'Obsidian Emerald (Finmatrix Signature)',
    dark: 1,
    bg1: '#040d0a',
    bg2: '#081e16',
    glow1: 'rgba(16, 185, 129, 0.45)',
    glow2: 'rgba(52, 211, 153, 0.25)',
    ink: '#ffffff',
    sub: '#a7f3d0',
    a: '#10b981',
    b: '#34d399',
    accent: '#f59e0b'
  },
  {
    name: 'Electric Cyan & Deep Slate',
    dark: 1,
    bg1: '#070a14',
    bg2: '#0d172e',
    glow1: 'rgba(6, 182, 212, 0.45)',
    glow2: 'rgba(56, 189, 248, 0.28)',
    ink: '#ffffff',
    sub: '#cffafe',
    a: '#06b6d4',
    b: '#38bdf8',
    accent: '#10b981'
  },
  {
    name: 'Deep Navy & Mint Wealth',
    dark: 1,
    bg1: '#050c1a',
    bg2: '#0b1d3a',
    glow1: 'rgba(59, 130, 246, 0.40)',
    glow2: 'rgba(16, 185, 129, 0.28)',
    ink: '#ffffff',
    sub: '#bfdbfe',
    a: '#3b82f6',
    b: '#10b981',
    accent: '#fbbf24'
  },
  {
    name: 'Charcoal & Amber Gold',
    dark: 1,
    bg1: '#0c0c0e',
    bg2: '#1c1917',
    glow1: 'rgba(245, 158, 11, 0.38)',
    glow2: 'rgba(217, 119, 6, 0.22)',
    ink: '#ffffff',
    sub: '#fef3c7',
    a: '#f59e0b',
    b: '#fbbf24',
    accent: '#10b981'
  },
  {
    name: 'Forest Capital',
    dark: 1,
    bg1: '#03140c',
    bg2: '#072417',
    glow1: 'rgba(16, 185, 129, 0.42)',
    glow2: 'rgba(254, 240, 138, 0.20)',
    ink: '#ffffff',
    sub: '#bbf7d0',
    a: '#10b981',
    b: '#fef08a',
    accent: '#38bdf8'
  },
  {
    name: 'Monochrome Matrix & Emerald Highlight',
    dark: 1,
    bg1: '#080808',
    bg2: '#141414',
    glow1: 'rgba(16, 185, 129, 0.35)',
    glow2: 'rgba(255, 255, 255, 0.12)',
    ink: '#ffffff',
    sub: '#e5e7eb',
    a: '#10b981',
    b: '#ffffff',
    accent: '#f59e0b'
  }
];

const FONTS = [
  { h: 'Inter', b: 'Inter' },
  { h: 'Outfit', b: 'Inter' },
  { h: 'Plus Jakarta Sans', b: 'Inter' }
];

const PATTERNS = [
  // SVG grid pattern
  '<svg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"grid\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><path d=\"M 40 0 L 0 0 0 40\" fill=\"none\" stroke=\"rgba(255,255,255,0.04)\" stroke-width=\"1\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#grid)\" /></svg>',
  // SVG dot matrix
  '<svg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"dots\" width=\"30\" height=\"30\" patternUnits=\"userSpaceOnUse\"><circle cx=\"2\" cy=\"2\" r=\"1.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#dots)\" /></svg>',
  // SVG financial chart diagonal line
  '<svg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"diag\" width=\"60\" height=\"60\" patternUnits=\"userSpaceOnUse\"><path d=\"M 0 60 L 60 0\" fill=\"none\" stroke=\"rgba(16,185,129,0.04)\" stroke-width=\"1.5\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(#diag)\" /></svg>',
  // Clean empty
  ''
];

// Deterministic seed by pinId
let seed = 0;
const idStr = String(item.pinId || item.targetKeyword || 'FINPIN');
for (let i = 0; i < idStr.length; i++) seed = (seed * 31 + idStr.charCodeAt(i)) >>> 0;

const P = PALETTES[seed % PALETTES.length];
const F = FONTS[(seed >>> 3) % FONTS.length];
const bgPattern = PATTERNS[(seed >>> 6) % PATTERNS.length];
const angle = 135 + ((seed % 9) - 4) * 8;

// Style 1: 6-Card Grid
function s1() {
  const cards = [1, 2, 3, 4, 5, 6].map((n) => {
    const [t, d] = split2(item['card' + n], 'Money Lever 0' + n, 'Quantitative action rule for financial acceleration');
    return \`
    <div class=\"glass-card s1-card\">
      <div class=\"card-head\">
        <div class=\"number-badge\">0\${n}</div>
        <div class=\"corner-tag\">FINMATRIX</div>
      </div>
      <div class=\"card-title\">\${esc(t)}</div>
      <div class=\"card-desc\">\${esc(d)}</div>
    </div>\`;
  }).join('');
  return \`<div class=\"s1-grid\">\${cards}</div>\`;
}

// Style 2: 4-Column Matrix
function s2() {
  const cols = [
    [item.col1Title || '01. LIQUIDITY', item.col1Desc || '3-6 Mo Emergency Buffer in HYSA'],
    [item.col2Title || '02. ELIMINATE', item.col2Desc || 'Target All APRs Over 8% First'],
    [item.col3Title || '03. OPTIMIZE', item.col3Desc || 'Capture Full 401(k) Employer Match'],
    [item.col4Title || '04. COMPOUND', item.col4Desc || 'Max Tax-Advantaged Index Funds']
  ].map(([t, d], i) => \`
    <div class=\"glass-card s2-col\">
      <div class=\"col-step-pill\">STEP 0\${i+1}</div>
      <div class=\"col-title\">\${esc(t)}</div>
      <div class=\"col-desc\">\${esc(d)}</div>
    </div>
  \`).join('');
  return \`<div class=\"s2-row\">\${cols}</div>\`;
}

// Style 3: 3D Smartphone / Calculator Screen
function s3() {
  return \`
  <div class=\"s3-container\">
    <div class=\"calc-screen-glass\">
      <div class=\"screen-top-bar\">
        <span class=\"screen-dot\"></span><span class=\"screen-dot\"></span><span class=\"screen-dot\"></span>
        <span class=\"screen-title-tab\">FINMATRIX REAL-TIME SIMULATOR</span>
      </div>
      <div class=\"calc-results-hero\">
        <div class=\"hero-metric-label\">\${esc(item.metric1Label || 'Total Interest Slashed')}</div>
        <div class=\"hero-metric-val\">\${esc(item.metric1Value || '$6,840.00')}</div>
      </div>
      <div class=\"calc-stats-split\">
        <div class=\"calc-sub-stat\">
          <div class=\"sub-stat-lbl\">\${esc(item.metric2Label || 'Debt-Free Accelerated')}</div>
          <div class=\"sub-stat-val\">\${esc(item.metric2Value || '18 Months Earlier')}</div>
        </div>
        <div class=\"calc-sub-stat\">
          <div class=\"sub-stat-lbl\">\${esc(item.metric3Label || 'Lifetime Capital Delta')}</div>
          <div class=\"sub-stat-val\">\${esc(item.metric3Value || '+$14,200 Wealth')}</div>
        </div>
      </div>
      <div class=\"calc-features-row\">
        <span class=\"feature-chip\">✓ 100% Free Live Math</span>
        <span class=\"feature-chip\">✓ Zero Login Required</span>
        <span class=\"feature-chip\">✓ Free .XLSX Export</span>
      </div>
    </div>
  </div>\`;
}

// Style 4: Drip Roadmap
function s4() {
  const phases = [
    ['PHASE 1: STABILIZE', item.phase1Title || 'Stop Interest Bleed', item.phase1Desc || 'Automate minimum payments & establish 1-month liquid cash buffer.'],
    ['PHASE 2: ACCELERATE', item.phase2Title || 'Deploy APR Avalanche', item.phase2Desc || 'Direct all discretionary surplus cash to highest interest balance.'],
    ['PHASE 3: COMPOUND', item.phase3Title || 'Autonomous Wealth', item.phase3Desc || 'Roll former debt payments directly into 401(k), Roth IRA & HYSA.']
  ].map(([tag, t, d], i) => \`
    <div class=\"glass-card s4-step\">
      <div class=\"step-tag\">\${tag}</div>
      <div class=\"step-title\">\${esc(t)}</div>
      <div class=\"step-desc\">\${esc(d)}</div>
    </div>
  \`).join('');
  return \`<div class=\"s4-roadmap\">\${phases}</div>\`;
}

// Style 5: Split Comparison
function s5() {
  return \`
  <div class=\"s5-split-container\">
    <div class=\"glass-card s5-card bad-card\">
      <div class=\"s5-header bad-header\">
        <span class=\"s5-pill bad-pill\">TRADITIONAL APPROACH</span>
        <h3>\${esc(item.badTitle || 'Standard Minimum Payments')}</h3>
      </div>
      <ul class=\"s5-list\">
        <li><span class=\"x-mark\">✕</span> \${esc(item.bad1 || 'Paying only minimum balance amounts')}</li>
        <li><span class=\"x-mark\">✕</span> \${esc(item.bad2 || 'Losing thousands to compounding APR')}</li>
        <li><span class=\"x-mark\">✕</span> \${esc(item.bad3 || 'Over 15+ years stuck in debt')}</li>
      </ul>
      <div class=\"s5-stat-box bad-stat-box\">
        <div class=\"stat-lbl\">TOTAL COST</div>
        <div class=\"stat-val bad-val\">\${esc(item.statsBad || '$24,800 Total Paid')}</div>
      </div>
    </div>

    <div class=\"glass-card s5-card good-card\">
      <div class=\"s5-header good-header\">
        <span class=\"s5-pill good-pill\">FINMATRIX ACCELERATED</span>
        <h3>\${esc(item.goodTitle || 'Avalanche + $100 Extra/Mo')}</h3>
      </div>
      <ul class=\"s5-list\">
        <li><span class=\"chk-mark\">✓</span> \${esc(item.good1 || 'Targeting highest APR balances first')}</li>
        <li><span class=\"chk-mark\">✓</span> \${esc(item.good2 || 'Halting compound finance charges')}</li>
        <li><span class=\"chk-mark\">✓</span> \${esc(item.good3 || 'Debt-free in only 28 months')}</li>
      </ul>
      <div class=\"s5-stat-box good-stat-box\">
        <div class=\"stat-lbl\">TOTAL COST</div>
        <div class=\"stat-val good-val\">\${esc(item.statsGood || '$16,200 Total Paid')}</div>
      </div>
    </div>
  </div>\`;
}

// Style 6: 5-Point Checklist
function s6() {
  const items = [item.check1, item.check2, item.check3, item.check4, item.check5].filter(Boolean).map((c, i) => \`
    <div class=\"glass-card s6-item\">
      <div class=\"check-circle\">✓</div>
      <div class=\"check-content\">\${esc(c)}</div>
    </div>
  \`).join('');
  return \`<div class=\"s6-checklist\">\${items}</div>\`;
}

// Style 7: Value Ladder Staircase
function s7() {
  return \`
  <div class=\"s7-ladder\">
    <div class=\"glass-card s7-step step-3\">
      <div class=\"ladder-num\">TIER 03 · WEALTH COMPOUNDING</div>
      <div class=\"ladder-title\">\${esc(item.step3Title || 'Asset Accumulation')}</div>
      <div class=\"ladder-desc\">\${esc(item.step3Desc || 'Max 401k & Roth IRA accounts to compound long-term index funds.')}</div>
    </div>
    <div class=\"glass-card s7-step step-2\">
      <div class=\"ladder-num\">TIER 02 · APR ACCELERATION</div>
      <div class=\"ladder-title\">\${esc(item.step2Title || 'High-Interest Elimination')}</div>
      <div class=\"ladder-desc\">\${esc(item.step2Desc || 'Deploy debt avalanche to eliminate all loans and cards over 7% APR.')}</div>
    </div>
    <div class=\"glass-card s7-step step-1\">
      <div class=\"ladder-num\">TIER 01 · LIQUID DEFENSE</div>
      <div class=\"ladder-title\">\${esc(item.step1Title || 'Defensive Cash Reserves')}</div>
      <div class=\"ladder-desc\">\${esc(item.step1Desc || 'Establish 3-6 months liquid buffer in high-yield savings.')}</div>
    </div>
  </div>\`;
}

// Style 8: Comparison Table
function s8() {
  return \`
  <div class=\"s8-table-card glass-card\">
    <div class=\"s8-row s8-head\">
      <div class=\"s8-col\">\${esc(item.colHeader1 || 'Payoff Strategy')}</div>
      <div class=\"s8-col\">\${esc(item.colHeader2 || 'Timeline')}</div>
      <div class=\"s8-col\">\${esc(item.colHeader3 || 'Total Interest')}</div>
    </div>
    <div class=\"s8-row\">
      <div class=\"s8-col font-bold\">\${esc(item.row1Col1 || 'Minimum Only')}</div>
      <div class=\"s8-col s8-red\">\${esc(item.row1Col2 || '18.4 Years')}</div>
      <div class=\"s8-col s8-red\">\${esc(item.row1Col3 || '$8,420')}</div>
    </div>
    <div class=\"s8-row\">
      <div class=\"s8-col font-bold\">\${esc(item.row2Col1 || '+$50 Extra/Mo')}</div>
      <div class=\"s8-col\">\${esc(item.row2Col2 || '5.2 Years')}</div>
      <div class=\"s8-col\">\${esc(item.row2Col3 || '$3,180')}</div>
    </div>
    <div class=\"s8-row\">
      <div class=\"s8-col font-bold\">\${esc(item.row3Col1 || '+$100 Extra/Mo')}</div>
      <div class=\"s8-col\">\${esc(item.row3Col2 || '2.8 Years')}</div>
      <div class=\"s8-col\">\${esc(item.row3Col3 || '$1,840')}</div>
    </div>
    <div class=\"s8-row s8-highlight\">
      <div class=\"s8-col font-bold s8-green\">\${esc(item.row4Col1 || 'Avalanche + Finmatrix')}</div>
      <div class=\"s8-col font-bold s8-green\">\${esc(item.row4Col2 || '1.9 Years')}</div>
      <div class=\"s8-col font-bold s8-green\">\${esc(item.row4Col3 || '$1,120')}</div>
    </div>
  </div>\`;
}

const BUILD = {
  STYLE_1_6CARD_GRID: s1,
  STYLE_2_4COL_MATRIX: s2,
  STYLE_3_SMARTPHONE_MOCKUP: s3,
  STYLE_4_DRIP_ROADMAP: s4,
  STYLE_5_SPLIT_COMP: s5,
  STYLE_6_CHECKLIST: s6,
  STYLE_7_LADDER: s7,
  STYLE_8_TABLE: s8
};

const body = (BUILD[item.pinStyle] || s1)();

// CSS Stylesheet
const css = \`
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; background: #000; overflow: hidden; font-family: '\${F.b}', -apple-system, BlinkMacSystemFont, sans-serif; }

.pin-wrapper {
  position: relative;
  width: 1000px;
  height: 1500px;
  overflow: hidden;
  color: \${P.ink};
  background: linear-gradient(\${angle}deg, \${P.bg1} 0%, \${P.bg2} 100%);
}

.mesh-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 750px 480px at 50% 10%, \${P.glow1} 0%, transparent 70%),
    radial-gradient(circle 540px at 85% 85%, \${P.glow2} 0%, transparent 65%);
}

.tech-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.canvas {
  position: absolute;
  inset: 0;
  padding: 56px 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header */
.hdr { position: relative; z-index: 10; margin-bottom: 24px; }
.hdr-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.brand-pill {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ffffff;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.hdr-title {
  font-size: 50px;
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -1.5px;
  margin-bottom: 12px;
  color: #ffffff;
}
.hdr-subtitle {
  font-size: 22px;
  font-weight: 500;
  color: \${P.sub};
  line-height: 1.4;
}

/* Glass Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Style 1: 6-Card Grid */
.s1-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.s1-card { padding: 22px; display: flex; flex-direction: column; justify-content: space-between; min-height: 175px; }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.number-badge { font-size: 15px; font-weight: 900; color: \${P.a}; background: rgba(16, 185, 129, 0.15); padding: 4px 12px; border-radius: 999px; }
.corner-tag { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.4); letter-spacing: 1px; }
.card-title { font-size: 21px; font-weight: 800; color: #ffffff; margin-bottom: 8px; line-height: 1.25; }
.card-desc { font-size: 15px; color: \${P.sub}; line-height: 1.45; }

/* Style 2: 4-Column Matrix */
.s2-row { display: grid; grid-template-columns: 1fr; gap: 16px; }
.s2-col { display: flex; align-items: center; gap: 20px; padding: 22px 28px; }
.col-step-pill { font-size: 14px; font-weight: 900; color: \${P.a}; background: rgba(16, 185, 129, 0.2); padding: 8px 16px; border-radius: 10px; flex-shrink: 0; }
.col-title { font-size: 22px; font-weight: 800; color: #ffffff; flex: 1; }
.col-desc { font-size: 16px; color: \${P.sub}; flex: 1.5; text-align: right; }

/* Style 3: 3D Calculator Screen */
.s3-container { display: flex; justify-content: center; align-items: center; }
.calc-screen-glass { width: 100%; background: rgba(15, 23, 42, 0.7); border: 2px solid rgba(16, 185, 129, 0.35); border-radius: 28px; padding: 36px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7); }
.screen-top-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; }
.screen-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255, 255, 255, 0.3); }
.screen-title-tab { margin-left: 12px; font-size: 13px; font-weight: 800; letter-spacing: 2px; color: #34d399; }
.calc-results-hero { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 24px; }
.hero-metric-label { font-size: 18px; font-weight: 700; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.hero-metric-val { font-size: 64px; font-weight: 900; color: #ffffff; letter-spacing: -2px; }
.calc-stats-split { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 28px; }
.calc-sub-stat { background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; }
.sub-stat-lbl { font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.6); margin-bottom: 6px; }
.sub-stat-val { font-size: 24px; font-weight: 800; color: #ffffff; }
.calc-features-row { display: flex; justify-content: space-around; font-size: 14px; font-weight: 700; color: #34d399; }

/* Style 4: Drip Roadmap */
.s4-roadmap { display: flex; flex-direction: column; gap: 20px; }
.s4-step { padding: 28px; position: relative; }
.step-tag { font-size: 12px; font-weight: 900; letter-spacing: 2px; color: \${P.a}; margin-bottom: 8px; }
.step-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
.step-desc { font-size: 16px; color: \${P.sub}; line-height: 1.5; }

/* Style 5: Split Comparison */
.s5-split-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.s5-card { padding: 30px; display: flex; flex-direction: column; justify-content: space-between; min-height: 540px; }
.bad-card { border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.05); }
.good-card { border-color: rgba(16, 185, 129, 0.45); background: rgba(16, 185, 129, 0.08); }
.s5-header { margin-bottom: 20px; }
.s5-pill { font-size: 11px; font-weight: 900; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 12px; }
.bad-pill { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.good-pill { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.s5-header h3 { font-size: 24px; font-weight: 900; color: #ffffff; line-height: 1.25; }
.s5-list { list-style: none; margin-bottom: 24px; }
.s5-list li { font-size: 16px; line-height: 1.5; color: #e2e8f0; margin-bottom: 14px; display: flex; gap: 10px; }
.x-mark { color: #f87171; font-weight: 900; }
.chk-mark { color: #34d399; font-weight: 900; }
.s5-stat-box { border-radius: 14px; padding: 18px; text-align: center; }
.bad-stat-box { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); }
.good-stat-box { background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.4); }
.stat-lbl { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: rgba(255, 255, 255, 0.6); margin-bottom: 4px; }
.stat-val { font-size: 24px; font-weight: 900; }
.bad-val { color: #fca5a5; }
.good-val { color: #86efac; }

/* Style 6: Checklist */
.s6-checklist { display: flex; flex-direction: column; gap: 16px; }
.s6-item { display: flex; align-items: center; gap: 20px; padding: 22px 28px; }
.check-circle { width: 36px; height: 36px; border-radius: 50%; background: #10b981; color: #000; font-size: 20px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.check-content { font-size: 19px; font-weight: 700; color: #ffffff; line-height: 1.4; }

/* Style 7: Ladder */
.s7-ladder { display: flex; flex-direction: column; gap: 18px; }
.s7-step { padding: 30px; }
.ladder-num { font-size: 13px; font-weight: 900; letter-spacing: 2px; color: \${P.a}; margin-bottom: 6px; }
.ladder-title { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
.ladder-desc { font-size: 17px; color: \${P.sub}; line-height: 1.45; }

/* Style 8: Table */
.s8-table-card { padding: 0; overflow: hidden; border-radius: 20px; }
.s8-row { display: grid; grid-template-columns: 2fr 1.3fr 1.5fr; padding: 24px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); align-items: center; }
.s8-head { background: rgba(255, 255, 255, 0.08); font-size: 14px; font-weight: 800; letter-spacing: 1px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; }
.s8-col { font-size: 18px; color: #ffffff; }
.font-bold { font-weight: 800; }
.s8-red { color: #fca5a5; }
.s8-green { color: #86efac; }
.s8-highlight { background: rgba(16, 185, 129, 0.15); border-bottom: none; }

/* Footer */
.ftr-card {
  position: absolute;
  left: 52px;
  right: 52px;
  bottom: 52px;
  height: 175px;
  border-radius: 26px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  z-index: 20;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
}

.ftr-tool-badge {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
}
.ftr-xlsx-icon { font-size: 32px; line-height: 1; }
.ftr-xlsx-text { font-size: 11px; font-weight: 900; color: #ffffff; letter-spacing: 1px; margin-top: 4px; }

.ftr-col-middle { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.ftr-brand-title { font-size: 22px; font-weight: 900; color: #ffffff; margin-bottom: 4px; }
.ftr-domain { font-size: 14px; font-weight: 600; color: #34d399; margin-bottom: 10px; }
.ftr-badges-row { display: flex; gap: 12px; }
.ftr-mini-pill { font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; background: rgba(255, 255, 255, 0.1); color: #e2e8f0; }

.ftr-col-cta { flex-shrink: 0; }
.ftr-cta-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  padding: 16px 26px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
  white-space: nowrap;
}
\`;

// Full HTML Canvas
const html = \`<!DOCTYPE html>
<html lang=\"en\">
<head>
<meta charset=\"UTF-8\" />
<title>Finmatrix Pin</title>
<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@600;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap\" rel=\"stylesheet\">
<style>\${css}</style>
</head>
<body>
<div class=\"pin-wrapper\">
  <div class=\"mesh-glow\"></div>
  <div class=\"tech-pattern\">\${bgPattern}</div>
  
  <div class=\"canvas\">
    <div class=\"hdr\">
      <div class=\"hdr-top\">
        <div class=\"badge-pill\">📌 \${esc(item.styleBadge || 'QUANTITATIVE CHEAT SHEET')}</div>
        <div class=\"brand-pill\">FINMATRIX CLOUD</div>
      </div>
      <h1 class=\"hdr-title\">\${esc(item.headlineOnImage || item.topic || 'FINANCIAL BLUEPRINT')}</h1>
      <p class=\"hdr-subtitle\">\${esc(item.subtitleOnImage || 'Calculators, Roadmaps & Free Spreadsheet Toolkits')}</p>
    </div>

    \${body}

    <div class=\"ftr-card\">
      <div class=\"ftr-tool-badge\">
        <span class=\"ftr-xlsx-icon\">📊</span>
        <span class=\"ftr-xlsx-text\">.XLSX</span>
      </div>
      <div class=\"ftr-col-middle\">
        <div class=\"ftr-brand-title\">Finmatrix Quantitative Research</div>
        <div class=\"ftr-domain\">finmatrix.cloud · Free Interactive Calculators</div>
        <div class=\"ftr-badges-row\">
          <span class=\"ftr-mini-pill\">⚡ NO SIGN-UP REQUIRED</span>
          <span class=\"ftr-mini-pill\">📈 SPREADSHEET INCLUDED</span>
        </div>
      </div>
      <div class=\"ftr-col-cta\">
        <div class=\"ftr-cta-btn\">CALCULATE NOW →</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>\`;

return [{
  json: {
    ...item,
    pinHtml: html
  }
}];
`;
}

// Update Node 13 (Gemini Copywriter)
const n13 = wf.nodes.find(n => n.name.includes('Generate Pin SEO Title'));
if (n13) {
  n13.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are an elite Pinterest SEO Strategist and Financial Copywriter for Finmatrix (https://finmatrix.cloud).
A high-converting vertical educational infographic (1000x1500) has been generated for this Pinterest pin.

CRITICAL SEO REQUIREMENT:
Your copy MUST be directly optimized to rank on Pinterest Search and Google SEO for the real user search query: "\${$json.targetKeyword}".
Explain the exact visual graphic framework described below. Do NOT write generic filler.

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
   - Must include the exact or near-exact target keyword: "\${$json.targetKeyword}".
   - Zero clickbait, zero markdown asterisks. Professional, clear, high CTR.

2. pinDescription:
   - Under 450 characters TOTAL (Pinterest hard truncates at 500).
   - First sentence MUST directly answer the search intent for "\${$json.targetKeyword}".
   - 2-3 concise bullet points with emojis summarizing the quantitative math shown on the graphic.
   - Soft call to action inviting users to run their numbers on the free interactive Finmatrix calculator or download the free Excel spreadsheet.
   - EXACT destination URL: \${$json.destinationUrl}
   - Exactly 5 relevant financial hashtags (e.g., #debtfreecommunity #financialfreedom #mortgagecalculator #moneytips #finmatrix).
   - ZERO markdown asterisks (NO bolding, NO italics, NO quotes).

3. altText:
   - Under 100 characters.
   - Accurate screen-reader description of the infographic layout and headline.

4. taggedTopics:
   - Array of 4-6 broad interest tags for Pinterest categorization (e.g. ['Personal Finance', 'Debt Payoff', 'Budgeting', 'Saving Money', 'Investing']).

RETURN ONLY VALID JSON wrapped in a single \\\`\\\`\\\`json markdown block:
{
  "pinTitle": "...",
  "pinDescription": "...",
  "altText": "...",
  "taggedTopics": [...]
}
\`
        }
      ]
    }
  ]
} }}`;
}

// Update Node 14 (Parse & Format Pin Data)
const n14 = wf.nodes.find(n => n.name.includes('Parse & Format Pin Data'));
if (n14) {
  n14.parameters.jsCode = `// PARSE & FORMAT PIN DATA (450-CHAR CEILING & ZERO MARKDOWN)
let rawText = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const prev = $('Inspect Asset Status & Validation').item.json || {};
const destUrl = prev.destinationUrl || 'https://finmatrix.cloud/calculators/debt-elimination-planner.html';

rawText = rawText.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();

let parsed = {};
try {
  parsed = JSON.parse(rawText);
} catch (e) {
  parsed = {
    pinTitle: (\`\${prev.headlineOnImage || prev.topic || 'Finmatrix Calculator'}: \${prev.subtitleOnImage || 'Free Financial Toolkit'}\`).substring(0, 90).trim(),
    pinDescription: \`Discover the exact mathematical framework for '\${prev.targetKeyword || 'personal finance'}'.\\n\\n📌 \${prev.headlineOnImage}: \${prev.subtitleOnImage}\\n⚡ Free interactive calculators & Excel spreadsheets at Finmatrix.\\n\\n👉 Calculate your numbers free: \${destUrl}\\n\\n#debtfree #personalfinance #financialfreedom #moneytips #finmatrix\`,
    altText: \`Infographic showing \${prev.headlineOnImage || 'financial calculator roadmap'}\`,
    taggedTopics: ['Personal Finance', 'Budgeting', 'Money Tips', 'Saving Money', 'Debt Payoff']
  };
}

let pinTitle = (parsed.pinTitle || prev.headlineOnImage || prev.topic || 'Financial Calculator').replace(/[*_#\`]/g, '').trim();
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

let pinDesc = (parsed.pinDescription || '').replace(/[*_#\`]/g, '').trim();

// Ensure destination URL is included
if (!pinDesc.includes(destUrl)) {
  pinDesc += '\\n\\n👉 Try the free calculator: ' + destUrl;
}

// 450-char safety ceiling
if (pinDesc.length > 450) {
  const parts = pinDesc.split(destUrl);
  const before = parts[0] || '';
  const after = parts[1] || '';
  const allowedBefore = 450 - destUrl.length - after.length - 10;
  if (allowedBefore > 50) {
    pinDesc = before.substring(0, allowedBefore).trim() + '...\\n\\n👉 ' + destUrl + after;
  } else {
    pinDesc = pinDesc.substring(0, 440) + '...';
  }
}

let altText = (parsed.altText || \`Infographic for \${prev.targetKeyword || 'Finmatrix'}\`).replace(/[*_#\`]/g, '').trim();
if (altText.length > 100) altText = altText.substring(0, 97) + '...';

const taggedTopics = Array.isArray(parsed.taggedTopics) ? parsed.taggedTopics : ['Personal Finance', 'Debt Free', 'Investing', 'Saving Money'];

return [{
  json: {
    ...prev,
    pinTitle: pinTitle,
    pinDescription: pinDesc,
    altText: altText,
    taggedTopics: taggedTopics,
    taggedTopicsText: taggedTopics.join(', '),
    hashtags: '#personalfinance #debtfree #moneytips #financialfreedom #finmatrix',
    status: 'Ready to Pin'
  }
}];
`;
}

// Update Node 15 (Log to Google Sheets)
const n15 = wf.nodes.find(n => n.name.includes('Log 25-Column Audit'));
if (n15) {
  n15.parameters.sheetName.value = "Finmatrix_Pinterest_Queue";
}

// Update Node 16 (Send Action Kit Email Preview to Author)
const n16 = wf.nodes.find(n => n.name.includes('Send Action Kit Email'));
if (n16) {
  n16.parameters.jsonBody = `={{ JSON.stringify({
  sender: {
    name: "Finmatrix Pro",
    email: "rakeshcfp@gmail.com"
  },
  to: [
    {
      email: "rakeshcfp@gmail.com",
      name: "Rakesh Kumar"
    }
  ],
  subject: "📌 [Ready to Pin] Finmatrix: " + ($json.pinId || 'FINPIN') + " (" + ($json.targetBoard || 'Board') + "): " + ($json.pinTitle || ''),
  htmlContent: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Pinterest Action Kit</title></head><body style='margin: 0; padding: 16px; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' align='center' style='max-width: 860px; margin: 0 auto; background: #07090e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;'><tr><td style='padding: 24px 28px; background: linear-gradient(180deg, #0f172a 0%, #07090e 100%); border-bottom: 1px solid #1e293b;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td><span style='background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 1px; display: inline-block;'>📌 FINMATRIX PINTEREST ACTION KIT</span> <span style='color: #10b981; font-size: 12px; font-weight: 700; margin-left: 10px;'>" + ($json.targetBoard || 'Board') + "</span><h1 style='color: #ffffff; font-size: 20px; font-weight: 800; margin: 12px 0 4px 0; line-height: 1.3;'>" + ($json.pinTitle || 'New Pin Ready') + "</h1><p style='color: #94a3b8; font-size: 13px; margin: 0;'>Target Keyword: <strong style='color: #38bdf8;'>" + ($json.targetKeyword || 'Keyword') + "</strong> (KD: " + ($json.keywordKD || '0') + "% | Vol: " + ($json.keywordVolume || '0') + "/mo) &bull; Style: <strong style='color: #f59e0b;'>" + ($json.styleName || 'Style') + "</strong></p></td></tr></table></td></tr><tr><td style='padding: 24px 28px;'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td width='320' valign='top' style='padding-right: 24px;'><div style='border: 1px solid #334155; border-radius: 12px; overflow: hidden; background: #000000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);'><a href='" + ($json.imageUrl || '#') + "' target='_blank' style='display: block; text-decoration: none;'><img src='" + ($json.imageUrl || '#') + "' alt='Pin Preview' width='320' style='width: 100%; height: auto; display: block;' /></a></div><div style='margin-top: 14px;'><a href='" + ($json.imageUrl || '#') + "' target='_blank' download style='display: block; background: #059669; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(5,150,105,0.4);'>📥 Download High-Res Graphic (1000x1500)</a><a href='https://www.pinterest.com/pin-creation-tool/' target='_blank' style='display: block; background: #e60023; color: #ffffff; text-align: center; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px;'>📌 Open Pinterest Pin Builder</a></div></td><td valign='top'><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>1. Pin Title (Max 90 chars)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 14px; color: #f1f5f9; font-weight: 600;'>" + ($json.pinTitle || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>2. Destination URL (With Tracking UTMs)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 12px; color: #38bdf8; word-break: break-all;'><a href='" + ($json.destinationUrl || '#') + "' target='_blank' style='color: #38bdf8; text-decoration: none;'>" + ($json.destinationUrl || '') + "</a></div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>3. Pin Description (Under 450 chars &bull; Includes Link & Hashtags)</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-size: 13px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap;'>" + ($json.pinDescription || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>4. Alt Text</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #94a3b8;'>" + ($json.altText || '') + "</div></div><div style='margin-bottom: 16px;'><label style='display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;'>5. Target Board</label><div style='background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #10b981; font-weight: 700;'>" + ($json.targetBoard || '') + "</div></div></td></tr></table></td></tr><tr><td style='padding: 16px 28px; background: #0b0f19; border-top: 1px solid #1e293b; text-align: center;'><p style='color: #475569; font-size: 12px; margin: 0;'>Finmatrix Cloud &bull; Automated Marketing Engine &bull; Generated at " + ($json.createdAt || '') + "</p></td></tr></table></body></html>"
}) }}`;
}

// Update Node 10 reference to new Node 8 name
const n10 = wf.nodes.find(n => n.name.includes('Attach Rendered Image URL'));
if (n10) {
  n10.parameters.jsCode = `const prev = $('Configure & Generate Pin Image (Finmatrix Studio Engine)').item.json;
const base = $json.url || '';
if (!base) throw new Error('Render failed: no url returned');
const { pinHtml, ...rest } = prev;          // keep the HTML out of Sheets/email
const imageUrl = (base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg')) ? base : base + '.png';
return { json: { ...rest, imageUrl, shortImageUrl: imageUrl, imageRenderedAt: new Date().toISOString() } };`;
}

// Fix connections for renamed nodes
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

// Sanitize API keys to placeholders so git secret scanners and public pushes are safe
const n6Node = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6Node && n6Node.parameters && n6Node.parameters.url) {
  n6Node.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
}
const n13Node = wf.nodes.find(n => n.name.includes('Generate Pin SEO Title'));
if (n13Node && n13Node.parameters && n13Node.parameters.url) {
  n13Node.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
}
const n16Node = wf.nodes.find(n => n.name.includes('Send Action Kit Email'));
if (n16Node && n16Node.parameters && n16Node.parameters.headerParameters && n16Node.parameters.headerParameters.parameters) {
  const apiKeyHeader = n16Node.parameters.headerParameters.parameters.find(p => p.name === 'api-key');
  if (apiKeyHeader) {
    apiKeyHeader.value = 'YOUR_BREVO_API_KEY';
  }
}

// Save output workflow file
const outPath = 'workflows/finmatrix-pinterest-marketing-automation.json';
fs.writeFileSync(outPath, JSON.stringify(wf, null, 2), 'utf8');
console.log('SUCCESS: Written refactored workflow to', outPath);
