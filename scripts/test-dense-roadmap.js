import http from 'http';
import fs from 'fs';
import { generateAgencyPinHtml } from './build-and-verify-final-engine.js';

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

// Master Ultra-Dense Layouts
function buildUltraDensePin(type) {
  if (type === 'ROADMAP') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1000px; height: 1500px; font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; background: #f8fafc; }
.pin-wrapper { width: 1000px; height: 1500px; padding: 34px 34px 24px 34px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 28%, #f8fafc 65%, #f1f5f9 100%); }
.top-header { text-align: center; }
.script-tag { font-family: 'Caveat', cursive; font-size: 38px; font-weight: 700; color: #0284c7; margin-bottom: 2px; }
.main-title { font-family: 'Outfit', sans-serif; font-size: 64px; font-weight: 900; line-height: 1.02; color: #0b192c; letter-spacing: -0.5px; text-transform: uppercase; margin-bottom: 8px; }
.highlight-pill { display: inline-block; background: #facc15; color: #0f172a; padding: 8px 30px; border-radius: 999px; font-size: 22px; font-weight: 800; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.4); margin-bottom: 12px; }
.pillar-pills-row { display: flex; justify-content: center; align-items: center; gap: 20px; }
.pill-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pill-icon { width: 50px; height: 50px; border-radius: 50%; background: #ffffff; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 23px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
.pill-lbl { font-size: 12.5px; font-weight: 800; color: #334155; }

.roadmap-stack-wrapper { height: 1000px; display: flex; flex-direction: column; justify-content: space-between; }
.stage-card-dense { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 22px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: flex; gap: 22px; border-left: 8px solid #0284c7; }
.stage-num-box { width: 68px; height: 68px; border-radius: 16px; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; flex-shrink: 0; box-shadow: 0 6px 16px rgba(15,23,42,0.3); }
.stage-info { flex: 1; }
.stage-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.stage-badge { font-size: 13px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
.stage-amount { font-size: 18px; font-weight: 900; color: #10b981; background: #dcfce7; padding: 4px 12px; border-radius: 6px; }
.stage-title { font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
.stage-desc { font-size: 15px; font-weight: 600; color: #475569; line-height: 1.45; margin-bottom: 8px; }
.stage-action-row { display: flex; gap: 20px; font-size: 13.5px; font-weight: 700; color: #1e293b; }
.stage-action-item { display: flex; align-items: center; gap: 6px; }
.action-check { color: #10b981; font-weight: 900; }

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
    <div class="script-tag">Step-by-Step Blueprint</div>
    <h1 class="main-title">EMERGENCY FUND BLUEPRINT</h1>
    <div class="highlight-pill">How to Build a 3 to 6-Month Cash Fortress from Scratch</div>
    <div class="pillar-pills-row">
      <div class="pill-item"><div class="pill-icon">💰</div><span class="pill-lbl">HYSA 5.0%</span></div>
      <div class="pill-item"><div class="pill-icon">📜</div><span class="pill-lbl">12-Mo CD</span></div>
      <div class="pill-item"><div class="pill-icon">🛡️</div><span class="pill-lbl">Emergency</span></div>
      <div class="pill-item"><div class="pill-icon">💧</div><span class="pill-lbl">Cash Sweep</span></div>
      <div class="pill-item"><div class="pill-icon">📈</div><span class="pill-lbl">S&amp;P 500</span></div>
    </div>
  </div>

  <div class="roadmap-stack-wrapper">
    <div class="stage-card-dense">
      <div class="stage-num-box">01</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 1: STARTER DEFENSE</span><span class="stage-amount">$1,000 CASH</span></div>
        <div class="stage-title">Defensive Starter Cushion</div>
        <div class="stage-desc">Stops minor unexpected emergencies (flat tires, urgent dental, broken appliances) from creating new 24% APR revolving debt.</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> Target: Save in 30 days</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Location: Dedicated sub-savings account</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Rule: Zero debit card attached</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">02</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 2: SURVIVAL AUDIT</span><span class="stage-amount">1 MONTH BUFFER</span></div>
        <div class="stage-title">Baseline Survival Audit</div>
        <div class="stage-desc">Calculate your absolute minimum survival baseline: housing, groceries, utilities, and minimum debt payments only. Zero luxury.</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> Eliminate subscriptions</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Audit last 90 days expenses</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Calculate exact daily burn rate</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">03</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 3: HYSA SWEEP</span><span class="stage-amount">3 MONTHS CASH</span></div>
        <div class="stage-title">High-Yield Liquidity Shield</div>
        <div class="stage-desc">Transfer reserves to a 5.0% APY High-Yield Savings Account. Earn risk-free compounding interest while keeping 1-2 day liquidity.</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> FDIC insured to $250k</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Zero maintenance fees</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Earns $1,250+/yr on $25,000 cash</div>
        </div>
      </div>
    </div>

    <div class="stage-card-dense">
      <div class="stage-num-box">04</div>
      <div class="stage-info">
        <div class="stage-header-row"><span class="stage-badge">PHASE 4: TOTAL FORTRESS</span><span class="stage-amount">6 MONTHS BUFFER</span></div>
        <div class="stage-title">Complete Financial Sovereignty</div>
        <div class="stage-desc">Full cash reserve unlocked. You are completely immune to job loss, medical emergencies, or market crashes. All future cash flow goes to index funds.</div>
        <div class="stage-action-row">
          <div class="stage-action-item"><span class="action-check">✓</span> 100% Peace of mind</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Unlock maximum risk tolerance</div>
          <div class="stage-action-item"><span class="action-check">✓</span> Automate index fund compounding</div>
        </div>
      </div>
    </div>

    <div class="verdict-rule-box">
      <div class="verdict-icon">🗺️</div>
      <div>
        <div class="verdict-tag">Finmatrix Blueprint Rule</div>
        <div class="verdict-text">Follow the order of operations strictly: Starter cushion first, survival baseline second, liquid HYSA third, exponential compounding fourth.</div>
      </div>
    </div>
  </div>

  <div class="bottom-banner">
    <div class="brand-info">
      <div class="brand-logo">🧮</div>
      <div>
        <div class="brand-title">Finmatrix.cloud</div>
        <div class="brand-sub">Simple • Fast • Accurate</div>
      </div>
    </div>
    <div class="cta-button">Build Your Blueprint →</div>
  </div>
</div>
</body>
</html>`;
  }
}

async function testRoadmap() {
  console.log('Rendering Dense Roadmap...');
  const res = await renderOnVps(buildUltraDensePin('ROADMAP'));
  console.log('Dense Roadmap URL:', res.url);
  await downloadImage(res.url, 'ultra-dense-roadmap.jpg');
}

testRoadmap();
