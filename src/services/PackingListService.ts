import { TravelConfig, PackingList, PackingListItem, CustomItemConfig } from '../types';
import { getText } from './TextService';
import { CustomItemsService } from './CustomItemsService';

export class PackingListService {
  /**
   * Get localized item name
   */
  private static getLocalizedItemName(itemId: string): string {
    const textId = `item.${itemId}`;
    return getText(textId);
  }

  /**
   * Get localized category name
   */
  static getLocalizedCategoryName(category: string): string {
    const textId = `category.${category}`;
    return getText(textId);
  }

  /**
   * Generate a packing list based on travel configuration
   * Uses custom items from user settings
   */
  static async generatePackingList(config: TravelConfig): Promise<PackingList> {
    // Load custom items from storage (user's personalized config)
    const customItems = await CustomItemsService.loadCustomItems();
    const items: PackingListItem[] = [];

    // Determine destination type
    const destination = config.isHome ? 'home' : 'general';

    for (const itemConfig of customItems) {
      // Check if minimum days requirement is met
      // Note: minDays should always be defined after defaults are applied
      if (config.numberOfDays < (itemConfig.minDays ?? 0)) {
        continue;
      }

      // Check if item requires big luggage but user only has backpack
      if (itemConfig.requiresBigLuggage && !config.hasBigLuggage) {
        continue;
      }

      // Check if item applies to current season
      // Note: seasons should always be defined after defaults are applied
      const seasons = itemConfig.seasons ?? [];
      if (!seasons.includes(config.currentSeason)) {
        continue;
      }

      // Check if item is included for this destination type
      // Note: includeFor should always be defined after defaults are applied
      const includeFor = itemConfig.includeFor ?? [];
      if (!includeFor.includes(destination)) {
        continue;
      }

      // Calculate quantity based on quantityType
      let quantity: number;
      const quantityType = itemConfig.quantityType ?? 'fixed';
      
      if (quantityType === 'fixed') {
        // Fixed quantity item (e.g., 1 phone, 1 passport)
        quantity = itemConfig.quantity || 1;
      } else {
        // Per-day item - multiply dailyFactor by number of days
        const dailyFactor = itemConfig.dailyFactor || 0;
        const calculated = dailyFactor * config.numberOfDays;
        
        // If dailyFactor is between 0 and 1, ensure at least 1 item
        quantity = dailyFactor > 0 && dailyFactor < 1 
          ? Math.max(1, Math.ceil(calculated))
          : Math.ceil(calculated);
      }

      items.push({
        id: itemConfig.id,
        name: this.getLocalizedItemName(itemConfig.id), // Use localized name
        category: itemConfig.category,
        quantity,
      });
    }

    return {
      travelConfig: config,
      items,
      generatedAt: new Date(),
      aiEnhanced: false,
      aiSummary: undefined,
      suggestedItems: undefined,
    };
  }

  /**
   * Group items by category for easier display
   */
  static groupItemsByCategory(packingList: PackingList): Record<string, PackingListItem[]> {
    const grouped: Record<string, PackingListItem[]> = {};

    for (const item of packingList.items) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }

    return grouped;
  }

  /**
   * Calculate total number of items
   */
  static getTotalItemCount(packingList: PackingList): number {
    return packingList.items.reduce((total, item) => total + item.quantity, 0);
  }
}
