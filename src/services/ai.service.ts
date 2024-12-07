import type { 
  AIConfig,
  EmotionType,
  Trigger,
  RiskLevel 
} from '../types/ai';

class AIService {
  private readonly isDemoMode = true; // Force demo mode for production
  config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  public async analyze(text: string, type: 'sentiment' | 'triggers' | 'recommendations'): Promise<any> {
    // Always use fallback responses in production/demo mode
    return this.getFallbackResponse(type);
  }

  private getFallbackResponse(type: string): any {
    const fallbacks = {
      sentiment: {
        sentiment: Math.random() * 0.5, // Random slightly positive sentiment
        magnitude: Math.random() * 0.5,
        primaryEmotion: 'neutral' as EmotionType,
        secondaryEmotions: ['hope'] as EmotionType[]
      },
      triggers: {
        identifiedTriggers: [] as Trigger[],
        riskLevel: 'low' as RiskLevel,
        confidenceScore: 0.5
      },
      recommendations: [
        { 
          title: 'Practice Deep Breathing', 
          description: 'Take slow, deep breaths to help calm your mind and body.' 
        },
        { 
          title: 'Reach Out to Support', 
          description: 'Connect with your support network or a professional.' 
        },
        { 
          title: 'Use Grounding Techniques', 
          description: 'Focus on your immediate surroundings using your senses.' 
        },
        { 
          title: 'Practice Self-Care', 
          description: 'Engage in activities that promote your wellbeing.' 
        }
      ]
    };

    return fallbacks[type as keyof typeof fallbacks];
  }
}

const defaultConfig: AIConfig = {
  model: 'demo-mode',
  temperature: 0.7,
  maxTokens: 1000,
  apiVersion: '2024-02',
  endpoint: ''
};

export const aiService = new AIService(defaultConfig);