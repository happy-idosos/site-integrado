const API_BASE_URL = 'http://localhost/back-end/api-php';

export const asilosService = {
  async buscarAsilos(filtros) {
    try {
      console.log('🔍 Acessando endpoint:', `${API_BASE_URL}/api/filtra/asilos`);
      console.log('📤 Enviando filtros:', filtros);
      
      const response = await fetch(`${API_BASE_URL}/api/filtra/asilos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros)
      });

      console.log('📡 Status da resposta:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta da API:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar asilos:', error);
      throw error;
    }
  }
};