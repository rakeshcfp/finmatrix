# Finmatrix Engineering & Content Operations Guide (CONTENT_GUIDE.md)

Welcome to the Finmatrix developer and content workflow manual. This guide explains how to add a brand-new, production-ready financial calculator in approximately **15 minutes**, and how to roll statutory tax-year figures forward each January.

---

## 1. System Architecture Overview

Finmatrix is designed as a **high-speed, zero-dependency static financial web application**:
- **Core Configuration:** Centralized in `/config` (`site.json`, `calculators.json`, `tax-year.json`, `affiliates.json`).
- **Styling:** Vanilla CSS (`/css/style.css`) using responsive CSS Grid, Flexbox, custom properties, and dark mode tokens.
- **Client Engine:** `js/tool-engine.js` automatically handles:
  - Deep-link parameter population (`?param=val`) and "Share Calculation" links.
  - Category-based contextual affiliate monetization cards (`#finmatrix-affiliate-slot`).
  - Zero-CLS reserved ad units (`#finmatrix-ad-slot`).
  - Related tools and "Recommended Next Step" cross-links.
- **Hosting:** Host-agnostic static hosting (Netlify, Cloudflare Pages, Vercel, or Apache/Hostinger).

---

## 2. How to Add a New Calculator in 15 Minutes

Adding a tool requires 5 straightforward steps. Follow this exact workflow:

### Step 1: Register Tool in `config/calculators.json` (2 Minutes)
Open `config/calculators.json` and append a new JSON object:
```json
{
  "id": "cd-calculator",
  "name": "Certificate of Deposit (CD) Calculator",
  "shortName": "CD Calculator",
  "category": "savings-investing",
  "url": "/calculators/cd-calculator.html",
  "icon": "💿",
  "description": "Calculate fixed certificate of deposit yields, interest compounding, and early penalty impacts.",
  "badge": "Savings & Yield",
  "popular": false
}
```
*Note: Category must be one of `income-tax`, `debt`, `housing`, `savings-investing`, or `loans`.*

### Step 2: Create the Tool HTML Page (7 Minutes)
Create `calculators/cd-calculator.html`. Duplicate an existing Phase 2 calculator (e.g. `calculators/hysa-vs-cd-calculator.html` or `calculators/auto-loan-calculator.html`) as your baseline.

Ensure the page includes the standard sections:
1. **Metadata `<head>`:**
   - `<title>`: Under 60 characters (e.g., `CD Calculator: Fixed APY Interest & Penalties | Finmatrix`).
   - `<meta name="description">`: Under 155 characters.
   - Canonical tag: `<link rel="canonical" href="https://finmatrix.cloud/calculators/cd-calculator.html">`.
   - Structured Data (`@graph`): `WebApplication`, `BreadcrumbList`, and `FAQPage`.
2. **Navigation & Breadcrumbs:**
   ```html
   <div class="breadcrumb">
     <a href="/">Home</a> <span class="sep">/</span>
     <a href="/calculators/">Calculators</a> <span class="sep">/</span>
     <a href="/calculators/savings-investing/">Savings & Investing</a> <span class="sep">/</span>
     <span>CD Calculator</span>
   </div>
   ```
3. **Above-the-Fold Calculator Grid (`.calc-grid`):**
   - Left card: `<form>` with clearly labeled inputs (`<label for="id">`, `<input id="id">`).
   - Right card: Summary results, share link button, affiliate slot, and ad container:
     ```html
     <!-- Shareable URL Button -->
     <button class="calc-btn" onclick="shareCdUrl()"><span>🔗</span> Share This Calculation</button>

     <!-- Contextual Affiliate Slot (automatically loads matching partner) -->
     <div id="finmatrix-affiliate-slot" data-category="hysa" style="margin-top:24px;"></div>

     <!-- Zero-CLS Ad Container -->
     <div id="finmatrix-ad-slot" style="margin-top:20px;"></div>
     ```
4. **Educational Sections (YMYL Depth):**
   - **How This Is Calculated:** Plain-language formulas and worked math example.
   - **Assumptions & Official Citations:** Cite Federal Reserve, FDIC, CFPB, or IRS rules.
   - **Frequently Asked Questions:** 3–5 `<details class="faq-item">` accordions.
   - **Related Calculators:** Hand-picked links to adjacent tools.
5. **Scripts:**
   ```html
   <script src="/js/main.js"></script>
   <script src="/js/tool-engine.js"></script>
   <script src="/js/analytics.js"></script>
   <script>
   function calculateCD() {
     // Mathematical model...
     if (window.FinmatrixEngine) {
       FinmatrixEngine.updateUrl({ deposit, apy, termMonths });
     }
   }
   function shareCdUrl() {
     if (window.FinmatrixEngine) FinmatrixEngine.copyShareUrl();
   }
   document.addEventListener('DOMContentLoaded', () => {
     if (window.FinmatrixEngine) {
       FinmatrixEngine.initParams();
       FinmatrixEngine.initAffiliateBox('finmatrix-affiliate-slot');
       FinmatrixEngine.initAdSlot('finmatrix-ad-slot');
     }
     calculateCD();
   });
   </script>
   ```

