const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const EXCLUDED_DIRS = new Set(['.git', '.github', 'node_modules', 'workflows', 'tests', 'src', 'scripts']);
const EXCLUDED_FILES = new Set(['package.json', 'package-lock.json', 'README.md', 'ELI5_GUIDE.md', 'PLAYBOOK.md', 'GROWTH_ROUTINE.md', 'probe-result.json']);
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
    
    const rootPwd = await client.pwd();
    console.log('✅ Connected! Root working directory:', rootPwd);

    const rootDir = path.resolve(__dirname, '..');

    function getAllFiles(dir, baseDir = '') {
      let results = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (EXCLUDED_DIRS.has(entry.name)) continue;
          results = results.concat(getAllFiles(path.join(dir, entry.name), path.join(baseDir, entry.name)));
        } else if (entry.isFile()) {
          if (EXCLUDED_FILES.has(entry.name)) continue;
          const ext = path.extname(entry.name).toLowerCase();
          if (EXCLUDED_EXTS.has(ext)) continue;
          results.push(path.join(baseDir, entry.name).replace(/\\/g, '/'));
        }
      }
      return results;
    }

    const files = getAllFiles(rootDir);
    console.log(`📦 Found ${files.length} production files to sync to Hostinger.`);

    let uploadedCount = 0;
    for (const relPath of files) {
      const fullLocalPath = path.join(rootDir, relPath);
      const remoteDir = path.posix.dirname(relPath);
      const fileName = path.posix.basename(relPath);

      if (remoteDir && remoteDir !== '.') {
        const targetDir = rootPwd === '/' ? `/${remoteDir}` : `${rootPwd}/${remoteDir}`;
        await client.ensureDir(targetDir);
      } else {
        await client.cd(rootPwd);
      }

      await client.uploadFrom(fullLocalPath, fileName);
      uploadedCount++;
      if (uploadedCount % 10 === 0 || uploadedCount === files.length) {
        console.log(`  ⬆️ Synced [${uploadedCount}/${files.length}]: ${relPath}`);
      }
    }

    console.log('\n🎉 ALL FILES SUCCESSFULLY DEPLOYED TO HOSTINGER!');
  } catch (err) {
    console.error('❌ Deployment error:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
