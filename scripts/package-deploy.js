/**
 * Finmatrix Production Deployment Packaging Script
 * Assembles all production web assets into a clean, ready-to-upload zip file.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const STAGING_DIR = path.join(ROOT_DIR, 'dist-deploy');
const ZIP_NAME = 'finmatrix-production-deploy.zip';
const ZIP_PATH = path.join(ROOT_DIR, ZIP_NAME);

console.log('--- Preparing Finmatrix Production Deployment Package ---');

// 1. Clean previous staging or zip
if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

// 2. Production Files & Directories to include
const filesToCopy = [
  'index.html',
  'about.html',
  'contact.html',
  'editorial-policy.html',
  'privacy-policy.html',
  'terms-of-service.html',
  'disclaimer.html',
  'metrics-tracker.html',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  'favicon.svg',
  'site.webmanifest',
  '_headers',
  '_redirects',
  'netlify.toml',
  '.htaccess',
  'subscribe.php',
  'llms.txt',
  'llms-full.txt'
];

const dirsToCopy = [
  'css',
  'js',
  'config',
  'calculators',
  'embed',
  'assets',
  'articles'
];

// Copy individual files
filesToCopy.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(STAGING_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Added file: ${file}`);
  } else {
    console.warn(`! File not found: ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const src = path.join(ROOT_DIR, dir);
  const dest = path.join(STAGING_DIR, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✓ Added directory: ${dir}/`);
  } else {
    console.warn(`! Directory not found: ${dir}`);
  }
});

// 3. Compress into zip using PowerShell
console.log(`\nCompressing files into ${ZIP_NAME}...`);
try {
  // Use PowerShell Compress-Archive
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });

  // Also create finmatrix-deployment.zip copy for convenience
  const altZipPath = path.join(ROOT_DIR, 'finmatrix-deployment.zip');
  fs.copyFileSync(ZIP_PATH, altZipPath);

  const stats = fs.statSync(ZIP_PATH);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  const sizeKb = (stats.size / 1024).toFixed(0);

  console.log(`\n========================================`);
  console.log(` SUCCESS: Deployable zip created!`);
  console.log(` File: ${ZIP_NAME} (${sizeKb} KB / ${sizeMb} MB)`);
  console.log(` Path: ${ZIP_PATH}`);
  console.log(` Also updated: finmatrix-deployment.zip`);
  console.log(`========================================\n`);
} catch (err) {
  console.error('Compression failed:', err);
  process.exit(1);
} finally {
  // Clean up staging directory
  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
}
