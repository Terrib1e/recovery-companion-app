// Core AI Analysis Types
export interface SentimentAnalysis {
  score: number;  // Range from -1 to 1
  magnitude: number;  // Intensity of emotion
  primaryEmotion: EmotionType;
  secondaryEmotions: EmotionType[];
}

export type EmotionType = 
  | 'joy' 
  | 'sadness' 
  | 'anger' 
  | 'fear' 
  | 'anxiety'
  | 'hope' 
  | 'neutral';

export interface TriggerAnalysis {
  identifiedTriggers: Trigger[];
  riskLevel: RiskLevel;
  confidenceScore: number;
}

export interface Trigger {
  type: TriggerType;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export type TriggerType = 
  | 'environmental'
  | 'emotional'
  | 'social'
  | 'physical'
  | 'cognitive';

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';

// AI Response Types
export interface AIResponse {
  analysis: {
    sentiment: SentimentAnalysis;
    triggers: TriggerAnalysis;
    patterns?: PatternAnalysis;
  };
  recommendations: Recommendation[];
  emergencyResponse: EmergencyResponse | null;
}

export interface PatternAnalysis {
  identifiedPatterns: Pattern[];
  timeframe: string;
  confidence: number;
}

export interface Pattern {
  type: 'behavior' | 'trigger' | 'emotion';
  description: string;
  frequency: number;
  significance: number;
}

export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  resources?: Resource[];
}

export type RecommendationType = 
  | 'coping'
  | 'preventive'
  | 'therapeutic'
  | 'lifestyle'
  | 'emergency';

export interface Resource {
  title: string;
  type: 'article' | 'exercise' | 'contact' | 'service';
  description: string;
  url?: string;
  phoneNumber?: string;
}

export interface EmergencyResponse {
  required: boolean;
  level: 'alert' | 'immediate' | 'urgent';
  actions: EmergencyAction[];
}

export interface EmergencyAction {
  step: number;
  action: string;
  contact?: {
    name: string;
    number: string;
    available24h: boolean;
  };
}

// AI Service Configuration
export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  apiVersion: string;
  endpoint: string;
}

// AI Context State
export interface AIContextState {
  isProcessing: boolean;
  lastAnalysis: AIResponse | null;
  error: Error | null;
  config: AIConfig;
}