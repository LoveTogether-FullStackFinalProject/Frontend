import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
   baseURL: 'https://node12.cs.colman.ac.il'
});

export default apiClient;