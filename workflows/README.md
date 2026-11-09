# Finmatrix n8n Automated Lead & Affiliate Monetization Engine

> **Workflow File:** [`workflows/finmatrix-lead-capture-workflow.json`](file:///c:/Antigravity/finmatrix/workflows/finmatrix-lead-capture-workflow.json)

This n8n workflow doesn't just deliver spreadsheets — it **automatically segments each visitor based on what they searched and pitches the highest-paying affiliate financial product matched to their exact financial problem**.

---

## The Automated 2-Step Affiliate Sales Funnel

```
               ┌────────────────────────────────────────────────────────┐
               │             1. Finmatrix Lead Webhook                  │
               │  Receives: Name, Email, WhatsApp Phone, Toolkit URLs   │
               └───────────────────────────┬────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │  Instant 200 OK Response    │               │  Smart Affiliate Matcher    │
     │  Unlocks downloads in user  │               │  Matches exact product per  │
     │  browser in 0.1 seconds     │               │  visitor search/calculator  │
     └─────────────────────────────┘               └──────────────┬──────────────┘
                                                                  │
                   ┌──────────────────────────────────────────────┼──────────────────────────────────────────────┐
                   ▼                                              ▼                                              ▼
    ┌─────────────────────────────┐                ┌─────────────────────────────┐                ┌─────────────────────────────┐
    │  Email 1: Instant Delivery  │                │  Save & Segment in CRM      │                │  Instant Admin Phone Alert  │
    │  • Direct Excel & PDF links │                │  Logs: Lead Name, Email,    │                │  Telegram/Discord ping with │
    │  • Tasteful Sponsor Box     │                │  Phone, Matched Product     │                │  Phone, Email & Product     │
    └──────────────┬──────────────┘                └─────────────────────────────┘                └─────────────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │  Wait 24 Hours              │
    │  (Allows user to use sheet) │
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │  Email 2: Educational Pitch │
    │  Automated, high-converting │
    │  affiliate pitch tailored   │
    │  to their exact problem!    │
    └─────────────────────────────┘
```

---

## How It Automatically Matches Products

| What the User Searched / Downloaded | Intent | The Automated Affiliate Product Pitched | Estimated Payout |
| :--- | :--- | :--- | :--- |
| **Debt Snowball vs Avalanche**<br/>(or credit card payoff) | Crushing high-interest credit card debt | **0% Intro APR Balance Transfer Card**<br/>Pitched as: *"Freeze finance charges for 18–21 months so 100% of payments wipe out principal"* | **$60 – $140** per approved card (Impact / CJ) |
| **Payment Calculator**<br/>(or Mortgage / Loan Amortization) | Lowering monthly vehicle or home loan payments | **Vetted Lending & Refi Network**<br/>Pitched as: *"Compare personalized quotes from 5+ competing lenders to shave 0.50% off your APR"* | **$30 – $80** per loan quote (LendingTree / Credible) |
| **Emergency Fund Cushion**<br/>(or HYSA vs CD calculator) | Maximizing cash liquidity & yield | **4.50%+ APY FDIC High-Yield Savings Account**<br/>Pitched as: *"Stop earning 0.01% at big banks. Earn $900+/yr in risk-free guaranteed cash return"* | **$50 – $120** per funded account (SoFi / Upgrade) |
| **Retirement Longevity Matrix**<br/>(or 401k / FIRE calculator) | Long-term investing & wealth accumulation | **Commission-Free Roth IRA & Index Fund Broker**<br/>Pitched as: *"Eliminate 1% management fee drag that steals 10 years of your retirement nest egg"* | **$50 – $100** per funded account (M1 Finance / Robinhood) |

---

## How to Import & Use It

1. Open your n8n workspace $\rightarrow$ Click **+ Add Workflow**.
2. Open [`workflows/finmatrix-lead-capture-workflow.json`](file:///c:/Antigravity/finmatrix/workflows/finmatrix-lead-capture-workflow.json) $\rightarrow$ Copy all JSON (`Ctrl+A`, `Ctrl+C`).
3. Click in your n8n canvas and press **`Ctrl+V`**.
4. Double-click the **Finmatrix Lead Webhook** node $\rightarrow$ Copy the **Production URL**.
5. Open [`config/site.json`](file:///c:/Antigravity/finmatrix/config/site.json) and paste your URL:
   ```json
   "automation": {
     "n8n_webhook_url": "https://n8n.yourdomain.com/webhook/finmatrix-lead",
     "email_provider": "hostinger_smtp"
   }
   ```
6. Toggle workflow to **Active** in n8n.

You now have an autonomous, hands-off financial lead capture and affiliate sales engine!
