const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist') continue;
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(path.resolve(__dirname, '..'));
let updatedCount = 0;

for (const f of htmlFiles) {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content;
  
  // Replace /css/style.css with /css/style.css?v=20261022
  newContent = newContent.replace(/href="\/css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261022"');
  newContent = newContent.replace(/href="css\/style\.css(\?[^"]*)?"/g, 'href="/css/style.css?v=20261022"');

  if (newContent !== content) {
    fs.writeFileSync(f, newContent, 'utf8');
    updatedCount++;
  }
}

console.log(`Updated cache-buster in ${updatedCount} HTML files.`);
