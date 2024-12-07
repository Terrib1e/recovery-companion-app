import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAI } from '@/contexts/AIContext';
import { Brain, Loader, AlertTriangle, Sparkles, ThumbsUp, Book } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  analysis?: {
    sentiment: number;
    triggers: string[];
    recommendations: string[];
  };
}

const SmartJournal: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { state, analyzeContent } = useAI();
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      await analyzeContent(content);
      
      // Update the entry with AI analysis
      if (state.lastAnalysis) {
        entry.analysis = {
          sentiment: state.lastAnalysis.analysis.sentiment.score,
          triggers: state.lastAnalysis.analysis.triggers.identifiedTriggers.map(t => t.description),
          recommendations: state.lastAnalysis.recommendations.map(r => r.title),
        };
      }

      setCurrentEntry(entry);

      // In a production environment, we would encrypt and store the entry
      const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      localStorage.setItem('journalEntries', JSON.stringify([...existingEntries, entry]));

    } catch (error) {
      console.error('Error analyzing journal entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, analyzeContent, state.lastAnalysis]);

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
          <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            AI-Powered
          </span>
        </CardTitle>
        <CardDescription>
          Write about your day, thoughts, or feelings. Our AI will provide helpful insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                      <li key={index} className="text-sm">{trigger}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Recommendations */}
            <div className="space-y-2">
              <h4 className="font-medium">Suggested Actions</h4>
              <ul className="space-y-2">
                {currentEntry.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <ThumbsUp className="w-4 h-4 text-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          onClick={() => setContent('')}
          disabled={!content || isAnalyzing}
        >
          Clear
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={!content.trim() || isAnalyzing}
          className="flex items-center gap-2"
        >
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