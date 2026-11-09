/**
 * Finmatrix — Automated XML Sitemap Builder
 * Reads active calculators from config/calculators.json, category hubs, and core trust pages.
 * Outputs valid, clean sitemap.xml to the project root.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://finmatrix.cloud';
const ROOT_DIR = path.resolve(__dirname, '..');
const TODAY = new Date().toISOString().split('T')[0]; // Current date YYYY-MM-DD

// 1. Core Pages
const corePages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/calculators/', priority: '0.98', changefreq: 'daily' },
  { path: '/calculators/income-tax/', priority: '0.92', changefreq: 'weekly' },
  { path: '/calculators/debt/', priority: '0.92', changefreq: 'weekly' },
  { path: '/calculators/housing/', priority: '0.92', changefreq: 'weekly' },
  { path: '/calculators/savings-investing/', priority: '0.92', changefreq: 'weekly' },
  { path: '/calculators/loans/', priority: '0.92', changefreq: 'weekly' },
  { path: '/downloads/', priority: '0.92', changefreq: 'weekly' },
  { path: '/about.html', priority: '0.60', changefreq: 'monthly' },
  { path: '/editorial-policy.html', priority: '0.60', changefreq: 'monthly' },
  { path: '/privacy-policy.html', priority: '0.50', changefreq: 'yearly' },
  { path: '/terms-of-service.html', priority: '0.50', changefreq: 'yearly' },
  { path: '/disclaimer.html', priority: '0.50', changefreq: 'yearly' },
  { path: '/contact.html', priority: '0.60', changefreq: 'monthly' }
];

// 2. Load Calculators
const calculatorsPath = path.join(ROOT_DIR, 'config', 'calculators.json');
let calculators = [];
if (fs.existsSync(calculatorsPath)) {
  calculators = JSON.parse(fs.readFileSync(calculatorsPath, 'utf8'));
} else {
  console.error('config/calculators.json not found!');
  process.exit(1);
}

// 3. Assemble URLs
const urls = [];

// Add core pages
corePages.forEach(p => {
  urls.push({
    loc: `${DOMAIN}${p.path}`,
    lastmod: TODAY,
    changefreq: p.changefreq,
    priority: p.priority
  });
});

// Add calculators
calculators.forEach(c => {
  urls.push({
    loc: `${DOMAIN}${c.url}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: c.popular ? '0.95' : '0.90'
  });
});

// Add educational articles hub & articles
const articlesDir = path.join(ROOT_DIR, 'articles');
if (fs.existsSync(articlesDir)) {
  const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
  articleFiles.forEach(f => {
    // Only index valid full articles, not legacy redirect stubs
    const content = fs.readFileSync(path.join(articlesDir, f), 'utf8');
    if (!content.includes('http-equiv="refresh"')) {
      const urlPath = f === 'index.html' ? '/articles/' : `/articles/${f}`;
      urls.push({
        loc: `${DOMAIN}${urlPath}`,
        lastmod: TODAY,
        changefreq: 'weekly',
        priority: f === 'index.html' ? '0.90' : '0.88'
      });
    }
  });
}

// 4. Generate XML
const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

urls.forEach(u => {
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>${u.loc}</loc>`);
  xmlLines.push(`    <lastmod>${u.lastmod}</lastmod>`);
  xmlLines.push(`    <changefreq>${u.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${u.priority}</priority>`);
  xmlLines.push('  </url>');
});

xmlLines.push('</urlset>');
xmlLines.push('');

const sitemapContent = xmlLines.join('\n');
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log(`Successfully generated sitemap.xml with ${urls.length} indexable URLs.`);
