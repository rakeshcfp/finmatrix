# Finmatrix Technical, SEO & Monetization Audit (AUDIT.md)

**Audit Date:** October 2026  
**Audited Domain:** `https://finmatrix.cloud`  
**Site Type:** Static US Personal Finance Calculator & Wealth Tools Platform  
**Target Market:** United States (Personal Finance, YMYL)  

---

## 1. Inventory of Existing Pages

### Core & Authority Pages
- `/index.html` — Homepage
- `/about.html` — About Finmatrix
- `/editorial-policy.html` — Editorial Standards & FTC Disclosure Policy
- `/privacy-policy.html` — Privacy Policy
- `/terms-of-service.html` — Terms of Service
- `/metrics-tracker.html` — Internal analytics logging page
- `subscribe.php` — Legacy PHP newsletter backend endpoint

*Missing Authority Pages identified:*
- `/contact/` (or `contact.html`): Not implemented (only `mailto:` in footer).
- `/disclaimer/` (or `disclaimer.html`): Dedicated legal disclaimer page missing (only inline footer disclaimer text).

### Calculator Tools (`/calculators/`)
Total existing tools: 13 individual tools + 1 index hub.
1. `/calculators/index.html` — All Calculators Hub
2. `/calculators/debt-elimination-planner.html` — Multi-Card Debt Payoff (Avalanche vs Snowball) [Flagship]
3. `/calculators/paycheck-calculator.html` — Paycheck & Take-Home Pay
4. `/calculators/compound-interest-calculator.html` — Compound Interest & Growth
5. `/calculators/mortgage-calculator.html` — Mortgage Principal, Interest, Taxes & Insurance (PITI)
6. `/calculators/time-value-of-money-calculator.html` — Time Value of Money (FV/PV)
7. `/calculators/credit-card-payoff-calculator.html` — Credit Card Payoff & 0% Balance Transfer
8. `/calculators/fire-calculator.html` — FIRE (Financial Independence, Retire Early)
9. `/calculators/retirement-calculator.html` — Retirement Nest Egg & 4% Safe Withdrawal
10. `/calculators/home-affordability-calculator.html` — 28/36 DTI Home Affordability
11. `/calculators/roth-vs-traditional-ira-calculator.html` — Roth vs Traditional IRA Comparison
12. `/calculators/loan-calculator.html` — Personal / Auto / Student Loan Payment
13. `/calculators/emergency-fund-calculator.html` — 3-6 Month Safety Net Size
14. `/calculators/college-savings-calculator.html` — 529 Tuition Inflation & Savings

### Existing Articles (`/articles/`) — To be consolidated into tools
Total: 11 guides + 1 index hub.
1. `/articles/index.html` — Financial Guides Hub
2. `/articles/avalanche-vs-snowball-debt.html` → Consolidates into `/calculators/debt-elimination-planner.html`
3. `/articles/ultimate-credit-card-debt-elimination-guide.html` → Consolidates into `/calculators/credit-card-payoff-calculator.html`
4. `/articles/hysa-vs-cd-2025.html` → Consolidates into new HYSA vs CD Calculator tool
5. `/articles/rent-vs-buy-2025.html` → Consolidates into new Rent vs Buy Calculator tool
6. `/articles/roth-ira-vs-401k.html` → Consolidates into `/calculators/roth-vs-traditional-ira-calculator.html`
7. `/articles/how-to-build-emergency-fund.html` → Consolidates into `/calculators/emergency-fund-calculator.html`
8. `/articles/50-30-20-rule-budgeting.html` → Consolidates into `/calculators/paycheck-calculator.html`
9. `/articles/what-is-the-4-percent-rule.html` → Consolidates into `/calculators/fire-calculator.html` & `/calculators/retirement-calculator.html`
10. `/articles/boost-credit-score-30-days.html` → Consolidates into `/calculators/debt-elimination-planner.html`
11. `/articles/investing-50-dollars.html` → Consolidates into `/calculators/compound-interest-calculator.html`
12. `/articles/side-hustles-1000-month.html` → Consolidates into new Hourly to Salary / 1099 Tax tool

---

## 2. Code Architecture & JavaScript Logic

- **Pure Static Stack:** HTML5, Vanilla CSS (`/css/style.css`), Vanilla JavaScript (`/js/`).
- **Files Holding JS Logic:**
  - `js/main.js`: Theme switching, mobile menu toggle, multi-currency engine (`USD`, `EUR`, `GBP`, `INR`, `JPY`, `CAD`, `AUD`), social sharing link builder, newsletter submission fallback.
  - `js/charts.js`: SVG donut chart rendering module (`renderDonutChart`).
  - `js/daily-tips.js`: Rotating daily personal finance tips widget.
  - `js/daily-article.js`: Rotating daily featured guide spotlight banner.
  - `api/ai-advisor.js`: Netlify serverless function for AI guidance.
  - `api/subscribe.js`: Netlify serverless function for email capture.
  - Inline `<script>`: Each calculator page embeds its own computational formula, event handlers, and DOM manipulation scripts.
- **Authoring / Generation Method:**
  - Pages were created as handwritten static HTML files. No build system (Vite, Next, Astro, 11ty) currently exists.
  - A duplicate directory `dist/` and `finmatrix-deployment.zip` exist as historical deployment bundles.

---

## 3. Hosting & Server Infrastructure

