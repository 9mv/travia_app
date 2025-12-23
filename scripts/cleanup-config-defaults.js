#!/usr/bin/env node

/**
 * Cleanup script to remove redundant fields from items-config.json
 * 
 * Removes fields from items that match the default values, making the config more minimal.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'items-config.json');

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

function cleanupConfig() {
  console.log('🧹 Cleaning up items-config.json...\n');

  // Read the config file
  const configContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
  const config = JSON.parse(configContent);

  if (!config.defaults) {
    console.log('⚠️  No defaults section found. Skipping cleanup.');
    return;
  }

  const defaults = config.defaults;
  let fieldsRemoved = 0;
  let itemsModified = 0;

  // Clean up each item
  config.items = config.items.map(item => {
    const cleanItem = { ...item };
    let itemChanged = false;

    // Check each field that might have a default
    const fieldsToCheck = ['quantityType', 'quantity', 'minDays', 'requiresBigLuggage'];
    
    fieldsToCheck.forEach(field => {
      if (field in cleanItem && field in defaults) {
        if (cleanItem[field] === defaults[field]) {
          delete cleanItem[field];
          fieldsRemoved++;
          itemChanged = true;
        }
      }
    });

    // Check array fields
    if (cleanItem.seasons && defaults.seasons) {
      if (arraysEqual(cleanItem.seasons, defaults.seasons)) {
        delete cleanItem.seasons;
        fieldsRemoved++;
        itemChanged = true;
      }
    }

    if (cleanItem.includeFor && defaults.includeFor) {
      if (arraysEqual(cleanItem.includeFor, defaults.includeFor)) {
        delete cleanItem.includeFor;
        fieldsRemoved++;
        itemChanged = true;
      }
    }

    if (itemChanged) {
      itemsModified++;
    }

    return cleanItem;
  });

  // Write the updated config
  const updatedContent = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_FILE, updatedContent, 'utf-8');

  console.log('✅ Cleanup completed successfully!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Items modified: ${itemsModified}`);
  console.log(`   - Fields removed: ${fieldsRemoved}`);
  console.log(`   - Total items: ${config.items.length}\n`);
  console.log('📝 Result:');
  console.log('   - Removed all fields that match default values');
  console.log('   - Config file is now more minimal and maintainable\n');
}

// Run cleanup
try {
  cleanupConfig();
} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}
