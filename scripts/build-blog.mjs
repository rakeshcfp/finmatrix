/**
 * Finmatrix Programmatic SEO Blog Engine
 * Reads strongly-typed articles from src/data/blogArticles.ts
 * Generates high-performance, mobile-responsive HTML pages with Schema.org JSON-LD,
 * Sticky Table of Contents, Lead Capture Embeds, and FAQ accordions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_ARTICLES } from '../src/data/blogArticles.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'articles');

const siteConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'config', 'site.json'), 'utf8'));

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateArticleHtml(article) {
  const canonicalUrl = `${siteConfig.domain}/articles/${article.slug}.html`;

  // Build FAQ Accordion HTML
  const faqsHtml = article.faqs.map(faq => `
    <details class="faq-item">
      <summary class="faq-question">
        <span>${escapeHtml(faq.question)}</span>
        <span class="faq-icon">+</span>
      </summary>
      <div class="faq-answer">
        <p>${escapeHtml(faq.answer)}</p>
      </div>
    </details>
  `).join('\n');

  // Replace FAQ container in content
  let fullContent = article.content.replace(
    '<div class="faq-accordion-container">\n    <!-- Populated automatically from faqs array -->\n  </div>',
    `<div class="faq-accordion-container">\n${faqsHtml}\n  </div>`
  );

  // If replacement didn't match exactly, fallback append
  if (!fullContent.includes('faq-item')) {
    fullContent = fullContent.replace(
      '<div class="faq-accordion-container">',
      `<div class="faq-accordion-container">\n${faqsHtml}`
    );
  }

  // Build ToC Sidebar HTML
  const tocHtml = article.tableOfContents.map(item => `
    <li>
      <a href="#${item.id}" class="toc-link">${escapeHtml(item.text)}</a>
    </li>
  `).join('\n');

  // Schema.org Graph JSON-LD
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.domain}/#website`,
        "url": siteConfig.domain,
        "name": siteConfig.name,
        "publisher": {
          "@id": `${siteConfig.domain}/#organization`
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.domain}/#organization`,
        "name": siteConfig.organization.name,
        "url": siteConfig.organization.url,
        "logo": siteConfig.organization.logo
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${siteConfig.domain}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Guides",
            "item": `${siteConfig.domain}/articles/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": article.title,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "headline": article.title,
        "description": article.metaDescription,
        "image": `${siteConfig.domain}${article.coverImage}`,
        "datePublished": article.publishedDate,
        "dateModified": article.modifiedDate,
        "inLanguage": "en-US",
        "mainEntityOfPage": canonicalUrl,
        "author": {
          "@type": "Person",
          "name": article.author.name,
          "jobTitle": article.author.role
        },
        "publisher": {
          "@type": "Organization",
          "name": siteConfig.name,
          "logo": {
            "@type": "ImageObject",
            "url": siteConfig.organization.logo
          }
        },
        "keywords": [
          article.targetKeywords.primary,
          ...article.targetKeywords.secondary
        ].join(', ')
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": article.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- Primary Meta Tags -->
<title>${escapeHtml(article.title)} | Finmatrix</title>
<meta name="description" content="${escapeHtml(article.metaDescription)}">
<meta name="keywords" content="${escapeHtml([article.targetKeywords.primary, ...article.targetKeywords.secondary].join(', '))}">
<meta name="author" content="${escapeHtml(article.author.name)}">
<link rel="canonical" href="${canonicalUrl}">

<!-- Search Engine Robots Directives -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<!-- Web Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">

<!-- Master & Blog Stylesheets -->
<link rel="stylesheet" href="/css/style.css?v=20261105">
<link rel="stylesheet" href="/css/blog.css?v=20261105">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="article">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:site_name" content="Finmatrix">
<meta property="og:title" content="${escapeHtml(article.title)}">
<meta property="og:description" content="${escapeHtml(article.metaDescription)}">
<meta property="og:image" content="${siteConfig.domain}${article.coverImage}">
<meta property="article:published_time" content="${article.publishedDate}">
<meta property="article:modified_time" content="${article.modifiedDate}">
<meta property="article:section" content="${escapeHtml(article.category)}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(article.title)}">
<meta name="twitter:description" content="${escapeHtml(article.metaDescription)}">
<meta name="twitter:image" content="${siteConfig.domain}${article.coverImage}">

<!-- Favicon & Touch Icons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="theme-color" content="#0d1117">

<!-- Structured Data JSON-LD (@graph) -->
<script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
</script>
</head>
<body>

<!-- Global Navigation -->
<nav>
  <a href="/" class="nav-logo">Finmatrix <span class="nav-logo-badge">PRO</span></a>
  <div class="nav-links">
    <a href="/">🏠 Home</a>
    <a href="/calculators/">🧮 Calculators</a>
    <a href="/articles/" class="active">📖 Articles</a>
    <a href="/downloads/">📥 Free Excel &amp; Downloads</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
    <button class="theme-toggle theme-toggle-btn" onclick="toggleTheme()">☀️ Light Mode</button>
    <a href="/calculators/" class="nav-cta">Explore Tools →</a>
  </div>
  <button class="menu-btn" onclick="toggleMobileMenu()">☰ Menu</button>
</nav>

<div class="blog-page">
  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb" style="margin-bottom:24px;">
    <a href="/">Home</a> <span class="sep">/</span> 
    <a href="/articles/">Guides</a> <span class="sep">/</span> 
    <span>${escapeHtml(article.title)}</span>
  </div>

  <!-- Article Header -->
  <header class="article-header">
    <span class="article-meta-badge">📖 ${escapeHtml(article.category)}</span>
    <h1 class="article-title">${escapeHtml(article.title)}</h1>
    <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>

    <div class="article-byline">
      <img src="${article.author.avatar}" alt="${escapeHtml(article.author.name)}" class="author-avatar" />
      <div>
        <strong>${escapeHtml(article.author.name)}</strong> • <span>${escapeHtml(article.author.role)}</span>
      </div>
      <div>•</div>
      <time datetime="${article.publishedDate}">Updated ${article.modifiedDate}</time>
      <div>•</div>
      <span>⏱️ ${article.readTime}</span>
    </div>
  </header>

  <!-- Two-Column Grid: Sticky ToC + Main Article Content -->
  <div class="article-grid">
    <aside class="toc-sidebar">
      <div class="toc-title">
        <span>📑</span> <span>Table of Contents</span>
      </div>
      <ul class="toc-list">
        ${tocHtml}
      </ul>
    </aside>

    <main class="article-content">
      ${fullContent}
    </main>
  </div>
</div>

<!-- Global Footer -->
<footer style="background:var(--bg2);border-top:1px solid var(--border);padding:60px 20px 40px 20px;margin-top:80px;text-align:center;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:var(--font-heading);font-size:20px;font-weight:700;color:var(--text);margin-bottom:12px;">Finmatrix Financial Research Desk</p>
    <p style="font-size:14px;color:var(--text-muted);max-width:680px;margin:0 auto 24px auto;line-height:1.6;">
      Free, privacy-first personal finance calculators, debt payoff engines, and wealth planning tools. 100% client-side calculation with zero sign-up.
    </p>
    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--text-muted);margin-bottom:28px;">
      <a href="/calculators/" style="color:var(--text-muted);text-decoration:none;">Calculators</a>
      <a href="/articles/" style="color:var(--text-muted);text-decoration:none;">Educational Guides</a>
      <a href="/editorial-policy.html" style="color:var(--text-muted);text-decoration:none;">Editorial Policy</a>
      <a href="/privacy-policy.html" style="color:var(--text-muted);text-decoration:none;">Privacy Policy</a>
      <a href="/terms-of-service.html" style="color:var(--text-muted);text-decoration:none;">Terms of Service</a>
      <a href="/disclaimer.html" style="color:var(--text-muted);text-decoration:none;">Financial Disclaimer</a>
      <a href="/contact.html" style="color:var(--text-muted);text-decoration:none;">Contact</a>
    </div>
    <p style="font-size:12px;color:#64748b;">
      &copy; 2026 Finmatrix. For informational and educational purposes only. Not licensed investment, legal, or tax advice.
    </p>
  </div>
</footer>

<!-- Interactive Scripts -->
<script src="/js/main.js"></script>
<script src="/js/lead-capture.js?v=20261106_v3"></script>
<script>
// 1. Copy Code & Formula Helper
function copyCodeSnippet(button) {
  const wrapper = button.closest('.code-block-wrapper');
  if (!wrapper) return;
  const code = wrapper.querySelector('code');
  if (!code) return;

  navigator.clipboard.writeText(code.innerText.trim()).then(() => {
    const originalText = button.innerText;
    button.innerText = 'Copied!';
    button.style.background = '#00d4aa';
    button.style.color = '#080c10';
    setTimeout(() => {
      button.innerText = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  });
}

// 2. Sticky ToC Active Scroll Spy
document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.article-section');

  function onScroll() {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
</script>
</body>
</html>`;
}

function generateArticlesHubHtml(articles) {
  const cardsHtml = Object.values(articles).map(a => `
    <article style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s ease, border-color 0.2s ease;text-align:left;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:4px 10px;background:rgba(0,212,170,0.12);color:var(--accent);border-radius:999px;">
            ${escapeHtml(a.category)}
          </span>
          <span style="font-size:12px;color:var(--text-muted);">⏱️ ${a.readTime}</span>
        </div>
        <h2 style="font-family:var(--font-heading);font-size:1.35rem;font-weight:700;color:var(--text);margin-bottom:10px;line-height:1.3;">
          <a href="/articles/${a.slug}.html" style="color:var(--text);text-decoration:none;">${escapeHtml(a.title)}</a>
        </h2>
        <p style="font-size:14px;color:var(--text-muted);line-height:1.6;margin-bottom:20px;">
          ${escapeHtml(a.excerpt)}
        </p>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border-subtle);font-size:12px;color:var(--text-muted);">
        <span>By ${escapeHtml(a.author.name)}</span>
        <a href="/articles/${a.slug}.html" style="color:var(--accent);text-decoration:none;font-weight:700;">Read Guide &rarr;</a>
      </div>
    </article>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Financial Strategy Guides & Research | Finmatrix</title>
<meta name="description" content="Deep-dive personal finance strategy guides, payoff roadmaps, and quantitative research from the Finmatrix Financial Research Desk.">
<link rel="canonical" href="https://finmatrix.cloud/articles/">
<meta name="robots" content="index, follow">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css?v=20261105">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>

<nav>
  <a href="/" class="nav-logo">Finmatrix <span class="nav-logo-badge">PRO</span></a>
  <div class="nav-links">
    <a href="/">🏠 Home</a>
    <a href="/calculators/">🧮 Calculators</a>
    <a href="/articles/" class="active">📖 Articles</a>
    <a href="/downloads/">📥 Free Excel &amp; Downloads</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
    <button class="theme-toggle theme-toggle-btn" onclick="toggleTheme()">☀️ Light Mode</button>
    <a href="/calculators/" class="nav-cta">Explore Tools →</a>
  </div>
  <button class="menu-btn" onclick="toggleMobileMenu()">☰ Menu</button>
</nav>

<div style="max-width:1200px;margin:0 auto;padding:40px 20px 80px 20px;">
  <div style="text-align:center;margin-bottom:48px;">
    <span class="chip green" style="margin-bottom:12px;display:inline-block;">📚 Educational Hub</span>
    <h1 style="font-family:var(--font-heading);font-size:clamp(2rem,4vw,2.8rem);font-weight:800;color:var(--text);margin-bottom:14px;">
      Financial Strategy Guides & Roadmaps
    </h1>
    <p style="font-size:1.1rem;color:var(--text-muted);max-width:680px;margin:0 auto;line-height:1.6;">
      Actionable mathematical guides, debt elimination frameworks, and retirement strategies written by quantitative researchers.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:28px;">
    ${cardsHtml}
  </div>
</div>

<footer style="background:var(--bg2);border-top:1px solid var(--border);padding:60px 20px 40px 20px;text-align:center;">
  <div style="max-width:1100px;margin:0 auto;">
    <p style="font-family:var(--font-heading);font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px;">Finmatrix Financial Research Desk</p>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">&copy; 2026 Finmatrix. All rights reserved.</p>
  </div>
</footer>

<script src="/js/main.js"></script>
</body>
</html>`;
}

// Build Pipeline Execution
console.log('--- Building Programmatic SEO Blog Articles ---');
os_mkdir_p(ARTICLES_DIR);

function os_mkdir_p(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let count = 0;
for (const [slug, article] of Object.entries(BLOG_ARTICLES)) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.html`);
  const html = generateArticleHtml(article);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[OK] Generated article: articles/${slug}.html (${html.length} bytes)`);
  count++;
}

// Generate Hub
const hubPath = path.join(ARTICLES_DIR, 'index.html');
const hubHtml = generateArticlesHubHtml(BLOG_ARTICLES);
fs.writeFileSync(hubPath, hubHtml, 'utf8');
console.log(`[OK] Generated articles hub: articles/index.html (${hubHtml.length} bytes)`);

console.log(`Successfully built ${count} articles and articles hub.`);
