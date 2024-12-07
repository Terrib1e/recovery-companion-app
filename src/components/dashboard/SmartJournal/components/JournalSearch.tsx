import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JournalSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

export const JournalSearch: React.FC<JournalSearchProps> = ({
  onSearch,
  onFilterChange,
  onSortChange
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search journal entries..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex gap-4">
        <Select onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entries</SelectItem>
            <SelectItem value="positive">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Positive Mood
              </div>
            </SelectItem>
            <SelectItem value="triggers">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Has Triggers
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Newest First
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Oldest First
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
