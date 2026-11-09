const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function debug() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  const rawServer = process.env.FTP_SERVER || '';
  const host = rawServer.replace(/^[^/]*\/\//, '').replace(/\/.*$/, '').trim();
  const user = (process.env.FTP_USERNAME || '').trim();
  const password = process.env.FTP_PASSWORD || '';

  const report = {};

  try {
    await client.access({
      host,
      user,
      password,
      port: 21,
      secure: false
    });
    
    report.initialPwd = await client.pwd();
    const rootList = await client.list();
    report.rootItems = rootList.map(f => (f.isDirectory ? '[D] ' : '') + f.name);

    // Try going up to parent directory
    try {
      await client.cd('..');
      report.parentPwd = await client.pwd();
      const parentList = await client.list();
      report.parentItems = parentList.map(f => (f.isDirectory ? '[D] ' : '') + f.name);

      if (parentList.some(f => f.name === 'domains')) {
        await client.cd('domains');
        report.domainsPwd = await client.pwd();
        const domList = await client.list();
        report.domainsItems = domList.map(f => f.name);

        for (const dom of domList) {
          if (dom.isDirectory) {
            try {
              const domSubs = await client.list(dom.name);
              report['domains_' + dom.name] = domSubs.map(f => f.name);
            } catch(e){}
          }
        }
      }
    } catch(err) {
      report.parentError = err.message;
    }
  } catch (err) {
    report.connectError = err.message;
  } finally {
    client.close();
    fs.writeFileSync('ftp-diagnostic.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  }
}

debug();
