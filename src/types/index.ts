export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',
}

export enum Language {
  Catalan = 'ca',
  English = 'en',
  Spanish = 'es',
}

export enum ItemCategory {
  Basics = 'basics',
  Clothes = 'clothes',
  Toiletries = 'toiletries',
  Electronics = 'electronics',
  Documents = 'documents',
  Accessories = 'accessories',
  Health = 'health',
  Misc = 'misc',
  Pendent = 'pending',
}

export interface ItemConfigDefaults {
  quantityType?: 'fixed' | 'perDay';
  quantity?: number;
  dailyFactor?: number;
  seasons?: Season[];
  includeFor?: ('general' | 'home')[];
  minDays?: number;
  requiresBigLuggage?: boolean;
}

export interface ItemConfig {
  // Required fields
  id: string;
  name: string;
  category: ItemCategory;
  
  // Optional fields (can use defaults from configuration)
  quantityType?: 'fixed' | 'perDay'; // 'fixed' = use explicit quantity, 'perDay' = calculate using dailyFactor
  quantity?: number; // For quantityType='fixed'
  dailyFactor?: number; // For quantityType='perDay' (e.g., 1.25 = 1.25 items per day)
  seasons?: Season[]; // Which seasons this item applies to
  includeFor?: ('general' | 'home')[]; // Destination types where item is included
  minDays?: number; // Minimum number of days required to include this item (0 = always include)
  requiresBigLuggage?: boolean; // If true, only include when hasBigLuggage=true (defaults to false)
}

export interface ItemsConfiguration {
  defaults?: ItemConfigDefaults; // Default values for optional fields
  categories: Record<string, string>;
  items: ItemConfig[];
}

export interface TravelConfig {
  numberOfDays: number;
  isHome: boolean;
  useAI: boolean;
  currentSeason: Season;
  hasBigLuggage: boolean; // Whether user has a big luggage or just a backpack
}

export interface PackingListItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  aiSuggestion?: string;
}

export interface SuggestedItem {
  name: string;
  category: ItemCategory;
  quantity: number;
  reason: string; // Why this item is suggested
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  summary_text: string; // Markdown formatted general advice
  suggested_items: SuggestedItem[]; // New items to potentially add
}

export interface AIChatResponse {
  message: string; // Assistant's response message
  suggested_items?: SuggestedItem[]; // New items to add
  quantity_changes?: { itemId: string; newQuantity: number; reason: string }[]; // Quantity adjustments
}

export interface PackingList {
  travelConfig: TravelConfig;
  items: PackingListItem[];
  generatedAt: Date;
  aiEnhanced: boolean;
  aiSummary?: string; // Markdown formatted AI advice
  suggestedItems?: SuggestedItem[]; // Items suggested by AI but not yet accepted
  chatHistory?: ChatMessage[]; // Chat conversation with AI assistant
}

// Custom Items Management Types
export interface CustomItemConfig extends ItemConfig {
  // Custom items are fully user-editable versions of ItemConfig
  // All fields from ItemConfig are available
  isCustom?: boolean; // Flag to identify user-created items (vs. modified defaults)
}

export interface CustomItemsStorage {
  version: number; // Schema version for future migrations
  lastModified: Date;
  items: CustomItemConfig[];
}
