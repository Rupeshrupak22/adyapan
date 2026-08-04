const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) results = results.concat(walk(p));
      else if (f.endsWith('.tsx')) results.push(p);
    });
  } catch(e) {}
  return results;
}

const files = walk('d:\\GANJA\\src');
const found = [];

files.forEach(f => {
  // Skip .next and node_modules
  if (f.includes('.next') || f.includes('node_modules')) return;
  
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Skip lines that already have s3Url
    if (line.includes('s3Url')) return;
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    const re = /['"](\/(images|videos|logos)\/[^'"]+)['"]/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      found.push({ file: f, line: i + 1, path: m[1], content: line.trim() });
      console.log(`${f}:${i+1}: ${line.trim()}`);
    }
  });
});

if (found.length === 0) {
  console.log('All media paths are wrapped with s3Url!');
} else {
  console.log(`\nFound ${found.length} unwrapped media paths`);
}
