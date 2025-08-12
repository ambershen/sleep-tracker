import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  demoData: {
    sleepEntries: SleepEntry[];
    user: DemoUser;
  };
  startDemo: () => void;
  exitDemo: () => void;
}

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
  sleepScore: number;
}

interface DemoUser {
  name: string;
  email: string;
  sleepGoal: number;
  streak: number;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Generate demo sleep data for the last 30 days
const generateDemoData = (): SleepEntry[] => {
  const entries: SleepEntry[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic sleep data with some variation
    const baseQuality = 7 + Math.random() * 2; // 7-9 range
    const baseDuration = 7.5 + (Math.random() - 0.5) * 2; // 6.5-8.5 hours
    const quality = Math.max(1, Math.min(10, Math.round(baseQuality)));
    const duration = Math.max(4, Math.min(12, baseDuration));
    
    // Calculate bedtime and wake time
    const wakeHour = 7 + Math.random() * 2; // 7-9 AM
    const bedtimeHour = wakeHour - duration;
    
    const bedtime = new Date(date);
    bedtime.setHours(Math.floor(bedtimeHour), Math.round((bedtimeHour % 1) * 60));
    if (bedtimeHour < 0) {
      bedtime.setDate(bedtime.getDate() - 1);
      bedtime.setHours(24 + Math.floor(bedtimeHour), Math.round((bedtimeHour % 1) * 60));
    }
    
    const wakeTime = new Date(date);
    wakeTime.setHours(Math.floor(wakeHour), Math.round((wakeHour % 1) * 60));
    
    // Calculate sleep score based on duration and quality
    const durationScore = Math.min(100, (duration / 8) * 100);
    const qualityScore = (quality / 10) * 100;
    const sleepScore = Math.round((durationScore + qualityScore) / 2);
    
    entries.push({
      id: `demo-${i}`,
      date: date.toISOString().split('T')[0],
      bedtime: bedtime.toTimeString().slice(0, 5),
      wakeTime: wakeTime.toTimeString().slice(0, 5),
      duration: Math.round(duration * 10) / 10,
      quality,
      sleepScore,
      notes: i % 5 === 0 ? [
        'Had a great night\'s sleep!',
        'Felt a bit restless due to stress',
        'Exercised earlier, slept deeply',
        'Had caffeine late, took longer to fall asleep',
        'Perfect temperature and quiet environment'
      ][Math.floor(Math.random() * 5)] : undefined
    });
  }
  
  return entries.reverse(); // Most recent first
};

const demoUser: DemoUser = {
  name: 'Demo User',
  email: 'demo@sleeptracker.com',
  sleepGoal: 8,
  streak: 12
};

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData] = useState({
    sleepEntries: generateDemoData(),
    user: demoUser
  });

  const startDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('sleeptracker_demo_mode', 'true');
  };

  const exitDemo = () => {
    setIsDemoMode(false);
    localStorage.removeItem('sleeptracker_demo_mode');
  };

  // Check for demo mode on initial load
  React.useEffect(() => {
    const savedDemoMode = localStorage.getItem('sleeptracker_demo_mode');
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      demoData,
      startDemo,
      exitDemo
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export type { SleepEntry, DemoUser };