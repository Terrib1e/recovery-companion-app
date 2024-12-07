import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAI } from '@/contexts/AIContext';
import { useProgress } from '@/contexts/progress/ProgressContext';
import { useStorage } from '@/hooks/useStorage';
import {
  HeartPulse,
  Brain,
  ThumbsUp,
  AlertTriangle,
  Calendar,
  Loader,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MoodLevel {
  value: number;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const moodLevels: MoodLevel[] = [
  {
    value: 1,
    label: 'Struggling',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    description: 'Having a very difficult time'
  },
  {
    value: 2,
    label: 'Challenging',
    icon: <Brain className="w-6 h-6 text-orange-500" />,
    description: 'Facing some difficulties'
  },
  {
    value: 3,
    label: 'Stable',
    icon: <HeartPulse className="w-6 h-6 text-blue-500" />,
    description: 'Managing well'
  },
  {
    value: 4,
    label: 'Good',
    icon: <ThumbsUp className="w-6 h-6 text-green-500" />,
    description: 'Feeling positive and strong'
  }
];

const DailyCheckIn: React.FC = () => {
  const [mood, setMood] = useState<number>(2);
  const [triggers, setTriggers] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useAI();
  const { addEntry } = useProgress();
  const { value: lastCheckIn, setValue: setLastCheckIn } = useStorage<string | null>('lastCheckIn', null);

  const hasCheckedInToday = lastCheckIn === new Date().toDateString();

  const currentMood = moodLevels[mood - 1];

  useEffect(() => {
    // Check if we need to reset the form for a new day
    if (lastCheckIn && lastCheckIn !== new Date().toDateString()) {
      setMood(2);
      setTriggers(0);
    }
  }, [lastCheckIn]);

  const handleCheckIn = async () => {
    setIsSubmitting(true);
    try {
      const checkInData = {
        date: new Date().toISOString(),
        mood,
        triggers,
        notes: `Mood: ${currentMood.label}, Triggers: ${triggers}`
      };

      // Get AI analysis of the check-in

      // Add entry to progress tracking
      await addEntry({
        date: checkInData.date,
        mood: checkInData.mood,
        triggers: checkInData.triggers,
        notes: checkInData.notes,
        activities: []
      });

      // Update last check-in date
      await setLastCheckIn(new Date().toDateString());

      // Show success message or trigger animation
    } catch (error) {
      console.error('Error during check-in:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasCheckedInToday) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Daily Check-in Complete
          </CardTitle>
          <CardDescription>You've already checked in today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="bg-primary/10 border-primary/20">
              <AlertDescription className="flex items-center gap-2">
                {currentMood.icon}
                <span>You reported feeling {currentMood.label.toLowerCase()} today</span>
              </AlertDescription>
            </Alert>
            <div className="text-sm text-muted-foreground">
              Your next check-in will be available tomorrow
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" />
          Daily Check-in
        </CardTitle>
        <CardDescription>How are you feeling today?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {currentMood.icon}
            <div className="text-center">
              <div className="font-medium">{currentMood.label}</div>
              <div className="text-sm text-muted-foreground">
                {currentMood.description}
              </div>
            </div>
          </div>

          <Slider
            value={[mood]}
            min={1}
            max={4}
            step={1}
            onValueChange={([value]) => setMood(value)}
            className="w-full"
          />

          <div className="flex justify-between text-sm text-muted-foreground">
            {moodLevels.map((level) => (
              <div key={level.value} className="text-center">
                {level.value}
              </div>
            ))}
          </div>
        </div>

        {/* Triggers Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Number of triggers experienced today:
          </label>
          <Slider
            value={[triggers]}
            min={0}
            max={5}
            step={1}
            onValueChange={([value]) => setTriggers(value)}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground text-center">
            {triggers} trigger{triggers !== 1 ? 's' : ''} reported
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleCheckIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Complete Check-in'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyCheckIn;