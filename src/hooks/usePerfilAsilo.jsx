import { useState, useEffect } from 'react';
import { editarPerfilAsiloService } from '../services/editarperfil/editarperfilasilo.service';

export const usePerfilAsilo = () => {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarPerfil = async () => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Buscando perfil do asilo...');
      
      const response = await editarPerfilAsiloService.buscarPerfil();
      
      if (response.status === 200) {
        setPerfil(response.data);
        console.log('✅ Perfil asilo carregado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao carregar perfil do asilo');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil asilo:', error);
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
      console.log('🔄 Editando perfil básico do asilo:', dados);
      
      const response = await editarPerfilAsiloService.editarPerfilBasico(dados);
      
      if (response.status === 200) {
        setPerfil(prev => ({
          ...prev,
          asilo: { ...prev.asilo, ...response.data }
        }));
        console.log('✅ Perfil básico do asilo atualizado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil básico do asilo');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao editar perfil básico do asilo:', error);
      setErro(error.message);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const editarPerfilDetalhes = async (dados) => {
    try {
      setCarregando(true);
      setErro(null);
      console.log('🔄 Editando perfil detalhado do asilo:', dados);
      
      const response = await editarPerfilAsiloService.editarPerfilDetalhes(dados);
      
      if (response.status === 200) {
        setPerfil(prev => ({
          ...prev,
          perfil_asilo: { 
            ...prev.perfil_asilo, 
            ...response.data 
          }
        }));
        console.log('✅ Perfil detalhado do asilo atualizado:', response.data);
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil detalhado do asilo');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao editar perfil detalhado do asilo:', error);
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
      console.log('🔄 Fazendo upload da foto do asilo:', arquivo.name);
      
      const response = await editarPerfilAsiloService.uploadFotoPerfil(arquivo);
      
      if (response.status === 200 && response.data) {
        setPerfil(prev => ({
          ...prev,
          perfil_asilo: { 
            ...prev.perfil_asilo, 
            ...response.data 
          }
        }));
        console.log('✅ Foto do asilo atualizada:', response.data);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro ao fazer upload da foto do asilo:', error);
      setErro(error.message);
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const limparErro = () => setErro(null);

  useEffect(() => {
    buscarPerfil();
  }, []);

  return {
    perfil,
    carregando,
    erro,
    buscarPerfil,
    editarPerfilBasico,
    editarPerfilDetalhes,
    uploadFoto,
    limparErro
  };
};