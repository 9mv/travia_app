#!/bin/bash

# Travia iOS Build Setup Script
# This script sets up and builds the iOS app for local development with Xcode

set -e  # Exit on error

echo "🚀 Travia iOS Build Setup"
echo "========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Checking prerequisites...${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Xcode is not installed.${NC}"
    echo "Please install Xcode from the Mac App Store."
    exit 1
fi
echo -e "${GREEN}✅ Xcode: $(xcodebuild -version | head -1)${NC}"

# Check for CocoaPods
if ! command -v pod &> /dev/null; then
    echo -e "${YELLOW}⚠️  CocoaPods not found. Installing...${NC}"
    brew install cocoapods
fi
echo -e "${GREEN}✅ CocoaPods: $(pod --version)${NC}"

echo ""
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
npm install --legacy-peer-deps

echo ""
echo -e "${BLUE}🏗️  Step 3: Generating native iOS project...${NC}"
echo "This creates the /ios directory with all native files."

# Clean old build if exists
if [ -d "ios" ]; then
    echo -e "${YELLOW}⚠️  Existing /ios directory found. Cleaning...${NC}"
    rm -rf ios
fi

# Generate native project
npx expo prebuild --platform ios --clean

echo ""
echo -e "${GREEN}✅ iOS project generated successfully!${NC}"
echo ""

# Check if iPhone is connected
echo -e "${BLUE}📱 Step 4: Checking for connected devices...${NC}"
DEVICE_COUNT=$(idevice_id -l 2>/dev/null | wc -l | xargs)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No iPhone detected.${NC}"
    echo "Please connect your iPhone via USB cable."
    echo ""
else
    DEVICE_UDID=$(idevice_id -l)
    echo -e "${GREEN}✅ iPhone connected: $DEVICE_UDID${NC}"
    echo ""
fi

echo -e "${BLUE}🎯 Step 5: Opening project in Xcode...${NC}"
open ios/travia.xcworkspace

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📱 Next Steps in Xcode:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Wait for Xcode to fully open and index the project"
echo ""
echo "2. Configure Signing:"
echo "   • Click 'travia' (blue icon) in left sidebar"
echo "   • Select 'travia' under TARGETS"
echo "   • Click 'Signing & Capabilities' tab"
echo "   • Check ☑️ 'Automatically manage signing'"
echo "   • Select your Apple ID in 'Team' dropdown"
echo "     (Click 'Add Account...' if needed)"
echo ""
echo "3. Select Your Device:"
echo "   • At the top toolbar, click device selector"
echo "   • Choose your iPhone from the list"
echo "   • If not visible: unlock iPhone, trust computer"
echo ""
echo "4. For Development Build (with Metro bundler):"
echo "   • Keep 'Debug' configuration"
echo "   • Press ▶️ Play button (or Cmd+R)"
echo "   • Run: npm start --dev-client in another terminal"
echo ""
echo "5. For Production Build (standalone, no Metro):"
echo "   • Menu: Product → Scheme → Edit Scheme..."
echo "   • Select 'Run' → Change 'Build Configuration' to 'Release'"
echo "   • Press Cmd+Shift+K (Clean)"
echo "   • Press ▶️ Play button (or Cmd+R)"
echo "   • App works without Metro bundler! ✨"
echo ""
echo "6. First Launch on iPhone:"
echo "   • Settings → General → VPN & Device Management"
echo "   • Tap your email → Trust"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⏰ Remember: Free Apple account builds expire after 7 days${NC}"
echo ""
