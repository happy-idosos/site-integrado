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

  // Se tiver body, converte para JSON
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

// Serviço de Autenticação
export const authService = {
  // Login de usuário ou asilo
  async login(email, senha) {
    const data = await fetchAPI(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: { email, senha }
    });

    // Se login foi bem sucedido, salva os dados
    if (data.status === 200 && data.data) {
      saveAuthData(data.data.token, {
        id: data.data.id,
        nome: data.data.nome,
        email: data.data.email,
        tipo: data.data.tipo
      });
    }

    return data;
  },

  // Cadastro de usuário (voluntário)
  async registerUser(userData) {
    const data = await fetchAPI(API_ENDPOINTS.REGISTER_USER, {
      method: 'POST',
      body: userData
    });

    return data;
  },

  // Cadastro de asilo
  async registerAsilo(asiloData) {
    const data = await fetchAPI(API_ENDPOINTS.REGISTER_ASILO, {
      method: 'POST',
      body: asiloData
    });

    return data;
  },

  // Esqueci minha senha
  async forgotPassword(email) {
    const data = await fetchAPI(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: { email }
    });

    return data;
  },

  // Redefinir senha
  async resetPassword(token, novaSenha) {
    const data = await fetchAPI(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: { token, novaSenha }
    });

    return data;
  },

  // Logout
  logout() {
    clearAuthData();
  }
};

// Exporta a função fetchAPI para uso em outros serviços
export { fetchAPI };