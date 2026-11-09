import json

workflow = {
  "name": "Finmatrix Lead Capture, Contextual Affiliate Recommendation & CRM Engine",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "finmatrix-lead",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "e915e482-7e85-4560-b884-1e9b621b76a3",
      "name": "Finmatrix Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [380, 400],
      "webhookId": "finmatrix-lead-trigger"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "{\n  \"success\": true,\n  \"message\": \"Lead successfully recorded and automated toolkit delivery initiated.\",\n  \"status\": \"queued\"\n}",
        "options": {}
      },
      "id": "bacbf6c2-edf3-47c5-a35d-773906cc630c",
      "name": "Instant Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [640, 260]
    },
    {
      "parameters": {
        "jsCode": r'''// --- FINMATRIX LEAD PROCESSING & EDITORIAL ENGINE ---
let body = $input.first().json.body || $input.first().json;
if (typeof body === 'string') {
  try { body = JSON.parse(body); } catch (e) {}
}

const rawName = (body.name || 'Valued Reader').trim();
const firstName = rawName.split(' ')[0] || 'there';
const email = (body.email || '').trim().toLowerCase();

// Safe Phone Formatting for Google Sheets:
// Leading single quote (') prevents Google Sheets from evaluating "+91..." as a broken formula
let rawPhone = (body.phone || '').trim();
const cleanDigits = rawPhone.replace(/[^0-9+]/g, '');
const phone = cleanDigits ? (cleanDigits.startsWith('+') ? "'" + cleanDigits : "'+ " + cleanDigits) : '';

const toolkitId = (body.toolkit_id || body.resource_id || 'debt-snowball-avalanche-toolkit').toLowerCase();
const toolkitTitle = body.toolkit_title || body.resource_title || 'Financial Strategy Toolkit';
const excelUrl = body.excel_download_url || body.excel_url || 'https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx';
const pdfUrl = body.pdf_download_url || body.pdf_url || 'https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf';
const pageSource = (body.page_source || body.source_page || 'https://finmatrix.cloud/downloads/').toLowerCase();

// Intent Segmentation & Free Calculator Cross-Promotion
let affiliateCategory = 'debt';
let categoryName = 'Debt Payoff Plan';
let relatedToolTitle = 'Credit Card Payoff Calculator';
let relatedToolUrl = 'https://finmatrix.cloud/calculators/credit-card-payoff-calculator.html';
let relatedArticleTitle = 'Snowball vs. Avalanche: Which Debt Strategy Wins?';
let relatedArticleUrl = 'https://finmatrix.cloud/articles/debt-snowball-vs-avalanche-calculator.html';

let followUpSubject = `Quick insight on your debt numbers, ${firstName}`;
let followUpHeadline = `The single fastest way to cut interest charges on existing debt`;
let followUpBody = `When you opened your payoff tracker, you likely noticed how much monthly cash flow gets eaten up by compounding interest rather than your principal balance.<br/><br/>The mathematical reality: paying just 10% more than your minimum monthly payment can shave months or even years off your timeline, saving thousands in finance charges.`;

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

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// Email 1: Clean Delivery (No Ads, High Deliverability)
const emailDeliveryHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Requested Toolkit</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
  .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .logo { font-size: 20px; font-weight: 800; color: #00875a; text-decoration: none; display: inline-block; margin-bottom: 24px; letter-spacing: -0.02em; }
  h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
  .download-box { margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
  .btn-primary { display: block; background: #00875a; color: #ffffff !important; text-decoration: none; padding: 13px 20px; border-radius: 6px; font-weight: 700; font-size: 15px; text-align: center; margin-bottom: 10px; }
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

// Email 2: Day 2 Strategy Deep-Dive
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
}];'''
      },
      "id": "3151b74f-4a3e-40bb-a5a5-5481a49bdd9f",
      "name": "Match Contextual Affiliate Product",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [640, 520]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": {
          "__rl": True,
          "value": "1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k",
          "mode": "id"
        },
        "sheetName": {
          "__rl": True,
          "value": "Leads CRM",
          "mode": "name"
        },
        "options": {}
      },
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Read Existing Leads from Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [900, 520],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "Q77fqnNtlbLv8HlA",
          "name": "Google Sheet Novamatrix"
        }
      }
    },
    {
      "parameters": {
        "jsCode": r'''// Deduplication: Check if same user already downloaded THIS specific tool
const existingRows = $input.all().map(item => item.json || {});
const newLead = $('Match Contextual Affiliate Product').first().json;

const leadEmail = (newLead.Email || '').trim().toLowerCase();
const leadToolkit = (newLead.Toolkit || '').trim().toLowerCase();

// Check if this user already downloaded this exact tool:
const alreadyDownloadedThisTool = existingRows.some(row => {
  const rowEmail = (row.Email || '').trim().toLowerCase();
  const rowToolkit = (row.Toolkit || '').trim().toLowerCase();
  return rowEmail === leadEmail && rowToolkit === leadToolkit;
});

if (alreadyDownloadedThisTool) {
  // Duplicate detected for the SAME tool:
  // Return empty array [] so downstream Google Sheet append & Email nodes DO NOT RUN!
  return [];
}

// User is downloading a NEW tool (or is a new user):
// Return newLead to append to Google Sheet and deliver Email 1:
return [{ json: newLead }];'''
      },
      "id": "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
      "name": "Filter Duplicate Tool Downloads",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1160, 520]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": True,
          "value": "1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k",
          "mode": "id"
        },
        "sheetName": {
          "__rl": True,
          "value": "Leads CRM",
          "mode": "name"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Timestamp": "={{ $json.Timestamp }}",
            "Name": "={{ $json.Name }}",
            "Email": "={{ $json.Email }}",
            "Phone": "={{ $json.Phone }}",
            "Toolkit": "={{ $json.Toolkit }}",
            "Affiliate_Category": "={{ $json.Affiliate_Category }}",
            "Recommended_Product": "={{ $json.Recommended_Product }}",
            "Affiliate_Offer_URL": "={{ $json.Affiliate_Offer_URL }}",
            "Source_Page": "={{ $json.Source_Page }}",
            "Lead_Quality": "={{ $json.Lead_Quality }}"
          }
        },
        "options": {}
      },
      "id": "212ada5e-dd01-4bcf-b01a-6683a8b6c804",
      "name": "Save Lead & Segment to Google Sheets CRM",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [1440, 420],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "Q77fqnNtlbLv8HlA",
          "name": "Google Sheet Novamatrix"
        }
      }
    },
    {
      "parameters": {
        "fromEmail": "support@finmatrix.cloud",
        "toEmail": "={{ $json.Email }}",
        "subject": "=Your Free Download: {{ $json.Toolkit }} [Finmatrix]",
        "html": "={{ $json.emailDeliveryHtml }}",
        "options": {}
      },
      "id": "02f18e1f-178a-4fac-af2d-78440aace33c",
      "name": "Email 1: Immediate Toolkit Delivery",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [1440, 640]
    },
    {
      "parameters": {
        "amount": 24,
        "unit": "hours"
      },
      "id": "d1c62c2a-181f-48c8-87f3-d83ecf5c2d12",
      "name": "Wait 24 Hours (Nurture Delay)",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [1720, 640],
      "webhookId": "finmatrix-nurture-delay"
    },
    {
      "parameters": {
        "fromEmail": "support@finmatrix.cloud",
        "toEmail": "={{ $json.Email }}",
        "subject": "={{ $json.followUpSubject }}",
        "html": "={{ $json.emailPitchFollowUpHtml }}",
        "options": {}
      },
      "id": "6882da56-a08d-4130-809c-169fb3a839df",
      "name": "Email 2: Contextual Educational Deep-Dive (Day 2)",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [2000, 640]
    }
  ],
  "pinData": {},
  "connections": {
    "Finmatrix Lead Webhook": {
      "main": [
        [
          {
            "node": "Instant Webhook Response",
            "type": "main",
            "index": 0
          },
          {
            "node": "Match Contextual Affiliate Product",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Match Contextual Affiliate Product": {
      "main": [
        [
          {
            "node": "Read Existing Leads from Sheet",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Existing Leads from Sheet": {
      "main": [
        [
          {
            "node": "Filter Duplicate Tool Downloads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Duplicate Tool Downloads": {
      "main": [
        [
          {
            "node": "Save Lead & Segment to Google Sheets CRM",
            "type": "main",
            "index": 0
          },
          {
            "node": "Email 1: Immediate Toolkit Delivery",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Email 1: Immediate Toolkit Delivery": {
      "main": [
        [
          {
            "node": "Wait 24 Hours (Nurture Delay)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait 24 Hours (Nurture Delay)": {
      "main": [
        [
          {
            "node": "Email 2: Contextual Educational Deep-Dive (Day 2)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": True,
  "settings": {
    "executionOrder": "v1"
  }
}

with open("workflows/finmatrix-lead-capture-workflow.json", "w", encoding="utf-8") as f:
  json.dump(workflow, f, indent=2)

print("SUCCESS: Updated finmatrix-lead-capture-workflow.json")

