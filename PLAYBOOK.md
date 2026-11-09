# Finmatrix Master Operating Playbook: SEO, Content, Tools & Growth

> **Platform:** [Finmatrix](https://finmatrix.cloud)  
> **Architecture:** Zero-Dependency Client-Side Framework (Vanilla JS + HTML5 + CSS3 + Node.js CLI + Python Automation)  
> **Hosting:** Hostinger Apache / Linux (`public_html`)  
> **Monetization Engines:** High-Intent Financial Affiliates + Display Ads (AdSense) + Lead Capture (Email & WhatsApp List)

---

## Table of Contents

1. [Architecture & System Directory Map](#1-architecture--system-directory-map)
2. [The 4-Tier SEO Flywheel: Tool vs. Article Decision Matrix](#2-the-4-tier-seo-flywheel-tool-vs-article-decision-matrix)
3. [Keyword Ingestion Pipeline (SEMrush to Live Site)](#3-keyword-ingestion-pipeline-semrush-to-live-site)
4. [How to Publish or Edit Educational Articles](#4-how-to-publish-or-edit-educational-articles)
5. [How to Create and Publish a New Calculator Tool](#5-how-to-create-and-publish-a-new-calculator-tool)
6. [How to Create Downloadable Lead Magnets (Excel + PDF)](#6-how-to-create-downloadable-lead-magnets-excel--pdf)
7. [Connecting Webhook Automations (n8n & Email Delivery)](#7-connecting-webhook-automations-n8n--email-delivery)
8. [Testing, Master Build & Hostinger Deployment](#8-testing-master-build--hostinger-deployment)
9. [Weekly Operating Routine (Growth & Backlinks)](#9-weekly-operating-routine-growth--backlinks)

---

## 1. Architecture & System Directory Map

Finmatrix is built for **instant load times (<0.5s)**, **zero personal data collection liabilities**, and **bulletproof programmatic SEO scalability**.

```
finmatrix/
├── config/
│   ├── site.json                 # Global site metadata, n8n webhook URL, analytics IDs
│   ├── calculators.json          # Master registry for all 24+ calculators
│   ├── lead-magnets.json         # Master registry for downloadable Excel & PDF toolkits
│   ├── affiliates.json           # Contextual affiliate partner links (Impact, CJ, FlexOffers)
│   └── tax-year.json             # Statutory tax rules (2026 standard deductions, FICA caps)
│
├── calculators/                  # Full-screen interactive tool pages
│   ├── index.html                # Suite directory (with live search & category filter pills)
│   ├── payment-calculator.html   # Universal Payment Calculator (Car, Mortgage & Loans)
│   ├── debt-elimination-planner.html
│   ├── paycheck-calculator.html
│   ├── mortgage-calculator.html
│   ├── debt/                     # Category Sub-Hubs
│   ├── housing/
│   ├── income-tax/
│   ├── loans/
│   └── savings-investing/
│
├── articles/                     # Programmatic SEO Educational Pillar Articles
│   ├── index.html                # Articles & Guides Hub
│   ├── payment-calculator.html   # Universal Payment Guide (embeds live widget)
│   ├── debt-snowball-vs-avalanche-calculator.html
│   └── amortization-schedule.html
│
├── downloads/                    # Free Excel & PDF Lead Magnets Hub
│   ├── index.html                # Dedicated Gated Downloads Hub
│   ├── *.xlsx                    # Automated, pre-calculated Excel financial models
│   └── *.pdf                     # High-res, branded PDF roadmap guides
│
├── embed/                        # Lightweight iframe widgets for partner embeds & articles
│   ├── payment-calculator/index.html
│   ├── debt-payoff/index.html
│   ├── paycheck/index.html
│   └── refinance-break-even/index.html
│
├── src/                          # TypeScript source models & components
│   ├── data/
│   │   ├── blogArticles.ts       # Structured programmatic article definitions
│   │   └── leadMagnets.ts        # Lead magnet definitions
│   └── components/
│       └── LeadCaptureForm.tsx   # React modal & capture component
│
├── js/
│   ├── search.js                 # Real-time search engine with embedded fallback & cache buster
│   ├── lead-capture.js           # Modal gatekeeper, country codes, n8n webhook dispatcher
│   ├── tool-engine.js            # Calculation formula core
│   ├── charts.js                 # Client-side SVG canvas charting
│   ├── main.js                   # Mobile navigation & dark/light theme switcher
│   └── analytics.js              # Privacy-respecting tracking
│
├── scripts/                      # Build, Ingestion & Automation Scripts
│   ├── build-blog.mjs            # Programmatic article generator
│   ├── sync-calculator-grids.mjs # Pre-renders cards into all hub HTML pages
│   ├── update-navbars.mjs        # Synchronizes navbars across all 43+ HTML pages
│   ├── build-sitemap.js          # XML sitemap builder
│   ├── ingest-keywords.mjs       # SEMrush CSV keyword ingestion engine
│   ├── generate-excel-templates.py # Python openpyxl automated spreadsheet builder
│   ├── generate-lead-pdfs.py     # Python reportlab PDF generator
│   └── package-deploy.py         # POSIX-compliant zip builder for Hostinger Linux
│
├── data/                         # CSV datasets from SEMrush
│   └── keywords-sample.csv
│
├── subscribe.php                 # PHP webhook fallback (CSV logger + HTML email sender)
├── sitemap.xml                   # Automatically generated search engine sitemap
├── .htaccess                     # Apache caching, compression & HTTPS rewrite rules
└── finmatrix-production-deploy.zip # Deployable production archive
```

---

## 2. The 4-Tier SEO Flywheel: Tool vs. Article Decision Matrix

When researching keywords on SEMrush, never guess whether to build an article or a tool. Use this decision matrix:

| Metric / Scenario | Search Intent | What You Must Build | Example from Site |
| :--- | :--- | :--- | :--- |
| **High Search Volume (>15k)**<br/>**Low/Medium KD (<35%)**<br/>Query contains: `calculator`, `estimator`, `tool` | **Transactional / Tool** | **Interactive Calculator Tool** (`/calculators/`) + **Embed Widget** (`/embed/`) | `payment calculator` (74k vol, 16% KD) |
| **High Search Volume (>10k)**<br/>Query contains: `how to calculate`, `what is`, `schedule`, `vs` | **Informational** | **Educational Pillar Article** (`/articles/`) with embedded calculator widget | `amortization schedule` (49.5k vol, 32% KD) |
| **High-Value Commercial Keyword**<br/>(Has both tool queries AND 30k+ question variations) | **Commercial Hybrid** | **Dual-Power Setup:** Build both the tool AND the article, interlinking them! | `payment-calculator` (Tool + Article) |
| **Low-Volume, High-Intent Keyword (<2k)**<br/>(e.g., `debt snowball excel template`) | **Lead / Download** | **Lead Magnet Toolkit** (`/downloads/`) with `.xlsx` + `.pdf` | `Debt Payoff Tracker` |

---

## 3. How to Add New Keywords & CSV Datasets

Finmatrix supports three flexible ways to add new keywords:
1. **Direct Single Keyword (No CSV needed):** For when you find an individual keyword on SEMrush (e.g. KD 16%, 74K vol) and want to launch an article instantly.
2. **Uploading a Brand New CSV File:** For when you export batches from SEMrush, Ahrefs, or Google Keyword Planner.
3. **Appending to an Existing CSV:** For maintaining your ongoing target keyword lists in `data/`.

---

### Method 1: Direct Single Keyword (No CSV Needed)

You do **not** need to create a CSV file if you want to publish an article for a single keyword you just found. Use the `npm run keyword` command:

```powershell
npm run keyword -- --keyword "how to calculate car payment" --volume 2400 --kd 78 --intent Informational --cluster "Auto Loans" --build
```

#### Command Flags Breakdown:
* `--keyword "<name>"` (Required): The exact search query.
* `--volume <number>` (Optional): Monthly searches (e.g. `2400`, `74000`). Default: `5000`.
* `--kd <number>` (Optional): Keyword difficulty % from 0–100 (e.g. `16`, `78`). Default: `20`.
* `--intent <type>` (Optional): `Commercial` | `Informational` | `Transactional`. Default: `Commercial`.
* `--cluster "<name>"` (Optional): Category group (e.g. `"Auto Loans"`, `"Mortgage & Refinancing"`, `"Debt & Credit"`). Default: `"Personal Finance & Loans"`.
* `--build`: Automatically runs the master build pipeline to generate the HTML page and add it to `sitemap.xml`.
* `--dry-run`: Test generation in memory without writing to disk.

---

### Method 2: Adding a Brand New CSV File

Whenever you download a CSV report from SEMrush or create your own spreadsheet, follow these steps:

#### Step 1: Place Your CSV File in `data/`
Save your file directly into the `data/` directory (e.g. `data/my-semrush-export.csv`).

#### Step 2: Supported CSV Formats
The Finmatrix parser automatically detects and normalizes headers regardless of letter case.

**Format A: Raw SEMrush Export (Keyword Magic Tool / Keyword Overview)**
Works out-of-the-box with default SEMrush export columns:
```csv
Keyword,Search Intent,KD,Search Volume,CPC (source value),Topic Group (derived)
payment calculator,Commercial,16,74000,0.83,Loans & Borrowing
car payment calculator,Commercial,84,450000,1.25,Auto Loans
```

**Format B: Clean Simple CSV (Any Spreadsheet / Google Sheets)**
You can create a custom CSV with just 5 columns using our template at [`data/keywords-template.csv`](file:///c:/Antigravity/finmatrix/data/keywords-template.csv):
```csv
Keyword,Volume,KD,Intent,Category
car payment calculator,450000,84,Commercial,Auto Loans
mortgage payment calculator,165000,85,Commercial,Mortgage & Housing
loan payment calculator,90500,74,Commercial,Loans & Borrowing
how to calculate mortgage payments,33100,94,Informational,Mortgage & Housing
```

#### Step 3: Run the Ingestion Command
To ingest keywords from your new CSV:

* **Ingest the Top N highest-volume keywords:**
  ```powershell
  npm run ingest -- data/my-semrush-export.csv --top 5 --build
  ```
* **Ingest only a specific keyword from that CSV:**
  ```powershell
  npm run ingest -- data/my-semrush-export.csv --keyword "payment calculator" --build
  ```
* **Ingest all keywords matching a specific cluster:**
  ```powershell
  npm run ingest -- data/my-semrush-export.csv --cluster "Auto Loans" --top 3 --build
  ```

---

### Method 3: Appending to an Existing CSV

If you prefer keeping a single master keyword file:
1. Open [`data/keywords-template.csv`](file:///c:/Antigravity/finmatrix/data/keywords-template.csv) in Excel, VS Code, or Notepad.
2. Add your new row at the bottom:
   ```csv
   used car loan interest rates,45000,24,Commercial,Auto Loans
   ```
3. Save the file.
4. Run:
   ```powershell
   npm run ingest -- data/keywords-template.csv --keyword "used car loan interest rates" --build
   ```
5. Done! The article is synthesized into [`src/data/blogArticles.ts`](file:///c:/Antigravity/finmatrix/src/data/blogArticles.ts), the HTML page is generated at `articles/used-car-loan-interest-rates.html`, and `sitemap.xml` is updated.

---

## 4. How to Publish or Edit Educational Articles

All programmatic articles are stored as strongly-typed objects in [`src/data/blogArticles.ts`](file:///c:/Antigravity/finmatrix/src/data/blogArticles.ts).

### Article Object Schema
```typescript
{
  slug: "payment-calculator",
  title: "Payment Calculator: Monthly Loan, Car & Mortgage Estimator (2026)",
  metaDescription: "Free universal payment calculator with interest...",
  excerpt: "Calculate monthly loan payments, total interest costs...",
  category: "Loans & Borrowing",
  readTime: "10 min read",
  publishedDate: "2026-11-06",
  modifiedDate: "2026-11-06",
  author: {
    name: "Finmatrix Financial Research Desk",
    role: "Quantitative Finance & Credit Modeling",
    avatar: "/favicon.svg"
  },
  coverImage: "/favicon.svg",
  targetKeywords: {
    primary: "payment calculator",
    secondary: ["car payment calculator", "loan payment calculator", "how to calculate mortgage payments"],
    searchIntent: "Commercial",
    monthlyVolume: 74000,
    keywordDifficulty: 16
  },
  tableOfContents: [
    { id: "overview", text: "Overview: How Loan Payments Work" },
    { id: "interactive-simulator", text: "Interactive Universal Payment Calculator" }
  ],
  content: `... semantic HTML with callouts & embeds ...`,
  faqs: [
    { question: "How is a payment calculated?", answer: "..." }
  ],
  leadMagnetId: "mortgage-amortization-accelerator"
}
```

### Visual Callout Blocks You Can Use in Content
* **Quantitative Framework:**
  ```html
  <div class="callout callout-framework">
    <div class="callout-header"><span class="callout-icon">📐</span><span class="callout-title">THE FORMULA</span></div>
    <div class="callout-body">Explanation text here...</div>
  </div>
  ```
* **Analyst Tip:**
  ```html
  <div class="callout callout-tip">
    <div class="callout-header"><span class="callout-icon">⚡</span><span class="callout-title">ANALYST PRO TIP</span></div>
    <div class="callout-body">Practical advice here...</div>
  </div>
  ```
* **Hazard Warning:**
  ```html
  <div class="callout callout-warning">
    <div class="callout-header"><span class="callout-icon">⚠️</span><span class="callout-title">CRITICAL HAZARDS</span></div>
    <div class="callout-body">Costly mistakes to avoid...</div>
  </div>
  ```

### Injecting Live Calculators into Articles
Embed the lightweight widget anywhere in your article content:
```html
<div class="calculator-embed-container">
  <iframe src="/embed/payment-calculator/index.html" title="Widget" loading="lazy" class="responsive-embed-frame"></iframe>
</div>
```

### Injecting Gated Lead Magnet Forms
To insert the lead capture box midway through or at the end of an article:
```html
<div class="finmatrix-lead-capture" data-magnet-id="mortgage-amortization-accelerator"></div>
```

---

## 5. How to Create and Publish a New Calculator Tool

Follow this 5-step checklist whenever you build a new tool:

### Step 1: Register in `config/calculators.json`
Add your tool object to the array in [`config/calculators.json`](file:///c:/Antigravity/finmatrix/config/calculators.json):
```json
{
  "id": "solar-payback-calculator",
  "name": "Solar Panel Payback & ROI Calculator",
  "shortName": "Solar Payback",
  "category": "housing",
  "url": "/calculators/solar-payback-calculator.html",
  "icon": "☀️",
  "badge": "⚡ Energy ROI",
  "popular": true,
  "description": "Calculate your net solar payback period factoring the 30% Federal ITC tax credit and electricity inflation.",
  "keywords": ["solar payback calculator", "solar panel roi", "is solar worth it 2026"]
}
```

### Step 2: Build the Standalone Embed Widget
Create `embed/solar-payback-calculator/index.html`:
* Standalone card container (max-width: 580px).
* Quick input sliders and instant calculation output.
* Small link at the bottom: `"Powered by Finmatrix"`.

### Step 3: Build the Full Tool Page
Create `calculators/solar-payback-calculator.html`:
* Copy the structure of [`calculators/payment-calculator.html`](file:///c:/Antigravity/finmatrix/calculators/payment-calculator.html).
* Include:
  1. Standard Navbar.
  2. Breadcrumbs (`Home / Calculators / Solar Payback`).
  3. Structured Schema: `WebApplication` + `FAQPage` JSON-LD.
  4. Interactive inputs, currency switcher, and visual result cards.
  5. Detailed breakdown table / amortization list.
  6. Strategic FAQ accordion at the bottom.

### Step 4: Run the Sync Command
```powershell
npm run sync
```
* Reads `config/calculators.json`.
* Automatically bakes the card into `/calculators/index.html` (statically pre-rendered).
* Bakes the card into its category hub (e.g. `/calculators/housing/index.html`).
* Updates `js/search.js` embedded cache so search finds it instantly.

### Step 5: Build & Verify
```powershell
npm run build
```
* Updates navigation bars and `sitemap.xml`.
* Test live at: `http://localhost:8080/calculators/solar-payback-calculator.html`.

---

## 6. How to Create Downloadable Lead Magnets (Excel + PDF)

Finmatrix captures **First Name, Email, and WhatsApp Mobile Number** by offering downloadable financial toolkits.

### Step 1: Register in `config/lead-magnets.json`
Add the toolkit metadata:
```json
"solar-investment-model": {
  "id": "solar-investment-model",
  "title": "Residential Solar ROI & 25-Year Cash Flow Model",
  "badge": "FREE EXCEL WORKBOOK",
  "tagline": "Stress-test utility rate inflation, inverter replacement, and net metering credits.",
  "deliverables": [
    "Pre-built Excel (.xlsx) financial model with automated sensitivity macros",
    "Federal 30% Section 25D tax credit eligibility checklist",
    "Utility net metering 1.0 vs 2.0 vs 3.0 compensation matrix"
  ],
  "pdfDownloadUrl": "/downloads/Solar-ROI-Blueprint-2026.pdf",
  "excelDownloadUrl": "/downloads/Solar-ROI-Cash-Flow-Model.xlsx",
  "category": "Housing & Energy"
}
```

### Step 2: Generate the Automated Excel File (`.xlsx`)
Finmatrix uses Python's `openpyxl` library to generate formula-driven spreadsheets.
Edit [`scripts/generate-excel-templates.py`](file:///c:/Antigravity/finmatrix/scripts/generate-excel-templates.py):
* Set up styled header banners, dark slate themes, and formula columns (e.g. `=PMT(rate, nper, pv)`).
* Run:
  ```powershell
  python scripts/generate-excel-templates.py
  ```
* File output lands in `downloads/`.

### Step 3: Generate the PDF Guide (`.pdf`)
Edit [`scripts/generate-lead-pdfs.py`](file:///c:/Antigravity/finmatrix/scripts/generate-lead-pdfs.py):
* Define step-by-step implementation frameworks, milestone trackers, and visual tables.
* Run:
  ```powershell
  python scripts/generate-lead-pdfs.py
  ```
* File output lands in `downloads/`.

### Step 4: Add to Downloads Hub
Add the card to [`downloads/index.html`](file:///c:/Antigravity/finmatrix/downloads/index.html):
* The button must use `onclick="openDownloadModal('solar-investment-model')"` to enforce strict lead gating!

---

## 7. Connecting Webhook Automations (n8n & Email Delivery)

Finmatrix routes leads to external automation platforms (n8n, Make, Zapier) with a built-in fallback to PHP. We have provided a ready-to-import n8n workflow blueprint at [`workflows/finmatrix-lead-capture-workflow.json`](file:///c:/Antigravity/finmatrix/workflows/finmatrix-lead-capture-workflow.json).

### Step 1: Import the Workflow into n8n (30 Seconds)
1. Open n8n $\rightarrow$ Click **+ Add Workflow**.
2. Open [`workflows/finmatrix-lead-capture-workflow.json`](file:///c:/Antigravity/finmatrix/workflows/finmatrix-lead-capture-workflow.json) $\rightarrow$ Copy all JSON (`Ctrl+A`, `Ctrl+C`).
3. Click in your n8n canvas and press **`Ctrl+V`**.
4. The complete 6-node automation will appear:
   * **Webhook Receiver** (`POST /webhook/finmatrix-lead`)
   * **Instant 200 OK Response** (so user download never delays)
   * **Data Sanitizer** (formats name, generates personalized email & WhatsApp text)
   * **Transactional Email Sender** (delivers direct download links)
   * **Google Sheets CRM Logger** (logs Name, Email, Phone, Toolkit)
   * **Instant Admin Alert** (pings Telegram, Discord, or Slack)

### Step 2: Configure Your Webhook in `config/site.json`
Double-click the Webhook node in n8n, copy your production URL, and paste it into [`config/site.json`](file:///c:/Antigravity/finmatrix/config/site.json):
```json
"automation": {
  "n8n_webhook_url": "https://n8n.yourdomain.com/webhook/finmatrix-lead",
  "email_provider": "hostinger_smtp"
}
```

### Step 2: What Payload Finmatrix Sends
When a user submits the modal in `js/lead-capture.js`, it dispatches this JSON payload:
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "phone": "+1 (555) 234-5678",
  "toolkit_id": "debt-snowball-avalanche-toolkit",
  "toolkit_title": "Debt Snowball vs. Avalanche Payoff Toolkit",
  "excel_download_url": "https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx",
  "pdf_download_url": "https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf",
  "page_source": "https://finmatrix.cloud/articles/payment-calculator.html",
  "timestamp": "2026-11-06T02:15:00Z"
}
```

### Step 3: Setting Up Your n8n Workflow
1. **Webhook Node:** Set to `POST`, receiving the payload above.
2. **Google Sheets / CRM Node:** Append lead to your master database.
3. **Send Email Node (Gmail / SMTP / Resend):**
   * Subject: `Your Finmatrix Toolkit: {{ $json.toolkit_title }}`
   * Body:
     ```html
     Hi {{ $json.name }},
     
     Here are your instant download links:
     📊 Excel Model: {{ $json.excel_download_url }}
     📄 PDF Roadmap: {{ $json.pdf_download_url }}
     ```
4. **WhatsApp Node (Twilio / Evolution API / WhatsApp Cloud API):**
   * Automatically send a welcome text with the spreadsheet link directly to their mobile number!

### Step 4: Built-In Fallback (`subscribe.php`)
If the n8n webhook is offline or empty, `js/lead-capture.js` automatically falls back to `subscribe.php`:
* Appends lead to local CSV: `leads_database.csv`.
* Sends transactional HTML email with download buttons via Hostinger PHP `mail()`.
* Sends an instant admin alert notification to `novamatrix1564@gmail.com`.

---

## 8. Testing, Master Build & Hostinger Deployment

### 1. Test Financial Calculations
Always verify IRS/SSA statutory limits and amortization formulas before deploying:
```powershell
npm test
```
* Verifies 21 financial formulas (2026 $184,500 FICA cap, $24,500 401(k) limit, standard deductions, mortgage amortization).

### 2. Run the Master Build
```powershell
npm run build
```
Executes all build steps in one command:
1. `build-blog.mjs` $\rightarrow$ Generates all programmatic HTML articles.
2. `sync-calculator-grids.mjs` $\rightarrow$ Pre-renders cards into all calculator suites and hubs.
3. `update-navbars.mjs` $\rightarrow$ Syncs header navigation tabs across all 43+ HTML files.
4. `build-sitemap.js` $\rightarrow$ Compiles `sitemap.xml`.

### 3. Package Production Deploy Zip
```powershell
npm run package
```
* Compiles `finmatrix-production-deploy.zip` (131 files, 1.76 MB).
* **Guarantees POSIX forward slashes (`/`)**: Prevents file path flattening on Linux/Hostinger Apache servers.

### 4. Deploy to Hostinger (2-Minute Process)
1. Log into your **Hostinger hPanel** $\rightarrow$ **File Manager**.
2. Navigate to `public_html/`.
3. Upload `finmatrix-production-deploy.zip`.
4. Open your browser and navigate to:
   ```
   https://finmatrix.cloud/unzip.php
   ```
5. You will see: `Extraction successful! 131 files extracted.`
6. **Security Cleanup:** Delete `unzip.php` and `finmatrix-production-deploy.zip` from `public_html/`.

---

## 9. Weekly Operating Routine (Growth & Backlinks)

To compound organic US traffic without burning out, follow this weekly checklist:

### Weekly Routine (45 Minutes every Saturday)
1. **Find 1–2 High-Opportunity Keywords on SEMrush:**
   * Target KD: `< 25%`, Volume: `2k to 10k`.
   * Run: `npm run ingest -- data/keywords.csv --top 1 --build`.
2. **Review Lead Numbers:**
   * Open n8n or check `leads_database.csv` on Hostinger.
   * Verify automated emails and WhatsApp messages are delivering successfully.
3. **Monitor Google Search Console (GSC):**
   * Filter for pages on positions **8–15** (striking distance of Page 1).
   * Update the direct-answer takeaway box at the top of that tool/article to win the Google Featured Snippet.
4. **Seed 2 High-Value Answers on Reddit:**
   * Look for posts on `r/personalfinance`, `r/FinancialPlanning`, or `r/CreditCards`.
   * Answer the user's specific math question with exact figures.
   * Link to your calculator: *"You can run the numbers with your own parameters here: https://finmatrix.cloud/calculators/..."*
5. **Update Affiliate Links:**
   * As affiliate networks approve your account, paste your affiliate tracking links into [`config/affiliates.json`](file:///c:/Antigravity/finmatrix/config/affiliates.json).

---

## Quick Command Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Start Local Dev Server** | `python -m http.server 8080` (view at `http://localhost:8080`) |
| **Run Formula Unit Tests** | `npm test` |
| **Run Complete Build Pipeline** | `npm run build` |
| **Add Single Keyword Directly (No CSV)** | `npm run keyword -- --keyword "keyword" --volume 50000 --kd 20 --build` |
| **Ingest Keywords from CSV** | `npm run ingest -- data/my-file.csv --top 3 --build` |
| **Sync Calculator Cards** | `npm run sync` |
| **Update All Navigation Bars** | `npm run navbars` |
| **Package Hostinger Zip Archive** | `npm run package` |
| **Generate Excel Templates** | `python scripts/generate-excel-templates.py` |
| **Generate PDF Toolkits** | `python scripts/generate-lead-pdfs.py` |

---
*Created by Finmatrix Financial Research Desk · Last Updated November 2026*

