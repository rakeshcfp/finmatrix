/* Finmatrix — Privacy-Compliant GA4 Analytics Loader */

(function initAnalytics() {
  fetch('/config/site.json')
    .then(res => res.json())
    .then(site => {
      const gaId = site.ga4_id;
      if (!gaId || gaId === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]+$/i.test(gaId)) {
        // Skip analytics injection until real GA4 measurement ID is supplied
        return;
      }

      // Inject gtag.js
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', gaId, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    })
    .catch(() => {
      // Fail silently in offline or disconnected states
    });
})();
