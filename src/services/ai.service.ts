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
  private apiKey: string;
  private retryAttempts = 3;
  private retryDelay = 1000;
  config: AIConfig;
  baseUrl: string;
  model: string;

  constructor(config: AIConfig) {
    this.config = config;
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo';

    this.validateConfiguration();
  }

  private validateConfiguration() {
    if (!this.apiKey) {
      console.error('Missing API key. Please check your environment variables.');
      throw new Error('API key not configured');
    }
  }

  public async analyze(text: string, type: 'sentiment' | 'triggers' | 'recommendations'): Promise<any> {
    console.log('Starting analysis:', { type, textLength: text.length });

    const prompts = {
      sentiment: this.getSentimentPrompt(text),
      triggers: this.getTriggersPrompt(text),
      recommendations: this.getRecommendationsPrompt(text)
    };

    try {
      const response = await this.makeApiRequest(prompts[type]);
      console.log('Analysis completed successfully:', { type });
      const parsedResponse = this.parseResponse(response, type);
      return parsedResponse;
    } catch (error) {
      console.error('Analysis failed:', { type, error: (error as Error).message });
      return this.getFallbackResponse(type);
    }
  }

  private async makeApiRequest(prompt: string, attempt = 1): Promise<string> {
    const requestPayload = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in mental health analysis. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    };

    console.log('Preparing API request:', {
      attempt,
      url: this.baseUrl,
      model: this.model
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('API request failed: ' + errorText);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response structure');
      }

      return data.choices[0].message.content;

    } catch (error) {
      console.error('Request error:', {
        attempt,
        error: (error as Error).message,
        type: (error as Error).name
      });

      if (attempt < this.retryAttempts) {
        const delayMs = this.retryDelay * Math.pow(2, attempt - 1);
        console.log('Retrying request:', {
          attempt: attempt + 1,
          delayMs,
          maxAttempts: this.retryAttempts
        });

        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.makeApiRequest(prompt, attempt + 1);
      }

      throw error;
    }
  }

  private getSentimentPrompt(text: string): string {
    return [
      'Analyze the emotional content and sentiment of the following text.',
      'Your response must be a JSON object with these exact fields:',
      '- sentiment: number between -1 and 1',
      '- magnitude: number between 0 and 1',
      '- primaryEmotion: one of [joy, sadness, anger, fear, anxiety, hope, neutral]',
      '- secondaryEmotions: array of the emotions listed above',
      '',
      'Text to analyze: ' + text
    ].join('\n');
  }

  private getTriggersPrompt(text: string): string {
    return [
      'Analyze the following text for potential triggers and risk factors.',
      'Your response must be a JSON object with these exact fields:',
      '- identifiedTriggers: array of objects containing:',
      '  * type: string (emotional, environmental, social, physical, or cognitive)',
      '  * description: string',
      '  * severity: string (low, medium, or high)',
      '  * recommendations: array of strings',
      '- riskLevel: string (low, moderate, elevated, high, or critical)',
      '- confidenceScore: number between 0 and 1',
      '',
      'Text to analyze: ' + text
    ].join('\n');
  }

  private getRecommendationsPrompt(text: string): string {
    return [
      'Based on the following analysis, provide actionable recommendations.',
      'Your response must be an array of objects, each containing:',
      '- title: string',
      '- description: string',
      '',
      'Analysis to base recommendations on: ' + text
    ].join('\n');
  }

  private parseResponse(response: string, type: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Response parsing failed:', {
        type,
        error: (error as Error).message,
        response: response.substring(0, 100) + '...'
      });
      return this.getFallbackResponse(type);
    }
  }

  private getFallbackResponse(type: string): any {
    console.log('Using fallback response:', { type });

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
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 100,
  apiVersion: '2024-02',
  endpoint: 'https://api.openai.com/v1/chat/completions'
};

export const aiService = new AIService(defaultConfig);