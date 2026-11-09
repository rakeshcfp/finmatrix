/**
 * Finmatrix Lead Capture Engine — Super Simple & High Converting
 * Ultra-intuitive UX: Large tap targets, clear visual icons, 1-click downloads.
 */

(function () {
  let siteConfig = null;
  let leadMagnets = null;

  const COUNTRY_CODES = [
    { code: '+1', country: 'US / CA', flag: '🇺🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' }
  ];

  async function initLeadCapture() {
    try {
      const [siteRes, magnetsRes] = await Promise.all([
        fetch('/config/site.json'),
        fetch('/config/lead-magnets.json')
      ]);

      if (siteRes.ok) siteConfig = await siteRes.json();
      if (magnetsRes.ok) leadMagnets = await magnetsRes.json();
    } catch (e) {
      console.warn('Finmatrix Lead Capture: Failed loading configs', e);
    }

    // Hydrate inline containers
    const containers = document.querySelectorAll('.finmatrix-lead-capture, [data-lead-magnet]');
    containers.forEach((el) => {
      const magnetId = el.getAttribute('data-magnet-id') || el.getAttribute('data-lead-magnet') || 'debt-snowball-avalanche-toolkit';
      renderLeadForm(el, magnetId);
    });

    // Create global modal container
    setupGlobalModal();
  }

  function getMagnetData(magnetId) {
    return (leadMagnets && leadMagnets[magnetId]) || {
      id: magnetId,
      title: 'Free 2026 Wealth & Debt Payoff Strategy Toolkit',
      badge: 'FREE SPREADSHEET & WORKBOOK',
      tagline: 'Get instant access to automated calculators, templates, and actionable roadmaps.',
      deliverables: [
        'Automated Excel (.xlsx) spreadsheet with built-in math formulas',
        'Google Sheets copy template link included',
        'Step-by-step PDF roadmap you can read or print'
      ],
      pdfDownloadUrl: '/downloads/Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf',
      excelDownloadUrl: '/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx'
    };
  }

  function renderLeadForm(container, magnetId, isModal = false) {
    const magnet = getMagnetData(magnetId);
    const webhookUrl = (siteConfig && siteConfig.automation && siteConfig.automation.n8n_webhook_url) || '/subscribe.php';

    const deliverablesHtml = magnet.deliverables
      .map((d) => `<li style="display:flex;align-items:center;gap:10px;font-size:14px;color:#cbd5e1;margin-bottom:8px;"><span style="color:#00d4aa;font-weight:bold;font-size:16px;">✓</span><span>${escapeHtml(d)}</span></li>`)
      .join('');

    const optionsHtml = COUNTRY_CODES
      .map((c) => `<option value="${c.code}">${c.flag} ${c.code}</option>`)
      .join('');

    container.innerHTML = `
      <div class="lead-capture-box" style="background:#0d1117;border:2px solid rgba(0,212,170,0.3);border-radius:20px;padding:${isModal ? '24px' : '32px'};box-shadow:0 15px 40px rgba(0,0,0,0.6);position:relative;overflow:hidden;text-align:left;">
        <div style="position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg, #00d4aa, #0098ff, #00d4aa);"></div>
        
        <div class="lead-form-view">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;padding:6px 14px;background:rgba(0,212,170,0.15);color:#00d4aa;border:1px solid rgba(0,212,170,0.4);border-radius:999px;">
              🎁 ${escapeHtml(magnet.badge)}
            </span>
            <span style="font-size:13px;color:#8b9bb4;font-weight:600;">⚡ 100% Free • Direct Download</span>
          </div>

          <h3 style="font-family:'Syne',sans-serif;font-size:clamp(1.3rem,3vw,1.6rem);font-weight:800;color:#ffffff;margin:0 0 10px 0;line-height:1.3;">
            Where should we send your free toolkit?
          </h3>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 18px 0;line-height:1.5;">
            Enter your details below to unlock both the <strong>Excel spreadsheet (.xlsx)</strong> and the <strong>PDF roadmap</strong> instantly.
          </p>

          <div style="margin-bottom:20px;background:#131a22;padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,0.06);">
            <p style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#00d4aa;margin:0 0 8px 0;">What you get instantly:</p>
            <ul style="list-style:none;padding:0;margin:0;">
              ${deliverablesHtml}
            </ul>
          </div>

          <div class="lead-error-msg" style="display:none;margin-bottom:14px;padding:12px 16px;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);border-radius:10px;color:#fca5a5;font-size:13px;font-weight:600;"></div>

          <form class="lead-capture-form" style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:6px;">
                👤 1. Your First Name
              </label>
              <input type="text" name="name" required placeholder="e.g. Alex" autocomplete="given-name" style="width:100% !important;box-sizing:border-box !important;padding:13px 16px !important;background:#131a22 !important;border:1.5px solid rgba(255,255,255,0.15) !important;border-radius:10px !important;color:#ffffff !important;font-size:15px !important;outline:none !important;transition:border-color 0.2s !important;" />
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:6px;">
                ✉️ 2. Your Email Address
              </label>
              <input type="email" name="email" required placeholder="alex@gmail.com" autocomplete="email" style="width:100% !important;box-sizing:border-box !important;padding:13px 16px !important;background:#131a22 !important;border:1.5px solid rgba(255,255,255,0.15) !important;border-radius:10px !important;color:#ffffff !important;font-size:15px !important;outline:none !important;transition:border-color 0.2s !important;" />
            </div>

            <div>
              <label style="display:block;font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:6px;">
                📱 3. Mobile / WhatsApp Number (For instant download link)
              </label>
              <div class="lead-phone-container" style="display:flex !important;gap:10px !important;align-items:stretch !important;width:100% !important;">
                <select name="country_code" aria-label="Country Code" style="width:125px !important;min-width:125px !important;max-width:125px !important;flex:0 0 125px !important;padding:12px 10px !important;background:#131a22 !important;border:1.5px solid rgba(255,255,255,0.15) !important;border-radius:10px !important;color:#ffffff !important;font-size:14px !important;outline:none !important;cursor:pointer !important;box-sizing:border-box !important;">
                  ${optionsHtml}
                </select>
                <input type="tel" name="phone" required placeholder="Mobile / WhatsApp number" autocomplete="tel-national" style="flex:1 1 auto !important;min-width:0 !important;width:100% !important;box-sizing:border-box !important;padding:13px 16px !important;background:#131a22 !important;border:1.5px solid rgba(255,255,255,0.15) !important;border-radius:10px !important;color:#ffffff !important;font-size:15px !important;outline:none !important;transition:border-color 0.2s !important;" />
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin-top:2px;">
              <input type="checkbox" name="consent" id="consent-${magnet.id}-${isModal ? 'modal' : 'inline'}" checked style="width:18px;height:18px;accent-color:#00d4aa;cursor:pointer;" />
              <label for="consent-${magnet.id}-${isModal ? 'modal' : 'inline'}" style="font-size:12px;color:#94a3b8;cursor:pointer;">
                Send me free money worksheets & calculator updates. (Zero spam, unsubscribe anytime).
              </label>
            </div>

            <button type="submit" class="submit-lead-btn" style="width:100%;padding:16px 20px;margin-top:8px;background:linear-gradient(90deg, #00d4aa, #00b894);color:#080c10;font-weight:800;font-size:16px;border:none;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 24px rgba(0,212,170,0.35);transition:all 0.2s ease;">
              <span>🚀 UNLOCK &amp; DOWNLOAD NOW (FREE)</span>
              <span style="font-size:18px;">&rarr;</span>
            </button>

            <p style="text-align:center;font-size:12px;color:#8b949e;margin-top:10px;margin-bottom:0;">
              Already unlocked? <a href="${escapeHtml(magnet.excelDownloadUrl)}" download style="color:#00d4aa;text-decoration:underline;font-weight:600;">Download .xlsx directly</a>
            </p>
          </form>
        </div>

        <div class="lead-success-view" style="display:none;padding:24px 0;text-align:center;">
          <div style="width:68px;height:68px;background:rgba(0,212,170,0.18);border:2px solid #00d4aa;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;color:#00d4aa;font-size:32px;font-weight:bold;">
            🎉
          </div>
          <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;padding:5px 14px;background:rgba(0,212,170,0.15);color:#00d4aa;border-radius:999px;display:inline-block;margin-bottom:8px;">
            ACCESS GRANTED • 100% UNLOCKED
          </span>
          <h3 style="font-family:'Syne',sans-serif;font-size:24px;color:#ffffff;margin:0 0 8px 0;font-weight:800;">
            Your Download Pack Is Ready!
          </h3>
          <p class="success-dest-text" style="font-size:14px;color:#cbd5e1;max-width:440px;margin:0 auto 20px auto;line-height:1.5;">
            We also emailed a copy to your inbox and dispatched your WhatsApp link.
          </p>

          <div style="padding:22px 24px;background:#131a22;border:2px solid rgba(0,212,170,0.25);border-radius:16px;max-width:420px;margin:0 auto 20px auto;display:flex;flex-direction:column;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,0.4);">
            <p style="font-size:13px;color:#00d4aa;margin:0;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">Click to Download Immediately:</p>
            
            <!-- Excel Download Button -->
            <a href="${escapeHtml(magnet.excelDownloadUrl)}" class="direct-download-excel-btn" download target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;box-sizing:border-box;padding:15px 20px;background:#00d4aa;color:#080c10;font-weight:800;font-size:15px;text-decoration:none;border-radius:10px;box-shadow:0 4px 16px rgba(0,212,170,0.3);transition:transform 0.2s ease;">
              <span style="font-size:18px;">📗</span>
              <span>DOWNLOAD EXCEL FILE (.xlsx)</span>
            </a>

            <!-- PDF Download Button -->
            <a href="${escapeHtml(magnet.pdfDownloadUrl)}" class="direct-download-pdf-btn" download target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;box-sizing:border-box;padding:13px 20px;background:#1a2433;border:1.5px solid rgba(255,255,255,0.18);color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;transition:background 0.2s ease;">
              <span style="font-size:16px;">📄</span>
              <span>DOWNLOAD PDF STRATEGY GUIDE (.pdf)</span>
            </a>
          </div>

          <p style="font-size:12px;color:#64748b;margin:0;">
            Tip: You can now unlock and download any other toolkit on the site with 1-click!
          </p>
        </div>
      </div>
    `;

    // Clean up legacy global unlock if present
    try {
      localStorage.removeItem('finmatrix_lead_unlocked');
    } catch (e) {}

    const form = container.querySelector('.lead-capture-form');
    const formView = container.querySelector('.lead-form-view');
    const successView = container.querySelector('.lead-success-view');
    const errorBox = container.querySelector('.lead-error-msg');
    const submitBtn = container.querySelector('.submit-lead-btn');
    const successDest = container.querySelector('.success-dest-text');

    // Pre-fill previously stored credentials for ease of use across different tools
    try {
      const storedName = localStorage.getItem('finmatrix_user_name');
      const storedEmail = localStorage.getItem('finmatrix_user_email');
      const storedPhone = localStorage.getItem('finmatrix_user_phone');
      if (storedName) form.querySelector('input[name="name"]').value = storedName;
      if (storedEmail) form.querySelector('input[name="email"]').value = storedEmail;
      if (storedPhone) form.querySelector('input[name="phone"]').value = storedPhone;
    } catch (e) {}

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      errorBox.style.display = 'none';

      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const codeSelect = form.querySelector('select[name="country_code"]');
      const phoneInput = form.querySelector('input[name="phone"]');

      const nameVal = (nameInput.value || '').trim();
      const emailVal = (emailInput.value || '').trim().toLowerCase();
      const codeVal = codeSelect.value;
      const phoneVal = (phoneInput.value || '').trim().replace(/\D/g, '');

      if (!nameVal) {
        showError('Please enter your first name.');
        return;
      }
      if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
        showError('Please enter a valid email address.');
        return;
      }
      if (!phoneVal || phoneVal.length < 7) {
        showError('Please enter your phone or WhatsApp number.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.innerHTML = '<span>⚡ Unlocking Your Download...</span>';

      const fullPhone = `${codeVal} ${phoneVal}`;
      const absoluteDownloadUrl = window.location.origin + magnet.excelDownloadUrl;
      const utmSource = new URLSearchParams(window.location.search).get('utm_source') || 'organic';

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: fullPhone,
        country_code: codeVal,
        toolkit_id: magnet.id,
        toolkit_title: magnet.title,
        resource_id: magnet.id,
        resource_title: magnet.title,
        excel_download_url: window.location.origin + magnet.excelDownloadUrl,
        pdf_download_url: window.location.origin + magnet.pdfDownloadUrl,
        excel_url: window.location.origin + magnet.excelDownloadUrl,
        pdf_url: window.location.origin + magnet.pdfDownloadUrl,
        download_url: absoluteDownloadUrl,
        page_source: window.location.pathname,
        source_page: window.location.pathname,
        timestamp: new Date().toISOString(),
        utm_source: utmSource
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Primary webhook unreachable, falling back to instant unlock.', err);
      } finally {
        try {
          // Store user details so other tools can pre-fill
          localStorage.setItem('finmatrix_user_email', emailVal);
          localStorage.setItem('finmatrix_user_name', nameVal);
          localStorage.setItem('finmatrix_user_phone', phoneVal);

          // Mark ONLY this specific toolkit as unlocked
          const unlockedTools = JSON.parse(localStorage.getItem('finmatrix_unlocked_toolkits') || '[]');
          if (!unlockedTools.includes(magnet.id)) {
            unlockedTools.push(magnet.id);
            localStorage.setItem('finmatrix_unlocked_toolkits', JSON.stringify(unlockedTools));
          }
        } catch (e) {}

        formView.style.display = 'none';
        successView.style.display = 'block';
        if (successDest) {
          successDest.innerHTML = `Your instant download links have been activated and dispatched to <strong style="color:#00d4aa;">${escapeHtml(emailVal)}</strong> and WhatsApp <strong style="color:#00d4aa;">${escapeHtml(fullPhone)}</strong>.`;
        }

        // Auto trigger the primary Excel download
        const excelBtn = successView.querySelector('.direct-download-excel-btn');
        if (excelBtn) {
          setTimeout(() => {
            excelBtn.click();
          }, 400);
        }
      }
    });

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
    }
  }

  // Global Download Modal Logic
  function setupGlobalModal() {
    if (document.getElementById('finmatrix-download-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'finmatrix-download-modal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);z-index:99999;align-items:center;justify-content:center;padding:16px;';

    modal.innerHTML = `
      <div class="modal-dialog" style="background:#0d1117;border:2px solid rgba(0,212,170,0.3);border-radius:22px;max-width:540px;width:100%;max-height:92vh;overflow-y:auto;position:relative;box-shadow:0 25px 60px rgba(0,0,0,0.9);">
        <button type="button" class="close-modal-btn" style="position:absolute;top:18px;right:20px;background:#1a2433;border:1px solid rgba(255,255,255,0.15);border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:20px;cursor:pointer;line-height:1;z-index:10;transition:all 0.2s;">&times;</button>
        <div id="modal-lead-form-slot" style="padding:4px;"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    window.openDownloadModal = function (magnetId) {
      const magnet = getMagnetData(magnetId);

      // Clean up legacy global unlock flag if present
      try {
        localStorage.removeItem('finmatrix_lead_unlocked');
      } catch (e) {}

      const slot = document.getElementById('modal-lead-form-slot');
      renderLeadForm(slot, magnetId, true);
      modal.style.display = 'flex';
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeadCapture);
  } else {
    initLeadCapture();
  }
})();
