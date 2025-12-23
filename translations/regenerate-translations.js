const fs = require('fs');
const path = require('path');

function csvToTypeScript(csvFile, tsFile, varName) {
  const csvPath = path.join(__dirname, '..', csvFile);
  const tsPath = path.join(__dirname, '..', tsFile);
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  
  const translations = {};
  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    
    const commaIndex = line.indexOf(',');
    if (commaIndex === -1) continue;
    
    const key = line.substring(0, commaIndex);
    const value = line.substring(commaIndex + 1).replace(/^"(.*)"$/, '$1');
    translations[key] = value;
  }
  
  const tsContent = `export const ${varName}: Record<string, string> = ${JSON.stringify(translations, null, 2)};\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log(`✓ Generated ${tsFile} with ${Object.keys(translations).length} translations`);
}

console.log('Regenerating translation files from CSV...\n');

csvToTypeScript('translations/text-strings-ca.csv', 'src/services/translations/ca.ts', 'translationsCa');
csvToTypeScript('translations/text-strings-en.csv', 'src/services/translations/en.ts', 'translationsEn');
csvToTypeScript('translations/text-strings-es.csv', 'src/services/translations/es.ts', 'translationsEs');

console.log('\n✓ All translation files generated successfully!');
