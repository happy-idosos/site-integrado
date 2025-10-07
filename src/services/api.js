// src/services/api.js

// ✅ Se tiver helper para tokens, descomente a linha abaixo:
// import { getAuthHeader } from '../auth/auth.helpers';

// ✅ URL base da API (ajuste conforme seu ambiente local ou remoto)
const API_BASE_URL = "http://localhost/back-end/api-php";

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    // 🔧 Configuração base
    const config = {
      method: options.method || "GET",
      credentials: "include", // importante para sessões PHP
      headers: {
        // ...getAuthHeader(), // se usar tokens, reative esta linha
        ...(options.headers || {}),
      },
    };

    // 🔧 Body e Content-Type
    if (options.body && !isFormData) {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(options.body);
    } else if (isFormData) {
      config.body = options.body;
      // Não adiciona Content-Type: o browser define automaticamente
    }

    try {
      console.log(`🔄 [${config.method}] ${url}`, isFormData ? "[FormData]" : config.body || "");

      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? this.safeJsonParse(text) : {};
      }

      console.log(`✅ [${response.status}] ${url}`, data);

      if (!response.ok) {
        const errorMessage =
          data?.message || data?.error || data?.detail || `Erro HTTP: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`❌ Erro em [${options.method || "GET"}] ${url}:`, error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        const networkError = new Error(
          "Erro de conexão. Verifique sua internet e se o servidor backend está rodando."
        );
        networkError.status = 0;
        throw networkError;
      }

      if (!error.status) {
        error.status = 500;
      }

      throw error;
    }
  },

  // 🧩 Métodos HTTP simplificados
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: "POST", body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: "PUT", body });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: "PATCH", body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: "POST", body: formData });
  },

  safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch {
      console.warn("⚠️ Retornando texto puro (não é JSON):", text);
      return { message: text };
    }
  },
};

export default api;
