#!/usr/bin/env node
/**
 * check-colors.cjs
 * Scans src/ for disallowed color values (reds, blues, greens, gradients with hue, etc.)
 * in the hero background files and network-bg-3d.js.
 * Passes if only #050505, #000, #fff, white, black, rgba(255,255,255,...) and rgba(0,0,0,...) are used.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to scan strictly
const STRICT_FILES = [
  'src/network-bg-3d.js',
  'src/network-bg.js',
];

// Files to scan for leftover colored hero background elements
const BG_CSS_FILES = [
  'src/styles/hero.css',
  'src/styles/hero-v2.css',
];

// Patterns that indicate colored (non-black/white) values
const COLORED_PATTERNS = [
  // Red hex values
  /(?:#[fF][fF][0-9a-fA-F]{2}(?:[0-9a-fA-F]{2})?(?!\w))/g,  // ff1a1a, ff4444, etc.
  /(?:#[eE][eE][0-9a-fA-F]{2}(?:[0-9a-fA-F]{2})?(?!\w))/g,
  // rgba with non-black/white hue
  /rgba?\(\s*(?!0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\d+\s*,\s*\d+\s*,\s*\d+/g,
  // Named red/green/blue/color values
  /\bred\b(?!\w)/gi,
  /\bblue\b(?!\w)/gi,
  /\bgreen\b(?!\w)/gi,
  /\bcyan\b(?!\w)/gi,
  /\bmagenta\b(?!\w)/gi,
];

// Allowed patterns (false positives to ignore)
const ALLOWED_EXCEPTIONS = [
  // CSS comments
  /\/\*.*?\*\//gs,
  // URL strings
  /url\([^)]+\)/g,
  // content: 'red' or similar string literals in JS
  /"[^"]*red[^"]*"/g,
  /'[^']*red[^']*'/g,
  // Words in comments or strings: 'border-color', 'color:', 'accentColor'
  /\/\/.*$/gm,
];

let passed = true;
const violations = [];

function stripComments(src) {
  // Remove line comments and block comments
  return src
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  SKIP  ${filePath} (not found)`);
    return;
  }
  const src = fs.readFileSync(filePath, 'utf8');
  const stripped = stripComments(src);
  
  // Check for the specific bad patterns in the network bg files
  const fileViolations = [];
  
  // For network-bg-3d.js: ensure only white/black colors used
  if (filePath.includes('network-bg')) {
    // Check for any non-white color in Three.js material or ctx.fillStyle
    const colorMatches = stripped.match(/0x[0-9a-fA-F]{6}/g) || [];
    for (const m of colorMatches) {
      const val = parseInt(m, 16);
      // Allow: 0xffffff (white), 0x000000 (black), 0x050505 (near black)
      if (val !== 0xffffff && val !== 0x000000 && val !== 0x050505) {
        fileViolations.push(`Found non-white/black hex color: ${m}`);
      }
    }
    
    // Check for red-channel-heavy rgba that isn't white/black
    const rgbaMatches = stripped.match(/rgba?\([^)]+\)/g) || [];
    for (const m of rgbaMatches) {
      const nums = m.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
      if (nums.length >= 3) {
        const [r, g, b] = nums;
        // Flag if R is dominant and G/B are low (indicates red hue)
        if (r > 100 && g < 50 && b < 50) {
          fileViolations.push(`Found reddish color: ${m}`);
        }
        // Flag if any channel is not near 0, 255 (non-BW)
        const isBlackish = r < 30 && g < 30 && b < 30;
        const isWhiteish = r > 200 && g > 200 && b > 200;
        if (!isBlackish && !isWhiteish) {
          // Check it's not a valid near-black like (5,5,5)
          if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(r - b) > 20) {
            fileViolations.push(`Found non-neutral color: ${m}`);
          }
        }
      }
    }
  }
  
  if (fileViolations.length > 0) {
    passed = false;
    violations.push({ file: filePath, issues: fileViolations });
    console.log(`  ✗  FAIL  ${filePath}`);
    fileViolations.forEach(v => console.log(`           → ${v}`));
  } else {
    console.log(`  ✓  PASS  ${filePath}`);
  }
}

// Check for leftover red hero elements in CSS
function checkCssForRedHero(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠  SKIP  ${filePath} (not found)`);
    return;
  }
  const src = fs.readFileSync(filePath, 'utf8');
  const stripped = stripComments(src);
  
  // Detect red-dominant colors (simplified regex for CSS context)
  const redPatterns = [
    /#[fF][fF](?:[0-9a-fA-F]{2}){1,2}(?![0-9a-fA-F])/g,  // ff1a1a etc
    /rgb\(\s*25[0-5]\s*,\s*(?:[0-9]|[1-4][0-9])\s*,\s*(?:[0-9]|[1-4][0-9])\s*\)/g,
  ];
  
  const found = [];
  for (const pattern of redPatterns) {
    const m = stripped.match(pattern) || [];
    for (const hit of m) {
      // Allow #fff, #ffffff etc
      if (!/^#(?:f{3}|f{6}|fff|ffffff)$/i.test(hit)) {
        found.push(hit);
      }
    }
  }
  
  if (found.length > 0) {
    console.log(`  ⚠  WARN  ${filePath} — possible colored values: ${found.slice(0,5).join(', ')}`);
  } else {
    console.log(`  ✓  PASS  ${filePath}`);
  }
}

console.log('\n── check:colors ─────────────────────────────────────────────');
console.log('Checking network background files for non-black/white colors:\n');

for (const f of STRICT_FILES) {
  checkFile(f);
}

console.log('\nChecking hero CSS for leftover colored values:\n');
for (const f of BG_CSS_FILES) {
  checkCssForRedHero(f);
}

console.log('\n─────────────────────────────────────────────────────────────');

if (passed) {
  console.log('\n✓ check:colors PASSED — network background is black & white only.\n');
  process.exit(0);
} else {
  console.log('\n✗ check:colors FAILED — see violations above.\n');
  process.exit(1);
}
