// --- FINMATRIX FUTURE-PROOF LEAD PROCESSING & CRM ENGINE ---
let body = $input.first().json.body || $input.first().json;
if (typeof body === 'string') {
  try { body = JSON.parse(body); } catch (e) {}
}

const rawName = (body.name || 'Valued Reader').trim();
const firstName = rawName.split(' ')[0] || 'there';
const email = (body.email || '').trim().toLowerCase();

// Safe Phone Formatting for Google Sheets (single quote prevents #ERROR!)
let rawPhone = (body.phone || '').trim();
const cleanDigits = rawPhone.replace(/[^0-9+]/g, '');
const phone = cleanDigits ? (cleanDigits.startsWith('+') ? "'" + cleanDigits : "'+ " + cleanDigits) : '';

// Extract Toolkit Metadata (Dynamically passed from frontend or lead-magnets.json)
const toolkitId = (body.toolkit_id || body.resource_id || '').toLowerCase();
const toolkitTitle = (body.toolkit_title || body.resource_title || 'Financial Strategy Toolkit & Spreadsheet').trim();
const pageSource = (body.page_source || body.source_page || 'https://finmatrix.cloud/downloads/').toLowerCase();

// URLs: Uses exact URLs passed from the download button; fallback to Finmatrix downloads hub
const excelUrl = body.excel_download_url || body.excel_url || 'https://finmatrix.cloud/downloads/';
const pdfUrl = body.pdf_download_url || body.pdf_url || 'https://finmatrix.cloud/downloads/';

// Format Date & Time for CRM
const now = new Date();
const formattedTimestamp = now.toISOString().replace('T', ' ').substring(0, 19);

// Universal Text Scanner (Matches Toolkit ID, Toolkit Title, or Page URL)
const textToScan = `${toolkitId} ${toolkitTitle.toLowerCase()} ${pageSource}`;

// --- DYNAMIC AFFILIATE & EDITORIAL ROUTING MATRIX ---
let affiliateCategory = 'debt';
let categoryName = 'Debt Elimination & Credit Card Payoff';
let relatedToolTitle = 'Credit Card Payoff Calculator';
let relatedToolUrl = 'https://finmatrix.cloud/calculators/credit-card-payoff-calculator.html';
let relatedArticleTitle = 'Debt Snowball vs. Avalanche: Which Strategy Wins?';
let relatedArticleUrl = 'https://finmatrix.cloud/articles/debt-snowball-vs-avalanche-calculator.html';

let followUpSubject = `Quick insight on your payoff numbers, ${firstName}`;
let followUpHeadline = `The single fastest way to cut interest charges on existing balances`;
let followUpBody = `When you opened your tracker, you likely noticed how much monthly cash flow gets eaten up by compounding interest rather than your principal balance.<br/><br/>The mathematical reality: paying just 10% more than your minimum monthly payment can shave months or even years off your timeline, saving thousands in finance charges.`;

