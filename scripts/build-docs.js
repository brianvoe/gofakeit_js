#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('📚 Building docs for GitHub Pages...');

// Ensure docs directory exists
const docsDir = 'docs';
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
  console.log('✅ Created docs directory');
}

// Copy necessary files from dist to docs
const filesToCopy = [
  'index.html',
  'index.cjs'
];

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

console.log('🎉 Docs build complete!');
console.log('📁 Files in docs/:', filesToCopy.join(', '));
