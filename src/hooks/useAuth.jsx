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

  // ✅ CARREGAR ESTADO INICIAL DA AUTENTICAÇÃO - MELHORADO
  const loadAuthState = useCallback(async () => {
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
        // ✅ VERIFICAR SE TEM FOTO NO LOCALSTORAGE
        let userWithPhoto = {
          ...userData,
          foto_url: userData.foto_url || userData.logo_url || null
        };

        // ✅ SE NÃO TEM FOTO OU FOTO PODE ESTAR DESATUALIZADA, TENTAR BUSCAR PERFIL COMPLETO
        if ((!userWithPhoto.foto_url || !userWithPhoto.foto_perfil) && token) {
          try {
            console.log('🔄 Buscando perfil completo para carregar foto atualizada...');
            const perfilCompleto = await authService.buscarPerfilCompleto();
            
            if (perfilCompleto.perfil) {
              const fotoUrl = perfilCompleto.perfil.foto_url || 
                            (perfilCompleto.perfil.foto_perfil ? 
                             `${process.env.API_BASE_URL || ''}/uploads/perfis/${perfilCompleto.perfil.foto_perfil}` : 
                             null);
              
              userWithPhoto = {
                ...userWithPhoto,
                foto_url: fotoUrl,
                logo_url: fotoUrl,
                foto_perfil: perfilCompleto.perfil.foto_perfil // ✅ MANTER REFERÊNCIA DA FOTO
              };

              // ✅ ATUALIZAR LOCALSTORAGE COM FOTO ATUALIZADA
              saveAuthData(token, userWithPhoto);
              console.log('✅ Foto atualizada carregada do perfil completo:', fotoUrl);
            }
          } catch (error) {
            console.warn('⚠️ Não foi possível carregar perfil completo:', error);
          }
        }
        
        setUser(userWithPhoto);
        setIsAuthenticated(true);
        console.log('✅ Usuário carregado com foto:', userWithPhoto.foto_url);
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

  // ✅ LOGIN MELHORADO - SEMPRE BUSCAR PERFIL ATUALIZADO
  const login = useCallback(async (email, senha) => {
    try {
      setLoading(true);
      console.log('🔐 Tentando login para:', email);

      const result = await authService.login(email, senha);
      
      if (result.status === 200 && result.data) {
        console.log('✅ Login bem-sucedido:', result.data);
        
        // ✅ FORÇAR RECARREGAMENTO DO ESTADO APÓS LOGIN
        await loadAuthState();
        
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
  }, [loadAuthState]);

  // ✅ ATUALIZAR FOTO DO PERFIL - MELHORADA
  const updateUserPhoto = useCallback((photoUrl, fotoPerfil = null) => {
    if (!user) {
      console.error('❌ Nenhum usuário logado para atualizar foto');
      return;
    }

    try {
      console.log('🔄 Atualizando foto do usuário:', photoUrl);
      
      // ✅ ATUALIZAR ESTADO DO USUÁRIO
      const updatedUser = {
        ...user,
        foto_url: photoUrl,
        logo_url: photoUrl, // Para compatibilidade com asilos
        foto_perfil: fotoPerfil || user.foto_perfil // ✅ MANTER REFERÊNCIA DA FOTO
      };
      
      setUser(updatedUser);

      // ✅ ATUALIZAR NO LOCALSTORAGE
      const token = getToken();
      if (token) {
        saveAuthData(token, updatedUser);
        console.log('✅ Foto atualizada no localStorage');
      }

      console.log('✅ Foto do usuário atualizada com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar foto do usuário:', error);
    }
  }, [user]);

  // ✅ ATUALIZAR DADOS DO USUÁRIO - MELHORADA
  const updateUser = useCallback((newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);

    // ✅ SINCRONIZAR COM LOCALSTORAGE
    const token = getToken();
    if (token) {
      saveAuthData(token, updatedUser);
    }
  }, [user]);

  // ✅ OBTER URL DA FOTO DO USUÁRIO - CONVENIÊNCIA
  const getUserPhoto = useCallback(() => {
    return user?.foto_url || user?.logo_url || null;
  }, [user]);

  // ✅ OBTER INICIAIS DO NOME - PARA FALLBACK
  const getUserInitials = useCallback(() => {
    if (!user?.nome) return 'U';
    
    return user.nome
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [user]);

  // ✅ OBTER COR DO AVATAR BASEADA NO TIPO DE USUÁRIO
  const getAvatarColor = useCallback(() => {
    switch (user?.tipo) {
      case 'usuario':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'asilo':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      default:
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
  }, [user?.tipo]);

  // ✅ CADASTRO DE USUÁRIO - AGORA COM SUPORTE A FOTO
  const registerUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Registrando usuário:', userData);

      const result = await authService.registerUser(userData);
      
      if (result.status === 201) {
        console.log('✅ Usuário registrado com sucesso');
        
        // ✅ SE O REGISTRO INCLUIR LOGIN AUTOMÁTICO, SALVAR FOTO
        if (result.data?.token) {
          saveAuthData(result.data.token, {
            id: result.data.id,
            nome: result.data.nome,
            email: result.data.email,
            tipo: result.data.tipo,
            role: result.data.tipo,
            foto_url: result.data.foto_url || null,
            logo_url: result.data.logo_url || null
          });

          setUser({
            id: result.data.id,
            nome: result.data.nome,
            email: result.data.email,
            tipo: result.data.tipo,
            role: result.data.tipo,
            foto_url: result.data.foto_url || null,
            logo_url: result.data.logo_url || null
          });
          setIsAuthenticated(true);
        }
        
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

  // ✅ CADASTRO DE ASILO - AGORA COM SUPORTE A LOGO
  const registerAsilo = useCallback(async (asiloData) => {
    try {
      setLoading(true);
      console.log('📝 Registrando asilo:', asiloData);

      const result = await authService.registerAsilo(asiloData);
      
      if (result.status === 201) {
        console.log('✅ Asilo registrado com sucesso');
        
        // ✅ SE O REGISTRO INCLUIR LOGIN AUTOMÁTICO, SALVAR LOGO
        if (result.data?.token) {
          saveAuthData(result.data.token, {
            id: result.data.id,
            nome: result.data.nome,
            email: result.data.email,
            tipo: result.data.tipo,
            role: result.data.tipo,
            logo_url: result.data.logo_url || null,
            foto_url: result.data.logo_url || null // Para compatibilidade
          });

          setUser({
            id: result.data.id,
            nome: result.data.nome,
            email: result.data.email,
            tipo: result.data.tipo,
            role: result.data.tipo,
            logo_url: result.data.logo_url || null,
            foto_url: result.data.logo_url || null
          });
          setIsAuthenticated(true);
        }
        
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

  // ✅ VALIDAR TOKEN DE REDEFINIÇÃO
  const validateResetToken = useCallback(async (token) => {
    try {
      setLoading(true);
      console.log('🔐 Validando token de recuperação');

      const result = await authService.validateResetToken(token);
      
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

  // ✅ REDEFINIR SENHA
  const resetPassword = useCallback(async (token, novaSenha) => {
    try {
      setLoading(true);
      console.log('🔐 Redefinindo senha');

      const result = await authService.resetPassword(token, novaSenha);
      
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

  // ✅ RECARREGAR ESTADO DE AUTENTICAÇÃO - MELHORADA
  const reloadAuth = useCallback(async () => {
    await loadAuthState();
  }, [loadAuthState]);

  // ✅ VALUE DO CONTEXTO COMPLETO - AGORA COM FOTO
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
    userPhoto: getUserPhoto(), // ✅ URL da foto
    
    // Utilitários para avatar
    getUserInitials,
    getAvatarColor,
    
    // Ações de Autenticação
    login,
    registerUser,
    registerAsilo,
    logout,
    
    // Ações de Recuperação de Senha
    forgotPassword,
    validateResetToken,
    resetPassword,
    
    // ✅ AÇÕES PARA FOTO
    updateUserPhoto,
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