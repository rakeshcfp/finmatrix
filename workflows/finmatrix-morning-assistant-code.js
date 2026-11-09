// --- FINMATRIX ELI5 CHIEF OF STAFF ENGINE ---
const now = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const dayIndex = now.getDay();
const dayOfMonth = now.getDate();
const dayName = days[dayIndex];
const dateString = `${dayName}, ${months[now.getMonth()]} ${dayOfMonth}, ${now.getFullYear()}`;

// 15-day Sprint Cycle calculation
const isToolSprintCycle = (dayOfMonth <= 15);
const cycleName = isToolSprintCycle ? "Tool Sprint Phase (Days 1–15)" : "Template Sprint Phase (Days 16–31)";

// Day-specific ELI5 Plans
let plan = {};

if (dayIndex === 1) { // MONDAY
  plan = {
    focusTitle: "Article 1 of 2: Publish & Deploy",
    estTime: "15–20 Minutes",
    themeBadge: "🚀 ARTICLE 1 PUBLISH DAY",
    headline: "Publish This Week's 1st Low-KD Article to Google",
    eli5Summary: "Today is Monday! We publish our first article of the week. You don't need to write anything by hand. We use our automated 1-line command to pull the lowest-KD keyword, create a rich financial guide with an interactive tool, and push it to Hostinger in 3 minutes.",
    steps: [
      {
        stepNum: "1",
        title: "Open Your Terminal in VS Code / Antigravity",
        instruction: "Open Antigravity or PowerShell on your computer. Make sure you are in your project folder: <code>c:\\Antigravity\\finmatrix</code>."
      },
      {
        stepNum: "2",
        title: "Run the 1-Line Article Generator",
        instruction: "Copy and paste this exact command into the terminal and press Enter:<br/><div style='background:#0f172a;color:#38bdf8;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>npm run ingest -- data/ --sort-kd --top 1 --build</div><span style='color:#64748b;font-size:12px;'>👉 This picks the lowest KD keyword from your CSV files, writes the complete SEO article with formulas & FAQs, and builds the static HTML.</span>"
      },
      {
        stepNum: "3",
        title: "Package the Update for Hostinger",
        instruction: "Run this command to create the upload zip file:<br/><div style='background:#0f172a;color:#38bdf8;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>npm run package</div>"
      },
      {
        stepNum: "4",
        title: "Upload & Unzip on Hostinger (Takes 30 Seconds)",
        instruction: "1. Log into Hostinger File Manager in <code>public_html/</code>.<br/>2. Click <strong>Upload</strong> and select <code>finmatrix-production-deploy.zip</code> from your computer.<br/>3. In your browser, open this link to unzip everything in 1 click: <br/><a href='https://finmatrix.cloud/unzip.php' style='color:#059669;font-weight:700;'>https://finmatrix.cloud/unzip.php</a>"
      },
      {
        stepNum: "5",
        title: "Submit URL to Google for Instant Indexing",
        instruction: "Open <a href='https://search.google.com/search-console' style='color:#0284c7;font-weight:700;'>Google Search Console</a>, paste your newly published article URL into the top search bar, and click <strong>Request Indexing</strong>. Done!"
      }
    ],
    growthTip: "By publishing on Monday morning, Google's crawler crawls your page before mid-week search volume peaks, giving you maximum weekend impressions.",
    quickLinks: [
      { text: "Hostinger Unzip Tool", url: "https://finmatrix.cloud/unzip.php" },
      { text: "Google Search Console", url: "https://search.google.com/search-console" },
      { text: "View Live Articles", url: "https://finmatrix.cloud/articles/" }
    ]
  };
} else if (dayIndex === 2) { // TUESDAY
  plan = {
    focusTitle: "Social Traffic Jumpstart (Pinterest & Reddit)",
    estTime: "15–20 Minutes",
    themeBadge: "📢 TRAFFIC AMPLIFICATION",
    headline: "Send Real Human Signals to Monday's Article",
    eli5Summary: "Google loves when an article gets real human clicks right after being published. Today, we spend 15 minutes sharing yesterday's article on Pinterest and Reddit so people start clicking and reading.",
    steps: [
      {
        stepNum: "1",
        title: "Pin Yesterday's Article / Tool on Pinterest",
        instruction: "1. Open Canva (free) or Pinterest.<br/>2. Create a clean 1000x1500 graphic with a bold title like: <em>'The Math Behind Paying Off Debt Faster'</em> or <em>'How to Cut 5 Years Off Your Mortgage'</em>.<br/>3. Post it on Pinterest with the link pointing directly to your new Finmatrix article."
      },
      {
        stepNum: "2",
        title: "Answer 1 Question on Reddit Finance",
        instruction: "1. Go to <a href='https://www.reddit.com/r/personalfinance' style='color:#0284c7;font-weight:700;'>r/personalfinance</a> or <a href='https://www.reddit.com/r/debtfree' style='color:#0284c7;font-weight:700;'>r/debtfree</a>.<br/>2. Find someone asking about loan amortization, interest calculations, or emergency funds.<br/>3. Write a genuine 3-sentence helpful answer. At the end, add: <em>'If helpful, I used the free visual calculator on Finmatrix to calculate the exact numbers: [link]'</em>."
      },
      {
        stepNum: "3",
        title: "Check Google Analytics Realtime",
        instruction: "Open your Google Analytics dashboard to watch real visitors land on your site from your pins or posts."
      }
    ],
    growthTip: "Pinterest pins in personal finance have a shelf-life of over 4 to 6 months. A single good pin can send 20–50 free US visitors every single day on autopilot.",
    quickLinks: [
      { text: "r/personalfinance", url: "https://www.reddit.com/r/personalfinance" },
      { text: "r/debtfree", url: "https://www.reddit.com/r/debtfree" },
      { text: "Pinterest Business", url: "https://www.pinterest.com" }
    ]
  };
} else if (dayIndex === 3) { // WEDNESDAY
  if (isToolSprintCycle) {
    plan = {
      focusTitle: "15-Day Cadence: Add 1 New In-Demand Tool",
      estTime: "25–35 Minutes",
      themeBadge: "🛠️ 15-DAY TOOL SPRINT",
      headline: "Deploy 1 New Interactive Web Calculator",
      eli5Summary: "Every 15 days, we add 1 new interactive calculator to Finmatrix so our tool directory expands. Today in Phase 1 (Days 1–15), we add our next in-demand tool from our keyword research: the Real Estate Seller Net Sheet Calculator (KD 28, 4,500 monthly searches!).",
      steps: [
        {
          stepNum: "1",
          title: "Prompt Antigravity to Build the Tool",
          instruction: "Open Antigravity and paste this exact prompt:<br/><div style='background:#0f172a;color:#10b981;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>Build a new interactive 'Real Estate Seller Net Sheet Calculator' in calculators/seller-net-sheet-calculator.html with inputs for Sale Price, Remaining Mortgage, Commission %, and Closing Costs. Register it in config/calculators.json.</div>"
        },
        {
          stepNum: "2",
          title: "Sync the Homepage & Calculator Directory",
          instruction: "In your terminal, run this command to automatically add the new tool card to your homepage and calculator hub:<br/><div style='background:#0f172a;color:#38bdf8;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>node scripts/sync-calculator-grids.mjs</div>"
        },
        {
          stepNum: "3",
          title: "Package & Deploy to Hostinger",
          instruction: "Run <code>npm run package</code>, upload the zip to Hostinger <code>public_html/</code>, and open <a href='https://finmatrix.cloud/unzip.php' style='color:#059669;font-weight:700;'>https://finmatrix.cloud/unzip.php</a>."
        }
      ],
      growthTip: "Interactive calculators have the lowest bounce rate of any webpage type (averaging >2.5 minutes on page). Google rewards high dwell time with higher search rankings.",
      quickLinks: [
        { text: "All Live Calculators", url: "https://finmatrix.cloud/calculators/" },
        { text: "Hostinger Unzip", url: "https://finmatrix.cloud/unzip.php" }
      ]
    };
  } else {
    plan = {
      focusTitle: "15-Day Cadence: Add 1 New Downloadable Template",
      estTime: "25–35 Minutes",
      themeBadge: "📊 15-DAY TEMPLATE SPRINT",
      headline: "Deploy 1 New Downloadable Excel Template & PDF",
      eli5Summary: "Every 15 days, we add 1 new corporate-grade Excel spreadsheet (.xlsx) and PDF guide to our Downloads Hub. Today in Phase 2 (Days 16–31), we add our next in-demand template: the 50/30/20 Automated Budgeting Blueprint & Excel Tracker.",
      steps: [
        {
          stepNum: "1",
          title: "Prompt Antigravity to Generate the Excel & PDF",
          instruction: "Open Antigravity and paste this exact prompt:<br/><div style='background:#0f172a;color:#10b981;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>Add the 50/30/20 Budget Blueprint into scripts/generate-excel-templates.py and generate the 50-30-20-Budget-Blueprint-2026.xlsx and PDF in downloads/. Register it in config/lead-magnets.json.</div>"
        },
        {
          stepNum: "2",
          title: "Connect to n8n Delivery Node",
          instruction: "Ensure the new tool's name is added into the intent matching in your n8n workflow so users who request it get the download link in Email 1 automatically."
        },
        {
          stepNum: "3",
          title: "Package & Deploy to Hostinger",
          instruction: "Run <code>npm run package</code>, upload the zip to Hostinger <code>public_html/</code>, and open <a href='https://finmatrix.cloud/unzip.php' style='color:#059669;font-weight:700;'>https://finmatrix.cloud/unzip.php</a>."
        }
      ],
      growthTip: "Templates are your #1 email capture tool. While web calculators attract visitors, Excel spreadsheets convert them into permanent subscribers and affiliate buyers.",
      quickLinks: [
        { text: "Downloads Hub", url: "https://finmatrix.cloud/downloads/" },
        { text: "Hostinger Unzip", url: "https://finmatrix.cloud/unzip.php" }
      ]
    };
  }
} else if (dayIndex === 4) { // THURSDAY
  plan = {
    focusTitle: "Article 2 of 2: Publish & Deploy",
    estTime: "15–20 Minutes",
    themeBadge: "🚀 ARTICLE 2 PUBLISH DAY",
    headline: "Publish This Week's 2nd Low-KD Article to Google",
    eli5Summary: "Today is Thursday! We publish our second article of the week to hit our target of 2 articles per week. Our multi-CSV engine handles the math, comparison tables, and FAQs automatically.",
    steps: [
      {
        stepNum: "1",
        title: "Open Your Terminal in VS Code / Antigravity",
        instruction: "Open your terminal in <code>c:\\Antigravity\\finmatrix</code>."
      },
      {
        stepNum: "2",
        title: "Run the 1-Line Article Generator for Article 2",
        instruction: "Copy and paste this exact command into the terminal and press Enter:<br/><div style='background:#0f172a;color:#38bdf8;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:8px 0;border:1px solid #334155;'>npm run ingest -- data/ --sort-kd --top 1 --build</div><span style='color:#64748b;font-size:12px;'>👉 This grabs the next lowest-KD keyword, creates a completely non-repetitive article, and builds the updated site.</span>"
      },
      {
        stepNum: "3",
        title: "Package & Deploy to Hostinger",
        instruction: "Run <code>npm run package</code>, upload <code>finmatrix-production-deploy.zip</code> to Hostinger <code>public_html/</code>, and open <a href='https://finmatrix.cloud/unzip.php' style='color:#059669;font-weight:700;'>https://finmatrix.cloud/unzip.php</a>."
      },
      {
        stepNum: "4",
        title: "Submit URL to Google Search Console",
        instruction: "Open <a href='https://search.google.com/search-console' style='color:#0284c7;font-weight:700;'>Google Search Console</a>, paste the new URL, and click <strong>Request Indexing</strong>. You have hit your 2 articles/week goal!"
      }
    ],
    growthTip: "Consistency is everything in SEO. Publishing twice every week without missing a beat signals domain authority to Google's ranking algorithms.",
    quickLinks: [
      { text: "Hostinger Unzip Tool", url: "https://finmatrix.cloud/unzip.php" },
      { text: "Google Search Console", url: "https://search.google.com/search-console" },
      { text: "Finmatrix Blog Index", url: "https://finmatrix.cloud/articles/" }
    ]
  };
} else if (dayIndex === 5) { // FRIDAY
  plan = {
    focusTitle: "Leads CRM, Affiliate Review & Inbox Check",
    estTime: "15–20 Minutes",
    themeBadge: "💰 REVENUE & CRM AUDIT",
    headline: "Verify Lead Captures, Email Health & Affiliate Clicks",
    eli5Summary: "Today is Friday! We check our business engine. We verify that our automated lead magnet emails delivered cleanly into Primary inboxes, review newly captured leads in our Google Sheet, and check affiliate referral link performance.",
    steps: [
      {
        stepNum: "1",
        title: "Open Your Google Sheets CRM",
        instruction: "Open your <a href='https://docs.google.com/spreadsheets/d/1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k/edit?gid=0#gid=0' style='color:#0284c7;font-weight:700;'>Leads CRM Sheet</a>.<br/>Check that all newly added leads from this week have their Name, Email, Phone, and Toolkit properly recorded in Columns A to J."
      },
      {
        stepNum: "2",
        title: "Check Email Deliverability in Hostinger Mail",
        instruction: "Log into <a href='https://mail.hostinger.com' style='color:#0284c7;font-weight:700;'>Hostinger Webmail</a>. Verify there are zero delivery bounce errors and no customer replies are left unanswered."
      },
      {
        stepNum: "3",
        title: "Check Affiliate Link Clicks",
        instruction: "Open your affiliate network dashboards (LendingTree, SoFi, Credible, etc.) or check your server logs for outbound clicks through <code>https://finmatrix.cloud/go.php?to=...</code>."
      }
    ],
    growthTip: "Your leads list is your most valuable asset. Every subscriber who downloads a toolkit is an educated consumer who is 4x more likely to click affiliate banking recommendations.",
    quickLinks: [
      { text: "Open Leads Google Sheet", url: "https://docs.google.com/spreadsheets/d/1sPshk7V0i767_HhxnBQoCbomr3g0VevbeffA3gKhU4k/edit?gid=0#gid=0" },
      { text: "Hostinger Webmail", url: "https://mail.hostinger.com" },
      { text: "n8n Executions Log", url: "https://automation.novamatrixin.cloud" }
    ]
  };
} else if (dayIndex === 6) { // SATURDAY
  plan = {
    focusTitle: "Google Search Console & SEO Health Audit",
    estTime: "20–25 Minutes",
    themeBadge: "🔍 TECHNICAL SEO AUDIT",
    headline: "Verify Indexation Status & Discover Ranking Keywords",
    eli5Summary: "Today is Saturday! We spend 20 minutes looking inside Google Search Console to see what Google thinks of our website. We make sure all pages are indexed and check which keywords are starting to get impressions.",
    steps: [
      {
        stepNum: "1",
        title: "Check 'Pages' Indexation Status in GSC",
        instruction: "Open <a href='https://search.google.com/search-console' style='color:#0284c7;font-weight:700;'>Google Search Console</a>.<br/>Click <strong>Pages</strong> on the left menu. Look at the green chart ('Indexed'). Verify that the total number of indexed pages is increasing week-over-week."
      },
      {
        stepNum: "2",
        title: "Audit Your Sitemap Status",
        instruction: "Click <strong>Sitemaps</strong> on the left menu. Ensure <code>https://finmatrix.cloud/sitemap.xml</code> shows a green <strong>Success</strong> status with zero errors."
      },
      {
        stepNum: "3",
        title: "Find 'Page 2' Keywords to Optimize",
        instruction: "Click <strong>Performance</strong> -> <strong>Search Results</strong>. Look at queries ranking in positions 11 to 25. Note them down; these are easy keywords that can reach Page 1 with a small update!"
      }
    ],
    growthTip: "Google Search Console impressions always precede clicks by 3 to 6 weeks. When impressions start rising, organic traffic explosions follow soon after.",
    quickLinks: [
      { text: "Google Search Console", url: "https://search.google.com/search-console" },
      { text: "Live XML Sitemap", url: "https://finmatrix.cloud/sitemap.xml" },
      { text: "Rich Results Test", url: "https://search.google.com/test/rich-results" }
    ]
  };
} else { // SUNDAY
  plan = {
    focusTitle: "Sunday CEO Review & Weekly Recharge",
    estTime: "10 Minutes",
    themeBadge: "☕ SUNDAY REVIEW",
    headline: "Review Weekly Wins & Prepare for Monday Sprint",
    eli5Summary: "Today is Sunday! Time to relax, reflect on this week's progress, and get ready for a fresh growth week ahead.",
    steps: [
      {
        stepNum: "1",
        title: "Review This Week's Accomplishments",
        instruction: "✅ 2 New SEO Articles Published & Submitted to Google.<br/>✅ Social Signals Generated on Pinterest / Reddit.<br/>✅ New Leads Recorded in Google Sheets CRM."
      },
      {
        stepNum: "2",
        title: "5-Minute Monday Preparation",
        instruction: "Ensure your computer and VS Code / Antigravity workspace are clean and ready to fire tomorrow morning's Article 1 generation command."
      }
    ],
    growthTip: "Consistency over 6 months beats intensity over 2 weeks. Finmatrix is built on a compounding programmatic architecture that grows while you sleep.",
    quickLinks: [
      { text: "Finmatrix Homepage", url: "https://finmatrix.cloud" },
      { text: "Downloads Hub", url: "https://finmatrix.cloud/downloads/" }
    ]
  };
}

