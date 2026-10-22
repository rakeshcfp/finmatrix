# Finmatrix Action Items & Verification Log (TODO.md)

This log contains all items requiring input, verification, or credentials from the website owner.

---

## 1. Google Analytics 4 (GA4) Activation
- [ ] **GA4 Measurement ID:** Current placeholder is `"G-XXXXXXXXXX"` in [`config/site.json`](file:///c:/Antigravity/finmatrix/config/site.json).
  - *Action:* Create a web data stream for `https://finmatrix.cloud` in [Google Analytics](https://analytics.google.com/) and update `config/site.json`.
  - *Note:* The site automatically suppresses analytics loading until a valid `G-...` ID is provided.

## 2. Affiliate Tracking URLs
- [ ] **Affiliate Referral URLs:** Current URLs in [`config/affiliates.json`](file:///c:/Antigravity/finmatrix/config/affiliates.json) are placeholders (`https://example.com/REPLACE_ME?...`).
  - *Action:* Join affiliate networks (such as Impact, CJ Affiliate, LendingTree, Bankrate, or direct bank partner programs) and replace the placeholder URLs with your live tracking links.
  - *Categories to configure:*
    - `hysa-primary` (High-Yield Savings)
    - `balance-transfer-primary` (0% APR Balance Transfer Credit Cards)
    - `mortgage-primary` (Mortgage & Refinance Lenders)
    - `tax-software-primary` (Online Tax Filing Software)
    - `investing-primary` (Brokerage / Roth IRA accounts)
    - `personal-loan-primary` (Fixed-rate debt consolidation)
    - `student-loan-refi` (Student loan refinancing)
  - *Safety Guardrail:* Affiliate boxes automatically stay hidden in production until active, non-placeholder URLs are configured (or viewed with `?dev_monetization=true`).

## 3. Real Author Profile & E-E-A-T Credentials
- [ ] **Author Name & Bio:** Currently designated as `"Finmatrix Financial Research Desk"` in `config/site.json` and `about.html`.
  - *Action:* Update `author.name`, `author.bio`, and `author.sameAs` in `config/site.json` with your real name and professional profile links (LinkedIn, Crunchbase, etc.).
  - *Warning:* In adherence to YMYL Hard Rules, do not fabricate credentials or fictitious author names.

## 4. Google Search Console & Webmaster Indexing
- [ ] **Domain Verification:** Add `finmatrix.cloud` to [Google Search Console](https://search.google.com/search-console). Add the DNS TXT record or HTML tag as instructed in [`ANALYTICS_AND_SEARCH_CONSOLE.md`](file:///c:/Antigravity/finmatrix/ANALYTICS_AND_SEARCH_CONSOLE.md).
- [ ] **Submit Sitemap:** Submit `https://finmatrix.cloud/sitemap.xml` in Search Console and Bing Webmaster Tools.

## 5. Tax & Regulatory Data Audit (Annual Review)
- [x] **2026 Federal Income Tax Brackets:** Verified from IRS Revenue Procedure 2025-32.
- [x] **2026 Standard Deductions:** Verified ($16,100 Single / $32,200 MFJ / $24,150 HoH).
- [x] **2026 Social Security Wage Cap:** Verified ($184,500; SSA 42 U.S.C. § 430).
- [x] **2026 401(k) Contribution Limit:** Verified ($24,500; catch-up $8,000).
- [x] **2026 IRA Contribution Limit:** Verified ($7,500; catch-up $1,100).
- [x] **2026 HSA Contribution Limits:** Verified ($4,400 Single / $8,750 Family).
- [ ] **Additional State Tax Models:** Top 10 states (TX, FL, WA, NV, PA, IL, NC, IN, CA, NY) are verified in `config/tax-year.json`. If adding specific scenario pages for remaining US states, verify each state revenue department's exact brackets before publishing.

## 6. Google AdSense Application & Activation
- [ ] **Submit to AdSense:** Follow the step-by-step checklist in [`ADSENSE_READINESS.md`](file:///c:/Antigravity/finmatrix/ADSENSE_READINESS.md) to submit `https://finmatrix.cloud` for Google AdSense site approval.
- [ ] **Enable Display Ads:** Once approved, update `config/site.json` with `"ads": { "enabled": true, "client_id": "ca-pub-..." }`.
- [ ] **Publish ads.txt:** Place your authorized `ads.txt` file in the root directory.

