import type { AIResponse } from '@/types/ai';

export interface JournalEntryType {
  id: string;
  content: string;
  timestamp: string;
  analysis?: AIResponse;
  isDraft?: boolean;
}

export interface JournalEntryProps {
  entry: JournalEntryType;
  onDelete: (id: string) => Promise<void>;
}