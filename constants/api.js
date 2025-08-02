// app/constants/api.js
import axios from 'axios';

// Get your local IP with `ipconfig` or `ifconfig` if you're using Expo Go
const API = axios.create({
  baseURL: "http://10.85.178.133:8081", 
});
export default API;
