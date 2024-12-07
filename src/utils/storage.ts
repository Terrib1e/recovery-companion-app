/**
 * Utility class for handling encrypted local storage operations
 * In a production environment, this would implement actual encryption
 */
export class LocalStorage {
  private static readonly prefix = 'rc_'; // Recovery Companion prefix

  /**
   * Encrypts data before storage
   * This is a placeholder for actual encryption implementation
   */
  private static encrypt(data: any): string {
    // In production, implement proper encryption
    return JSON.stringify(data);
  }

  /**
   * Decrypts data after retrieval
   * This is a placeholder for actual decryption implementation
   */
  private static decrypt(data: string): any {
    // In production, implement proper decryption
    return JSON.parse(data);
  }

  /**
   * Stores an item in localStorage with encryption
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const encryptedValue = this.encrypt(value);
      localStorage.setItem(`${this.prefix}${key}`, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieves and decrypts an item from localStorage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = localStorage.getItem(`${this.prefix}${key}`);
      if (!encryptedValue) return null;
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      throw new Error('Failed to retrieve data securely');
    }
  }

  /**
   * Removes an item from localStorage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw new Error('Failed to remove data');
    }
  }

  /**
   * Clears all Recovery Companion data from localStorage
   */
  static async clear(): Promise<void> {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear data');
    }
  }
}