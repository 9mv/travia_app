# Technical Summary

## Architecture

**Type**: Client-only mobile application
**Backend**: None (fully local)
**Data Storage**: Device only (no cloud)
**External APIs**: OpenRouter (optional, AI only)

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Expo | 54.0.0 |
| Runtime | React Native | 0.81.5 |
| UI Library | React | 19.1.0 |
| Language | TypeScript | 5.3.0 |
| Build Tool | EAS Build | Latest |

## Key Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| expo-calendar | Reminders integration | iOS/Android only |
| expo-secure-store | Encrypted storage | API key security |
| @react-native-async-storage/async-storage | Local persistence | Lists & preferences |
| openai | AI client | OpenRouter API |
| @expo/vector-icons | Icons | Built-in |

**Total**: 662 packages, 0 vulnerabilities

## App Structure

```
├── App.tsx                          # Main entry, routing
├── items-config.json                # Item database (33 items)
├── text-strings.csv                 # UI text (100+ strings)
├── src/
│   ├── components/                  # React components (3)
│   │   ├── TripConfigScreen.tsx    # Input form
│   │   ├── PackingListScreen.tsx   # Results display
│   │   └── SettingsScreen.tsx      # API key config
│   ├── services/                    # Business logic (6)
│   │   ├── PackingListService.ts   # List generation
│   │   ├── AIService.ts            # OpenRouter client
│   │   ├── RemindersService.ts     # Export to Reminders
│   │   ├── StorageService.ts       # AsyncStorage wrapper
│   │   ├── SecureStorageService.ts # Encrypted storage
│   │   └── TextService.ts          # Localization
│   ├── types/index.ts              # TypeScript definitions
│   └── utils/configUtils.ts        # Helpers
└── docs/                            # Documentation (4 files)
```

## Data Flow

```
User Input (TripConfigScreen)
    ↓
PackingListService.generatePackingList()
    ↓ reads items-config.json
    ↓ applies calculations
    ↓
[Optional] AIService.enhancePackingList()
    ↓ calls OpenRouter API
    ↓
PackingList (PackingListScreen)
    ↓ user action
    ↓
RemindersService.exportToReminders()
    ↓ creates iOS/Android reminders
    ↓
Device Reminders App
```

## Quantity Calculation

```typescript
quantity = baseFactor + (numberOfDays × dailyFactor) × seasonPreference
```

**Example**: T-shirt for 3-day summer trip
- baseFactor: 2
- dailyFactor: 0.5
- days: 3
- seasonPreference.Summer: 1.0
- Result: 2 + (3 × 0.5) × 1.0 = 3.5 → 4 T-shirts

## Storage

### AsyncStorage
- Packing lists (history)
- User preferences
- App state
- **Size**: ~5KB per list
- **Location**: Device local storage

### Secure Storage
- OpenRouter API key
- **Encryption**: iOS Keychain / Android Keystore
- **Platform**: iOS/Android only
- **Persistence**: Survives app reinstall

## API Integration

### OpenRouter
- **Endpoint**: https://openrouter.ai/api/v1
- **Model**: openai/gpt-4.1-nano (configurable)
- **Purpose**: AI suggestions for packing items
- **Auth**: Bearer token (API key)
- **Cost**: ~$0.01 per list enhancement
- **Optional**: App works without it

### Request Example
```typescript
POST /chat/completions
{
  "model": "openai/gpt-4.1-nano",
  "messages": [
    {
      "role": "system",
      "content": "Travel assistant prompt..."
    },
    {
      "role": "user",
      "content": "Trip details..."
    }
  ]
}
```

## Localization

All text in `text-strings.csv`:
- **Language**: Catalan
- **Count**: 100+ strings
- **Format**: CSV (textId, text, description)
- **Usage**: `getText(TextIds.KEY, params)`
- **Parameters**: `{placeholder}` substitution

## Security

### API Key
- Stored in OS-encrypted storage
- Never logged or exposed
- Only sent to OpenRouter
- Deletable by user

### Permissions
- **iOS**: NSCalendarsUsageDescription, NSRemindersUsageDescription
- **Android**: READ_CALENDAR, WRITE_CALENDAR
- **Requested**: On first Reminders export

### Data Privacy
- No telemetry
- No analytics
- No cloud storage
- No user tracking
- Everything local

## Performance

### App Size
- **iOS**: ~10MB
- **Android**: ~15MB
- **Dependencies**: Heavy (React Native + Expo)

### Speed
- **List Generation**: <100ms (local)
- **AI Enhancement**: 2-5s (API call)
- **Export to Reminders**: <500ms (local)
- **Startup**: ~2s cold, ~500ms warm

### Memory
- **Baseline**: ~50MB
- **Peak**: ~80MB during AI call

## Limitations

### Platform
- iOS/Android only (no web)
- Requires iOS 13+ / Android 5+
- Secure Storage: mobile only

### Features
- Single user per device
- No cloud sync
- No collaboration
- AI requires internet
- No offline AI

### Scale
- Max items: Unlimited (practical: ~100)
- Max lists: Unlimited (AsyncStorage limit: ~6MB)
- API calls: Limited by OpenRouter quota

## Build Output

### iOS
- **Format**: .ipa
- **Distribution**: Internal (ad-hoc) or TestFlight
- **Size**: ~25MB
- **Certificate**: Managed by EAS

### Android
- **Format**: .apk or .aab
- **Distribution**: Direct install or Play Store
- **Size**: ~30MB
- **Signing**: Managed by EAS

## Development

### Hot Reload
- Enabled for JavaScript/TypeScript changes
- Native changes require rebuild
- Fast Refresh for React components

### Debug Tools
- React DevTools (via Expo)
- Console logging
- Network inspector
- Expo debugger

## Deployment

### EAS Build
- Cloud build service
- Handles certificates automatically
- 30 free builds/month
- Builds in 10-20 minutes

### Distribution Options
1. **TestFlight**: 90 days, 100 devices
2. **Ad-hoc**: 1 year, 100 devices
3. **App Store**: Permanent, unlimited ($99/year)
4. **Direct APK**: Android, unlimited

## Environment

### Development
```bash
npm start                    # Metro bundler
Expo Go app on device        # Live reload
```

### Production
```bash
eas build --platform ios     # Cloud build
Download .ipa → Install      # Manual or TestFlight
```

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Development | Free | Expo SDK |
| EAS Build | Free | 30 builds/month |
| OpenRouter API | ~$0.01/use | Optional, pay-as-you-go |
| App Store | $99/year | Only if publishing |
| TestFlight | Free | For testing |
| **Total (personal use)** | **$0** | No App Store needed |

## Maintenance

### Updates
- **Code**: Rebuild and redistribute
- **JavaScript only**: OTA update (free)
- **Dependencies**: `npm update`
- **Expo SDK**: `expo upgrade`

### Monitoring
- None (no backend)
- Logs local only
- Crashes visible to user only

## Future Improvements

Possible enhancements:
- Cloud sync (Firebase/Supabase)
- Multi-language support
- Web version (limited features)
- Collaboration features
- Photo attachments
- Purchase suggestions
- Weather integration
