// src/api/services/authService.js
import { apiClient } from "../client";

// Registro
export async function register(payload) {
  const response = await apiClient.post("/api/auth/register", payload);
  return response.data;
}

// Login
export async function login(credentials) {
  const response = await apiClient.post("/api/auth/login", credentials);
  return response.data; // { accessToken, refreshToken, nombre, rol }
}

// Refresh token
export async function refreshToken(refreshToken) {
  const response = await apiClient.post("/api/auth/refresh", { refreshToken });
  return response.data;
}

// Perfil
export async function getProfile() {
  const response = await apiClient.get("/api/auth/me");
  return response.data;
}
