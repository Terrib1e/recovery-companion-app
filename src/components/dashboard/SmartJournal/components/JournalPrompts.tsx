import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface JournalPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    category: 'Reflection',
    questions: [
      "What's the most challenging part of your recovery journey today?",
      "What coping strategies have worked best for you this week?",
      "What are you most proud of in your recovery journey?",
      "What triggers have you successfully managed recently?"
    ]
  },
  {
    category: 'Growth',
    questions: [
      "What new healthy habits have you developed?",
      "How has your support system helped you recently?",
      "What have you learned about yourself in recovery?",
      "What goals would you like to set for your recovery?"
    ]
  },
  {
    category: 'Wellness',
    questions: [
      "How are you taking care of your physical health today?",
      "What activities bring you peace and calm?",
      "How has your sleep been affecting your recovery?",
      "What self-care practices have been most helpful?"
    ]
  }
];

export const JournalPrompts: React.FC<JournalPromptsProps> = ({ onSelectPrompt }) => {
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    const randomCategory = prompts[Math.floor(Math.random() * prompts.length)];
    return randomCategory.questions[Math.floor(Math.random() * randomCategory.questions.length)];
  });

  const generateNewPrompt = () => {
    const randomCategory = prompts[Math.floor(Math.random() * prompts.length)];
    const newPrompt = randomCategory.questions[Math.floor(Math.random() * randomCategory.questions.length)];
    setCurrentPrompt(newPrompt);
  };

  return (
    <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Lightbulb className="h-4 w-4" />
            Writing Prompt
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={generateNewPrompt}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-sm">{currentPrompt}</p>
        <Button 
          variant="ghost" 
          className="w-full mt-2 text-primary"
          onClick={() => onSelectPrompt(currentPrompt)}
        >
          Use This Prompt
        </Button>
      </CardContent>
    </Card>
  );
};
