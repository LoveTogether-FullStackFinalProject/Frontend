import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    
   // baseURL: 'http://localhost:3000',
   baseURL: 'http://ve-be.cs.colman.ac.il'
});

export default apiClient;