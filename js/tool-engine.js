/**
 * Finmatrix Tool Engine
 * Provides shareable URL encoding/decoding, contextual affiliate partner boxes,
 * zero-CLS ad container slots, and related tools chains across all calculator pages.
 */

(function() {
  let siteConfig = null;
  let affiliatesConfig = null;
  let calculatorsList = null;

  async function loadConfigs() {
    try {
      if (!siteConfig) {
        const res = await fetch('/config/site.json');
        if (res.ok) siteConfig = await res.json();
      }
      if (!affiliatesConfig) {
        const res = await fetch('/config/affiliates.json');
        if (res.ok) affiliatesConfig = await res.json();
      }
      if (!calculatorsList) {
        const res = await fetch('/config/calculators.json');
        if (res.ok) calculatorsList = await res.json();
      }
    } catch (e) {
      console.warn('Config fetch error, using fallbacks', e);
    }
  }

  // 1. Shareable URL: Read query parameters on page load and populate inputs
  function restoreInputsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return false;

    let modified = false;
    params.forEach((value, key) => {
      const el = document.getElementById(key);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = value === '1' || value === 'true';
        } else {
          el.value = value;
        }
        modified = true;
      }
    });
    return modified;
  }

  // Generate shareable link from current input IDs
  function getShareableUrl(inputIds = []) {
    const params = new URLSearchParams();
    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value !== undefined && el.value !== '') {
        params.set(id, el.value);
      }
    });
    const base = window.location.origin + window.location.pathname;
    return params.toString() ? `${base}?${params.toString()}` : base;
  }

  function copyShareableLink(inputIds = [], btnElement) {
    const url = getShareableUrl(inputIds);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        if (btnElement) {
          const original = btnElement.innerHTML;
          btnElement.innerHTML = '✓ Link Copied!';
          setTimeout(() => { btnElement.innerHTML = original; }, 2000);
        } else {
          alert('Shareable link copied to clipboard:\n' + url);
        }
      }).catch(() => {
        prompt('Copy this shareable link:', url);
      });
    } else {
      prompt('Copy this shareable link:', url);
    }
  }

  // 2. Contextual Affiliate Result Box (Phase 5)
  async function renderAffiliateResultBox(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await loadConfigs();
    if (!affiliatesConfig || !affiliatesConfig.offers) return;

    // Auto-detect category from data attribute if not passed
    const targetCategory = category || container.getAttribute('data-category') || 'hysa';

    // Check dev flag
    const urlParams = new URLSearchParams(window.location.search);
    const devMonetization = urlParams.get('dev_monetization') === 'true' || (siteConfig && siteConfig.monetization && siteConfig.monetization.dev_mode);

    // Match offer with alias fallback
    let offer = affiliatesConfig.offers.find(o => o.category === targetCategory);
    if (!offer) {
      const aliases = {
        'savings-investing': 'investing',
        'loan': 'personal-loan',
        'auto-loan': 'personal-loan',
        'debt': 'balance-transfer',
        'debt-payoff': 'balance-transfer',
        'housing': 'mortgage',
        'income-tax': 'tax-software'
      };
      const fallbackCat = aliases[targetCategory];
      if (fallbackCat) {
        offer = affiliatesConfig.offers.find(o => o.category === fallbackCat);
      }
    }
    if (!offer) return;

    const isPlaceholder = offer.url.includes('example.com') || offer.url.includes('REPLACE_ME');

    // Only render in production if URL is real, OR in dev mode
    if (isPlaceholder && !devMonetization) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="affiliate-result-box" style="background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius);padding:20px;margin-top:24px;position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="chip orange" style="font-size:0.75rem;">${offer.badge || 'Recommended Partner'}</span>
            <strong style="font-size:1rem;color:var(--text);">${offer.label}</strong>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);cursor:pointer;" onclick="alert('${affiliatesConfig.default_disclosure || ''}')">ⓘ Advertiser Disclosure</span>
        </div>
        <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:14px;">${offer.tagline}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:0.78rem;color:var(--text-muted);max-width:440px;">${offer.disclosure || ''}</div>
          <a href="${offer.url}" target="_blank" rel="sponsored nofollow noopener" class="btn-primary" style="padding:10px 20px;font-size:0.88rem;text-decoration:none;">${offer.cta || 'Learn More →'}</a>
        </div>
      </div>
    `;
  }

  // 3. Ad Container Slot (Phase 5 - Zero CLS)
  async function renderAdSlot(containerId, slotName = 'responsive-ad') {
    const container = document.getElementById(containerId);
    if (!container) return;

    await loadConfigs();
    const adsEnabled = siteConfig && siteConfig.monetization && siteConfig.monetization.ads && siteConfig.monetization.ads.enabled;

    if (!adsEnabled) {
      // Reserved fixed non-shifting placeholder space or empty
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="finmatrix-ad-slot" style="min-height:90px;background:var(--bg2);border:1px dashed var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.75rem;margin:24px 0;">
        <span>Advertisement Area</span>
      </div>
    `;
  }

  // 4. Related Calculators & Next Step Chain (Phase 2 & 3)
  async function renderRelatedCalculators(containerId, currentId, relatedIds = [], nextStepConfig = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await loadConfigs();
    if (!calculatorsList) return;

    let related = [];
    if (relatedIds.length > 0) {
      related = calculatorsList.filter(c => relatedIds.includes(c.id));
    } else {
      // Fallback: pick tools in same category
      const current = calculatorsList.find(c => c.id === currentId);
      if (current) {
        related = calculatorsList.filter(c => c.category === current.category && c.id !== currentId).slice(0, 3);
      }
    }

    let nextStepHtml = '';
    if (nextStepConfig) {
      nextStepHtml = `
        <div style="background:linear-gradient(135deg,rgba(0,212,170,0.08),rgba(0,152,255,0.08));border:1px solid var(--accent);border-radius:var(--radius);padding:20px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.5px;">Recommended Next Step</div>
            <div style="font-size:1.05rem;font-weight:800;color:var(--text);margin:2px 0;">${nextStepConfig.title}</div>
            <div style="font-size:0.86rem;color:var(--text-muted);">${nextStepConfig.desc}</div>
          </div>
          <a href="${nextStepConfig.url}" class="btn-primary" style="padding:10px 18px;font-size:0.85rem;text-decoration:none;">${nextStepConfig.cta || 'Open Calculator →'}</a>
        </div>
      `;
    }

    const cardsHtml = related.map(c => `
      <a href="${c.url}" class="card" style="padding:16px;">
        <div class="card-icon" style="font-size:1.5rem;margin-bottom:6px;">${c.icon}</div>
        <h4 style="font-size:0.95rem;margin-bottom:6px;">${c.shortName || c.name}</h4>
        <p style="font-size:0.8rem;line-height:1.4;margin-bottom:10px;">${c.description}</p>
        <span style="color:var(--accent);font-size:0.8rem;font-weight:700;">Calculate →</span>
      </a>
    `).join('');

    container.innerHTML = `
      ${nextStepHtml}
      <h3 style="font-size:1.15rem;font-weight:800;margin-bottom:14px;">Related Financial Calculators</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
        ${cardsHtml}
      </div>
    `;
  }

  const engine = {
    loadConfigs,
    restoreInputsFromUrl,
    initParams: restoreInputsFromUrl,
    getShareableUrl,
    copyShareableLink,
    copyShareUrl: function() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Shareable calculation link copied to clipboard!');
        }).catch(() => {
          prompt('Copy this calculation link:', window.location.href);
        });
      } else {
        prompt('Copy this calculation link:', window.location.href);
      }
    },
    updateUrl: function(paramsObj) {
      if (!paramsObj || typeof paramsObj !== 'object') return;
      const params = new URLSearchParams();
      Object.keys(paramsObj).forEach(k => {
        if (paramsObj[k] !== undefined && paramsObj[k] !== null && paramsObj[k] !== '') {
          params.set(k, paramsObj[k]);
        }
      });
      const queryStr = params.toString();
      const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    },
    initAffiliateBox: function(containerId, category) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const cat = category || container.getAttribute('data-category');
      renderAffiliateResultBox(containerId, cat);
    },
    initAdSlot: function(containerId, slotName) {
      renderAdSlot(containerId, slotName);
    },
    renderAffiliateResultBox,
    renderAdSlot,
    renderRelatedCalculators
  };

  window.FinmatrixEngine = engine;
  window.FinmatrixToolEngine = engine;
})();
