// src/services/video/videos.services.js
import { api } from '../api';

export const videoService = {
  // Listar vídeos
  async getVideos() {
    return await api.get('/api/videos');
  },

  // Upload de vídeo
  async uploadVideo(formData) {
    return await api.post('/api/videos', formData);
  },

  // Deletar vídeo
  async deleteVideo(id) {
    return await api.delete(`/api/videos/${id}`);
  },

  // Buscar vídeo por ID
  async getVideoById(id) {
    return await api.get(`/api/videos/${id}`);
  }
};