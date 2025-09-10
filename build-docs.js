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

// Copy necessary files from dist to docs
const filesToCopy = ['index.html', 'gofakeit.iife.js'];

console.log('📋 Copying files to docs...');
filesToCopy.forEach(file => {
  const sourcePath = join('dist', file);
  const destPath = join(docsDir, file);

  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.warn(`⚠️  Warning: ${file} not found in dist/`);
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
