import { fetchAPI } from '../auth/auth.service';

export const eventosService = {
  // ✅ LISTAR TODOS OS EVENTOS (PÚBLICO)
  async listarEventos() {
    return await fetchAPI('/api/eventos', {
      method: 'GET'
    });
  },

  // ✅ BUSCAR EVENTO POR ID (PÚBLICO)
  async buscarEvento(id_evento) {
    return await fetchAPI(`/api/eventos/${id_evento}`, {
      method: 'GET'
    });
  },

  // ✅ CRIAR EVENTO (APENAS ASILOS)
  async criarEvento(eventoData) {
    return await fetchAPI('/api/eventos/criar', {
      method: 'POST',
      body: eventoData
    });
  }
};