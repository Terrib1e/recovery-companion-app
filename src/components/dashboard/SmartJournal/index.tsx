import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAI } from '@/contexts/AIContext';
import { Book, Loader, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SmartJournal: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analyzeContent, state } = useAI();

  // Using useCallback to prevent recreation of the function
  const handleAnalyze = useCallback(async () => {
    // Early return conditions
    if (!content.trim() || isAnalyzing) {
      console.log('Early return - content empty or already analyzing');
      return;
    }

    console.log('Starting analysis...'); // Debug log
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Store content in a variable to prevent closure issues
      const currentContent = content;
      const result = await analyzeContent(currentContent);
      console.log('Analysis completed successfully'); // Debug log
      
      if (result) {
        setContent('');
      }
    } catch (error) {
      console.error('Error in analysis:', error);
      setError('Unable to analyze entry. Using fallback response.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, isAnalyzing, analyzeContent]); // Only depend on necessary values

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Smart Journal</CardTitle>
              <CardDescription>Write your thoughts</CardDescription>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="How are you feeling today?"
          className="min-h-[120px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isAnalyzing}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {state.lastAnalysis && (
          <Alert>
            <AlertDescription>
              Analysis complete. Sentiment: {
                state.lastAnalysis.analysis?.sentiment?.score > 0 ? 'Positive' : 'Neutral'
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          onClick={handleAnalyze}
          disabled={!content.trim() || isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmartJournal;