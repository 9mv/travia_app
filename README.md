# 📱 Travia - Smart Travel Packing List

Intelligent packing list app with AI personalization, custom items management, and multi-language support.

## 🚀 Quick Start - iOS Development

### Option 1: Automated Setup (Recommended)

```bash
# One-time setup
./scripts/setup-ios.sh

# Build release version (no Metro bundler needed)
./scripts/build-release-ios.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate iOS project
npx expo prebuild --platform ios --clean

# Open in Xcode
open ios/travia.xcworkspace

# Configure signing and build (see documentation)
```

## 📚 Documentation

- **[iOS Build Complete Guide](docs/IOS_BUILD_COMPLETE_GUIDE.md)** - Everything about iOS building
- **[Local Build Guide](docs/LOCAL_BUILD_GUIDE.md)** - Build with free Apple account
- **[TestFlight Guide](docs/TESTFLIGHT_GUIDE.md)** - Deploy via TestFlight
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Code organization
- **[Technical Documentation](docs/TECHNICAL.md)** - Architecture details

## 🏗️ Build Types

### Debug Build (Development)
```bash
# Terminal 1: Start Metro bundler
npm start --dev-client

# Terminal 2: Build in Xcode (Debug scheme)
# Press Cmd+R in Xcode
```
- ✅ Hot reload enabled
- ✅ Fast iteration
- ❌ Requires Metro bundler

### Release Build (Production)
```bash
# Automated script
./scripts/build-release-ios.sh

# Or in Xcode: Change scheme to Release, then Cmd+R
```
- ✅ No Metro bundler needed
- ✅ Faster performance
- ✅ Standalone app

## 🔑 Key Features

- 📦 **Custom Items Management** - Add, edit, delete packing items
- 🌍 **Multi-language** - Catalan, English, Spanish
- 🤖 **AI Suggestions** - Smart packing recommendations
- 🎨 **Dark Mode** - Automatic theme switching
- 💾 **Export/Import** - Backup your custom items
- 📱 **Native iOS** - Built with React Native + Expo

## 📱 Testing on iPhone

### Requirements:
- Mac with Xcode installed
- iPhone connected via USB
- Free or paid Apple Developer account

### First Time:
1. Run `./scripts/setup-ios.sh`
2. Configure signing in Xcode (add your Apple ID)
3. Select your iPhone in device selector
4. Press Play ▶️

### Subsequent Builds:
```bash
# For development
npm start --dev-client
# Then build in Xcode

# For testing final version
./scripts/build-release-ios.sh
```

## ⚠️ Important Notes

### Free Apple Developer Account:
- ✅ FREE (no $99 payment)
- ❌ App expires after **7 days**
- ❌ Must rebuild weekly

### Paid Apple Developer Account ($99/year):
- ✅ Apps never expire (or 90 days with TestFlight)
- ✅ Up to 100 devices
- ✅ Professional distribution

## 🛠️ Development

### Project Structure
```
travia/
├── src/
│   ├── components/       # React components
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── translations/         # i18n source files
├── scripts/             # Build scripts
├── docs/                # Documentation
└── ios/                 # Generated iOS project (not in git)
```

### Scripts
```bash
# Start development server
npm start

# Start with development client
npm start --dev-client

# Regenerate translations
npm run translations

# Setup iOS
./scripts/setup-ios.sh

# Build release iOS
./scripts/build-release-ios.sh
```

## 🌐 Translations

Add translations in `translations/text-strings-{lang}.csv`, then:
```bash
npm run translations
```

Regenerates TypeScript files in `src/services/translations/`.

## 🔧 Troubleshooting

### "No iOS directory found"
```bash
npx expo prebuild --platform ios --clean
```

### "iPhone not detected"
```bash
brew install libimobiledevice
idevice_id -l
```

### "App won't launch"
**Debug:** Make sure Metro bundler is running
**Release:** Rebuild with Release configuration

### "Untrusted Developer"
Settings → General → VPN & Device Management → Trust

## 📦 Technologies

- **React Native** 0.81.5
- **Expo** SDK 54.0.0
- **TypeScript** 5.3.0
- **AsyncStorage** 2.1.0
- **OpenAI** API integration

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
