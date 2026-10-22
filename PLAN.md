# Finmatrix Engineering Implementation Plan (PLAN.md)

**Target Production Domain:** `https://finmatrix.cloud`  
**Execution Standard:** Strictly zero-hallucinated figures, YMYL-compliant disclosures, verified 2026 tax constants, high-performance static pages.

---

## Phase 0: Repository Audit & Planning [COMPLETED]
- [x] Complete comprehensive codebase, SEO, and content audit.
- [x] Identify all 14 calculator pages, 12 articles, JavaScript handlers, and Netlify hosting infrastructure.
- [x] Record all architectural choices in `DECISIONS.md`.
- [x] Produce `AUDIT.md` and `PLAN.md`.
- [x] Git checkpoint commit.

---

## Phase 1: Critical Fixes
1. **Central Configuration Files (`config/`):**
   - Create `config/site.json`: Domain, site metadata, GA4 measurement ID placeholder (`G-XXXXXXXXXX`), author/editorial info, "rates_last_verified" (October 2026).
   - Create `config/affiliates.json`: Clean entries for `hysa`, `balance-transfer`, `mortgage`, `tax-software`, `personal-loan`, `investing` with obvious placeholders (`https://example.com/REPLACE_ME`), FTC disclosure text, and categories.
   - Create `config/tax-year.json`: Comprehensive 2026 tax year parameters (IRS Rev. Proc. 2025-32 brackets for Single, MFJ, HoH; standard deductions; SSA OASDI wage cap $184,500; 401(k) limit $24,500; IRA limit $7,500; HSA limits $4,400 / $8,750), each with citation source URL and `verified: true/false`.
2. **Homepage Affiliate & Rates Cleanup:**
   - Replace hardcoded APYs, bank claims, and FDIC certificate number with a neutral, verified "Compare High-Yield Savings Accounts" section reading from `config/affiliates.json`.
   - Replace all `href="#"` with configured affiliate URLs; enforce `rel="sponsored nofollow noopener"` and `target="_blank"`.
   - Add visible "Rates last verified: October 2026" notice and FTC disclosure.
3. **"2025" Copy & Tax Year Cleanup:**
   - Scan and update all outdated "2025" references to 2026 across titles, meta tags, H1s, copy, and badges.
4. **Articles Sunset & Redirection:**
   - Map all 11 articles to their corresponding calculator tools.
   - Configure 301 redirects in `_redirects` (Netlify format) and `.htaccess` (Apache format).
   - Remove "Latest Financial Guides" and automated daily tips/articles scripts from `index.html`.
5. **Popular Calculators Grid & Working Search:**
   - Replace homepage article blocks with a prominent "Most Popular Calculators" grid.
   - Implement working client-side search on both `index.html` and `/calculators/` powered by `config/calculators.json`.
   - Support `?q=...` search parameter handling for Google SearchAction compliance.
6. **Analytics & Search Console Setup:**
   - Add GA4 script loader that respects the placeholder in `config/site.json` (skips loading if still `G-XXXXXXXXXX`).
   - Create `ANALYTICS_AND_SEARCH_CONSOLE.md` with step-by-step owner instructions for domain verification and sitemap submission.
7. **Crawl Basics & Trust/E-E-A-T Pages:**
   - Update `robots.txt` and generate `sitemap.xml` with indexable URLs.
   - Build `scripts/build-sitemap.js` using Node.js to automate future updates.
   - Create missing authority pages: `/contact/`, `/disclaimer/`, and upgrade `/about/`, `/editorial-policy/`, and `/privacy-policy.html`.

---

## Phase 2: Reusable Tool-Page Template & Top 5 Tools
1. **Tool-Page Specification & Shared Module:**
   - Create reusable tool-page layout with standardized sections:
     - Search-focused `<title>` and `<meta name="description">`.
     - H1 above the fold with interactive calculator usable without sign-up.
     - Deep-linking URL query parameter engine (`?bal=...&apr=...`) with "Share My Calculation" button.
     - "How this is calculated" (150–300 words) with explicit formula and worked example.
     - "Assumptions and sources" citing `config/tax-year.json`.
     - 4–6 FAQ questions in `<details>` accordion with `FAQPage` schema.
     - Related calculators block & "Next step" chain.
     - Contextual affiliate result box (Phase 5 integration).
     - `WebApplication` and `BreadcrumbList` JSON-LD structured data.
     - Accessibility (`aria-live`, label bindings, keyboard navigation).
