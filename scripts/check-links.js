const fs = require('fs');
const path = require('path');

function getAppRoutes() {
  const routes = new Set();
  function walk(dir, currentRoute) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full, currentRoute + '/' + f);
      } else if (f === 'page.tsx' || f === 'page.js') {
        routes.add(currentRoute || '/');
      }
    }
  }
  walk('src/app', '');
  return routes;
}

const appRoutes = getAppRoutes();
console.log('Valid App Routes (' + appRoutes.size + ' total):');
console.log(Array.from(appRoutes).sort());

// Now find all hrefs in src
const hrefs = [];
function findHrefs(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findHrefs(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/href=["'](\/[^"'#?]*)/g);
      for (const m of matches) {
        hrefs.push({ file: full, href: m[1] });
      }
    }
  }
}
findHrefs('src');

console.log('\nChecking all internal hrefs against appRoutes:');
let invalidCount = 0;
const invalidLinks = [];
for (const item of hrefs) {
  const clean = item.href;
  if (clean.startsWith('/api') || clean.startsWith('/brand') || clean.startsWith('/_next') || clean.startsWith('/favicon')) continue;
  
  const isMatch = Array.from(appRoutes).some(r => {
    if (r === clean) return true;
    if (r.includes('[') && clean.startsWith(r.split('[')[0])) return true;
    return false;
  });
  
  if (!isMatch) {
    console.log('INVALID LINK:', item.href, 'in file:', item.file);
    invalidLinks.push(item);
    invalidCount++;
  }
}
console.log('Total invalid internal links found:', invalidCount);

