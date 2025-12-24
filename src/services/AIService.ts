import OpenAI from 'openai';
import Constants from 'expo-constants';
import { PackingList, TravelConfig, Season, AIResponse, ItemCategory, ChatMessage, AIChatResponse } from '../types';
import { SecureStorageService } from './SecureStorageService';
import { LanguageService } from './LanguageService';

export class AIService {
  private static client: OpenAI | null = null;
  private static cachedApiKey: string | null = null;

  /**
   * Get API key from secure storage or environment variables (development only)
   */
  private static async getApiKey(): Promise<string> {
    // Check memory cache first
    if (this.cachedApiKey) {
      return this.cachedApiKey;
    }

    // Try to get from secure storage (user-configured in Settings)
    const storedKey = await SecureStorageService.getApiKey();
    if (storedKey) {
      this.cachedApiKey = storedKey;
      return storedKey;
    }

    // Fallback to environment variables (development only)
    const envKey = Constants.expoConfig?.extra?.openRouterApiKey;
    if (envKey) {
      this.cachedApiKey = envKey;
      return envKey;
    }

    throw new Error('OpenRouter API key not configured. Please configure it in the Settings screen.');
  }

  /**
   * Initialize the OpenAI client with OpenRouter configuration
   */
  private static async getClient(): Promise<OpenAI> {
    if (!this.client) {
      const apiKey = await this.getApiKey();
      const baseURL = Constants.expoConfig?.extra?.openRouterBaseUrl || 
                      process.env.OPENROUTER_BASE_URL || 
                      'https://openrouter.ai/api/v1';

      this.client = new OpenAI({
        apiKey,
        baseURL,
        dangerouslyAllowBrowser: true, // Required for Expo
        defaultHeaders: {
          'HTTP-Referer': 'https://github.com/aleix/travel-packing-list',
          'X-Title': 'Travel Packing List App',
        },
      });
    }
    return this.client;
  }

  /**
   * Clear the cached API key and client (useful when API key changes)
   */
  static clearCache() {
    this.client = null;
    this.cachedApiKey = null;
  }

