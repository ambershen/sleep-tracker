import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SleepGoals {
  targetSleepDuration: number;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
}

interface SleepStore {
  entries: SleepEntry[];
  goals: SleepGoals;
  isLoading: boolean;
  error: string | null;
  addEntry: (entry: Omit<SleepEntry, 'id' | 'duration' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<SleepEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDateRange: (startDate: string, endDate: string) => SleepEntry[];
  getAverageQuality: (days?: number) => number;
  getAverageDuration: (days?: number) => number;
  getSleepStreak: () => number;
  updateGoals: (goals: Partial<SleepGoals>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      entries: [],
      goals: {
        targetSleepDuration: 8,
        reminderEnabled: false,
        reminderMinutesBefore: 30,
      },
      isLoading: false,
      error: null,

      addEntry: (entry) => {
        // Calculate duration from bedtime and wake time
        const calculateDuration = (bedtime: string, wakeTime: string): number => {
          const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
          const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
          
          let bedTimeMinutes = bedHours * 60 + bedMinutes;
          let wakeTimeMinutes = wakeHours * 60 + wakeMinutes;
          
          // Handle overnight sleep (wake time is next day)
          if (wakeTimeMinutes <= bedTimeMinutes) {
            wakeTimeMinutes += 24 * 60; // Add 24 hours
          }
          
          const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
          return Math.round((durationMinutes / 60) * 10) / 10; // Round to 1 decimal place
        };

        const newEntry: SleepEntry = {
          ...entry,
          id: crypto.randomUUID(),
          duration: calculateDuration(entry.bedtime, entry.wakeTime),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          entries: [...state.entries, newEntry].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },

      updateEntry: (id, updatedEntry) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updatedEntry, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      getEntriesByDateRange: (startDate, endDate) => {
        const { entries } = get();
        return entries.filter((entry) => {
          const entryDate = new Date(entry.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return entryDate >= start && entryDate <= end;
        });
      },

      getAverageQuality: (days = 7) => {
        const { entries } = get();
        if (entries.length === 0) return 0;
        const recentEntries = entries.slice(0, days);
        const totalQuality = recentEntries.reduce((sum, entry) => sum + entry.quality, 0);
        return totalQuality / recentEntries.length;
      },

      getAverageDuration: (days = 7) => {
        const { entries } = get();
        if (entries.length === 0) return 0;
        const recentEntries = entries.slice(0, days);
        const totalDuration = recentEntries.reduce((sum, entry) => sum + entry.duration, 0);
        return totalDuration / recentEntries.length;
      },

      getSleepStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;
        
        // Sort entries by date (most recent first)
        const sortedEntries = [...entries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const entry of sortedEntries) {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          
          const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === streak) {
            streak++;
          } else if (daysDiff === streak + 1 && streak === 0) {
            // Allow for yesterday if no entry today
            streak++;
          } else {
            break;
          }
          
          currentDate = new Date(entryDate.getTime() - 24 * 60 * 60 * 1000);
        }
        
        return streak;
      },

      updateGoals: (newGoals) => {
        set((state) => ({
          goals: { ...state.goals, ...newGoals },
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'sleep-tracker-storage',
      partialize: (state) => ({ entries: state.entries, goals: state.goals }),
    }
  )
);