// src/api/services/categoriesService.js
import { apiClient } from "../client";

export async function getCategories() {
  const response = await apiClient.get("/api/categorias");
  return response.data;
}

export async function createCategory(categoria) {
  const response = await apiClient.post("/api/categorias", categoria);
  return response.data;
}

export async function updateCategory(id, categoria) {
  const response = await apiClient.put(`/api/categorias/${id}`, categoria);
  return response.data;
}

export async function deleteCategory(id) {
  await apiClient.delete(`/api/categorias/${id}`);
}
