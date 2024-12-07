export interface DailyProgress {
  date: string;
  mood: number;
  triggers: number;
  journalEntry?: string;
  activities: string[];
  notes?: string;
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  averageMood: number;
  totalTriggers: number;
}

export interface Progress {
  dailyEntries: DailyProgress[];
  stats: ProgressStats;
  lastUpdated: string;
}