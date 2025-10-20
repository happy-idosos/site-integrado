import { fetchAPI } from '../auth/auth.service';

export const participacoesService = {
  // ✅ PARTICIPAR DE EVENTO (APENAS VOLUNTÁRIOS)
  async participarEvento(id_evento) {
    return await fetchAPI('/api/eventos/participar', {
      method: 'POST',
      body: { id_evento }
    });
  },

  // ✅ CANCELAR PARTICIPAÇÃO (APENAS VOLUNTÁRIOS)
  async cancelarParticipacao(id_evento) {
    return await fetchAPI('/api/eventos/participar', {
      method: 'DELETE',
      body: { id_evento }
    });
  },

  // ✅ LISTAR MINHAS PARTICIPAÇÕES (APENAS VOLUNTÁRIOS)
  async listarMinhasParticipacoes() {
    return await fetchAPI('/api/eventos/meus', {
      method: 'GET'
    });
  },

  // ✅ LISTAR PARTICIPANTES DE UM EVENTO (APENAS ASILOS)
  async listarParticipantes(id_evento) {
    return await fetchAPI(`/api/eventos/${id_evento}/participantes`, {
      method: 'GET'
    });
  }
};