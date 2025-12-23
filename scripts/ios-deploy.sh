#!/bin/bash

# Travia iOS Deployment Script
# This script guides you through building and installing Travia on your iPhone

echo "🚀 Travia iOS Deployment Helper"
echo "================================"
echo ""

# Check if logged in
echo "📋 Step 1: Checking EAS login status..."
if ! eas whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to EAS"
    echo "Please run: eas login"
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Check Apple Developer Account
echo "📋 Step 2: Apple Developer Account"
echo "Do you have an Apple Developer Account ($99/year)?"
echo "  - YES: You'll get builds that never expire"
echo "  - NO: You'll get builds that expire after 7 days"
echo ""
read -p "Press Enter to continue..."
echo ""

# Device Registration
echo "📋 Step 3: Register Your iPhone"
echo ""
echo "To register your iPhone, you need its UDID:"
echo "  1. Connect iPhone to Mac via USB"
echo "  2. Open Finder"
echo "  3. Click on your iPhone in sidebar"
echo "  4. Click on device info (cycles: Serial → UDID → Model)"
echo "  5. Right-click UDID and 'Copy'"
echo ""
read -p "Have you copied your UDID? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running: eas device:create"
    eas device:create
    echo ""
fi

# Build Configuration
echo "📋 Step 4: Choose Build Type"
echo ""
echo "Which build would you like to create?"
echo "  1) Preview (Ad Hoc) - Install directly on your device (RECOMMENDED)"
echo "  2) Production (TestFlight) - Install via TestFlight app"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building for Ad Hoc distribution..."
        echo "This will take approximately 15-20 minutes."
        echo ""
        read -p "Start build now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            eas build --platform ios --profile preview
            echo ""
            echo "✅ Build complete!"
            echo ""
            echo "📱 To install on your iPhone:"
            echo "  1. Open the build URL on your iPhone in Safari"
            echo "  2. Tap 'Install'"
            echo "  3. Go to Settings → General → VPN & Device Management"
            echo "  4. Trust the profile"
            echo "  5. Launch Travia!"
            echo ""
            echo "Or scan the QR code with your iPhone camera"
            eas build:list --limit=1
        fi
        ;;
    2)
        echo ""
        echo "🔨 Building for TestFlight..."
        echo "This will take approximately 20-30 minutes."
        echo ""
        echo "⚠️  Note: You'll need to configure App Store Connect first"
        echo ""
        read -p "Start build now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            eas build --platform ios --profile production
            echo ""
            echo "✅ Build complete!"
            echo ""
            echo "Next steps:"
            echo "  1. Run: eas submit --platform ios"
            echo "  2. Go to App Store Connect"
            echo "  3. Add yourself as TestFlight tester"
            echo "  4. Install TestFlight app on iPhone"
            echo "  5. Accept invitation and install Travia"
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done! Check the guide at docs/IOS_DEPLOYMENT.md for more info"
