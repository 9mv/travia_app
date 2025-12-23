# Translations Directory

This folder contains all translation-related files for multi-language support.

## Files

### Translation Source Files (CSV)

| File | Language | Strings | Status |
|------|----------|---------|--------|
| `text-strings-ca.csv` | Catalan | 175 | ✅ Default |
| `text-strings-en.csv` | English | 175 | ✅ Complete |
| `text-strings-es.csv` | Spanish | 174 | ⚠️ Missing 1 string |

**Format**:
```csv
textId,text
app.title,Llista de viatges
config.screen.title,Planificació de viatge
item.phone,Mòbil
```

### Generator Script

**`regenerate-translations.js`**

Converts CSV files to TypeScript modules for runtime use.

**Usage**:
```bash
# From project root
npm run translations

# Or directly
node translations/regenerate-translations.js
```

**What it does**:
1. Reads all `text-strings-*.csv` files
2. Parses CSV (skips header, handles # comments)
3. Generates TypeScript files in `../src/services/translations/`
4. Creates exports like:
```typescript
export const translationsCa: Record<string, string> = {
  "app.title": "Llista de viatges",
  "config.screen.title": "Planificació de viatge",
  ...
};
```

**Output**:
```
Regenerating translation files from CSV...

✓ Generated src/services/translations/ca.ts with 175 translations
✓ Generated src/services/translations/en.ts with 175 translations
✓ Generated src/services/translations/es.ts with 174 translations

✓ All translation files generated successfully!
```

## Workflow

### Adding a New String

1. **Add to all CSV files**:
```csv
# In text-strings-ca.csv
my.new.string,El meu nou text

# In text-strings-en.csv
my.new.string,My new text

# In text-strings-es.csv
my.new.string,Mi nuevo texto
```

2. **Regenerate TypeScript files**:
```bash
npm run translations
```

3. **Add TextId constant** in `src/services/TextService.ts`:
```typescript
export const TextIds = {
  // ... existing
  MY_NEW_STRING: 'my.new.string',
};
```

4. **Use in components**:
```typescript
import { getText, TextIds } from '../services/TextService';

<Text>{getText(TextIds.MY_NEW_STRING)}</Text>
```

### Editing Existing Strings

1. Edit the CSV file(s)
2. Run `npm run translations`
3. Changes appear immediately in app (hot reload)

### Adding a New Language

1. **Copy an existing CSV**:
```bash
cp text-strings-en.csv text-strings-fr.csv
```

2. **Translate all strings** in the new file

3. **Update `regenerate-translations.js`**:
```javascript
csvToTypeScript('translations/text-strings-fr.csv', 
                'src/services/translations/fr.ts', 
                'translationsFr');
```

4. **Update `src/services/TextService.ts`**:
```typescript
export enum Language {
  Catalan = 'ca',
  English = 'en',
  Spanish = 'es',
  French = 'fr',  // Add new language
}

// Update translations map
const translations: Record<Language, Record<string, string>> = {
  [Language.Catalan]: translationsCa,
  [Language.English]: translationsEn,
  [Language.Spanish]: translationsEs,
  [Language.French]: translationsFr,  // Add import and map
};
```

5. **Run translations**:
```bash
npm run translations
```

## File Structure

```
translations/
├── README.md                       # This file
├── regenerate-translations.js      # Generator script
├── text-strings-ca.csv             # Catalan (default, 175 strings)
├── text-strings-en.csv             # English (175 strings)
└── text-strings-es.csv             # Spanish (174 strings)

Generated files (not in this folder):
../src/services/translations/
├── ca.ts                           # Generated Catalan module
├── en.ts                           # Generated English module
└── es.ts                           # Generated Spanish module
```

## CSV Format Rules

1. **Header**: First line must be `textId,text`
2. **Comments**: Lines starting with `#` are ignored
3. **Empty lines**: Ignored
4. **Format**: `textId,translation text`
5. **No quotes needed**: Unless text contains commas
6. **Commas in text**: Wrap in quotes: `key,"Text with, comma"`

## Translation Categories

Strings are organized by prefix:

| Prefix | Category | Example |
|--------|----------|---------|
| `app.*` | App-level | `app.title`, `app.name` |
| `config.*` | Configuration screen | `config.screen.title`, `config.days.label` |
| `list.*` | Packing list screen | `list.title`, `list.export` |
| `item.*` | Item names | `item.phone`, `item.wallet` |
| `category.*` | Category names | `category.basics`, `category.clothes` |
| `ai.*` | AI features | `ai.summary.title`, `ai.suggestion.accept` |
| `chat.*` | Chat assistant | `chat.title`, `chat.welcome` |
| `general.*` | Common UI | `general.ok`, `general.cancel` |

## Translation Statistics

- **Total unique strings**: ~175
- **Catalan (ca)**: 175 (100%)
- **English (en)**: 175 (100%)
- **Spanish (es)**: 174 (99.4%)

## NPM Script

Defined in `package.json`:

```json
{
  "scripts": {
    "translations": "node translations/regenerate-translations.js",
    "start": "node translations/regenerate-translations.js && expo start"
  }
}
```

The `start` script automatically regenerates translations before starting the dev server.

## Best Practices

1. **Always add to all language files** to avoid missing translations
2. **Use descriptive textIds** that indicate context: `config.days.placeholder` not `daysPlaceholder`
3. **Run translations after CSV changes** to test immediately
4. **Group related strings** with common prefixes
5. **Keep translations short** for mobile UI constraints
6. **Test in all languages** before committing
7. **Use TextIds constants** never hardcode text IDs as strings

## See Also

- [../src/services/TextService.ts](../src/services/TextService.ts) - Runtime translation service
- [../docs/CUSTOMIZATION.md](../docs/CUSTOMIZATION.md) - Customization guide
- [../docs/PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Full project structure
