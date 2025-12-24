# Build Guide

## iOS Development

### First Time Setup

```bash
# Automated setup (recommended)
./scripts/setup-ios.sh
```

This script:
1. Checks prerequisites (Node.js, Xcode, CocoaPods)
2. Installs missing dependencies
3. Generates iOS project with `npx expo prebuild`
4. Opens Xcode

### Manual Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Generate iOS project
npx expo prebuild --platform ios --clean

# Open Xcode
open ios/travia.xcworkspace
```

### Configure Signing (First Time)

1. In Xcode, select project in left sidebar
2. Go to "Signing & Capabilities" tab
3. Add your Apple ID: Xcode → Settings → Accounts → Add Account
4. Select your team in "Team" dropdown
5. Xcode will automatically create provisioning profile

## Build Types

### Debug Build (Development)

**Use for:** Development with hot reload

```bash
# Terminal 1: Start Metro bundler
npm start --dev-client

# Terminal 2: Open Xcode and press Cmd+R
open ios/travia.xcworkspace
```

- ✅ Hot reload enabled
- ✅ Fast development
- ❌ Requires Metro bundler running
- ❌ Slower performance

### Release Build (Testing/Production)

**Use for:** Testing final version without Metro bundler

**Option 1: Automated Script**
```bash
./scripts/build-release-ios.sh
```

**Option 2: Xcode**
1. Open `ios/travia.xcworkspace`
2. Product → Scheme → Edit Scheme
3. Change "Build Configuration" to **Release**
4. Cmd+R to build and run

- ✅ No Metro bundler needed
- ✅ Faster performance
- ✅ Standalone app
- ❌ No hot reload

## Testing on iPhone

### Requirements
- Mac with Xcode installed
- iPhone connected via USB
- Apple Developer account (free or paid)

### Steps
1. Connect iPhone via USB
2. Trust computer on iPhone (if prompted)
3. Select iPhone in Xcode device selector
4. Press Play ▶️ (Cmd+R)
5. On iPhone: Settings → General → VPN & Device Management → Trust Developer

### Troubleshooting

**iPhone not detected:**
```bash
brew install libimobiledevice
idevice_id -l
```

**App crashes immediately (Debug build):**
- Make sure Metro bundler is running: `npm start --dev-client`

**"Untrusted Developer" on iPhone:**
- Settings → General → VPN & Device Management → Trust your Apple ID

**Build fails with signing error:**
- Xcode → Settings → Accounts → Re-sign in with Apple ID
- Clean build folder: Cmd+Shift+K

## Account Types

### Free Apple Developer Account
- **Cost:** FREE
- **Expiration:** 7 days
- **Devices:** 3 per account
- **Rebuild:** Weekly (every 6 days recommended)

### Paid Apple Developer Program ($99/year)
- **Cost:** $99/year
- **Expiration:** None (or 90 days with TestFlight)
- **Devices:** 100 per account
- **Distribution:** App Store, TestFlight, ad-hoc

## Android Development

### First Time Setup

```bash
# Generate Android project
npx expo prebuild --platform android --clean
```

### Debug Build

```bash
# Start Metro bundler
npm start

# In another terminal
npx expo run:android
```

### Release Build

```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### Install on Device

```bash
# Via USB debugging
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Scripts

```bash
# Setup iOS (first time)
./scripts/setup-ios.sh

# Build release iOS
./scripts/build-release-ios.sh

# Start development server
npm start

# Start with dev client
npm start --dev-client

# Regenerate native projects
npx expo prebuild --clean
```

## Common Issues

### iOS directory missing
```bash
npx expo prebuild --platform ios --clean
```

### CocoaPods installation stuck
```bash
# Use Homebrew instead of gem
brew install cocoapods
```

### Metro bundler port conflict
```bash
# Kill existing processes
lsof -ti:8081,19000,19001,19002 | xargs kill -9
```

### Changes not appearing
```bash
# Clear cache
npm start -- --clear
# or
npx expo start --clear
```

### Native module changes not working
```bash
# Regenerate native projects
npx expo prebuild --clean
```
