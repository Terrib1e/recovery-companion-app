import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { aiService } from '../services/ai.service';
import type { AIContextState } from '../types/ai';

type AIAction =
  | { type: 'START_PROCESSING' }
  | { type: 'SET_ANALYSIS'; payload: any }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'RESET' };

interface AIContextValue {
  state: AIContextState;
  analyzeContent: (text: string) => Promise<any>;
  reset: () => void;
}

const initialState: AIContextState = {
  isProcessing: false,
  lastAnalysis: null,
  error: null,
  config: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 100,
    apiVersion: '2024-02',
    endpoint: ''
  }
};

const AIContext = createContext<AIContextValue | undefined>(undefined);

function aiReducer(state: AIContextState, action: AIAction): AIContextState {
  switch (action.type) {
    case 'START_PROCESSING':
      return {
        ...state,
        isProcessing: true,
        error: null
      };
    case 'SET_ANALYSIS':
      return {
        ...state,
        isProcessing: false,
        lastAnalysis: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        isProcessing: false,
        error: action.payload
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // Using useCallback to prevent recreation of the function
  const analyzeContent = useCallback(async (text: string) => {
    if (state.isProcessing) {
      console.log('Already processing, skipping new request');
      return null;
    }

    console.log('Starting AI analysis...');
    dispatch({ type: 'START_PROCESSING' });

    try {
      const analysis = await aiService.analyze(text, 'sentiment');
      console.log('AI analysis result:', analysis);

      if (!analysis) {
        throw new Error('Analysis result is null or undefined');
      }

      // Update state and return the analysis
      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      return analysis; // Return the analysis directly instead of accessing state
    } catch (error) {
      console.error('AI analysis error:', error);
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  }, []); // Remove state.isProcessing dependency

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <AIContext.Provider value={{ state, analyzeContent, reset }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export default AIContext;