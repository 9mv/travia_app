import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';
import { CustomItemConfig, CustomItemsStorage } from '../types';
import { getItemsConfig } from '../utils/configUtils';

const STORAGE_KEY = '@custom_items';
const STORAGE_VERSION = 1;

export class CustomItemsService {
  /**
   * Initialize custom items from default configuration on first launch
   */
  static async initializeFromDefaults(): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      if (existing) {
        // Already initialized
        return;
      }

      // Load default items from items-config.json
      const defaultConfig = getItemsConfig();
      const customItems: CustomItemConfig[] = defaultConfig.items.map(item => ({
        ...item,
        isCustom: false, // These are from defaults, not user-created
      }));

      await this.saveCustomItems(customItems);
      console.log('✅ Initialized custom items from defaults');
    } catch (error) {
      console.error('❌ Error initializing custom items:', error);
      throw error;
    }
  }

  /**
   * Load custom items from AsyncStorage
   */
  static async loadCustomItems(): Promise<CustomItemConfig[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Not initialized yet, initialize from defaults
        await this.initializeFromDefaults();
        return this.loadCustomItems(); // Recursive call to load after init
      }

      const storage: CustomItemsStorage = JSON.parse(stored);
      
      // Handle version migrations here if needed in the future
      if (storage.version !== STORAGE_VERSION) {
        console.warn('⚠️  Storage version mismatch, migrating...');
        // Add migration logic here if schema changes
      }

      return storage.items;
    } catch (error) {
      console.error('❌ Error loading custom items:', error);
      throw error;
    }
  }

  /**
   * Save custom items to AsyncStorage
   */
  static async saveCustomItems(items: CustomItemConfig[]): Promise<void> {
    try {
      const storage: CustomItemsStorage = {
        version: STORAGE_VERSION,
        lastModified: new Date(),
        items,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      console.log(`✅ Saved ${items.length} custom items`);
    } catch (error) {
      console.error('❌ Error saving custom items:', error);
      throw error;
    }
  }

  /**
   * Add a new custom item
   */
  static async addCustomItem(item: CustomItemConfig): Promise<void> {
    const items = await this.loadCustomItems();
    
    // Check if ID already exists
    if (items.some(i => i.id === item.id)) {
      throw new Error(`Item with ID "${item.id}" already exists`);
    }

    items.push({ ...item, isCustom: true });
    await this.saveCustomItems(items);
  }

  /**
   * Update an existing item
   */
  static async updateCustomItem(itemId: string, updates: Partial<CustomItemConfig>): Promise<void> {
    const items = await this.loadCustomItems();
    const index = items.findIndex(i => i.id === itemId);
    
    if (index === -1) {
      throw new Error(`Item with ID "${itemId}" not found`);
    }

    items[index] = { ...items[index], ...updates };
    await this.saveCustomItems(items);
  }

  /**
   * Delete a custom item
   */
  static async deleteCustomItem(itemId: string): Promise<void> {
    const items = await this.loadCustomItems();
    const filtered = items.filter(i => i.id !== itemId);
    
    if (filtered.length === items.length) {
      throw new Error(`Item with ID "${itemId}" not found`);
    }

    await this.saveCustomItems(filtered);
  }

  /**
   * Restore items to factory defaults
   */
  static async restoreToDefaults(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await this.initializeFromDefaults();
    console.log('✅ Restored items to factory defaults');
  }

  /**
   * Export custom items as JSON string
   */
  static async exportAsJSON(): Promise<string> {
    const items = await this.loadCustomItems();
    const storage: CustomItemsStorage = {
      version: STORAGE_VERSION,
      lastModified: new Date(),
      items,
    };
    return JSON.stringify(storage, null, 2);
  }

  /**
   * Share exported JSON data
   */
  static async shareJSON(): Promise<void> {
    try {
      const json = await this.exportAsJSON();
      await Share.share({
        message: json,
        title: 'Export Packing Items',
      });
    } catch (error) {
      console.error('❌ Error sharing items:', error);
      throw error;
    }
  }

  /**
   * Export custom items as CSV string
   */
  static async exportAsCSV(): Promise<string> {
    const items = await this.loadCustomItems();
    
    // CSV header
    const headers = [
      'id',
      'name',
      'category',
      'quantityType',
      'quantity',
      'dailyFactor',
      'seasons',
      'includeFor',
      'minDays',
      'requiresBigLuggage',
      'isCustom'
    ];

    const csvLines = [headers.join(',')];

    // CSV rows
    items.forEach(item => {
      const row = [
        item.id,
        `"${item.name}"`, // Quoted in case of commas
        item.category,
        item.quantityType || 'fixed',
        item.quantity?.toString() || '1',
        item.dailyFactor?.toString() || '',
        `"${(item.seasons || []).join(';')}"`, // Semicolon-separated, quoted
        `"${(item.includeFor || []).join(';')}"`,
        item.minDays?.toString() || '0',
        item.requiresBigLuggage ? 'true' : 'false',
        item.isCustom ? 'true' : 'false',
      ];
      csvLines.push(row.join(','));
    });

    return csvLines.join('\n');
  }

  /**
   * Share exported CSV data
   */
  static async shareCSV(): Promise<void> {
    try {
      const csv = await this.exportAsCSV();
      await Share.share({
        message: csv,
        title: 'Export Packing Items CSV',
      });
    } catch (error) {
      console.error('❌ Error sharing items:', error);
      throw error;
    }
  }

  /**
   * Import custom items from JSON string
   */
  static async importFromJSON(jsonString: string): Promise<void> {
    try {
      const storage: CustomItemsStorage = JSON.parse(jsonString);
      
      // Validate structure
      if (!storage.items || !Array.isArray(storage.items)) {
        throw new Error('Invalid JSON format: missing items array');
      }

      // Validate each item has required fields
      storage.items.forEach((item, index) => {
        if (!item.id || !item.name || !item.category) {
          throw new Error(`Invalid item at index ${index}: missing required fields`);
        }
      });

      await this.saveCustomItems(storage.items);
      console.log(`✅ Imported ${storage.items.length} items from JSON`);
    } catch (error) {
      console.error('❌ Error importing items:', error);
      throw error;
    }
  }

  /**
   * Get item by ID
   */
  static async getItemById(itemId: string): Promise<CustomItemConfig | undefined> {
    const items = await this.loadCustomItems();
    return items.find(i => i.id === itemId);
  }

  /**
   * Get items by category
   */
  static async getItemsByCategory(category: string): Promise<CustomItemConfig[]> {
    const items = await this.loadCustomItems();
    return items.filter(i => i.category === category);
  }

  /**
   * Search items by name
   */
  static async searchItems(query: string): Promise<CustomItemConfig[]> {
    const items = await this.loadCustomItems();
    const lowerQuery = query.toLowerCase();
    return items.filter(i => 
      i.name.toLowerCase().includes(lowerQuery) ||
      i.id.toLowerCase().includes(lowerQuery)
    );
  }
}
