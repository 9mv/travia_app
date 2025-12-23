# Scripts Directory

This folder contains maintenance and utility scripts for the project.

## Scripts

### cleanup-config-defaults.js

**Purpose**: Remove redundant fields from `items-config.json` that match default values.

**When to use**:
- After modifying the `defaults` section in `items-config.json`
- To minimize the config file by removing duplicate information
- During project maintenance

**Usage**:
```bash
node scripts/cleanup-config-defaults.js
```

**What it does**:
1. Reads `items-config.json`
2. Compares each item field with defaults
3. Removes fields that match default values
4. Writes cleaned config back to file
5. Reports statistics (items modified, fields removed)

**Example output**:
```
🧹 Cleaning up items-config.json...

✅ Cleanup completed successfully!

📊 Statistics:
   - Items modified: 57
   - Fields removed: 214
   - Total items: 57
```

### migrate-quantity-type.js

**Purpose**: **LEGACY** - Convert old format to new `quantityType` format.

**Status**: ✅ Already completed - kept for reference only

**Old format**:
```json
{
  "dailyFactor": 0,
  "quantity": 1
}
```

**New format**:
```json
{
  "quantityType": "fixed",
  "quantity": 1
}
```

**Note**: This script was used for a one-time migration and is no longer needed for regular maintenance.

## Running Scripts

All scripts should be run from the **project root**:

```bash
# From project root
cd /Users/aleix/Projectes_Local/App_llista_viatges
node scripts/<script-name>.js
```

Scripts use `path.join(__dirname, '..', ...)` to reference files in the project root.

## Adding New Scripts

When adding new maintenance scripts:

1. Create the script in this folder
2. Use `path.join(__dirname, '..', 'filename')` to reference root files
3. Add error handling
4. Provide clear console output
5. Document in this README
6. Consider adding to `package.json` scripts if frequently used

## See Also

- [../docs/PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Full project structure
- [../docs/ITEMS_CONFIG.md](../docs/ITEMS_CONFIG.md) - Items configuration guide
