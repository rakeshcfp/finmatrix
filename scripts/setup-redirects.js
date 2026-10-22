const fs = require('fs');
const path = require('path');

const map = {
  'avalanche-vs-snowball-debt.html': '/calculators/debt-elimination-planner.html',
  'ultimate-credit-card-debt-elimination-guide.html': '/calculators/credit-card-payoff-calculator.html',
  'hysa-vs-cd-2025.html': '/calculators/hysa-vs-cd-calculator.html',
  'rent-vs-buy-2025.html': '/calculators/rent-vs-buy-calculator.html',
  'roth-ira-vs-401k.html': '/calculators/roth-vs-traditional-ira-calculator.html',
  'how-to-build-emergency-fund.html': '/calculators/emergency-fund-calculator.html',
  '50-30-20-rule-budgeting.html': '/calculators/paycheck-calculator.html',
  'what-is-the-4-percent-rule.html': '/calculators/fire-calculator.html',
  'boost-credit-score-30-days.html': '/calculators/debt-elimination-planner.html',
  'investing-50-dollars.html': '/calculators/compound-interest-calculator.html',
  'side-hustles-1000-month.html': '/calculators/hourly-to-salary-calculator.html',
  'index.html': '/calculators/'
};

const articlesDir = path.resolve(__dirname, '..', 'articles');
for (const [file, dest] of Object.entries(map)) {
  const filePath = path.join(articlesDir, file);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=${dest}">
<link rel="canonical" href="https://finmatrix.cloud${dest}">
<title>Redirecting to Finmatrix Calculator Tool...</title>
<script>window.location.replace("${dest}");</script>
</head>
<body style="background:#0d1117;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
<h2>Redirecting to Finmatrix Financial Calculator...</h2>
<p>This educational guide has been consolidated into our interactive tool: <a href="${dest}" style="color:#00d4aa;">Click here if you are not redirected automatically.</a></p>
</body>
</html>
`;
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated redirect on: ${file} -> ${dest}`);
}
