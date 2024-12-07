import React, { createContext, useContext, useCallback } from 'react';
import { useStorage } from '@/hooks/useStorage';
import type { Progress, DailyProgress, ProgressStats } from '@/types/progress';

interface ProgressContextType {
  progress: Progress | null;
  loading: boolean;
  error: Error | null;
  addEntry: (entry: DailyProgress) => Promise<void>;
  updateStats: () => Promise<void>;
  getStreak: () => number;
  getAverageMood: () => number;
  getTotalTriggers: () => number;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
}

const DEFAULT_PROGRESS: Progress = {
  dailyEntries: [],
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    averageMood: 0,
    totalTriggers: 0
  },
  lastUpdated: new Date().toISOString()
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { 
    value: progress, 
    setValue: setProgress,
    loading,
    error 
  } = useStorage<Progress>('progress', DEFAULT_PROGRESS);

  const calculateStats = useCallback((entries: DailyProgress[]): ProgressStats => {
    if (!entries.length) return DEFAULT_PROGRESS.stats;

    const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
    const totalTriggers = entries.reduce((sum, entry) => sum + entry.triggers, 0);
    
    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    const today = new Date().toDateString();
    
    for (let i = entries.length - 1; i >= 0; i--) {
      const entryDate = new Date(entries[i].date).toDateString();
      const prevDate = i > 0 ? new Date(entries[i - 1].date).toDateString() : null;
      
      if (i === entries.length - 1 && entryDate !== today) {
        break;
      }
      
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      
      if (prevDate) {
        const dayDiff = Math.floor(
          (new Date(entryDate).getTime() - new Date(prevDate).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        if (dayDiff !== 1) break;
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalDays: entries.length,
      averageMood: totalMood / entries.length,
      totalTriggers
    };
  }, []);

  const addEntry = useCallback(async (entry: DailyProgress) => {
    if (!progress) return;

    const newEntries = [...progress.dailyEntries, entry];
    const newStats = calculateStats(newEntries);

    await setProgress({
      dailyEntries: newEntries,
      stats: newStats,
      lastUpdated: new Date().toISOString()
    });
  }, [progress, setProgress, calculateStats]);

  const updateStats = useCallback(async () => {
    if (!progress) return;

    const newStats = calculateStats(progress.dailyEntries);
    await setProgress({
      ...progress,
      stats: newStats,
      lastUpdated: new Date().toISOString()
    });
  }, [progress, setProgress, calculateStats]);

  const getStreak = useCallback(() => {
    return progress?.stats.currentStreak || 0;
  }, [progress]);

  const getAverageMood = useCallback(() => {
    return progress?.stats.averageMood || 0;
  }, [progress]);

  const getTotalTriggers = useCallback(() => {
    return progress?.stats.totalTriggers || 0;
  }, [progress]);

  const exportData = useCallback(async () => {
    if (!progress) return '';
    return JSON.stringify(progress);
  }, [progress]);

  const importData = useCallback(async (data: string) => {
    try {
      const importedProgress = JSON.parse(data) as Progress;
      await setProgress(importedProgress);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid import data format');
    }
  }, [setProgress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        error,
        addEntry,
        updateStats,
        getStreak,
        getAverageMood,
        getTotalTriggers,
        exportData,
        importData
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}