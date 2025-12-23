# Items Configuration Structure

## Overview

The `items-config.json` file defines all packing items and their quantity calculation rules. Each item can have either a **fixed quantity** (e.g., 1 passport) or a **per-day quantity** (e.g., 1.25 underwear per day).

## Item Structure

### Required Fields

- **`id`** (string): Unique identifier for the item (e.g., "dni", "underwear")
- **`name`** (string): Display name in English (translations handled separately)
- **`category`** (ItemCategory): Category for grouping (basics, clothes, toiletries, etc.)
- **`quantityType`** ('fixed' | 'perDay'): Determines how quantity is calculated
- **`seasons`** (Season[]): Which seasons this item applies to
- **`includeFor`** (('general' | 'home')[]): Destination types where item is included
- **`minDays`** (number): Minimum trip duration to include this item (0 = always include)

### Conditional Fields

#### For `quantityType: "fixed"`
- **`quantity`** (number): Explicit quantity (e.g., 1 for passport, 2 for chargers)

#### For `quantityType: "perDay"`
- **`dailyFactor`** (number): Items per day multiplier (e.g., 1.25 = 1.25 underwear per day)

### Optional Fields
- **`requiresBigLuggage`** (boolean): If true, only include when user has big luggage (default: false)

## Examples

### Fixed Quantity Items

Items that don't depend on trip duration:

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

```json
{
  "id": "phone_charger",
  "name": "Phone Charger",
  "category": "electronics",
  "quantityType": "fixed",
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general", "home"],
  "minDays": 0
}
```

### Per-Day Items

Items whose quantity depends on trip duration:

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
*For a 4-day trip: `Math.ceil(1.25 * 4)` = **5 underwear***

```json
{
  "id": "shoes",
  "name": "Shoes",
  "category": "clothes",
  "quantityType": "perDay",
  "dailyFactor": 0.25,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general", "home"],
  "minDays": 0
}
```
*For a 2-day trip: `Math.max(1, Math.ceil(0.25 * 2))` = **1 pair** (minimum 1 for fractional factors)*

## Quantity Calculation Logic

### Fixed Quantity (`quantityType: "fixed"`)
```typescript
quantity = item.quantity || 1
```

### Per-Day Quantity (`quantityType: "perDay"`)
```typescript
const calculated = item.dailyFactor * numberOfDays;

// Special handling for fractional daily factors (0 < dailyFactor < 1)
// to ensure at least 1 item for short trips
if (dailyFactor > 0 && dailyFactor < 1) {
  quantity = Math.max(1, Math.ceil(calculated));
} else {
  quantity = Math.ceil(calculated);
}
```

## Common Daily Factors

| Factor | Meaning | Example Items |
|--------|---------|---------------|
| 1.25   | More than 1 per day | Underwear (extras for laundry) |
| 1.01   | Approximately 1 per day | Socks (slightly more for buffer) |
| 0.9    | Almost daily | T-shirts |
| 0.5    | Every 2 days | Shirts, shorts |
| 0.33   | Every 3 days | Trousers |
| 0.25   | Every 4 days | Shoes, swimming suit |

## Filtering Logic

Items are included in the packing list based on:

1. **Trip Duration**: `numberOfDays >= minDays`
2. **Luggage Type**: If `requiresBigLuggage: true`, only when `hasBigLuggage: true`
3. **Season**: Current season must be in item's `seasons` array
4. **Destination**: Destination type must be in item's `includeFor` array

## Migration from Old Format

If you have the old format with `dailyFactor: 0` meaning "fixed quantity":

```bash
node migrate-quantity-type.js
```

This converts:
- `dailyFactor: 0` + `quantity: X` → `quantityType: "fixed"` + `quantity: X`
- `dailyFactor: Y` (Y > 0) → `quantityType: "perDay"` + `dailyFactor: Y`

## Statistics (Current Configuration)

- **Total Items**: 57
- **Fixed Quantity Items**: 47 (e.g., passport, phone, chargers, keys)
- **Per-Day Items**: 10 (e.g., underwear, socks, t-shirts, shoes)

## Maintenance Tips

### Adding a New Fixed Item
```json
{
  "id": "new_item_id",
  "name": "Item Name",
  "category": "appropriate_category",
  "quantityType": "fixed",
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general"],
  "minDays": 0
}
```

### Adding a New Per-Day Item
```json
{
  "id": "new_clothing_item",
  "name": "Clothing Item",
  "category": "clothes",
  "quantityType": "perDay",
  "dailyFactor": 0.5,
  "seasons": ["summer"],
  "includeFor": ["general", "home"],
  "minDays": 2
}
```

### Making an Item Require Big Luggage
Add `"requiresBigLuggage": true` to any item:
```json
{
  "id": "suit",
  "requiresBigLuggage": true,
  ...
}
```

## See Also

- `src/types/index.ts` - TypeScript type definitions
- `src/services/PackingListService.ts` - Quantity calculation logic
- `regenerate-translations.js` - Localization for item names
