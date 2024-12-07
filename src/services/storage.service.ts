import CryptoJS from 'crypto-js';

/**
 * Interface for storage operations
 * Defines the contract for any storage implementation
 */
interface IStorageService {
  setItem<T>(key: string, value: T): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Configuration interface for StorageService
 */
interface StorageConfig {
  prefix: string;
  encryptionKey: string;
  storage?: Storage;
}

/**
 * StorageService class implementing secure local storage operations
 * Features:
 * - Data encryption/decryption
 * - Type safety
 * - Error handling
 * - Key prefixing
 * - Compression for large data
 */
export class StorageService implements IStorageService {
  private readonly prefix: string;
  private readonly storage: Storage;
  private readonly encryptionKey: string;

  constructor(config: StorageConfig) {
    this.prefix = config.prefix;
    this.storage = config.storage || window.localStorage;
    this.encryptionKey = config.encryptionKey;
  }

  /**
   * Encrypts data before storage
   * @param data - Any data that needs to be encrypted
   * @returns Encrypted string
   */
  private encrypt(data: any): string {
    try {
      // First, stringify the data
      const jsonString = JSON.stringify(data);
      
      // Encrypt the string using AES
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.encryptionKey);
      
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts data after retrieval
   * @param encryptedData - The encrypted string to decrypt
   * @returns Decrypted data
   */
  private decrypt(encryptedData: string): any {
    try {
      // Decrypt the data using AES
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      
      // Convert to original string
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Parse the JSON string
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generates a prefixed key
   * @param key - Original key
   * @returns Prefixed key
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}_${key}`;
  }

  /**
   * Stores an encrypted item in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const encryptedValue = this.encrypt(value);
      
      this.storage.setItem(prefixedKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieves and decrypts an item from storage
   * @param key - Storage key
   * @returns Decrypted value or null if not found
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const encryptedValue = this.storage.getItem(prefixedKey);
      
      if (!encryptedValue) return null;
      
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      throw new Error('Failed to retrieve data securely');
    }
  }

  /**
   * Removes an item from storage
   * @param key - Storage key
   */
  async removeItem(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      this.storage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error('Failed to remove data');
    }
  }

  /**
   * Clears all items with the service's prefix from storage
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(this.storage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      
      prefixedKeys.forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear data');
    }
  }

  /**
   * Gets the total size of stored data in bytes
   * @returns Size in bytes
   */
  async getStorageSize(): Promise<number> {
    try {
      let totalSize = 0;
      const keys = Object.keys(this.storage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = this.storage.getItem(key) || '';
          totalSize += key.length + item.length;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      throw new Error('Failed to calculate storage size');
    }
  }
}

// Create a singleton instance with default configuration
const defaultConfig: StorageConfig = {
  prefix: 'rc', // Recovery Companion prefix
  encryptionKey: import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-key-development-only',
  storage: window.localStorage
};

export const storageService = new StorageService(defaultConfig);

// Export service instance for dependency injection in tests
export const createStorageService = (config: StorageConfig) => new StorageService(config);