// 1. REAL ESTATE SELLER NET SHEET & HOME SALE PROCEEDS
if (textToScan.includes('seller') || textToScan.includes('net-sheet') || textToScan.includes('home-sale') || textToScan.includes('house-sale') || textToScan.includes('closing-cost')) {
  affiliateCategory = 'housing';
  categoryName = 'Real Estate & Home Equity';
  relatedToolTitle = 'Real Estate Seller Net Sheet Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/seller-net-sheet-calculator.html';
  relatedArticleTitle = 'How Much Will You Really Make Selling Your Home? (Net Sheet Guide)';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/seller-net-sheet-guide.html';
  followUpSubject = `Estimating your net home proceeds, ${firstName}`;
  followUpHeadline = `The 3 hidden closing deductions that surprise home sellers`;
  followUpBody = `When preparing a home for sale, gross market value often differs dramatically from net cash in bank.<br/><br/>Agent commissions, title fees, local transfer taxes, and remaining mortgage balance payoff can consume 8% to 12% of total proceeds. Using your Net Sheet model ensures you know your exact equity baseline before listing.`;
}
// 2. RENTAL PROPERTY, ROI & REAL ESTATE INVESTING
else if (textToScan.includes('rental') || textToScan.includes('cap-rate') || textToScan.includes('cash-on-cash') || textToScan.includes('real-estate-investment')) {
  affiliateCategory = 'housing';
  categoryName = 'Real Estate Investment & Mortgages';
  relatedToolTitle = 'Rent vs. Buy Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/rent-vs-buy-calculator.html';
  relatedArticleTitle = 'How to Calculate Cap Rate and Cash-on-Cash Return on Rentals';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/rental-property-roi-guide.html';
  followUpSubject = `Analyzing your property cash flow, ${firstName}`;
  followUpHeadline = `The 50% rule for rental operating expenses`;
  followUpBody = `Experienced real estate investors often apply the 50% benchmark: roughly 50% of gross rental income goes toward non-mortgage operating expenses (taxes, insurance, maintenance, property management, vacancy reserves).<br/><br/>Keeping this reserve locked in high-yield cash preserves liquidity during tenant turnovers.`;
}
// 3. 50/30/20 BUDGETING, CASH FLOW & EXPENSE TRACKING
else if (textToScan.includes('budget') || textToScan.includes('50-30-20') || textToScan.includes('50/30/20') || textToScan.includes('cash-flow') || textToScan.includes('expense')) {
  affiliateCategory = 'cash-savings';
  categoryName = 'Budgeting & Cash Reserves';
  relatedToolTitle = 'High-Yield Savings vs CD Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html';
  relatedArticleTitle = 'The 50/30/20 Rule Explained: Step-by-Step Cash Flow Management';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/50-30-20-budget-guide.html';
  followUpSubject = `A quick tip for your 50/30/20 cash flow, ${firstName}`;
  followUpHeadline = `Automating the 20% savings split without thinking`;
  followUpBody = `The secret to sticking to a 50/30/20 budget isn't willpower—it's automation.<br/><br/>By setting up an automatic transfer on payday that moves 20% of your take-home pay directly into an FDIC-insured High-Yield Savings Account or investment account, you guarantee your wealth grows before monthly discretionary spending begins.`;
}
// 4. AUTO FINANCING, CAR LOANS & 20/4/10 RULE
else if (textToScan.includes('car') || textToScan.includes('auto') || textToScan.includes('vehicle')) {
  affiliateCategory = 'mortgage-and-loans';
  categoryName = 'Auto Financing & Car Loans';
  relatedToolTitle = 'Auto Loan Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/auto-loan-calculator.html';
  relatedArticleTitle = 'The 20/4/10 Rule for Car Payments & Auto Loans';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/car-payment-calculator.html';
  followUpSubject = `A quick tip on your car financing, ${firstName}`;
  followUpHeadline = `The 20/4/10 framework for vehicle ownership`;
  followUpBody = `Financing a car for longer than 48 months often leads to negative equity (being underwater on the loan).<br/><br/>Aim for 20% down, a 48-month term maximum, and total transportation costs below 10% of monthly gross income.`;
}
// 5. RETIREMENT, 401K, IRA, PENSION, TSP & FIRE
else if (textToScan.includes('retire') || textToScan.includes('fire') || textToScan.includes('ira') || textToScan.includes('401k') || textToScan.includes('tsp') || textToScan.includes('pension') || textToScan.includes('longevity') || textToScan.includes('withdrawal')) {
  affiliateCategory = 'investing-retirement';
  categoryName = 'Retirement & Wealth Strategy';
  relatedToolTitle = 'FIRE Retirement Longevity Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/fire-calculator.html';
  relatedArticleTitle = 'The 4% Rule Explained: How Much Do You Need to Retire?';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/what-is-the-4-percent-rule.html';
  followUpSubject = `Your retirement longevity timeline, ${firstName}`;
  followUpHeadline = `Managing the 'Sequence of Returns' risk in retirement`;
  followUpBody = `The biggest threat to a retirement portfolio isn't inflation—it's market volatility in the first 5 years of withdrawals.<br/><br/>Holding a 2-year cash buffer in risk-free high-yield cash prevents selling depressed equities during market drawdowns, dramatically improving 30-year portfolio survival.`;
}
// 6. TAX STRATEGY & TAKE-HOME PAY
else if (textToScan.includes('tax') || textToScan.includes('paycheck') || textToScan.includes('salary') || textToScan.includes('1099') || textToScan.includes('w2') || textToScan.includes('bonus')) {
  affiliateCategory = 'tax-planning';
  categoryName = 'Tax Strategy & Take-Home Pay';
  relatedToolTitle = 'Paycheck & Take-Home Pay Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/paycheck-calculator.html';
  relatedArticleTitle = 'How Marginal vs. Effective Tax Rates Work';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/paycheck-calculator.html';
  followUpSubject = `Optimizing your take-home pay, ${firstName}`;
  followUpHeadline = `Pre-tax vs. post-tax deductions: Keeping more of what you earn`;
  followUpBody = `Maximizing pre-tax contributions to HSAs, traditional 401(k)s, and FSAs lowers your adjusted gross income (AGI), directly reducing your federal and state tax liability.`;
}
// 7. MORTGAGE AMORTIZATION & EARLY LOAN ACCELERATION
else if (textToScan.includes('mortgage') || textToScan.includes('amortiz') || textToScan.includes('loan') || textToScan.includes('payment') || textToScan.includes('prepay') || textToScan.includes('refinance')) {
  affiliateCategory = 'mortgage-and-loans';
  categoryName = 'Mortgage & Loan Strategy';
  relatedToolTitle = 'Loan Payment & Amortization Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/payment-calculator.html';
  relatedArticleTitle = 'How Amortization Schedules Work (And How to Save on Interest)';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/amortization-schedule.html';
  followUpSubject = `A quick tip for your amortization schedule, ${firstName}`;
  followUpHeadline = `How 1 extra payment per year cuts years off your loan`;
  followUpBody = `If you have a 30-year loan or mortgage, interest is heavily front-loaded in the first 7 to 10 years.<br/><br/>By making just <strong>one extra monthly payment each year</strong> (or switching to bi-weekly payments), you automatically reduce compounding principal, potentially shaving 4 to 6 years off your payoff date.`;
}
// 8. EMERGENCY CASH CUSHION & HYSA
else if (textToScan.includes('emergency') || textToScan.includes('hysa') || textToScan.includes('cushion') || textToScan.includes('savings')) {
  affiliateCategory = 'cash-savings';
  categoryName = 'Cash Cushion & HYSA';
  relatedToolTitle = 'High-Yield Savings vs CD Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html';
  relatedArticleTitle = 'How to Build a 6-Month Emergency Fund Step-by-Step';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/how-to-build-emergency-fund.html';
  followUpSubject = `Where does your emergency fund currently sit, ${firstName}?`;
  followUpHeadline = `Keeping cash liquid without losing to inflation`;
  followUpBody = `Traditional savings accounts often pay near 0.01% APY, quietly eroding purchasing power. Keeping your liquid reserve in an FDIC-insured High-Yield Savings Account allows your cash cushion to compound safely while remaining accessible for true unexpected expenses.`;
}

