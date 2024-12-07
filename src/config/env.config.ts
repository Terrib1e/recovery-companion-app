interface EnvConfig {
  AI_API_ENDPOINT: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export const getEnvConfig = (): EnvConfig => {
  return {
    AI_API_ENDPOINT: import.meta.env.VITE_AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    NODE_ENV: import.meta.env.MODE as 'development' | 'production' | 'test',
  };
};