  /**
   * Enhance packing list with AI suggestions based on season and trip details
   */
  static async enhancePackingList(
    packingList: PackingList
  ): Promise<PackingList> {
    try {
      const client = await this.getClient();
      const { travelConfig, items } = packingList;

      // Get current language for AI responses
      const currentLanguage = LanguageService.getCurrentLanguage();
      const languageForAI = LanguageService.getLanguageForAI(currentLanguage);

      const prompt = this.buildEnhancementPrompt(travelConfig, items.map(i => i.name), languageForAI);

      const completion = await client.chat.completions.create({
        model: 'openai/gpt-4.1-nano', // or 'openai/gpt-4-turbo'
        messages: [
          {
            role: 'system',
            content: `You are a helpful travel assistant specializing in packing lists. Respond ONLY with valid JSON. Be conservative with suggestions - only suggest items that are truly essential. Always respond in ${languageForAI} language.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }, // Request JSON response
      });

      const aiResponse = completion.choices[0]?.message?.content || '';
      const enhancedPackingList = this.parseAISuggestions(packingList, aiResponse);

      return {
        ...enhancedPackingList,
        aiEnhanced: true,
      };
    } catch (error) {
      console.error('Error enhancing packing list with AI:', error);
      // Return original list if AI enhancement fails
      return packingList;
    }
  }

  /**
   * Build the prompt for AI enhancement
   */
  private static buildEnhancementPrompt(config: TravelConfig, itemNames: string[], responseLanguage: string): string {
    const seasonDescriptions: Record<Season, string> = {
      [Season.Spring]: 'spring (mild temperatures, possible rain)',
      [Season.Summer]: 'summer (hot and sunny)',
      [Season.Fall]: 'fall (cooling temperatures, variable weather)',
      [Season.Winter]: 'winter (cold temperatures)',
    };

    const destination = config.isHome 
      ? 'home (visiting family)' 
      : 'general destination';

    return `I'm traveling for ${config.numberOfDays} days during ${seasonDescriptions[config.currentSeason]} to ${destination}.

My current packing list includes:
${itemNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Please respond with a JSON object in this EXACT format (no additional text outside the JSON):
{
  "summary_text": "Your general packing advice in markdown format. Include specific tips for the season, weather considerations, and any important reminders. Keep it concise (3-5 bullet points maximum).",
  "suggested_items": [
    {
      "name": "Item name",
      "category": "one of: basics, clothes, toiletries, electronics, documents, accessories, health, misc",
      "quantity": 1,
      "reason": "Brief explanation why this is important"
    }
  ]
}

IMPORTANT GUIDELINES:
1. Only suggest items in "suggested_items" if they are STRICTLY NECESSARY for safety, legal requirements, or critical comfort
2. Do NOT suggest items that are already in the list
3. Keep suggested items to a minimum (0-3 items maximum)
4. Common sense items like "phone" or "wallet" should NOT be suggested
5. Focus suggestions on season-specific needs or trip duration considerations
6. The summary_text should use markdown formatting (**, -, etc.) for better readability
7. Ensure the JSON is valid and parseable
8. IMPORTANT: Respond in ${responseLanguage} language. Both summary_text and all item names and reasons should be in ${responseLanguage}.`;
  }

  /**
   * Parse AI suggestions and add them to the packing list
   */
  private static parseAISuggestions(
    packingList: PackingList,
    aiResponse: string
  ): PackingList {
    try {
      // Try to parse JSON response
      const parsed: AIResponse = JSON.parse(aiResponse);
      
      // Validate the response structure
      if (!parsed.summary_text || !Array.isArray(parsed.suggested_items)) {
        console.warn('Invalid AI response structure, using fallback');
        return {
          ...packingList,
          aiSummary: aiResponse, // Fallback to plain text
          suggestedItems: [],
        };
      }

      // Validate suggested items
      const validSuggestedItems = parsed.suggested_items
        .filter(item => {
          // Check if item has required fields
          if (!item.name || !item.category || !item.quantity || !item.reason) {
            return false;
          }
          // Check if category is valid
          if (!Object.values(ItemCategory).includes(item.category)) {
            return false;
          }
          // Check if item already exists in the list
          const isDuplicate = packingList.items.some(
            existingItem => existingItem.name.toLowerCase() === item.name.toLowerCase()
          );
          return !isDuplicate;
        })
        .slice(0, 5); // Maximum 5 suggestions even if LLM returns more

      return {
        ...packingList,
        aiSummary: parsed.summary_text,
        suggestedItems: validSuggestedItems,
      };
    } catch (error) {
      console.error('Error parsing AI response as JSON:', error);
      // Fallback to old behavior - use response as plain text
      return {
        ...packingList,
        aiSummary: aiResponse,
        suggestedItems: [],
      };
    }
  }

  /**
   * Get a quick AI recommendation for a specific item
   */
  static async getItemRecommendation(
    itemName: string,
    config: TravelConfig
  ): Promise<string> {
    try {
      const client = await this.getClient();
      
      // Get current language for AI responses
      const currentLanguage = LanguageService.getCurrentLanguage();
      const languageForAI = LanguageService.getLanguageForAI(currentLanguage);

      const completion = await client.chat.completions.create({
        model: 'openai/gpt-4.1-nano',
        messages: [
          {
            role: 'user',
            content: `For a ${config.numberOfDays}-day trip during ${config.currentSeason} to ${
              config.isHome ? 'Home' : 'a destination'
            }, what's a quick tip about packing "${itemName}"? Keep it to 1-2 sentences. Respond in ${languageForAI} language.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || 'No recommendation available.';
    } catch (error) {
      console.error('Error getting item recommendation:', error);
      return 'Unable to get recommendation at this time.';
    }
  }

  /**
   * Get AI chat response for packing list assistance
   */
  static async getChatResponse(
    userMessage: string,
    packingList: PackingList,
    chatHistory: ChatMessage[]
  ): Promise<AIChatResponse> {
    try {
      const client = await this.getClient();
      const { travelConfig, items } = packingList;

      // Get current language for AI responses
      const currentLanguage = LanguageService.getCurrentLanguage();
      const languageForAI = LanguageService.getLanguageForAI(currentLanguage);

      // Build context about the current packing list
      const listContext = `Current packing list for a ${travelConfig.numberOfDays}-day ${travelConfig.currentSeason} trip to ${travelConfig.isHome ? 'home' : 'a destination'} (${travelConfig.hasBigLuggage ? 'big luggage' : 'backpack only'}):
${items.map((item, i) => `${i + 1}. ${item.name} (x${item.quantity})`).join('\n')}`;

      // Build chat messages array
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are a specialized travel packing assistant. Your ONLY purpose is to help users optimize their packing list by:
1. Suggesting additional items they might need
2. Recommending quantity adjustments
3. Answering questions about specific items in their list

IMPORTANT RULES:
- ONLY respond to questions about packing, travel items, and quantities
- If asked about anything else (weather, destinations, activities, etc.), politely redirect to packing topics
- Keep responses concise and practical
- Always provide specific, actionable advice
- When suggesting items or quantity changes, respond with a JSON object
- Always respond in ${languageForAI} language

${listContext}`,
        },
      ];

      // Add chat history (last 6 messages for context)
      const recentHistory = chatHistory.slice(-6);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage,
      });

      const completion = await client.chat.completions.create({
        model: 'openai/gpt-4.1-nano',
        messages,
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });

      const aiResponse = completion.choices[0]?.message?.content || '{"message": "Sorry, I could not process your request."}';
      
      try {
        const parsed: AIChatResponse = JSON.parse(aiResponse);
        return parsed;
      } catch {
        // Fallback if JSON parsing fails
        return {
          message: aiResponse,
        };
      }
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw error;
    }
  }
}
