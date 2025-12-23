import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Service for securely storing and retrieving the OpenRouter API key
 * Uses expo-secure-store which provides encrypted storage on iOS and Android
 */
export class SecureStorageService {
  private static readonly API_KEY_STORAGE_KEY = 'openrouter_api_key';

  /**
   * Save the OpenRouter API key securely
   * @param apiKey The API key to store
   * @returns Promise<boolean> Success status
   */
  static async saveApiKey(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('API key cannot be empty');
      }

      // expo-secure-store is only available on iOS and Android
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await SecureStore.setItemAsync(this.API_KEY_STORAGE_KEY, apiKey.trim());
        console.log('API key saved securely');
        return true;
      } else {
        console.warn('Secure storage not available on this platform');
        return false;
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  }

  /**
   * Retrieve the OpenRouter API key from secure storage
   * @returns Promise<string | null> The API key or null if not found
   */
  static async getApiKey(): Promise<string | null> {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const apiKey = await SecureStore.getItemAsync(this.API_KEY_STORAGE_KEY);
        return apiKey;
      } else {
        console.warn('Secure storage not available on this platform');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  }

  /**
   * Delete the stored API key
   * @returns Promise<boolean> Success status
   */
  static async deleteApiKey(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await SecureStore.deleteItemAsync(this.API_KEY_STORAGE_KEY);
        console.log('API key deleted');
        return true;
      } else {
        console.warn('Secure storage not available on this platform');
        return false;
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  /**
   * Check if an API key is stored
   * @returns Promise<boolean> True if API key exists
   */
  static async hasApiKey(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return apiKey !== null && apiKey.trim() !== '';
  }

  /**
   * Validate API key format (basic check)
   * @param apiKey The API key to validate
   * @returns boolean True if format looks valid
   */
  static validateApiKeyFormat(apiKey: string): boolean {
    // OpenRouter keys typically start with 'sk-or-v1-'
    return apiKey.trim().startsWith('sk-or-v1-') && apiKey.length > 20;
  }
}
