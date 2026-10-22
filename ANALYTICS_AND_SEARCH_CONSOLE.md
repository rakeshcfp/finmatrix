# Google Analytics 4 (GA4) & Google Search Console Setup Guide (ANALYTICS_AND_SEARCH_CONSOLE.md)

This document provides exact, step-by-step instructions for the website owner to activate analytics tracking and indexation in Google Search Console for **Finmatrix** (`https://finmatrix.cloud`).

---

## 1. Setting Up Google Analytics 4 (GA4)

Finmatrix comes with an automated, privacy-compliant GA4 loader (`js/analytics.js`). It reads your measurement ID from `config/site.json` and automatically activates sitewide without requiring code modifications across individual HTML files.

### Step 1: Create a GA4 Property
1. Navigate to [analytics.google.com](https://analytics.google.com/) and sign in with your Google account.
2. Click **Admin** (gear icon in lower left corner) → **Create** → **Property**.
3. Property Name: `Finmatrix Production`.
4. Reporting time zone: `United States / New York (Eastern Time)` (matching your primary audience).
5. Currency: `US Dollar ($)`.
6. Industry category: `Finance`.
7. Click **Next** → Select business objectives (e.g., "Generate leads", "Examine user behavior").

### Step 2: Create a Web Data Stream
1. In the **Data Streams** tab, choose **Web**.
2. Website URL: `https://finmatrix.cloud`
3. Stream name: `Finmatrix Web Stream`
4. Ensure **Enhanced measurement** is toggled ON (this automatically tracks page views, scrolls, outbound clicks to affiliate links, site search, and file downloads).
5. Click **Create Stream**.
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`).

### Step 3: Activate GA4 in Finmatrix
1. Open [`config/site.json`](file:///c:/Antigravity/finmatrix/config/site.json).
2. Replace `"ga4_id": "G-XXXXXXXXXX"` with your actual Measurement ID:
   ```json
   "ga4_id": "G-12345ABCDE"
   ```
3. Commit and deploy. The site will immediately start streaming real-time analytics.

---

## 2. Google Search Console (GSC) Domain Verification

Verifying ownership in Google Search Console is required to monitor keyword impressions, click-through rates, crawl errors, and Core Web Vitals.

### Step 1: Add Domain Property
1. Visit [search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add Property** in the top-left dropdown.
3. Choose the **Domain** method (recommended):
   - Enter: `finmatrix.cloud`
   - *Note:* Do not include `https://` or `www.` in the Domain property field.

### Step 2: Add DNS TXT Record
1. Google Search Console will provide a unique verification string (e.g., `google-site-verification=abc123xyz...`).
2. Log in to your DNS provider (Cloudflare, Namecheap, GoDaddy, Hostinger, or Netlify DNS).
3. Add a new DNS record:
   - **Type:** `TXT`
   - **Name / Host:** `@` (or leave blank depending on provider)
   - **Value / Content:** Paste the `google-site-verification=...` string
   - **TTL:** Auto or 3600
4. Wait 2–5 minutes for DNS propagation, then click **Verify** in Search Console.

*(Alternative Netlify HTML Tag Verification):*  
If DNS access is unavailable, select "HTML tag", copy the `<meta name="google-site-verification" content="..." />`, and add it to `index.html`.

---

## 3. Submitting the XML Sitemap

Submitting your sitemap ensures Googlebot and Bingbot immediately crawl and index your calculator suite.

1. In Google Search Console, click **Sitemaps** in the left navigation under "Indexing".
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
   (Full URL: `https://finmatrix.cloud/sitemap.xml`).
3. Click **Submit**.
4. Status should show **Success** with the total number of discovered calculator and hub URLs.

---

## 4. Setting Up Bing Webmaster Tools & IndexNow
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters).
2. Choose **Import from Google Search Console** for instant 1-click verification.
3. Submit `https://finmatrix.cloud/sitemap.xml` to Bing Webmaster Tools.
