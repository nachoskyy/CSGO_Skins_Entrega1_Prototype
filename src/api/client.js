// src/api/client.js
import axios from "axios";

// URL del backend. En dev será http://localhost:8080 o similar.
// En producción será la URL de tu backend en EC2.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Aquí más adelante vamos a meter JWT (Authorization: Bearer ...)


const baseURL = import.meta.env.VITE_API_URL;

export const client = {
  get: async (url) => {
    const res = await fetch(baseURL + url);
    return res.json();
  },
  post: async (url, body) => {
    const res = await fetch(baseURL + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};
