import { API_BASE_URL } from '../auth/auth.constants';
import { getAuthHeader } from '../auth/auth.helpers';

const VIDEO_ENDPOINTS = {
  LIST_VIDEOS: '/api/videos',
  UPLOAD_VIDEO: '/api/videos'
};

export const videoService = {
  async listVideos() {
    try {
      console.log('🔍 Fazendo requisição para:', `${API_BASE_URL}${VIDEO_ENDPOINTS.LIST_VIDEOS}`);
      
      const response = await fetch(`${API_BASE_URL}${VIDEO_ENDPOINTS.LIST_VIDEOS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 URL completa:', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dados recebidos:', data);
      return data;
    } catch (error) {
      console.error('💥 Erro ao listar vídeos:', error);
      throw error;
    }
  },

  async uploadVideo(formData) {
    try {
      console.log('📤 Iniciando upload de vídeo...');
      
      const response = await fetch(`${API_BASE_URL}${VIDEO_ENDPOINTS.UPLOAD_VIDEO}`, {
        method: 'POST',
        headers: {
          ...getAuthHeader()
        },
        body: formData
      });

      console.log('📡 Status do upload:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro no upload:', errorText);
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Upload bem-sucedido:', data);
      return data;
    } catch (error) {
      console.error('💥 Erro ao enviar vídeo:', error);
      throw error;
    }
  }
};