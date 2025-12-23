# 📱 iOS Deployment Guide - Travia App

This guide will help you build and install Travia on your iPhone **without expiration**.

## 🎯 Overview of Options

### Option 1: EAS Build with Apple Developer Account (RECOMMENDED)
- ✅ **Never expires**
- ✅ Distribute to up to 100 devices
- ✅ Professional solution
- 💰 Requires: Apple Developer Account ($99/year)
- ⏱️ Build time: ~15-20 minutes

### Option 2: TestFlight (App Store Beta)
- ✅ **90 days expiration** (renewable)
- ✅ Up to 10,000 beta testers
- ✅ Professional distribution
- 💰 Requires: Apple Developer Account ($99/year)
- ⏱️ Build time: ~20-30 minutes + review time

### Option 3: Free Apple Developer Account
- ⚠️ **Expires after 7 days**
- ⚠️ Limited to 3 devices
- ✅ Free
- ⏱️ Not recommended for permanent use

---

## 🚀 RECOMMENDED: EAS Build with Ad Hoc Distribution

This is the best option for personal use or small team distribution.

### Step 1: Prerequisites

1. **Create Apple Developer Account**
   - Go to https://developer.apple.com/programs/
   - Sign up for $99/year account (or use existing one)
   - Complete enrollment (takes 24-48 hours for approval)

2. **Install Xcode** (if not already installed)
   ```bash
   # Install from Mac App Store or:
   xcode-select --install
   ```

3. **Get your Apple ID ready**
   - You'll need your Apple ID email and app-specific password

### Step 2: Login to Expo Account

```bash
# Create account at https://expo.dev/signup if you don't have one
eas login
```

### Step 3: Configure Your Project

```bash
# Link your project to Expo
eas build:configure
```

This will:
- Create/update `eas.json`
- Set up your project ID
- Configure build profiles

### Step 4: Register Your iPhone

1. **Get your iPhone's UDID**:
   - Connect iPhone to Mac via USB
   - Open Finder
   - Click on your iPhone in sidebar
   - Click on the device info (where it shows the model)
   - It will cycle through: Serial Number → UDID → Model Number
   - Right-click and "Copy UDID"

2. **Register the device**:
   ```bash
   eas device:create
   ```
   - Choose "iOS"
   - Enter a name (e.g., "Aleix's iPhone")
   - Paste your UDID

### Step 5: Build for iOS

```bash
# Build for internal distribution (Ad Hoc)
eas build --platform ios --profile preview
```

This will:
1. Ask you to log in to Apple Developer account
2. Create/update provisioning profiles
3. Build your app in the cloud (~15-20 minutes)
4. Generate a download link

### Step 6: Install on Your iPhone

**Method A: Direct Download (Easiest)**
1. EAS will provide a URL after build completes
2. Open that URL **on your iPhone** in Safari
3. Tap "Install"
4. Go to Settings → General → VPN & Device Management
5. Trust the profile
6. App is now installed!

**Method B: QR Code**
```bash
# Show QR code for the build
eas build:list
```
- Scan the QR code with your iPhone camera
- Follow Method A steps 3-6

---

## 📱 Alternative: TestFlight Distribution

For a more "App Store-like" experience with 90-day validity:

### Step 1: Build for TestFlight

```bash
eas build --platform ios --profile production
```

### Step 2: Submit to TestFlight

```bash
eas submit --platform ios
```

### Step 3: Configure TestFlight

1. Go to https://appstoreconnect.apple.com
2. Select your app (Travia)
3. Go to TestFlight tab
4. Add yourself as internal tester
5. Accept the invitation email on your iPhone
6. Download TestFlight app from App Store
7. Install Travia through TestFlight

**Benefits**:
- 90-day builds (auto-renewable)
- Professional experience
- Easier updates
- Can share with up to 10,000 testers

---

## 🔧 Update Your eas.json

Update your `eas.json` with better configuration:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium",
        "buildConfiguration": "Release"
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

---

## 🔑 Environment Variables Setup

Your app uses OpenRouter API. Create `.env` file:

```bash
# Copy the example
cp .env.example .env

# Edit with your API key
echo "OPENROUTER_API_KEY=your-actual-api-key-here" > .env
```

Then add to EAS secrets:
```bash
eas secret:create --scope project --name OPENROUTER_API_KEY --value your-actual-api-key-here
```

---

## 📋 Complete Setup Checklist

- [ ] Apple Developer Account enrolled ($99/year)
- [ ] Expo account created and logged in (`eas login`)
- [ ] Project configured (`eas build:configure`)
- [ ] iPhone UDID registered (`eas device:create`)
- [ ] Environment variables set (`.env` and `eas secret:create`)
- [ ] First build completed (`eas build --platform ios --profile preview`)
- [ ] App installed on iPhone

---

## 🎯 Quick Start Commands

```bash
# 1. Login to EAS
eas login

# 2. Configure project (first time only)
eas build:configure

# 3. Register your iPhone (first time only)
eas device:create

# 4. Set up API key (first time only)
eas secret:create --scope project --name OPENROUTER_API_KEY --value your-key

# 5. Build for iOS
eas build --platform ios --profile preview

# 6. List your builds
eas build:list

# 7. For future updates, just repeat step 5
```

---

## 🔄 Updating Your App

When you make changes and want to update:

```bash
# 1. Commit your changes
git add .
git commit -m "Updated features"
git push

# 2. Build new version
eas build --platform ios --profile preview

# 3. Install new version on iPhone (same process as before)
```

The old version will be automatically replaced.

---

## 🆘 Troubleshooting

### "No valid code signing identity found"
- Make sure you're logged in to the correct Apple Developer account
- Run: `eas credentials` to manage certificates

### "Device not registered"
- Make sure you ran `eas device:create` with correct UDID
- Check registered devices: `eas device:list`

### "Build failed"
- Check build logs: `eas build:list` → click on build URL
- Common issues: Missing API keys, invalid bundle ID

### "Cannot install app on iPhone"
- Make sure iPhone is registered in provisioning profile
- Check Settings → General → VPN & Device Management
- Try downloading again from build URL

---

## 💡 Pro Tips

1. **Use preview profile** for personal/team use (no expiration with paid account)
2. **Use production profile** for TestFlight (90 days but renewable)
3. **Keep build logs**: `eas build:list` shows all your builds
4. **Version your builds**: Update version in `app.json` before each build
5. **Test locally first**: Run `npm start` and test in Expo Go before building

---

## 📞 Support Resources

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **Apple Developer**: https://developer.apple.com/support/
- **Expo Forums**: https://forums.expo.dev/
- **Your builds dashboard**: https://expo.dev/accounts/[your-account]/projects/travia/builds

---

## 🎉 Success!

Once you complete the setup:
- Your app will be on your iPhone permanently (no expiration)
- You can update anytime by building again
- You can add up to 100 devices to your provisioning profile
- Professional, production-ready deployment

**Estimated total time for first setup**: 1-2 hours (mostly waiting for builds)

**Future updates**: Just 15-20 minutes per build
