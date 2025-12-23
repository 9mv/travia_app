# 🆓 Free Standalone iOS App - Travia

## ⚠️ IMPORTANT WARNING

**This method uses a FREE Apple Developer account, which means:**

- ✅ Standalone app on your home screen
- ✅ "Travia" icon (not Expo Go)
- ✅ FREE (no $99 payment)
- ❌ **App EXPIRES after 7 DAYS**
- ❌ App stops working completely after 7 days
- ❌ You must rebuild EVERY WEEK

**Apple enforces this limitation. There is NO workaround.**

---

## 🤔 Is This Right for You?

### Choose this method if:
- ✅ You understand it expires weekly
- ✅ You're willing to rebuild every week
- ✅ You want to test before paying $99
- ✅ It's for short-term use

### DON'T choose this if:
- ❌ You want a permanent solution
- ❌ You'll forget to rebuild weekly
- ❌ The weekly maintenance is too much
- ❌ You need the app to work reliably

**For long-term use, pay $99/year for non-expiring builds.**

---

## 🚀 Build Process

### Step 1: Get Your iPhone UDID

**What is UDID?**
- Unique Device Identifier for your iPhone
- Needed to authorize your device for installation

**How to get it:**

1. **Connect iPhone to Mac via USB cable**

2. **Open Finder** (macOS Catalina+) or iTunes (older macOS)

3. **Click on your iPhone** in the sidebar

4. **Click on the device information:**
   - You'll see: Model, Serial Number
   - Click on it repeatedly
   - It cycles: Serial Number → **UDID** → Model Number

5. **Copy the UDID:**
   - When you see the long UDID string (like: 00008030-001234567890123A)
   - Right-click → "Copy UDID"

