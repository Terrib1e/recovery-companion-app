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
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
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
    // Prevent multiple simultaneous calls
    if (state.isProcessing) {
      console.log('Already processing, skipping new request');
      return null;
    }

    console.log('Starting AI analysis...'); // Debug log
    dispatch({ type: 'START_PROCESSING' });

    try {
      const analysis = await aiService.analyze(text, 'sentiment');
      console.log('AI analysis completed'); // Debug log
      
      dispatch({ type: 'SET_ANALYSIS', payload: analysis });
      return analysis;
    } catch (error) {
      console.error('AI analysis error:', error);
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      throw error;
    }
  }, [state.isProcessing]); // Only depend on processing state

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