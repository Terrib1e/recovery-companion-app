import Layout from './components/layout/Layout';
import { AIProvider } from './contexts/AIContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/progress/ProgressContext';
import DailyCheckIn from './components/dashboard/DailyCheckIn';
import ProgressTracker from './components/dashboard/ProgressTracker';
import EmergencySupport from './components/dashboard/EmergencySupport';
import SmartJournal from './components/dashboard/SmartJournal';

function App() {
  return (
    <ThemeProvider>
      <AIProvider>
        <ProgressProvider>
          <Layout>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Recovery Dashboard</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DailyCheckIn />
                <ProgressTracker />
                <SmartJournal />
                <div className="md:col-span-2 lg:col-span-3">
                  <EmergencySupport />
                </div>
              </div>
            </div>
          </Layout>
        </ProgressProvider>
      </AIProvider>
    </ThemeProvider>
  );
}

export default App;