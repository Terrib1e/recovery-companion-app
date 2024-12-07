import { encrypt, decrypt } from './encryption';

const STORAGE_PREFIX = 'rc_';

export interface StorageData {
  checkIns: any[];
  journalEntries: any[];
  progress: any;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacyMode: boolean;
  };
  lastUpdated: string;
}

class StorageService {
  /**
   * Store data with encryption
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const encryptedValue = await encrypt(JSON.stringify({
        data: value,
        timestamp: new Date().toISOString()
      }));
      localStorage.setItem(STORAGE_PREFIX + key, encryptedValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieve and decrypt data
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = localStorage.getItem(STORAGE_PREFIX + key);
      if (!encryptedValue) return null;

      const decrypted = await decrypt(encryptedValue);
      const parsed = JSON.parse(decrypted);
      return parsed.data;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw new Error('Failed to retrieve data securely');
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw new Error('Failed to remove data');
    }
  }

  /**
   * Export all data
   */
  async exportData(): Promise<string> {
    const data: StorageData = {
      checkIns: await this.getItem('checkIns') || [],
      journalEntries: await this.getItem('journalEntries') || [],
      progress: await this.getItem('progress') || {},
      settings: await this.getItem('settings') || {
        theme: 'light',
        notifications: true,
        privacyMode: false
      },
      lastUpdated: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from backup
   */
  async importData(jsonData: string): Promise<void> {
    try {
      const data: StorageData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.checkIns || !data.journalEntries || !data.settings) {
        throw new Error('Invalid data format');
      }

      // Store each section
      await this.setItem('checkIns', data.checkIns);
      await this.setItem('journalEntries', data.journalEntries);
      await this.setItem('progress', data.progress);
      await this.setItem('settings', data.settings);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  /**
   * Clear all application data
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<{ used: number; total: number }> {
    const used = Object.entries(localStorage)
      .filter(([key]) => key.startsWith(STORAGE_PREFIX))
      .reduce((total, [_, value]) => total + (value.length * 2), 0);

    return {
      used,
      total: localStorage.quota || 5 * 1024 * 1024 // Default to 5MB if quota is undefined
    };
  }
}

export const storageService = new StorageService();