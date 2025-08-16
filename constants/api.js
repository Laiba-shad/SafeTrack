// constants/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: "http://192.168.43.38:8081/api/v1", 
});

export default API;
