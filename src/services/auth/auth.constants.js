// URL base da sua API PHP
export const API_BASE_URL = 'http://localhost/api-php';

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  LOGIN: '/api/login',
  REGISTER_USER: '/api/cadastro/usuario',
  REGISTER_ASILO: '/api/cadastro/asilo',
  FORGOT_PASSWORD: '/api/esqueceu-senha',
  RESET_PASSWORD: '/api/reset-senha',
  VALIDATE_TOKEN: '/api/reset-senha',
  
  // Perfis (se tiver)
  PROFILE_USER: '/api/perfil/usuario',
  PROFILE_ASILO: '/api/perfil/asilo'
};

// Chaves para armazenamento local
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_TYPE: 'user_type'
};

// Tipos de usuário
export const USER_TYPES = {
  USUARIO: 'usuario',
  ASILO: 'asilo'
};