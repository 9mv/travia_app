import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Season } from '../types';
import { getCurrentSeason } from '../utils/configUtils';
import { getText, TextIds } from '../services/TextService';

interface TripConfigScreenProps {
  onGenerateList: (config: {
    numberOfDays: number;
    isHome: boolean;
    useAI: boolean;
    currentSeason: Season;
    hasBigLuggage: boolean;
  }) => void;
  onOpenSettings: () => void;
}

export default function TripConfigScreen({ onGenerateList, onOpenSettings }: TripConfigScreenProps) {
  const [numberOfDays, setNumberOfDays] = useState('3');
  const [isHome, setIsHome] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [hasBigLuggage, setHasBigLuggage] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season>(getCurrentSeason());

  useEffect(() => {
    setCurrentSeason(getCurrentSeason());
  }, []);

  const handleGenerate = () => {
    const days = parseInt(numberOfDays, 10);
    if (isNaN(days) || days < 1) {
      alert(getText(TextIds.CONFIG_ERROR_INVALID_DAYS));
      return;
    }

    onGenerateList({
      numberOfDays: days,
      isHome,
      useAI,
      currentSeason,
      hasBigLuggage,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getText(TextIds.CONFIG_TITLE)}</Text>
        <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>{getText(TextIds.CONFIG_SUBTITLE)}</Text>

        {/* Number of Days Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{getText(TextIds.CONFIG_DAYS_LABEL)}</Text>
          <TextInput
            style={styles.input}
            value={numberOfDays}
            onChangeText={setNumberOfDays}
            keyboardType="number-pad"
            placeholder={getText(TextIds.CONFIG_DAYS_PLACEHOLDER)}
          />
        </View>

        {/* Home Toggle */}
        <View style={styles.toggleGroup}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.label}>{getText(TextIds.CONFIG_HOME_LABEL)}</Text>
            <Text style={styles.helperText}>
              {getText(TextIds.CONFIG_HOME_HELPER)}
            </Text>
          </View>
          <Switch
            value={isHome}
            onValueChange={setIsHome}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isHome ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        {/* AI Enhancement Toggle */}
        <View style={styles.toggleGroup}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.label}>{getText(TextIds.CONFIG_AI_LABEL)}</Text>
            <Text style={styles.helperText}>
              {getText(TextIds.CONFIG_AI_HELPER)}
            </Text>
          </View>
          <Switch
            value={useAI}
            onValueChange={setUseAI}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={useAI ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        {/* Big Luggage Toggle */}
        <View style={styles.toggleGroup}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.label}>{getText(TextIds.CONFIG_LUGGAGE_LABEL)}</Text>
            <Text style={styles.helperText}>
              {getText(TextIds.CONFIG_LUGGAGE_HELPER)}
            </Text>
          </View>
          <Switch
            value={hasBigLuggage}
            onValueChange={setHasBigLuggage}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={hasBigLuggage ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        {/* Season Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{getText(TextIds.CONFIG_SEASON_LABEL)}</Text>
          <View style={styles.seasonContainer}>
            {([Season.Spring, Season.Summer, Season.Fall, Season.Winter] as const).map((season) => {
              const seasonTextId = `config.season.${season.toLowerCase()}` as any;
              return (
                <TouchableOpacity
                  key={season}
                  style={[
                    styles.seasonButton,
                    currentSeason === season && styles.seasonButtonActive,
                  ]}
                  onPress={() => setCurrentSeason(season)}
                >
                  <Text
                    style={[
                      styles.seasonButtonText,
                      currentSeason === season && styles.seasonButtonTextActive,
                    ]}
                  >
                    {getText(seasonTextId)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
          activeOpacity={0.8}
        >
          <Text style={styles.generateButtonText}>
            {getText(TextIds.CONFIG_BUTTON_GENERATE)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 28,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  seasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seasonButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  seasonButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  seasonButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  seasonButtonTextActive: {
    color: 'white',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