**Alternative method (if Finder doesn't work):**
```bash
# Install idevice_id tool
brew install libimobiledevice

# Get UDID
idevice_id -l
```

---

### Step 2: Register Your Device

```bash
eas device:create
```

**You'll be prompted:**
```
? Choose a platform: › iOS
? Device name: › Aleix iPhone  (or any name you want)
? Device ID (UDID): › [PASTE YOUR UDID HERE]
```

**Expected output:**
```
✓ Registered new iOS device
```

**Verify registration:**
```bash
eas device:list
```

---

### Step 3: Build Your App

**Now build the standalone app:**

```bash
eas build --platform ios --profile preview
```

**What happens:**

1. **EAS asks for Apple ID credentials:**
   - Enter your Apple ID email
   - Enter password
   - If you have 2FA, enter the code

2. **Certificate generation:**
   - EAS will ask: "Generate a new Apple Distribution Certificate?"
   - Answer: **Yes**
   
3. **Provisioning profile:**
   - EAS will ask: "Generate a new Apple Provisioning Profile?"
   - Answer: **Yes**

4. **Build starts:**
   - Uploads your code
   - Builds in the cloud
   - Takes about **15-20 minutes**

5. **Build completes:**
   ```
   ✓ Build finished
   Build URL: https://expo.dev/accounts/aleixmv/projects/travia/builds/...
   ```

**Copy this URL!** You'll need it to install on your iPhone.

---

### Step 4: Install on iPhone

**Two methods to install:**

#### Method A: Direct URL (Easiest)

1. **Copy the build URL** from terminal

2. **On your iPhone:**
   - Open **Safari** browser (must be Safari, not Chrome)
   - Paste and go to the build URL
   - Page will load showing "Travia"

3. **Tap "Install"**
   - iOS will ask to install the app
   - Tap "Install" to confirm

4. **Wait for installation:**
   - App icon appears on home screen
   - Shows "Installing..." then completes

#### Method B: QR Code

1. **Generate QR code:**
   ```bash
   eas build:list
   ```
   
2. **Scan with iPhone camera:**
   - Open Camera app on iPhone
   - Point at QR code
   - Tap notification

3. **Tap "Install"** in Safari

---

### Step 5: Trust the Developer Certificate

**Before you can launch the app:**

1. **Go to iPhone Settings**

2. **Navigate to:**
   ```
   General → VPN & Device Management
   ```
   (Or: General → Device Management)

3. **You'll see:**
   ```
   Developer App
   [Your Apple ID email]
   ```

4. **Tap on it**

5. **Tap "Trust [Your Apple ID]"**

6. **Confirm** when prompted

**Now the app is ready to use!** 🎉

---

### Step 6: Launch Travia

1. **Go to home screen**

2. **Find "Travia" icon**

3. **Tap to launch** ✅

Your app is now installed and working!

---

## ⏰ Expiration & Rebuild Schedule

### Understanding the 7-Day Limit

**Day 1-6:**
- ✅ App works perfectly
- ✅ No issues

**Day 7:**
- ❌ App fails to launch
- ❌ Shows "Unable to Verify App" error
- ❌ Completely unusable

**Solution:** Rebuild and reinstall

---

### Weekly Rebuild Process

**Every week, you must:**

```bash
# 1. Build new version
eas build --platform ios --profile preview

# 2. Wait 15-20 minutes

# 3. Open build URL on iPhone

# 4. Install (replaces old version)

# 5. Trust certificate (if needed)
```

**Total time:** ~20 minutes of active work + 15 minutes waiting

---

### Set Up Reminders

**Add to your calendar:**
```
Event: Rebuild Travia App
Frequency: Weekly (every Monday, for example)
Alert: 30 minutes before
Note: Run: eas build --platform ios --profile preview
```

**Or use macOS Reminders:**
```bash
# Set weekly reminder
echo "Rebuild Travia App" | pbcopy
# Then create recurring reminder in Reminders app
```

---

## 🔄 Update Process

**When you make code changes:**

```bash
# 1. Make your changes

# 2. Commit to git
git add .
git commit -m "Updated features"
git push

# 3. Build new version
eas build --platform ios --profile preview

# 4. Install on iPhone (same process as before)
```

The old version is automatically replaced.

---

## 📋 Quick Command Reference

```bash
# Register device (first time only)
eas device:create

# List registered devices
eas device:list

# Build app (do this weekly)
eas build --platform ios --profile preview

# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Check who you're logged in as
eas whoami
```

---

## 🆘 Troubleshooting

### "Unable to Verify App"
**Cause:** Build expired (7 days passed)  
**Solution:** Rebuild and reinstall

### "Untrusted Developer"
**Cause:** Haven't trusted certificate  
**Solution:** Settings → General → VPN & Device Management → Trust

### "Unable to Install"
**Cause:** Device UDID not registered  
**Solution:** Run `eas device:create` again with correct UDID

### "No matching provisioning profile"
**Cause:** Build for wrong device  
**Solution:** Make sure you registered the correct UDID

### "App won't launch"
**Cause:** Could be expired or not trusted  
**Solution:**
1. Check if 7 days have passed → Rebuild
2. Check Settings → VPN & Device Management → Trust

---

## 💡 Tips for Weekly Rebuilds

1. **Pick a consistent day:**
   - Every Monday morning, for example
   - Make it part of your routine

2. **Start the build before you need it:**
   - Build takes 15-20 minutes
   - Don't wait until it expires

3. **Set multiple reminders:**
   - Day 6: "Travia expires tomorrow"
   - Day 7: "Rebuild Travia now"

4. **Consider automation:**
   - Write a script to rebuild automatically
   - Schedule it with cron (but still requires manual install)

5. **Track expiration:**
   - Note when you built it
   - Mark calendar 6 days later

---

## 📊 Cost-Benefit Analysis

### Free Account (This Method)

**Pros:**
- ✅ Free
- ✅ Standalone app
- ✅ Good for testing

**Cons:**
- ❌ 20 min/week maintenance
- ❌ ~17 hours/year total time
- ❌ Risk of forgetting
- ❌ App breaks when you need it

**Annual time cost:** ~17 hours

### Paid Account ($99/year)

**Pros:**
- ✅ Build once
- ✅ Never expires
- ✅ Set and forget
- ✅ Professional

**Cons:**
- ❌ $99/year

**Annual time cost:** ~20 minutes (one build)

### Reality Check

**If your time is worth $10/hour:**
- Free method costs: 17 hours × $10 = **$170 in time**
- Paid method costs: **$99 + 20 minutes**

**The paid method is actually cheaper when you factor in your time.**

---

## 🎯 Recommended Path

### Week 1-2: Try the Free Method
- See if you like the app
- Test all features
- Decide if it's useful

### After 2 Weeks: Decide
**If you're still using it:**
- Pay $99 for Apple Developer account
- Build once, use forever
- Worth it for peace of mind

**If you're not using it:**
- Stop rebuilding
- No money wasted

---

## 🚦 Current Status

**What you have:**
- ✅ EAS CLI installed
- ✅ Logged in as aleixmv
- ✅ Project configured
- ✅ Ready to build

**What you need to do:**
1. Get iPhone UDID
2. Register device
3. Build app
4. Install on iPhone
5. Set weekly reminder

---

## 📞 Next Steps

**Ready to start? Here's what to do:**

1. **Connect iPhone to Mac**

2. **Get UDID** (Finder → iPhone → Click device info)

3. **Run this:**
   ```bash
   eas device:create
   ```

4. **Then run this:**
   ```bash
   eas build --platform ios --profile preview
   ```

5. **Wait 15-20 minutes**

6. **Install from build URL**

**Let me know when you're ready and I'll help you through each step!**

---

## ⚠️ Final Warning

**This method requires weekly maintenance.**

If you:
- Forget to rebuild
- Go on vacation
- Get busy with work
- Ignore reminders

**Your app will stop working.**

**Be honest with yourself:** Will you actually rebuild every week?

If not → Pay $99 for peace of mind.

---

Good luck! 🍀
