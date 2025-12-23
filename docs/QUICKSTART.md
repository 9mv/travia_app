# Quick Start Guide# Travel Packing List App



## Setup (5 minutes)## Quick Start



### 1. Install1. Install dependencies:

```bash   ```bash

npm install --legacy-peer-deps   npm install

```   ```



### 2. Get API Key (Optional - for AI)2. (Optional) Configure AI features:

- Visit https://openrouter.ai → Create account → Copy API key   ```bash

   cp .env.example .env

### 3. Configure API Key   # Edit .env and add your OpenRouter API key

**In-App**: Open app → Tap ⚙️ → Enter key → Save   ```

**Or .env**: `cp .env.example .env` → Edit .env

3. Run the app:

### 4. Run   ```bash

```bash   npm start

npm start          # Dev server   # Then press 'i' for iOS simulator

npm run ios        # iOS simulator   ```

npm run android    # Android emulator

```## What This App Does



## Usage- Generates smart packing lists based on trip duration and season

- Knows what you already have in home

### Create List- Uses AI to give personalized suggestions

1. Enter days- Syncs with iOS Reminders app

2. Toggle home mode if applicable

3. Select seasonSee README.md for full documentation.

4. Enable AI (optional)
5. Generate

### Export
Tap "Exportar a Recordatoris" → Grant permission → Done

## Customization

### Items
Edit `items-config.json`:
- `baseFactor`: Base quantity
- `dailyFactor`: Per-day quantity
- `excludeWhenHome`: true/false
- `seasonPreference`: 0.0-1.0 per season

### UI Text
Edit `text-strings.csv` (Catalan)

## Build Production

```bash
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API key not configured | Settings → Enter key |
| Permission denied | Device Settings → Enable Calendar |
| Won't start | `npx expo start --clear` |
| Build fails | `rm -rf node_modules && npm install --legacy-peer-deps` |

## Key Commands

```bash
npm start                           # Dev server
npx expo start --clear              # Clear cache
lsof -ti:8081 \| xargs kill -9      # Kill port
npx eas build --platform ios        # Build iOS
```
