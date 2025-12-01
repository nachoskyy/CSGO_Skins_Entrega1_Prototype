import axios from "axios";

const API_BASE = "http://localhost:8080/api/ordenes";

export const OrdersAPI = {

  // CREAR ORDEN
  createOrder: async (orden) => {
    const res = await axios.post(API_BASE, orden);
    return res.data;
  },

  // LISTAR ORDENES
  getOrders: async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  }
};
