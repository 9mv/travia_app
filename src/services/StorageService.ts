import AsyncStorage from '@react-native-async-storage/async-storage';
import { PackingList, TravelConfig } from '../types';

const STORAGE_KEYS = {
  PACKING_LISTS: 'packing_lists',
  LAST_CONFIG: 'last_config',
  AI_ENABLED: 'ai_enabled',
};

export class StorageService {
  /**
   * Save a packing list
   */
  static async savePackingList(list: PackingList): Promise<void> {
    try {
      const existing = await this.getAllPackingLists();
      const updated = [...existing, list];
      
      // Keep only last 10 lists
      const limited = updated.slice(-10);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PACKING_LISTS,
        JSON.stringify(limited)
      );
    } catch (error) {
      console.error('Error saving packing list:', error);
      throw error;
    }
  }

  /**
   * Get all saved packing lists
   */
  static async getAllPackingLists(): Promise<PackingList[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PACKING_LISTS);
      if (!data) return [];
      
      const lists = JSON.parse(data) as PackingList[];
      // Convert date strings back to Date objects
      return lists.map(list => ({
        ...list,
        generatedAt: new Date(list.generatedAt),
      }));
    } catch (error) {
      console.error('Error getting packing lists:', error);
      return [];
    }
  }

  /**
   * Save last used travel configuration
   */
  static async saveLastConfig(config: TravelConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_CONFIG,
        JSON.stringify(config)
      );
    } catch (error) {
      console.error('Error saving last config:', error);
    }
  }

  /**
   * Get last used travel configuration
   */
  static async getLastConfig(): Promise<TravelConfig | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CONFIG);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting last config:', error);
      return null;
    }
  }

  /**
   * Save AI preference
   */
  static async saveAIPreference(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AI_ENABLED,
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.error('Error saving AI preference:', error);
    }
  }

  /**
   * Get AI preference
   */
  static async getAIPreference(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AI_ENABLED);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting AI preference:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Delete a specific packing list
   */
  static async deletePackingList(index: number): Promise<void> {
    try {
      const lists = await this.getAllPackingLists();
      lists.splice(index, 1);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PACKING_LISTS,
        JSON.stringify(lists)
      );
    } catch (error) {
      console.error('Error deleting packing list:', error);
      throw error;
    }
  }
}