2. **Apply to Top 5 Tools:**
   - Tool 1: Debt Payoff Planner (Avalanche vs Snowball) (`debt-elimination-planner.html`)
   - Tool 2: Paycheck & Take-Home Pay Calculator (`paycheck-calculator.html`)
   - Tool 3: Mortgage Payment & Amortization Calculator (`mortgage-calculator.html`)
   - Tool 4: Compound Interest Calculator (`compound-interest-calculator.html`)
   - Tool 5: Credit Card Payoff Calculator (`credit-card-payoff-calculator.html`)
3. **Automated Unit Testing (`tests/`):**
   - Implement Node.js unit tests (`tests/calculator-formulas.test.js`) comparing math against reference cases and edge conditions (0%, $0, very large balances).

---

## Phase 3: Structure & Internal Linking
1. **Central Tool Index (`config/calculators.json`):**
   - Single source of truth for all tools (id, title, path, category, icon, description, formula, keywords).
2. **Category Hubs:**
   - Build dedicated category landing pages:
     - `/calculators/income-tax/`
     - `/calculators/debt/`
     - `/calculators/housing/`
     - `/calculators/savings-investing/`
     - `/calculators/loans/`
   - Each hub includes 80–150 words of guidance, tool directory, and `BreadcrumbList` schema.
3. **Homepage Refactor:**
   - Hero → Popular Calculators → Category Navigation → Trust Signals (free, private, 2026 data) → Newsletter Lead Magnet.

---

## Phase 4: High-Value New Calculators
Implement new multi-input, non-commodity tools in priority order:
1. Refinance break-even calculator (`/calculators/refinance-break-even-calculator.html`)
2. Rent vs buy calculator (`/calculators/rent-vs-buy-calculator.html`)
3. Roth vs Traditional IRA calculator (enhanced with 2026 limits & phaseouts)
4. Paycheck / take-home pay by state (top 10 states with verified state tax brackets: CA, NY, TX, FL, IL, PA, OH, NC, WA, GA)
5. Self-employed (1099) tax estimator & 1099 vs W-2 comparison (`/calculators/self-employed-tax-calculator.html`)
6. Bonus and overtime withholding calculator (`/calculators/bonus-tax-calculator.html`)
7. Hourly to salary after tax calculator (`/calculators/hourly-to-salary-calculator.html`)
8. Auto loan with trade-in calculator (`/calculators/auto-loan-calculator.html`)
9. Student loan payoff with extra payments (`/calculators/student-loan-calculator.html`)
10. HYSA vs CD comparison calculator (`/calculators/hysa-vs-cd-calculator.html`)
11. 401(k) growth with employer match calculator (`/calculators/401k-calculator.html`)
12. Debt-to-income (DTI) ratio calculator (`/calculators/debt-to-income-calculator.html`)

---

## Phase 5: Monetization Slots
1. **Contextual Affiliate Result Box:**
   - Displayed dynamically below calculation results based on category.
   - Pulls from `config/affiliates.json`.
   - Hidden when URLs are placeholders (`https://example.com/REPLACE_ME`), but viewable in dev mode via `?dev_monetization=true`.
2. **AdSense Readiness:**
   - Reserve fixed-height, non-shifting ad containers (`finmatrix-ad-slot`) with zero Cumulative Layout Shift (CLS).
   - Flag controlled: `ads.enabled: false` in `config/site.json`. No AdSense script loaded until enabled.
   - Create `ADSENSE_READINESS.md` checklist.

---

## Phase 6: Embeddable Widgets (Backlink Engine)
1. Build lightweight iframe views at `/embed/<tool>/` (e.g. debt payoff, paycheck, mortgage, refinance).
2. Include prominent "Powered by Finmatrix" backlink with dofollow link to the canonical tool.
3. Add "Embed this calculator on your site" modal / copyable snippet on parent tool pages.
4. Set `noindex` and configure embed permissions in `_headers`.

---

## Phase 7: Performance, QA & Handover
1. Validate all HTML, internal links, canonical tags, and schema JSON-LD.
2. Run unit tests on all mathematical formulas.
3. Optimize font loading (`swap`), defer JS, minimize CSS, test Core Web Vitals.
4. Generate `TODO.md`, `CONTENT_GUIDE.md`, and final execution summary.