### Step 3: Write Unit Tests in `tests/calculator-formulas.test.js` (3 Minutes)
Add a test asserting mathematical correctness against a known benchmark:
```javascript
test('CD Calculator: $10,000 at 5.0% APY compounded daily for 12 months', () => {
  const deposit = 10000;
  const apy = 0.05;
  const finalBalance = deposit * Math.pow(1 + apy / 365, 365);
  const interestEarned = finalBalance - deposit;
  assert.ok(Math.abs(interestEarned - 512.67) < 5);
});
```
Run the test suite:
```bash
node --test tests/calculator-formulas.test.js
```

### Step 4: Rebuild the XML Sitemap (1 Minute)
Run the automated build script from the repository root:
```bash
node scripts/build-sitemap.js
```
The sitemap will automatically pick up your new calculator from `config/calculators.json` and generate a verified entry with today's `lastmod` date.

### Step 5: Test & Commit (2 Minutes)
1. Verify the page opens locally without errors.
2. Check edge cases: zero input (`$0`), high interest rate, long duration.
3. Commit to git:
   ```bash
   git add config/calculators.json calculators/cd-calculator.html tests/ tests/calculator-formulas.test.js sitemap.xml
   git commit -m "Add CD Yield and Penalty Calculator"
   ```

---

## 3. How to Roll Tax-Year Data Forward Each January

Every year between October and December, the IRS and Social Security Administration publish inflation-adjusted statutory thresholds for the upcoming tax year. Follow this procedure each January:

### Step 1: Obtain Official IRS & SSA Releases
1. **IRS Revenue Procedure (Inflation Adjustments):**
   - Typically issued in late October or November (e.g., Rev. Proc. 2025-32 for Tax Year 2026).
   - Provides: Standard deductions, federal income tax brackets, Alternative Minimum Tax (AMT), Earned Income Tax Credit (EITC).
   - Source: [IRS Newsroom Inflation Adjustments](https://www.irs.gov/newsroom).
2. **SSA Press Release (Social Security Wage Cap):**
   - Typically issued in mid-October.
   - Provides: OASDI Maximum Taxable Earnings Base.
   - Source: [Social Security Fact Sheet](https://www.ssa.gov/news/press/factsheets/).
3. **IRS Notice (Retirement Contribution Limits):**
   - Typically issued in early November.
   - Provides: 401(k), 403(b), IRA, and catch-up contribution limits.
   - Source: [IRS Retirement Topics](https://www.irs.gov/retirement-plans).

### Step 2: Update `config/tax-year.json`
Update the tax year constants in `/config/tax-year.json`:
- `tax_year`: Change to the new year (e.g. `2027`).
- `social_security.wage_cap`: Update amount (e.g. `$189,000`).
- `retirement_limits`: Update 401(k) and IRA employee elective deferral caps.
- `standard_deduction`: Update Single, MFJ, and HoH amounts.
- `federal_brackets`: Update bracket breakpoint boundaries.
- Set `verified: true` and paste the official IRS/SSA announcement URL under `source`.

### Step 3: Update `config/site.json`
Update `site.last_reviewed` to the current month/year (e.g., `"January 2027"`).

### Step 4: Update Unit Tests
1. In `tests/calculator-formulas.test.js`, update the expected values and thresholds for the new tax year.
2. Run `node --test tests/calculator-formulas.test.js` to ensure all calculations match the updated IRS figures.

### Step 5: Rebuild Sitemap & Deploy
```bash
node scripts/build-sitemap.js
git add config/ tests/ sitemap.xml
git commit -m "Roll tax year configuration forward to 2027"
git push
```

---

## 4. Hard Editorial Rules for Financial Content (YMYL)

1. **Zero Fabricated Numbers:** Never guess tax rates, bank APYs, or legal limits. If an official figure is not yet available from the government, leave a clear `TODO: VERIFY` placeholder in `TODO.md` and keep `verified: false`.
2. **Primary Sources Only:** Cite government bodies (IRS, SSA, Federal Reserve, CFPB, FTC) or official academic finance literature. Never cite competitor blogs or unverified forum posts.
3. **Always Include Educational Disclaimers:** Every tool must state that calculations are provided for educational and estimation purposes, not certified legal, tax, or financial advice.
4. **No Thin or Duplicate Pages:** Do not create duplicate pages that only swap a city name. Every page must contain genuine mathematical utility and unique contextual guidance.
