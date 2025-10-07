import { api } from 'http://localhost/back-end/api-php';

export const editarPerfilAsiloService = {
  async buscarPerfil() {
    try {
      const response = await api.get('/api/perfil/asilo');
      return response;
    } catch (error) {
      console.error('Erro ao buscar perfil asilo:', error);
      throw error;
    }
  },

  // Editar dados do cadastro (UPDATE)
  async editarPerfilBasico(dados) {
    try {
      const response = await api.put('/api/perfil/asilo/basico', dados);
      return response;
    } catch (error) {
      console.error('Erro ao editar perfil básico do asilo:', error);
      throw error;
    }
  },

  // Editar perfil detalhado (UPDATE)
  async editarPerfilDetalhes(dados) {
    try {
      const response = await api.put('/api/perfil/asilo/detalhes', dados);
      return response;
    } catch (error) {
      console.error('Erro ao editar perfil detalhado do asilo:', error);
      throw error;
    }
  },

  // Upload de logo do asilo
  async uploadLogo(arquivo) {
    try {
      const formData = new FormData();
      formData.append('logo', arquivo);
      
      const response = await api.post('/api/perfil/asilo/foto', formData, {
        headers: {
          // O Content-Type será automaticamente definido pelo browser para FormData
        },
      });
      
      return response;
    } catch (error) {
      console.error('Erro ao fazer upload do logo do asilo:', error);
      throw error;
    }
  }
};