# Deployment Guide

## Overview
Build standalone iOS/Android apps without App Store distribution using EAS Build.

## Prerequisites
- Expo account (free)
- Apple ID (for iOS)
- Device for testing

## Setup (One-time)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure Project
Already configured in `eas.json` with 3 profiles:
- **development**: Debug builds for testing
- **preview**: Pre-production testing
- **production**: Final release builds

## Build iOS (Personal Use)

### Create Build
```bash
npx eas build --platform ios --profile production
```

Build takes 10-20 minutes. Downloads `.ipa` file when complete.

### Install on iPhone

**Option A: Apple Configurator (Mac)**
1. Install Apple Configurator 2 from App Store
2. Connect iPhone via USB
3. Drag .ipa file onto device in Configurator
4. App installs

**Option B: TestFlight (Easier)**
1. `npx eas build --platform ios --profile preview`
2. Submit to TestFlight: `eas submit --platform ios`
3. Install via TestFlight app on iPhone

### Certificate Management
EAS handles certificates automatically. On first build:
- Creates development/distribution certificates
- Stores in your Expo account
- Reuses for future builds

## Build Android

### Create APK
```bash
npx eas build --platform android --profile production
```

### Install
1. Download .apk file
2. Transfer to Android device
3. Enable "Install from Unknown Sources" in Settings
4. Tap .apk to install

## Build Profiles

### Development
```bash
npx eas build --platform ios --profile development
```
- Debug mode
- Fast builds
- For testing only

### Preview
```bash
npx eas build --platform ios --profile preview
```
- Production-like
- TestFlight compatible
- Pre-release testing

### Production
```bash
npx eas build --platform ios --profile production
```
- Optimized
- Final release
- Smallest size

## Update App

### Code Changes
1. Make changes
2. Test locally: `npm start`
3. Rebuild: `npx eas build --platform ios`
4. Install new .ipa

### Over-the-Air (OTA) Updates
For JavaScript changes only (not native code):
```bash
eas update --branch production
```
App updates automatically next launch.

## Build Configuration

Located in `eas.json`:
```json
{
  "build": {
    "production": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "default"
      }
    }
  }
}
```

## Troubleshooting

### Build Fails
Check build logs in EAS dashboard:
```bash
eas build:list
```

### Certificate Issues
```bash
eas credentials              # Manage certificates
eas build:configure          # Reconfigure
```

### Can't Install on iPhone
- Check device is registered (automatic with internal distribution)
- Verify Apple ID signed in on device
- Check device iOS version compatibility

### Build Takes Forever
Normal. iOS builds: 10-20 min, Android: 5-10 min.

## Cost
- **EAS Build**: Free tier (30 builds/month)
- **Beyond free tier**: $29/month
- **No App Store fees** (not using App Store)

## Distribution

### Personal Use (You Only)
- Build with `--profile production`
- Install via Apple Configurator
- Expires yearly (iOS only)

### Team/Family (Up to 100 devices)
- Use TestFlight (free)
- Share via email/link
- 90-day expiry, renewable

### Public (Everyone)
- Requires App Store submission ($99/year Apple Developer)
- Not needed for personal use

## Build Commands Reference

```bash
# View all builds
eas build:list

# Cancel build
eas build:cancel

# View credentials
eas credentials

# Configure project
eas build:configure

# Submit to App Store (optional)
eas submit --platform ios

# Update OTA
eas update --branch production
```

## Tips

### Faster Builds
- Use `--profile preview` for testing (faster than production)
- Build Android first (faster) to test quickly

### Version Management
Update in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

### Environment Variables
Set in EAS:
```bash
eas secret:create --name OPENROUTER_API_KEY --value sk-or-v1-...
```
Or use in-app Settings (recommended).

## Next Steps
After first successful build:
- Test thoroughly on device
- Set up OTA updates for quick fixes
- Configure automatic builds on git push (optional)
