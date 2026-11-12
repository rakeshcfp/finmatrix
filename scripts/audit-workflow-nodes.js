import fs from 'fs';

const wf = JSON.parse(fs.readFileSync('workflows/finmatrix-pinterest-marketing-automation.json', 'utf8'));

console.log('--- WORKFLOW NODES AUDIT ---');
console.log(`Total nodes: ${wf.nodes.length}`);

const nodeNames = new Set(wf.nodes.map(n => n.name));

for (const n of wf.nodes) {
  console.log(`- [${n.type}] ${n.name}`);
  const str = JSON.stringify(n.parameters);
  const matches = str.match(/\$\('([^']+)'\)/g);
  if (matches) {
    for (const m of matches) {
      const referencedNode = m.slice(3, -2);
      if (nodeNames.has(referencedNode)) {
        console.log(`    ✓ Valid ref: $('${referencedNode}')`);
      } else {
        console.error(`    ❌ INVALID REF: $('${referencedNode}') DOES NOT EXIST IN WORKFLOW!`);
      }
    }
  }
}

console.log('\n--- CONNECTION TARGET AUDIT ---');
let hasConnError = false;
for (const [src, conns] of Object.entries(wf.connections)) {
  if (!nodeNames.has(src)) {
    console.error(`❌ Connection source node does not exist: "${src}"`);
    hasConnError = true;
  }
  for (const list of conns.main || []) {
    for (const target of list) {
      if (!nodeNames.has(target.node)) {
        console.error(`❌ Connection target node does not exist: "${target.node}" (from "${src}")`);
        hasConnError = true;
      }
    }
  }
}

if (!hasConnError) {
  console.log('✓ All connections valid!');
}
