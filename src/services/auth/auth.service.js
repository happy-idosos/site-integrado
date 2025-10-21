import { API_BASE_URL, API_ENDPOINTS } from './auth.constants';
import { saveAuthData, clearAuthData, getAuthHeader, getToken } from './auth.helpers';

// ✅ FUNÇÃO DE REQUISIÇÃO HTTP CORRIGIDA - LIDA COM HTML E JSON
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
    console.log(`🌐 Fazendo requisição para: ${url}`, config);
    
    const response = await fetch(url, config);
    
    // ✅ VERIFICA SE A RESPOSTA É JSON ANTES DE TENTAR PARSER
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // ❌ SE NÃO FOR JSON, TENTA LER COMO TEXTO E IDENTIFICAR O ERRO
      const textResponse = await response.text();
      console.warn('⚠️ Resposta não-JSON do servidor:', textResponse.substring(0, 500));
      
      // SE A RESPOSTA FOR SUCESSO MAS SEM CONTEÚDO
      if (response.ok && (!textResponse || textResponse.trim() === '')) {
        data = { 
          status: response.status, 
          success: true, 
          message: 'Operação realizada com sucesso' 
        };
      } 
      // SE HOUVER ERRO NO SERVIDOR (PÁGINA HTML DE ERRO)
      else if (!response.ok) {
        // TENTA EXTRAIR MENSAGEM DE ERRO DO HTML
        const errorMatch = textResponse.match(/<b>(.*?)<\/b>|error:(.*?)(?=<br|$)/i);
        const errorMessage = errorMatch ? 
          (errorMatch[1] || errorMatch[2] || 'Erro no servidor').trim() : 
          `Erro ${response.status}: Servidor retornou HTML`;
        
        throw new Error(errorMessage);
      }
      // RESPOSTA INESPERADA MAS COM SUCESSO
      else {
        data = { 
          status: response.status, 
          success: true, 
          message: 'Operação realizada',
          rawResponse: textResponse.substring(0, 200) 
        };
      }
    }

    // ✅ VERIFICA SE HOUVE ERRO HTTP
    if (!response.ok) {
      const errorMessage = data.message || data.error || `Erro HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log(`✅ Resposta da API:`, data);
    return data;

  } catch (error) {
    console.error('❌ Erro na requisição API:', error);
    
    // ✅ MELHORA MENSAGENS DE ERRO PARA O USUÁRIO
    if (error.message.includes('Unexpected token') || error.message.includes('JSON')) {
      throw new Error('Erro de comunicação com o servidor. Tente novamente.');
    }
    
    throw error;
  }
};

// ✅ FUNÇÃO PARA BUSCAR PERFIL COMPLETO APÓS LOGIN
const buscarPerfilCompleto = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token não disponível');
    }

    console.log('🔄 Buscando perfil completo após login...');
    
    const response = await fetch(`${API_BASE_URL}/api/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Perfil completo carregado:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil completo:', error);
    throw error;
  }
};

// ✅ SERVIÇO DE AUTENTICAÇÃO CORRIGIDO
export const authService = {
  // ✅ LOGIN - AGORA BUSCA PERFIL COMPLETO
  async login(email, senha) {
    const data = await fetchAPI(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: { email, senha }
    });

    if (data.status === 200 && data.data && data.data.token) {
      console.log('✅ Login bem-sucedido, buscando perfil completo...');
      
      try {
        // ✅ BUSCAR PERFIL COMPLETO APÓS LOGIN
        const perfilCompleto = await buscarPerfilCompleto();
        
        // ✅ MESCLAR DADOS DO LOGIN COM DADOS DO PERFIL COMPLETO
        const userDataCompleto = {
          id: data.data.id,
          nome: data.data.nome,
          email: data.data.email,
          tipo: data.data.tipo,
          role: data.data.tipo,
          // ✅ USAR FOTO DO PERFIL COMPLETO (SE DISPONÍVEL)
          foto_url: perfilCompleto.perfil?.foto_url || 
                   perfilCompleto.perfil?.foto_perfil ? 
                   `${API_BASE_URL}/uploads/perfis/${perfilCompleto.perfil.foto_perfil}` : 
                   data.data.foto_url || null,
          logo_url: perfilCompleto.perfil?.logo_url || 
                   perfilCompleto.perfil?.foto_perfil ? 
                   `${API_BASE_URL}/uploads/perfis/${perfilCompleto.perfil.foto_perfil}` : 
                   data.data.logo_url || null
        };

        console.log('✅ Dados completos do usuário:', userDataCompleto);
        
        // ✅ SALVAR DADOS COMPLETOS NO LOCALSTORAGE
        saveAuthData(data.data.token, userDataCompleto);
        
      } catch (error) {
        console.warn('⚠️ Não foi possível carregar perfil completo, usando dados básicos:', error);
        // ✅ FALLBACK: SALVAR APENAS DADOS BÁSICOS SE PERFIL FALHAR
        saveAuthData(data.data.token, {
          id: data.data.id,
          nome: data.data.nome,
          email: data.data.email,
          tipo: data.data.tipo,
          role: data.data.tipo,
          foto_url: data.data.foto_url || null,
          logo_url: data.data.logo_url || null
        });
      }
    }

    return data;
  },

  // ✅ CADASTRO USUÁRIO
  async registerUser(userData) {
    return await fetchAPI(API_ENDPOINTS.REGISTER_USER, {
      method: 'POST',
      body: userData
    });
  },

  // ✅ CADASTRO ASILO
  async registerAsilo(asiloData) {
    return await fetchAPI(API_ENDPOINTS.REGISTER_ASILO, {
      method: 'POST',
      body: asiloData
    });
  },

  // ✅ RECUPERAÇÃO DE SENHA - CORRIGIDO
  async forgotPassword(email) {
    return await fetchAPI(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: { email }
    });
  },

  // ✅ VALIDAR TOKEN - CORRIGIDO
  async validateResetToken(token) {
    return await fetchAPI(`${API_ENDPOINTS.VALIDATE_TOKEN}?token=${encodeURIComponent(token)}`, {
      method: 'GET'
    });
  },

  // ✅ REDEFINIR SENHA - CORRIGIDO (ENVIA TOKEN NO BODY)
  async resetPassword(token, novaSenha) {
    return await fetchAPI(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: { 
        token: token, // ✅ GARANTE QUE TOKEN VAI NO BODY
        novaSenha: novaSenha 
      }
    });
  },

  // ✅ LOGOUT
  logout() {
    clearAuthData();
  },

  // ✅ VERIFICAR AUTENTICAÇÃO
  checkAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    return {
      isAuthenticated: !!token && !!userData,
      user: userData ? JSON.parse(userData) : null,
      token: token
    };
  },

  // ✅ NOVO: BUSCAR PERFIL COMPLETO (PARA USO EXTERNO)
  async buscarPerfilCompleto() {
    return await buscarPerfilCompleto();
  }
};

export { fetchAPI };