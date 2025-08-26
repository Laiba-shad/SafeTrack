import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL 
});
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('Token expired or invalid');
    }
    return Promise.reject(error);
  }
);
export default API;