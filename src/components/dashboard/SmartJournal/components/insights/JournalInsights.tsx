import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Calendar, PieChart as PieChartIcon } from 'lucide-react';

interface InsightData {
  entries: any[];
  emotionData: any[];
  triggerData: any[];
  activityData: any[];
}

interface JournalInsightsProps {
  data: InsightData;
}

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

export const JournalInsights: React.FC<JournalInsightsProps> = ({ data }) => {
  const { theme } = useTheme();

  const chartColors = {
    primary: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    text: theme === 'dark' ? '#E5E7EB' : '#374151',
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    background: theme === 'dark' ? '#1F2937' : '#FFFFFF'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Journal Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emotions">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Emotions
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Activities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emotions" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.emotionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="date" 
                  stroke={chartColors.text}
                  tick={{ fill: chartColors.text }}
                />
                <YAxis 
                  stroke={chartColors.text}
                  tick={{ fill: chartColors.text }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.background,
                    borderColor: chartColors.grid,
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartColors.primary} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="triggers" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.triggerData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="name" 
                  stroke={chartColors.text}
                  tick={{ fill: chartColors.text }}
                />
                <YAxis 
                  stroke={chartColors.text}
                  tick={{ fill: chartColors.text }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.background,
                    borderColor: chartColors.grid,
                  }}
                />
                <Bar dataKey="value" fill={chartColors.primary} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="activities" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.activityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.activityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.background,
                    borderColor: chartColors.grid,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};