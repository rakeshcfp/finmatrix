import fs from 'fs';
import path from 'child_process';

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

    // Purge competitor domain names and brands (e.g. myusfinance, nerdwallet, bankrate)
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
  { keyword: "debt to income ratio calculator for mortgage", volume: 18100, kd: 13, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-to-income-calculator.html" },
  { keyword: "fd interest calculator fixed deposit maturity", volume: 40500, kd: 14, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" }
];

const allParsed = [...coreHighIntent, ...c1, ...c2, ...c3];
const uniqueMap = new Map();
allParsed.forEach(item => {
  const k = item.keyword.toLowerCase().trim();
  // Filter out any lingering competitor remnants
  if (!uniqueMap.has(k) && !k.includes('myusfinance') && !k.includes('nerdwallet') && !k.includes('.com') && !k.includes('.net')) {
    uniqueMap.set(k, item);
  }
});
const masterKeywords = Array.from(uniqueMap.values());
console.log(`Loaded ${masterKeywords.length} sanitized master keywords (100% competitor-free).`);

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

// Node 5 (Pick Next Keyword, Angle & Board)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX MASTER KEYWORD ENGINE & STRATEGIC REPETITION SELECTOR
// Rotates across ${masterKeywords.length} verified high-intent SEMrush financial queries!
// Promotes Finmatrix Calculators with Pinterest-proven Laptop Workspace Showcase Designs.

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

// 2. Fetch past queue history for 30-Day Rolling Cooldown
let pastRows = [];
try {
  pastRows = $('Fetch Recent Queue History from Google Sheets').all().map(i => i.json);
} catch (e) {
  pastRows = [];
}

const pastTopics = [];
pastRows.forEach(r => {
  const top = r.Topic || r.Pillar || r.PinTitle || r.HeadlineOnImage || r.topic || r.pin_title;
  if (top) pastTopics.push(top.toLowerCase().trim());
});

// 3. 30-DAY ROLLING COOLDOWN
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

// 4. Style configuration (Bright Laptop Workspace Pin)
const pinStyle = 'STYLE_LAPTOP_WORKSPACE';
const styleName = 'Bright Laptop Workspace Showcase';
const styleBadge = '100% FREE CALCULATOR';

// 5. Unique PinID
const now = new Date();
const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
const pinId = 'FINPIN-' + dateCode + '-' + randSuffix;

// 6. Compact Destination URL
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
    pinStyle: pinStyle,
    styleName: styleName,
    styleBadge: styleBadge,
    destinationUrl: destinationWithUtm,
    baseDestinationUrl: destBaseUrl,
    utmCampaign: utmCamp,
    pastTopicsToAvoid: pastTopics.slice(-15),
    brand: 'Finmatrix Cloud',
    product: 'Free Financial Calculators & Excel Toolkits (finmatrix.cloud)',
    author: 'Finmatrix Quantitative Research Desk',
    createdAt: now.toISOString()
  }
}];
`;
}

// Node 6 (Gemini API Ideation Prompt - STRICT FINMATRIX BRAND LOCK)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Your mission: Generate mathematically grounded parameters for an interactive Financial Laptop Workspace Pin (1000x1500 vertical) that directly answers a real user search query.

TARGET SEARCH QUERY:
- Exact Keyword: "\${$json.targetKeyword}"
- Monthly Volume: \${$json.keywordVolume} | KD: \${$json.keywordKD}
- Pillar: \${$json.pillar}
- Target Board: "\${$json.targetBoard}"

PIN DESIGN SPECIFICATIONS:
The pin shows a bright, high-converting desktop workspace with:
1. Handwritten tag: "Free & Easy to Use"
2. Huge bold headline (e.g. "Amortization Calculator", "Debt Payoff Calculator", "401(k) Growth Calculator")
3. Yellow highlight pill (e.g. "Calculate Your Monthly Loan Payment", "Simulate Your Exact Debt-Free Date")
4. 5 Category pills (e.g. Mortgage, Auto Loan, Personal Loan, Refinance, Business Loan)
5. Left side checklist under "Know Your Numbers!" (Monthly Payment, Total Interest, Loan Balance, Amortization Schedule)
6. Modern Laptop mockup displaying the interactive Finmatrix calculator inputs and results.
7. Bottom navy brand banner: Finmatrix.cloud

STRICT BRAND RULES:
1. The brand is strictly "Finmatrix" (https://finmatrix.cloud). NEVER mention any other brand or website (e.g. MyUSFinance, NerdWallet, Bankrate, etc.).
2. The tool title inside the laptop screen must be: "Finmatrix " + Tool Name (e.g. "Finmatrix Amortization Engine" or "Finmatrix Debt Eliminator").
3. All inputs, calculations, and output numbers must reflect authentic personal finance mathematics for "\${$json.targetKeyword}".

RETURN ONLY VALID JSON wrapped in a single \\\`\\\`\\\`json markdown block:
{
  "headlineOnImage": "...",
  "subtitleOnImage": "...",
  "calcHeaderTitle": "Finmatrix Calculator",
  "currencySymbol": "$",
  "input1Label": "...",
  "input1Val": "...",
  "input2Label": "...",
  "input2Val": "...",
  "input3Label": "...",
  "input3Val": "...",
  "btnText": "🧮 CALCULATE PAYMENT",
  "heroResultLabel": "...",
  "heroResultVal": "...",
  "subResult1Label": "Total Paid:",
  "subResult1Val": "...",
  "subResult2Label": "Interest:",
  "subResult2Val": "...",
  "tableRow1": ["1", "$3,980", "$12,236", "$246,019"],
  "tableRow2": ["2", "$4,054", "$12,162", "$241,964"],
  "tableRow3": ["3", "$4,131", "$12,085", "$237,833"],
  "check1": "Monthly Payment",
  "check2": "Total Interest",
  "check3": "Loan Balance",
  "check4": "Amortization Schedule"
}
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

// Context-aware defaults based on pillar
let defaultHeadline = 'Amortization Calculator';
let defaultSub = 'Calculate Your Monthly Loan Payment';
let defaultHeader = 'Finmatrix Amortization Engine';
let in1L = 'Loan Amount:', in1V = '$ 250,000';
let in2L = 'Interest Rate (%):', in2V = '6.5%';
let in3L = 'Loan Term (Years):', in3V = '30 Years';
let btn = '🧮 CALCULATE PAYMENT';
let heroL = 'Monthly Payment', heroV = '$1,580.74';
let sub1L = 'Total Paid:', sub1V = '$569,064';
let sub2L = 'Interest:', sub2V = '$319,064';
let t1 = ['1', '$3,980', '$12,236', '$246,019'];
let t2 = ['2', '$4,054', '$12,162', '$241,964'];
let t3 = ['3', '$4,131', '$12,085', '$237,833'];
let ch1 = 'Monthly Payment', ch2 = 'Total Interest', ch3 = 'Loan Balance', ch4 = 'Amortization Schedule';

if (pillar.includes('debt') || kw.includes('debt') || kw.includes('credit card') || kw.includes('avalanche') || kw.includes('snowball')) {
  defaultHeadline = 'Debt Payoff Calculator';
  defaultSub = 'Simulate Your Exact Debt-Free Payoff Date';
  defaultHeader = 'Finmatrix Debt Eliminator';
  in1L = 'Total Debt Balance:'; in1V = '$ 18,500';
  in2L = 'Average APR (%):'; in2V = '22.4%';
  in3L = 'Monthly Payment:'; in3V = '$ 550/mo';
  btn = '🧮 CALCULATE PAYOFF';
  heroL = 'Debt-Free In'; heroV = '2.1 Years';
  sub1L = 'Total Saved:'; sub1V = '$9,420';
  sub2L = 'Interest Cut:'; sub2V = '68% Less';
  t1 = ['Year 1', '$6,600', '$2,480', '$12,240'];
  t2 = ['Year 2', '$6,600', '$1,120', '$5,820'];
  t3 = ['Year 3', '$5,820', '$180', '$0 PAID'];
  ch1 = 'Monthly Surplus'; ch2 = 'Total Interest Saved'; ch3 = 'Debt-Free Date'; ch4 = 'Payoff Schedule';
} else if (pillar.includes('savings') || kw.includes('cd') || kw.includes('hysa') || kw.includes('deposit') || kw.includes('compound')) {
  defaultHeadline = kw.includes('fd') ? 'FD Interest Calculator' : 'HYSA & Savings Calculator';
  defaultSub = 'Calculate Your Exact Maturity Interest & Balance';
  defaultHeader = 'Finmatrix Savings Simulator';
  in1L = 'Initial Deposit:'; in1V = kw.includes('fd') ? '₹ 100,000' : '$ 100,000';
  in2L = 'Annual APY (%):'; in2V = '7.5%';
  in3L = 'Deposit Term:'; in3V = '5 Years';
  btn = '🧮 CALCULATE INTEREST';
  heroL = 'Maturity Balance'; heroV = kw.includes('fd') ? '₹ 143,577' : '$143,577';
  sub1L = 'Principal:'; sub1V = kw.includes('fd') ? '₹ 100,000' : '$100,000';
  sub2L = 'Interest Earned:'; sub2V = kw.includes('fd') ? '₹ 43,577' : '$43,577';
  t1 = ['Yr 1', '+$7,500', '+$7,500', '$107,500'];
  t2 = ['Yr 3', '+$8,655', '+$24,230', '$124,230'];
  t3 = ['Yr 5', '+$9,985', '+$43,577', '$143,577'];
  ch1 = 'Compound APY Yield'; ch2 = 'Maturity Amount'; ch3 = 'Total Interest Earned'; ch4 = 'Growth Schedule';
} else if (pillar.includes('retirement') || kw.includes('401k') || kw.includes('roth') || kw.includes('ira')) {
  defaultHeadline = '401(k) Growth Calculator';
  defaultSub = 'Project Retirement Nest Egg with Employer Match';
  defaultHeader = 'Finmatrix 401(k) Simulator';
  in1L = 'Current Balance:'; in1V = '$ 65,000';
  in2L = 'Annual Addition:'; in2V = '$ 12,000';
  in3L = 'Employer Match:'; in3V = '50% to 6%';
  btn = '🧮 PROJECT GROWTH';
  heroL = 'Nest Egg (25 Yrs)'; heroV = '$1,428,500';
  sub1L = 'Contributions:'; sub1V = '$365,000';
  sub2L = 'Compound Growth:'; sub2V = '+$1,063,500';
  t1 = ['Yr 5', '$78,000', '+$36,400', '$179,400'];
  t2 = ['Yr 15', '$234,000', '+$312,000', '$611,000'];
  t3 = ['Yr 25', '$390,000', '+$1,038,500', '$1,428,500'];
  ch1 = 'Employer Match Math'; ch2 = 'Compound Growth'; ch3 = 'Tax-Deferred Nest Egg'; ch4 = 'Retirement Milestones';
}

const finFallbacks = {
  headlineOnImage: defaultHeadline,
  subtitleOnImage: defaultSub,
  calcHeaderTitle: defaultHeader,
  input1Label: in1L, input1Val: in1V,
  input2Label: in2L, input2Val: in2V,
  input3Label: in3L, input3Val: in3V,
  btnText: btn,
  heroResultLabel: heroL, heroResultVal: heroV,
  subResult1Label: sub1L, subResult1Val: sub1V,
  subResult2Label: sub2L, subResult2Val: sub2V,
  tableRow1: t1, tableRow2: t2, tableRow3: t3,
  check1: ch1, check2: ch2, check3: ch3, check4: ch4
};

// PURGE any competitor brand names that Gemini might have copied from search queries
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

// Enforce Finmatrix prefix in header
let calcHead = (parsed.calcHeaderTitle || defaultHeader);
calcHead = calcHead.replace(/myusfinance/gi, 'Finmatrix').replace(/calculator/gi, 'Engine');
if (!calcHead.toLowerCase().includes('finmatrix')) {
  calcHead = 'Finmatrix ' + calcHead;
}

const finalData = { ...prev, ...finFallbacks, ...parsed, calcHeaderTitle: calcHead };

const breakdown = \`Tool: \${finalData.calcHeaderTitle} | Inputs: \${finalData.input1Label} \${finalData.input1Val}, \${finalData.input2Label} \${finalData.input2Val}, \${finalData.input3Label} \${finalData.input3Val} | Key Result: \${finalData.heroResultLabel} \${finalData.heroResultVal}\`;

return [{
  json: {
    ...finalData,
    infographicBreakdown: breakdown,
    imageFilename: (prev.pinId || 'PIN') + '_' + (prev.targetKeyword || 'finmatrix').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30) + '.png'
  }
}];
`;
}

