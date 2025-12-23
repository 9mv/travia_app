import { Language } from '../types';
import { LanguageService } from './LanguageService';
import { translationsCa } from './translations/ca';
import { translationsEn } from './translations/en';
import { translationsEs } from './translations/es';

const translations: Record<Language, Record<string, string>> = {
  [Language.Catalan]: translationsCa,
  [Language.English]: translationsEn,
  [Language.Spanish]: translationsEs,
};

class TextServiceClass {
  private currentLanguage: Language = Language.Catalan;

  async initialize(): Promise<void> {
    this.currentLanguage = await LanguageService.loadLanguage();
  }

  async setLanguage(language: Language): Promise<void> {
    await LanguageService.setLanguage(language);
    this.currentLanguage = language;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  getText(textId: string, params?: Record<string, string | number>): string {
    const currentStrings = translations[this.currentLanguage] || translations[Language.Catalan];
    let text = currentStrings[textId] || textId;
    
    if (params) {
      Object.keys(params).forEach(key => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
      });
    }
    
    return text;
  }
}

const textServiceInstance = new TextServiceClass();

export function getText(textId: string, params?: Record<string, string | number>): string {
  return textServiceInstance.getText(textId, params);
}

export const TextService = textServiceInstance;

export const TextIds = {
  APP_TITLE: 'app.title',
  CONFIG_TITLE: 'config.screen.title',
  CONFIG_SUBTITLE: 'config.screen.subtitle',
  CONFIG_DAYS_LABEL: 'config.days.label',
  CONFIG_DAYS_PLACEHOLDER: 'config.days.placeholder',
  CONFIG_HOME_LABEL: 'config.home.label',
  CONFIG_HOME_HELPER: 'config.home.helper',
  CONFIG_AI_LABEL: 'config.ai.label',
  CONFIG_AI_HELPER: 'config.ai.helper',
  CONFIG_LUGGAGE_LABEL: 'config.luggage.label',
  CONFIG_LUGGAGE_HELPER: 'config.luggage.helper',
  CONFIG_SEASON_LABEL: 'config.season.label',
  CONFIG_BUTTON_GENERATE: 'config.button.generate',
  CONFIG_ERROR_INVALID_DAYS: 'config.error.invalidDays',
  SEASON_SPRING: 'config.season.spring',
  SEASON_SUMMER: 'config.season.summer',
  SEASON_FALL: 'config.season.fall',
  SEASON_WINTER: 'config.season.winter',
  LIST_TITLE: 'list.screen.title',
  LIST_BACK: 'list.button.back',
  LIST_DURATION: 'list.summary.duration',
  LIST_SEASON: 'list.summary.season',
  LIST_DESTINATION: 'list.summary.destination',
  LIST_TOTAL_ITEMS: 'list.summary.totalItems',
  LIST_HOME: 'list.destination.home',
  LIST_GENERAL: 'list.destination.general',
  LIST_AI_BADGE: 'list.ai.badge',
  LIST_AI_TIP: 'list.ai.tip',
  LIST_EXPORT: 'list.button.export',
  LIST_DAYS_SUFFIX: 'list.days.suffix',
  REMINDERS_PERMISSION_TITLE: 'reminders.permission.title',
  REMINDERS_PERMISSION_MESSAGE: 'reminders.permission.message',
  REMINDERS_SUCCESS_TITLE: 'reminders.success.title',
  REMINDERS_SUCCESS_MESSAGE: 'reminders.success.message',
  REMINDERS_ERROR_TITLE: 'reminders.error.title',
  REMINDERS_ERROR_MESSAGE: 'reminders.error.message',
  REMINDERS_LIST_NAME: 'reminders.listName',
  REMINDERS_LIST_COLOR: 'reminders.listColor',
  REMINDERS_TRIP_TITLE_HOME: 'reminders.tripTitle.home',
  REMINDERS_TRIP_TITLE_GENERAL: 'reminders.tripTitle.general',
  REMINDERS_TRIP_NOTES_GENERATED: 'reminders.tripNotes.generated',
  REMINDERS_TRIP_NOTES_SEASON: 'reminders.tripNotes.season',
  REMINDERS_TRIP_NOTES_AI_ENHANCED: 'reminders.tripNotes.aiEnhanced',
  REMINDERS_TRIP_NOTES_YES: 'reminders.tripNotes.yes',
  REMINDERS_TRIP_NOTES_NO: 'reminders.tripNotes.no',
  REMINDERS_ITEM_TITLE_WITH_QUANTITY: 'reminders.itemTitle.withQuantity',
  REMINDERS_ITEM_TITLE_SINGLE: 'reminders.itemTitle.single',
  REMINDERS_ITEM_NOTES_CATEGORY: 'reminders.itemNotes.category',
  REMINDERS_ITEM_NOTES_AI_TIP: 'reminders.itemNotes.aiTip',
  AI_ERROR_TITLE: 'ai.error.title',
  AI_ERROR_MESSAGE: 'ai.error.message',
  AI_ERROR_API_KEY: 'ai.error.apiKey',
  AI_SUMMARY_TITLE: 'ai.summary.title',
  AI_SUGGESTED_ITEMS_TITLE: 'ai.suggestedItems.title',
  AI_SUGGESTED_ITEMS_SUBTITLE: 'ai.suggestedItems.subtitle',
  AI_SUGGESTION_ACCEPT: 'ai.suggestion.accept',
  AI_SUGGESTION_DECLINE: 'ai.suggestion.decline',
  GENERAL_OK: 'general.ok',
  GENERAL_CANCEL: 'general.cancel',
  GENERAL_ERROR: 'general.error',
  GENERAL_SUCCESS: 'general.success',
  GENERAL_LOADING: 'general.loading',
  SETTINGS_TITLE: 'settings.title',
  SETTINGS_AI_SECTION_TITLE: 'settings.ai.section.title',
  SETTINGS_AI_SECTION_DESCRIPTION: 'settings.ai.section.description',
  SETTINGS_API_KEY_LABEL: 'settings.apiKey.label',
  SETTINGS_API_KEY_PLACEHOLDER: 'settings.apiKey.placeholder',
  SETTINGS_API_KEY_SHOW: 'settings.apiKey.show',
  SETTINGS_API_KEY_CONFIGURED: 'settings.apiKey.configured',
  SETTINGS_API_KEY_EMPTY: 'settings.apiKey.empty',
  SETTINGS_API_KEY_INVALID: 'settings.apiKey.invalid',
  SETTINGS_API_KEY_SAVED: 'settings.apiKey.saved',
  SETTINGS_API_KEY_SAVE_ERROR: 'settings.apiKey.saveError',
  SETTINGS_API_KEY_SAVE: 'settings.apiKey.save',
  SETTINGS_API_KEY_DELETE: 'settings.apiKey.delete',
  SETTINGS_API_KEY_DELETED: 'settings.apiKey.deleted',
  SETTINGS_API_KEY_DELETE_TITLE: 'settings.apiKey.delete.title',
  SETTINGS_API_KEY_DELETE_MESSAGE: 'settings.apiKey.delete.message',
  SETTINGS_API_KEY_DELETE_CONFIRM: 'settings.apiKey.delete.confirm',
  SETTINGS_API_KEY_INFO_TITLE: 'settings.apiKey.info.title',
  SETTINGS_API_KEY_INFO_TEXT: 'settings.apiKey.info.text',
  SETTINGS_API_KEY_INFO_GET: 'settings.apiKey.info.get',
  SETTINGS_SECURITY_TITLE: 'settings.security.title',
  SETTINGS_SECURITY_INFO: 'settings.security.info',
  SETTINGS_LANGUAGE_TITLE: 'settings.language.section.title',
  SETTINGS_LANGUAGE_DESCRIPTION: 'settings.language.label',
  SETTINGS_LANGUAGE_SECTION_TITLE: 'settings.language.section.title',
  SETTINGS_LANGUAGE_LABEL: 'settings.language.label',
  SETTINGS_LANGUAGE_CA: 'settings.language.ca',
  SETTINGS_LANGUAGE_EN: 'settings.language.en',
  SETTINGS_LANGUAGE_ES: 'settings.language.es',
  SETTINGS_LANGUAGE_CHANGED: 'settings.language.changed',
  // Custom Items
  SETTINGS_ITEMS_TITLE: 'settings.items.title',
  SETTINGS_ITEMS_DESCRIPTION: 'settings.items.description',
  SETTINGS_ITEMS_EXPORT_JSON: 'settings.items.exportJson',
  SETTINGS_ITEMS_EXPORT_CSV: 'settings.items.exportCsv',
  SETTINGS_ITEMS_RESTORE: 'settings.items.restore',
  SETTINGS_ITEMS_ADD: 'settings.items.add',
  SETTINGS_ITEMS_RESTORE_TITLE: 'settings.items.restore.title',
  SETTINGS_ITEMS_RESTORE_MESSAGE: 'settings.items.restore.message',
  SETTINGS_ITEMS_RESTORE_SUCCESS: 'settings.items.restore.success',
  SETTINGS_ITEMS_RESTORE_ERROR: 'settings.items.restore.error',
  SETTINGS_ITEMS_DELETE_TITLE: 'settings.items.delete.title',
  SETTINGS_ITEMS_DELETE_MESSAGE: 'settings.items.delete.message',
  SETTINGS_ITEMS_DELETE_SUCCESS: 'settings.items.delete.success',
  SETTINGS_ITEMS_DELETE_ERROR: 'settings.items.delete.error',
  SETTINGS_ITEMS_SAVE_SUCCESS_ADD: 'settings.items.save.success.add',
  SETTINGS_ITEMS_SAVE_SUCCESS_EDIT: 'settings.items.save.success.edit',
  SETTINGS_ITEMS_LOAD_ERROR: 'settings.items.load.error',
  SETTINGS_ITEMS_EXPORT_ERROR: 'settings.items.export.error',
  // Item Editor
  ITEM_EDITOR_TITLE_ADD: 'itemEditor.title.add',
  ITEM_EDITOR_TITLE_EDIT: 'itemEditor.title.edit',
  ITEM_EDITOR_CANCEL: 'itemEditor.cancel',
  ITEM_EDITOR_SAVE: 'itemEditor.save',
  ITEM_EDITOR_SAVING: 'itemEditor.saving',
  ITEM_EDITOR_ID_LABEL: 'itemEditor.id.label',
  ITEM_EDITOR_ID_PLACEHOLDER: 'itemEditor.id.placeholder',
  ITEM_EDITOR_ID_HELPER: 'itemEditor.id.helper',
  ITEM_EDITOR_NAME_LABEL: 'itemEditor.name.label',
  ITEM_EDITOR_NAME_PLACEHOLDER: 'itemEditor.name.placeholder',
  ITEM_EDITOR_CATEGORY_LABEL: 'itemEditor.category.label',
  ITEM_EDITOR_CATEGORY_SELECT: 'itemEditor.category.select',
  ITEM_EDITOR_QUANTITY_TYPE_LABEL: 'itemEditor.quantityType.label',
  ITEM_EDITOR_QUANTITY_TYPE_FIXED: 'itemEditor.quantityType.fixed',
  ITEM_EDITOR_QUANTITY_TYPE_PERDAY: 'itemEditor.quantityType.perDay',
  ITEM_EDITOR_QUANTITY_LABEL: 'itemEditor.quantity.label',
  ITEM_EDITOR_QUANTITY_PLACEHOLDER: 'itemEditor.quantity.placeholder',
  ITEM_EDITOR_DAILY_FACTOR_LABEL: 'itemEditor.dailyFactor.label',
  ITEM_EDITOR_DAILY_FACTOR_PLACEHOLDER: 'itemEditor.dailyFactor.placeholder',
  ITEM_EDITOR_DAILY_FACTOR_HELPER: 'itemEditor.dailyFactor.helper',
  ITEM_EDITOR_MIN_DAYS_LABEL: 'itemEditor.minDays.label',
  ITEM_EDITOR_MIN_DAYS_PLACEHOLDER: 'itemEditor.minDays.placeholder',
  ITEM_EDITOR_MIN_DAYS_HELPER: 'itemEditor.minDays.helper',
  ITEM_EDITOR_BIG_LUGGAGE_LABEL: 'itemEditor.bigLuggage.label',
  ITEM_EDITOR_BIG_LUGGAGE_HELPER: 'itemEditor.bigLuggage.helper',
  ITEM_EDITOR_SEASONS_LABEL: 'itemEditor.seasons.label',
  ITEM_EDITOR_SEASONS_HELPER: 'itemEditor.seasons.helper',
  ITEM_EDITOR_INCLUDE_FOR_LABEL: 'itemEditor.includeFor.label',
  ITEM_EDITOR_INCLUDE_FOR_GENERAL: 'itemEditor.includeFor.general',
  ITEM_EDITOR_INCLUDE_FOR_HOME: 'itemEditor.includeFor.home',
  ITEM_EDITOR_VALIDATION_NAME_REQUIRED: 'itemEditor.validation.nameRequired',
  ITEM_EDITOR_VALIDATION_ID_REQUIRED: 'itemEditor.validation.idRequired',
  ITEM_EDITOR_VALIDATION_QUANTITY_INVALID: 'itemEditor.validation.quantityInvalid',
  ITEM_EDITOR_VALIDATION_DAILY_FACTOR_INVALID: 'itemEditor.validation.dailyFactorInvalid',
  ITEM_EDITOR_VALIDATION_MIN_DAYS_INVALID: 'itemEditor.validation.minDaysInvalid',
  ITEM_EDITOR_VALIDATION_DESTINATION_REQUIRED: 'itemEditor.validation.destinationRequired',
  ITEM_EDITOR_VALIDATION_ERROR_TITLE: 'itemEditor.validation.errorTitle',
  ITEM_EDITOR_ERROR_TITLE: 'itemEditor.error.title',
  CHAT_TITLE: 'chat.title',
  CHAT_SUBTITLE: 'chat.subtitle',
  CHAT_WELCOME_MESSAGE: 'chat.welcome',
  CHAT_INPUT_PLACEHOLDER: 'chat.input.placeholder',
  CHAT_LOADING: 'chat.loading',
  CHAT_ERROR_TITLE: 'chat.error.title',
  CHAT_ERROR_MESSAGE: 'chat.error.message',
  CHAT_BUTTON: 'chat.button',
};
