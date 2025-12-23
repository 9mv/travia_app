# Customization Guide

## Items Configuration

### File: `items-config.json`

Structure:
```json
{
  "categories": {
    "clothes": "Clothes",
    "toiletries": "Toiletries"
  },
  "items": [
    {
      "id": "tshirt",
      "name": "T-shirt",
      "category": "clothes",
      "dailyFactor": 1,
      "seasons": ["spring", "summer", "fall", "winter"],
      "includeFor": ["general", "home"]
    }
  ]
}
```

### Properties

**id** (required)
- Unique identifier for the item
- Example: `"tshirt"`, `"toothbrush"`

**name** (required)
- Display name shown to user
- Example: `"T-shirt"`, `"Toothbrush"`

**category** (required)
- Must match key in `categories` object
- Available: `basics`, `clothes`, `toiletries`, `electronics`, `documents`, `accessories`, `health`, `misc`, `pending`

**dailyFactor** (required)
- Quantity calculation per day
- `0` = fixed quantity (doesn't scale with days)
- `>0` = scales with trip duration
- Formula: `quantity = Math.ceil(dailyFactor × days)`
- Examples:
  - `1` = 1 per day (3 days = 3 items)
  - `0.5` = 0.5 per day (3 days = 2 items)
  - `0.33` = 0.33 per day (3 days = 1 item)

**quantity** (optional, for dailyFactor=0)
- Fixed quantity for non-daily items
- Only used when `dailyFactor = 0`
- Default: `1` if not specified
- Example: `quantity: 2` for 2 pairs of pajamas

**seasons** (required)
- Array of seasons when item is relevant
- Values: `"spring"`, `"summer"`, `"fall"`, `"winter"`
- Item only appears if current season is in this array
- Example: `["summer"]` = only in summer
- Example: `["spring", "summer", "fall", "winter"]` = all seasons

**includeFor** (required)
- Array specifying destinations where item is included
- Values:
  - `["general"]` = Only for general trips (away from home)
  - `["home"]` = Only for home/second residence trips  
  - `["general", "home"]` = Always included (both trip types)
- This replaces the old `excludeForHome` boolean

## Examples

### Always Include (Both Destinations)
```json
{
  "id": "passport",
  "name": "Passport",
  "category": "documents",
  "dailyFactor": 0,
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general", "home"]
}
```
Included for all trip types, all seasons.

### Only for Away Trips
```json
{
  "id": "toothbrush",
  "name": "Toothbrush",
  "category": "toiletries",
  "dailyFactor": 0,
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general"]
}
```
Only when going away (have one at home).

### Only for Home Trips
```json
{
  "id": "house_keys",
  "name": "House Keys",
  "category": "basics",
  "dailyFactor": 0,
  "quantity": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["home"]
}
```
Only when going home.

### Daily Item (Scales with Days)
```json
{
  "id": "underwear",
  "name": "Underwear",
  "category": "clothes",
  "dailyFactor": 1,
  "seasons": ["spring", "summer", "fall", "winter"],
  "includeFor": ["general", "home"]
}
```
- 3 days = 3 items
- 7 days = 7 items

### Partial Daily Item
```json
{
  "id": "pants",
  "name": "Pants/Jeans",
  "category": "clothes",
  "dailyFactor": 0.33,
  "seasons": ["spring", "fall", "winter"],
  "includeFor": ["general"]
}
```
- 3 days = Math.ceil(3 × 0.33) = 1 pair
- 7 days = Math.ceil(7 × 0.33) = 3 pairs

### Seasonal Item
```json
{
  "id": "swimsuit",
  "name": "Swimsuit",
  "category": "clothes",
  "dailyFactor": 0,
  "quantity": 2,
  "seasons": ["summer"],
  "includeFor": ["general", "home"]
}
```
Only appears in summer, both destinations, fixed quantity of 2.

### Winter-Specific Item
```json
{
  "id": "jacket",
  "name": "Jacket",
  "category": "clothes",
  "dailyFactor": 0,
  "quantity": 1,
  "seasons": ["fall", "winter"],
  "includeFor": ["general", "home"]
}
```
Only in fall/winter.

## UI Text Configuration

### File: `text-strings.csv`

Format:
```csv
textId,text,description
app.title,Llista de viatges,Main app title
config.screen.title,Planificació de viatge,Config screen title
```

### Adding New Strings

1. Add to CSV:
```csv
my.new.string,El meu text,Description
```

2. Add to `src/services/TextService.ts` in `textStrings` object:
```typescript
const textStrings: Record<string, string> = {
  // ...existing...
  'my.new.string': 'El meu text',
};
```

3. Add constant in `TextIds`:
```typescript
export const TextIds = {
  // ...existing...
  MY_NEW_STRING: 'my.new.string',
} as const;
```

4. Use in code:
```typescript
import { getText, TextIds } from '../services/TextService';
getText(TextIds.MY_NEW_STRING)
```

### Parameter Substitution

CSV:
```csv
greeting.message,Hola {name}!,Greeting with name
```

Usage:
```typescript
getText(TextIds.GREETING_MESSAGE, { name: 'Aleix' })
// Output: "Hola Aleix!"
```

Multiple parameters:
```csv
trip.summary,Viatge de {days} dies a {destination},Trip summary
```

```typescript
getText(TextIds.TRIP_SUMMARY, { days: '3', destination: 'Barcelona' })
// Output: "Viatge de 3 dies a Barcelona"
```

## Adding New Categories

1. Add to `items-config.json`:
```json
{
  "categories": {
    "sports": "Sports"
  }
}
```

2. Add to `src/types/index.ts`:
```typescript
export enum ItemCategory {
  // ...existing...
  Sports = 'sports',
}
```

3. Add text string in `text-strings.csv`:
```csv
category.sports,Esports,Sports category name
```

4. Add to `src/services/TextService.ts`:
```typescript
const textStrings: Record<string, string> = {
  // ...existing...
  'category.sports': 'Esports',
};
```

## Changing AI Model

Edit `src/services/AIService.ts`:
```typescript
const completion = await client.chat.completions.create({
  model: 'openai/gpt-4-turbo',  // Change this
  // Options: 'anthropic/claude-3.5-sonnet'
  //          'meta-llama/llama-3-70b'
  //          'google/gemini-pro'
  // ...
});
```

See available models: https://openrouter.ai/models

## App Configuration

### File: `app.json`

**App Name**
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

**Bundle ID (iOS)**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.yourapp"
    }
  }
}
```

**Package Name (Android)**
```json
{
  "expo": {
    "android": {
      "package": "com.yourname.yourapp"
    }
  }
}
```

**Permissions Text**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCalendarsUsageDescription": "Your custom message",
        "NSRemindersUsageDescription": "Your custom message"
      }
    }
  }
}
```

## Testing Changes

### Items
1. Edit `items-config.json`
2. Restart app: `npm start`
3. Generate list
4. Verify quantities and filtering

### UI Text
1. Edit `text-strings.csv`
2. Update `TextService.ts`
3. Restart app
4. Check UI displays correctly

### Code Changes
1. Edit TypeScript files
2. Save (hot reload)
3. Or restart: `npx expo start --clear`

## Common Customizations

### Change Language
Replace all text in `text-strings.csv` with your language.

### Adjust Quantities
Modify `dailyFactor` and `quantity` in items-config.json.

### Remove AI Features
In `TripConfigScreen.tsx`, set default:
```typescript
const [useAI, setUseAI] = useState(false);
```

### Change Color Scheme
Search and replace color codes in component files:
- Primary: `#007AFF` (iOS blue)
- Background: `#F5F5F5` (light gray)
- Text: `#333` (dark gray)

## Tips

- **Backup** `items-config.json` before major changes
- **Test incrementally** after each modification
- **Check console** for errors (Cmd+Shift+J in Expo)
- **Use TypeScript** type checking to catch issues
- **Clear cache** if changes don't appear: `npx expo start --clear`