// Node 8 (BRIGHT LAPTOP WORKSPACE HTML ENGINE)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = `// FINMATRIX LAPTOP WORKSPACE PIN STUDIO ENGINE (PINTEREST PROVEN DESIGN)
const item = $json;

const headline = item.headlineOnImage || 'Amortization Calculator';
const subtitle = item.subtitleOnImage || 'Calculate Your Monthly Loan Payment';
const calcHeader = item.calcHeaderTitle || 'Finmatrix Amortization Engine';

const in1Label = item.input1Label || 'Loan Amount';
const in1Val = item.input1Val || '$ 250,000';
const in2Label = item.input2Label || 'Interest Rate (%)';
const in2Val = item.input2Val || '6.5%';
const in3Label = item.input3Label || 'Loan Term (Years)';
const in3Val = item.input3Val || '30 Years';
const btnText = item.btnText || '🧮 CALCULATE PAYMENT';

const heroResultLabel = item.heroResultLabel || 'Monthly Payment';
const heroResultVal = item.heroResultVal || '$1,580.74';
const sub1Label = item.subResult1Label || 'Total Paid:';
const sub1Val = item.subResult1Val || '$569,064';
const sub2Label = item.subResult2Label || 'Interest:';
const sub2Val = item.subResult2Val || '$319,064';

