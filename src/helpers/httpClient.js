import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your server address
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add any other headers you need
  },
});

export default httpClient;