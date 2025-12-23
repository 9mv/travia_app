# Travel Packing List App

Mobile app that generates personalized packing lists based on trip duration, season, and destination. Exports to iOS/Android Reminders. Optional AI enhancement via OpenRouter.

## Quick Facts
- **Platform**: iOS/Android (React Native + Expo)
- **Server**: None (client-only, runs on device)
- **Storage**: Local only (AsyncStorage + Secure Storage)
- **Language**: Catalan UI
- **AI**: Optional (OpenRouter API)

## Tech Stack
- Expo SDK 54.0.0
- React Native 0.81.5
- TypeScript 5.3.0
- 662 packages, 0 vulnerabilities

## Key Features
- Trip duration & season selection
- Home/away mode (excludes items available at home)
- AI-powered suggestions (optional, requires API key)
- Export to iOS/Android Reminders
- Encrypted API key storage
- Fully offline-capable (except AI)

## Quick Start

### Development
```bash
npm install
npm start              # Start dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
```

### Production Build
```bash
npx eas build --platform ios --profile production
```

## Configuration

### Items Database
Edit `items-config.json` to customize:
- 33 items across 9 categories
- Quantity calculations (baseFactor + days × dailyFactor)
- Season preferences
- Home/away exclusions

### UI Text
All text in `text-strings.csv` (100+ strings in Catalan)

### API Key (for AI features)
Configure in app Settings (⚙️) or `.env` file:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Documentation
- **[QUICKSTART.md](docs/QUICKSTART.md)** - Get started quickly
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Build & deploy
- **[CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** - Modify items & text

## How It Works
1. User sets trip parameters (days, season, home/away, AI on/off)
2. App reads items-config.json and calculates quantities
3. Optional AI enhancement via OpenRouter
4. Export to device Reminders app
5. All data stays on device (encrypted API key, local lists)

## Cost
- App: Free (no server)
- OpenRouter AI: Free tier + pay-as-you-go
- Distribution: Free (EAS Build or manual)

## Limitations
- No web support (Reminders/Secure Storage iOS/Android only)
- No cloud sync
- Single user per device
- AI requires internet connection

## License
Private project
