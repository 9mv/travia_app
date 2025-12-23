# Project Structure

## Overview

This document describes the organization of the Travel Packing List app codebase.

```
App_llista_viatges/
├── README.md                    # Main documentation
├── package.json                 # Dependencies and npm scripts
├── app.json                     # Expo configuration
├── app.config.js                # Dynamic Expo config
├── tsconfig.json                # TypeScript configuration
├── babel.config.js              # Babel configuration
├── eas.json                     # Expo Application Services config
│
├── items-config.json            # 🎯 Packing items configuration (with defaults)
│
├── App.tsx                      # Main app entry point
├── index.js                     # Expo entry point
│
├── assets/                      # App assets (images, fonts, etc.)
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
│
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── TripConfigScreen.tsx    # Trip configuration form
│   │   ├── PackingListScreen.tsx   # Packing list display
│   │   └── ChatAssistant.tsx       # AI chat assistant modal
│   │
│   ├── services/                # Business logic & API services
│   │   ├── AIService.ts            # OpenRouter AI integration
│   │   ├── PackingListService.ts   # List generation logic
│   │   ├── RemindersService.ts     # iOS Reminders export
│   │   ├── TextService.ts          # Localization service
│   │   └── translations/           # Generated translation modules
│   │       ├── ca.ts                  # Catalan translations
│   │       ├── en.ts                  # English translations
│   │       └── es.ts                  # Spanish translations
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts                # All app types
│   │
│   └── utils/                   # Utility functions
│       └── configUtils.ts          # Config loading & defaults
│
├── translations/                # 🌍 Translation management
│   ├── text-strings-ca.csv         # Catalan UI strings (175 strings)
│   ├── text-strings-en.csv         # English UI strings (175 strings)
│   ├── text-strings-es.csv         # Spanish UI strings (174 strings)
│   └── regenerate-translations.js  # CSV → TypeScript converter
│
├── scripts/                     # 🛠️ Maintenance scripts
│   ├── cleanup-config-defaults.js  # Remove redundant config fields
│   └── migrate-quantity-type.js    # Legacy migration script
│
└── docs/                        # 📚 Documentation
    ├── INDEX.md                     # Documentation index
    ├── QUICKSTART.md                # Quick start guide
    ├── TECHNICAL.md                 # Technical details
    ├── DEPLOYMENT.md                # Deployment guide
    ├── CUSTOMIZATION.md             # Customization guide
    ├── ITEMS_CONFIG.md              # Items configuration guide
    ├── CONFIG_DEFAULTS_SUMMARY.md   # Defaults implementation
    └── PROJECT_STRUCTURE.md         # This file
```

## Core Files

### Configuration Files

