import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAI } from '@/contexts/AIContext';
import { Brain, Loader, AlertTriangle, Sparkles, ThumbsUp, Book } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  analysis?: {
    sentiment: number;
    triggers: string[];
    recommendations: Array<{
      title: string;
      description: string;
      emotionTarget?: string;
    }>;
  };
}
interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}
type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral';

interface AnalysisResult {
  sentiment: number;
  magnitude: number;
  primaryEmotion: EmotionType;
  secondaryEmotions: EmotionType[];
  triggers?: {
    identifiedTriggers: Array<{
      type: string;
      description: string;
      severity: string;
      recommendations: string[];
    }>;
    riskLevel: string;
    confidenceScore: number;
  };
  recommendations?: Array<{
    title: string;
    description: string;
    emotionTarget?: string;
  }>;
}

const SmartJournal: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzeContent } = useAI();
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });

  const validateSentiment = (analysis: any): boolean => {
    return (
      typeof analysis?.sentiment === 'number' &&
      typeof analysis?.magnitude === 'number' &&
      typeof analysis?.primaryEmotion === 'string' &&
      Array.isArray(analysis?.secondaryEmotions)
    );
  };

  const validateTriggers = (analysis: any): boolean => {
    return (
      !analysis.triggers ||
      (
        Array.isArray(analysis?.triggers?.identifiedTriggers) &&
        analysis.triggers.identifiedTriggers.every(
          (t: { type: string; description: string; severity: string; recommendations: string[] }): boolean =>
            typeof t.type === 'string' &&
            typeof t.description === 'string' &&
            typeof t.severity === 'string' &&
            Array.isArray(t.recommendations)
        ) &&
        typeof analysis?.triggers?.riskLevel === 'string' &&
        typeof analysis?.triggers?.confidenceScore === 'number'
      )
    );
  };

  const validateRecommendations = (analysis: any): boolean => {
    return (
      !analysis.recommendations ||
      (
        Array.isArray(analysis?.recommendations) &&
        analysis.recommendations.every(
          (r: { title: string; description: string }): boolean =>
            typeof r.title === 'string' &&
            typeof r.description === 'string'
        )
      )
    );
  };

  const isValidAnalysis = (analysis: any): analysis is AnalysisResult => {
    console.debug('Validating analysis structure:', JSON.stringify(analysis, null, 2));

    if (!validateSentiment(analysis)) {
      throw new Error('Invalid sentiment data structure');
    }
    if (!validateTriggers(analysis)) {
      throw new Error('Invalid triggers data structure');
    }
    if (!validateRecommendations(analysis)) {
      throw new Error('Invalid recommendations data structure');
    }

    return true;
  };

  const handleAnalyze = useCallback(
    async (retryCount = 0) => {
      if (!content.trim()) {
        setAnalysisState({ status: 'error', error: 'Please enter some content to analyze' });
        return;
      }

      setIsAnalyzing(true);
      setAnalysisState({ status: 'loading' });

      try {
        const entry: JournalEntry = {
          id: Date.now().toString(),
          content: content.trim(),
          timestamp: new Date().toISOString(),
        };

        // Get analysis result directly from analyzeContent
        const analysisResult = await analyzeContent(content);
        console.debug('Received analysis result:', analysisResult);

        if (!analysisResult || !isValidAnalysis(analysisResult)) {
          throw new Error('Invalid or incomplete analysis data received');
        }
        // Update entry with analysis data
        entry.analysis = {
          sentiment: analysisResult.sentiment,
          triggers: analysisResult.triggers?.identifiedTriggers.map(trigger => trigger.description) || [],
          recommendations: analysisResult.recommendations || []
        };

        console.debug('Updated entry with analysis:', entry);

        setCurrentEntry(entry);
        setAnalysisState({ status: 'success' });

        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        localStorage.setItem('journalEntries', JSON.stringify([...existingEntries, entry]));
      } catch (error) {
        console.error('Error analyzing journal entry:', error);

        if (retryCount < 2) {
          const backoffTime = Math.pow(2, retryCount) * 1000;
          setTimeout(() => handleAnalyze(retryCount + 1), backoffTime);
          return;
        }

        setAnalysisState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to analyze entry',
        });
        setCurrentEntry(null);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [content, analyzeContent],
  );

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.5) return <ThumbsUp className="w-5 h-5 text-green-500" />;
    if (sentiment < -0.5) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    return <Brain className="w-5 h-5 text-blue-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-6 h-6 text-primary" />
          Smart Journal
          <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">AI-Powered</span>
        </CardTitle>
        <CardDescription>Write about your day, thoughts, or feelings. Our AI will provide helpful insights.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysisState.status === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{analysisState.error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          placeholder="How are you feeling today? What's on your mind?"
          className="min-h-[200px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isAnalyzing}
        />

        {currentEntry?.analysis && (
          <div className="space-y-4 mt-4">
            {/* Sentiment Analysis */}
            <div className="flex items-center gap-2 p-4 bg-card border rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">AI Insights</h4>
                <div className="flex items-center gap-2 mt-1">
                  {getSentimentIcon(currentEntry.analysis.sentiment)}
                  <span className="text-sm text-muted-foreground">
                    {currentEntry.analysis.sentiment > 0.5
                      ? 'Your entry shows positive emotions and resilience.'
                      : currentEntry.analysis.sentiment < -0.5
                      ? 'You might be going through a challenging time.'
                      : 'Your emotions appear balanced.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Identified Triggers */}
            {currentEntry.analysis.triggers.length > 0 && (
              <Alert>
                <AlertTitle>Potential Triggers Identified</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2">
                    {currentEntry.analysis.triggers.map((trigger, index) => (
                      <li key={index} className="text-sm">
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Recommendations */}
            <div className="space-y-2">
              <h4 className="font-medium">Mood Regulation Suggestions</h4>
              <div className="grid gap-4">
                {currentEntry.analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-primary" />
                      <h5 className="font-medium">{rec.title}</h5>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                    {rec.emotionTarget && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs">
                        Targets: {rec.emotionTarget}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => setContent('')} disabled={!content || isAnalyzing}>
          Clear
        </Button>
        <Button onClick={() => handleAnalyze()} disabled={!content.trim() || isAnalyzing} className="flex items-center gap-2">
          {isAnalyzing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze Entry
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmartJournal;