- **Primary Host Detected:** **Netlify**
  - `netlify.toml` declares `[build] publish = "."` with custom header configurations.
  - `_headers` defines HTTP response headers: Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Cache-Control.
  - Netlify Forms (`data-netlify="true"`) used for newsletter capture on the homepage.
- **Secondary Host Artifacts:**
  - `.htaccess` present with Apache mod_rewrite rules (likely from past Hostinger/cPanel testing).
  - `subscribe.php` present for PHP-based hosting.

---

## 4. Crawl, SEO & Indexing Audit

- **Robots.txt (`/robots.txt`):** Exists. Allows general search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.). Disallows `/api/`. Points to `https://finmatrix.cloud/sitemap.xml`.
- **Sitemap (`/sitemap.xml`):** Exists, but has critical issues:
  - Last modified timestamps hardcoded to `2026-09-02`.
  - Lists articles (`/articles/...`) that are to be sunsetted and redirected.
  - Contains outdated URLs and lacks automated build script (`scripts/build-sitemap.js`).
- **Google Analytics (GA4):** **Missing.** No gtag.js or GTM snippet in `<head>` on any page.
- **AdSense / Display Ads:** **None.** No ad script or reserved ad containers present.
- **SearchAction Schema:** In `index.html` lines 81-89, schema declares:
  ```json
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://finmatrix.cloud/calculators/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
  ```
  **Critical Bug:** `/calculators/` has no search input and no JS logic to read or filter on `?q=`. It is entirely non-functional.

---

## 5. Homepage Hardcoded Elements & Claims (Violating Hard Rules)

1. **Stale Rate Table (violates Rule 1 & Rule 3):**
   - Section header: `Top High-Yield Savings Accounts (August 2026 Rates)` — Stale (current date: October 2026).
   - Unverified APYs:
     - Marcus by Goldman Sachs: `4.40% APY ... FDIC insured #33124`
     - SoFi Checking & Savings: `4.60% APY ... FDIC insured up to $2M`
     - Capital One 360 Performance: `4.25% APY`
   - Hardcoded FDIC certificate number (#33124) without dynamic verification.
2. **Broken Affiliate Links (violates Rule 2):**
   - All three cards on homepage use `href="#"` with `rel="nofollow"`.
   - Missing required attributes: `rel="sponsored nofollow noopener"` and `target="_blank"`.
   - Lacks connection to a central configuration file.
3. **Outdated "2025" Copy:**
   - Homepage lines 399-426 display tags: `🔥 Trending 2025`, `HYSA vs. CD in 2025/2026`, `Rent vs. Buy in 2025`, `Side Hustles to Make $1,000/Mo in 2025`.
4. **Blog / Article Blocks (violates Rule 5):**
   - "Latest Financial Guides" article grid (`articles/hysa-vs-cd-2025.html`, `rent-vs-buy-2025.html`, `side-hustles-1000-month.html`).
   - Automated Daily Trending Tips widget (`js/daily-tips.js`).
   - Daily Featured Topic Spotlight (`js/daily-article.js`).
5. **Tax Calculations Hardcoded in Calculators:**
   - In `paycheck-calculator.html`, 2025 tax brackets and standard deductions are hardcoded into JS code with approximate numbers (e.g., $176,100 wage base rather than 2026 $184,500; arbitrary bracket math).
   - No central `config/tax-year.json` exists.

---

## 6. Priorities for Phase 1 - Phase 7

1. **Critical Infrastructure (Phase 1):**
   - Create `config/site.json`, `config/affiliates.json`, and `config/tax-year.json` (2026 tax year).
   - Clean up `href="#"`, enforce `rel="sponsored nofollow noopener"`, remove unverified FDIC numbers and stale August rates.
   - Replace homepage article blocks with "Most Popular Calculators" and client-side Search.
   - Implement working `/calculators/?q=` search filter.
   - Build `robots.txt`, dynamic `scripts/build-sitemap.js`, and GA4 snippet loader.
   - Create trust pages: `/contact/`, `/disclaimer/`, `/editorial-policy/`, `/about/`.
2. **Standardized Tool-Page Template (Phase 2):**
   - Refactor top 5 calculators: `debt-elimination-planner.html`, `paycheck-calculator.html`, `mortgage-calculator.html`, `compound-interest-calculator.html`, `credit-card-payoff-calculator.html`.
   - Add shareable URLs (URL search params), worked examples, assumptions & sources, FAQ with schema, and automated unit tests.
3. **Internal Linking & Categories (Phase 3):**
   - Create category hubs: `/calculators/income-tax/`, `/debt/`, `/housing/`, `/savings-investing/`, `/loans/`.
   - Centralize tools into `config/calculators.json`.
4. **New Calculators (Phase 4):**
   - Build priority tools: Refinance break-even, Rent vs buy, Roth vs Traditional IRA, Paycheck by state, Self-employed (1099), Bonus withholding, Hourly to salary, Auto loan with trade-in, Student loan payoff, HYSA vs CD, 401(k) growth, Debt-to-income.
5. **Monetization & Ad Readiness (Phase 5):**
   - Contextual affiliate result box from `config/affiliates.json`.
   - Non-shifting CLS-free ad slots with `ads.enabled: false`.
6. **Embeddable Widgets (Phase 6):**
   - Lightweight `/embed/<tool>/` widgets for top tools with backlink attribution.
7. **Performance & QA (Phase 7):**
   - Core Web Vitals optimization, unit tests verification, redirects testing, `TODO.md` and handover guide.
