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
  { keyword: "debt to income ratio calculator for mortgage", volume: 18100, kd: 13, intent: "Commercial", pillar: "Debt & Credit Payoff", targetUrl: "https://finmatrix.cloud/calculators/debt-to-income-calculator.html" },
  { keyword: "fd interest calculator fixed deposit maturity", volume: 40500, kd: 14, intent: "Commercial", pillar: "Savings & CDs", targetUrl: "https://finmatrix.cloud/calculators/compound-interest-calculator.html" }
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

// Node 5 (Pick Next Keyword, Angle & Board)
const n5 = wf.nodes.find(n => n.name.includes('Pick Next'));
if (n5) {
  n5.name = "Pick Next Finmatrix Keyword, Angle & Board";
  n5.parameters.jsCode = `// FINMATRIX MASTER KEYWORD ENGINE & STRATEGIC REPETITION SELECTOR
// Rotates across ${masterKeywords.length} verified high-intent SEMrush financial queries!
// Promotes Finmatrix Calculators with Pinterest-proven Calculator Showcase Designs.

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

// 2. Fetch past queue history for 30-Day Rolling Cooldown & Theme Rotation
let pastRows = [];
try {
  pastRows = $('Fetch Recent Queue History from Google Sheets').all().map(i => i.json);
} catch (e) {
  pastRows = [];
}

const pastTopics = [];
const recentStyles = [];

pastRows.forEach(r => {
  const top = r.Topic || r.Pillar || r.PinTitle || r.HeadlineOnImage || r.topic || r.pin_title;
  if (top) pastTopics.push(top.toLowerCase().trim());
  const sty = r.PinStyle || r.ContentAngle || r.pin_style || r.content_angle || r.pinStyle;
  if (sty) recentStyles.push(sty);
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

// 4. LUXURY THEME ROTATION (Always matching the Calculator Showcase pattern)
const luxuryThemes = [
  { id: 'THEME_NAVY_GOLD', theme: 'navy', name: 'Royal Navy & Gold Showcase', badge: '100% FREE CALCULATOR' },
  { id: 'THEME_EMERALD_GOLD', theme: 'emerald', name: 'Emerald Wealth & Gold Showcase', badge: 'INSTANT SIMULATOR' },
  { id: 'THEME_AMETHYST_GOLD', theme: 'amethyst', name: 'Midnight Amethyst & Gold Showcase', badge: 'QUANTITATIVE TOOLKIT' },
  { id: 'THEME_CARBON_GOLD', theme: 'carbon', name: 'Carbon Sapphire & Gold Showcase', badge: 'FINANCIAL CALCULATOR' }
];

const lastStyle = recentStyles[recentStyles.length - 1];
const availableThemes = luxuryThemes.filter(s => s.id !== lastStyle);
const chosenThemeObj = availableThemes[Math.floor(Math.random() * availableThemes.length)] || luxuryThemes[0];

const pinStyle = chosenThemeObj.id;
const styleName = chosenThemeObj.name;
const styleBadge = chosenThemeObj.badge;
const themeVariant = chosenThemeObj.theme;

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
    themeVariant: themeVariant,
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

// Node 6 (Gemini API Ideation Prompt - STRICT FINANCIAL CALCULATOR SCHEMA)
const n6 = wf.nodes.find(n => n.name.includes('Ideate Fresh Concept'));
if (n6) {
  n6.parameters.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=YOUR_GEMINI_API_KEY';
  n6.parameters.jsonBody = `={{ {
  contents: [
    {
      parts: [
        {
          text: \`You are the Chief Quantitative Content Strategist for Finmatrix (https://finmatrix.cloud).
Your mission: Generate mathematically grounded parameters for an interactive Financial Calculator Showcase Pin (1000x1500 vertical) that directly answers a real user search query.

TARGET SEARCH QUERY:
- Exact Keyword: "\${$json.targetKeyword}"
- Monthly Volume: \${$json.keywordVolume} | KD: \${$json.keywordKD}
- Pillar: \${$json.pillar}
- Target Board: "\${$json.targetBoard}"

PIN DESIGN SPECIFICATIONS:
The graphic showcases an interactive calculator card with input fields, a 3D Calculate button, realistic output results, a 3D gold wealth shield, and 4 high-value feature bullet points.

CRITICAL INSTRUCTIONS:
1. All inputs, calculations, and output numbers must reflect authentic personal finance mathematics for "\${$json.targetKeyword}".
2. NO freelance proposals, NO client revivals, NO chat prompts, NO resume dumping pills. This is STRICTLY a quantitative financial tool showcase!
3. Keep headline punchy (2-4 words, e.g. "FD Interest Calculator", "Debt Payoff Calculator", "401(k) Growth Calculator", "Mortgage Payoff Calculator", "HYSA vs CD Calculator").
4. Keep subtitle concise and educational (under 12 words).

RETURN ONLY VALID JSON wrapped in a single \\\`\\\`\\\`json markdown block:
{
  "headlineOnImage": "...",
  "subtitleOnImage": "...",
  "calcHeaderTitle": "...",
  "currencySymbol": "$",
  "input1Label": "...",
  "input1Val": "...",
  "input2Label": "...",
  "input2Val": "...",
  "input3Label": "...",
  "input3Val": "...",
  "btnText": "CALCULATE NOW",
  "result1Label": "...",
  "result1Val": "...",
  "result2Label": "...",
  "result2Val": "...",
  "bullet1Text": "...",
  "bullet2Text": "...",
  "bullet3Text": "...",
  "bullet4Text": "..."
}
\`
        }
      ]
    }
  ]
} }}`;
}

// Node 7 (Validate Brief & Robust Fallbacks for All Financial Pillars)
const n7 = wf.nodes.find(n => n.name.includes('Validate Topic'));
if (n7) {
  n7.parameters.jsCode = `// VALIDATE BRIEF & PREPARE AUDIT DATA FOR FINMATRIX CALCULATOR SHOWCASE
const prev = $('Pick Next Finmatrix Keyword, Angle & Board').item.json || {};
const rawGemini = $json.candidates?.[0]?.content?.parts?.[0]?.text || '';
const kw = prev.targetKeyword || 'Personal Finance Calculator';
const pillar = (prev.pillar || '').toLowerCase();

// Context-aware defaults based on pillar
let defaultHeadline = 'Financial Growth Calculator';
let defaultSub = 'Simulate exact interest, compound yield & payoff timeline';
let defaultHeader = 'FINMATRIX CALCULATOR';
let in1L = 'Initial Amount:', in1V = '$25,000';
let in2L = 'Interest Rate (APY):', in2V = '6.5%';
let in3L = 'Time Horizon:', in3V = '5 Years';
let res1L = 'Total Interest Earned:', res1V = '$9,240';
let res2L = 'Final Total Balance:', res2V = '$34,240';
let b1 = 'Free interactive online calculation simulator';
let b2 = 'Instant real-time compound growth results';
let b3 = 'Includes free downloadable Excel spreadsheet (.xlsx)';
let b4 = '100% Private & Free • Zero sign-up required';
let curr = '$';

if (pillar.includes('debt') || kw.includes('debt') || kw.includes('credit card') || kw.includes('avalanche') || kw.includes('snowball')) {
  defaultHeadline = 'Debt Payoff Calculator';
  defaultSub = 'Simulate exact debt-free dates and interest savings instantly';
  defaultHeader = 'DEBT ELIMINATION SIMULATOR';
  in1L = 'Total Card Debt:'; in1V = '$18,500';
  in2L = 'Average APR:'; in2V = '22.4%';
  in3L = 'Monthly Payment:'; in3V = '$550/mo';
  res1L = 'Total Interest Saved:'; res1V = '$9,420';
  res2L = 'Accelerated Payoff Date:'; res2V = '2.1 Years';
  b1 = 'Free debt avalanche & snowball simulator';
  b2 = 'Calculate exact debt-free milestone online';
  b3 = 'Includes free Excel debt payoff tracker (.xlsx)';
  b4 = '100% Free • No registration or credit check required';
} else if (pillar.includes('savings') || kw.includes('cd') || kw.includes('hysa') || kw.includes('deposit') || kw.includes('compound')) {
  defaultHeadline = kw.includes('fd') ? 'FD Interest Calculator' : 'HYSA & Savings Calculator';
  defaultSub = 'Calculate your exact compound interest, APY yield and maturity amount';
  defaultHeader = kw.includes('fd') ? 'FD INTEREST CALCULATOR' : 'COMPOUND SAVINGS SIMULATOR';
  curr = kw.includes('fd') ? '₹' : '$';
  in1L = 'Deposit Amount:'; in1V = curr === '₹' ? '₹ 100,000' : '$100,000';
  in2L = 'Interest Rate (APY):'; in2V = '7.5%';
  in3L = 'Deposit Term:'; in3V = '5 Years';
  res1L = 'Total Interest Earned:'; res1V = curr === '₹' ? '₹ 43,577' : '$43,577';
  res2L = 'Final Maturity Amount:'; res2V = curr === '₹' ? '₹ 143,577' : '$143,577';
  b1 = 'Free interactive deposit yield calculator';
  b2 = 'Calculate exact maturity amount online';
  b3 = 'Find highest yield risk-free savings scheme';
  b4 = 'Accurate compound interest math • 100% Free';
} else if (pillar.includes('retirement') || kw.includes('401k') || kw.includes('roth') || kw.includes('ira') || kw.includes('fire')) {
  defaultHeadline = '401(k) Growth Calculator';
  defaultSub = 'Project retirement nest egg with employer match & compound yield';
  defaultHeader = '401(K) RETIREMENT SIMULATOR';
  in1L = 'Current 401(k) Balance:'; in1V = '$65,000';
  in2L = 'Annual Contribution:'; in2V = '$12,000';
  in3L = 'Employer Match:'; in3V = '50% to 6%';
  res1L = 'Future Balance (25 Yrs):'; res1V = '$1,428,500';
  res2L = 'Total Employer Match:'; res2V = '+$185,000';
  b1 = 'Free 401(k) compound growth calculator';
  b2 = 'Project tax-deferred wealth accumulation';
  b3 = 'Includes downloadable retirement Excel model';
  b4 = 'Instant results • 100% Free & private';
} else if (pillar.includes('mortgage') || kw.includes('mortgage') || kw.includes('afford') || kw.includes('amortiz')) {
  defaultHeadline = 'Mortgage Payoff Calculator';
  defaultSub = 'Calculate extra principal savings and early payoff date';
  defaultHeader = 'MORTGAGE AMORTIZATION CALCULATOR';
  in1L = 'Loan Amount:'; in1V = '$380,000';
  in2L = 'Interest Rate:'; in2V = '6.5%';
  in3L = 'Extra Monthly Principal:'; in3V = '+$200/mo';
  res1L = 'Total Interest Saved:'; res1V = '+$68,450';
  res2L = 'Term Shortened:'; res2V = '6.8 Years Early';
  b1 = 'Free mortgage amortization calculator';
  b2 = 'Calculate interest savings with extra payments';
  b3 = 'Includes full yearly & monthly payment schedule';
  b4 = 'Free Excel amortization template included';
}

const finFallbacks = {
  headlineOnImage: defaultHeadline,
  subtitleOnImage: defaultSub,
  calcHeaderTitle: defaultHeader,
  currencySymbol: curr,
  input1Label: in1L, input1Val: in1V,
  input2Label: in2L, input2Val: in2V,
  input3Label: in3L, input3Val: in3V,
  btnText: 'CALCULATE NOW',
  result1Label: res1L, result1Val: res1V,
  result2Label: res2L, result2Val: res2V,
  bullet1Text: b1,
  bullet2Text: b2,
  bullet3Text: b3,
  bullet4Text: b4
};

let cleanJson = rawGemini.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();
let parsed = {};
try {
  parsed = JSON.parse(cleanJson);
} catch (e) {
  parsed = finFallbacks;
}

const finalData = { ...prev, ...finFallbacks, ...parsed };

const breakdown = \`Calculator: \${finalData.calcHeaderTitle} | Inputs: \${finalData.input1Label} \${finalData.input1Val}, \${finalData.input2Label} \${finalData.input2Val}, \${finalData.input3Label} \${finalData.input3Val} | Results: \${finalData.result1Label} \${finalData.result1Val}, \${finalData.result2Label} \${finalData.result2Val}\`;

return [{
  json: {
    ...finalData,
    infographicBreakdown: breakdown,
    imageFilename: (prev.pinId || 'PIN') + '_' + (prev.targetKeyword || 'finmatrix').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30) + '.png'
  }
}];
`;
}

// Node 8 (CALCULATOR SHOWCASE HTML ENGINE)
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));
if (n8) {
  n8.name = "Configure & Generate Pin Image (Finmatrix Studio Engine)";
  n8.parameters.jsCode = `// FINMATRIX CALCULATOR SHOWCASE STUDIO ENGINE (PINTEREST HIGH-CONVERTING DESIGN)
const item = $json;

const theme = item.themeVariant || 'navy';
const themes = {
  navy: {
    bgGrad: 'radial-gradient(circle at 50% 15%, #0e3058 0%, #03142e 50%, #010a18 100%)',
    topGlow: 'rgba(14, 165, 233, 0.28)',
    calcBorder: 'rgba(56, 189, 248, 0.45)',
    calcHeaderGrad: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
    cardBg: 'linear-gradient(180deg, #1b385e 0%, #0c213b 100%)'
  },
  emerald: {
    bgGrad: 'radial-gradient(circle at 50% 15%, #064e3b 0%, #022c22 50%, #01140f 100%)',
    topGlow: 'rgba(16, 185, 129, 0.28)',
    calcBorder: 'rgba(52, 211, 153, 0.45)',
    calcHeaderGrad: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
    cardBg: 'linear-gradient(180deg, #0d4233 0%, #062b21 100%)'
  },
  amethyst: {
    bgGrad: 'radial-gradient(circle at 50% 15%, #2e1065 0%, #170933 50%, #090315 100%)',
    topGlow: 'rgba(168, 85, 247, 0.28)',
    calcBorder: 'rgba(192, 132, 252, 0.45)',
    calcHeaderGrad: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
    cardBg: 'linear-gradient(180deg, #321959 0%, #1b0a33 100%)'
  },
  carbon: {
    bgGrad: 'radial-gradient(circle at 50% 15%, #1e293b 0%, #0f172a 50%, #020617 100%)',
    topGlow: 'rgba(56, 189, 248, 0.25)',
    calcBorder: 'rgba(148, 163, 184, 0.45)',
    calcHeaderGrad: 'linear-gradient(90deg, #334155 0%, #1e293b 100%)',
    cardBg: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
  }
};

const t = themes[theme] || themes.navy;

const headline = item.headlineOnImage || 'FD & Savings Calculator';
const subtitle = item.subtitleOnImage || 'Calculate your fixed deposit interest and maturity amount';
const calcHeader = item.calcHeaderTitle || 'FD INTEREST CALCULATOR';
const in1Label = item.input1Label || 'Deposit Amount:';
const in1Val = item.input1Val || '$100,000';
const in2Label = item.input2Label || 'Interest Rate (% APY):';
const in2Val = item.input2Val || '7.5%';
const in3Label = item.input3Label || 'Deposit Term:';
const in3Val = item.input3Val || '5 Years';
const btnText = item.btnText || 'CALCULATE NOW';
const res1Label = item.result1Label || 'Total Interest Earned:';
const res1Val = item.result1Val || '$43,577';
const res2Label = item.result2Label || 'Final Maturity Amount:';
const res2Val = item.result2Val || '$143,577';
const b1Text = item.bullet1Text || 'Free interactive online calculation simulator';
const b2Text = item.bullet2Text || 'Calculate maturity amount online';
const b3Text = item.bullet3Text || 'Find best savings scheme';
const b4Text = item.bullet4Text || 'Accurate compound interest math';
const currency = item.currencySymbol || '$';

const pinHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Finmatrix Pin Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1000px;
  height: 1500px;
  background: #010a18;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #ffffff;
  overflow: hidden;
}
.pin-wrapper {
  position: relative;
  width: 1000px;
  height: 1500px;
  background: \${t.bgGrad};
  overflow: hidden;
  padding: 55px 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.glow-orb-top {
  position: absolute;
  top: -80px;
  left: 200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, \${t.topGlow} 0%, transparent 70%);
  pointer-events: none;
}
.glow-orb-coins {
  position: absolute;
  top: 360px;
  right: 10px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 65%);
  pointer-events: none;
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* Header */
.header-box {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-top: 5px;
}
.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 8px 22px;
  border-radius: 999px;
  margin-bottom: 16px;
}
.main-title {
  font-family: 'Outfit', sans-serif;
  font-size: 64px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ffffff 25%, #fde047 65%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  text-shadow: 0 4px 24px rgba(245, 158, 11, 0.3);
}
.sub-title {
  font-size: 24px;
  font-weight: 600;
  color: #cbd5e1;
  line-height: 1.4;
  max-width: 820px;
  margin: 0 auto;
}

/* Hero Showcase */
.hero-showcase {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 15px 0;
}
.calculator-card {
  width: 580px;
  background: \${t.cardBg};
  border: 2px solid \${t.calcBorder};
  border-radius: 26px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(14, 165, 233, 0.25);
  overflow: hidden;
  flex-shrink: 0;
}
.calc-top-header {
  background: \${t.calcHeaderGrad};
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calc-top-title {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #ffffff;
  text-transform: uppercase;
}
.calc-top-dots {
  display: flex;
  gap: 6px;
}
.calc-top-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
}
.calc-body {
  padding: 26px 24px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.calc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.calc-label {
  font-size: 19px;
  font-weight: 700;
  color: #f1f5f9;
}
.calc-input-box {
  width: 260px;
  background: #ffffff;
  color: #0f172a;
  font-size: 21px;
  font-weight: 800;
  padding: 11px 18px;
  border-radius: 10px;
  text-align: right;
  border: 1px solid #cbd5e1;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}
.calc-btn-container {
  margin-top: 4px;
}
.calc-action-btn {
  width: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.calc-results-box {
  background: linear-gradient(180deg, #f0fdf4 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 16px 22px;
  border: 1px solid #bae6fd;
  margin-top: 4px;
  color: #0f172a;
}
.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.result-item:first-child {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.result-lbl {
  font-size: 17px;
  font-weight: 700;
  color: #334155;
}
.result-val {
  font-size: 22px;
  font-weight: 900;
  color: #0369a1;
}
.result-val.highlight {
  font-size: 26px;
  color: #059669;
}

/* 3D Wealth Visual (Shield & Multiple Coin Stacks) */
.hero-3d-visual {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.wealth-shield-svg {
  width: 290px;
  height: 320px;
  filter: drop-shadow(0 20px 35px rgba(0,0,0,0.7));
}

/* Feature List (4 Icon Bullets) */
.features-container {
  position: relative;
  z-index: 10;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(20px);
}
.feature-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.feature-icon-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(16, 185, 129, 0.22) 100%);
  border: 1px solid rgba(56, 189, 248, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}
.feature-text {
  font-size: 22px;
  font-weight: 700;
  color: #f8fafc;
}

/* Footer */
.footer-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  background: #0f172a;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.brand-logo-text {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: #ffffff;
}
.brand-domain {
  font-size: 15px;
  color: #38bdf8;
  font-weight: 600;
}
.footer-cta-pill {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
}
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="glow-orb-top"></div>
  <div class="glow-orb-coins"></div>
  <div class="bg-grid"></div>

  <!-- Header -->
  <div class="header-box">
    <div class="tag-badge">⚡ 100% FREE CALCULATOR</div>
    <h1 class="main-title">\${headline}</h1>
    <p class="sub-title">\${subtitle}</p>
  </div>

  <!-- Hero Showcase: Calculator Card + 3D Gold Shield & Stacks of Coins -->
  <div class="hero-showcase">
    <div class="calculator-card">
      <div class="calc-top-header">
        <span class="calc-top-title">\${calcHeader}</span>
        <div class="calc-top-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <span class="calc-label">\${in1Label}</span>
          <div class="calc-input-box">\${in1Val}</div>
        </div>
        <div class="calc-row">
          <span class="calc-label">\${in2Label}</span>
          <div class="calc-input-box">\${in2Val}</div>
        </div>
        <div class="calc-row">
          <span class="calc-label">\${in3Label}</span>
          <div class="calc-input-box">\${in3Val}</div>
        </div>
        <div class="calc-btn-container">
          <div class="calc-action-btn">\${btnText}</div>
        </div>
        <div class="calc-results-box">
          <div class="result-item">
            <span class="result-lbl">\${res1Label}</span>
            <span class="result-val">\${res1Val}</span>
          </div>
          <div class="result-item">
            <span class="result-lbl">\${res2Label}</span>
            <span class="result-val highlight">\${res2Val}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D Gold Shield & Shiny Coins -->
    <div class="hero-3d-visual">
      <svg class="wealth-shield-svg" viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="30%" stop-color="#fde047"/>
            <stop offset="70%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="shieldFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#f59e0b"/>
            <stop offset="85%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="coinEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#92400e"/>
            <stop offset="25%" stop-color="#fef08a"/>
            <stop offset="65%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="coinTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef9c3"/>
            <stop offset="50%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Golden Wealth Shield -->
        <g transform="translate(20, 10)">
          <path d="M100 5 L185 45 C185 145 100 215 100 215 C100 215 15 145 15 45 Z" fill="url(#goldRim)" filter="url(#glow)"/>
          <path d="M100 12 L177 49 C177 140 100 205 100 205 C100 205 23 140 23 49 Z" fill="url(#shieldFace)" stroke="#fffbeb" stroke-width="2"/>
          <path d="M100 24 L165 56 C165 132 100 188 100 188 C100 188 35 132 35 56 Z" fill="rgba(0,0,0,0.18)"/>
          <!-- Currency Emblem -->
          <text x="100" y="120" font-family="'Outfit', sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="central" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));">\${currency}</text>
        </g>

        <!-- Stacks of Shiny 3D Gold Coins -->
        <!-- Left Coin Stack (Lower, 2 coins) -->
        <g transform="translate(25, 175)">
          <ellipse cx="35" cy="42" rx="30" ry="11" fill="#78350f"/>
          <rect x="5" y="32" width="60" height="10" fill="url(#coinEdge)"/>
          <ellipse cx="35" cy="32" rx="30" ry="11" fill="url(#coinTop)" stroke="#fef08a" stroke-width="1.5"/>

          <rect x="5" y="20" width="60" height="10" fill="url(#coinEdge)"/>
          <ellipse cx="35" cy="20" rx="30" ry="11" fill="url(#coinTop)" stroke="#ffffff" stroke-width="1.5"/>
        </g>

        <!-- Right / Front Main Stack (Taller, 4 coins) -->
        <g transform="translate(110, 155)">
          <ellipse cx="45" cy="65" rx="42" ry="14" fill="#78350f"/>
          <rect x="3" y="53" width="84" height="12" fill="url(#coinEdge)"/>
          <ellipse cx="45" cy="53" rx="42" ry="14" fill="url(#coinTop)" stroke="#fef08a" stroke-width="1.5"/>

          <rect x="3" y="38" width="84" height="12" fill="url(#coinEdge)"/>
          <ellipse cx="45" cy="38" rx="42" ry="14" fill="url(#coinTop)" stroke="#fef08a" stroke-width="1.5"/>

          <rect x="3" y="23" width="84" height="12" fill="url(#coinEdge)"/>
          <ellipse cx="45" cy="23" rx="42" ry="14" fill="url(#coinTop)" stroke="#fef08a" stroke-width="1.5"/>

          <rect x="3" y="8" width="84" height="12" fill="url(#coinEdge)"/>
          <ellipse cx="45" cy="8" rx="42" ry="14" fill="url(#coinTop)" stroke="#ffffff" stroke-width="2"/>
        </g>

        <!-- Sparkles -->
        <text x="30" y="35" font-size="24" fill="#fef08a">✦</text>
        <text x="215" y="80" font-size="18" fill="#ffffff">✦</text>
        <text x="190" y="210" font-size="20" fill="#fef08a">✦</text>
      </svg>
    </div>
  </div>

  <!-- 4 Feature Bullets -->
  <div class="features-container">
    <div class="feature-row">
      <div class="feature-icon-badge">🧮</div>
      <span class="feature-text">\${b1Text}</span>
    </div>
    <div class="feature-row">
      <div class="feature-icon-badge">📅</div>
      <span class="feature-text">\${b2Text}</span>
    </div>
    <div class="feature-row">
      <div class="feature-icon-badge">🔑</div>
      <span class="feature-text">\${b3Text}</span>
    </div>
    <div class="feature-row">
      <div class="feature-icon-badge">💰</div>
      <span class="feature-text">\${b4Text}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-bar">
    <div class="footer-brand">
      <div class="brand-logo-text">Finmatrix Cloud</div>
      <span class="brand-domain">finmatrix.cloud · Quantitative Finance</span>
    </div>
    <div class="footer-cta-pill">VISIT SITE & CALCULATE →</div>
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
A high-converting vertical educational infographic (1000x1500) showcasing a Financial Calculator has been generated for this pin.

CRITICAL SEO REQUIREMENT:
Your copy MUST be directly optimized to rank on Pinterest Search and Google SEO for the real user search query: "\${$json.targetKeyword}".

INFOGRAPHIC DETAILS:
- Target Search Keyword: "\${$json.targetKeyword}" (Monthly Search Volume: \${$json.keywordVolume}, Keyword Difficulty: \${$json.keywordKD})
- Visual Title on Graphic: "\${$json.headlineOnImage}"
- Subtitle on Graphic: "\${$json.subtitleOnImage}"
- Breakdown: "\${$json.infographicBreakdown}"

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
