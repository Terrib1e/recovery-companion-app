import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, AlertTriangle, ThumbsUp, Info } from 'lucide-react';
import type { AIResponse } from '@/types/ai';

interface AIAnalysisProps {
  analysis: AIResponse;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  const { sentiment, triggers } = analysis.analysis;
  const getSentimentIcon = () => {
    if (sentiment.score > 0.5) return <ThumbsUp className="h-4 w-4 text-green-500" />;
    if (sentiment.score < -0.5) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <Brain className="h-4 w-4 text-blue-500" />;
  };

  const getSentimentDescription = () => {
    if (sentiment.score > 0.5) return 'Your entry shows positive emotions and resilience';
    if (sentiment.score < -0.5) return 'You might be going through a challenging time';
    return 'Your emotions appear balanced';
  };

  return (
    <div className="space-y-4">
      {/* Sentiment Analysis */}
      <Alert className="bg-card">
        <div className="flex items-center gap-2">
          {getSentimentIcon()}
          <div>
            <AlertTitle>AI Insight</AlertTitle>
            <AlertDescription>{getSentimentDescription()}</AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Identified Triggers */}
      {triggers.identifiedTriggers.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Potential Triggers Identified</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {triggers.identifiedTriggers.map((trigger, index) => (
                <li key={index} className="text-sm">
                  {trigger.description}
                  {trigger.recommendations.length > 0 && (
                    <ul className="list-none pl-4 mt-1 space-y-1">
                      {trigger.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-xs flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Suggested Actions
          </h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-primary" />
                <span>{rec.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
