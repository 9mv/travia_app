import * as Calendar from 'expo-calendar';
import { PackingList } from '../types';
import { Platform } from 'react-native';
import { getText, TextIds } from './TextService';

export class RemindersService {
  private static calendarId: string | null = null;

  /**
   * Request permissions for calendar/reminders access
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.warn('Reminders integration is only available on iOS');
      return false;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status === 'granted') {
      const remindersStatus = await Calendar.requestRemindersPermissionsAsync();
      return remindersStatus.status === 'granted';
    }
    
    return false;
  }

  /**
   * Get or create the app's reminder list
   */
  private static async getOrCreateRemindersList(): Promise<string | null> {
    if (this.calendarId) {
      return this.calendarId;
    }

    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.REMINDER);
      
      // Look for existing reminder list
      const listName = getText(TextIds.REMINDERS_LIST_NAME);
      let travelCalendar = calendars.find(
        cal => cal.title === listName
      );

      if (!travelCalendar) {
        // Create new reminder list
        const defaultCalendar = calendars.find(cal => cal.allowsModifications);
        
        if (defaultCalendar?.source) {
          const newCalendarId = await Calendar.createCalendarAsync({
            title: listName,
            color: getText(TextIds.REMINDERS_LIST_COLOR),
            entityType: Calendar.EntityTypes.REMINDER,
            sourceId: defaultCalendar.source.id,
            source: defaultCalendar.source,
            name: listName,
            ownerAccount: defaultCalendar.source.name,
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          
          this.calendarId = newCalendarId;
          return newCalendarId;
        }
      } else {
        this.calendarId = travelCalendar.id;
        return travelCalendar.id;
      }
    } catch (error) {
      console.error('Error getting/creating reminders list:', error);
    }

    return null;
  }

  /**
   * Export packing list to iOS Reminders
   */
  static async exportToReminders(packingList: PackingList): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permissions not granted for reminders');
      }

      const calendarId = await this.getOrCreateRemindersList();
      if (!calendarId) {
        throw new Error('Could not create or access reminder list');
      }

      // Create a main reminder for the trip
      const tripTitleKey = packingList.travelConfig.isHome 
        ? TextIds.REMINDERS_TRIP_TITLE_HOME 
        : TextIds.REMINDERS_TRIP_TITLE_GENERAL;
      const tripTitle = getText(tripTitleKey, { days: packingList.travelConfig.numberOfDays });
      
      const seasonText = getText(`config.season.${packingList.travelConfig.currentSeason}`);
      const aiEnhancedText = packingList.aiEnhanced 
        ? getText(TextIds.REMINDERS_TRIP_NOTES_YES)
        : getText(TextIds.REMINDERS_TRIP_NOTES_NO);
      
      const tripNotes = `${getText(TextIds.REMINDERS_TRIP_NOTES_GENERATED)} ${packingList.generatedAt.toLocaleDateString()}\n${getText(TextIds.REMINDERS_TRIP_NOTES_SEASON)} ${seasonText}\n${getText(TextIds.REMINDERS_TRIP_NOTES_AI_ENHANCED)} ${aiEnhancedText}`;
      
      const tripReminderId = await Calendar.createReminderAsync(calendarId, {
        title: tripTitle,
        notes: tripNotes,
        completed: false,
      });

      // Create individual reminders for each item
      for (const item of packingList.items) {
        const itemTitle = item.quantity > 1 
          ? getText(TextIds.REMINDERS_ITEM_TITLE_WITH_QUANTITY, { 
              name: item.name, 
              quantity: item.quantity 
            })
          : getText(TextIds.REMINDERS_ITEM_TITLE_SINGLE, { name: item.name });
        
        const categoryText = getText(`category.${item.category}`);
        let notes = `${getText(TextIds.REMINDERS_ITEM_NOTES_CATEGORY)} ${categoryText}`;
        
        if (item.aiSuggestion) {
          notes += `\n\n${getText(TextIds.REMINDERS_ITEM_NOTES_AI_TIP)} ${item.aiSuggestion}`;
        }

        await Calendar.createReminderAsync(calendarId, {
          title: itemTitle,
          notes,
          completed: false,
        });
      }

      console.log(`Successfully exported ${packingList.items.length + 1} reminders`);
      return true;
    } catch (error) {
      console.error('Error exporting to reminders:', error);
      return false;
    }
  }

  /**
   * Check if reminders permission is granted
   */
  static async hasPermission(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    const { status } = await Calendar.getCalendarPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    const remindersStatus = await Calendar.getRemindersPermissionsAsync();
    return remindersStatus.status === 'granted';
  }
}
