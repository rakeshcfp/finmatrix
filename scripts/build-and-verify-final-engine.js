import fs from 'fs';
import http from 'http';

function renderOnVps(html) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ html });
    const req = http.request({
      hostname: '31.97.232.154',
      port: 3000,
      path: '/render',
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
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON: ' + body));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

// Full Agency-Grade Studio Engine HTML Generator
export function generateAgencyPinHtml(item) {
  const headline = item.headlineOnImage || 'FINANCIAL CALCULATOR';
  const subtitle = item.subtitleOnImage || 'Calculate Your Numbers & Grow Wealth';
  const calcHeader = item.calcHeaderTitle || 'Finmatrix Engine';
  const scriptTag = item.scriptTag || 'Free & Easy to Use';
  const intent = item.intentType || 'CALCULATOR';

  // Dynamic Category Pills
  function getPills(pillar, kw) {
    const p = (pillar || '').toLowerCase();
    const k = (kw || '').toLowerCase();
    if (p.includes('retire') || k.includes('roth') || k.includes('401k') || k.includes('ira')) {
      return [
        { icon: '🏦', label: '401(k) Match' },
        { icon: '🛡️', label: 'Roth IRA' },
        { icon: '💼', label: 'Trad IRA' },
        { icon: '📈', label: 'Index Funds' },
        { icon: '🏖️', label: 'Early FIRE' }
      ];
    }
    if (p.includes('debt') || k.includes('debt') || k.includes('payoff') || k.includes('credit')) {
      return [
        { icon: '💳', label: 'Credit Card' },
        { icon: '❄️', label: 'Snowball' },
        { icon: '⚡', label: 'Avalanche' },
        { icon: '📉', label: 'APR Slash' },
        { icon: '🏆', label: 'Debt Free' }
      ];
    }
    if (p.includes('mortgage') || k.includes('mortgage') || k.includes('house') || k.includes('home')) {
      return [
        { icon: '🏠', label: 'Mortgage' },
        { icon: '🚗', label: 'Auto Loan' },
        { icon: '💰', label: 'Personal' },
        { icon: '🤝', label: 'Refinance' },
        { icon: '🏢', label: 'Commercial' }
      ];
    }
    return [
      { icon: '💰', label: 'HYSA 5.0%' },
      { icon: '📜', label: '12-Mo CD' },
      { icon: '🛡️', label: 'Emergency' },
      { icon: '💧', label: 'Cash Sweep' },
      { icon: '📈', label: 'S&P 500' }
    ];
  }

  const pills = getPills(item.pillar, item.targetKeyword);
  const pillsHtml = pills.map(p => `
    <div class="pill-item">
      <div class="pill-icon">${p.icon}</div>
      <span class="pill-lbl">${p.label}</span>
    </div>
  `).join('');

  let midHtml = '';

  // 1. COMPARISON INTENT (8-ROW AGENCY COMPARISON MATRIX)
  if (intent === 'COMPARE') {
    const sideA = item.sideATitle || 'Roth IRA';
    const tagA = item.sideATag || 'POST-TAX WEALTH';
    const sideB = item.sideBTitle || 'Traditional 401(k)';
    const tagB = item.sideBTag || 'PRE-TAX COMPOUNDING';

    midHtml = `
    <div class="comparison-matrix-wrapper">
      <div class="comp-table-header">
        <div class="col-th-feature">Key Parameter</div>
        <div class="col-th-side">
          <div class="th-title">${sideA}</div>
          <span class="th-tag-roth">${tagA}</span>
        </div>
        <div class="col-th-side">
          <div class="th-title">${sideB}</div>
          <span class="th-tag-401k">${tagB}</span>
        </div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>💵</span> ${item.row1Label || 'Annual Contribution Limit'}</div>
        <div class="row-val-a"><strong>${item.row1ValA || '$7,000 / year'}</strong><br><span style="font-size:12px; color:#64748b;">(2026 IRS Cap)</span></div>
        <div class="row-val-b"><strong>${item.row1ValB || '$23,000 / year'}</strong><br><span class="badge-winner">3.3x Higher Limit</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>📉</span> ${item.row2Label || 'Current Tax Deduction'}</div>
        <div class="row-val-a">${item.row2ValA || 'No immediate deduction'}<br><span style="font-size:12px; color:#64748b;">(Funded with post-tax $)</span></div>
        <div class="row-val-b">${item.row2ValB || 'Immediate Tax Deduction'}<br><span class="badge-winner">Lowers W-2 Tax Today</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>💼</span> ${item.row3Label || 'Company Employer Match'}</div>
        <div class="row-val-a">${item.row3ValA || 'None available'}<br><span style="font-size:12px; color:#64748b;">(Individual account)</span></div>
        <div class="row-val-b">${item.row3ValB || '50% - 100% Match'}<br><span class="badge-winner">Instant Guaranteed Return</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>🏖️</span> ${item.row4Label || 'Retirement Withdrawals'}</div>
        <div class="row-val-a"><strong>${item.row4ValA || '100% TAX-FREE'}</strong><br><span class="badge-winner">0% Federal & State Tax</span></div>
        <div class="row-val-b">${item.row4ValB || 'Taxed as Ordinary Income'}<br><span style="font-size:12px; color:#64748b;">(Subject to future rates)</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>⚡</span> ${item.row5Label || 'Early Withdrawal Penalty'}</div>
        <div class="row-val-a">${item.row5ValA || 'Withdraw contributions anytime'}<br><span class="badge-highlight-blue">100% Penalty-Free</span></div>
        <div class="row-val-b">${item.row5ValB || '10% IRS Penalty'}<br><span style="font-size:12px; color:#dc2626;">(Locked until age 59½)</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>📜</span> ${item.row6Label || 'Required Minimum Distributions'}</div>
        <div class="row-val-a"><strong>${item.row6ValA || 'ZERO RMDs Ever'}</strong><br><span class="badge-winner">Compound Forever</span></div>
        <div class="row-val-b">${item.row6ValB || 'Mandatory at Age 73'}<br><span style="font-size:12px; color:#64748b;">(Forces taxable withdrawals)</span></div>
      </div>

      <div class="comp-row">
        <div class="row-feature-title"><span>🎯</span> ${item.row7Label || 'Optimal Strategy Alignment'}</div>
        <div class="row-val-a">${item.row7ValA || 'Best if tax bracket is lower now'}<br><span style="font-size:12px; color:#64748b;">(Younger or growing income)</span></div>
        <div class="row-val-b">${item.row7ValB || 'Best if peak earning years'}<br><span style="font-size:12px; color:#64748b;">(Slash high marginal rate today)</span></div>
      </div>

      <div class="comp-row row-hero-metric">
        <div class="row-feature-title"><span>🏆</span> Projected Balance (30 Yrs)</div>
        <div class="row-val-a">${item.metricNumA || '$1,480,000'}<br><span style="font-size:12px; color:#38bdf8; font-weight:700;">100% Net In Pocket</span></div>
        <div class="row-val-b">${item.metricNumB || '$2,140,000'}<br><span style="font-size:12px; color:#4ade80; font-weight:700;">Pre-Tax ($1.6M After Tax)</span></div>
      </div>
    </div>

    <div class="verdict-rule-box">
      <div class="verdict-icon">💡</div>
      <div>
        <div class="verdict-tag">Finmatrix Quantitative Rule</div>
        <div class="verdict-text">${item.verdictText || 'Capture 100% company match first (guaranteed return), then max out Roth IRA for tax diversification.'}</div>
      </div>
    </div>`;
  }

  // 2. CALCULATOR INTENT (PHOTOGRAPHIC DESK + MACBOOK WORKSPACE)
  else if (intent === 'CALCULATOR') {
    midHtml = `
    <div class="workspace-stage">
      <div class="left-sidebar-stack">
        <div class="checklist-card">
          <div class="checklist-title">Know Your Numbers!</div>
          <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check1 || 'Monthly Payment'}</span></div>
          <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check2 || 'Total Interest Calculation'}</span></div>
          <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check3 || 'Compounding Balance Growth'}</span></div>
          <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check4 || 'Amortization & Payoff Table'}</span></div>
        </div>

        <div class="spiral-notepad-realistic">
          <div class="spiral-rings">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <div class="np-title">Plan • Protect • Achieve</div>
          <div class="np-quote">"${item.takeaway || 'Adding an extra $150/mo to principal eliminates over $42,000 in compounding interest.'}"</div>
          <div class="np-sign">Finmatrix :)</div>
        </div>
      </div>

      <div class="macbook-wrapper">
        <div class="macbook-screen-lid">
          <div class="webcam-dot"></div>
          <div class="laptop-display-content">
            <div class="display-app-bar">
              <span class="display-app-title">🧮 ${calcHeader}</span>
              <div class="app-dots"><span></span><span></span><span></span></div>
            </div>
            <div class="calc-grid-inputs">
              <div class="input-cell"><div class="input-cell-lbl">${item.input1Label || 'Loan Amount'}</div><div class="input-cell-val">${item.input1Val || '$ 250,000'}</div></div>
              <div class="input-cell"><div class="input-cell-lbl">${item.input2Label || 'Interest Rate (%)'}</div><div class="input-cell-val">${item.input2Val || '6.5%'}</div></div>
              <div class="input-cell"><div class="input-cell-lbl">${item.input3Label || 'Loan Term'}</div><div class="input-cell-val">${item.input3Val || '30 Years'}</div></div>
              <div class="input-cell"><div class="input-cell-lbl">${item.input4Label || 'Extra Monthly'}</div><div class="input-cell-val">${item.input4Val || '+$150 / mo'}</div></div>
            </div>
            <div class="hero-payment-box">
              <div class="hero-payment-lbl">${item.heroResultLabel || 'Monthly Payment'}</div>
              <div class="hero-payment-val">${item.heroResultVal || '$1,580.74'}</div>
            </div>
            <div class="sub-summary-row">
              <div>Total Paid: <strong style="color: #0f172a;">${item.subResult1Val || '$569,064'}</strong></div>
              <div>Interest: <strong style="color: #dc2626;">${item.subResult2Val || '$319,064'}</strong></div>
            </div>
            <table class="schedule-table-preview">
              <thead><tr><th>Yr</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
              <tbody>
                <tr><td>Yr 1</td><td>$3,980</td><td>$12,236</td><td>$246,019</td></tr>
                <tr><td>Yr 2</td><td>$4,054</td><td>$12,162</td><td>$241,964</td></tr>
                <tr><td>Yr 3</td><td>$4,131</td><td>$12,085</td><td>$237,833</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="macbook-base"><div class="macbook-notch"></div></div>
      </div>
    </div>`;
  }

  // 3. ROADMAP INTENT (4-PHASE PROGRESSIVE BLUEPRINT)
  else if (intent === 'ROADMAP') {
    midHtml = `
    <div class="roadmap-stack-wrapper">
      <div class="stage-card">
        <div class="stage-num-box">01</div>
        <div class="stage-info">
          <div class="stage-header-row"><span class="stage-badge">PHASE 1: STARTER CUSHION</span><span class="stage-amount">${item.phase1Amount || '$1,000 CASH'}</span></div>
          <div class="stage-title">${item.phase1Title || 'Defensive Emergency Buffer'}</div>
          <div class="stage-desc">${item.phase1Desc || 'Stops minor unexpected emergencies from creating high-interest revolving debt.'}</div>
        </div>
      </div>
      <div class="stage-card">
        <div class="stage-num-box">02</div>
        <div class="stage-info">
          <div class="stage-header-row"><span class="stage-badge">PHASE 2: SURVIVAL AUDIT</span><span class="stage-amount">${item.phase2Amount || '1 MONTH BUFFER'}</span></div>
          <div class="stage-title">${item.phase2Title || 'Core Baseline Living Expenses'}</div>
          <div class="stage-desc">${item.phase2Desc || 'Audit essential survival costs: housing, basic groceries, utilities, and minimum debt commitments.'}</div>
        </div>
      </div>
      <div class="stage-card">
        <div class="stage-num-box">03</div>
        <div class="stage-info">
          <div class="stage-header-row"><span class="stage-badge">PHASE 3: HYSA SWEEP</span><span class="stage-amount">${item.phase3Amount || '3 MONTHS CASH'}</span></div>
          <div class="stage-title">${item.phase3Title || 'High-Yield Liquidity Shield'}</div>
          <div class="stage-desc">${item.phase3Desc || 'Transfer liquid reserves into a 5.0% APY High-Yield Savings Account for compound growth.'}</div>
        </div>
      </div>
      <div class="stage-card">
        <div class="stage-num-box">04</div>
        <div class="stage-info">
          <div class="stage-header-row"><span class="stage-badge">PHASE 4: TOTAL FORTRESS</span><span class="stage-amount">${item.phase4Amount || '6 MONTHS BUFFER'}</span></div>
          <div class="stage-title">${item.phase4Title || 'Complete Financial Sovereignty'}</div>
          <div class="stage-desc">${item.phase4Desc || 'Full cash reserve unlocked. Frees 100% of future cash flow to compound into diversified index funds.'}</div>
        </div>
      </div>
      <div class="verdict-rule-box">
        <div class="verdict-icon">🗺️</div>
        <div>
          <div class="verdict-tag">Finmatrix Blueprint Rule</div>
          <div class="verdict-text">${item.takeaway || 'Follow the order of operations strictly: Defense first, liquidity second, exponential compounding third.'}</div>
        </div>
      </div>
    </div>`;
  }

  // 4. FRAMEWORK INTENT (6-CARD DENSE GRID)
  else if (intent === 'FRAMEWORK') {
    midHtml = `
    <div class="framework-grid-wrapper">
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card1Title || '1. APR Avalanche'}</span><span class="fw-badge">${item.card1Badge || 'High Impact'}</span></div>
        <div class="fw-desc">${item.card1Desc || 'Target accounts charging >10% APR first to eliminate compounding finance charges immediately.'}</div>
      </div>
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card2Title || '2. HYSA Cash Sweep'}</span><span class="fw-badge">${item.card2Badge || '5.0% APY'}</span></div>
        <div class="fw-desc">${item.card2Desc || 'Keep cash reserves earning >4.5% APY instead of 0.01% in traditional checking accounts.'}</div>
      </div>
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card3Title || '3. 100% 401(k) Match'}</span><span class="fw-badge">${item.card3Badge || 'Guaranteed'}</span></div>
        <div class="fw-desc">${item.card3Desc || 'Capture your full employer 401(k) match. Instant, guaranteed 100% risk-free return.'}</div>
      </div>
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card4Title || '4. Bi-Weekly Pay'}</span><span class="fw-badge">${item.card4Badge || '1 Extra/Yr'}</span></div>
        <div class="fw-desc">${item.card4Desc || 'Make 26 half-payments per year. Automatically pays 1 extra full payment each year.'}</div>
      </div>
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card5Title || '5. Roth IRA Shield'}</span><span class="fw-badge">${item.card5Badge || 'Tax-Free'}</span></div>
        <div class="fw-desc">${item.card5Desc || 'Max out Roth IRA contributions to compound diversified index funds completely tax-free.'}</div>
      </div>
      <div class="framework-card">
        <div class="fw-card-head"><span class="fw-title">${item.card6Title || '6. S&P 500 Automation'}</span><span class="fw-badge">${item.card6Badge || '10% Avg'}</span></div>
        <div class="fw-desc">${item.card6Desc || 'Automate low-cost index funds. Historically doubles wealth every 7-10 years.'}</div>
      </div>
    </div>
    <div class="verdict-rule-box">
      <div class="verdict-icon">⚡</div>
      <div>
        <div class="verdict-tag">Finmatrix Master Takeaway</div>
        <div class="verdict-text">${item.takeaway || 'Automate every step. Systems remove emotional friction and guarantee mathematical execution.'}</div>
      </div>
    </div>`;
  }

  // 5. TABLE MATRIX INTENT
  else {
    midHtml = `
    <div class="matrix-layout-wrapper">
      <table class="table-full-matrix">
        <thead>
          <tr>
            <th>${item.col1 || 'Account Type'}</th>
            <th>${item.col2 || 'APY Rate'}</th>
            <th>${item.col3 || 'Liquidity Access'}</th>
            <th>${item.col4 || 'Lock Term'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Traditional Checking</td>
            <td>0.01%</td>
            <td>Instant ATM</td>
            <td>None</td>
          </tr>
          <tr>
            <td>Traditional Savings</td>
            <td>0.05%</td>
            <td>6 Withdrawals/Mo</td>
            <td>None</td>
          </tr>
          <tr class="highlighted-winner-row">
            <td>High-Yield Savings (HYSA) <span class="winner-tag">WINNER</span></td>
            <td>4.50% - 5.10%</td>
            <td>1-2 Day ACH</td>
            <td>Zero Lock</td>
          </tr>
          <tr>
            <td>12-Month CD Ladder</td>
            <td>4.75% - 5.25%</td>
            <td>Locked</td>
            <td>12 Months</td>
          </tr>
        </tbody>
      </table>

      <div class="checklist-card" style="margin-top: 14px;">
        <div class="checklist-title">Actionable Audit Rules</div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check1 || 'Sweep checking cash balances above 1 month expenses to HYSA.'}</span></div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check2 || 'Confirm FDIC / NCUA insurance up to $250,000 per depositor.'}</span></div>
        <div class="checklist-item"><div class="check-circle">✓</div><span class="check-label">${item.check3 || 'Avoid accounts charging monthly maintenance or wire fees.'}</span></div>
      </div>

      <div class="verdict-rule-box">
        <div class="verdict-icon">📊</div>
        <div>
          <div class="verdict-tag">Finmatrix Quantitative Benchmark</div>
          <div class="verdict-text">${item.summaryCallout || 'Keeping $50,000 in HYSA earns $2,550/year in interest vs just $5/year at a traditional brick-and-mortar bank.'}</div>
        </div>
      </div>
    </div>`;
  }

  const bgStyle = (intent === 'CALCULATOR')
    ? `background-image: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 20%, rgba(255,255,255,0.1) 48%, rgba(0,0,0,0.15) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80'); background-size: cover; background-position: center bottom;`
    : `background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 28%, #f8fafc 65%, #f1f5f9 100%);`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1000px;
  height: 1500px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  background: #f8fafc;
}
.pin-wrapper {
  width: 1000px;
  height: 1500px;
  padding: 34px 34px 24px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  ${bgStyle}
}

/* Header */
.top-header { text-align: center; }
.script-tag { font-family: 'Caveat', cursive; font-size: 38px; font-weight: 700; color: #0284c7; margin-bottom: 2px; }
.main-title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.02; color: #0b192c; letter-spacing: -0.5px; text-transform: uppercase; margin-bottom: 8px; }
.highlight-pill { display: inline-block; background: #facc15; color: #0f172a; padding: 8px 30px; border-radius: 999px; font-size: 22px; font-weight: 800; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.4); margin-bottom: 12px; }
.pillar-pills-row { display: flex; justify-content: center; align-items: center; gap: 20px; }
.pill-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pill-icon { width: 50px; height: 50px; border-radius: 50%; background: #ffffff; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 23px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
.pill-lbl { font-size: 12.5px; font-weight: 800; color: #334155; }

/* Middle Stage */
.mid-stage { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }

/* Comparison Matrix */
.comparison-matrix-wrapper { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: hidden; }
.comp-table-header { display: grid; grid-template-columns: 220px 1fr 1fr; background: #0f172a; color: #ffffff; padding: 16px 20px; align-items: center; }
.col-th-feature { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
.col-th-side { text-align: center; }
.th-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; line-height: 1.1; }
.th-tag-roth { display: inline-block; background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 4px; margin-top: 4px; letter-spacing: 0.5px; }
.th-tag-401k { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 4px; margin-top: 4px; letter-spacing: 0.5px; }
.comp-row { display: grid; grid-template-columns: 220px 1fr 1fr; padding: 14px 20px; align-items: center; border-bottom: 1px solid #f1f5f9; }
.comp-row:nth-child(even) { background: #f8fafc; }
.row-feature-title { font-size: 15px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.row-val-a { padding: 0 16px; text-align: center; font-size: 15.5px; font-weight: 700; color: #0369a1; line-height: 1.35; }
.row-val-b { padding: 0 16px; text-align: center; font-size: 15.5px; font-weight: 700; color: #15803d; line-height: 1.35; }
.badge-winner { background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 4px; }
.badge-highlight-blue { background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 4px; }
.row-hero-metric { background: #0b192c !important; color: #ffffff; padding: 16px 20px; }
.row-hero-metric .row-feature-title { color: #facc15; font-size: 16px; }
.row-hero-metric .row-val-a { color: #38bdf8; font-size: 26px; font-weight: 900; font-family: 'Outfit', sans-serif; }
.row-hero-metric .row-val-b { color: #4ade80; font-size: 26px; font-weight: 900; font-family: 'Outfit', sans-serif; }

/* Calculator Desk Workspace */
.workspace-stage { display: flex; justify-content: space-between; align-items: flex-end; height: 1000px; position: relative; }
.left-sidebar-stack { width: 310px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; z-index: 2; }
.checklist-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 18px; padding: 22px 18px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08); }
.checklist-title { font-family: 'Caveat', cursive; font-size: 34px; font-weight: 700; color: #0284c7; margin-bottom: 16px; line-height: 1; }
.checklist-item { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.check-circle { width: 26px; height: 26px; border-radius: 50%; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4); }
.check-label { font-size: 17px; font-weight: 800; color: #0f172a; }
.spiral-notepad-realistic { background: #fffef8; border: 1px solid #e7ddc4; border-radius: 16px; padding: 24px 20px 20px 20px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12); transform: rotate(-2deg); border-left: 8px solid #d4c39c; position: relative; }
.spiral-rings { position: absolute; top: -12px; left: 20px; right: 20px; display: flex; justify-content: space-around; }
.spiral-rings span { width: 8px; height: 22px; background: #94a3b8; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.np-title { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; color: #0284c7; margin-bottom: 8px; }
.np-quote { font-size: 15px; font-weight: 700; color: #475569; line-height: 1.45; }
.np-sign { font-family: 'Caveat', cursive; font-size: 24px; color: #10b981; font-weight: 700; margin-top: 8px; text-align: right; }
.macbook-wrapper { width: 610px; display: flex; flex-direction: column; align-items: center; z-index: 2; }
.macbook-screen-lid { width: 100%; background: #0f172a; border: 3px solid #334155; border-radius: 18px 18px 0 0; padding: 12px 12px 8px 12px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.28); }
.webcam-dot { width: 6px; height: 6px; background: #334155; border-radius: 50%; margin: 0 auto 8px auto; }
.laptop-display-content { background: #ffffff; border-radius: 8px; padding: 18px; color: #0f172a; }
.display-app-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; margin-bottom: 12px; }
.display-app-title { font-size: 15px; font-weight: 900; color: #0b192c; display: flex; align-items: center; gap: 6px; }
.app-dots span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; margin-left: 4px; }
.calc-grid-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.input-cell { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
.input-cell-lbl { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.input-cell-val { font-size: 17px; font-weight: 800; color: #0f172a; }
.hero-payment-box { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px; }
.hero-payment-lbl { font-size: 12px; font-weight: 800; color: #15803d; text-transform: uppercase; }
.hero-payment-val { font-size: 38px; font-weight: 900; color: #166534; line-height: 1.05; }
.sub-summary-row { display: flex; justify-content: space-around; background: #f8fafc; border-radius: 8px; padding: 10px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #475569; }
.schedule-table-preview { width: 100%; font-size: 12px; border-collapse: collapse; }
.schedule-table-preview th { text-align: left; padding: 6px 10px; background: #f1f5f9; color: #475569; font-weight: 800; border-radius: 4px; }
.schedule-table-preview td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #1e293b; }
.macbook-base { width: 105%; height: 14px; background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%); border-radius: 0 0 16px 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); position: relative; }
.macbook-notch { width: 80px; height: 6px; background: #475569; border-radius: 0 0 6px 6px; margin: 0 auto; }

/* Roadmap */
.roadmap-stack-wrapper { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; }
.stage-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 20px; border-left: 8px solid #0284c7; }
.stage-num-box { width: 56px; height: 56px; border-radius: 14px; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; flex-shrink: 0; }
.stage-info { flex: 1; }
.stage-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.stage-badge { font-size: 11.5px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
.stage-amount { font-size: 15px; font-weight: 800; color: #10b981; }
.stage-title { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.stage-desc { font-size: 14px; font-weight: 600; color: #64748b; line-height: 1.4; }

/* Framework Grid */
.framework-grid-wrapper { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 16px; height: 840px; }
.framework-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 18px; box-shadow: 0 8px 22px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; border-top: 6px solid #0284c7; }
.fw-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.fw-title { font-size: 18px; font-weight: 800; color: #0f172a; }
.fw-badge { background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 6px; }
.fw-desc { font-size: 14px; font-weight: 600; color: #64748b; line-height: 1.45; }

/* Table Matrix */
.matrix-layout-wrapper { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; }
.table-full-matrix { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); background: #ffffff; border: 1px solid #e2e8f0; }
.table-full-matrix th { background: #0f172a; color: #ffffff; padding: 16px 18px; font-size: 14px; font-weight: 800; text-align: left; letter-spacing: 0.5px; }
.table-full-matrix td { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14.5px; font-weight: 600; color: #334155; }
.highlighted-winner-row td { background: #f0fdf4; color: #166534; font-weight: 800; border-top: 2px solid #86efac; border-bottom: 2px solid #86efac; }
.winner-tag { background: #10b981; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; margin-left: 6px; }

/* Verdict Box & Footer */
.verdict-rule-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 16px 22px; display: flex; align-items: center; gap: 16px; color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.12); border: 1px solid #334155; }
.verdict-icon { font-size: 38px; flex-shrink: 0; }
.verdict-tag { font-size: 12px; font-weight: 800; color: #facc15; text-transform: uppercase; letter-spacing: 0.5px; }
.verdict-text { font-size: 15.5px; font-weight: 600; color: #f8fafc; line-height: 1.4; }
.bottom-banner { height: 120px; background: #070e1c; border-radius: 16px; padding: 16px 26px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 15px 35px rgba(0,0,0,0.3); border: 1px solid #1e293b; z-index: 2; }
.brand-info { display: flex; align-items: center; gap: 14px; }
.brand-logo { width: 48px; height: 48px; background: #1e293b; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.brand-title { font-family: 'Outfit', sans-serif; font-size: 25px; font-weight: 900; color: #ffffff; }
.brand-sub { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
.cta-button { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 15px; font-weight: 800; padding: 14px 24px; border-radius: 10px; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4); }
</style>
</head>
<body>
<div class="pin-wrapper">
  <div class="top-header">
    <div class="script-tag">${scriptTag}</div>
    <h1 class="main-title">${headline}</h1>
    <div class="highlight-pill">${subtitle}</div>
    <div class="pillar-pills-row">${pillsHtml}</div>
  </div>

  <div class="mid-stage">
    ${midHtml}
  </div>

  <div class="bottom-banner">
    <div class="brand-info">
      <div class="brand-logo">🧮</div>
      <div>
        <div class="brand-title">Finmatrix.cloud</div>
        <div class="brand-sub">Simple • Fast • Accurate</div>
      </div>
    </div>
    <div class="cta-button">Visit Site &amp; Calculate →</div>
  </div>
</div>
</body>
</html>`;
}

console.log('Agency-grade template compiler ready.');

async function runLiveTests() {
  console.log('Rendering 1. COMPARE (Roth IRA vs 401k)...');
  const rothHtml = generateAgencyPinHtml({
    intentType: 'COMPARE',
    pillar: 'Retirement & 401(k)',
    targetKeyword: 'difference between roth ira and 401k',
    scriptTag: 'Head-to-Head Comparison',
    headlineOnImage: 'ROTH IRA VS 401(K)',
    subtitleOnImage: 'The Mathematical Breakdown of Tax-Advantaged Wealth',
    sideATitle: 'Roth IRA', sideATag: 'POST-TAX WEALTH',
    sideBTitle: 'Traditional 401(k)', sideBTag: 'PRE-TAX COMPOUNDING',
    row1Label: 'Annual Contribution Limit', row1ValA: '$7,000 / year', row1ValB: '$23,000 / year',
    row2Label: 'Current Tax Deduction', row2ValA: 'No deduction ($0 today)', row2ValB: 'Immediate W-2 Deduction',
    row3Label: 'Company Employer Match', row3ValA: 'None available (Personal)', row3ValB: '50% - 100% Guaranteed',
    row4Label: 'Retirement Withdrawals', row4ValA: '100% TAX-FREE (0% Rate)', row4ValB: 'Taxed as Ordinary Income',
    row5Label: 'Early Access Penalty', row5ValA: 'Contributions Penalty-Free', row5ValB: '10% IRS Penalty (< 59½)',
    row6Label: 'Required Distributions (RMDs)', row6ValA: 'ZERO RMDs Ever', row6ValB: 'Mandatory at Age 73',
    row7Label: 'Optimal Tax Strategy', row7ValA: 'Lower bracket now (Younger)', row7ValB: 'Peak earning years today',
    metricNumA: '$1,480,000', metricNumB: '$2,140,000',
    verdictText: 'Capture 100% of employer 401(k) match first (guaranteed free return), then max out Roth IRA for permanent tax-free growth.'
  });
  const res1 = await renderOnVps(rothHtml);
  console.log('1. Roth URL:', res1.url);
  await downloadImage(res1.url, 'final-roth-vs-401k.jpg');

  console.log('Rendering 2. CALCULATOR (Amortization Calculator)...');
  const amortHtml = generateAgencyPinHtml({
    intentType: 'CALCULATOR',
    pillar: 'Mortgage & Real Estate',
    targetKeyword: 'amortization calculator monthly payment',
    scriptTag: 'Free & Easy to Use',
    headlineOnImage: 'AMORTIZATION CALCULATOR',
    subtitleOnImage: 'Calculate Your Monthly Loan Payment & Interest',
    calcHeaderTitle: 'Finmatrix Amortization Engine',
    input1Label: 'Loan Amount', input1Val: '$ 250,000',
    input2Label: 'Interest Rate (%)', input2Val: '6.5% Fixed',
    input3Label: 'Loan Term', input3Val: '30 Years',
    input4Label: 'Extra Payment', input4Val: '+$150 / mo',
    heroResultLabel: 'Monthly Payment', heroResultVal: '$1,580.74',
    subResult1Val: '$569,064 Total', subResult2Val: '$319,064 Interest',
    check1: 'Monthly Payment', check2: 'Total Interest Calculation',
    check3: 'Loan Principal Balance', check4: 'Full Amortization Schedule',
    takeaway: 'Adding just $150 extra per month to principal eliminates over $42,000 in compounding interest and pays off the loan 4.5 years earlier.'
  });
  const res2 = await renderOnVps(amortHtml);
  console.log('2. Amortization URL:', res2.url);
  await downloadImage(res2.url, 'final-amortization-calc.jpg');

  console.log('Rendering 3. ROADMAP (Emergency Fund Blueprint)...');
  const roadHtml = generateAgencyPinHtml({
    intentType: 'ROADMAP',
    pillar: 'Savings & CDs',
    targetKeyword: 'emergency fund blueprint 3 to 6 months',
    scriptTag: 'Step-by-Step Blueprint',
    headlineOnImage: 'EMERGENCY FUND BLUEPRINT',
    subtitleOnImage: 'How to Build a 3 to 6-Month Cash Buffer from Scratch',
    phase1Title: 'Defensive Starter Buffer', phase1Amount: '$1,000 CASH', phase1Desc: 'Prevents unexpected minor emergencies from creating high-interest revolving credit card debt.',
    phase2Title: 'Baseline Survival Audit', phase2Amount: '1 MONTH BUFFER', phase2Desc: 'Calculate absolute essential minimum monthly living costs: housing, basic groceries, and utilities.',
    phase3Title: 'High-Yield Liquidity Sweep', phase3Amount: '3 MONTHS CASH', phase3Desc: 'Transfer cash reserves to a 5.0% APY High-Yield Savings Account to earn risk-free compound yield.',
    phase4Title: 'Total Wealth Fortress', phase4Amount: '6 MONTHS BUFFER', phase4Desc: 'Full cash reserve unlocked. Frees 100% of future cash flow to compound into diversified index funds.',
    takeaway: 'Order of operations matters: Defense first, liquid cash reserves second, exponential investing third.'
  });
  const res3 = await renderOnVps(roadHtml);
  console.log('3. Roadmap URL:', res3.url);
  await downloadImage(res3.url, 'final-roadmap-blueprint.jpg');

  console.log('Rendering 4. FRAMEWORK (6 Levers to Build Wealth)...');
  const fwHtml = generateAgencyPinHtml({
    intentType: 'FRAMEWORK',
    pillar: 'Savings & CDs',
    targetKeyword: '6 levers to build wealth faster',
    scriptTag: 'Editorial Wealth Framework',
    headlineOnImage: '6 LEVERS TO BUILD WEALTH',
    subtitleOnImage: 'The Quantitative Blueprint for Exponential Net Worth',
    card1Title: '1. APR Avalanche', card1Badge: 'High Impact', card1Desc: 'Target accounts charging >10% APR first to eliminate compounding finance charges immediately.',
    card2Title: '2. HYSA Cash Sweep', card2Badge: '5.0% APY', card2Desc: 'Keep cash reserves earning >4.5% APY instead of 0.01% in traditional checking accounts.',
    card3Title: '3. 100% 401(k) Match', card3Badge: 'Guaranteed', card3Desc: 'Capture your full employer 401(k) match. Instant, guaranteed 100% risk-free return.',
    card4Title: '4. Bi-Weekly Pay', card4Badge: '1 Extra/Yr', card4Desc: 'Make 26 half-payments per year. Automatically pays 1 extra full payment each year.',
    card5Title: '5. Roth IRA Shield', card5Badge: 'Tax-Free', card5Desc: 'Max out Roth IRA contributions to compound diversified index funds completely tax-free.',
    card6Title: '6. S&P 500 Automation', card6Badge: '10% Avg', card6Desc: 'Automate low-cost index funds. Historically doubles wealth every 7-10 years.',
    takeaway: 'Automate every step. Systems remove emotional friction and guarantee mathematical execution.'
  });
  const res4 = await renderOnVps(fwHtml);
  console.log('4. Framework URL:', res4.url);
  await downloadImage(res4.url, 'final-framework-levers.jpg');

  console.log('Rendering 5. TABLE MATRIX (HYSA vs CD Rates)...');
  const tblHtml = generateAgencyPinHtml({
    intentType: 'TABLE_CHECKLIST',
    pillar: 'Savings & CDs',
    targetKeyword: 'hysa vs cd calculator rates',
    scriptTag: 'Official Rate Matrix',
    headlineOnImage: 'HYSA VS CD RATES MATRIX',
    subtitleOnImage: 'Where to Park Your Cash for Maximum Yield in 2026',
    col1: 'Account Type', col2: 'APY Rate', col3: 'Liquidity Access', col4: 'Lock Term',
    check1: 'Sweep checking cash balances above 1 month expenses to HYSA.',
    check2: 'Confirm FDIC / NCUA insurance up to $250,000 per depositor.',
    check3: 'Avoid accounts charging monthly maintenance or wire fees.',
    summaryCallout: 'Keeping $50,000 in HYSA earns $2,550/year in interest vs just $5/year at a traditional brick-and-mortar bank.'
  });
  const res5 = await renderOnVps(tblHtml);
  console.log('5. Table Matrix URL:', res5.url);
  await downloadImage(res5.url, 'final-table-matrix.jpg');

  console.log('ALL 5 AGENCY-GRADE PINS RENDERED ON VPS!');
}

runLiveTests();

