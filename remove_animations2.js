const fs = require('fs');
const path = require('path');

const SKIP_PATTERNS = [
  'HeroSection.tsx', 'HowItWorksSection.tsx', 'FeaturesSection.tsx',
  'GallerySection.tsx', 'TestimonialsSection.tsx', 'GlobalCertificationPartners.tsx',
  'CertificationsSection.tsx', 'CertificateShowcaseSection.tsx', 'MorphText.tsx',
  'Mascot.tsx', 'Navbar.tsx', 'WelcomePopup.tsx', 'CookieConsent.tsx',
  'AuthModal.tsx', 'PricingModal.tsx', 'CertificationEnrollModal.tsx',
  'ProfileDropdown.tsx', '.next', 'node_modules', 'portal',
  'superadmin', 'admin', 'organization',
];

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(p => filePath.includes(p));
}

function walk(dir) {
  let results = [];
  try {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      if (shouldSkip(p)) return;
      if (fs.statSync(p).isDirectory()) results = results.concat(walk(p));
      else if (f.endsWith('.tsx')) results.push(p);
    });
  } catch(e) {}
  return results;
}

const files = walk('d:\\GANJA\\src');
let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove variants={...} props (can be multi-line with nested objects)
  // Simple single-line variants
  content = content.replace(/\s+variants=\{[^}]*\}/g, '');
  // Multi-line variants with nested objects like variants={staggerContainer(...)}
  content = content.replace(/\s+variants=\{[^}]*\([^)]*\)[^}]*\}/g, '');
  
  // Remove whileHover={...} that my previous script missed (nested objects)
  content = content.replace(/\s+whileHover=\{[^}]*\}/g, '');
  content = content.replace(/\s+whileHover=\{\{[^}]*\}[^}]*\}/g, '');
  
  // Remove whileTap={...}
  content = content.replace(/\s+whileTap=\{[^}]*\}/g, '');
  content = content.replace(/\s+whileTap=\{\{[^}]*\}[^}]*\}/g, '');

  // Remove remaining animation props that use {} or {{}}  
  // Handle nested double braces like whileHover={{ scale: 1.05, boxShadow: '...' }}
  content = content.replace(/\s+whileHover=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+whileTap=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+initial=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+animate=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+exit=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+whileInView=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+viewport=\{\{[\s\S]*?\}\}/g, '');
  content = content.replace(/\s+transition=\{\{[\s\S]*?\}\}/g, '');
  
  // Remove variants with function calls like variants={staggerContainer(0.15, 0.1)}
  content = content.replace(/\s+variants=\{\w+\([^)]*\)\}/g, '');
  content = content.replace(/\s+variants=\{\w+\}/g, '');

  // Remove unused framer-motion imports
  if (!content.includes('motion.') && !content.includes('AnimatePresence') && 
      !content.includes('useScroll') && !content.includes('useSpring') && 
      !content.includes('useTransform') && !content.includes('useAnimation')) {
    content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]framer-motion['"];?\s*\n?/g, '');
  }

  // Remove unused variant definitions
  // Remove const fadeUp = { ... };
  content = content.replace(/const\s+fadeUp\s*=\s*\{[\s\S]*?\};\s*\n/g, '');
  content = content.replace(/const\s+fadeIn\s*=\s*\{[\s\S]*?\};\s*\n/g, '');
  // Remove staggerContainer function if no longer used
  if (!content.includes('staggerContainer(')) {
    content = content.replace(/const\s+staggerContainer\s*=[\s\S]*?\);\s*\n/g, '');
  }
  // Remove customEase if not used
  if (!content.includes('customEase') || (content.match(/customEase/g) || []).length <= 1) {
    content = content.replace(/const\s+customEase\s*=\s*\[[^\]]*\]\s*(as\s+const)?;\s*\n/g, '');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nTotal files fixed: ${totalChanges}`);