// Generate Beautiful Responsive HTML Email
const checklistHtml = plan.steps.map(s => `
  <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
    <div style="display:flex;align-items:center;margin-bottom:8px;">
      <span style="background:#059669;color:#ffffff;font-size:12px;font-weight:800;border-radius:999px;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;margin-right:10px;">${s.stepNum}</span>
      <strong style="font-size:15px;color:#0f172a;">${s.title}</strong>
    </div>
    <div style="font-size:13.5px;color:#334155;line-height:1.6;padding-left:34px;">
      ${s.instruction}
    </div>
  </div>
`).join('');

const quickLinksHtml = plan.quickLinks.map(l => `
  <a href="${l.url}" style="display:inline-block;background:#f8fafc;border:1px solid #cbd5e1;color:#0284c7;font-weight:700;font-size:12px;padding:8px 14px;border-radius:6px;text-decoration:none;margin-right:8px;margin-bottom:8px;">${l.text} &rarr;</a>
`).join('');

const briefingHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${plan.focusTitle}</title>
</head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f1f5f9; margin:0; padding:24px; color:#1e293b;">
  <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:14px; border:1px solid #cbd5e1; padding:32px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.06);">
    
    <!-- Top Header -->
    <div style="border-bottom:2px solid #f1f5f9; padding-bottom:18px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <a href="https://finmatrix.cloud" style="font-size:24px; font-weight:800; color:#059669; text-decoration:none; letter-spacing:-0.02em;">Finmatrix</a>
        <div style="font-size:13px; font-weight:600; color:#64748b; margin-top:4px;">☀️ Daily Morning Briefing &bull; ${dateString}</div>
      </div>
      <div>
        <span style="background:#f0fdf4; color:#166534; padding:6px 12px; border-radius:999px; font-size:11px; font-weight:800; text-transform:uppercase; border:1px solid #bbf7d0;">${plan.themeBadge}</span>
      </div>
    </div>

    <!-- Target & Cadence Progress Bar -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#475569;">
      <div><strong>🎯 Monthly Targets:</strong> 2 Articles/Week &bull; 1 Tool/15 Days &bull; 1 Template/15 Days</div>
      <div style="font-weight:700;color:#059669;">${cycleName}</div>
    </div>

    <!-- Mission Focus Card -->
    <div style="background:#f8fafc; border-left:4px solid #059669; border-radius:8px; padding:18px 22px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:800; color:#059669; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Today's Mission: ${plan.focusTitle}</div>
      <div style="font-size:18px; font-weight:800; color:#0f172a; line-height:1.3;">${plan.headline}</div>
      <div style="font-size:12px; color:#64748b; font-weight:600; margin-top:6px;">⏱️ Estimated Time: <strong>${plan.estTime}</strong></div>
      <p style="font-size:13.5px;color:#475569;line-height:1.6;margin:12px 0 0 0;border-top:1px dashed #cbd5e1;padding-top:10px;">${plan.eli5Summary}</p>
    </div>

    <!-- ELI5 Action Checklist -->
    <h3 style="font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 14px 0;">📋 Step-by-Step ELI5 Checklist:</h3>
    ${checklistHtml}

    <!-- Strategic Tip -->
    <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:10px; padding:16px 20px; margin:24px 0;">
      <div style="font-size:13px; font-weight:800; color:#92400e; text-transform:uppercase; margin-bottom:4px;">💡 Chief of Staff Growth Nugget:</div>
      <p style="font-size:13px; line-height:1.6; color:#78350f; margin:0;">${plan.growthTip}</p>
    </div>

    <!-- Quick Links -->
    <div style="margin-top:24px;">
      <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:10px;">⚡ 1-Click Fast Navigation:</div>
      ${quickLinksHtml}
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e2e8f0; margin-top:32px; padding-top:20px; font-size:12px; color:#94a3b8; text-align:center; line-height:1.6;">
      Finmatrix Automated Chief of Staff &bull; Daily Growth & Execution System.<br/>
      https://finmatrix.cloud &bull; support@finmatrix.cloud
    </div>
  </div>
</body>
</html>`;

return [{
  json: {
    dayName,
    dayOfMonth,
    dateString,
    focusTitle: plan.focusTitle,
    estTime: plan.estTime,
    briefingSubject: `☀️ Finmatrix Morning Briefing: ${dayName} (${plan.focusTitle})`,
    briefingHtml
  }
}];