const t1 = item.tableRow1 || ['1', '$3,980', '$12,236', '$246,019'];
const t2 = item.tableRow2 || ['2', '$4,054', '$12,162', '$241,964'];
const t3 = item.tableRow3 || ['3', '$4,131', '$12,085', '$237,833'];

const ch1 = item.check1 || 'Monthly Payment';
const ch2 = item.check2 || 'Total Interest';
const ch3 = item.check3 || 'Loan Balance';
const ch4 = item.check4 || 'Amortization Schedule';

// Dynamic 5 category pills tailored to the pillar
const pillar = (item.pillar || '').toLowerCase();
let catPills = [
  { icon: '🏠', label: 'Mortgage' },
  { icon: '🚗', label: 'Auto Loan' },
  { icon: '💰', label: 'Personal Loan' },
  { icon: '🤝', label: 'Refinance' },
  { icon: '🏢', label: 'Business Loan' }
];

if (pillar.includes('debt')) {
  catPills = [
    { icon: '💳', label: 'Credit Cards' },
    { icon: '🚗', label: 'Auto Loan' },
    { icon: '🎓', label: 'Student Loan' },
    { icon: '⚡', label: 'Avalanche' },
    { icon: '❄️', label: 'Snowball' }
  ];
} else if (pillar.includes('savings')) {
  catPills = [
    { icon: '🏦', label: 'HYSA' },
    { icon: '📜', label: 'CD Ladder' },
    { icon: '🛡️', label: 'Emergency' },
    { icon: '💰', label: 'Fixed Deposit' },
    { icon: '📈', label: 'Compound APY' }
  ];
} else if (pillar.includes('retirement')) {
  catPills = [
    { icon: '💼', label: '401(k)' },
    { icon: '🪙', label: 'Roth IRA' },
    { icon: '📊', label: 'Pension' },
    { icon: '🎯', label: 'FIRE' },
    { icon: '📈', label: 'Index Funds' }
  ];
}

const pinHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Finmatrix Laptop Workspace Pin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1000px;
  height: 1500px;
  background: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0f172a;
  overflow: hidden;
}
.pin-wrapper {
  position: relative;
  width: 1000px;
  height: 1500px;
  background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 42%, #f8fafc 75%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* Desk Surface Bottom */
.desk-surface {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 540px;
  background: linear-gradient(180deg, #dfd5c6 0%, #d2c3b0 35%, #c5b39e 100%);
  border-top: 3px solid rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 12px 30px rgba(0,0,0,0.06);
}

/* Top Section */
.top-content {
  position: relative;
  z-index: 10;
  padding: 40px 48px 0 48px;
  text-align: center;
}
.script-tag {
  font-family: 'Caveat', cursive;
  font-size: 40px;
  font-weight: 700;
  color: #0369a1;
  transform: rotate(-3deg);
  display: inline-block;
  margin-bottom: 2px;
}
.main-title {
  font-family: 'Outfit', sans-serif;
  font-size: 70px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -1.5px;
  color: #0c2340;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.highlight-pill {
  display: inline-block;
  background: #fde047;
  color: #0f172a;
  font-size: 26px;
  font-weight: 800;
  padding: 9px 36px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(253, 224, 71, 0.45);
  margin-bottom: 22px;
}

/* 5 Category Pills */
.categories-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
  margin-bottom: 22px;
}
.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
.cat-icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid #ffffff;
}
.cat-item:nth-child(1) .cat-icon-circle { background: #bae6fd; }
.cat-item:nth-child(2) .cat-icon-circle { background: #bbf7d0; }
.cat-item:nth-child(3) .cat-icon-circle { background: #fef08a; }
.cat-item:nth-child(4) .cat-icon-circle { background: #e9d5ff; }
.cat-item:nth-child(5) .cat-icon-circle { background: #a7f3d0; }

.cat-label {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

/* Mid Hero Area: Left Checklist + Right Laptop */
.mid-hero-container {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 35px 22px 42px;
  flex: 1;
}

/* Left Checklist */
.left-col {
  width: 275px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 35px;
}
.script-checklist-title {
  font-family: 'Caveat', cursive;
  font-size: 38px;
  font-weight: 700;
  color: #0369a1;
  transform: rotate(-2deg);
  margin-bottom: -2px;
}
.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.check-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.35);
}
.check-text {
  font-size: 20px;
  font-weight: 800;
  color: #0c2340;
}

/* Notepad sticky */
.notepad-sticky {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 14px 18px;
  width: 215px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.09);
  transform: rotate(-4deg);
  margin-top: 8px;
}
.np-line1 {
  font-family: 'Caveat', cursive;
  font-size: 25px;
  font-weight: 700;
  color: #0284c7;
  line-height: 1.2;
}
.np-line2 {
  font-family: 'Caveat', cursive;
  font-size: 22px;
  font-weight: 700;
  color: #64748b;
}

/* Right Laptop Mockup */
.laptop-mockup-wrapper {
  position: relative;
  width: 615px;
  margin-bottom: 15px;
}
/* Laptop Screen Bezel */
.laptop-screen {
  width: 590px;
  height: 390px;
  background: #0f172a;
  border: 11px solid #1e293b;
  border-radius: 18px 18px 0 0;
  margin: 0 auto;
  box-shadow: 0 25px 50px rgba(0,0,0,0.35);
  overflow: hidden;
  position: relative;
}
.laptop-webcam {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #475569;
  border-radius: 50%;
  z-index: 20;
}
/* Inside Laptop Screen (Interactive App UI) */
.laptop-display {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}
.app-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-brand {
  font-size: 14px;
  font-weight: 800;
  color: #0c2340;
  letter-spacing: -0.3px;
}
.app-dots {
  display: flex;
  gap: 5px;
}
.app-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}

/* App Body (Inputs on Left, Results & Mini Schedule on Right) */
.app-body {
  padding: 12px 16px;
  display: flex;
  gap: 14px;
  flex: 1;
  background: #ffffff;
}
.app-inputs-col {
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.app-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.app-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}
.app-input {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}
.app-calc-btn {
  background: #0284c7;
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
  margin-top: 3px;
  box-shadow: 0 3px 8px rgba(2, 132, 199, 0.4);
}

.app-results-col {
  width: 52%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
}
.res-hero {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 6px;
}
.res-hero-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #166534;
}
.res-hero-val {
  font-size: 26px;
  font-weight: 900;
  color: #15803d;
  letter-spacing: -0.5px;
}
.res-sub-grid {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}
.res-sub-grid strong {
  color: #0f172a;
  font-weight: 800;
}

/* Mini Amortization Table */
.mini-schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5px;
  margin-top: 2px;
}
.mini-schedule-table th {
  background: #e2e8f0;
  color: #334155;
  font-weight: 800;
  padding: 3px 4px;
  text-align: right;
}
.mini-schedule-table th:first-child { text-align: left; }
.mini-schedule-table td {
  padding: 3px 4px;
  border-bottom: 1px solid #f1f5f9;
  text-align: right;
  color: #475569;
  font-weight: 600;
}
.mini-schedule-table td:first-child { text-align: left; font-weight: 700; color: #0f172a; }

/* Laptop Base (Keyboard & Trackpad) */
.laptop-base {
  width: 620px;
  height: 16px;
  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
  border-radius: 0 0 16px 16px;
  position: relative;
  box-shadow: 0 18px 30px rgba(0,0,0,0.32);
}
.laptop-notch {
  width: 80px;
  height: 5px;
  background: #475569;
  border-radius: 0 0 6px 6px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

/* Bottom Navy Brand Banner */
.bottom-brand-banner {
  position: relative;
  z-index: 20;
  background: #0c2340;
  padding: 24px 45px 30px 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -10px 25px rgba(0,0,0,0.18);
}
.brand-top-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.brand-logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22px;
}
.brand-domain-text {
  font-family: 'Outfit', sans-serif;
  font-size: 38px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.5px;
}
.brand-tagline-text {
  font-size: 16px;
  font-weight: 700;
  color: #93c5fd;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.bottom-cta-ribbon {
  background: #0284c7;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  padding: 8px 34px;
  border-radius: 999px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.45);
}
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="desk-surface"></div>

  <!-- Top Content -->
  <div class="top-content">
    <div class="script-tag">Free &amp; Easy to Use</div>
    <h1 class="main-title">\${headline}</h1>
    <div class="highlight-pill">\${subtitle}</div>

    <!-- 5 Category Pills -->
    <div class="categories-row">
      \${catPills.map(c => \`
        <div class="cat-item">
          <div class="cat-icon-circle">\${c.icon}</div>
          <span class="cat-label">\${c.label}</span>
        </div>
      \`).join('')}
    </div>
  </div>

  <!-- Mid Hero: Left Checklist + Right Laptop Mockup -->
  <div class="mid-hero-container">
    <!-- Left Checklist -->
    <div class="left-col">
      <div class="script-checklist-title">Know Your Numbers!</div>
      <div class="checklist-item">
        <div class="check-icon">✓</div>
        <span class="check-text">\${ch1}</span>
      </div>
      <div class="checklist-item">
        <div class="check-icon">✓</div>
        <span class="check-text">\${ch2}</span>
      </div>
      <div class="checklist-item">
        <div class="check-icon">✓</div>
        <span class="check-text">\${ch3}</span>
      </div>
      <div class="checklist-item">
        <div class="check-icon">✓</div>
        <span class="check-text">\${ch4}</span>
      </div>

      <!-- Sticky Note -->
      <div class="notepad-sticky">
        <div class="np-line1">Plan • Calculate • Achieve</div>
        <div class="np-line2">100% Free • Finmatrix :)</div>
      </div>
    </div>

    <!-- Right Laptop Mockup -->
    <div class="laptop-mockup-wrapper">
      <div class="laptop-screen">
        <div class="laptop-webcam"></div>
        <div class="laptop-display">
          <div class="app-header">
            <span class="app-brand">\${calcHeader}</span>
            <div class="app-dots"><span></span><span></span><span></span></div>
          </div>
          <div class="app-body">
            <!-- Left inputs inside laptop -->
            <div class="app-inputs-col">
              <div class="app-row">
                <span class="app-label">\${in1Label}</span>
                <div class="app-input">\${in1Val}</div>
              </div>
              <div class="app-row">
                <span class="app-label">\${in2Label}</span>
                <div class="app-input">\${in2Val}</div>
              </div>
              <div class="app-row">
                <span class="app-label">\${in3Label}</span>
                <div class="app-input">\${in3Val}</div>
              </div>
              <div class="app-calc-btn">\${btnText}</div>
            </div>

            <!-- Right results inside laptop -->
            <div class="app-results-col">
              <div class="res-hero">
                <div class="res-hero-lbl">\${heroResultLabel}</div>
                <div class="res-hero-val">\${heroResultVal}</div>
              </div>
              <div class="res-sub-grid">
                <div>\${sub1Label} <strong>\${sub1Val}</strong></div>
                <div>\${sub2Label} <strong>\${sub2Val}</strong></div>
              </div>
              <!-- Mini Schedule Table -->
              <table class="mini-schedule-table">
                <thead>
                  <tr>
                    <th>Yr</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>\${t1[0]}</td>
                    <td>\${t1[1]}</td>
                    <td>\${t1[2]}</td>
                    <td>\${t1[3]}</td>
                  </tr>
                  <tr>
                    <td>\${t2[0]}</td>
                    <td>\${t2[1]}</td>
                    <td>\${t2[2]}</td>
                    <td>\${t2[3]}</td>
                  </tr>
                  <tr>
                    <td>\${t3[0]}</td>
                    <td>\${t3[1]}</td>
                    <td>\${t3[2]}</td>
                    <td>\${t3[3]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Laptop Keyboard Base -->
      <div class="laptop-base">
        <div class="laptop-notch"></div>
      </div>
    </div>
  </div>

  <!-- Bottom Finmatrix Navy Brand Banner -->
  <div class="bottom-brand-banner">
    <div class="brand-top-row">
      <div class="brand-logo-icon">🧮</div>
      <div class="brand-domain-text">Finmatrix.cloud</div>
    </div>
    <div class="brand-tagline-text">Simple • Fast • Accurate</div>
    <div class="bottom-cta-ribbon">Make Smarter Financial Decisions →</div>
  </div>
</div>
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
const { pinHtml, ...rest } = prev;          // keep the HTML out of Sheets/email
const imageUrl = (base.endsWith('.png') || base.endsWith('.jpg') || base.endsWith('.jpeg')) ? base : base + '.png';
return [{ json: { ...rest, imageUrl, shortImageUrl: imageUrl, imageRenderedAt: new Date().toISOString() } }];`;
}

// Node 13 (Gemini Copywriter - STRICT BRAND RULES)
const n13 = wf.nodes.find(n => n.name.includes('Generate Pin SEO Title'));
if (n13) {
  n13.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n13.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are an elite Pinterest SEO Strategist and Financial Copywriter for Finmatrix (https://finmatrix.cloud).
A high-converting vertical educational infographic (1000x1500) showcasing a Financial Laptop Workspace Calculator has been generated for this pin.

CRITICAL BRAND REQUIREMENT:
1. The brand is strictly "Finmatrix" (https://finmatrix.cloud).
2. NEVER mention or reference any competitor brand names (like MyUSFinance, NerdWallet, Bankrate, SmartAsset, etc.) anywhere in the title, hook, bullets, or description.
3. Your copy MUST be directly optimized to rank on Pinterest Search for the search query: "\${$json.targetKeyword}".

INFOGRAPHIC DETAILS:
- Target Search Keyword: "\${$json.targetKeyword}"
- Visual Title on Graphic: "\${$json.headlineOnImage}"
- Subtitle on Graphic: "\${$json.subtitleOnImage}"
- Breakdown: "\${$json.infographicBreakdown}"

TARGET PINTEREST BOARD: \${$json.targetBoard}
DESTINATION LINK: \${$json.destinationUrl}

STRICT FORMAT & COMPLIANCE RULES:
1. pinTitle:
   - Under 90 characters.
   - Must include the search query topic: "\${$json.targetKeyword}".
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

// Node 14 (Parse & Format Pin Data - SANITIZE ALL BRAND LEAKS & GUARANTEE HASHTAGS)
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
    pinTitle: (\`\${prev.headlineOnImage || prev.topic || 'Finmatrix'}: \${prev.subtitleOnImage || 'Free Calculator'}\`).substring(0, 90).trim(),
    hook: \`Discover the exact numbers with the Finmatrix calculator.\`,
    bullet1: 'Calculate exact payments and slash interest charges.',
    bullet2: 'Download free Excel toolkits with zero sign-up required.',
    altText: \`Infographic for Finmatrix \${prev.targetKeyword || 'Calculator'}\`
  };
}

let pinTitle = (parsed.pinTitle || prev.headlineOnImage || 'Finmatrix Financial Calculator').replace(/[*_#\`]/g, '').trim();
pinTitle = pinTitle.replace(/myusfinance(\.com)?/gi, 'Finmatrix');
if (pinTitle.length > 90) pinTitle = pinTitle.substring(0, 87) + '...';

let hook = (parsed.hook || \`Discover the exact numbers for \${prev.targetKeyword || 'finances'} on Finmatrix.\`).replace(/[*_#\`]/g, '').trim();
hook = hook.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 115);

let b1 = (parsed.bullet1 || 'Deploy quantitative rules to halt compounding finance charges.').replace(/[*_#\`]/g, '').trim();
b1 = b1.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

let b2 = (parsed.bullet2 || 'Calculate payoff dates and investment growth in real time.').replace(/[*_#\`]/g, '').trim();
b2 = b2.replace(/myusfinance(\.com)?/gi, 'Finmatrix').slice(0, 65);

const ctaLine = '👉 Free Calculator & Toolkit: ' + destUrl;
const hashtags = '#personalfinance #financialfreedom #debtfree #moneytips #finmatrix';

// Assemble complete description under 500 chars with guaranteed hashtags:
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
