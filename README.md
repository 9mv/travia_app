# Travia - Smart Travel Packing List

AI-powered packing list app with custom items, multi-language support, and intelligent recommendations.

## Overview

Local-first mobile app that generates personalized packing lists based on trip parameters (duration, season, destination). No backend, all data stored on device.

**Features:** Custom items management, AI suggestions, export to Reminders, dark mode, 3 languages (Catalan, English, Spanish)

## Tech Stack

- **React Native** 0.81.5 + **Expo** SDK 54.0.0
- **TypeScript** 5.3.0
- **AsyncStorage** - Local data persistence
- **Expo SecureStore** - Encrypted API key storage
- **Expo Calendar** - Reminders integration
- **OpenRouter API** - Optional AI suggestions

## Project Structure

```
├── src/
│   ├── components/      # TripConfigScreen, PackingListScreen, SettingsScreen
│   ├── services/        # PackingListService, AIService, RemindersService, etc.
│   └── types/           # TypeScript definitions
├── translations/        # CSV source files for i18n
├── items-config.json    # Item database (33 items, 9 categories)
├── scripts/             # Build automation
└── docs/                # Full documentation
```

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development
npm start

# Setup iOS (first time)
./scripts/setup-ios.sh

# Build for testing
./scripts/build-release-ios.sh
```

## Documentation

- **[TECHNICAL.md](docs/TECHNICAL.md)** - Full architecture and implementation details
- **[BUILD.md](docs/BUILD.md)** - iOS/Android debug and release builds
- **[ITEMS_CONFIG.md](docs/ITEMS_CONFIG.md)** - Configure items in app and in code
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Publish to App Store / Google Play

## Configuration

### Items (Code)
Edit `items-config.json`:
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

### Items (In-App)
Settings → Manage Custom Items → Add/Edit/Delete
- Supports fixed or per-day quantities
- Import/export JSON
- Persisted in AsyncStorage

### API Key (Optional)
Settings → Configure API Key or `.env` file:
```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### Translations
Edit `translations/text-strings-{lang}.csv`, then:
```bash
npm run translations
```

## License

**MIT License with Non-Commercial Restriction**

Copyright © 2025 Aleix Martinez Vinent

✅ **Allowed:**
- Personal and educational use
- Modify and distribute
- Private use

🚫 **Not Allowed:**
- Commercial use without permission
- Removing attribution

See [LICENSE](LICENSE) for full terms.

For commercial licensing, contact: aleixmateumartinez@gmail.com
