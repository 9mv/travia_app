import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';

/**
 * Service for managing app language preference
 */
export class LanguageService {
  private static readonly LANGUAGE_STORAGE_KEY = 'app_language';
  private static currentLanguage: Language = Language.Catalan; // Default

  /**
   * Get the current language
   */
  static getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Load language preference from storage
   */
  static async loadLanguage(): Promise<Language> {
    try {
      const stored = await AsyncStorage.getItem(this.LANGUAGE_STORAGE_KEY);
      if (stored && Object.values(Language).includes(stored as Language)) {
        this.currentLanguage = stored as Language;
      } else {
        this.currentLanguage = Language.Catalan; // Default
      }
      return this.currentLanguage;
    } catch (error) {
      console.error('Error loading language:', error);
      return Language.Catalan;
    }
  }

  /**
   * Save language preference
   */
  static async setLanguage(language: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
      this.currentLanguage = language;
    } catch (error) {
      console.error('Error saving language:', error);
      throw error;
    }
  }

  /**
   * Get language display name
   */
  static getLanguageName(language: Language): string {
    const names: Record<Language, string> = {
      [Language.Catalan]: 'Català',
      [Language.English]: 'English',
      [Language.Spanish]: 'Español',
    };
    return names[language];
  }

  /**
   * Get all available languages
   */
  static getAvailableLanguages(): Language[] {
    return [Language.Catalan, Language.English, Language.Spanish];
  }

  /**
   * Get language code for AI prompts
   */
  static getLanguageForAI(language: Language): string {
    const aiLanguages: Record<Language, string> = {
      [Language.Catalan]: 'Catalan',
      [Language.English]: 'English',
      [Language.Spanish]: 'Spanish',
    };
    return aiLanguages[language];
  }
}
