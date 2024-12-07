import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface JournalEntryProps {
  entry: {
    content: string;
    timestamp: string;
  };
  onDelete: () => void;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({ entry, onDelete }) => {
  return (
    <Card className="bg-card/50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-sm whitespace-pre-wrap">
          {entry.content}
        </div>
      </CardContent>
    </Card>
  );
};
