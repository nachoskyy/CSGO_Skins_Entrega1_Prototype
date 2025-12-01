// src/api/services/ordersService.js
import { apiClient } from "../client";

/**
 * PREVIEW DEL CARRITO
 * Se usa si en el futuro quieres calcular impuestos, envíos o validar stock.
 */
export async function previewCart(items) {
  try {
    const response = await apiClient.post("/api/carrito/preview", { items });
    return response.data;
  } catch (err) {
    console.error("Error en previewCart:", err);
    return { status: "ERROR", message: "No se pudo previsualizar el carrito" };
  }
}

/**
 * CREAR ORDEN
 * Envía al backend:
 * - Datos del cliente
 * - Total
 * - { productId, qty }
 *
 * El backend debe:
 * 1. Validar stock real
 * 2. Restar stock del producto
 * 3. Crear la orden
 * 4. Devolver { status: "OK" }
 */
export async function createOrder(orderPayload) {
  try {
    const response = await apiClient.post("/api/ordenes", orderPayload);

    // Normalizar siempre la forma de respuesta
    return {
      status: response.data?.status ?? "OK",
      ...response.data
    };
  } catch (err) {
    console.error("Error creando orden:", err);

    return {
      status: "ERROR",
      message: "No se pudo crear la orden"
    };
  }
}

/**
 * LISTAR ÓRDENES DEL USUARIO AUTENTICADO
 */
export async function getMyOrders() {
  try {
    const response = await apiClient.get("/api/ordenes");
    return response.data;
  } catch (err) {
    console.error("Error obteniendo órdenes:", err);
    return [];
  }
}

/**
 * OBTENER DETALLE DE UNA ORDEN POR ID
 */
export async function getOrderById(id) {
  try {
    const response = await apiClient.get(`/api/ordenes/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error cargando orden:", err);
    return null;
  }
}
