/**
 * Finmatrix n8n Webhook Test Dispatcher
 *
 * Sends a simulated lead payload to your n8n webhook URL to test
 * execution, email formatting, Google Sheets logging, and alert pings.
 *
 * Usage:
 *   node scripts/test-n8n-webhook.mjs <your-n8n-webhook-url>
 *   npm run test:n8n -- <your-n8n-webhook-url>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Resolve Target Webhook URL
let targetUrl = process.argv[2] ? process.argv[2].trim() : '';

if (!targetUrl) {
  // Check config/site.json
  const siteConfigPath = path.join(ROOT_DIR, 'config', 'site.json');
  if (fs.existsSync(siteConfigPath)) {
    try {
      const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
      if (siteConfig.automation && siteConfig.automation.n8n_webhook_url) {
        targetUrl = siteConfig.automation.n8n_webhook_url.trim();
      }
    } catch (e) {}
  }
}

if (!targetUrl) {
  console.log(`
========================================================================
 Finmatrix n8n Webhook Tester
========================================================================

Error: No n8n webhook URL provided.

How to test:
  1. Open your n8n workflow canvas.
  2. Double-click "Finmatrix Lead Webhook".
  3. Copy the "Test URL" or "Production URL".
  4. Run this command:
     node scripts/test-n8n-webhook.mjs <paste-your-url-here>

Example:
  node scripts/test-n8n-webhook.mjs https://n8n.example.com/webhook-test/finmatrix-lead
========================================================================
  `);
  process.exit(1);
}

// 2. Sample Lead Payload
const samplePayload = {
  name: "Alex Morgan",
  email: "alex.morgan.test@gmail.com",
  phone: "+1 (555) 789-0123",
  country_code: "+1",
  toolkit_id: "debt-snowball-avalanche-toolkit",
  toolkit_title: "Debt Snowball vs. Avalanche Payoff Toolkit",
  excel_download_url: "https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Tracker.xlsx",
  pdf_download_url: "https://finmatrix.cloud/downloads/Debt-Snowball-vs-Avalanche-Payoff-Toolkit.pdf",
  page_source: "https://finmatrix.cloud/calculators/payment-calculator.html",
  timestamp: new Date().toISOString()
};

console.log("\n========================================================================");
console.log(" Finmatrix -> n8n Webhook Test Dispatcher");
console.log("========================================================================");
console.log(`Target URL: ${targetUrl}`);
console.log("\nPayload to Send:");
console.log(JSON.stringify(samplePayload, null, 2));
console.log("\nSending HTTP POST request...");

const startTime = Date.now();

try {
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Finmatrix-Tester/2.0'
    },
    body: JSON.stringify(samplePayload)
  });

  const durationMs = Date.now() - startTime;
  const status = response.status;
  const responseText = await response.text();

  console.log(`\nResponse Received in ${durationMs}ms:`);
  console.log(`HTTP Status: ${status} ${response.statusText}`);
  
  try {
    const jsonBody = JSON.parse(responseText);
    console.log("Response Body (JSON):");
    console.log(JSON.stringify(jsonBody, null, 2));
  } catch (e) {
    console.log(`Response Body (Raw): ${responseText || '(empty response)'}`);
  }

  if (response.ok) {
    console.log("\n✅ SUCCESS: n8n webhook received the lead successfully!");
    console.log("Check your n8n canvas execution history to see the lead flow through all nodes.");
  } else {
    console.log(`\n⚠️ Server returned non-200 status code (${status}). Check n8n webhook settings.`);
  }
} catch (err) {
  console.error("\n❌ Request Failed:", err.message);
  console.log("Tip: Ensure your n8n instance is running and reachable from this network.");
}

console.log("========================================================================\n");

