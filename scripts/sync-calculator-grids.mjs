import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const calcsPath = path.join(ROOT_DIR, 'config', 'calculators.json');
const calcs = JSON.parse(fs.readFileSync(calcsPath, 'utf8'));

function createCard(c) {
  const popularClass = c.popular ? 'card-popular' : '';
  const badgeClass = c.popular ? 'orange' : '';
  const icon = c.icon || '🧮';
  const title = c.shortName || c.name;
  const badge = c.badge || c.category;

  return `      <a href="${c.url}" class="card ${popularClass}" data-category="${c.category}" data-id="${c.id}">
        <div class="card-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${c.description}</p>
        <div class="card-footer">
          <span class="chip ${badgeClass}">${badge}</span>
          <span style="color:var(--accent);font-weight:700;">Calculate →</span>
        </div>
      </a>`;
}

// 1. Update calculators/index.html
const calcIndexPath = path.join(ROOT_DIR, 'calculators', 'index.html');
if (fs.existsSync(calcIndexPath)) {
  let content = fs.readFileSync(calcIndexPath, 'utf8');
  const allCardsHtml = calcs.map(createCard).join('\n\n');
  const startMarker = '<div class="cards-grid" id="all-calculators-grid">';
  const footerMarker = '<!-- ══ FOOTER ══ -->';
  
  const startIdx = content.indexOf(startMarker);
  const footerIdx = content.indexOf(footerMarker);

  if (startIdx !== -1 && footerIdx !== -1) {
    const sectionEndIdx = content.lastIndexOf('</section>', footerIdx);
    const divEndIdx = content.lastIndexOf('</div>', sectionEndIdx);
    const containerDivEndIdx = content.lastIndexOf('</div>', divEndIdx - 1);

    content = content.substring(0, startIdx + startMarker.length) +
              '\n' + allCardsHtml + '\n    ' +
              content.substring(containerDivEndIdx);
    
    // Ensure search.js has cache-buster
    content = content.replace(/\/js\/search\.js(\?v=[^"']*)?/, '/js/search.js?v=20261106_4');
    fs.writeFileSync(calcIndexPath, content, 'utf8');
    console.log(`[OK] Pre-rendered ${calcs.length} cards in calculators/index.html`);
  } else {
    console.warn('[WARN] Markers not found in calculators/index.html', { startIdx, footerIdx });
  }
}

// 2. Update calculators/loans/index.html
const loansIndexPath = path.join(ROOT_DIR, 'calculators', 'loans', 'index.html');
if (fs.existsSync(loansIndexPath)) {
  let content = fs.readFileSync(loansIndexPath, 'utf8');
  const loanCalcs = calcs.filter(c => c.category === 'loans');
  const loanCardsHtml = loanCalcs.map(createCard).join('\n\n');
  const startMarker = '<div class="cards-grid" id="category-tools-grid">';
  const endMarker = '</div>\n\n    <!-- Hub Internal Linking Bar -->';
  
  const startIdx = content.indexOf(startMarker);
  let endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    // Try alternate whitespace
    const altMarker = '<!-- Hub Internal Linking Bar -->';
    const altIdx = content.indexOf(altMarker, startIdx);
    if (altIdx !== -1) {
      const prevDiv = content.lastIndexOf('</div>', altIdx);
      if (prevDiv !== -1) endIdx = prevDiv;
    }
  }

  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx + startMarker.length) +
              '\n' + loanCardsHtml + '\n    ' +
              content.substring(endIdx);
    fs.writeFileSync(loansIndexPath, content, 'utf8');
    console.log(`[OK] Pre-rendered ${loanCalcs.length} cards in calculators/loans/index.html`);
  } else {
    console.warn('[WARN] Markers not found in calculators/loans/index.html', { startIdx, endIdx });
  }
}

// 3. Update js/search.js with cache: 'no-store' and embedded registry fallback
const searchJsPath = path.join(ROOT_DIR, 'js', 'search.js');
if (fs.existsSync(searchJsPath)) {
  let content = fs.readFileSync(searchJsPath, 'utf8');
  const embeddedData = JSON.stringify(calcs);
  
  const newLoadFunc = `  const EMBEDDED_CALCULATORS = ${embeddedData};
  let calculatorsData = EMBEDDED_CALCULATORS;

  async function loadCalculators() {
    try {
      const res = await fetch('/config/calculators.json?v=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        calculatorsData = await res.json();
        return calculatorsData;
      }
    } catch (e) {
      // Fallback to embedded
    }
    return calculatorsData || EMBEDDED_CALCULATORS;
  }`;

  const loadRegex = /let calculatorsData = null;[\s\S]*?return window\.FINMATRIX_CALCULATORS \|\| \[\];\s*\}/;
  if (loadRegex.test(content)) {
    content = content.replace(loadRegex, newLoadFunc);
    fs.writeFileSync(searchJsPath, content, 'utf8');
    console.log('[OK] Updated js/search.js with embedded registry & cache: no-store');
  } else if (content.includes('EMBEDDED_CALCULATORS')) {
    // Already updated, refresh embedded data
    const refreshRegex = /const EMBEDDED_CALCULATORS = \[[\s\S]*?\];/;
    content = content.replace(refreshRegex, `const EMBEDDED_CALCULATORS = ${embeddedData};`);
    fs.writeFileSync(searchJsPath, content, 'utf8');
    console.log('[OK] Refreshed EMBEDDED_CALCULATORS in js/search.js');
  }
}

console.log('Done syncing calculator grids.');
