// Server/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add token expiration handling
export const storeData = async (key, value, ttl = 24 * 60 * 60 * 1000) => {
  try {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null;

    const item = JSON.parse(value);
    if (Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error('Storage read error:', e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Storage remove error:', e);
  }
};