import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
};

export const storage = {
  async setItem(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data', error);
    }
  },

  async getItem(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data', error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data', error);
    }
  },

  // Auth specific methods
  setAuthData: async (access: string, refresh: string) => {
    await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
  },

  clearAuthData: async () => {
    await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getAuthData: async () => {
    const access = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refresh = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return { access, refresh };
  },
};