# Items Configuration

## Overview

Configure packing items in two ways:
1. **Code**: Edit `items-config.json` (permanent, requires rebuild)
2. **In-App**: Settings → Manage Custom Items (stored locally, no rebuild needed)

## File Structure (items-config.json)

### Required Fields

- `id` (string): Unique identifier
- `name` (string): Display name (English, translations handled separately)
- `category` (string): One of: basics, documents, clothes, toiletries, electronics, health, accessories, travel, beach
- `quantityType` ('fixed' | 'perDay'): How to calculate quantity
- `seasons` (array): Which seasons apply: spring, summer, fall, winter
- `includeFor` (array): Destination types: general, home
- `minDays` (number): Minimum trip duration (0 = always include)

### Quantity Fields

**For fixed items:**
- `quantity` (number): Static quantity

**For per-day items:**
- `dailyFactor` (number): Items per day multiplier

### Optional Fields

- `requiresBigLuggage` (boolean): Only include with big luggage

## Examples

### Fixed Quantity Item

```json
{
  "id": "passport",
  "name": "Passport",
  "category": "documents",
  "quantityType": "fixed",
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general"],
  "minDays": 0
}
```

### Per-Day Item

```json
{
  "id": "underwear",
  "name": "Underwear",
  "category": "clothes",
  "quantityType": "perDay",
  "dailyFactor": 1.25,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general", "home"],
  "minDays": 0
}
```

**Calculation:** For 4-day trip: `ceil(1.25 × 4) = 5 underwear`

### Season-Specific Item

```json
{
  "id": "sunscreen",
  "name": "Sunscreen",
  "category": "toiletries",
  "quantityType": "fixed",
  "quantity": 1,
  "seasons": ["summer"],
  "includeFor": ["general"],
  "minDays": 0
}
```

### Big Luggage Only

```json
{
  "id": "suit",
  "name": "Suit",
  "category": "clothes",
  "quantityType": "fixed",
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general"],
  "minDays": 3,
  "requiresBigLuggage": true
}
```

## Quantity Calculation

### Fixed
```typescript
quantity = item.quantity || 1
```

### Per-Day
```typescript
quantity = ceil(dailyFactor × numberOfDays)

// Special case: If dailyFactor < 1, minimum is 1
// Example: 0.25 × 2 days = 0.5 → rounds to 1
```

## Common Daily Factors

| Factor | Meaning | Example |
|--------|---------|---------|
| 1.25 | 1+ per day | Underwear (extras) |
| 1.01 | ~1 per day | Socks |
| 0.5 | Every 2 days | Shirts |
| 0.33 | Every 3 days | Trousers |
| 0.25 | Every 4 days | Shoes |

## In-App Custom Items

### Add Item
1. Settings → Manage Custom Items
2. Tap "Add New Item"
3. Fill fields (same as JSON structure)
4. Save

### Import/Export
- Export: Backup custom items to JSON file
- Import: Restore from backup
- Format: Same as `items-config.json`

**Storage:** AsyncStorage (local device only, no cloud sync)

**Merging:** Custom items merge with `items-config.json` at runtime (custom items take priority if same ID)

## Filtering Logic

Items appear in list when ALL conditions match:
1. `numberOfDays >= minDays`
2. `currentSeason` in `seasons`
3. `destinationType` in `includeFor`
4. If `requiresBigLuggage: true`, then `hasBigLuggage: true`

## Current Database

**Total items:** 57  
**Fixed:** 47 (passport, phone, chargers, keys, etc.)  
**Per-day:** 10 (underwear, socks, t-shirts, shoes, etc.)  
**Categories:** 9 (basics, documents, clothes, toiletries, electronics, health, accessories, travel, beach)

