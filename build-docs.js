#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

console.log('📚 Building docs for GitHub Pages...');

// Ensure docs directory exists
const docsDir = 'docs';
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
  console.log('✅ Created docs directory');
}

// Copy necessary files to docs
const filesToCopy = [
  { source: 'index.html', dest: 'index.html' }, // Copy from root
  { source: 'dist/gofakeit.iife.js', dest: 'gofakeit.iife.js' }, // Copy from dist
];

console.log('📋 Copying files to docs...');
filesToCopy.forEach(file => {
  const sourcePath = file.source;
  const destPath = join(docsDir, file.dest);

  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file.dest}`);
  } else {
    console.warn(`⚠️  Warning: ${file.source} not found`);
  }
});

// Fix the import path in index.html for GitHub Pages
const htmlPath = join(docsDir, 'index.html');
if (existsSync(htmlPath)) {
  let htmlContent = readFileSync(htmlPath, 'utf8');
  htmlContent = htmlContent.replace(
    'src="/gofakeit.iife.js"',
    'src="./gofakeit.iife.js"'
  );
  writeFileSync(htmlPath, htmlContent);
  console.log('✅ Fixed import path in index.html');
}

console.log('🎉 Docs build complete!');
console.log('📁 Files in docs/:', filesToCopy.join(', '));
