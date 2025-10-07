import api from '../api';

export const editarPerfilVoluntarioService = {
  async buscarPerfil() {
    try {
      console.log('🔄 Buscando perfil do voluntário...');
      const response = await api.get('/perfil/voluntario');
      console.log('✅ Perfil carregado:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil voluntário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao carregar perfil');
    }
  },

  // Editar dados do cadastro (UPDATE)
  async editarPerfilBasico(dados) {
    try {
      console.log('🔄 Editando perfil básico:', dados);
      const response = await api.put('/perfil/voluntario/basico', dados);
      console.log('✅ Perfil básico atualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao editar perfil básico:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil básico');
    }
  },

  // Editar perfil voluntário (campos específicos)
  async editarPerfilVoluntario(dados) {
    try {
      console.log('🔄 Editando perfil voluntário:', dados);
      const response = await api.put('/perfil/voluntario/detalhes', dados);
      console.log('✅ Perfil voluntário atualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao editar perfil voluntário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil voluntário');
    }
  },

  // Upload de foto de perfil
  async uploadFotoPerfil(arquivo) {
    try {
      console.log('🔄 Fazendo upload da foto:', arquivo.name);
      const formData = new FormData();
      formData.append('foto_perfil', arquivo);
      
      const response = await api.post('/perfil/voluntario/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Foto atualizada:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao fazer upload da foto:', error);
      throw new Error(error.response?.data?.message || 'Erro ao fazer upload da foto');
    }
  }
};