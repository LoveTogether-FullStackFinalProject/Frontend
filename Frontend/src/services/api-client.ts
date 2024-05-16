import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    //NEED TO CHANGE TO THE SERVER URL
   // baseURL: 'https://node12.cs.colman.ac.il/',
});

export default apiClient;