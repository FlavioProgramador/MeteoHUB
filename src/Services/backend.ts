import axios from "axios";

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api",
  withCredentials: true, 
});
