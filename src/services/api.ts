import axios from "axios";

// Better Auth এর auth endpoints: /api/auth/*
// App API endpoints: /api/*
// উভয়ের জন্য base হল server root
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Better Auth uses cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;