// EMAIL 1: IMMEDIATE TOOLKIT DELIVERY HTML
const emailDeliveryHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Free Toolkit Download</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
  .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .logo { font-size: 20px; font-weight: 800; color: #00875a; text-decoration: none; display: inline-block; margin-bottom: 20px; letter-spacing: -0.02em; }
  h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; line-height: 1.3; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
  .download-box { margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .btn-primary { display: block; background: #00875a; color: #ffffff !important; text-decoration: none; padding: 14px 20px; border-radius: 6px; font-weight: 700; font-size: 15px; text-align: center; margin-bottom: 10px; }
  .btn-secondary { display: block; background: #ffffff; color: #0f172a !important; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center; border: 1px solid #cbd5e1; }
  .rec-box { margin-top: 24px; padding: 16px 20px; background: #f0fdf4; border-left: 4px solid #00875a; border-radius: 6px; }
  .rec-title { font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 6px 0; }
  .rec-link { color: #00875a; font-weight: 700; text-decoration: none; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
</style>
</head>
<body>
  <div class="email-container">
    <a href="https://finmatrix.cloud" class="logo">Finmatrix</a>
    <h1>Here is your requested toolkit, ${firstName}!</h1>
    <p>Thank you for downloading the <strong>${toolkitTitle}</strong>. Your files are ready for instant access:</p>
    
    <div class="download-box">
      <a href="${excelUrl}" class="btn-primary">📥 Download Excel Spreadsheet (.xlsx)</a>
      <a href="${pdfUrl}" class="btn-secondary">📄 Download PDF Strategy Guide (.pdf)</a>
    </div>

    <div class="rec-box">
      <div class="rec-title">📊 Complementary Interactive Calculator:</div>
      <p style="font-size:13px;margin:0;color:#334155;line-height:1.5;">
        Want to run your numbers online with dynamic visual charts? Try our free <a href="${relatedToolUrl}" class="rec-link">${relatedToolTitle} &rarr;</a>
      </p>
    </div>

    <p style="margin-top:24px;font-size:14px;color:#64748b;">Have any questions or need a specific model? Simply reply directly to this email.</p>

    <div class="footer">
      Finmatrix • Transparent, zero-data-retention financial tools.<br/>
      https://finmatrix.cloud • support@finmatrix.cloud
    </div>
  </div>
</body>
</html>`;

// EMAIL 2: DAY 2 EDUCATIONAL DEEP-DIVE HTML
const emailPitchFollowUpHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${followUpHeadline}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
  .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .logo { font-size: 18px; font-weight: 800; color: #00875a; text-decoration: none; display: inline-block; margin-bottom: 20px; }
  h1 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.4; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
  .article-card { margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .btn-read { display: inline-block; background: #00875a; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 10px; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5; }
</style>
</head>
<body>
  <div class="email-container">
    <a href="https://finmatrix.cloud" class="logo">Finmatrix Intelligence</a>
    <h1>${followUpHeadline}</h1>
    <p>Hi ${firstName},</p>
    <p>${followUpBody}</p>

    <div class="article-card">
      <strong style="font-size:15px;color:#0f172a;">Recommended Guide: ${relatedArticleTitle}</strong>
      <p style="font-size:13px;color:#64748b;margin:8px 0 14px 0;line-height:1.5;">Explore our complete breakdown with step-by-step math models and comparison formulas.</p>
      <a href="${relatedArticleUrl}" class="btn-read">Read Full Strategy &rarr;</a>
    </div>

    <p style="font-size:14px;color:#64748b;">Best regards,<br/><strong>The Finmatrix Editorial Desk</strong></p>

    <div class="footer">
      You received this follow-up because you requested the ${toolkitTitle} on Finmatrix.<br/>
      Finmatrix • support@finmatrix.cloud
    </div>
  </div>
</body>
</html>`;

return [{
  json: {
    // EXACT 10 COLUMNS FOR GOOGLE SHEETS CRM (Columns A–J):
    "Timestamp": formattedTimestamp,
    "Name": rawName,
    "Email": email,
    "Phone": phone,
    "Toolkit": toolkitTitle,
    "Affiliate_Category": affiliateCategory,
    "Recommended_Product": `Editorial: ${relatedToolTitle}`,
    "Affiliate_Offer_URL": relatedToolUrl,
    "Source_Page": pageSource,
    "Lead_Quality": "🔥 Verified Reader Lead",

    // ONLY the 3 fields needed downstream for Nodemailer:
    "emailDeliveryHtml": emailDeliveryHtml,
    "emailPitchFollowUpHtml": emailPitchFollowUpHtml,
    "followUpSubject": followUpSubject
  }
}];

