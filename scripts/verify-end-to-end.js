import fs from 'fs';
import http from 'http';

const wf = JSON.parse(fs.readFileSync('workflows/finmatrix-pinterest-marketing-automation.json', 'utf8'));
const n8 = wf.nodes.find(n => n.name.includes('Generate Pin Image'));

const $json = {
  themeVariant: 'navy',
  headlineOnImage: 'FD Interest Calculator',
  subtitleOnImage: 'Calculate your fixed deposit interest and maturity amount',
  calcHeaderTitle: 'FD INTEREST CALCULATOR',
  currencySymbol: '₹',
  input1Label: 'Deposit Amount:',
  input1Val: '₹ 100,000',
  input2Label: 'Interest Rate (% APY):',
  input2Val: '7.5%',
  input3Label: 'Deposit Term:',
  input3Val: '5 Years',
  btnText: 'CALCULATE NOW',
  result1Label: 'Total Interest Earned:',
  result1Val: '₹ 43,577',
  result2Label: 'Final Maturity Amount:',
  result2Val: '₹ 143,577',
  bullet1Text: 'Free FD interest calculator',
  bullet2Text: 'Calculate maturity amount online',
  bullet3Text: 'Find best savings scheme',
  bullet4Text: 'Accurate compound interest math'
};

const wrappedCode = `(function($json) { ${n8.parameters.jsCode} })($json)`;
const result = eval(wrappedCode);
const html = result[0].json.pinHtml;
console.log('HTML generated successfully, length:', html.length);

const postData = JSON.stringify({
  html: html,
  viewport_width: 1000,
  viewport_height: 1500,
  ms_delay: 800
});

const req = http.request('http://31.97.232.154:3000/render', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Render Response Status:', res.statusCode);
    console.log('Render Response Body:', body);
  });
});

req.write(postData);
req.end();
