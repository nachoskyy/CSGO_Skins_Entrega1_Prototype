// src/api/services/productsService.js
import { apiClient } from "../client";

// GET /api/productos
export async function getProducts(params = {}) {
  const response = await apiClient.get("/api/productos", { params });
  return response.data;
}

// GET /api/productos/{id}
export async function getProductById(id) {
  const response = await apiClient.get(`/api/productos/${id}`);
  return response.data;
}

// POST /api/productos  (solo ADMIN)
export async function createProduct(product) {
  const response = await apiClient.post("/api/productos", product);
  return response.data;
}

// PUT /api/productos/{id}  (solo ADMIN)
export async function updateProduct(id, product) {
  const response = await apiClient.put(`/api/productos/${id}`, product);
  return response.data;
}

// DELETE /api/productos/{id}  (solo ADMIN)
export async function deleteProduct(id) {
  await apiClient.delete(`/api/productos/${id}`);
}
