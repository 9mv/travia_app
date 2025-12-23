import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import TripConfigScreen from './src/components/TripConfigScreen';
import PackingListScreen from './src/components/PackingListScreen';
import SettingsScreen from './src/components/SettingsScreen';
import { PackingList, TravelConfig } from './src/types';
import { PackingListService } from './src/services/PackingListService';
import { AIService } from './src/services/AIService';
import { getText, TextIds, TextService } from './src/services/TextService';
import { CustomItemsService } from './src/services/CustomItemsService';

type AppScreen = 'config' | 'list' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('config');
  const [packingList, setPackingList] = useState<PackingList | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize TextService and CustomItemsService on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize text service for localization
        await TextService.initialize();
        
        // Initialize custom items from default config if first launch
        await CustomItemsService.initializeFromDefaults();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true); // Continue anyway with default settings
      }
    };
    initializeApp();
  }, []);

  const handleGenerateList = async (config: TravelConfig) => {
    try {
      setLoading(true);

      // Generate base packing list from custom items
      let list = await PackingListService.generatePackingList(config);

      // Enhance with AI if requested
      if (config.useAI) {
        try {
          list = await AIService.enhancePackingList(list);
        } catch (error) {
          console.error('AI enhancement failed:', error);
          Alert.alert(
            getText(TextIds.AI_ERROR_TITLE),
            getText(TextIds.AI_ERROR_MESSAGE),
            [{ text: getText(TextIds.GENERAL_OK) }]
          );
        }
      }

      setPackingList(list);
      setCurrentScreen('list');
    } catch (error) {
      console.error('Error generating packing list:', error);
      Alert.alert(
        getText(TextIds.GENERAL_ERROR),
        getText(TextIds.REMINDERS_ERROR_MESSAGE),
        [{ text: getText(TextIds.GENERAL_OK) }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentScreen('config');
    setPackingList(null);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('config');
  };

  // Show loading while initializing
  if (!isInitialized || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      {currentScreen === 'config' ? (
        <TripConfigScreen onGenerateList={handleGenerateList} onOpenSettings={handleOpenSettings} />
      ) : currentScreen === 'settings' ? (
        <SettingsScreen onBack={handleBackFromSettings} />
      ) : packingList ? (
        <PackingListScreen packingList={packingList} onBack={handleBack} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
