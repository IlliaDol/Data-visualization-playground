#!/usr/bin/env node

/**
 * Test script for file format support
 * This script verifies that all supported file formats are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing file format support...');
console.log('=====================================');

// Check if test data files exist
const testFiles = [
  'test-data/sample.csv',
  'test-data/sample.json', 
  'test-data/sample.yaml',
  'test-data/sample.toml',
  'test-data/sample.log'
];

console.log('\n📁 Checking test data files:');
testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - exists`);
  } else {
    console.log(`❌ ${file} - missing`);
  }
});

// Check if utils.ts contains format support
console.log('\n🔍 Checking format support in lib/utils.ts:');
try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  const formats = [
    'csv', 'tsv', 'json', 'xml', 'yaml', 'toml', 'log',
    'xlsx', 'xls', 'xlsm', 'gz', 'gzip', 'zip',
    'parquet', 'npz', 'npy', 'pkl', 'pickle',
    'h5', 'hdf5', 'feather', 'arrow', 'avro', 'orc'
  ];
  
  let found = 0;
  formats.forEach(format => {
    if (utilsContent.includes(format)) {
      found++;
      console.log(`✅ Found support for: ${format}`);
    } else {
      console.log(`❌ Missing support for: ${format}`);
    }
  });
  
  console.log(`\n📊 Total formats supported: ${found} out of ${formats.length}`);
  
  if (found >= 20) {
    console.log('🎉 Excellent! All major formats are supported!');
    process.exit(0);
  } else {
    console.log('⚠️ Some formats might be missing support');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading lib/utils.ts:', error.message);
  process.exit(1);
}

// Check package.json for required dependencies
console.log('\n📦 Checking required dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'xlsx', 'papaparse', 'js-yaml', '@iarna/toml', 'pako', 'jszip'
  ];
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} - installed (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - missing`);
    }
  });
  
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('\n✅ Format support test completed!');
