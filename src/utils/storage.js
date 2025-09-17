import * as SecureStore from 'expo-secure-store';

// Secure storage for sensitive data like tokens
export const secureStorage = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get error:', error);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('SecureStore set error:', error);
      return false;
    }
  },

  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('SecureStore remove error:', error);
      return false;
    }
  },
};

// Regular async storage for non-sensitive data
export const asyncStorage = {
  getItem: async (key) => {
    try {
      // Using SecureStore for both for consistency
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('AsyncStorage get error:', error);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('AsyncStorage set error:', error);
      return false;
    }
  },

  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('AsyncStorage remove error:', error);
      return false;
    }
  },
};

// Main storage utility that uses appropriate storage method
export const storage = {
  // For auth tokens and sensitive data
  secure: {
    getItem: secureStorage.getItem,
    setItem: secureStorage.setItem,
    removeItem: secureStorage.removeItem,
  },

  // For general app data
  async: {
    getItem: asyncStorage.getItem,
    setItem: asyncStorage.setItem,
    removeItem: asyncStorage.removeItem,
  },

  // Default methods (use secure for safety)
  getItem: secureStorage.getItem,
  setItem: secureStorage.setItem,
  removeItem: secureStorage.removeItem,

  // Helper methods for specific data types
  getObject: async (key) => {
    try {
      const item = await secureStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  },

  setObject: async (key, value) => {
    try {
      await secureStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage setObject error:', error);
      return false;
    }
  },

  // Clear all stored data (use with caution)
  clearAll: async () => {
    try {
      // Note: SecureStore doesn't have a clearAll method,
      // so we need to know what keys to remove
      const keysToRemove = ['authToken', 'userData', 'appSettings'];
      
      for (const key of keysToRemove) {
        await secureStorage.removeItem(key);
      }
      
      return true;
    } catch (error) {
      console.error('Storage clearAll error:', error);
      return false;
    }
  },
};

export default storage;