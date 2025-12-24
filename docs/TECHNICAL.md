# Technical Documentation

## Architecture

**Type**: Client-only mobile app (no backend)  
**Storage**: Local device only (no cloud)  
**External APIs**: OpenRouter (optional, AI suggestions)

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Expo | 54.0.0 |
| Runtime | React Native | 0.81.5 |
| Language | TypeScript | 5.3.0 |
| Storage | AsyncStorage | 2.1.0 |
| Security | Expo SecureStore | - |
| Reminders | Expo Calendar | - |
| AI | OpenAI SDK | 4.76.3 |

## Project Structure

```
├── App.tsx                          # Entry point, navigation
├── items-config.json                # Item database (33 items)
├── src/
│   ├── components/                  
│   │   ├── TripConfigScreen.tsx    # Trip parameters input
│   │   ├── PackingListScreen.tsx   # Results display
│   │   └── SettingsScreen.tsx      # API key configuration
│   ├── services/                    
│   │   ├── PackingListService.ts   # List generation logic
│   │   ├── AIService.ts            # OpenRouter client
│   │   ├── RemindersService.ts     # Export to Reminders
│   │   ├── StorageService.ts       # AsyncStorage wrapper
│   │   ├── SecureStorageService.ts # Encrypted API key storage
│   │   └── TextService.ts          # i18n localization
│   └── types/index.ts              # TypeScript definitions
└── translations/                    # CSV source files (Catalan, English, Spanish)
```

## Data Flow

```
TripConfigScreen (user input)
    ↓
PackingListService.generatePackingList()
    ↓ reads items-config.json
    ↓ calculates quantities
    ↓
[Optional] AIService.enhancePackingList()
    ↓ calls OpenRouter API
    ↓
PackingListScreen (display results)
    ↓
RemindersService.exportToReminders()
    ↓
Device Reminders App
```

## Core Services

### PackingListService
Generates packing lists based on:
- Trip duration (days)
- Season (spring/summer/fall/winter)
- Destination type (general/home)
- Luggage size (big/small)

**Quantity calculation:**
```typescript
quantity = baseFactor + (days × dailyFactor) × seasonPreference
```

Example: T-shirt for 3-day summer trip
- baseFactor: 2
- dailyFactor: 0.5
- seasonPreference.summer: 1.0
- Result: 2 + (3 × 0.5) × 1.0 = 3.5 → **4 T-shirts**

### AIService
Enhances lists using OpenRouter API:
- Model: `openai/gpt-4-turbo` (configurable)
- Adds personalized suggestions
- Cost: ~$0.01 per enhancement
- Optional: App works without AI

### StorageService
Local persistence using AsyncStorage:
- Packing list history
- User preferences
- Custom items
- Not encrypted (non-sensitive data)

### SecureStorageService
Encrypted storage for API key:
- iOS: Keychain
- Android: Keystore
- Survives app reinstall

### RemindersService
Exports lists to device Reminders app:
- Requires calendar/reminders permission
- Creates checklist in Reminders
- iOS/Android only

### TextService
Localization management:
- Source: `translations/text-strings-{lang}.csv`
- Supports: Catalan, English, Spanish
- 100+ text strings
- Parameter substitution: `{placeholder}`

## Items Configuration

Edit `items-config.json` to customize items:

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

**Categories:** basics, documents, clothes, toiletries, electronics, health, accessories, travel, beach

**Quantity types:**
- `fixed`: Static quantity (e.g., 1 passport)
- `perDay`: Calculated per day (e.g., 1.25 underwear/day)

## Custom Items (In-App)

Users can manage custom items via Settings:
- Add/Edit/Delete items
- Import/Export JSON
- Stored in AsyncStorage
- Merged with `items-config.json` at runtime

## Storage

### AsyncStorage (unencrypted)
- Lists: ~5KB each
- Preferences: <1KB
- Custom items: ~10KB
- Limit: ~6MB total

### SecureStore (encrypted)
- API key only
- OS-level encryption
- iOS/Android only (no web)

## Security

### API Key
- Stored encrypted in OS keychain
- Never logged
- Only sent to OpenRouter
- User-deletable

### Permissions
- **iOS**: NSCalendarsUsageDescription, NSRemindersUsageDescription
- **Android**: READ_CALENDAR, WRITE_CALENDAR
- Requested on first export

### Privacy
- No telemetry or analytics
- No cloud storage
- No user tracking
- All data local

## Performance

- **List generation**: <100ms
- **AI enhancement**: 2-5s (API call)
- **Reminders export**: <500ms
- **App size**: ~10MB (iOS), ~15MB (Android)
- **Memory**: ~50MB baseline, ~80MB peak

## Limitations

- iOS/Android only (no web support)
- Single user per device
- No cloud sync
- AI requires internet
- Reminders integration requires platform-specific APIs
