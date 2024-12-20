// src/config/axiosInstance.js
import axios from 'axios';
import { settings } from './settings.js';

const axiosInstance = axios.create({
  timeout: settings.timeout,
});

export default axiosInstance;
