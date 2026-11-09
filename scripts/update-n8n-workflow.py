import json

code = r'''// --- FINMATRIX LEAD PROCESSING & EDITORIAL DELIVERY ENGINE ---
let body = $input.first().json.body || $input.first().json;
if (typeof body === 'string') {
  try { body = JSON.parse(body); } catch (e) {}
}

const rawName = (body.name || 'Valued Reader').trim();
const firstName = rawName.split(' ')[0] || 'there';
const email = (body.email || '').trim().toLowerCase();
let rawPhone = (body.phone || '').trim();
// Single quote prefix prevents Google Sheets #ERROR! formula parse bug
const phone = rawPhone ? (rawPhone.startsWith('+') ? "'" + rawPhone : rawPhone) : '';

const toolkitId = (body.toolkit_id || body.resource_id || 'debt-snowball-avalanche-toolkit').toLowerCase();
const toolkitTitle = body.toolkit_title || body.resource_title || 'Financial Strategy Toolkit';
const excelUrl = body.excel_download_url || body.excel_url || 'https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx';
const pdfUrl = body.pdf_download_url || body.pdf_url || 'https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf';
const pageSource = (body.page_source || body.source_page || 'https://finmatrix.cloud/downloads/').toLowerCase();

// Determine Intent Category & Educational Content (No Fake Affiliates)
let affiliateCategory = 'debt';
let categoryName = 'Debt Payoff Plan';
let relatedToolTitle = 'Credit Card Payoff Calculator';
let relatedToolUrl = 'https://finmatrix.cloud/calculators/credit-card-payoff-calculator.html';
let relatedArticleTitle = 'Snowball vs. Avalanche: Which Debt Strategy Wins?';
let relatedArticleUrl = 'https://finmatrix.cloud/articles/debt-snowball-vs-avalanche-calculator.html';

let followUpSubject = `Quick insight on your debt numbers, ${firstName}`;
let followUpHeadline = `The single fastest way to cut interest charges on existing debt`;
let followUpBody = `When you opened your payoff tracker, you likely noticed how much monthly cash flow gets eaten up by interest rather than principal balance.<br/><br/>The mathematical reality: paying just 10% more than your minimum monthly payment can shave months or even years off your timeline, saving thousands in finance charges.`;

if (toolkitId.includes('mortgage') || pageSource.includes('mortgage') || pageSource.includes('loan') || pageSource.includes('payment')) {
  affiliateCategory = 'mortgage-and-loans';
  categoryName = 'Mortgage & Loan Strategy';
  relatedToolTitle = 'Loan Payment & Amortization Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/payment-calculator.html';
  relatedArticleTitle = 'How Amortization Schedules Work (And How to Save on Interest)';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/amortization-schedule.html';
  followUpSubject = `A quick tip for your amortization schedule, ${firstName}`;
  followUpHeadline = `How 1 extra payment per year cuts years off your loan`;
  followUpBody = `If you have a 30-year loan or mortgage, the interest is heavily front-loaded in the first 7 to 10 years.<br/><br/>By making just <strong>one extra monthly payment each year</strong> (or switching to bi-weekly payments), you automatically reduce the compounding principal, potentially shaving 4 to 6 years off your payoff date.`;
} else if (toolkitId.includes('emergency') || pageSource.includes('hysa') || pageSource.includes('emergency')) {
  affiliateCategory = 'cash-savings';
  categoryName = 'Cash Cushion & HYSA';
  relatedToolTitle = 'High-Yield Savings vs CD Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/hysa-vs-cd-calculator.html';
  relatedArticleTitle = 'How to Build a 6-Month Emergency Fund Step-by-Step';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/how-to-build-emergency-fund.html';
  followUpSubject = `Where does your emergency fund currently sit, ${firstName}?`;
  followUpHeadline = `Keeping cash liquid without losing to inflation`;
  followUpBody = `Traditional savings accounts often pay near 0.01% APY, quietly eroding purchasing power. Keeping your liquid reserve in an FDIC-insured High-Yield Savings Account allows your cash cushion to compound safely while remaining accessible for true unexpected expenses.`;
} else if (toolkitId.includes('retirement') || pageSource.includes('fire') || pageSource.includes('ira') || pageSource.includes('401k')) {
  affiliateCategory = 'investing-retirement';
  categoryName = 'Retirement & Wealth Strategy';
  relatedToolTitle = 'FIRE Retirement Longevity Calculator';
  relatedToolUrl = 'https://finmatrix.cloud/calculators/fire-calculator.html';
  relatedArticleTitle = 'The 4% Rule Explained: How Much Do You Need to Retire?';
  relatedArticleUrl = 'https://finmatrix.cloud/articles/what-is-the-4-percent-rule.html';
  followUpSubject = `Your retirement longevity timeline, ${firstName}`;
  followUpHeadline = `The compound growth math behind early financial freedom`;
  followUpBody = `The biggest lever in terminal wealth accumulation is time and minimizing expense drag. Even a 1% reduction in annual management fees preserves up to 30% more capital over a 25-year compounding period.`;
}

// Current timestamp for Google Sheets CRM
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// --- Build Email 1: Clean Delivery + Free Tool Recommendation (Zero Spam Triggers) ---
const emailDeliveryHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Requested Toolkit</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1a1f36; }
  .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e3e8ee; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
  .logo { font-size: 20px; font-weight: 800; color: #00875a; text-decoration: none; display: inline-block; margin-bottom: 24px; }
  h1 { font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 12px 0; }
  p { font-size: 15px; line-height: 1.6; color: #4f566b; margin: 0 0 16px 0; }
  .download-box { margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .btn-primary { display: block; background: #00875a; color: #ffffff !important; text-decoration: none; padding: 13px 20px; border-radius: 6px; font-weight: 700; font-size: 15px; text-align: center; margin-bottom: 10px; }
  .btn-secondary { display: block; background: #ffffff; color: #1a1f36 !important; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center; border: 1px solid #cbd5e1; }
  .rec-box { margin-top: 24px; padding: 16px 20px; background: #f0fdf4; border-left: 4px solid #00875a; border-radius: 4px; }
  .rec-title { font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 6px 0; }
  .rec-link { color: #00875a; font-weight: 600; text-decoration: none; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e3e8ee; font-size: 12px; color: #8792a2; line-height: 1.5; text-align: center; }
</style>
</head>
<body>
  <div class="email-container">
    <a href="https://finmatrix.cloud" class="logo">Finmatrix</a>
    <h1>Here is your requested toolkit, ${firstName}!</h1>
    <p>Thank you for downloading the <strong>${toolkitTitle}</strong>. Your files are ready below:</p>
    
    <div class="download-box">
      <a href="${excelUrl}" class="btn-primary">📥 Download Excel Spreadsheet (.xlsx)</a>
      <a href="${pdfUrl}" class="btn-secondary">📄 Download PDF Strategy Guide (.pdf)</a>
    </div>

    <div class="rec-box">
      <div class="rec-title">📊 Complementary Interactive Calculator:</div>
      <p style="font-size:13px;margin:0;color:#374151;">
        Want to run your numbers online with dynamic charts? Try our free <a href="${relatedToolUrl}" class="rec-link">${relatedToolTitle} &rarr;</a>
      </p>
    </div>

    <p style="margin-top:24px;">If you have any questions or feedback, simply reply to this email.</p>

    <div class="footer">
      Finmatrix • Transparent, zero-data-retention financial tools.<br/>
      https://finmatrix.cloud • support@finmatrix.cloud
    </div>
  </div>
</body>
</html>`;

// --- Build Email 2: High-Value Educational Deep-Dive (Day 2) ---
const emailPitchFollowUpHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${followUpHeadline}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1a1f36; }
  .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e3e8ee; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
  .logo { font-size: 18px; font-weight: 800; color: #00875a; text-decoration: none; display: inline-block; margin-bottom: 20px; }
  h1 { font-size: 18px; font-weight: 700; color: #1a1f36; margin: 0 0 16px 0; line-height: 1.4; }
  p { font-size: 15px; line-height: 1.6; color: #4f566b; margin: 0 0 16px 0; }
  .article-card { margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .btn-read { display: inline-block; background: #00875a; color: #ffffff !important; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 10px; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e3e8ee; font-size: 12px; color: #8792a2; line-height: 1.5; }
</style>
</head>
<body>
  <div class="email-container">
    <a href="https://finmatrix.cloud" class="logo">Finmatrix Intelligence</a>
    <h1>${followUpHeadline}</h1>
    <p>Hi ${firstName},</p>
    <p>${followUpBody}</p>

    <div class="article-card">
      <strong style="font-size:15px;color:#1a1f36;">Recommended Read: ${relatedArticleTitle}</strong>
      <p style="font-size:13px;color:#64748b;margin:8px 0 14px 0;">Explore our complete breakdown with step-by-step math models and comparison formulas.</p>
      <a href="${relatedArticleUrl}" class="btn-read">Read Full Strategy &rarr;</a>
    </div>

    <p style="font-size:14px;color:#64748b;">Best regards,<br/><strong>The Finmatrix Editorial Desk</strong></p>

    <div class="footer">
      You received this follow-up because you downloaded the ${toolkitTitle} on Finmatrix.<br/>
      Finmatrix • support@finmatrix.cloud
    </div>
  </div>
</body>
</html>`;

return [{
  json: {
    // Google Sheets Exact Column Headers:
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

    // Variables for Email Nodes:
    firstName,
    rawName,
    email,
    phone,
    toolkitId,
    toolkitTitle,
    excelUrl,
    pdfUrl,
    categoryName,
    followUpSubject,
    emailDeliveryHtml,
    emailPitchFollowUpHtml
  }
}];
'''

with open('workflows/finmatrix-lead-capture-workflow.json', 'r', encoding='utf-8') as f:
    wf = json.load(f)

for node in wf['nodes']:
    if node['name'] == 'Match Contextual Affiliate Product':
        node['parameters']['jsCode'] = code
    if 'Email 1' in node['name']:
        node['parameters']['fromEmail'] = 'support@finmatrix.cloud'
        node['parameters']['subject'] = '=Your Free Download: {{ $json.Toolkit }} [Finmatrix]'
    if 'Email 2' in node['name']:
        node['parameters']['fromEmail'] = 'support@finmatrix.cloud'
        node['parameters']['subject'] = '={{ $json.followUpSubject }}'

with open('workflows/finmatrix-lead-capture-workflow.json', 'w', encoding='utf-8') as f:
    json.dump(wf, f, indent=2)

print('SUCCESS')

