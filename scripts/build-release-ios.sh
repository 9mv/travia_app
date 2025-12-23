#!/bin/bash

# Quick iOS Release Build Script
# Builds and installs a production version that doesn't need Metro bundler

set -e

echo "🚀 Building Travia Release Version"
echo "==================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if iOS project exists
if [ ! -d "ios" ]; then
    echo -e "${RED}❌ iOS project not found!${NC}"
    echo "Run './scripts/setup-ios.sh' first to generate the iOS project."
    exit 1
fi

# Check if iPhone is connected
echo -e "${BLUE}📱 Checking for connected iPhone...${NC}"
if ! command -v idevice_id &> /dev/null; then
    echo -e "${YELLOW}⚠️  Installing libimobiledevice to detect iPhone...${NC}"
    brew install libimobiledevice
fi

DEVICE_UDID=$(idevice_id -l 2>/dev/null)
if [ -z "$DEVICE_UDID" ]; then
    echo -e "${RED}❌ No iPhone detected!${NC}"
    echo "Please connect your iPhone via USB cable and unlock it."
    exit 1
fi

echo -e "${GREEN}✅ iPhone connected: $DEVICE_UDID${NC}"
echo ""

echo -e "${BLUE}🏗️  Building Release version...${NC}"
echo "This bundles all JavaScript into the app (no Metro bundler needed)"
echo ""

# Option 1: Using xcodebuild (command line)
echo -e "${YELLOW}Building with xcodebuild...${NC}"
cd ios

# Clean build folder
xcodebuild clean -workspace travia.xcworkspace -scheme travia -configuration Release

# Build and install on device
xcodebuild \
  -workspace travia.xcworkspace \
  -scheme travia \
  -configuration Release \
  -destination "id=$DEVICE_UDID" \
  -derivedDataPath build \
  CODE_SIGNING_ALLOWED=YES \
  CODE_SIGNING_REQUIRED=YES

cd ..

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📱 Installation:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The app should now be installed on your iPhone!"
echo ""
echo -e "${YELLOW}First time only:${NC}"
echo "1. Settings → General → VPN & Device Management"
echo "2. Tap your Apple ID email"
echo "3. Tap 'Trust'"
echo ""
echo -e "${GREEN}✨ App will work WITHOUT Metro bundler!${NC}"
echo ""
echo -e "${YELLOW}⏰ Remember: Rebuild every 7 days (free account)${NC}"
echo ""
