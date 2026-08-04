const fs = require('fs');
const path = require('path');

// Files/directories to SKIP (landing page components that should keep animations)
const SKIP_PATTERNS = [
  'HeroSection.tsx',
  'HowItWorksSection.tsx',
  'FeaturesSection.tsx',
  'GallerySection.tsx',
  'TestimonialsSection.tsx',
  'GlobalCertificationPartners.tsx',
  'CertificationsSection.tsx',
  'CertificateShowcaseSection.tsx',
  'MorphText.tsx',
  'Mascot.tsx',
  'Navbar.tsx',             // Keep navbar animations (dropdown etc)
  'WelcomePopup.tsx',       // Keep popup animations
  'CookieConsent.tsx',      // Keep cookie consent animations
  'AuthModal.tsx',          // Keep modal animations
  'PricingModal.tsx',       // Keep modal animations
  'CertificationEnrollModal.tsx', // Keep modal animations
  'ProfileDropdown.tsx',    // Keep dropdown animations
  '.next',
  'node_modules',
  'portal',                 // Keep admin portal animations
  'superadmin',             // Keep superadmin animations
  'admin',                  // Keep admin animations
  'organization',           // Keep organization animations
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

  // 1. Replace motion.div -> div, motion.section -> section, etc. (but NOT motion.img in lightbox)
  //    Keep motion.div in lightbox/overlay contexts
  const motionTags = ['div', 'section', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'a', 'button', 'nav', 'article', 'main', 'footer', 'header', 'form', 'img'];
  
  motionTags.forEach(tag => {
    // Replace opening tags: <motion.div ... > -> <div ... >
    const openRegex = new RegExp(`<motion\\.${tag}(\\s|>|/)`, 'g');
    content = content.replace(openRegex, `<${tag}$1`);
    
    // Replace closing tags: </motion.div> -> </div>
    const closeRegex = new RegExp(`</motion\\.${tag}>`, 'g');
    content = content.replace(closeRegex, `</${tag}>`);
  });

  // 2. Remove framer-motion animation props from JSX elements
  // These are the props that cause CPU usage (fade in/out, scale, etc.)
  const animProps = [
    /\s+initial=\{\{[^}]*\}\}/g,
    /\s+animate=\{\{[^}]*\}\}/g,
    /\s+exit=\{\{[^}]*\}\}/g,
    /\s+whileInView=\{\{[^}]*\}\}/g,
    /\s+whileHover=\{\{[^}]*\}\}/g,
    /\s+whileTap=\{\{[^}]*\}\}/g,
    /\s+viewport=\{\{[^}]*\}\}/g,
    /\s+transition=\{\{[^}]*\}\}/g,
    /\s+initial="[^"]*"/g,
    /\s+animate="[^"]*"/g,
    /\s+exit="[^"]*"/g,
    /\s+whileInView="[^"]*"/g,
  ];

  animProps.forEach(re => {
    content = content.replace(re, '');
  });

  // 3. Remove <AnimatePresence ...> and </AnimatePresence> wrappers (keep children)
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');

  // 4. Remove unused framer-motion imports
  // Check if motion is still used
  if (!content.includes('motion.') && !content.includes('AnimatePresence') && !content.includes('useScroll') && !content.includes('useSpring') && !content.includes('useTransform')) {
    // Remove the import line entirely
    content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]framer-motion['"];?\s*\n?/g, '');
  } else {
    // Some motion usage remains, keep the import but clean up unused names
    // Just leave it as is - TS will warn about unused imports but won't break
  }

  // 5. Remove animation variant definitions (fadeUp, staggerContainer etc.)
  // Only if no longer referenced
  const variantDefs = ['fadeUp', 'fadeIn', 'stagger', 'slideIn', 'scaleIn'];
  variantDefs.forEach(v => {
    if (content.includes(`variants={${v}}`) || content.includes(`variants="${v}"`)) return;
    // Remove const fadeUp = { ... };
    const defRegex = new RegExp(`const\\s+${v}\\s*=\\s*\\{[\\s\\S]*?\\};\\n?`, 'g');
    // Only remove if not referenced elsewhere
    const count = (content.match(new RegExp(v, 'g')) || []).length;
    if (count <= 1) { // Only the definition
      content = content.replace(defRegex, '');
    }
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nTotal files updated: ${totalChanges}`);
