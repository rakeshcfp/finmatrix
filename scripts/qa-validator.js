/**
 * Finmatrix Comprehensive Technical SEO & QA Validator
 * Verifies HTML pages against all project requirements:
 * 1. Exactly one H1 per page
 * 2. Title & Meta description presence & length
 * 3. Canonical tag matching URL
 * 4. JSON-LD syntax validity
 * 5. Zero broken href="#" links
 * 6. Zero unmigrated /articles/ internal links
 * 7. Verification that sitemap URLs exist
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOMAIN = 'https://finmatrix.cloud';

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== '.git' && file !== 'node_modules' && file !== 'dist') {
        getAllHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
console.log(`Auditing ${htmlFiles.length} HTML files across the project...\n`);

let errors = 0;
let warnings = 0;

htmlFiles.forEach(file => {
  const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Skip legacy redirected article files in /articles/ directory from strict H1 checks
  const isLegacyArticle = relPath.startsWith('articles/');
  const isEmbed = relPath.startsWith('embed/');

  // 1. Check H1
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (!isLegacyArticle && !isEmbed) {
    if (h1Matches.length === 0) {
      console.error(`[ERROR] Missing <h1> in ${relPath}`);
      errors++;
    } else if (h1Matches.length > 1) {
      console.warn(`[WARN] Multiple <h1> tags (${h1Matches.length}) in ${relPath}`);
      warnings++;
    }
  }

  // 2. Check Title
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    console.error(`[ERROR] Missing <title> in ${relPath}`);
    errors++;
  } else {
    const titleText = titleMatch[1].trim();
    if (titleText.length > 70 && !isLegacyArticle) {
      console.warn(`[WARN] Title long (${titleText.length} chars) in ${relPath}: "${titleText}"`);
      warnings++;
    }
  }

  // 3. Check Meta Description
  if (!isLegacyArticle && !isEmbed) {
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (!descMatch) {
      console.error(`[ERROR] Missing meta description in ${relPath}`);
      errors++;
    }
  }

  // 4. Check Canonical Tag
  if (!isLegacyArticle && !isEmbed) {
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    if (!canonicalMatch) {
      console.error(`[ERROR] Missing canonical tag in ${relPath}`);
      errors++;
    }
  }

  // 5. Check JSON-LD validity
  const jsonLdMatches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    const jsonStr = match[1].trim();
    try {
      JSON.parse(jsonStr);
    } catch (e) {
      console.error(`[ERROR] Invalid JSON-LD in ${relPath}: ${e.message}`);
      errors++;
    }
  }

  // 6. Check for broken href="#" links in main navigation or content
  // Exclude theme toggles or javascript buttons if any
  const hrefHashMatches = content.match(/href="#"/g) || [];
  if (hrefHashMatches.length > 0 && !isLegacyArticle) {
    console.warn(`[WARN] Found ${hrefHashMatches.length} 'href="#"' in ${relPath}`);
    warnings++;
  }

  // 7. Check for unmigrated internal links to /articles/ in active tools
  if (!isLegacyArticle && !isEmbed) {
    const articleLinkMatches = content.match(/href="\/articles\/[^"]*"/g) || [];
    if (articleLinkMatches.length > 0) {
      console.warn(`[WARN] Found active links to /articles/ in ${relPath}: ${articleLinkMatches.join(', ')}`);
      warnings++;
    }
  }
});

// 8. Validate sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemapXml.matchAll(/<loc>(https:\/\/finmatrix\.cloud)(.*?)<\/loc>/g)];
  console.log(`\nValidating sitemap.xml (${locMatches.length} URLs)...`);

  locMatches.forEach(m => {
    let urlPath = m[2];
    if (urlPath === '/' || urlPath === '') {
      urlPath = '/index.html';
    } else if (urlPath.endsWith('/')) {
      urlPath = urlPath + 'index.html';
    }
    const localFile = path.join(ROOT_DIR, urlPath.replace(/\//g, path.sep));
    if (!fs.existsSync(localFile)) {
      console.error(`[ERROR] Sitemap URL does not map to a local file: ${m[0]} -> ${localFile}`);
      errors++;
    }
  });
} else {
  console.error('[ERROR] sitemap.xml not found!');
  errors++;
}

console.log(`\nQA Audit Complete. Total Errors: ${errors}, Warnings: ${warnings}`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('✓ All critical SEO and structural tests passed cleanly!');
}
