import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { CustomItemConfig, ItemCategory, Season } from '../types';
import { getText, TextIds } from '../services/TextService';
import { PackingListService } from '../services/PackingListService';

interface ItemEditorModalProps {
  visible: boolean;
  item: CustomItemConfig | null; // null for new item, existing item for edit
  onSave: (item: CustomItemConfig) => Promise<void>;
  onCancel: () => void;
}

export default function ItemEditorModal({ visible, item, onSave, onCancel }: ItemEditorModalProps) {
  const isEditMode = item !== null;
  
  // Helper function to get localized season name
  const getLocalizedSeasonName = (season: Season): string => {
    const seasonTextId = `config.season.${season.toLowerCase()}` as any;
    return getText(seasonTextId);
  };
  
  // Form state
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Misc);
  const [quantityType, setQuantityType] = useState<'fixed' | 'perDay'>('fixed');
  const [quantity, setQuantity] = useState('1');
  const [dailyFactor, setDailyFactor] = useState('1');
  const [minDays, setMinDays] = useState('0');
  const [requiresBigLuggage, setRequiresBigLuggage] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const [includeFor, setIncludeFor] = useState<('general' | 'home')[]>(['general']);
  const [saving, setSaving] = useState(false);
  
  // Show/hide pickers
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Initialize form when item changes
  useEffect(() => {
    if (item) {
      setId(item.id);
      setName(item.name);
      setCategory(item.category);
      setQuantityType(item.quantityType || 'fixed');
      setQuantity(String(item.quantity || 1));
      setDailyFactor(String(item.dailyFactor || 1));
      setMinDays(String(item.minDays || 0));
      setRequiresBigLuggage(item.requiresBigLuggage || false);
      setSelectedSeasons(item.seasons || []);
      setIncludeFor(item.includeFor || ['general']);
    } else {
      // Reset for new item
      resetForm();
    }
  }, [item, visible]);

  const resetForm = () => {
    setId('');
    setName('');
    setCategory(ItemCategory.Misc);
    setQuantityType('fixed');
    setQuantity('1');
    setDailyFactor('1');
    setMinDays('0');
    setRequiresBigLuggage(false);
    setSelectedSeasons([]);
    setIncludeFor(['general']);
  };

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return getText(TextIds.ITEM_EDITOR_VALIDATION_NAME_REQUIRED);
    }
    
    if (!isEditMode && !id.trim()) {
      return getText(TextIds.ITEM_EDITOR_VALIDATION_ID_REQUIRED);
    }
    
    if (quantityType === 'fixed') {
      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty < 1) {
        return getText(TextIds.ITEM_EDITOR_VALIDATION_QUANTITY_INVALID);
      }
    } else {
      const factor = parseFloat(dailyFactor);
      if (isNaN(factor) || factor <= 0) {
        return getText(TextIds.ITEM_EDITOR_VALIDATION_DAILY_FACTOR_INVALID);
      }
    }
    
    const days = parseInt(minDays, 10);
    if (isNaN(days) || days < 0) {
      return getText(TextIds.ITEM_EDITOR_VALIDATION_MIN_DAYS_INVALID);
    }
    
    if (includeFor.length === 0) {
      return getText(TextIds.ITEM_EDITOR_VALIDATION_DESTINATION_REQUIRED);
    }
    
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert(getText(TextIds.ITEM_EDITOR_VALIDATION_ERROR_TITLE), error);
      return;
    }

    const newItem: CustomItemConfig = {
      id: isEditMode ? item!.id : id.trim().toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      category,
      quantityType,
      ...(quantityType === 'fixed' 
        ? { quantity: parseInt(quantity, 10) }
        : { dailyFactor: parseFloat(dailyFactor) }
      ),
      minDays: parseInt(minDays, 10),
      requiresBigLuggage,
      seasons: selectedSeasons.length > 0 ? selectedSeasons : undefined,
      includeFor,
      isCustom: true,
    };

    try {
      setSaving(true);
      await onSave(newItem);
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert(
        getText(TextIds.ITEM_EDITOR_ERROR_TITLE),
        getText(TextIds.SETTINGS_ITEMS_DELETE_ERROR)
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleSeason = (season: Season) => {
    setSelectedSeasons(prev =>
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const toggleDestination = (dest: 'general' | 'home') => {
    setIncludeFor(prev =>
      prev.includes(dest)
        ? prev.filter(d => d !== dest)
        : [...prev, dest]
    );
  };

  const renderCategoryPicker = () => {
    const categories = Object.values(ItemCategory);
    
    return (
      <Modal
        visible={showCategoryPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View style={styles.pickerMenu}>
            <Text style={styles.pickerTitle}>
              {getText(TextIds.ITEM_EDITOR_CATEGORY_SELECT)}
            </Text>
            <ScrollView style={styles.pickerScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pickerItem,
                    category === cat && styles.pickerItemSelected
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerItemText,
                    category === cat && styles.pickerItemTextSelected
                  ]}>
                    {PackingListService.getLocalizedCategoryName(cat)}
                  </Text>
                  {category === cat && (
                    <Text style={styles.pickerCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} disabled={saving}>
            <Text style={styles.cancelButton}>
              {getText(TextIds.ITEM_EDITOR_CANCEL)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditMode 
              ? getText(TextIds.ITEM_EDITOR_TITLE_EDIT)
              : getText(TextIds.ITEM_EDITOR_TITLE_ADD)}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.disabledButton]}>
              {saving 
                ? getText(TextIds.ITEM_EDITOR_SAVING)
                : getText(TextIds.ITEM_EDITOR_SAVE)}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* ID Field (only for new items) */}
          {!isEditMode && (
            <View style={styles.field}>
              <Text style={styles.label}>
                {getText(TextIds.ITEM_EDITOR_ID_LABEL)} *
              </Text>
              <TextInput
                style={styles.input}
                value={id}
                onChangeText={setId}
                placeholder={getText(TextIds.ITEM_EDITOR_ID_PLACEHOLDER)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                {getText(TextIds.ITEM_EDITOR_ID_HELPER)}
              </Text>
            </View>
          )}

          {/* Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_NAME_LABEL)} *
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={getText(TextIds.ITEM_EDITOR_NAME_PLACEHOLDER)}
            />
          </View>

          {/* Category Field */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_CATEGORY_LABEL)} *
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={styles.pickerText}>
                {PackingListService.getLocalizedCategoryName(category)}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Quantity Type */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_QUANTITY_TYPE_LABEL)} *
            </Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentButtonLeft,
                  quantityType === 'fixed' && styles.segmentButtonActive
                ]}
                onPress={() => setQuantityType('fixed')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  quantityType === 'fixed' && styles.segmentButtonTextActive
                ]}>
                  {getText(TextIds.ITEM_EDITOR_QUANTITY_TYPE_FIXED)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentButtonRight,
                  quantityType === 'perDay' && styles.segmentButtonActive
                ]}
                onPress={() => setQuantityType('perDay')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  quantityType === 'perDay' && styles.segmentButtonTextActive
                ]}>
                  {getText(TextIds.ITEM_EDITOR_QUANTITY_TYPE_PERDAY)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity or Daily Factor */}
          {quantityType === 'fixed' ? (
            <View style={styles.field}>
              <Text style={styles.label}>
                {getText(TextIds.ITEM_EDITOR_QUANTITY_LABEL)} *
              </Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder={getText(TextIds.ITEM_EDITOR_QUANTITY_PLACEHOLDER)}
                keyboardType="number-pad"
              />
            </View>
          ) : (
            <View style={styles.field}>
              <Text style={styles.label}>
                {getText(TextIds.ITEM_EDITOR_DAILY_FACTOR_LABEL)} *
              </Text>
              <TextInput
                style={styles.input}
                value={dailyFactor}
                onChangeText={setDailyFactor}
                placeholder={getText(TextIds.ITEM_EDITOR_DAILY_FACTOR_PLACEHOLDER)}
                keyboardType="decimal-pad"
              />
              <Text style={styles.helperText}>
                {getText(TextIds.ITEM_EDITOR_DAILY_FACTOR_HELPER)}
              </Text>
            </View>
          )}

          {/* Min Days */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_MIN_DAYS_LABEL)}
            </Text>
            <TextInput
              style={styles.input}
              value={minDays}
              onChangeText={setMinDays}
              placeholder={getText(TextIds.ITEM_EDITOR_MIN_DAYS_PLACEHOLDER)}
              keyboardType="number-pad"
            />
            <Text style={styles.helperText}>
              {getText(TextIds.ITEM_EDITOR_MIN_DAYS_HELPER)}
            </Text>
          </View>

          {/* Requires Big Luggage */}
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.label}>
                  {getText(TextIds.ITEM_EDITOR_BIG_LUGGAGE_LABEL)}
                </Text>
                <Text style={styles.helperText}>
                  {getText(TextIds.ITEM_EDITOR_BIG_LUGGAGE_HELPER)}
                </Text>
              </View>
              <Switch
                value={requiresBigLuggage}
                onValueChange={setRequiresBigLuggage}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={requiresBigLuggage ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Seasons */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_SEASONS_LABEL)}
            </Text>
            <Text style={styles.helperText}>
              {getText(TextIds.ITEM_EDITOR_SEASONS_HELPER)}
            </Text>
            <View style={styles.chipContainer}>
              {Object.values(Season).map(season => (
                <TouchableOpacity
                  key={season}
                  style={[
                    styles.chip,
                    selectedSeasons.includes(season) && styles.chipSelected
                  ]}
                  onPress={() => toggleSeason(season)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedSeasons.includes(season) && styles.chipTextSelected
                  ]}>
                    {getLocalizedSeasonName(season)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Destination Types */}
          <View style={styles.field}>
            <Text style={styles.label}>
              {getText(TextIds.ITEM_EDITOR_INCLUDE_FOR_LABEL)} *
            </Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  includeFor.includes('general') && styles.chipSelected
                ]}
                onPress={() => toggleDestination('general')}
              >
                <Text style={[
                  styles.chipText,
                  includeFor.includes('general') && styles.chipTextSelected
                ]}>
                  {getText(TextIds.ITEM_EDITOR_INCLUDE_FOR_GENERAL)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  includeFor.includes('home') && styles.chipSelected
                ]}
                onPress={() => toggleDestination('home')}
              >
                <Text style={[
                  styles.chipText,
                  includeFor.includes('home') && styles.chipTextSelected
                ]}>
                  {getText(TextIds.ITEM_EDITOR_INCLUDE_FOR_HOME)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {renderCategoryPicker()}
      </View>
    </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
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
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentButtonRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentButtonText: {
    fontSize: 14,
    color: '#666',
  },
  segmentButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Category Picker Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerCheckmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
