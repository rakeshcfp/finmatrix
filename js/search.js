/* Finmatrix — Real-time Search Engine & Calculator Directory Handler */

(function() {
  let calculatorsData = null;

  async function loadCalculators() {
    if (calculatorsData) return calculatorsData;
    try {
      const res = await fetch('/config/calculators.json');
      if (res.ok) {
        calculatorsData = await res.json();
        return calculatorsData;
      }
    } catch (e) {
      console.warn('Failed to fetch /config/calculators.json, falling back to local registry', e);
    }
    // Fallback registry in case of static file:// testing
    return window.FINMATRIX_CALCULATORS || [];
  }

  function createCalculatorCard(calc) {
    return `
      <a href="${calc.url}" class="card ${calc.popular ? 'card-popular' : ''}" data-category="${calc.category}" data-id="${calc.id}">
        <div class="card-icon">${calc.icon || '🧮'}</div>
        <h3>${calc.shortName || calc.name}</h3>
        <p>${calc.description}</p>
        <div class="card-footer">
          <span class="chip ${calc.popular ? 'orange' : ''}">${calc.badge || calc.category}</span>
          <span style="color:var(--accent);font-weight:700;">Calculate →</span>
        </div>
      </a>
    `;
  }

  // Initialize Search & Filter Bar
  async function initSearch(inputId, resultsContainerId, options = {}) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(resultsContainerId);
    if (!input || !container) return;

    const tools = await loadCalculators();

    function performFilter() {
      const query = input.value.trim().toLowerCase();
      const categoryFilter = options.category || null;

      let filtered = tools.filter(tool => {
        if (categoryFilter && tool.category !== categoryFilter) return false;
        if (!query) return true;

        const matchName = (tool.name || '').toLowerCase().includes(query);
        const matchShort = (tool.shortName || '').toLowerCase().includes(query);
        const matchDesc = (tool.description || '').toLowerCase().includes(query);
        const matchCat = (tool.category || '').toLowerCase().includes(query);
        const matchKw = (tool.keywords || []).some(k => k.toLowerCase().includes(query));

        return matchName || matchShort || matchDesc || matchCat || matchKw;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding:40px 20px; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius);">
            <div style="font-size:2rem; margin-bottom:10px;">🔍</div>
            <h3 style="margin-bottom:8px;">No matching calculators found</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Try searching for terms like "paycheck", "avalanche", "mortgage", "tax", or "refinance".</p>
            <button type="button" class="btn-ghost" onclick="document.getElementById('${inputId}').value=''; document.getElementById('${inputId}').dispatchEvent(new Event('input'));" style="margin-top:12px;">Reset Search</button>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(createCalculatorCard).join('');
      }

      const counterEl = document.getElementById(options.counterId);
      if (counterEl) {
        counterEl.textContent = `${filtered.length} Calculator${filtered.length === 1 ? '' : 's'}`;
      }
    }

    input.addEventListener('input', performFilter);

    // Check URL Search Params for ?q=... or ?category=...
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      input.value = q;
    }
    performFilter();
  }

  // Render Popular Calculators Grid (for Homepage & Hubs)
  async function renderPopularCalculators(containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tools = await loadCalculators();
    const popular = tools.filter(t => t.popular).slice(0, limit);
    container.innerHTML = popular.map(createCalculatorCard).join('');
  }

  // Render Category Hub Tools
  async function renderCategoryTools(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tools = await loadCalculators();
    const catTools = tools.filter(t => t.category === category);
    container.innerHTML = catTools.map(createCalculatorCard).join('');
  }

  window.FinmatrixSearch = {
    loadCalculators,
    initSearch,
    renderPopularCalculators,
    renderCategoryTools
  };
})();
