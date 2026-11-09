/**
 * Finmatrix Global Navbar Updater
 * Ensures all HTML pages across the site feature the unified navigation:
 *   Home | Calculators | Articles | Excel & Downloads | About | Contact | Light Mode | Explore Tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function getNavHtml(activeTab) {
  return `<div class="nav-links">
    <a href="/" ${activeTab === 'home' ? 'class="active"' : ''}>🏠 Home</a>
    <a href="/calculators/" ${activeTab === 'calculators' ? 'class="active"' : ''}>🧮 Calculators</a>
    <a href="/articles/" ${activeTab === 'articles' ? 'class="active"' : ''}>📖 Articles</a>
    <a href="/downloads/" ${activeTab === 'downloads' ? 'class="active"' : ''}>📥 Free Excel &amp; Downloads</a>
    <a href="/about.html" ${activeTab === 'about' ? 'class="active"' : ''}>About</a>
    <a href="/contact.html" ${activeTab === 'contact' ? 'class="active"' : ''}>Contact</a>
    <button class="theme-toggle theme-toggle-btn" onclick="toggleTheme()">☀️ Light Mode</button>
    <a href="/calculators/" class="nav-cta">Explore Tools →</a>
  </div>`;
}

function processDirectory(dirPath, activeTab) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'embed'].includes(entry.name)) continue;
      // Recurse into subdirectories
      let subTab = activeTab;
      if (entry.name === 'calculators') subTab = 'calculators';
      else if (entry.name === 'articles') subTab = 'articles';
      else if (entry.name === 'downloads') subTab = 'downloads';
      processDirectory(fullPath, subTab);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      updateFileNav(fullPath, activeTab);
    }
  }
}

function updateFileNav(filePath, dirDefaultTab) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<nav>') && !content.includes('<nav ')) return;

  const fileName = path.basename(filePath);
  let activeTab = dirDefaultTab;

  if (fileName === 'index.html' && path.dirname(filePath) === ROOT_DIR) {
    activeTab = 'home';
  } else if (fileName === 'about.html') {
    activeTab = 'about';
  } else if (fileName === 'contact.html') {
    activeTab = 'contact';
  } else if (filePath.includes(path.sep + 'calculators' + path.sep)) {
    activeTab = 'calculators';
  } else if (filePath.includes(path.sep + 'articles' + path.sep)) {
    activeTab = 'articles';
  } else if (filePath.includes(path.sep + 'downloads' + path.sep)) {
    activeTab = 'downloads';
  }

  // Regex replace <div class="nav-links">...</div>
  const navLinksRegex = /<div class="nav-links">[\s\S]*?<\/div>/;
  if (navLinksRegex.test(content)) {
    content = content.replace(navLinksRegex, getNavHtml(activeTab));
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] Updated nav in: ${path.relative(ROOT_DIR, filePath)} (active: ${activeTab})`);
  }
}

// 1. Process root
const rootFiles = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
for (const f of rootFiles) {
  if (f.isFile() && f.name.endsWith('.html')) {
    updateFileNav(path.join(ROOT_DIR, f.name), 'home');
  }
}

// 2. Process subdirs
processDirectory(path.join(ROOT_DIR, 'calculators'), 'calculators');
processDirectory(path.join(ROOT_DIR, 'articles'), 'articles');
processDirectory(path.join(ROOT_DIR, 'downloads'), 'downloads');

console.log('--- All Navbars Updated Successfully ---');

