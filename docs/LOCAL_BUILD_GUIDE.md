# 🆓 Local Build with Free Apple Developer Account

## ⚠️ Important Information

**With a free Apple Developer account:**
- ✅ Standalone app on home screen
- ✅ FREE (no $99 payment)
- ❌ App expires after 7 days
- ❌ Must rebuild weekly
- ❌ Cannot use EAS Build (cloud building)
- ✅ Must build locally with Xcode

---

## 🛠️ Prerequisites

### 1. Install Xcode (if not already installed)

**Check if you have Xcode:**
```bash
xcode-select -p
```

**If you need to install:**
- Open **Mac App Store**
- Search for **"Xcode"**
- Click **"Get"** or **"Install"** (it's free)
- **Warning:** Very large download (~12GB), takes 30-60 minutes
- After installation, open Xcode once to accept license

**Or install command line tools only (smaller):**
```bash
xcode-select --install
```

### 2. Install CocoaPods

```bash
sudo gem install cocoapods
```

---

## 🚀 Build Process

### Step 1: Generate Native iOS Project

Expo apps need to be "prebuilt" to create native iOS project files:

```bash
npx expo prebuild --platform ios
```

**What this does:**
- Creates `/ios` folder with Xcode project
- Generates native iOS files
- Sets up dependencies

**Expected output:**
```
✔ Created native project | /ios, /android
```

---

### Step 2: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

**This installs native iOS libraries (CocoaPods).**

---

### Step 3: Open in Xcode

```bash
open ios/travia.xcworkspace
```

**Important:** Open the `.xcworkspace` file, NOT `.xcodeproj`!

---

### Step 4: Configure Signing in Xcode

**In Xcode:**

1. **Select project** in left sidebar (blue "travia" icon at top)

2. **Select "travia" target** (under "TARGETS")

3. **Go to "Signing & Capabilities" tab**

4. **Configure signing:**
   ```
   ✓ Automatically manage signing (check this box)
   
   Team: Select your Apple ID from dropdown
         (or click "Add Account" to add your Apple ID)
   
   Bundle Identifier: com.aleix.travia (already set)
   ```

5. **If you see errors about Bundle ID:**
   - Change `com.aleix.travia` to something unique
   - Try: `com.aleix.travia-[your-name]`
   - Or: `com.[yourname].travia`

---

### Step 5: Connect Your iPhone

1. **Connect iPhone to Mac via USB cable**

2. **In Xcode toolbar at top:**
   - Click on device selector (next to "travia" text)
   - Select **your iPhone** from the list
   - If not visible:
     - Unlock iPhone
     - Tap "Trust This Computer" on iPhone
     - Enter iPhone passcode

---

### Step 6: Build and Run

**In Xcode:**

1. **Press the ▶️ Play button** (or press `Cmd + R`)

2. **Xcode will:**
   - Compile your app
   - Sign it with your free account
   - Install on your iPhone
   - Launch automatically

3. **First time setup on iPhone:**
   - Go to **Settings → General → VPN & Device Management**
   - Tap on your Apple ID
   - Tap **"Trust [Your Apple ID]"**
   - Confirm

4. **App launches!** 🎉

---

## 🔄 Development Workflow

### While building, you can:

**Option A: Keep Xcode open and rebuild**
```bash
# In Xcode, just press Cmd + R to rebuild and reinstall
```

**Option B: Use Expo CLI for faster iteration**
```bash
# Terminal 1: Start Metro bundler
npx expo start --dev-client

# Terminal 2: Build with Xcode (first time only)
# Then app hot-reloads automatically on code changes
```

---

## ⏰ Weekly Rebuild (7-Day Expiration)

**Every 7 days, you must rebuild:**

```bash
# Quick rebuild process:
cd /Users/aleix/Projectes_Local/App_llista_viatges

# Option 1: Use Xcode
open ios/travia.xcworkspace
# Then press Cmd + R with iPhone connected

# Option 2: Use command line
npx expo run:ios --device
```

**Set a calendar reminder for every 6 days!**

---

## 📋 Quick Command Reference

```bash
# Initial setup (once)
npx expo prebuild --platform ios
cd ios && pod install && cd ..
open ios/travia.xcworkspace

# Build and run on iPhone
# In Xcode: Cmd + R

# Or from command line:
npx expo run:ios --device

# Update dependencies (when needed)
cd ios && pod install && cd ..

# Clean build (if issues)
cd ios
rm -rf build
rm -rf Pods
pod install
cd ..
```

---

## 🆘 Troubleshooting

### "Command PhaseScriptExecution failed"
**Solution:**
```bash
cd ios
pod install
cd ..
# Rebuild in Xcode
```

### "Unable to install [app]"
**Solution:**
- iPhone Settings → General → VPN & Device Management
- Trust your developer certificate

### "Signing requires a development team"
**Solution:**
- Xcode → Preferences → Accounts
- Add your Apple ID
- Select it as team in Signing & Capabilities

### "Bundle identifier is not available"
**Solution:**
- Change bundle ID in Xcode to something unique
- Example: `com.yourname.travia`

### "iPhone is busy"
**Solution:**
- Unplug and replug iPhone
- Unlock iPhone
- Restart Xcode

### Build errors
**Solution:**
```bash
# Clean everything
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..
# Try again in Xcode
```

---

## ⚡ Faster Alternative: expo run:ios

Instead of opening Xcode every time:

```bash
# Build and install directly from terminal
npx expo run:ios --device

# Select your iPhone when prompted
# App installs and launches automatically
```

**This is faster for weekly rebuilds!**

---

## 💡 Pro Tips

1. **Set up TouchID/FaceID for Keychain:**
   - Xcode stores your signing certificate
   - TouchID makes it faster

2. **Keep iPhone plugged in:**
   - Speeds up installation
   - Allows debugging

3. **Use wireless debugging (optional):**
   - Xcode → Window → Devices and Simulators
   - Right-click iPhone → "Connect via Network"
   - Build without cable (but slower)

4. **Automate rebuild reminder:**
   - Calendar event every Monday
   - Takes ~5 minutes with command line

---

## 📊 Time Estimates

| Task | First Time | Weekly Rebuild |
|------|-----------|----------------|
| Xcode install | 30-60 min | - |
| Initial setup | 10-15 min | - |
| Weekly rebuild | - | 3-5 min |
| **Total first time** | **40-75 min** | - |
| **Weekly maintenance** | - | **3-5 min** |

---

## 🎯 Next Steps

Ready to start? Here's the order:

1. **Check if you have Xcode:**
   ```bash
   xcode-select -p
   ```

2. **If no Xcode, install it** (Mac App Store)

3. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

4. **Generate iOS project:**
   ```bash
   npx expo prebuild --platform ios
   ```

5. **Install dependencies:**
   ```bash
   cd ios && pod install && cd ..
   ```

6. **Open in Xcode:**
   ```bash
   open ios/travia.xcworkspace
   ```

7. **Configure signing and build!**

---

Let me know when you're ready to start, and I'll guide you through each step! 🚀
