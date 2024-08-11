import axios, { CanceledError } from "axios";

export { CanceledError }

const baseURL =
  process.env.NODE_ENV === 'production'
    ? (window.location.hostname === "node12.cs.colman.ac.il" ? "https://node12.cs.colman.ac.il" : "https://193.106.55.172")
    : window.location.hostname !== "localhost"
      ? `https://${window.location.hostname}`
      : "http://localhost:3000";

const apiClient = axios.create({
   baseURL: baseURL
});

export default apiClient;
