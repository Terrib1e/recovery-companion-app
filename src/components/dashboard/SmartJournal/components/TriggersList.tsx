import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import type { Trigger } from '@/types/ai';

interface TriggersListProps {
  triggers: Trigger[];
  className?: string;
}

export const TriggersList: React.FC<TriggersListProps> = ({ triggers, className }) => {
  if (!triggers.length) return null;

  const highPriorityTriggers = triggers.filter(t => t.severity === 'high');
  const otherTriggers = triggers.filter(t => t.severity !== 'high');

  return (
    <div className={className}>
      {/* High Priority Triggers */}
      {highPriorityTriggers.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Triggers Identified</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {highPriorityTriggers.map((trigger, index) => (
                <li key={index} className="text-sm">
                  {trigger.description}
                  {trigger.recommendations.length > 0 && (
                    <ul className="list-none pl-4 mt-1 space-y-1">
                      {trigger.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
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

      {/* Other Triggers */}
      {otherTriggers.length > 0 && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Other Identified Patterns</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {otherTriggers.map((trigger, index) => (
                <li key={index} className="text-sm">
                  {trigger.description}
                  {trigger.recommendations.length > 0 && (
                    <ul className="list-none pl-4 mt-1 space-y-1">
                      {trigger.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
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
    </div>
  );
};