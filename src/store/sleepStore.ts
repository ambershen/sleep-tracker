import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  bedtime: string; // HH:MM format
  wakeTime: string; // HH:MM format
  quality: number; // 1-10 scale
  notes?: string;
  duration: number; // in hours
}

export interface SleepGoals {
  targetSleepDuration: number; // in hours
  targetBedtime: string; // HH:MM format
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
}

interface SleepStore {
  entries: SleepEntry[];
  goals: SleepGoals;
  addEntry: (entry: Omit<SleepEntry, 'id' | 'duration'>) => void;
  updateEntry: (id: string, entry: Partial<SleepEntry>) => void;
  deleteEntry: (id: string) => void;
  updateGoals: (goals: Partial<SleepGoals>) => void;
  getEntriesInRange: (startDate: string, endDate: string) => SleepEntry[];
  getAverageQuality: (days?: number) => number;
  getAverageDuration: (days?: number) => number;
  getSleepStreak: () => number;
}

const calculateDuration = (bedtime: string, wakeTime: string): number => {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
  
  let bedTimeMinutes = bedHour * 60 + bedMin;
  let wakeTimeMinutes = wakeHour * 60 + wakeMin;
  
  // Handle overnight sleep (bedtime after midnight)
  if (wakeTimeMinutes < bedTimeMinutes) {
    wakeTimeMinutes += 24 * 60;
  }
  
  const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
  return Math.round((durationMinutes / 60) * 100) / 100; // Round to 2 decimal places
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useSleepStore = create<SleepStore>()(
  persist(
    (set, get) => ({
      entries: [],
      goals: {
        targetSleepDuration: 8,
        targetBedtime: '22:00',
        reminderEnabled: true,
        reminderMinutesBefore: 30,
      },
      
      addEntry: (entryData) => {
        const duration = calculateDuration(entryData.bedtime, entryData.wakeTime);
        const entry: SleepEntry = {
          ...entryData,
          id: generateId(),
          duration,
        };
        
        set((state) => ({
          entries: [...state.entries, entry].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },
      
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id === id) {
              const updatedEntry = { ...entry, ...updates };
              if (updates.bedtime || updates.wakeTime) {
                updatedEntry.duration = calculateDuration(
                  updatedEntry.bedtime,
                  updatedEntry.wakeTime
                );
              }
              return updatedEntry;
            }
            return entry;
          }),
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      updateGoals: (goalUpdates) => {
        set((state) => ({
          goals: { ...state.goals, ...goalUpdates },
        }));
      },
      
      getEntriesInRange: (startDate, endDate) => {
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
        const recentEntries = entries.slice(0, days);
        if (recentEntries.length === 0) return 0;
        
        const totalQuality = recentEntries.reduce((sum, entry) => sum + entry.quality, 0);
        return Math.round((totalQuality / recentEntries.length) * 10) / 10;
      },
      
      getAverageDuration: (days = 7) => {
        const { entries } = get();
        const recentEntries = entries.slice(0, days);
        if (recentEntries.length === 0) return 0;
        
        const totalDuration = recentEntries.reduce((sum, entry) => sum + entry.duration, 0);
        return Math.round((totalDuration / recentEntries.length) * 100) / 100;
      },
      
      getSleepStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < entries.length; i++) {
          const entryDate = new Date(entries[i].date);
          const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === streak) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },
    }),
    {
      name: 'sleep-tracker-storage',
    }
  )
);