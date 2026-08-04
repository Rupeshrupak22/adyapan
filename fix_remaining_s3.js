const fs = require('fs');
const path = require('path');

const files = [
  'd:\\GANJA\\src\\app\\(student)\\certifications\\[slug]\\page.tsx',
  'd:\\GANJA\\src\\app\\(student)\\marketplace\\page.tsx',
  'd:\\GANJA\\src\\components\\TestimonialsSection.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Add import if missing
  if (!content.includes("from '@/lib/s3Url'") && !content.includes('from "@/lib/s3Url"')) {
    // Find first import line
    const importMatch = content.match(/^import .*? from .*?;/m);
    if (importMatch) {
      content = content.replace(importMatch[0], `import { s3Url } from '@/lib/s3Url';\n${importMatch[0]}`);
    }
  }

  // Replace string literals '/images/...', '/videos/...', '/logos/...' NOT already in s3Url()
  // Step 1: Replace in object properties like logo: '/logos/...'
  const propRegex = /(?<!s3Url\()(['"])(\/(?:images|videos|logos)\/[^'"]+)\1/g;
  content = content.replace(propRegex, (match, quote, path) => {
    return `s3Url('${path}')`;
  });

  // Step 2: Fix JSX attributes like src=s3Url('...') -> src={s3Url('...')}
  const jsxAttrRegex = /(src|poster|href)=s3Url\('([^']+)'\)/g;
  content = content.replace(jsxAttrRegex, '$1={s3Url(\'$2\')}');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes needed for ${file}`);
  }
}
