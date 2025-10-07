// src/services/api.js
import { getAuthHeader, isAuthenticated } from './auth/auth.helpers';
import { API_BASE_URL } from './auth/auth.constants';

export const api = {
  API_BASE_URL,
  
  async request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Configuração base dos headers
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  // IMPORTANTE: Não adicionar Content-Type para FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    headers,
    ...options,
  };

  // Converte body para JSON apenas se não for FormData
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log(`🌐 Fazendo requisição para: ${url}`, {
      method: config.method,
      headers: config.headers,
      hasBody: !!config.body,
      isFormData: config.body instanceof FormData
    });

    const response = await fetch(url, config);
    
    // ... resto do código permanece igual
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
      try {
        if (data && data.trim().startsWith('{')) {
          data = JSON.parse(data);
        }
      } catch (e) {
        // Mantém como texto
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('⚠️ Token expirado ou inválido');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.dispatchEvent(new Event('authExpired'));
      }
      
      throw new Error(data.message || data.error || `Erro HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Erro na requisição API:', error);
    throw error;
  }
},

  get(endpoint) {
    return this.request(endpoint);
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

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
};