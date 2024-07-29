import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your server address
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

export default httpClient;