| File | Purpose | Documentation |
|------|---------|---------------|
| `items-config.json` | Defines all 57 packing items with rules | [ITEMS_CONFIG.md](./ITEMS_CONFIG.md) |
| `app.json` / `app.config.js` | Expo app configuration | [Expo Docs](https://docs.expo.dev/workflow/configuration/) |
| `tsconfig.json` | TypeScript compiler settings | - |
| `package.json` | Dependencies and scripts | - |

### Translation Files

| File | Purpose | Lines | Strings |
|------|---------|-------|---------|
| `translations/text-strings-ca.csv` | Catalan UI text | ~180 | 175 |
| `translations/text-strings-en.csv` | English UI text | ~180 | 175 |
| `translations/text-strings-es.csv` | Spanish UI text | ~180 | 174 |

**Workflow:**
1. Edit CSV files to add/modify translations
2. Run `npm run translations` to regenerate TypeScript files
3. Import and use via `getText(TextIds.XXX)` in components

### Source Code Structure

#### Components (`src/components/`)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `TripConfigScreen.tsx` | ~350 | Trip configuration form (6 inputs + validation) |
| `PackingListScreen.tsx` | ~600 | Display list, AI suggestions, chat button, export |
| `ChatAssistant.tsx` | ~300 | Modal chat interface for post-generation optimization |

#### Services (`src/services/`)

| Service | Lines | Purpose |
|---------|-------|---------|
| `PackingListService.ts` | ~110 | Generate filtered packing lists with quantity calculation |
| `AIService.ts` | ~180 | OpenRouter API integration (list enhancement, chat) |
| `RemindersService.ts` | ~80 | Export lists to iOS Reminders app |
| `TextService.ts` | ~200 | Multi-language text management with TextIds enum |

#### Types (`src/types/index.ts`)

**~150 lines** containing all TypeScript interfaces:
- `ItemConfig` - Packing item definition
- `ItemConfigDefaults` - Default values for items
- `PackingList` - Generated list structure
- `TravelConfig` - User trip configuration
- `ChatMessage` - Chat history
- `AIResponse` / `AIChatResponse` - AI API responses

#### Utilities (`src/utils/configUtils.ts`)

**~50 lines** with config loading logic:
- `getItemsConfig()` - Loads items-config.json with defaults applied
- `getCurrentSeason()` - Determines current season
- `getItemById()` - Lookup by ID
- `getItemsByCategory()` - Filter by category

### Scripts (`scripts/`)

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `cleanup-config-defaults.js` | Remove fields matching defaults from items | After changing defaults, to minimize config |
| `migrate-quantity-type.js` | Convert old format to new (legacy) | One-time migration (already done) |

**Run from project root:**
```bash
node scripts/cleanup-config-defaults.js
node scripts/migrate-quantity-type.js
```

## Key Features by File

### Multi-language Support
- **CSV files**: `translations/text-strings-*.csv` (source of truth)
- **Generator**: `translations/regenerate-translations.js`
- **Runtime**: `src/services/TextService.ts` + `src/services/translations/*.ts`
- **Usage**: `getText(TextIds.XXX)` anywhere in components

### Item Filtering System
- **Config**: `items-config.json` (with defaults)
- **Logic**: `src/services/PackingListService.ts`
- **Filters**: minDays, seasons, destination, requiresBigLuggage
- **Calculation**: Fixed quantity vs. per-day (dailyFactor)

### AI Integration
- **Service**: `src/services/AIService.ts`
- **Model**: gpt-4o-mini via OpenRouter API
- **Features**:
  - List enhancement with AI summary
  - Item-specific recommendations
  - Chat assistant for post-generation optimization

### Chat Assistant
- **Component**: `src/components/ChatAssistant.tsx`
- **Integration**: Button in PackingListScreen footer
- **Purpose**: Suggest additional items/quantities based on user details
- **Context-aware**: Includes current list, trip config, chat history

## Data Flow

### 1. App Start
```
index.js → App.tsx → TripConfigScreen
                  ↓
         TextService loads translations
                  ↓
         configUtils loads items-config.json + applies defaults
```

### 2. List Generation
```
User fills TripConfigScreen
        ↓
PackingListService.generatePackingList(config)
        ↓
Filters items: minDays → requiresBigLuggage → seasons → destination
        ↓
Calculates quantities: fixed vs. perDay (dailyFactor × days)
        ↓
Optional: AIService.enhancePackingList() if useAI=true
        ↓
PackingListScreen displays results
```

### 3. Chat Interaction
```
User clicks "💬 Assistent" button
        ↓
ChatAssistant modal opens
        ↓
User sends message
        ↓
AIService.getChatResponse(message, packingList, history)
        ↓
AI suggests items/quantities
        ↓
Auto-added to list or shown as suggestions
```

### 4. Export
```
User clicks "Export to Reminders"
        ↓
RemindersService.requestPermissions()
        ↓
RemindersService.exportToReminders(packingList)
        ↓
Creates "Packing List" reminder list with all items
```

## File Size Reference

### Source Code
- Total TypeScript: ~2,000 lines
- Components: ~1,250 lines
- Services: ~570 lines
- Types: ~150 lines
- Utils: ~50 lines

### Configuration
- items-config.json: 566 lines (45% reduction with defaults)
- Translation CSVs: ~180 lines each

### Documentation
- Total markdown: ~3,000 lines across 8 files

## Environment Variables

Stored in `.env` (not committed) and `.env.example` (template):

```bash
OPENROUTER_API_KEY=sk-or-v1-xxx  # Required for AI features
```

Load via `expo-constants` in `app.config.js`:
```javascript
extra: {
  openRouterApiKey: process.env.OPENROUTER_API_KEY
}
```

Access in code:
```typescript
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.openRouterApiKey;
```

## NPM Scripts

Defined in `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `node translations/regenerate-translations.js && expo start` | Regenerate translations + start dev server |
| `dev` | `expo start` | Start dev server only (skip translation regen) |
| `translations` | `node translations/regenerate-translations.js` | Regenerate translation TypeScript files from CSV |
| `android` | `expo start --android` | Start with Android emulator/device |
| `ios` | `expo start --ios` | Start with iOS simulator/device |

## Dependencies

### Core
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Expo SDK**: 54.0.0
- **TypeScript**: 5.3.0

### Features
- **@react-native-async-storage/async-storage**: Local storage
- **expo-calendar**: iOS Reminders integration
- **expo-secure-store**: API key storage
- **openai**: OpenRouter API client
- **react-native-markdown-display**: AI summary rendering

## Build & Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Build configuration (`eas.json`)
- iOS App Store submission
- Android Play Store submission
- Version management

## Maintenance Tasks

### Adding a New Item
1. Edit `items-config.json` - add new item (minimal fields)
2. Add translations in `translations/text-strings-*.csv`
3. Run `npm run translations`
4. Done! Defaults apply automatically

### Adding a New Language
1. Copy `translations/text-strings-ca.csv` to `text-strings-xx.csv`
2. Translate all strings to new language
3. Update `translations/regenerate-translations.js` to include new file
4. Update `src/services/TextService.ts` to support new language enum
5. Run `npm run translations`

### Changing Default Values
1. Edit `defaults` section in `items-config.json`
2. Run `node scripts/cleanup-config-defaults.js` to remove now-redundant fields
3. Test to ensure items still generate correctly

### Adding a New UI String
1. Add to all CSV files: `translations/text-strings-*.csv`
2. Run `npm run translations`
3. Add TextId constant in `src/services/TextService.ts`
4. Use via `getText(TextIds.YOUR_NEW_STRING)` in components

## Git Structure

### Main Branch
Production-ready code

### Ignored Files (`.gitignore`)
- `.env` - API keys (use `.env.example` as template)
- `node_modules/` - Dependencies
- `.expo/` - Expo cache
- `*.log` - Log files

### Committed Files
- All source code
- All documentation
- Configuration files
- Translation CSVs (source of truth)
- Scripts

## Code Style

### TypeScript
- Strict mode enabled
- All types explicitly defined in `src/types/index.ts`
- No `any` types
- Interfaces for all data structures

### Components
- Functional components with hooks
- StyleSheet.create for styles
- TextIds for all user-facing text
- Props interfaces for all components

### Services
- Static methods for utility classes
- Clear separation of concerns
- Async/await for API calls
- Error handling with try/catch

## Related Documentation

- [README.md](../README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Get started quickly
- [ITEMS_CONFIG.md](./ITEMS_CONFIG.md) - Items configuration guide
- [TECHNICAL.md](./TECHNICAL.md) - Technical details
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - How to customize
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Build and deploy
- [CONFIG_DEFAULTS_SUMMARY.md](./CONFIG_DEFAULTS_SUMMARY.md) - Defaults system

## Questions?

For issues or questions:
1. Check relevant documentation file
2. Review code comments
3. Check git history for context
4. Test changes in development mode first
