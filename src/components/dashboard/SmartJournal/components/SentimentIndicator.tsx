import React from 'react';
import { ThumbsUp, ThumbsDown, Minus, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentIndicatorProps {
  score: number;
  magnitude: number;
  className?: string;
}

export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  score,
  magnitude,
  className
}) => {
  // Determine the sentiment category and corresponding styles
  const getSentimentDetails = () => {
    if (magnitude < 0.2) {
      return {
        icon: <Minus className="w-5 h-5" />,
        label: 'Neutral',
        color: 'text-gray-500',
        description: 'Your entry appears neutral in tone'
      };
    }

    if (score > 0.5) {
      return {
        icon: <ThumbsUp className="w-5 h-5" />,
        label: 'Positive',
        color: 'text-green-500',
        description: 'Your entry shows positive emotions and resilience'
      };
    }

    if (score < -0.5) {
      return {
        icon: <ThumbsDown className="w-5 h-5" />,
        label: 'Challenging',
        color: 'text-red-500',
        description: 'You might be going through a difficult time'
      };
    }

    return {
      icon: <Brain className="w-5 h-5" />,
      label: 'Mixed',
      color: 'text-blue-500',
      description: 'Your entry shows a mix of emotions'
    };
  };

  const { icon, label, color, description } = getSentimentDetails();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("p-2 rounded-full bg-background", color)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
  );
};