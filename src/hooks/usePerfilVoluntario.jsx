import { useState, useEffect } from 'react';
import { editarPerfilVoluntarioService } from '../services/editarperfil/editarPerfilVoluntario.service.js';

export const usePerfilVoluntario = () => {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarPerfil = async () => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Buscando perfil do voluntário...');
      
      const response = await editarPerfilVoluntarioService.buscarPerfil();
      
      if (response.data.status === 200) {
        setPerfil(response.data.data);
        console.log('✅ Perfil voluntário carregado:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao carregar perfil do voluntário');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil voluntário:', error);
      setErro(error.message);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const editarPerfilBasico = async (dados) => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Editando perfil básico do voluntário:', dados);
      
      const response = await editarPerfilVoluntarioService.editarPerfilBasico(dados);
      
      if (response.data.status === 200) {
        setPerfil(prev => ({
          ...prev,
          ...response.data.data
        }));
        console.log('✅ Perfil básico do voluntário atualizado:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar perfil básico do voluntário');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao editar perfil básico do voluntário:', error);
      setErro(error.message);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const editarPerfilVoluntario = async (dados) => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Editando perfil específico do voluntário:', dados);
      
      const response = await editarPerfilVoluntarioService.editarPerfilVoluntario(dados);
      
      if (response.data.status === 200) {
        setPerfil(prev => ({
          ...prev,
          ...response.data.data
        }));
        console.log('✅ Perfil específico do voluntário atualizado:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar perfil específico do voluntário');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao editar perfil específico do voluntário:', error);
      setErro(error.message);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const uploadFoto = async (arquivo) => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Fazendo upload da foto do voluntário:', arquivo.name);
      
      const response = await editarPerfilVoluntarioService.uploadFotoPerfil(arquivo);
      
      if (response.data.status === 200 && response.data.data) {
        setPerfil(prev => ({
          ...prev,
          foto_perfil: response.data.data.foto_perfil
        }));
        console.log('✅ Foto do voluntário atualizada:', response.data.data);
        return { success: true, foto_url: response.data.data.foto_perfil };
      } else {
        throw new Error(response.data.message || 'Erro ao fazer upload da foto');
      }
    } catch (error) {
      console.error('❌ Erro ao fazer upload da foto do voluntário:', error);
      setErro(error.message);
      return { success: false, message: error.message };
    } finally {
      setCarregando(false);
    }
  };

  const limparErro = () => setErro(null);

  // Carrega o perfil automaticamente quando o hook é usado
  useEffect(() => {
    buscarPerfil();
  }, []);

  return {
    perfil,
    carregando,
    erro,
    buscarPerfil,
    editarPerfilBasico,
    editarPerfilVoluntario,
    uploadFoto,
    limparErro
  };
};