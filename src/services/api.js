// src/services/api.js
import { getAuthHeader } from './auth/auth.helpers';
import { API_BASE_URL } from './auth/auth.constants';

// Interceptor global para todas as requisições API
export const api = {
  API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${this.API_BASE_URL}${endpoint}`;
    
    // Configuração base
    const config = {
      method: 'GET',
      credentials: 'include', // Importante para cookies/sessions
      ...options,
    };

    // Headers - tratamento especial para FormData
    const isFormData = config.body && config.body instanceof FormData;
    
    config.headers = {
      ...getAuthHeader(),
      ...options.headers,
    };

    // Não adiciona Content-Type para FormData (o browser define automaticamente)
    if (config.body && typeof config.body === 'object' && !isFormData) {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(config.body);
    }

    // Remove Content-Type se for FormData para evitar conflito
    if (isFormData && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }

    try {
      console.log(`🔄 API Request: ${config.method} ${url}`, 
        isFormData ? '[FormData]' : config.body
      );
      
      const response = await fetch(url, config);
      
      // Verifica se a resposta tem conteúdo JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Tenta fazer parse se tiver conteúdo, senão retorna objeto vazio
        data = text ? this.safeJsonParse(text) : {};
      }

      console.log(`✅ API Response [${response.status}]:`, data);

      // Tratamento de status HTTP
      if (!response.ok) {
        const errorMessage = data.message || data.error || data.detail || `Erro HTTP: ${response.status}`;
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        
        throw error;
      }

      return data;

    } catch (error) {
      console.error(`❌ Erro na requisição API [${config.method} ${url}]:`, error);
      
      // Melhora a mensagem de erro para o usuário
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Erro de conexão. Verifique sua internet e se o servidor está rodando.');
        networkError.status = 0;
        throw networkError;
      }
      
      // Propaga o erro com informações adicionais
      if (!error.status) {
        error.status = 500;
      }
      
      throw error;
    }
  },

  // Métodos HTTP simplificados
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  },

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  },

  // Upload de arquivos (método especializado)
  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData
      // Note: não definimos Content-Type aqui - o browser faz automaticamente para FormData
    });
  },

  // Helper para parse seguro de JSON
  safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.warn('⚠️ Não foi possível fazer parse JSON, retornando texto:', text);
      return { message: text };
    }
  }
};

// Exportação padrão para compatibilidade
export default api;