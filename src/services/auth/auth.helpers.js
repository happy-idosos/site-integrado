import { STORAGE_KEYS } from './auth.constants';

// ✅ SALVA DADOS DE AUTENTICAÇÃO (MELHORADO)
export const saveAuthData = (token, userData) => {
  try {
    if (!token || !userData) {
      throw new Error('Token e userData são obrigatórios');
    }
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    
    console.log('✅ Dados de autenticação salvos com sucesso');
  } catch (error) {
    console.error('❌ Erro ao salvar dados de autenticação:', error);
    throw error;
  }
};

// ✅ ALIAS PARA COMPATIBILIDADE (saveAuthData = setAuthData)
export const setAuthData = saveAuthData;

// ✅ RECUPERA O TOKEN DO LOCALSTORAGE
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('❌ Erro ao recuperar token:', error);
    return null;
  }
};

// ✅ RECUPERA OS DADOS DO USUÁRIO (MELHORADO)
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    
    // ✅ VALIDAÇÃO BÁSICA DOS DADOS
    if (!parsedData || typeof parsedData !== 'object') {
      console.warn('⚠️ Dados do usuário inválidos no localStorage');
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.error('❌ Erro ao recuperar dados do usuário:', error);
    return null;
  }
};

// ✅ REMOVE DADOS DE AUTENTICAÇÃO (LOGOUT - MELHORADO)
export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // ✅ LIMPEZA COMPLETA - remove qualquer dado relacionado à auth
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ Dados de autenticação removidos com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar dados de autenticação:', error);
    throw error;
  }
};

// ✅ VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO (MELHORADO)
export const isAuthenticated = () => {
  try {
    const token = getToken();
    
    // ❌ SEM TOKEN = NÃO AUTENTICADO
    if (!token) {
      return false;
    }

    // ✅ VERIFICA EXPIRAÇÃO DO TOKEN JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isTokenValid = payload.exp > Date.now() / 1000;
      
      if (!isTokenValid) {
        console.warn('⚠️ Token expirado, limpando dados...');
        clearAuthData();
        return false;
      }
      
      return true;
    } catch (jwtError) {
      console.warn('⚠️ Token JWT inválido, limpando dados...');
      clearAuthData();
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error);
    return false;
  }
};

// ✅ RETORNA O HEADER DE AUTORIZAÇÃO (MELHORADO)
export const getAuthHeader = () => {
  try {
    const token = getToken();
    
    if (!token) {
      console.warn('⚠️ Tentativa de obter header de auth sem token');
      return {};
    }
    
    // ✅ VERIFICA SE O TOKEN AINDA É VÁLIDO
    if (!isAuthenticated()) {
      console.warn('⚠️ Token inválido ao tentar obter header');
      return {};
    }
    
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('❌ Erro ao obter header de autenticação:', error);
    return {};
  }
};

// ✅ NOVO: ATUALIZA APENAS OS DADOS DO USUÁRIO (MANTÉM O TOKEN)
export const updateUserData = (newUserData) => {
  try {
    const currentToken = getToken();
    
    if (!currentToken) {
      throw new Error('Nenhum token encontrado para atualizar dados do usuário');
    }
    
    if (!newUserData || typeof newUserData !== 'object') {
      throw new Error('Novos dados do usuário são obrigatórios e devem ser um objeto');
    }
    
    saveAuthData(currentToken, newUserData);
    console.log('✅ Dados do usuário atualizados com sucesso');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar dados do usuário:', error);
    throw error;
  }
};

// ✅ NOVO: VERIFICA SE É ASILO OU VOLUNTÁRIO
export const getUserType = () => {
  try {
    const userData = getUserData();
    return userData?.tipo || null; // 'asilo' ou 'usuario'
  } catch (error) {
    console.error('❌ Erro ao obter tipo de usuário:', error);
    return null;
  }
};

// ✅ NOVO: VERIFICA SE O USUÁRIO TEM UMA ROLE ESPECÍFICA
export const hasRole = (role) => {
  try {
    const userData = getUserData();
    return userData?.role === role;
  } catch (error) {
    console.error('❌ Erro ao verificar role do usuário:', error);
    return false;
  }
};

// ✅ NOVO: VALIDAÇÃO COMPLETA DO ESTADO DE AUTENTICAÇÃO
export const validateAuthState = () => {
  const token = getToken();
  const userData = getUserData();
  const authenticated = isAuthenticated();
  
  return {
    hasToken: !!token,
    hasUserData: !!userData,
    isAuthenticated: authenticated,
    userType: getUserType(),
    isValid: authenticated && !!token && !!userData
  };
};