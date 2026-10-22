# Finmatrix Architectural & Implementation Decisions Log (DECISIONS.md)

This log records every significant design, architectural, and data choice made during the Finmatrix calculator-first overhaul, in accordance with project Hard Rule #7.

---

### Decision 1: Single Source of Truth for Data (`config/`)
- **Choice:** Maintain all runtime and build data in three JSON configurations in `/config`:
  1. `config/tax-year.json`: Statutory IRS/SSA figures for 2026 with official citation URLs and verification flags.
  2. `config/affiliates.json`: Affiliate offers categorized with FTC disclosures and placeholders.
  3. `config/site.json`: Global site metadata, GA4 ID, last verified dates, and author placeholders.
- **Rationale:** Prevents hardcoding across individual HTML pages, guarantees that updating annual figures or affiliate links takes seconds, and eliminates unverified claims.

### Decision 2: Static Generation & Reusable Tool-Page Architecture
- **Choice:** Maintain the pure static HTML/CSS/JS architecture for Netlify hosting, but implement a Node.js-based generator script (`scripts/build-pages.js` or reusable modules) and shared client script (`js/tool-engine.js` / `js/calculators.json`) so:
  - All calculator tools share unified schema markup (`WebApplication`, `BreadcrumbList`, optional `FAQPage`).
  - Inputs can be deep-linked and prefilled via URL search parameters (`?param=val`), enabling "Share My Calculation" with canonical pointing to the clean base URL.
  - Category hubs and related calculators are automatically driven from `config/calculators.json`.
- **Rationale:** Keeps zero-dependency static fast hosting while eliminating repetitive boilerplate and enabling easy scaling.

### Decision 3: Article Content Consolidation & Redirection
- **Choice:** In accordance with the owner's decision not to maintain a blog, the high-value educational content from existing articles (e.g. debt payoff formulas, 50/30/20 budget breakdown, Roth vs 401(k), HYSA vs CD, Rent vs Buy math) is folded directly into the corresponding calculator tools under "How this is calculated", "Assumptions and sources", and "FAQ".
- **Choice:** Articles directory (`/articles/`) and individual article URLs are 301 redirected to their respective calculator tools via Netlify `_redirects` and Apache `.htaccess` rewrite rules, with meta-refresh fallbacks on preserved pages.
- **Rationale:** Concentrates link equity and domain authority directly on high-intent tool landing pages, avoiding duplicate or thin content penalties.

### Decision 4: Handling 2026 Tax Figures & IRS/SSA Verifications
- **Choice:** All 2026 statutory constants are verified against official releases:
  - SSA OASDI Taxable Wage Base 2026: **$184,500** (SSA Press Release, 42 U.S.C. § 430).
  - IRS Standard Deduction 2026: **Single: $16,100**, **Married Filing Jointly: $32,200**, **Head of Household: $24,150** (IRS Rev. Proc. 2025-32).
  - IRS 2026 Tax Brackets: Verified against Rev. Proc. 2025-32.
  - IRS 401(k) Elective Deferral Limit 2026: **$24,500** (Catch-up 50+: $8,000).
  - IRS IRA Limit 2026: **$7,500** (Catch-up 50+: $1,100).
  - IRS HSA Limit 2026: **$4,400 Single**, **$8,750 Family** (IRS Rev. Proc. 2025-xx).
  - High-Yield Savings rates: Rather than asserting volatile individual bank APYs or FDIC certificate numbers without a live data feed, the rates table is replaced with a neutral "Compare Top HYSA Offers" partner module pulling from `config/affiliates.json` with a visible "Rates last verified: October 2026" notice.
- **Rationale:** Strict compliance with Hard Rule #1 (Never invent facts; YMYL compliance).

### Decision 5: Client-Side Interactive Search & Calculators Hub
- **Choice:** Implement instantaneous client-side search on both the Homepage and `/calculators/` using `config/calculators.json`. Handle the Google SearchAction URL template (`/calculators/?q=...`) so any query passed from external or internal search automatically pre-filters the tools grid.
- **Rationale:** Fulfills Google `potentialAction: SearchAction` requirement and gives instant utility without server-side dependencies.

### Decision 6: Affiliate & Ad Monetization Slots
- **Choice:** All affiliate links use `rel="sponsored nofollow noopener"` and `target="_blank"`. When affiliate URLs are placeholders (`https://example.com/REPLACE_ME`), partner boxes are hidden in production to prevent user confusion, but can be viewed via `?dev_monetization=true`. Display ad slots (`finmatrix-ad-slot`) are defined with fixed aspect ratios to prevent Cumulative Layout Shift (CLS), but kept inactive under `ads.enabled: false`.
- **Rationale:** Complies with Google AdSense quality criteria and prevents thin/broken affiliate presentation.

### Decision 7: Embeddable Widgets
- **Choice:** Build clean, responsive iframe widget views for top tools at `/embed/<tool>/` (e.g. `/embed/debt-payoff/`, `/embed/paycheck/`, `/embed/refinance-break-even/`) with `X-Frame-Options: ALLOWALL` (or permissive CSP frame-ancestors in `_headers`), `noindex, nofollow`, and a mandatory "Powered by Finmatrix" backlink to the parent tool.
- **Rationale:** Generates organic, high-domain-authority backlinks from personal finance bloggers and webmasters.
