import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { PackingList, ItemCategory, SuggestedItem, PackingListItem, AIChatResponse } from '../types';
import { PackingListService } from '../services/PackingListService';
import { RemindersService } from '../services/RemindersService';
import { getItemsConfig } from '../utils/configUtils';
import { getText, TextIds } from '../services/TextService';
import ChatAssistant from './ChatAssistant';

interface PackingListScreenProps {
  packingList: PackingList;
  onBack: () => void;
}

export default function PackingListScreen({ packingList: initialPackingList, onBack }: PackingListScreenProps) {
  const [packingList, setPackingList] = useState(initialPackingList);
  const [exporting, setExporting] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());
  const [declinedSuggestions, setDeclinedSuggestions] = useState<Set<string>>(new Set());
  
  const groupedItems = PackingListService.groupItemsByCategory(packingList);
  const config = getItemsConfig();

  const handleExportToReminders = async () => {
    try {
      setExporting(true);

      // Check permission first
      const hasPermission = await RemindersService.hasPermission();
      
      if (!hasPermission) {
        Alert.alert(
          getText(TextIds.REMINDERS_PERMISSION_TITLE),
          getText(TextIds.REMINDERS_PERMISSION_MESSAGE),
          [
            { text: getText(TextIds.GENERAL_OK), style: 'cancel' },
            {
              text: getText(TextIds.REMINDERS_PERMISSION_MESSAGE).includes('Grant') ? 'Grant Permission' : getText(TextIds.REMINDERS_PERMISSION_MESSAGE),
              onPress: async () => {
                const granted = await RemindersService.requestPermissions();
                if (granted) {
                  await exportList();
                } else {
                  Alert.alert(
                    getText(TextIds.REMINDERS_PERMISSION_TITLE),
                    getText(TextIds.REMINDERS_PERMISSION_MESSAGE)
                  );
                }
              },
            },
          ]
        );
      } else {
        await exportList();
      }
    } catch (error) {
      Alert.alert(getText(TextIds.REMINDERS_ERROR_TITLE), getText(TextIds.REMINDERS_ERROR_MESSAGE));
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const exportList = async () => {
    const success = await RemindersService.exportToReminders(packingList);
    if (success) {
      Alert.alert(
        getText(TextIds.REMINDERS_SUCCESS_TITLE),
        getText(TextIds.REMINDERS_SUCCESS_MESSAGE, { count: packingList.items.length }),
        [{ text: getText(TextIds.GENERAL_OK) }]
      );
    } else {
      Alert.alert(getText(TextIds.REMINDERS_ERROR_TITLE), getText(TextIds.REMINDERS_ERROR_MESSAGE));
    }
  };

  const getCategoryDisplayName = (category: ItemCategory): string => {
    const categoryTextId = `category.${category}`;
    return getText(categoryTextId);
  };

  const handleAcceptSuggestion = (suggestion: SuggestedItem) => {
    // Add to accepted set
    setAcceptedSuggestions(prev => new Set(prev).add(suggestion.name));
    
    // Create new item from suggestion
    const newItem: PackingListItem = {
      id: `suggested_${Date.now()}_${suggestion.name}`,
      name: suggestion.name,
      category: suggestion.category,
      quantity: suggestion.quantity,
    };

    // Add to packing list
    setPackingList(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleDeclineSuggestion = (suggestion: SuggestedItem) => {
    setDeclinedSuggestions(prev => new Set(prev).add(suggestion.name));
  };

  const handleChatSuggestions = (response: AIChatResponse) => {
    // Handle suggested items from chat
    if (response.suggested_items && response.suggested_items.length > 0) {
      const newItems: PackingListItem[] = response.suggested_items.map(suggestion => ({
        id: `chat_suggested_${Date.now()}_${suggestion.name}`,
        name: suggestion.name,
        category: suggestion.category,
        quantity: suggestion.quantity,
      }));

      setPackingList(prev => ({
        ...prev,
        items: [...prev.items, ...newItems],
      }));
    }

    // Handle quantity changes from chat
    if (response.quantity_changes && response.quantity_changes.length > 0) {
      setPackingList(prev => {
        const updatedItems = prev.items.map(item => {
          const change = response.quantity_changes?.find(c => c.itemId === item.id);
          return change ? { ...item, quantity: change.newQuantity } : item;
        });
        return { ...prev, items: updatedItems };
      });
    }
  };

  const getVisibleSuggestions = () => {
    if (!packingList.suggestedItems) return [];
    return packingList.suggestedItems.filter(
      item => !acceptedSuggestions.has(item.name) && !declinedSuggestions.has(item.name)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{getText(TextIds.LIST_BACK)}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getText(TextIds.LIST_TITLE)}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{getText(TextIds.LIST_DURATION)}</Text>
          <Text style={styles.summaryValue}>
            {packingList.travelConfig.numberOfDays} {getText(TextIds.LIST_DAYS_SUFFIX)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{getText(TextIds.LIST_SEASON)}</Text>
          <Text style={styles.summaryValue}>
            {getText(`config.season.${packingList.travelConfig.currentSeason}`)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{getText(TextIds.LIST_DESTINATION)}</Text>
          <Text style={styles.summaryValue}>
            {packingList.travelConfig.isHome ? getText(TextIds.LIST_HOME) : getText(TextIds.LIST_GENERAL)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{getText(TextIds.LIST_TOTAL_ITEMS)}</Text>
          <Text style={styles.summaryValue}>
            {PackingListService.getTotalItemCount(packingList)}
          </Text>
        </View>
        {packingList.aiEnhanced && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>{getText(TextIds.LIST_AI_BADGE)}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.listContainer}>
        {/* AI Summary Section - Displayed at top */}
        {packingList.aiSummary && (
          <View style={styles.aiSummaryCard}>
            <View style={styles.aiSummaryHeader}>
              <Text style={styles.aiSummaryTitle}>💡 {getText(TextIds.AI_SUMMARY_TITLE)}</Text>
            </View>
            <Markdown style={markdownStyles}>
              {packingList.aiSummary}
            </Markdown>
          </View>
        )}

        {/* Suggested Items Section */}
        {getVisibleSuggestions().length > 0 && (
          <View style={styles.suggestedItemsCard}>
            <Text style={styles.suggestedItemsTitle}>
              ✨ {getText(TextIds.AI_SUGGESTED_ITEMS_TITLE)}
            </Text>
            <Text style={styles.suggestedItemsSubtitle}>
              {getText(TextIds.AI_SUGGESTED_ITEMS_SUBTITLE)}
            </Text>
            {getVisibleSuggestions().map((suggestion, index) => (
              <View key={index} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                    <Text style={styles.suggestionCategory}>
                      {getCategoryDisplayName(suggestion.category)} • {suggestion.quantity}x
                    </Text>
                  </View>
                </View>
                <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
                <View style={styles.suggestionActions}>
                  <TouchableOpacity
                    style={[styles.suggestionButton, styles.declineButton]}
                    onPress={() => handleDeclineSuggestion(suggestion)}
                  >
                    <Text style={styles.declineButtonText}>
                      {getText(TextIds.AI_SUGGESTION_DECLINE)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.suggestionButton, styles.acceptButton]}
                    onPress={() => handleAcceptSuggestion(suggestion)}
                  >
                    <Text style={styles.acceptButtonText}>
                      {getText(TextIds.AI_SUGGESTION_ACCEPT)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Category Items Section */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {getCategoryDisplayName(category as ItemCategory)}
            </Text>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity}x</Text>
                  </View>
                </View>
                {item.aiSuggestion && (
                  <View style={styles.aiSuggestionContainer}>
                    <Text style={styles.aiSuggestionLabel}>{getText(TextIds.LIST_AI_TIP)}</Text>
                    <Text style={styles.aiSuggestionText}>{item.aiSuggestion}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.chatButton]}
          onPress={() => setChatVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.chatButtonText}>{getText(TextIds.CHAT_BUTTON)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
          onPress={handleExportToReminders}
          disabled={exporting}
          activeOpacity={0.8}
        >
          {exporting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.exportButtonText}>{getText(TextIds.LIST_EXPORT)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ChatAssistant
        visible={chatVisible}
        packingList={packingList}
        onClose={() => setChatVisible(false)}
        onSuggestionsReceived={handleChatSuggestions}
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  aiBadge: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  aiBadgeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  aiSuggestionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
  },
  aiSuggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 4,
  },
  aiSuggestionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  exportButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  exportButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  // AI Summary Styles
  aiSummaryCard: {
    backgroundColor: '#F0F8FF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiSummaryHeader: {
    marginBottom: 12,
  },
  aiSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
  },
  // Suggested Items Styles
  suggestedItemsCard: {
    backgroundColor: '#FFF9E6',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F57C00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestedItemsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 4,
  },
  suggestedItemsSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  suggestionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionHeader: {
    marginBottom: 8,
  },
  suggestionInfo: {
    flexDirection: 'column',
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionCategory: {
    fontSize: 13,
    color: '#666',
  },
  suggestionReason: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  suggestionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

// Markdown styles for AI summary
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  strong: {
    fontWeight: '700' as const,
    color: '#1976D2',
  },
  bullet_list: {
    marginTop: 8,
  },
  list_item: {
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
  },
});
