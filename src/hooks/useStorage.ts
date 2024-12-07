import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/services/storage';

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const stored = await storageService.getItem<T>(key);
        if (stored !== null) {
          setValue(stored);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  // Update storage when value changes
  const updateValue = useCallback(async (newValue: T) => {
    try {
      setLoading(true);
      await storageService.setItem(key, newValue);
      setValue(newValue);
      setError(null);
    } catch (error) {
      console.error('Error updating stored data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Remove item from storage
  const removeItem = useCallback(async () => {
    try {
      setLoading(true);
      await storageService.removeItem(key);
      setValue(initialValue);
      setError(null);
    } catch (error) {
      console.error('Error removing stored data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  return {
    value,
    setValue: updateValue,
    remove: removeItem,
    loading,
    error
  };
}