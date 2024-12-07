import { format, subDays } from 'date-fns';

export interface JournalEntry {
  content: string;
  timestamp: string;
  analysis?: {
    sentiment: {
      score: number;
      magnitude: number;
      primaryEmotion: string;
    };
    triggers: {
      identifiedTriggers: Array<{
        type: string;
        description: string;
      }>;
    };
  };
}

export function processJournalData(entries: JournalEntry[]) {
  // Prepare date range (last 7 days)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'MMM dd');
  }).reverse();

  // Process emotion data
  const emotionData = dates.map(date => {
    const dayEntries = entries.filter(entry => 
      format(new Date(entry.timestamp), 'MMM dd') === date
    );
    
    const avgSentiment = dayEntries.reduce((sum, entry) => 
      sum + (entry.analysis?.sentiment.score || 0), 0
    ) / (dayEntries.length || 1);

    return {
      date,
      value: Number((avgSentiment * 5 + 5).toFixed(1)) // Convert -1 to 1 scale to 0 to 10
    };
  });

  // Process trigger data
  const triggerTypes = new Map<string, number>();
  entries.forEach(entry => {
    entry.analysis?.triggers.identifiedTriggers.forEach(trigger => {
      const count = triggerTypes.get(trigger.type) || 0;
      triggerTypes.set(trigger.type, count + 1);
    });
  });

  const triggerData = Array.from(triggerTypes.entries()).map(([name, value]) => ({
    name,
    value
  }));

  // Process common emotions
  const emotions = new Map<string, number>();
  entries.forEach(entry => {
    if (entry.analysis?.sentiment.primaryEmotion) {
      const emotion = entry.analysis.sentiment.primaryEmotion;
      const count = emotions.get(emotion) || 0;
      emotions.set(emotion, count + 1);
    }
  });

  const activityData = Array.from(emotions.entries())
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    emotionData,
    triggerData,
    activityData
  };
}