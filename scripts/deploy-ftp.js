const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const EXCLUDED_DIRS = new Set(['.git', '.github', 'node_modules', 'workflows', 'tests', 'src', 'scripts']);
const EXCLUDED_FILES = new Set(['package.json', 'package-lock.json', 'README.md', 'ELI5_GUIDE.md', 'PLAYBOOK.md', 'GROWTH_ROUTINE.md', 'probe-result.json', 'check-status.js']);
const EXCLUDED_EXTS = new Set(['.py', '.zip']);

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  const rawServer = process.env.FTP_SERVER || '';
  const host = rawServer.replace(/^[^/]*\/\//, '').replace(/\/.*$/, '').trim();
  const user = (process.env.FTP_USERNAME || '').trim();
  const password = process.env.FTP_PASSWORD || '';

  if (!host || !user || !password) {
    console.error('❌ Missing FTP credentials!');
    process.exit(1);
  }

  console.log(`🚀 Connecting to FTP Host: ${host} as ${user}...`);
  try {
    await client.access({
      host,
      user,
      password,
      port: 21,
      secure: false
    });
    
    const initialPwd = await client.pwd();
    console.log('✅ Connected! Root working directory:', initialPwd);

    // Clean up any accidental nested public_html directory if present
    try {
      const rootItems = await client.list();
      if (rootItems.some(f => f.name === 'public_html' && f.isDirectory)) {
        console.log('🧹 Removing accidental nested public_html directory...');
        await client.removeDir('public_html');
        console.log('✅ Cleaned up accidental nested public_html.');
      }
    } catch(e) {
      console.log('ℹ️ Nested folder notice:', e.message);
    }

    const rootDir = path.resolve(__dirname, '..');

    function getAllFiles(dir, prefix = '') {
      let results = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (EXCLUDED_DIRS.has(entry.name)) continue;
          results = results.concat(getAllFiles(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name));
        } else if (entry.isFile()) {
          if (EXCLUDED_FILES.has(entry.name)) continue;
          const ext = path.extname(entry.name).toLowerCase();
          if (EXCLUDED_EXTS.has(ext)) continue;
          results.push(prefix ? `${prefix}/${entry.name}` : entry.name);
        }
      }
      return results;
    }

    const files = getAllFiles(rootDir);
    console.log(`📦 Found ${files.length} production files to sync to Hostinger.`);

    await client.cd(initialPwd);

    let uploadedCount = 0;
    for (const relPath of files) {
      const fullLocalPath = path.join(rootDir, relPath);
      const remoteDir = path.posix.dirname(relPath);

      if (remoteDir !== '.') {
        await client.ensureDir(remoteDir);
        await client.cd(initialPwd);
      }

      await client.uploadFrom(fullLocalPath, relPath);
      uploadedCount++;
      if (uploadedCount % 15 === 0 || uploadedCount === files.length) {
        console.log(`  ⬆️ Synced [${uploadedCount}/${files.length}]: ${relPath}`);
      }
    }

    // Verify upload
    const artList = await client.list('articles');
    const hasArticle = artList.some(f => f.name === 'payment-calculator-with-interest.html');
    console.log(`\n🔍 Verification: payment-calculator-with-interest.html in articles/ => ${hasArticle ? '✅ FOUND' : '❌ NOT FOUND'}`);

    console.log('\n🎉 ALL FILES SUCCESSFULLY DEPLOYED TO HOSTINGER!');
  } catch (err) {
    console.error('❌ Deployment error:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
