import fs from 'fs';
import http from 'http';

// Helper to render on Hostinger VPS
function testRender(html, name) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      html: html,
      viewport_width: 1000,
      viewport_height: 1500,
      ms_delay: 800
    });

    const req = http.request('http://31.97.232.154:3000/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          console.log(`[${name}] Status: ${res.statusCode} | URL: ${parsed.url}`);
          resolve(parsed.url);
        } catch (e) {
          console.error(`[${name}] Parse error:`, body);
          resolve(null);
        }
      });
    });

    req.on('error', err => {
      console.error(`[${name}] Request failed:`, err.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

// 1. COMPARISON SPLIT SCREEN (Debt Snowball vs Avalanche)
function buildComparisonSplitHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; background: #030712; color: #ffffff; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 50px 45px; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(circle at 50% 10%, #111827 0%, #030712 100%); position: relative; }
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 14px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.1; letter-spacing: -1px; margin-bottom: 10px; background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.subtitle { font-size: 22px; font-weight: 600; color: #94a3b8; }

.split-container { display: flex; gap: 24px; position: relative; margin: 20px 0; flex: 1; align-items: stretch; }
.vs-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; border-radius: 50%; background: #f59e0b; color: #000000; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(245, 158, 11, 0.6); z-index: 20; border: 4px solid #030712; }

.col-side { flex: 1; border-radius: 24px; padding: 30px 26px; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid; position: relative; overflow: hidden; }
.col-side.col-a { background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%); border-color: rgba(244, 63, 94, 0.35); }
.col-side.col-b { background: linear-gradient(180deg, #064e3b 0%, #022c22 100%); border-color: rgba(16, 185, 129, 0.5); box-shadow: 0 0 40px rgba(16, 185, 129, 0.2); }

.side-header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 18px; margin-bottom: 18px; }
.side-tag { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
.col-a .side-tag { color: #fb7185; }
.col-b .side-tag { color: #34d399; }
.side-name { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 900; line-height: 1.1; color: #ffffff; }

.side-points { display: flex; flex-direction: column; gap: 18px; flex: 1; }
.point-row { background: rgba(0,0,0,0.25); border-radius: 14px; padding: 14px; border: 1px solid rgba(255,255,255,0.06); }
.point-lbl { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.point-val { font-size: 18px; font-weight: 800; color: #f1f5f9; line-height: 1.3; }

.side-hero-metric { text-align: center; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); }
.metric-lbl { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.metric-num { font-size: 36px; font-weight: 900; }
.col-a .metric-num { color: #f43f5e; }
.col-b .metric-num { color: #10b981; }

.verdict-box { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 18px; padding: 16px 24px; text-align: center; margin-bottom: 16px; }
.verdict-text { font-size: 18px; font-weight: 700; color: #cbd5e1; }
.verdict-text strong { color: #10b981; }

.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
.brand-name { font-size: 20px; font-weight: 900; color: #ffffff; }
.brand-domain { font-size: 14px; color: #38bdf8; font-weight: 600; margin-left: 10px; }
.cta-pill { background: #0284c7; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="header-box">
    <div class="pill-badge">⚡ Strategy Comparison</div>
    <h1 class="title">Debt Snowball vs Avalanche</h1>
    <p class="subtitle">Which debt payoff method mathematically saves the most interest?</p>
  </div>

  <div class="split-container">
    <div class="vs-circle">VS</div>

    <!-- Left: Snowball -->
    <div class="col-side col-a">
      <div class="side-header">
        <div class="side-tag">Psychological Method</div>
        <div class="side-name">Debt Snowball</div>
      </div>
      <div class="side-points">
        <div class="point-row">
          <div class="point-lbl">Strategy Target</div>
          <div class="point-val">Pay smallest balances first regardless of interest rate</div>
        </div>
        <div class="point-row">
          <div class="point-lbl">Primary Benefit</div>
          <div class="point-val">Instant psychological wins and early motivational boost</div>
        </div>
        <div class="point-row">
          <div class="point-lbl">Finance Cost</div>
          <div class="point-val">High compounding APR continues accumulating on big balances</div>
        </div>
      </div>
      <div class="side-hero-metric">
        <div class="metric-lbl">Total Interest Paid</div>
        <div class="metric-num">$12,480</div>
      </div>
    </div>

    <!-- Right: Avalanche (Winner) -->
    <div class="col-side col-b">
      <div class="side-header">
        <div class="side-tag">Mathematical Winner</div>
        <div class="side-name">Debt Avalanche</div>
      </div>
      <div class="side-points">
        <div class="point-row">
          <div class="point-lbl">Strategy Target</div>
          <div class="point-val">Target highest APR accounts first with all extra cash flow</div>
        </div>
        <div class="point-row">
          <div class="point-lbl">Primary Benefit</div>
          <div class="point-val">Halts compounding charges & eliminates debt months faster</div>
        </div>
        <div class="point-row">
          <div class="point-lbl">Finance Cost</div>
          <div class="point-val">Mathematically slashes interest by up to 68%</div>
        </div>
      </div>
      <div class="side-hero-metric">
        <div class="metric-lbl">Total Interest Paid</div>
        <div class="metric-num">$4,120</div>
      </div>
    </div>
  </div>

  <div class="verdict-box">
    <span class="verdict-text">🏆 <strong>Finmatrix Verdict:</strong> Debt Avalanche saves <strong>$8,360 more in pure interest</strong> and makes you debt-free 9 months sooner.</span>
  </div>

  <div class="footer-bar">
    <div>
      <span class="brand-name">Finmatrix</span>
      <span class="brand-domain">finmatrix.cloud · Quantitative Finance</span>
    </div>
    <div class="cta-pill">COMPARE FREE CALCULATOR →</div>
  </div>
</div>
</body>
</html>`;
}

// 2. STEP-BY-STEP ROADMAP (Emergency Fund / 401k Blueprint)
function buildRoadmapHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; background: #020617; color: #ffffff; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 50px 48px; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(circle at 50% 15%, #0f172a 0%, #020617 100%); position: relative; }
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 14px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.1; letter-spacing: -1px; margin-bottom: 10px; color: #ffffff; }
.subtitle { font-size: 22px; font-weight: 600; color: #94a3b8; }

.timeline-container { position: relative; margin: 25px 0; display: flex; flex-direction: column; gap: 24px; }
.timeline-rail { position: absolute; top: 40px; bottom: 40px; left: 45px; width: 4px; background: linear-gradient(180deg, #10b981 0%, #0284c7 60%, #a855f7 100%); z-index: 1; }

.stage-card { position: relative; z-index: 10; display: flex; gap: 24px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 22px 24px; backdrop-filter: blur(15px); }
.stage-badge-circle { width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; flex-shrink: 0; border: 3px solid #ffffff; box-shadow: 0 8px 20px rgba(0,0,0,0.5); }
.stage-1 .stage-badge-circle { background: #10b981; color: #ffffff; }
.stage-2 .stage-badge-circle { background: #0284c7; color: #ffffff; }
.stage-3 .stage-badge-circle { background: #6366f1; color: #ffffff; }
.stage-4 .stage-badge-circle { background: #a855f7; color: #ffffff; }

.stage-content { flex: 1; }
.stage-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.stage-phase { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8; }
.stage-amount { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #fde047; }
.stage-title { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
.stage-desc { font-size: 16px; font-weight: 600; color: #cbd5e1; line-height: 1.4; }

.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
.brand-name { font-size: 20px; font-weight: 900; color: #ffffff; }
.brand-domain { font-size: 14px; color: #38bdf8; font-weight: 600; margin-left: 10px; }
.cta-pill { background: #10b981; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="header-box">
    <div class="pill-badge">🗺️ Financial Roadmap</div>
    <h1 class="title">The Emergency Fund Blueprint</h1>
    <p class="subtitle">4 mathematical phases to build unbreakable 3-to-6 month cash reserves</p>
  </div>

  <div class="timeline-container">
    <div class="timeline-rail"></div>

    <div class="stage-card stage-1">
      <div class="stage-badge-circle">01</div>
      <div class="stage-content">
        <div class="stage-header-row">
          <span class="stage-phase">PHASE 1: DEFENSIVE BUFFER</span>
          <span class="stage-amount">$1,000 CASH</span>
        </div>
        <div class="stage-title">Starter Emergency Cushion</div>
        <div class="stage-desc">Stops you from turning minor unexpected emergencies (flat tires, urgent bills) into new high-interest credit card debt.</div>
      </div>
    </div>

    <div class="stage-card stage-2">
      <div class="stage-badge-circle">02</div>
      <div class="stage-content">
        <div class="stage-header-row">
          <span class="stage-phase">PHASE 2: CORE BASELINE AUDIT</span>
          <span class="stage-amount">1 MONTH EXPENSES</span>
        </div>
        <div class="stage-title">Bare-Bones Survival Number</div>
        <div class="stage-desc">Calculate your absolute minimum survival baseline: housing, groceries, core utilities, and minimum loan debt payments.</div>
      </div>
    </div>

    <div class="stage-card stage-3">
      <div class="stage-badge-circle">03</div>
      <div class="stage-content">
        <div class="stage-header-row">
          <span class="stage-phase">PHASE 3: HYSA COMPOUND SWEEP</span>
          <span class="stage-amount">3 MONTHS LIQUID</span>
        </div>
        <div class="stage-title">High-Yield Liquidity Shield</div>
        <div class="stage-desc">Move reserves from 0.01% checking accounts into a 4.5%+ APY High-Yield Savings account to compound risk-free interest.</div>
      </div>
    </div>

    <div class="stage-card stage-4">
      <div class="stage-badge-circle">04</div>
      <div class="stage-content">
        <div class="stage-header-row">
          <span class="stage-phase">PHASE 4: FULL FORTRESS LEVEL</span>
          <span class="stage-amount">6 MONTHS BUFFER</span>
        </div>
        <div class="stage-title">Total Financial Sovereignty</div>
        <div class="stage-desc">6 full months of cash reserves unlocked. Frees 100% of future cash flow to compound inside 401(k), Roth IRA, and index funds.</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div>
      <span class="brand-name">Finmatrix</span>
      <span class="brand-domain">finmatrix.cloud · Quantitative Finance</span>
    </div>
    <div class="cta-pill">CALCULATE YOUR NUMBER →</div>
  </div>
</div>
</body>
</html>`;
}

// 3. EDITORIAL CHEAT SHEET GRID (50/30/20 Rule or 6 Money Levers)
function buildCheatSheetGridHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; background: #fafaf9; color: #1c1917; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 50px 48px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, #f5f5f4 0%, #fafaf9 40%, #f4f4f5 100%); }
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: #e0e7ff; color: #4338ca; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 14px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; color: #0f172a; margin-bottom: 10px; }
.subtitle { font-size: 22px; font-weight: 600; color: #64748b; }

.grid-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
.grid-card { background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; }
.card-icon-badge { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px; }
.card-1 .card-icon-badge { background: #fee2e2; }
.card-2 .card-icon-badge { background: #e0e7ff; }
.card-3 .card-icon-badge { background: #dcfce7; }
.card-4 .card-icon-badge { background: #fef3c7; }
.card-5 .card-icon-badge { background: #f3e8ff; }
.card-6 .card-icon-badge { background: #ccfbf1; }

.card-num { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.card-title { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px; line-height: 1.2; }
.card-desc { font-size: 15px; font-weight: 600; color: #475569; line-height: 1.4; }

.takeaway-banner { background: #0f172a; color: #ffffff; border-radius: 18px; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.tw-text { font-size: 18px; font-weight: 700; color: #e2e8f0; }
.tw-text strong { color: #38bdf8; }

.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #ffffff; border-radius: 16px; border: 1.5px solid #e2e8f0; }
.brand-name { font-size: 20px; font-weight: 900; color: #0f172a; }
.brand-domain { font-size: 14px; color: #0284c7; font-weight: 600; margin-left: 10px; }
.cta-pill { background: #0284c7; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="header-box">
    <div class="pill-badge">📊 Financial Framework</div>
    <h1 class="title">6 Levers to Build Wealth Faster</h1>
    <p class="subtitle">Mathematical rules to slash compounding interest & accelerate financial freedom</p>
  </div>

  <div class="grid-cards">
    <div class="grid-card card-1">
      <div>
        <div class="card-icon-badge">⚡</div>
        <div class="card-num">LEVER 01</div>
        <div class="card-title">APR Avalanche</div>
        <div class="card-desc">Target debts charging >10% APR first. Eradicates finance charges at the fastest mathematical rate.</div>
      </div>
    </div>
    <div class="grid-card card-2">
      <div>
        <div class="card-icon-badge">🏦</div>
        <div class="card-num">LEVER 02</div>
        <div class="card-title">HYSA Sweep</div>
        <div class="card-desc">Keep liquid cash in high-yield accounts earning >4.5% APY instead of 0.01% checking accounts.</div>
      </div>
    </div>
    <div class="grid-card card-3">
      <div>
        <div class="card-icon-badge">💼</div>
        <div class="card-num">LEVER 03</div>
        <div class="card-title">100% Match</div>
        <div class="card-desc">Capture full company 401(k) match. Instant, guaranteed 100% risk-free return on your money.</div>
      </div>
    </div>
    <div class="grid-card card-4">
      <div>
        <div class="card-icon-badge">📅</div>
        <div class="card-num">LEVER 04</div>
        <div class="card-title">Bi-Weekly Pay</div>
        <div class="card-desc">Make 26 half-payments per year. Automatically pays 1 extra monthly principal payment every 12 months.</div>
      </div>
    </div>
    <div class="grid-card card-5">
      <div>
        <div class="card-icon-badge">🛡️</div>
        <div class="card-num">LEVER 05</div>
        <div class="card-title">Tax-Free Roth</div>
        <div class="card-desc">Utilize Roth IRA contributions to compound long-term index funds completely free of capital gains tax.</div>
      </div>
    </div>
    <div class="grid-card card-6">
      <div>
        <div class="card-icon-badge">📈</div>
        <div class="card-num">LEVER 06</div>
        <div class="card-title">Index Compounding</div>
        <div class="card-desc">Automate low-cost index fund investments. S&P 500 historically doubles purchasing power every 7 years.</div>
      </div>
    </div>
  </div>

  <div class="takeaway-banner">
    <span class="tw-text">💡 <strong>Finmatrix Rule:</strong> Mathematical automation removes emotion from personal finance.</span>
  </div>

  <div class="footer-bar">
    <div>
      <span class="brand-name">Finmatrix</span>
      <span class="brand-domain">finmatrix.cloud · Quantitative Finance</span>
    </div>
    <div class="cta-pill">FREE EXCEL TOOLKIT →</div>
  </div>
</div>
</body>
</html>`;
}

// 4. COMPARISON MATRIX TABLE (HYSA vs CD Rates)
function buildMatrixTableHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; background: #0b132b; color: #ffffff; overflow: hidden; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 50px 48px; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(circle at 50% 15%, #1c2541 0%, #0b132b 100%); }
.header-box { text-align: center; }
.pill-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 8px 24px; border-radius: 999px; margin-bottom: 14px; }
.title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.1; letter-spacing: -1.5px; color: #ffffff; margin-bottom: 10px; }
.subtitle { font-size: 22px; font-weight: 600; color: #94a3b8; }

.table-card { background: rgba(15, 23, 42, 0.75); border: 1.5px solid rgba(255, 255, 255, 0.15); border-radius: 24px; overflow: hidden; margin: 25px 0; box-shadow: 0 25px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { background: #1e293b; color: #cbd5e1; font-size: 15px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.data-table td { padding: 20px 20px; font-size: 17px; font-weight: 700; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.row-highlight { background: rgba(16, 185, 129, 0.15); }
.row-highlight td { color: #ffffff; font-weight: 800; border-top: 1px solid rgba(16, 185, 129, 0.4); border-bottom: 1px solid rgba(16, 185, 129, 0.4); }

.tag-winner { background: #10b981; color: #ffffff; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; margin-left: 8px; display: inline-block; vertical-align: middle; }
.rate-val { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: #38bdf8; }
.row-highlight .rate-val { color: #34d399; font-size: 26px; }

.summary-card { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 20px 26px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.sum-left { display: flex; flex-direction: column; gap: 4px; }
.sum-title { font-size: 18px; font-weight: 800; color: #ffffff; }
.sum-desc { font-size: 14px; font-weight: 600; color: #94a3b8; }
.sum-badge { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #fde047; }

.footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
.brand-name { font-size: 20px; font-weight: 900; color: #ffffff; }
.brand-domain { font-size: 14px; color: #38bdf8; font-weight: 600; margin-left: 10px; }
.cta-pill { background: #0284c7; color: #ffffff; font-size: 15px; font-weight: 800; padding: 10px 24px; border-radius: 10px; }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="header-box">
    <div class="pill-badge">📊 Interest Matrix</div>
    <h1 class="title">HYSA vs CD Comparison Matrix</h1>
    <p class="subtitle">Where should you deposit your cash reserves for maximum risk-free yield?</p>
  </div>

  <div class="table-card">
    <table class="data-table">
      <thead>
        <tr>
          <th>Account Type</th>
          <th>Typical APY</th>
          <th>Liquidity</th>
          <th>Lock Term</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Traditional Checking</td>
          <td><span class="rate-val">0.01%</span></td>
          <td>Instant ATM</td>
          <td>None</td>
        </tr>
        <tr>
          <td>Traditional Savings</td>
          <td><span class="rate-val">0.05%</span></td>
          <td>6 Transfers/Mo</td>
          <td>None</td>
        </tr>
        <tr class="row-highlight">
          <td>High-Yield Savings <span class="tag-winner">FLEXIBLE WINNER</span></td>
          <td><span class="rate-val">4.50% - 5.10%</span></td>
          <td>1-2 Day ACH</td>
          <td>Zero Lock</td>
        </tr>
        <tr>
          <td>12-Month CD Ladder</td>
          <td><span class="rate-val">4.80% - 5.25%</span></td>
          <td>Locked</td>
          <td>12 Months</td>
        </tr>
        <tr>
          <td>5-Year Fixed Deposit</td>
          <td><span class="rate-val">4.25% - 4.75%</span></td>
          <td>Penalty on Early Exit</td>
          <td>60 Months</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="summary-card">
    <div class="sum-left">
      <div class="sum-title">Annual Interest on $50,000 Deposit</div>
      <div class="sum-desc">HYSA earns $2,550/yr vs Traditional Bank earning just $5/yr</div>
    </div>
    <div class="sum-badge">+$2,545 FREE CASH</div>
  </div>

  <div class="footer-bar">
    <div>
      <span class="brand-name">Finmatrix</span>
      <span class="brand-domain">finmatrix.cloud · Quantitative Finance</span>
    </div>
    <div class="cta-pill">COMPARE LIVE RATES →</div>
  </div>
</div>
</body>
</html>`;
}

async function runTests() {
  console.log('Testing render of multiple visual archetypes on Hostinger VPS...');
  await testRender(buildComparisonSplitHtml(), 'Comparison Split Screen');
  await testRender(buildRoadmapHtml(), 'Stepped Growth Roadmap');
  await testRender(buildCheatSheetGridHtml(), 'Editorial Cheat Sheet Grid');
  await testRender(buildMatrixTableHtml(), 'Comparison Matrix Table');
  console.log('All 4 layout archetypes tested successfully!');
}

runTests();
