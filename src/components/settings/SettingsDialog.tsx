import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/contexts/ThemeContext';
import { Download, Settings, Trash2, Upload } from 'lucide-react';

export function SettingsDialog() {
  const { theme, toggleTheme } = useTheme();
  const [showBackupAlert, setShowBackupAlert] = React.useState(false);

  // Function to handle data export
  const handleExportData = () => {
    try {
      const data = localStorage.getItem('rc_progress') || '{}';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recovery-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowBackupAlert(true);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Function to handle data import
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        localStorage.setItem('rc_progress', JSON.stringify(data));
        window.location.reload(); // Refresh to load new data
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex flex-col gap-1.5">
              <span>Dark Theme</span>
              <span className="text-sm font-normal text-muted-foreground">
                Toggle between light and dark mode
              </span>
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Data Management</Label>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportData}
                />
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </div>

          {showBackupAlert && (
            <Alert>
              <AlertDescription>
                Data backup has been downloaded successfully.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}