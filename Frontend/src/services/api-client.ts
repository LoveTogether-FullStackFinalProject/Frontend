import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    
   // baseURL: 'http://localhost:3000',
   baseURL: 'https://node12.cs.colman.ac.il'
});

export default apiClient;