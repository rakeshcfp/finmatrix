/* Finmatrix — Serverless Newsletter Automation & Subscriber API */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const SENDER_EMAIL = 'novamatrix1564@gmail.com';
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    // 1. Integration with Resend
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `Finmatrix <${SENDER_EMAIL}>`,
          reply_to: SENDER_EMAIL,
          to: [email],
          subject: '🚀 Welcome to Finmatrix Weekly Money Cheat Sheet!',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111;">
              <h2 style="color:#00a884;">Welcome to Finmatrix Weekly Money Cheat Sheet!</h2>
              <p>Hi there,</p>
              <p>Thank you for subscribing to <strong>Finmatrix</strong>. Every Tuesday, you'll get 1 high-impact US personal finance tip, High-Yield Savings & Mortgage rate updates, and tax-saving hacks.</p>
              <p><strong>Your Starter Money Checklist:</strong></p>
              <ul>
                <li>1. Check your net take-home pay: <a href="https://finmatrix.cloud/calculators/paycheck-calculator.html">Paycheck Calculator</a></li>
                <li>2. Build a 3-6 month HYSA emergency cushion yielding 4.5%+ APY</li>
                <li>3. Max out your Roth IRA ($7,000 limit for 2025/2026)</li>
              </ul>
              <p>Questions or feedback? Reply directly to this email (${SENDER_EMAIL}).</p>
              <p>— The Finmatrix Team</p>
            </div>
          `
        })
      });
      return res.status(200).json({ success: true, message: 'Subscribed! Welcome email sent from ' + SENDER_EMAIL });
    }

    // 2. Integration with Brevo / Sendinblue
    if (BREVO_API_KEY) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Finmatrix', email: SENDER_EMAIL },
          replyTo: { email: SENDER_EMAIL },
          to: [{ email: email }],
          subject: '🚀 Welcome to Finmatrix Weekly Money Cheat Sheet!',
          htmlContent: '<h3>Welcome to Finmatrix!</h3><p>Your weekly US money cheat sheet is confirmed. Sent from novamatrix1564@gmail.com.</p>'
        })
      });
      return res.status(200).json({ success: true, message: 'Subscribed! Welcome email sent from ' + SENDER_EMAIL });
    }

    // Fallback response for testing / local development
    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully! In production, welcome emails dispatch from ' + SENDER_EMAIL + ' to your inbox.'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to process newsletter subscription.' });
  }
}
