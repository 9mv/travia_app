# App Store Deployment

## iOS - App Store

### Prerequisites

- **Apple Developer Program**: $99/year (required for App Store)
- **Paid developer account** at [developer.apple.com](https://developer.apple.com)
- Mac with Xcode installed
- App configured in App Store Connect

### Step 1: Prepare App

```bash
# Update version in app.json
"version": "1.0.0",
"ios": {
  "buildNumber": "1"
}

# Regenerate iOS project
npx expo prebuild --platform ios --clean
```

### Step 2: Configure in Xcode

1. Open `ios/travia.xcworkspace`
2. Select project → General tab
3. Set **Version** (e.g., 1.0.0) and **Build** (e.g., 1)
4. Go to Signing & Capabilities
5. Enable "Automatically manage signing"
6. Select your team (paid Apple Developer account)

### Step 3: Build Archive

1. In Xcode: Product → Destination → **Any iOS Device (arm64)**
2. Product → Archive
3. Wait for build to complete (~5-10 min)
4. Organizer window opens automatically

### Step 4: Upload to App Store Connect

1. In Organizer, select the archive
2. Click **Distribute App**
3. Select **App Store Connect**
4. Click **Upload**
5. Wait for processing (~15-30 min)

### Step 5: Submit for Review

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Create new version (if needed)
4. Fill required information:
   - Screenshots (iPhone, iPad if supported)
   - Description
   - Keywords
   - Privacy policy URL (if collecting data)
   - Age rating
5. Click **Submit for Review**

**Review time:** 1-3 days typically

### Updating Your App

```bash
# Increment version or build number in app.json
"version": "1.0.1",  # or increment buildNumber
"ios": {
  "buildNumber": "2"
}

# Rebuild and repeat steps above
npx expo prebuild --platform ios --clean
```

## iOS - TestFlight (Beta Testing)

TestFlight allows testing with up to 100 external users before App Store release.

### Setup

1. Upload build to App Store Connect (same as above, Steps 1-4)
2. In App Store Connect → TestFlight tab
3. Add External Testers
4. Fill "What to Test" notes
5. Submit for Beta Review (~24 hours)

**Beta builds expire after 90 days.**

### Share with Testers

1. Add tester emails in TestFlight section
2. Testers receive email invitation
3. They install TestFlight app
4. Open invitation link → Install beta

## Android - Google Play

### Prerequisites

- **Google Play Console account**: $25 one-time fee
- Account at [play.google.com/console](https://play.google.com/console)

### Step 1: Generate Signing Key

```bash
# Generate upload keystore
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# Keep this file secure! Store password safely
```

### Step 2: Configure Gradle

Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("upload-keystore.jks")
            storePassword "YOUR_PASSWORD"
            keyAlias "upload"
            keyPassword "YOUR_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Step 3: Build Release APK/AAB

```bash
cd android

# For Play Store (AAB - recommended)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab

# Or for direct distribution (APK)
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Step 4: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create App**
3. Fill app details:
   - Name
   - Default language
   - App type (Game/App)
   - Free/Paid

### Step 5: Upload Release

1. In Play Console → Production → Create new release
2. Upload `app-release.aab`
3. Fill release notes
4. Click **Review Release**

### Step 6: Complete Store Listing

Required before first submission:

1. **App Content**
   - Privacy policy
   - Target audience
   - Content rating questionnaire
   
2. **Store Listing**
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (2-8 required)
   - App icon
   - Feature graphic
   
3. **Pricing & Distribution**
   - Free/Paid
   - Countries
   - Content rating

4. Click **Submit for Review**

**Review time:** Hours to a few days

### Updating Your App

```bash
# Increment versionCode and versionName in android/app/build.gradle
versionCode 2
versionName "1.0.1"

# Rebuild
cd android
./gradlew bundleRelease

# Upload new release in Play Console
```

## Alternative: EAS Build (Simplified)

Expo's cloud build service handles certificates and signing automatically.

### Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

### Build for App Store

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

EAS handles:
- Certificate generation
- Provisioning profiles
- Signing
- Build in cloud

**Cost:** Free tier (30 builds/month) or paid plans

### Submit via EAS

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Local Build** | Free, full control | Complex setup, manual certificates |
| **EAS Build** | Automated, easy | Requires EAS account, build limits |

## Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Apple Developer | $99/year | Required for App Store |
| Google Play | $25 once | One-time registration |
| EAS Build | Free/Paid | 30 builds/month free |
| TestFlight | Free | Included with Apple Developer |

## Security

**Never commit:**
- `upload-keystore.jks` (Android)
- Keystore passwords
- Provisioning profiles
- Certificates

Add to `.gitignore`:
```
*.jks
*.keystore
*.p12
*.mobileprovision
```
