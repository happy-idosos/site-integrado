// src/services/api.js

// 🔐 Helpers de autenticação
import { getAuthHeader, isAuthenticated } from './auth/auth.helpers';
import { API_BASE_URL } from './auth/auth.constants';

// ✅ API unificada e funcional
export const api = {
  API_BASE_URL,

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    // 🔧 Configuração base
    const headers = {
      ...getAuthHeader(),
      ...(options.headers || {}),
    };

    // ⚙️ Define Content-Type somente se não for FormData
    if (options.body && !isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      method: options.method || 'GET',
      credentials: 'include', // Mantém sessões PHP
      headers,
      ...options,
    };

    // 🔄 Converte body para JSON se for objeto comum
    if (config.body && typeof config.body === 'object' && !isFormData) {
      config.body = JSON.stringify(config.body);
    } else if (isFormData) {
      config.body = options.body;
    }

    try {
      console.log(`🌐 Requisição [${config.method}] → ${url}`, {
        headers: config.headers,
        hasBody: !!config.body,
        isFormData,
      });

      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      let data;

      // 🔍 Tenta ler o corpo da resposta
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? this.safeJsonParse(text) : {};
      }

      console.log(`✅ [${response.status}] ${url}`, data);

      // 🚫 Erros HTTP
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('⚠️ Token expirado ou inválido. Limpando autenticação...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.dispatchEvent(new Event('authExpired'));
        }

        const errorMessage =
          data?.message || data?.error || data?.detail || `Erro HTTP: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`❌ Erro em [${options.method || 'GET'}] ${url}:`, error);

      // 🌐 Erro de rede
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error(
          'Erro de conexão. Verifique sua internet e se o servidor backend está rodando.'
        );
        networkError.status = 0;
        throw networkError;
      }

      // 🛑 Garante status definido
      if (!error.status) {
        error.status = 500;
      }

      throw error;
    }
  },

  // 📦 Métodos HTTP simplificados
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', body: formData });
  },

  // 🧠 Utilitário seguro para tentar converter texto em JSON
  safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch {
      console.warn('⚠️ Retornando texto puro (não é JSON):', text);
      return { message: text };
    }
  },
};

export default api;
