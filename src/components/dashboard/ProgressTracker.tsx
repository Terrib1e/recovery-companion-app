import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Calendar, Medal, Activity, Download } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProgress } from '@/contexts/progress/ProgressContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ProgressTracker: React.FC = () => {
  const { progress, loading, getStreak, exportData } = useProgress();
  const { theme } = useTheme();

  const chartColors = {
    mood: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    triggers: theme === 'dark' ? '#F87171' : '#EF4444',
    text: theme === 'dark' ? '#E5E7EB' : '#374151',
    grid: theme === 'dark' ? '#374151' : '#E5E7EB'
  };

  const chartData = progress?.dailyEntries.slice(-7).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: entry.mood,
    triggers: entry.triggers
  })) || [];

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recovery-progress.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const currentStreak = getStreak();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recovery Progress
          </CardTitle>
          <CardDescription>Track your recovery journey</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleExport}>
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Medal className="h-4 w-4 text-primary" />
              Streak
            </div>
            <div className="text-2xl font-bold mt-1">{currentStreak} days</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-primary" />
              Avg Mood
            </div>
            <div className="text-2xl font-bold mt-1">
              {progress?.stats.averageMood.toFixed(1) || '0.0'}
            </div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Total Days
            </div>
            <div className="text-2xl font-bold mt-1">
              {progress?.stats.totalDays || 0}
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="date" 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
              />
              <YAxis 
                stroke={chartColors.text}
                tick={{ fill: chartColors.text }}
                domain={[0, 5]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: chartColors.grid,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="mood"
                stroke={chartColors.mood}
                name="Mood Level"
                strokeWidth={2}
                dot={{ stroke: chartColors.mood, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="triggers"
                stroke={chartColors.triggers}
                name="Triggers"
                strokeWidth={2}
                dot={{ stroke: chartColors.triggers, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {currentStreak >= 7 && (
          <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
            <Medal className="h-4 w-4" />
            <AlertDescription>
              Congratulations! You've maintained a {currentStreak}-day streak. Keep up the great work!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;