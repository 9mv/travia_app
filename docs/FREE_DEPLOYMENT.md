# 🆓 Free iOS Deployment - Travia App

## ⚠️ Important Reality Check

**There is NO free method to install a standalone app on iPhone that doesn't expire.**

Apple enforces these limitations:
- **Free Apple Developer Account**: Apps expire after 7 days
- **No workarounds exist** - This is iOS security policy
- **Only paid accounts ($99/year)** get non-expiring builds

---

## 🎯 Your Free Options

### Option 1: Expo Go (Truly Free, No Expiration) ✅

**What it is:**
- Run your app inside the **Expo Go** container app
- No building required
- No expiration
- Updates instantly

**Limitations:**
- ❌ App runs inside Expo Go (not standalone)
- ❌ App name is "Expo Go" on home screen
- ❌ Cannot publish to App Store
- ❌ Some native features may not work
- ✅ Perfect for development and personal use
- ✅ Completely free forever

**How to use:**

1. **Install Expo Go on your iPhone:**
   - Download from App Store: https://apps.apple.com/app/expo-go/id982107779

2. **Start your development server:**
   ```bash
   npm start
   ```

3. **Connect your iPhone:**
   - Make sure iPhone and Mac are on **same WiFi**
   - Scan the QR code with iPhone camera
   - Opens in Expo Go automatically

4. **Use your app:**
   - App runs inside Expo Go
   - Updates automatically when you make changes
   - Never expires
   - Completely free

**Pros:**
- ✅ Free forever
- ✅ Never expires
- ✅ Instant updates
- ✅ No building required
- ✅ Perfect for personal use

**Cons:**
- ❌ Not a standalone app
- ❌ Shows "Expo Go" as app name
- ❌ Requires Expo Go to be installed
- ❌ Cannot distribute to others easily

---

### Option 2: Weekly Rebuild (Free but Tedious) ⚠️

**What it is:**
- Use free Apple Developer account
- Build expires after 7 days
- Rebuild every week

**How to use:**

```bash
# Every Monday (or whenever it expires):
eas build --platform ios --profile preview

# Then reinstall on iPhone (15-20 min process)
```

**Pros:**
- ✅ Free (no Apple Developer account needed)
- ✅ Standalone app on home screen
- ✅ App name shows as "Travia"

**Cons:**
- ❌ **Expires after 7 days**
- ❌ App stops working completely
- ❌ Must rebuild weekly (~15-20 min)
- ❌ Must reinstall on device each time
- ❌ Tedious maintenance

**Reality:**
- You'll likely forget to rebuild
- App will stop working when you need it
- Very frustrating for real usage
- **Not recommended for actual use**

---

### Option 3: TestFlight (Free 90 Days, Must Rebuild) ⚠️

**What it is:**
- Submit to TestFlight
- Builds expire after **90 days**
- Need paid Apple Developer account

**Cost:**
- **$99/year** Apple Developer membership required
- So not actually free

**If you have paid account:**
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

**Pros:**
- ✅ 90-day expiration (better than 7)
- ✅ Professional distribution
- ✅ Easy updates

**Cons:**
- ❌ Requires **$99/year** (NOT FREE)
- ❌ Still expires after 90 days
- ❌ Must rebuild quarterly

---

## 💡 Recommended Approach

### For Development/Personal Use:
**Use Expo Go** - It's the only truly free option without expiration:

```bash
# Just run this and scan QR code on iPhone:
npm start
```

### For Production/Real Use:
**Pay $99/year** for Apple Developer account:
- Apps never expire
- Professional solution
- One-time annual cost
- Worth it if you'll use the app regularly

---

## 🔧 Setup Guide for Expo Go (Free Method)

### Step 1: Install Expo Go on iPhone
1. Open App Store on iPhone
2. Search "Expo Go"
3. Install (it's free)

### Step 2: Connect iPhone and Mac to Same WiFi
- Both devices must be on the same network
- Won't work on cellular data

### Step 3: Start Development Server
```bash
cd /Users/aleix/Projectes_Local/App_llista_viatges
npm start
```

### Step 4: Scan QR Code
- A QR code will appear in terminal
- Open iPhone Camera app
- Point at QR code
- Tap notification to open in Expo Go

### Step 5: Use Your App
- App loads in Expo Go
- Works exactly like standalone app
- Updates automatically when you make changes
- Never expires

---

## 📊 Comparison Table

| Method | Cost | Expiration | Standalone | Effort | Best For |
|--------|------|------------|------------|--------|----------|
| **Expo Go** | Free | Never | ❌ | Low | Development, Personal Use ✅ |
| **Weekly Rebuild** | Free | 7 days | ✅ | High | Not Recommended |
| **Paid Developer** | $99/year | Never | ✅ | Low | Production, Real Use ✅ |
| **TestFlight** | $99/year | 90 days | ✅ | Medium | Beta Testing |

---

## 🎯 Bottom Line

**Want it free AND no expiration?**
→ Use **Expo Go** (runs inside container app)

**Want standalone app that never expires?**
→ Pay **$99/year** for Apple Developer account

**Want standalone AND free?**
→ **Not possible** - Apple doesn't allow this

---

## 🚀 Quick Start (Expo Go Method)

```bash
# 1. Install Expo Go on iPhone (App Store)

# 2. Start server
npm start

# 3. Scan QR code with iPhone camera

# 4. App opens in Expo Go - Done!
```

**That's it!** Your app will work forever, update automatically, and cost nothing.

The only downside: it shows "Expo Go" instead of "Travia" on your home screen and runs inside the Expo Go app.

---

## 💭 Making the Decision

**Choose Expo Go if:**
- ✅ You want it free
- ✅ You're okay with it running in Expo Go
- ✅ It's just for personal use
- ✅ You want instant updates

**Pay $99/year if:**
- ✅ You want a professional standalone app
- ✅ You want "Travia" as the app name
- ✅ You'll use it regularly
- ✅ You might want to distribute to others
- ✅ $99/year is acceptable (~$8/month)

**Reality Check:**
If you'll actually use this app regularly, the $99 is worth it. It's less than a Netflix subscription and you get a professional app that works forever.

---

## 🆘 Still Have Questions?

**"Can I hack it to not expire?"**
→ No, Apple enforces this at the iOS system level

**"What about jailbreaking?"**
→ Not recommended, security risks, voids warranty

**"Can I use someone else's paid account?"**
→ Against Apple's terms of service

**"Is there really no free way?"**
→ Expo Go is free and doesn't expire, but runs in container

---

## 📞 Next Steps

1. **Try Expo Go first** (free, easy, no commitment)
   ```bash
   npm start
   ```

2. **If you like it, decide:**
   - Keep using Expo Go (free forever), or
   - Upgrade to paid developer account ($99) for standalone app

3. **Don't bother with weekly rebuilds** - It's too tedious for real use

---

Good luck! 🍀
