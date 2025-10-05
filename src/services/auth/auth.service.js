import { API_BASE_URL, API_ENDPOINTS } from './auth.constants';
import { saveAuthData, clearAuthData, getAuthHeader } from './auth.helpers';

// Função para fazer requisições HTTP
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erro HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição API:', error);
    throw error;
  }
};

// Serviço de Autenticação COMPLETO
export const authService = {
  // ✅ LOGIN
  async login(email, senha) {
    const data = await fetchAPI(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: { email, senha }
    });

    if (data.status === 200 && data.data) {
      saveAuthData(data.data.token, {
        id: data.data.id,
        nome: data.data.nome,
        email: data.data.email,
        tipo: data.data.tipo,
        role: data.data.tipo
      });
    }

    return data;
  },

  // ✅ CADASTRO USUÁRIO
  async registerUser(userData) {
    const data = await fetchAPI(API_ENDPOINTS.REGISTER_USER, {
      method: 'POST',
      body: userData
    });

    return data;
  },

  // ✅ CADASTRO ASILO
  async registerAsilo(asiloData) {
    const data = await fetchAPI(API_ENDPOINTS.REGISTER_ASILO, {
      method: 'POST',
      body: asiloData
    });

    return data;
  },

  // ✅ RECUPERAÇÃO DE SENHA
  async forgotPassword(email) {
    const data = await fetchAPI(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: { email }
    });

    return data;
  },

  // ✅ VALIDAR TOKEN
  async validateResetToken(token) {
    const data = await fetchAPI(`${API_ENDPOINTS.VALIDATE_TOKEN}?token=${encodeURIComponent(token)}`, {
      method: 'GET'
    });

    return data;
  },

  // ✅ REDEFINIR SENHA
  async resetPassword(token, novaSenha) {
    const data = await fetchAPI(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: { token, novaSenha }
    });

    return data;
  },

  // ✅ LOGOUT
  logout() {
    clearAuthData();
  },

  // ✅ VERIFICAR AUTENTICAÇÃO (nova função)
  checkAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    return {
      isAuthenticated: !!token && !!userData,
      user: userData ? JSON.parse(userData) : null,
      token: token
    };
  }
};

export { fetchAPI };