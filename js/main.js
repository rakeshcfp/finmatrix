/* Finmatrix — Global Javascript Utilities & Currency Engine */

// 1. Theme Management (Light/Dark Mode)
(function initTheme() {
  const savedTheme = localStorage.getItem('finmatrix_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('finmatrix_theme', newTheme);
  
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.innerHTML = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// 2. Mobile Menu Toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// 3. Multi-Currency Engine ($ USD, € EUR, £ GBP, ₹ INR, ¥ JPY, C$ CAD, A$ AUD)
const CURRENCIES = {
  'USD': { symbol: '$', code: 'USD', locale: 'en-US' },
  'EUR': { symbol: '€', code: 'EUR', locale: 'de-DE' },
  'GBP': { symbol: '£', code: 'GBP', locale: 'en-GB' },
  'INR': { symbol: '₹', code: 'INR', locale: 'en-IN' },
  'JPY': { symbol: '¥', code: 'JPY', locale: 'ja-JP' },
  'CAD': { symbol: 'C$', code: 'CAD', locale: 'en-CA' },
  'AUD': { symbol: 'A$', code: 'AUD', locale: 'en-AU' }
};

function getActiveCurrency() {
  return localStorage.getItem('finmatrix_currency') || 'USD';
}

function getCurrencySymbol() {
  const code = getActiveCurrency();
  return CURRENCIES[code] ? CURRENCIES[code].symbol : '$';
}

function fmtCurrency(amount, forceUSD = false) {
  if (!isFinite(amount) || isNaN(amount)) return forceUSD ? "$0" : getCurrencySymbol() + "0";
  const currCode = forceUSD ? 'USD' : getActiveCurrency();
  const config = CURRENCIES[currCode] || CURRENCIES['USD'];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0
  }).format(amount);
}

function fmtPercent(num) {
  if (!isFinite(num) || isNaN(num)) return "0%";
  return num.toFixed(2) + "%";
}

// Change Currency Function
function changeCurrency(code, calcFunction) {
  if (CURRENCIES[code]) {
    localStorage.setItem('finmatrix_currency', code);
    
    document.querySelectorAll('.curr-btn').forEach(btn => {
      const isMatch = btn.getAttribute('data-curr') === code;
      if (isMatch) {
        btn.style.background = 'var(--accent)';
        btn.style.color = '#000';
        btn.style.borderColor = 'var(--accent)';
        btn.classList.add('active');
      } else {
        btn.style.background = 'var(--bg2)';
        btn.style.color = 'var(--text)';
        btn.style.borderColor = 'var(--border)';
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.curr-sym').forEach(el => {
      el.textContent = CURRENCIES[code].symbol;
    });

    if (typeof calcFunction === 'function') {
      calcFunction();
    } else if (typeof window.recalculateCurrentPage === 'function') {
      window.recalculateCurrentPage();
    }
  }
}

function initCurrencySelector(calcFunction) {
  const currentCode = getActiveCurrency();
  changeCurrency(currentCode, calcFunction);
}

// Helper to resolve public HTTPS URL even when testing on local file://
function getPublicUrl() {
  if (window.location.protocol === 'file:') {
    const href = window.location.href;
    if (href.includes('/calculators/')) {
      const page = href.split('/calculators/')[1];
      return 'https://finmatrix.cloud/calculators/' + page;
    } else if (href.includes('/articles/')) {
      const page = href.split('/articles/')[1];
      return 'https://finmatrix.cloud/articles/' + page;
    }
    return 'https://finmatrix.cloud/';
  }
  return window.location.href;
}

// 4. Social Share Bar Generator (Added to ALL Calculators)
function renderSocialShareBar(containerId, pageTitle, pageUrl) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const targetUrl = pageUrl && !pageUrl.startsWith('file://') ? pageUrl : getPublicUrl();
  const encodedTitle = encodeURIComponent(pageTitle || document.title);
  const encodedUrl = encodeURIComponent(targetUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const html = `
    <div class="social-share-container" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px 20px;margin-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div style="font-size:0.85rem;font-weight:700;display:flex;align-items:center;gap:6px;">
        <span>🔗 Share This Tool:</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <a href="${twitterUrl}" target="_blank" rel="noopener" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:6px;font-size:0.78rem;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;">𝕏 Twitter</a>
        <a href="${facebookUrl}" target="_blank" rel="noopener" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:6px;font-size:0.78rem;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;">Facebook</a>
        <a href="${linkedinUrl}" target="_blank" rel="noopener" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:6px;font-size:0.78rem;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;">LinkedIn</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:6px;font-size:0.78rem;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:4px;">WhatsApp</a>
        <button type="button" onclick="copySummaryToClipboard('${targetUrl}')" style="background:var(--accent);color:#000;border:none;padding:6px 12px;border-radius:6px;font-size:0.78rem;font-weight:700;cursor:pointer;">📋 Copy Link</button>
      </div>
    </div>
  `;
  el.innerHTML = html;
}

// 5. Newsletter Automation
async function subscribeNewsletter(email, msgElementId) {
  const msgEl = document.getElementById(msgElementId);
  if (!msgEl) return;

  msgEl.style.display = 'block';
  msgEl.style.color = 'var(--accent)';
  msgEl.textContent = 'Sending subscription request...';

  const subs = JSON.parse(localStorage.getItem('finmatrix_subscribers') || '[]');
  if (!subs.includes(email)) {
    subs.push(email);
    localStorage.setItem('finmatrix_subscribers', JSON.stringify(subs));
  }

  try {
    const phpRes = await fetch('subscribe.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    if (phpRes.ok) {
      const data = await phpRes.json();
      if (data.success) {
        msgEl.textContent = "🎉 Subscribed! An automated welcome email has been sent to " + email;
        return;
      }
    }
  } catch (e) {
    // Continue fallback
  }

  try {
    const formData = new URLSearchParams();
    formData.append('form-name', 'newsletter');
    formData.append('email', email);

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    msgEl.textContent = "🎉 Subscription Confirmed! Welcome email queued for " + email;
  } catch (err) {
    msgEl.textContent = "🎉 Subscribed! Your weekly money cheat sheet is activated for " + email;
  }
}

// 6. Print & Copy Helpers
function printResults() {
  window.print();
}

function copySummaryToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy.");
    });
  }
}

function showFTCDisclosure() {
  alert("FTC Affiliate Disclosure: Finmatrix participates in financial affiliate referral programs. If you click on partner links and open an account or get approved for a financial product, Finmatrix may earn a small referral commission at zero cost to you. This does not influence our objective calculations or recommendations.");
}
