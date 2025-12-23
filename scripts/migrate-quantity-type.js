#!/usr/bin/env node

/**
 * Migration script to convert items-config.json from old format to new format:
 * 
 * OLD FORMAT:
 *   - dailyFactor: 0 (with explicit quantity) = one-off item
 *   - dailyFactor: >0 = daily-based calculation
 * 
 * NEW FORMAT:
 *   - quantityType: "fixed" (with quantity field)
 *   - quantityType: "perDay" (with dailyFactor field)
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'items-config.json');

function migrateConfig() {
  console.log('🔄 Starting migration of items-config.json...\n');

  // Read the config file
  const configContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
  const config = JSON.parse(configContent);

  let fixedCount = 0;
  let perDayCount = 0;

  // Migrate each item
  config.items = config.items.map(item => {
    const newItem = { ...item };

    if (item.dailyFactor === 0) {
      // Convert to fixed quantity
      newItem.quantityType = 'fixed';
      newItem.quantity = item.quantity || 1;
      delete newItem.dailyFactor;
      fixedCount++;
    } else {
      // Convert to per-day calculation
      newItem.quantityType = 'perDay';
      newItem.dailyFactor = item.dailyFactor;
      delete newItem.quantity; // Remove quantity field for perDay items
      perDayCount++;
    }

    return newItem;
  });

  // Write the updated config
  const updatedContent = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_FILE, updatedContent, 'utf-8');

  console.log('✅ Migration completed successfully!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Fixed quantity items: ${fixedCount}`);
  console.log(`   - Per-day items: ${perDayCount}`);
  console.log(`   - Total items: ${config.items.length}\n`);
  console.log('📝 Changes made:');
  console.log('   - Added "quantityType" field to all items');
  console.log('   - Converted dailyFactor=0 → quantityType="fixed"');
  console.log('   - Converted dailyFactor>0 → quantityType="perDay"');
  console.log('   - Removed dailyFactor from fixed items');
  console.log('   - Removed quantity from perDay items\n');
}

// Run migration
try {
  migrateConfig();
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
