import axios, { CanceledError } from "axios";

export { CanceledError }

const baseURL =
  process.env.NODE_ENV === 'production'
    ? (window.location.hostname === "ve-be.cs.colman.ac.il" ? "https://ve-be.cs.colman.ac.il" : "https://193.106.55.120")
    : window.location.hostname !== "localhost"
      ? `https://${window.location.hostname}`
      : "http://localhost:3000";

      console.log("baseURL is:", baseURL);

const apiClient = axios.create({
   baseURL: baseURL
});

export default apiClient;



