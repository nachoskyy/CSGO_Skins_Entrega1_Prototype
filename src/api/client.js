import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false
});

// ======================================================
//  1) INTERCEPTOR → Agregar token automáticamente
// ======================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
//  2) INTERCEPTOR → Manejar 401 / 403
// ======================================================
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Token expirado o inválido
    if ((error.response?.status === 401 || error.response?.status === 403)) {
      alert("No autorizado. Inicia sesión nuevamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("nombre");
      localStorage.removeItem("email");
      localStorage.removeItem("user");

      window.location.href = "/Auth";
      return;
    }

    return Promise.reject(error);
  }
);
