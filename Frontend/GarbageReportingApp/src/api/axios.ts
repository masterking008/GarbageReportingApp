import axios from 'axios';

// Define the global base URL (IP)
export const API = axios.create({
  baseURL: 'http://10.51.29.56:8000', // Replace with your global IP
  timeout: 5000, // Optional: Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Example of adding interceptors (optional)
// API.interceptors.request.use(
//   (config) => {
//     // You can add headers or modify the config before the request is sent
//     console.log('Request:', config);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// API.interceptors.response.use(
//   (response) => {
//     // Handle the response
//     console.log('Response:', response);
//     return response;
//   },
//   (error) => {
//     // Handle errors globally
//     console.error('Error:', error);
//     return Promise.reject(error);
//   }
// );
