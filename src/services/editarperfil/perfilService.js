// services/editarperfil/perfilService.js
import { API_BASE_URL } from '../auth/auth.constants';
import { getToken } from '../auth/auth.helpers';

export const perfilService = {
  async buscarPerfil() {
    try {
      const token = getToken();
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
      
      // ✅ CORREÇÃO: Garantir URL absoluta para a foto
      if (data.perfil && data.perfil.foto_perfil) {
        if (!data.perfil.foto_perfil.startsWith('http')) {
          data.perfil.foto_url = `${API_BASE_URL}/uploads/perfis/${data.perfil.foto_perfil}`;
        } else {
          data.perfil.foto_url = data.perfil.foto_perfil;
        }
      }
      
      console.log('📡 Resposta buscarPerfil:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      throw error;
    }
  },

  async editarPerfil(dados) {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/perfil/editar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Resposta editarPerfil:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao editar perfil:', error);
      throw error;
    }
  },

  async uploadFoto(arquivo) {
    try {
      console.log('🔄 Upload apenas da foto:', arquivo.name);
      
      const token = getToken();
      const body = new FormData();
      body.append('foto_perfil', arquivo);

      console.log('📤 Enviando FormData para upload...');

      const response = await fetch(`${API_BASE_URL}/api/perfil/foto`, {
        method: 'POST', // ✅ USAR POST PARA UPLOAD
        headers: {
          'Authorization': `Bearer ${token}`
          // ❌ NÃO definir Content-Type - o browser faz automaticamente para FormData
        },
        body: body
      });

      console.log('📡 Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', response.status, errorText);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Resposta uploadFoto:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao fazer upload da foto:', error);
      throw error;
    }
  },

  // ✅ MÉTODO ALTERNATIVO: Usar a rota de editar perfil com dados
  async uploadFotoComDados(arquivo) {
    try {
      console.log('🔄 Upload usando rota de editar perfil:', arquivo.name);
      
      const token = getToken();
      const userData = JSON.parse(localStorage.getItem('user_data'));
      
      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }

      const body = new FormData();
      body.append('foto_perfil', arquivo);
      body.append('nome', userData.nome);
      body.append('email', userData.email);

      console.log('📤 Enviando para rota /api/perfil/editar...');

      const response = await fetch(`${API_BASE_URL}/api/perfil/editar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: body
      });

      console.log('📡 Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', response.status, errorText);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Resposta uploadFotoComDados:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro no upload com dados:', error);
      throw error;
    }
  }
};