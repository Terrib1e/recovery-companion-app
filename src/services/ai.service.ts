import type { 
  AIResponse, 
  SentimentAnalysis, 
  TriggerAnalysis, 
  AIConfig,
  EmotionType,
  Trigger,
  RiskLevel 
} from '../types/ai';

class AIService {
  private apiKey: string | undefined;
  private retryAttempts = 3;
  private retryDelay = 1000;
  config: AIConfig;
  baseUrl: string;
  model: string;

  constructor(config: AIConfig) {
    this.config = config;
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4';
  }

  private validateConfiguration() {
    if (!this.apiKey) {
      console.warn('API key not configured. Using fallback responses.');
      return false;
    }
    return true;
  }

  public async analyze(text: string, type: 'sentiment' | 'triggers' | 'recommendations'): Promise<any> {
    // If no API key, return fallback immediately
    if (!this.validateConfiguration()) {
      return this.getFallbackResponse(type);
    }

    const prompts = {
      sentiment: this.getSentimentPrompt(text),
      triggers: this.getTriggersPrompt(text),
      recommendations: this.getRecommendationsPrompt(text)
    };

    try {
      const response = await this.makeApiRequest(prompts[type]);
      const parsedResponse = this.parseResponse(response, type);
      return parsedResponse;
    } catch (error) {
      console.error('Error in ' + type + ' analysis:', error);
      return this.getFallbackResponse(type);
    }
  }

  private async makeApiRequest(prompt: string): Promise<string> {
    // Skip API call if no key configured
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed: ' + response.statusText);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }

  // Rest of the implementation...
  // (Previous methods remain the same)

  private getFallbackResponse(type: string): any {
    console.log('Using fallback response for:', type);
    
    const fallbacks = {
      sentiment: {
        sentiment: 0,
        magnitude: 0,
        primaryEmotion: 'neutral' as EmotionType,
        secondaryEmotions: [] as EmotionType[]
      },
      triggers: {
        identifiedTriggers: [] as Trigger[],
        riskLevel: 'low' as RiskLevel,
        confidenceScore: 0.5
      },
      recommendations: [
        { title: 'Practice deep breathing', description: 'Use breathing exercises to stay calm' },
        { title: 'Contact support', description: 'Reach out to your support network' }
      ]
    };

    return fallbacks[type as keyof typeof fallbacks];
  }
}

const defaultConfig: AIConfig = {
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  apiVersion: '2024-02',
  endpoint: import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'
};

export const aiService = new AIService(defaultConfig);