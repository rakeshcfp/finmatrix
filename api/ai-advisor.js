/* Finmatrix — Serverless AI Advisor API Proxy */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { calculatorType, inputs, results } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const prompt = `You are a certified, friendly US personal finance advisor on Finmatrix. The user calculated their ${calculatorType || 'financial setup'}. Inputs: ${JSON.stringify(inputs)}. Results: ${JSON.stringify(results)}. Provide 4 concise, actionable, expert tips formatted in Markdown. Plain English. No disclaimers.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const adviceText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (adviceText) {
        return res.status(200).json({ advice: adviceText });
      }
    }

    // Fallback response if no API key is set
    return res.status(200).json({
      advice: "1. **Automate your monthly contributions** — Set up automatic transfers on payday so your money works for you effortlessly.\n2. **Optimize your tax accounts first** — Maximize employer 401(k) matches before taxable brokerages.\n3. **Build a 3-6 month HYSA emergency cushion** — Keep your safety net yielding 4.5%+ APY.\n4. **Rebalance annually** — Review your asset allocation every 12 months to maintain target risk profile."
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate AI advice." });
  }
}
