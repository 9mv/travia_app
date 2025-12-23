import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SecureStorageService } from '../services/SecureStorageService';
import { AIService } from '../services/AIService';
import { getText, TextIds, TextService } from '../services/TextService';
import { LanguageService } from '../services/LanguageService';
import { CustomItemsService } from '../services/CustomItemsService';
import { PackingListService } from '../services/PackingListService';
import { Language, CustomItemConfig, ItemCategory } from '../types';
import ItemEditorModal from './ItemEditorModal';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.Catalan);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Custom Items State
  const [customItems, setCustomItems] = useState<CustomItemConfig[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<ItemCategory | null>(null);
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomItemConfig | null>(null);

  useEffect(() => {
    loadApiKeyStatus();
    loadLanguage();
    loadCustomItems();
  }, []);

  const loadCustomItems = async () => {
    try {
      setItemsLoading(true);
      const items = await CustomItemsService.loadCustomItems();
      setCustomItems(items);
    } catch (error) {
      console.error('Failed to load custom items:', error);
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_ITEMS_LOAD_ERROR)
      );
    } finally {
      setItemsLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      await CustomItemsService.shareJSON();
    } catch (error) {
      console.error('Failed to export JSON:', error);
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_ITEMS_EXPORT_ERROR)
      );
    }
  };

  const handleExportCSV = async () => {
    try {
      await CustomItemsService.shareCSV();
    } catch (error) {
      console.error('Failed to export CSV:', error);
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_ITEMS_EXPORT_ERROR)
      );
    }
  };

  const handleRestoreDefaults = () => {
    Alert.alert(
      getText(TextIds.SETTINGS_ITEMS_RESTORE_TITLE),
      getText(TextIds.SETTINGS_ITEMS_RESTORE_MESSAGE),
      [
        { text: getText(TextIds.GENERAL_CANCEL), style: 'cancel' },
        {
          text: getText(TextIds.SETTINGS_ITEMS_RESTORE),
          style: 'destructive',
          onPress: async () => {
            try {
              setItemsLoading(true);
              await CustomItemsService.restoreToDefaults();
              await loadCustomItems();
              Alert.alert(
                getText(TextIds.GENERAL_SUCCESS),
                getText(TextIds.SETTINGS_ITEMS_RESTORE_SUCCESS)
              );
            } catch (error) {
              console.error('Failed to restore defaults:', error);
              Alert.alert(
                getText(TextIds.GENERAL_ERROR),
                getText(TextIds.SETTINGS_ITEMS_RESTORE_ERROR)
              );
            } finally {
              setItemsLoading(false);
            }
          },
        },
      ]
    );
  };

  const toggleCategory = (category: ItemCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getItemsByCategory = (category: ItemCategory): CustomItemConfig[] => {
    return customItems.filter(item => item.category === category);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemEditor(true);
  };

  const handleEditItem = (item: CustomItemConfig) => {
    setEditingItem(item);
    setShowItemEditor(true);
  };

  const handleDeleteItem = (item: CustomItemConfig) => {
    Alert.alert(
      getText(TextIds.SETTINGS_ITEMS_DELETE_TITLE),
      getText(TextIds.SETTINGS_ITEMS_DELETE_MESSAGE, { name: item.name }),
      [
        { text: getText(TextIds.GENERAL_CANCEL), style: 'cancel' },
        {
          text: getText(TextIds.SETTINGS_ITEMS_DELETE_TITLE),
          style: 'destructive',
          onPress: async () => {
            try {
              setItemsLoading(true);
              await CustomItemsService.deleteCustomItem(item.id);
              await loadCustomItems();
              Alert.alert(
                getText(TextIds.GENERAL_SUCCESS),
                getText(TextIds.SETTINGS_ITEMS_DELETE_SUCCESS)
              );
            } catch (error) {
              console.error('Failed to delete item:', error);
              Alert.alert(
                getText(TextIds.GENERAL_ERROR),
                getText(TextIds.SETTINGS_ITEMS_DELETE_ERROR)
              );
            } finally {
              setItemsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSaveItem = async (item: CustomItemConfig) => {
    try {
      if (editingItem) {
        // Update existing item
        await CustomItemsService.updateCustomItem(item.id, item);
      } else {
        // Add new item
        await CustomItemsService.addCustomItem(item);
      }
      await loadCustomItems();
      setShowItemEditor(false);
      setEditingItem(null);
      Alert.alert(
        getText(TextIds.GENERAL_SUCCESS),
        editingItem 
          ? getText(TextIds.SETTINGS_ITEMS_SAVE_SUCCESS_EDIT)
          : getText(TextIds.SETTINGS_ITEMS_SAVE_SUCCESS_ADD)
      );
    } catch (error: any) {
      console.error('Failed to save item:', error);
      throw new Error(error.message || getText(TextIds.SETTINGS_ITEMS_DELETE_ERROR));
    }
  };

  const handleCancelEdit = () => {
    setShowItemEditor(false);
    setEditingItem(null);
  };

  const renderCustomItemsSection = () => {
    const categories = Object.values(ItemCategory);
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{getText(TextIds.SETTINGS_ITEMS_TITLE)}</Text>
        <Text style={styles.sectionDescription}>
          {getText(TextIds.SETTINGS_ITEMS_DESCRIPTION)}
        </Text>

        {itemsLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <>
            {/* Export/Import/Restore Buttons */}
            <View style={styles.itemActionsRow}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleExportJSON}
                activeOpacity={0.7}
              >
                <Text style={styles.smallButtonText}>
                  {getText(TextIds.SETTINGS_ITEMS_EXPORT_JSON)}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleExportCSV}
                activeOpacity={0.7}
              >
                <Text style={styles.smallButtonText}>
                  {getText(TextIds.SETTINGS_ITEMS_EXPORT_CSV)}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.smallButton, styles.restoreButton]}
                onPress={handleRestoreDefaults}
                activeOpacity={0.7}
              >
                <Text style={styles.restoreButtonText}>
                  {getText(TextIds.SETTINGS_ITEMS_RESTORE)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Items by Category */}
            {categories.map(category => {
              const categoryItems = getItemsByCategory(category);
              const isExpanded = expandedCategory === category;
              
              return (
                <View key={category} style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryTitle}>
                      {PackingListService.getLocalizedCategoryName(category)} ({categoryItems.length})
                    </Text>
                    <Text style={styles.categoryArrow}>
                      {isExpanded ? '▼' : '▶'}
                    </Text>
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.categoryItems}>
                      {categoryItems.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <View style={styles.itemActions}>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => handleEditItem(item)}
                            >
                              <Text style={styles.iconButtonText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() => handleDeleteItem(item)}
                            >
                              <Text style={styles.iconButtonText}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Add New Item Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddItem}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>
                {getText(TextIds.SETTINGS_ITEMS_ADD)}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const loadLanguage = async () => {
    const lang = await LanguageService.loadLanguage();
    setCurrentLanguage(lang);
  };

  const loadApiKeyStatus = async () => {
    const hasKey = await SecureStorageService.hasApiKey();
    setHasExistingKey(hasKey);
    if (hasKey) {
      const key = await SecureStorageService.getApiKey();
      if (key) {
        setApiKey(key);
      }
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey.trim() === '') {
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_API_KEY_EMPTY)
      );
      return;
    }

    if (!SecureStorageService.validateApiKeyFormat(apiKey)) {
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_API_KEY_INVALID),
        [{ text: getText(TextIds.GENERAL_OK) }]
      );
      return;
    }

    setLoading(true);
    const success = await SecureStorageService.saveApiKey(apiKey);
    setLoading(false);

    if (success) {
      setHasExistingKey(true);
      // Clear AIService cache so it uses the new key
      AIService.clearCache();
      Alert.alert(
        getText(TextIds.GENERAL_SUCCESS),
        getText(TextIds.SETTINGS_API_KEY_SAVED),
        [{ text: getText(TextIds.GENERAL_OK) }]
      );
    } else {
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.SETTINGS_API_KEY_SAVE_ERROR),
        [{ text: getText(TextIds.GENERAL_OK) }]
      );
    }
  };

  const handleDeleteApiKey = () => {
    Alert.alert(
      getText(TextIds.SETTINGS_API_KEY_DELETE_TITLE),
      getText(TextIds.SETTINGS_API_KEY_DELETE_MESSAGE),
      [
        { text: getText(TextIds.GENERAL_CANCEL), style: 'cancel' },
        {
          text: getText(TextIds.SETTINGS_API_KEY_DELETE_CONFIRM),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const success = await SecureStorageService.deleteApiKey();
            setLoading(false);

            if (success) {
              setApiKey('');
              setHasExistingKey(false);
              // Clear AIService cache
              AIService.clearCache();
              Alert.alert(
                getText(TextIds.GENERAL_SUCCESS),
                getText(TextIds.SETTINGS_API_KEY_DELETED)
              );
            }
          },
        },
      ]
    );
  };

  const handleLanguageChange = async (language: Language) => {
    try {
      setCurrentLanguage(language);
      setShowLanguageDropdown(false); // Close dropdown
      await LanguageService.setLanguage(language);
      await TextService.setLanguage(language);
      
      Alert.alert(
        getText(TextIds.GENERAL_SUCCESS),
        getText(TextIds.SETTINGS_LANGUAGE_CHANGED),
        [
          { 
            text: getText(TextIds.GENERAL_OK),
            onPress: () => {
              // Trigger a re-render by going back and reopening settings
              // This ensures all text updates to the new language
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to change language:', error);
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        'Failed to change language'
      );
    }
  };

  const renderLanguageDropdown = () => {
    return (
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
        >
          <View style={styles.dropdownMenu}>
            {LanguageService.getAvailableLanguages().map(lang => {
              const isSelected = currentLanguage === lang;
              const languageName = LanguageService.getLanguageName(lang);
              
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    isSelected && styles.dropdownItemTextSelected
                  ]}>
                    {languageName}
                  </Text>
                  {isSelected && (
                    <Text style={styles.dropdownCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{getText(TextIds.LIST_BACK)}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getText(TextIds.SETTINGS_TITLE)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getText(TextIds.SETTINGS_LANGUAGE_TITLE)}</Text>
          <Text style={styles.sectionDescription}>
            {getText(TextIds.SETTINGS_LANGUAGE_DESCRIPTION)}
          </Text>
          
          {/* Language Dropdown Selector */}
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setShowLanguageDropdown(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageSelectorText}>
              {LanguageService.getLanguageName(currentLanguage)}
            </Text>
            <Text style={styles.languageSelectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Language Dropdown Modal */}
        {renderLanguageDropdown()}

        {/* AI Configuration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getText(TextIds.SETTINGS_AI_SECTION_TITLE)}</Text>
          <Text style={styles.sectionDescription}>
            {getText(TextIds.SETTINGS_AI_SECTION_DESCRIPTION)}
          </Text>

          {/* API Key Status */}
          {hasExistingKey && (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>
                ✅ {getText(TextIds.SETTINGS_API_KEY_CONFIGURED)}
              </Text>
            </View>
          )}

          {/* API Key Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getText(TextIds.SETTINGS_API_KEY_LABEL)}</Text>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder={getText(TextIds.SETTINGS_API_KEY_PLACEHOLDER)}
              secureTextEntry={!showApiKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {/* Show/Hide Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>
                {getText(TextIds.SETTINGS_API_KEY_SHOW)}
              </Text>
              <Switch
                value={showApiKey}
                onValueChange={setShowApiKey}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={showApiKey ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ {getText(TextIds.SETTINGS_API_KEY_INFO_TITLE)}</Text>
            <Text style={styles.infoText}>
              {getText(TextIds.SETTINGS_API_KEY_INFO_TEXT)}
            </Text>
            <Text style={styles.infoText}>
              {getText(TextIds.SETTINGS_API_KEY_INFO_GET)}
            </Text>
            <Text style={styles.infoLink}>https://openrouter.ai/</Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSaveApiKey}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {getText(TextIds.SETTINGS_API_KEY_SAVE)}
            </Text>
          </TouchableOpacity>

          {hasExistingKey && (
            <TouchableOpacity
              style={[styles.deleteButton, loading && styles.disabledButton]}
              onPress={handleDeleteApiKey}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>
                {getText(TextIds.SETTINGS_API_KEY_DELETE)}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Custom Items Management Section */}
        {renderCustomItemsSection()}

        {/* Security Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getText(TextIds.SETTINGS_SECURITY_TITLE)}</Text>
          <Text style={styles.securityText}>
            🔒 {getText(TextIds.SETTINGS_SECURITY_INFO)}
          </Text>
        </View>
      </ScrollView>

      {/* Item Editor Modal */}
      <ItemEditorModal
        visible={showItemEditor}
        item={editingItem}
        onSave={handleSaveItem}
        onCancel={handleCancelEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 17,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Courier',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    marginBottom: 4,
    lineHeight: 18,
  },
  infoLink: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '500',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  securityText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  // Language Dropdown Selector Styles
  languageSelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageSelectorText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  languageSelectorArrow: {
    fontSize: 12,
    color: '#666',
  },
  // Language Dropdown Modal Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dropdownCheckmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  // Old language option styles (kept for compatibility)
  languageContainer: {
    marginTop: 12,
  },
  languageOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  languageOptionSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  languageOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  // Custom Items Styles
  loader: {
    marginVertical: 20,
  },
  itemActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  restoreButton: {
    backgroundColor: '#FF9500',
  },
  restoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryArrow: {
    fontSize: 14,
    color: '#666',
  },
  categoryItems: {
    padding: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  iconButtonText: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
