import React, { useState } from 'react';
import { LeadMagnet } from '../data/leadMagnets';

interface LeadCaptureFormProps {
  leadMagnet: LeadMagnet;
  webhookUrl?: string;
  className?: string;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' }
];

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  leadMagnet,
  webhookUrl,
  className = ''
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (!trimmedName) {
      setErrorMsg('Please enter your first name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMsg('Please provide a valid mobile or WhatsApp number.');
      return;
    }

    setLoading(true);

    const fullPhone = `${countryCode} ${cleanPhone}`;
    const absoluteDownloadUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${leadMagnet.pdfDownloadUrl}`
      : leadMagnet.pdfDownloadUrl;

    const utmSource = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('utm_source') || 'organic'
      : 'organic';

    const payload = {
      name: trimmedName,
      email: cleanEmail,
      phone: fullPhone,
      resource_id: leadMagnet.id,
      resource_title: leadMagnet.title,
      download_url: absoluteDownloadUrl,
      source_page: typeof window !== 'undefined' ? window.location.pathname : '',
      timestamp: new Date().toISOString(),
      utm_source: utmSource
    };

    const targetUrl = webhookUrl || (typeof window !== 'undefined' ? '/subscribe.php' : '');

    try {
      if (targetUrl) {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn('Webhook primary dispatch failed; proceeding to instant download fallback.', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setDownloadUrl(absoluteDownloadUrl);
    }
  };

  return (
    <div className={`finmatrix-lead-card bg-[#0d1117] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left ${className}`}>
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4aa] via-[#0098ff] to-[#00d4aa]" />

      {!submitted ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[rgba(0,212,170,0.12)] text-[#00d4aa] border border-[rgba(0,212,170,0.3)] rounded-full">
              {leadMagnet.badge}
            </span>
            <span className="text-xs text-[#8b9bb4]">100% Free • No Spam</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#e8edf2] mb-2 leading-tight">
            {leadMagnet.title}
          </h3>
          <p className="text-sm text-[#8b9bb4] mb-6">
            {leadMagnet.tagline}
          </p>

          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold text-[#e8edf2] uppercase tracking-wider">What's Inside:</p>
            <ul className="space-y-1.5">
              {leadMagnet.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#cbd5e1]">
                  <span className="text-[#00d4aa] font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor={`name-${leadMagnet.id}`} className="block text-xs font-medium text-[#8b9bb4] mb-1">
                First Name <span className="text-[#00d4aa]">*</span>
              </label>
              <input
                id={`name-${leadMagnet.id}`}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-3.5 py-2.5 bg-[#131a22] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#e8edf2] placeholder-[#475569] text-sm focus:outline-none focus:border-[#00d4aa] transition-colors"
              />
            </div>

            <div>
              <label htmlFor={`email-${leadMagnet.id}`} className="block text-xs font-medium text-[#8b9bb4] mb-1">
                Email Address <span className="text-[#00d4aa]">*</span>
              </label>
              <input
                id={`email-${leadMagnet.id}`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full px-3.5 py-2.5 bg-[#131a22] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#e8edf2] placeholder-[#475569] text-sm focus:outline-none focus:border-[#00d4aa] transition-colors"
              />
            </div>

            <div>
              <label htmlFor={`phone-${leadMagnet.id}`} className="block text-xs font-medium text-[#8b9bb4] mb-1">
                Mobile / WhatsApp Number <span className="text-[#00d4aa]">*</span>
              </label>
              <div className="lead-phone-container flex gap-2.5 items-stretch w-full">
                <select
                  aria-label="Country Code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-[125px] min-w-[125px] max-w-[125px] shrink-0 px-2.5 py-2.5 bg-[#131a22] border border-[rgba(255,255,255,0.15)] rounded-lg text-[#e8edf2] text-sm focus:outline-none focus:border-[#00d4aa] cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  id={`phone-${leadMagnet.id}`}
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile / WhatsApp number"
                  autoComplete="tel-national"
                  className="flex-1 min-w-0 w-full px-3.5 py-2.5 bg-[#131a22] border border-[rgba(255,255,255,0.15)] rounded-lg text-[#e8edf2] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#00d4aa] transition-colors"
                />
              </div>
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-0199"
                  className="flex-1 px-3.5 py-2.5 bg-[#131a22] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#e8edf2] placeholder-[#475569] text-sm focus:outline-none focus:border-[#00d4aa] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">We'll dispatch the instant WhatsApp download link & quarterly updates.</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id={`consent-${leadMagnet.id}`}
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 rounded bg-[#131a22] border-[rgba(255,255,255,0.2)] text-[#00d4aa] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor={`consent-${leadMagnet.id}`} className="text-xs text-[#8b9bb4] cursor-pointer">
                Send me free money worksheets & calculation updates. Unsubscribe anytime.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-[#00d4aa] to-[#00b894] hover:from-[#00b894] hover:to-[#00a884] text-[#080c10] font-bold text-sm rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[rgba(0,212,170,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#080c10]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Securing Your Download...</span>
                </>
              ) : (
                <>
                  <span>Get Instant Free Access (PDF + Sheets)</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        /* Instant Gratification Success Screen */
        <div className="py-6 text-center animate-fade-in">
          <div className="w-14 h-14 bg-[rgba(0,212,170,0.15)] border border-[rgba(0,212,170,0.4)] rounded-full flex items-center justify-center mx-auto mb-4 text-[#00d4aa] text-2xl font-bold">
            ✓
          </div>

          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[rgba(0,212,170,0.12)] text-[#00d4aa] rounded-full inline-block mb-2">
            ACCESS GRANTED
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-[#e8edf2] mb-2">
            Your Toolkit is On Its Way!
          </h3>

          <p className="text-sm text-[#cbd5e1] max-w-md mx-auto mb-6">
            We have dispatched your direct access links to <strong className="text-[#00d4aa]">{email}</strong> and WhatsApp <strong className="text-[#00d4aa]">{countryCode} {phone}</strong>.
          </p>

          <div className="p-4 bg-[#131a22] border border-[rgba(255,255,255,0.06)] rounded-xl max-w-sm mx-auto mb-6 space-y-2.5">
            <p className="text-xs text-[#8b9bb4] mb-2 font-medium">Download Your Unlocked Files Immediately:</p>
            <a
              href={leadMagnet.excelDownloadUrl || downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#00d4aa] hover:bg-[#00b894] text-[#080c10] font-bold text-sm rounded-lg transition-colors shadow-md"
            >
              <span>📗</span>
              <span>Download Excel Spreadsheet (.xlsx)</span>
            </a>
            <a
              href={leadMagnet.pdfDownloadUrl || downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1a2433] hover:bg-[#223044] border border-[rgba(255,255,255,0.15)] text-[#e8edf2] font-semibold text-xs rounded-lg transition-colors"
            >
              <span>📄</span>
              <span>Download PDF Strategy Guide (.pdf)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => { setSubmitted(false); }}
            className="text-xs text-[#8b9bb4] hover:text-[#e8edf2] transition-colors underline"
          >
            Send to another email / phone
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadCaptureForm;

