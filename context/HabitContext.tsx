// context/HabitContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Habit, HabitContextType } from '../types';

// Initial habits data (used only if no data is in storage)
const initialHabits: Habit[] = [
    { 
        id: 1, 
        name: "Morning Workout", 
        icon: 'Dumbbell', 
        color: "red", 
        type: 'daily', 
        completionType: 'checkmark', 
        status: 'pending', 
        streak: 5, 
        longestStreak: 20, 
        total: 120, 
        completionRate: 75, 
        notes: "Focus on cardio today.", 
        reminder: true, 
        reminderTime: "07:00",
        count: 0,
        targetCount: null,
        trend: [1, 1, 0, 1, 1, 1, 0]
    },
    { 
        id: 2, 
        name: "Read for 30 mins", 
        icon: 'BookOpen', 
        color: "blue", 
        type: 'daily', 
        completionType: 'checkmark', 
        status: 'completed', 
        streak: 12, 
        longestStreak: 30, 
        total: 350, 
        completionRate: 90, 
        notes: "Chapter 4 of 'The Alchemist'.", 
        reminder: false, 
        reminderTime: null,
        count: 0,
        targetCount: null,
        trend: [1, 1, 1, 1, 0, 1, 1]
    }
];

// Storage keys
const HABITS_STORAGE_KEY = 'habits';
const HABITS_VERSION_KEY = 'habits_version';
const CURRENT_VERSION = '1.0';

// Create the context with undefined as default (will throw error if used without provider)
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Custom hook to use the habit context
export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider. Make sure to wrap your app with <HabitProvider>');
  }
  return context;
};

// Provider props interface
interface HabitProviderProps {
  children: ReactNode;
}

// The main HabitProvider component
export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits from AsyncStorage on mount
  useEffect(() => {
    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever habits change (but not during initial load)
  useEffect(() => {
    if (!loading && habits.length >= 0) {
      saveHabits();
    }
  }, [habits, loading]);

  /**
   * Load habits from AsyncStorage
   * Falls back to initial habits if nothing is stored or if there's an error
   */
  const loadHabits = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Check if we need to migrate data (for future use)
      const storedVersion = await AsyncStorage.getItem(HABITS_VERSION_KEY);
      const savedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      
      if (savedHabits !== null) {
        const parsedHabits: Habit[] = JSON.parse(savedHabits);
        
        // Validate and sanitize the loaded habits
        const validatedHabits = parsedHabits.map(habit => ({
          ...habit,
          // Ensure all required fields have default values
          status: habit.status || 'pending',
          streak: habit.streak || 0,
          longestStreak: habit.longestStreak || 0,
          total: habit.total || 0,
          completionRate: habit.completionRate || 0,
          count: habit.count || 0,
          targetCount: habit.targetCount || null,
          trend: habit.trend || [],
        }));
        
        setHabits(validatedHabits);
        console.log(`Loaded ${validatedHabits.length} habits from storage`);
      } else {
        // No saved habits, use initial data
        setHabits(initialHabits);
        console.log('No saved habits found, using initial data');
      }

      // Update version if needed
      if (storedVersion !== CURRENT_VERSION) {
        await AsyncStorage.setItem(HABITS_VERSION_KEY, CURRENT_VERSION);
      }
      
    } catch (error) {
      console.error('Failed to load habits from AsyncStorage:', error);
      // On error, fall back to initial habits
      setHabits(initialHabits);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save habits to AsyncStorage
   */
  const saveHabits = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      console.log(`Saved ${habits.length} habits to storage`);
    } catch (error) {
      console.error('Failed to save habits to AsyncStorage:', error);
    }
  };

  /**
   * Add a new habit
   */
  const addHabit = (habitData: Omit<Habit, 'id'>): void => {
    try {
      // Generate a unique ID
      const newId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
      
      // Create the new habit with default values
      const newHabit: Habit = {
        id: newId,
        ...habitData,
        // Ensure required fields have default values
        status: habitData.status || 'pending',
        streak: habitData.streak || 0,
        longestStreak: habitData.longestStreak || 0,
        total: habitData.total || 0,
        completionRate: habitData.completionRate || 0,
        count: habitData.count || 0,
        targetCount: habitData.targetCount || null,
        trend: habitData.trend || [],
      };

      // Add to the habits array
      setHabits(prevHabits => {
        const updatedHabits = [...prevHabits, newHabit];
        console.log('Added new habit:', newHabit.name);
        return updatedHabits;
      });
      
    } catch (error) {
      console.error('Failed to add habit:', error);
      throw error;
    }
  };

  /**
   * Update an existing habit
   */
  const updateHabit = (id: number, updates: Partial<Habit>): void => {
    try {
      setHabits(prevHabits => {
        const habitIndex = prevHabits.findIndex(habit => habit.id === id);
        
        if (habitIndex === -1) {
          console.warn(`Habit with id ${id} not found`);
          return prevHabits;
        }

        const updatedHabits = [...prevHabits];
        const currentHabit = updatedHabits[habitIndex];
        
        // Update the habit with new data
        updatedHabits[habitIndex] = {
          ...currentHabit,
          ...updates,
        };

        console.log(`Updated habit ${id}:`, updates);
        return updatedHabits;
      });
    } catch (error) {
      console.error('Failed to update habit:', error);
      throw error;
    }
  };

  /**
   * Delete a habit
   */
  const deleteHabit = (id: number): void => {
    try {
      setHabits(prevHabits => {
        const filteredHabits = prevHabits.filter(habit => habit.id !== id);
        
        if (filteredHabits.length === prevHabits.length) {
          console.warn(`Habit with id ${id} not found for deletion`);
          return prevHabits;
        }

        console.log(`Deleted habit with id: ${id}`);
        return filteredHabits;
      });
    } catch (error) {
      console.error('Failed to delete habit:', error);
      throw error;
    }
  };

  /**
   * Get habit by ID (utility function)
   */
  const getHabitById = (id: number): Habit | undefined => {
    return habits.find(habit => habit.id === id);
  };

  /**
   * Get habits by type (utility function)
   */
  const getHabitsByType = (type: Habit['type']): Habit[] => {
    return habits.filter(habit => habit.type === type);
  };

  /**
   * Reset all habits' daily status (for daily reset functionality)
   */
  const resetDailyHabits = (): void => {
    try {
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.type === 'daily') {
            return {
              ...habit,
              status: 'pending',
              count: 0,
            };
          }
          return habit;
        })
      );
      console.log('Reset all daily habits');
    } catch (error) {
      console.error('Failed to reset daily habits:', error);
    }
  };

  // Context value object
  const contextValue: HabitContextType = {
    habits,
    setHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    loading,
    // Additional utility functions (extend the interface if you want to use these)
    // getHabitById,
    // getHabitsByType,
    // resetDailyHabits,
  };

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};

// Export the context for advanced use cases (optional)
export { HabitContext };
