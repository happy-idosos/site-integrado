import { useState, useEffect } from 'react';
import { editarPerfilVoluntarioService } from '../services/editarperfil/editarPerfilVoluntario.service';

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
      
      if (response.status === 200) {
        setPerfil(response.data);
        console.log('✅ Perfil voluntário carregado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao carregar perfil do voluntário');
      }
      
      return response;
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
      
      if (response.status === 200) {
        // Atualiza o perfil local com os novos dados
        setPerfil(prev => ({
          ...prev,
          ...response.data
        }));
        console.log('✅ Perfil básico do voluntário atualizado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil básico do voluntário');
      }
      
      return response;
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
      
      if (response.status === 200) {
        // Atualiza o perfil local com os novos dados
        setPerfil(prev => ({
          ...prev,
          ...response.data
        }));
        console.log('✅ Perfil específico do voluntário atualizado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil específico do voluntário');
      }
      
      return response;
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
      
      if (response.status === 200 && response.data) {
        // Atualiza apenas a foto no perfil local
        setPerfil(prev => ({
          ...prev,
          foto_perfil: response.data.foto_perfil
        }));
        console.log('✅ Foto do voluntário atualizada:', response.data);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao fazer upload da foto do voluntário:', error);
      setErro(error.message);
      throw error;
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