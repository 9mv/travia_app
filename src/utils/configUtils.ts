import itemsConfig from '../../items-config.json';
import { ItemConfig, ItemsConfiguration, Season } from '../types';

/**
 * Apply default values to an item configuration
 */
function applyDefaults(item: ItemConfig, defaults: ItemConfig): ItemConfig {
  return {
    ...defaults,
    ...item,
    // Ensure arrays and objects aren't accidentally merged
    seasons: item.seasons ?? defaults.seasons,
    includeFor: item.includeFor ?? defaults.includeFor,
  };
}

export function getCurrentSeason(): Season {
  const now = new Date();
  const month = now.getMonth(); // 0-11

  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return Season.Spring; // Mar-May
  if (month >= 5 && month <= 7) return Season.Summer; // Jun-Aug
  if (month >= 8 && month <= 10) return Season.Fall; // Sep-Nov
  return Season.Winter; // Dec-Feb
}

export function getItemsConfig(): ItemsConfiguration {
  const config = itemsConfig as ItemsConfiguration;
  
  // If defaults are defined, apply them to all items
  if (config.defaults) {
    const defaults = config.defaults as ItemConfig;
    const itemsWithDefaults = config.items.map(item => applyDefaults(item, defaults));
    
    return {
      ...config,
      items: itemsWithDefaults,
    };
  }
  
  return config;
}

export function getItemById(itemId: string): ItemConfig | undefined {
  const config = getItemsConfig();
  return config.items.find((item) => item.id === itemId);
}

export function getItemsByCategory(category: string): ItemConfig[] {
  const config = getItemsConfig();
  return config.items.filter((item) => item.category === category);
}
