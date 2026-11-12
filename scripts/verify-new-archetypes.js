import http from 'http';
import fs from 'fs';

// Extract Node 8 code from the workflow JSON and simulate rendering
const raw = fs.readFileSync('workflows/finmatrix-pinterest-marketing-automation.json', 'utf8');
const data = JSON.parse(raw);
const n8 = data.nodes.find(n => n.name.includes('Finmatrix Studio Engine'));
const n8Code = n8.parameters.jsCode;

function testRender(html, name) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ html, viewport_width: 1000, viewport_height: 1500, ms_delay: 800 });
    const req = http.request('http://31.97.232.154:3000/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[${name}] Status ${res.statusCode}:`, body);
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.url);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.write(postData);
    req.end();
  });
}

function generatePinHtml(mockInput) {
  try {
    const runner = new Function('$json', n8Code);
    const result = runner(mockInput);
    if (Array.isArray(result) && result[0]?.json?.pinHtml) {
      return result[0].json.pinHtml;
    }
    return result;
  } catch (err) {
    console.error('generatePinHtml failed:', err.message);
    return null;
  }
}

async function main() {
  console.log('Testing Live VPS Rendering for New Archetypes...');

  // 1. Mobile App
  const mobileHtml = generatePinHtml({
    pinStyle: 'ARCH_MOBILE_APP',
    paletteTheme: 'PALETTE_ROYAL_NAVY_GOLD',
    headlineOnImage: 'Debt Payoff App',
    subtitleOnImage: 'Automate your avalanche payoff schedule',
    heroResultLabel: 'Accelerated Payoff Date',
    heroResultVal: '28 Months',
    input1Val: '$25,000',
    input2Val: '18.5%'
  });
  await testRender(mobileHtml, 'MOBILE_APP');

  // 2. Bento Metrics Grid
  const bentoHtml = generatePinHtml({
    pinStyle: 'ARCH_BENTO_METRICS',
    paletteTheme: 'PALETTE_CARBON_SLATE',
    headlineOnImage: 'Mortgage Break-Even Analysis',
    subtitleOnImage: 'When does refinancing mathematically save money?',
    heroResultVal: '$42,500 Saved',
    heroResultLabel: 'Net Projected Savings',
    input1Val: '$380,000',
    input2Val: '6.2% APR',
    subResult2Val: '$1,850/mo',
    takeaway: 'Refinancing at 1% lower rate pays for closing costs in 14 months.'
  });
  await testRender(bentoHtml, 'BENTO_METRICS');

  // 3. Before vs After
  const baHtml = generatePinHtml({
    pinStyle: 'ARCH_BEFORE_AFTER',
    paletteTheme: 'PALETTE_EMERALD_WEALTH',
    headlineOnImage: 'Credit Card Debt Trap vs Avalanche',
    subtitleOnImage: 'The mathematical difference between minimums and avalanche'
  });
  await testRender(baHtml, 'BEFORE_AFTER');

  // 4. Schedule Bars
  const schedHtml = generatePinHtml({
    pinStyle: 'ARCH_SCHEDULE_BARS',
    paletteTheme: 'PALETTE_MIDNIGHT_AMETHYST',
    headlineOnImage: '24-Month Payoff Progress Tracker',
    subtitleOnImage: 'Watch your principal debt melt to zero'
  });
  await testRender(schedHtml, 'SCHEDULE_BARS');

  console.log('Finished testing new archetypes.');
}

main();
