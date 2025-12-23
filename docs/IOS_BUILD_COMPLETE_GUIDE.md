# 📱 iOS Build Guide - Complete Reference

## 🎯 Quick Start

```bash
# One-time setup (creates /ios directory)
./scripts/setup-ios.sh

# For release build (no Metro bundler needed)
./scripts/build-release-ios.sh
```

---

## 📚 Table of Contents

1. [How the iOS Directory is Created](#how-ios-directory-is-created)
2. [Testing with Xcode - Debug Build](#debug-build)
3. [Testing with Xcode - Release Build](#release-build)
4. [Command Line Building](#command-line-building)
5. [Troubleshooting](#troubleshooting)

---

## 🏗️ How the iOS Directory is Created

The `/ios` directory is **generated automatically** by Expo's prebuild system.

### Process:

```bash
# This command generates the /ios directory:
npx expo prebuild --platform ios
```

### What it does:

1. **Reads your configuration** from:
   - `app.json`
   - `app.config.js`
   - `package.json`

2. **Generates native files**:
   - Xcode project files (`.xcodeproj`, `.xcworkspace`)
   - Native iOS code
   - Info.plist with app configuration
   - Podfile for dependencies

3. **Installs iOS dependencies**:
   - Runs `pod install` automatically
   - Downloads and configures native libraries

### Generated Structure:

```
ios/
├── travia/                      # Main app folder
│   ├── Info.plist              # App configuration
│   ├── AppDelegate.mm          # App lifecycle
│   └── Images.xcassets/        # App icons, etc.
├── travia.xcodeproj/           # Xcode project
├── travia.xcworkspace/         # Xcode workspace (USE THIS!)
├── Podfile                     # iOS dependencies
└── Pods/                       # Installed dependencies
```

### Why it's not in Git:

- ✅ Generated automatically from config
- ✅ Can be recreated anytime
- ✅ Reduces repository size
- ✅ Avoids merge conflicts
- ✅ Anyone can generate it from source

---

## 🧪 Testing with Xcode - Debug Build

**Debug builds** require Metro bundler running for hot reload and development.

### Setup:

```bash
# Terminal 1: Start Metro bundler
npm start --dev-client
# Leave this running!

# Terminal 2: Open Xcode
open ios/travia.xcworkspace
```

### In Xcode:

1. **Select travia project** (blue icon in left sidebar)
2. **Select travia target** (under TARGETS)
3. **Signing & Capabilities tab**:
   - ☑️ Check "Automatically manage signing"
   - Select your Apple ID in "Team" dropdown
4. **Select your iPhone** at top toolbar
5. **Press ▶️ Play** (or `Cmd + R`)

### Characteristics:

- ✅ Fast iteration (hot reload)
- ✅ Debugging enabled
- ✅ Source maps for errors
- ❌ **Requires Metro bundler running**
- ❌ Slower performance
- ❌ Won't work if Mac is off

---

## 🚀 Testing with Xcode - Release Build

**Release builds** bundle all JavaScript into the app - **no Metro bundler needed!**

### Method 1: Change Scheme in Xcode (Recommended)

1. **Open Xcode**:
   ```bash
   open ios/travia.xcworkspace
   ```

2. **Edit Scheme**:
   - Menu: **Product → Scheme → Edit Scheme...**
   - Select **"Run"** in left sidebar
   - Change **"Build Configuration"** from `Debug` to `Release`
   - Click **"Close"**

3. **Clean Build**:
   - Press **`Cmd + Shift + K`** (Clean Build Folder)

4. **Build and Run**:
   - Make sure iPhone is selected at top
   - Press **▶️ Play** (or `Cmd + R`)
   - Wait 2-5 minutes for first build

5. **Done!**
   - App installs on iPhone
   - Works **without Metro bundler**
   - Much faster performance

### Method 2: Using Script (Automated)

```bash
# Run the automated build script
./scripts/build-release-ios.sh
```

This script:
- ✅ Detects your iPhone
- ✅ Builds with Release configuration
- ✅ Installs directly on device
- ✅ No Xcode UI needed

### Characteristics:

- ✅ **No Metro bundler needed**
- ✅ Fast performance (production speed)
- ✅ App works when disconnected from Mac
- ✅ Smaller app size (optimized)
- ❌ No hot reload
- ❌ Longer build time (2-5 minutes)

---

## 💻 Command Line Building

### Option 1: Using Expo CLI

```bash
# Development build (needs Metro)
npx expo run:ios --device

# Release build
npx expo run:ios --device --configuration Release
```

### Option 2: Using xcodebuild

```bash
cd ios

# Get your iPhone UDID
DEVICE_UDID=$(idevice_id -l)

# Build Release
xcodebuild \
  -workspace travia.xcworkspace \
  -scheme travia \
  -configuration Release \
  -destination "id=$DEVICE_UDID" \
  build
```

### Option 3: Using npm scripts

Add to `package.json`:

```json
{
  "scripts": {
    "ios:debug": "npx expo run:ios --device",
    "ios:release": "npx expo run:ios --device --configuration Release",
    "ios:setup": "npx expo prebuild --platform ios --clean"
  }
}
```

Then run:
```bash
npm run ios:release
```

---

## 🔄 Complete Workflow

### First Time Setup:

```bash
# 1. Generate iOS project
./scripts/setup-ios.sh

# 2. Open in Xcode
open ios/travia.xcworkspace

# 3. Configure signing (one time)
#    - Xcode → Signing & Capabilities
#    - Add your Apple ID

# 4. Build release version
./scripts/build-release-ios.sh
```

### Daily Development:

```bash
# Option A: Development with hot reload
npm start --dev-client
# Then build Debug in Xcode (Cmd+R)

# Option B: Test production version
./scripts/build-release-ios.sh
```

### Weekly Rebuild (7-day expiration):

```bash
# Just rebuild and reinstall
./scripts/build-release-ios.sh

# Or in Xcode: Cmd+R with Release scheme
```

---

## 🆘 Troubleshooting

### Problem: "iOS directory not found"

**Solution:**
```bash
npx expo prebuild --platform ios --clean
```

### Problem: "No matching provisioning profile"

**Solution:**
1. Xcode → Preferences → Accounts
2. Add your Apple ID
3. Xcode → Signing & Capabilities
4. Select your Apple ID in Team dropdown

### Problem: "iPhone not detected"

**Solution:**
```bash
# Install detection tool
brew install libimobiledevice

# Check connection
idevice_id -l

# If empty:
# - Reconnect USB cable
# - Unlock iPhone
# - Trust this computer on iPhone
```

### Problem: "App crashes on launch"

**Debug build:**
- Make sure Metro bundler is running (`npm start --dev-client`)

**Release build:**
- Clean and rebuild: `Cmd+Shift+K` then `Cmd+R`

### Problem: "Untrusted Developer"

**Solution:**
1. iPhone: Settings → General → VPN & Device Management
2. Tap your Apple ID email
3. Tap "Trust"

### Problem: "Build takes forever"

**First build:** 5-10 minutes (downloads dependencies)
**Subsequent builds:** 2-3 minutes

**Speed up:**
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

---

## 📊 Comparison: Debug vs Release

| Feature | Debug | Release |
|---------|-------|---------|
| Metro bundler needed | ✅ Yes | ❌ No |
| Hot reload | ✅ Yes | ❌ No |
| Build time | Fast (30s) | Slow (2-5m) |
| Performance | Slow | Fast |
| Bundle size | Large | Optimized |
| Debugging | Full | Limited |
| **Use case** | Development | Testing/Production |

---

## 🎯 Recommended Workflows

### For Development:
1. Run Metro: `npm start --dev-client`
2. Build Debug in Xcode
3. Code and hot reload

### For Testing Final Version:
1. Stop Metro bundler
2. Change to Release scheme in Xcode
3. Build once
4. Test without Mac connection

### For Weekly Rebuild:
```bash
# Automated
./scripts/build-release-ios.sh

# Or in Xcode (if already configured)
# Just press Cmd+R with Release scheme
```

---

## 📝 Scripts Reference

### setup-ios.sh
- Creates `/ios` directory
- Installs dependencies
- Opens Xcode
- **Run once** for initial setup

### build-release-ios.sh
- Builds production version
- Installs on iPhone
- No Metro bundler needed
- **Run weekly** for free account

---

## 🔗 Additional Resources

- [Expo Prebuild Docs](https://docs.expo.dev/workflow/prebuild/)
- [Apple Developer Guide](https://developer.apple.com/documentation/)
- [Xcode Documentation](https://developer.apple.com/xcode/)

---

## ⚡ Quick Commands

```bash
# Setup iOS project (once)
./scripts/setup-ios.sh

# Build release version
./scripts/build-release-ios.sh

# Open in Xcode
open ios/travia.xcworkspace

# Clean and regenerate iOS
rm -rf ios
npx expo prebuild --platform ios --clean

# Check connected iPhone
idevice_id -l

# Start Metro bundler
npm start --dev-client
```

---

**Now you have everything you need to build and test your iOS app!** 🎉
