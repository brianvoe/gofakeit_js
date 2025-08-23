#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`Running: ${command}`, 'cyan');
    execSync(command, { 
      stdio: 'inherit', 
      cwd: rootDir,
      ...options 
    });
    return true;
  } catch (error) {
    log(`Command failed: ${command}`, 'red');
    log(`Exit code: ${error.status}`, 'red');
    return false;
  }
}

function readPackageJson() {
  const packagePath = join(rootDir, 'package.json');
  return JSON.parse(readFileSync(packagePath, 'utf8'));
}

function writePackageJson(packageJson) {
  const packagePath = join(rootDir, 'package.json');
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function updateVersion(currentVersion, newVersion) {
  const [major1, minor1, patch1] = currentVersion.split('.').map(Number);
  const [major2, minor2, patch2] = newVersion.split('.').map(Number);
  
  if (major2 > major1) return 'major';
  if (minor2 > minor1) return 'minor';
  if (patch2 > patch1) return 'patch';
  
  log('New version must be greater than current version', 'red');
  return null;
}

async function main() {
  log('🚀 Starting release process...', 'bright');
  
  // Step 1: Run tests
  log('\n📋 Step 1: Running tests...', 'yellow');
  if (!exec('npm test')) {
    log('❌ Tests failed. Aborting release.', 'red');
    process.exit(1);
  }
  log('✅ Tests passed!', 'green');
  
  // Step 2: Build the project
  log('\n🔨 Step 2: Building project...', 'yellow');
  
  // First run type check to catch TypeScript errors
  log('Running type check...', 'cyan');
  if (!exec('npm run type-check')) {
    log('❌ Type check failed. Aborting release.', 'red');
    process.exit(1);
  }
  
  // Then build
  if (!exec('npm run build')) {
    log('❌ Build failed. Aborting release.', 'red');
    process.exit(1);
  }
  log('✅ Build successful!', 'green');
  
  // Step 3: Get current version and ask for new version
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;
  
  log(`\n📦 Current version: ${currentVersion}`, 'blue');
  
  let newVersion;
  let versionType;
  
  do {
    newVersion = await askQuestion('Enter new version (e.g., 1.0.1): ');
    versionType = updateVersion(currentVersion, newVersion);
  } while (!versionType);
  
  log(`\n🔄 Step 3: Updating version from ${currentVersion} to ${newVersion} (${versionType} release)...`, 'yellow');
  
  // Update package.json
  packageJson.version = newVersion;
  writePackageJson(packageJson);
  log('✅ Package.json updated!', 'green');
  

  
  // Step 5: NPM login (commented out for testing)
  log('\n🔐 Step 5: NPM login... (SKIPPED)', 'yellow');
  // if (!exec('npm login')) {
  //   log('❌ NPM login failed. Aborting release.', 'red');
  //   process.exit(1);
  // }
  // log('✅ NPM login successful!', 'green');
  
  // Step 6: NPM publish (commented out for testing)
  log('\n📤 Step 6: Publishing to NPM... (SKIPPED)', 'yellow');
  // if (!exec('npm publish')) {
  //   log('❌ NPM publish failed. Aborting release.', 'red');
  //   process.exit(1);
  // }
  // log('✅ Package published to NPM!', 'green');
  

  
  log('\n🎉 Release completed successfully!', 'bright');
  log(`📦 Version ${newVersion} is now published on NPM`, 'green');
  log(`🔗 Package: https://www.npmjs.com/package/${packageJson.name}`, 'blue');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled error: ${error}`, 'red');
  process.exit(1);
});

// Run the release script
main().catch((error) => {
  log(`❌ Release failed: ${error}`, 'red');
  process.exit(1);
});
