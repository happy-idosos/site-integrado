import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/auth.service';
import { 
  saveAuthData, 
  clearAuthData, 
  getToken, 
  getUserData, 
  isAuthenticated as checkAuth 
} from '../services/auth/auth.helpers';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ CARREGAR ESTADO INICIAL DA AUTENTICAÇÃO
  const loadAuthState = useCallback(() => {
    try {
      const token = getToken();
      const userData = getUserData();
      const authenticated = checkAuth();

      console.log('🔐 Carregando estado de auth:', { 
        token: !!token, 
        userData: !!userData, 
        authenticated 
      });

      if (authenticated && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearAuthData();
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estado de auth:', error);
      setUser(null);
      setIsAuthenticated(false);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ INICIALIZAR AO MONTAR O COMPONENTE
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  // ✅ LOGIN MELHORADO
  const login = useCallback(async (email, senha) => {
    try {
      setLoading(true);
      console.log('🔐 Tentando login para:', email);

      const result = await authService.login(email, senha);
      
      if (result.status === 200 && result.data) {
        console.log('✅ Login bem-sucedido:', result.data);
        
        // Salva os dados de autenticação
        saveAuthData(result.data.token, {
          id: result.data.id,
          nome: result.data.nome,
          email: result.data.email,
          tipo: result.data.tipo,
          role: result.data.tipo // Para compatibilidade
        });

        // Atualiza o estado
        setUser({
          id: result.data.id,
          nome: result.data.nome,
          email: result.data.email,
          tipo: result.data.tipo,
          role: result.data.tipo
        });
        setIsAuthenticated(true);

        return { success: true, data: result.data };
      } else {
        console.error('❌ Login falhou:', result.message);
        return { 
          success: false, 
          error: result.message || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CADASTRO DE USUÁRIO
  const registerUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Registrando usuário:', userData);

      const result = await authService.registerUser(userData);
      
      if (result.status === 201) {
        console.log('✅ Usuário registrado com sucesso');
        return { success: true, data: result.data };
      } else {
        console.error('❌ Registro falhou:', result.message);
        return { 
          success: false, 
          error: result.message || 'Erro ao registrar usuário' 
        };
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CADASTRO DE ASILO
  const registerAsilo = useCallback(async (asiloData) => {
    try {
      setLoading(true);
      console.log('📝 Registrando asilo:', asiloData);

      const result = await authService.registerAsilo(asiloData);
      
      if (result.status === 201) {
        console.log('✅ Asilo registrado com sucesso');
        return { success: true, data: result.data };
      } else {
        console.error('❌ Registro de asilo falhou:', result.message);
        return { 
          success: false, 
          error: result.message || 'Erro ao registrar asilo' 
        };
      }
    } catch (error) {
      console.error('❌ Erro no registro de asilo:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ SOLICITAR RECUPERAÇÃO DE SENHA
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      console.log('🔐 Solicitando recuperação de senha para:', email);

      const result = await authService.forgotPassword(email);
      
      if (result.status === 200) {
        console.log('✅ Email de recuperação enviado com sucesso');
        return { success: true, data: result };
      } else {
        console.error('❌ Falha ao solicitar recuperação:', result.message);
        return { 
          success: false, 
          error: result.message || 'Erro ao solicitar recuperação de senha' 
        };
      }
    } catch (error) {
      console.error('❌ Erro na recuperação de senha:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ VALIDAR TOKEN DE REDEFINIÇÃO - CORRIGIDA
  const validateResetToken = useCallback(async (token) => {
    try {
      setLoading(true);
      console.log('🔐 Validando token de recuperação');

      const result = await authService.validateResetToken(token);
      
      // ✅ VERIFICAÇÃO CORRIGIDA
      if (result.success || result.status === 200) {
        console.log('✅ Token válido');
        return { success: true, data: result };
      } else {
        console.error('❌ Token inválido:', result.message);
        return { 
          success: false, 
          error: result.message || result.error || 'Token inválido ou expirado' 
        };
      }
    } catch (error) {
      console.error('❌ Erro na validação do token:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de validação do token' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ REDEFINIR SENHA - CORRIGIDA
  const resetPassword = useCallback(async (token, novaSenha) => {
    try {
      setLoading(true);
      console.log('🔐 Redefinindo senha');

      const result = await authService.resetPassword(token, novaSenha);
      
      // ✅ VERIFICAÇÃO CORRIGIDA - USA result.success EM VEZ DE result.status
      if (result.success || result.status === 200) {
        console.log('✅ Senha redefinida com sucesso');
        return { success: true, data: result };
      } else {
        console.error('❌ Falha ao redefinir senha:', result.message);
        return { 
          success: false, 
          error: result.message || result.error || 'Erro ao redefinir senha' 
        };
      }
    } catch (error) {
      console.error('❌ Erro ao redefinir senha:', error);
      return { 
        success: false, 
        error: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGOUT MELHORADO
  const logout = useCallback(() => {
    console.log('🚪 Efetuando logout...');
    
    // Limpa dados do localStorage
    clearAuthData();
    
    // Limpa estado
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('✅ Logout realizado com sucesso');
  }, []);

  // ✅ ATUALIZAR DADOS DO USUÁRIO
  const updateUser = useCallback((newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  }, []);

  // ✅ RECARREGAR ESTADO DE AUTENTICAÇÃO
  const reloadAuth = useCallback(() => {
    loadAuthState();
  }, [loadAuthState]);

  // ✅ VALUE DO CONTEXTO COMPLETO
  const value = {
    // Estado
    user,
    loading,
    isAuthenticated,
    
    // Dados do usuário (conveniência)
    userName: user?.nome || user?.email?.split('@')[0] || 'Usuário',
    userType: user?.tipo, // 'usuario' ou 'asilo'
    userRole: user?.role,
    userId: user?.id,
    
    // Ações de Autenticação
    login,
    registerUser,
    registerAsilo,
    logout,
    
    // Ações de Recuperação de Senha
    forgotPassword,
    validateResetToken,
    resetPassword,
    
    // Ações de Gerenciamento de Estado
    updateUser,
    reloadAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};