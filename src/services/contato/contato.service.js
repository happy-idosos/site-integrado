// src/services/contato/contato.service.js
import { API_BASE_URL } from '../auth/auth.constants';

export const contatoService = {
  /**
   * Envia a mensagem de contato, incluindo dados e opcionalmente um arquivo.
   * @param {Object} dadosContato - Objeto contendo nome, email, telefone, mensagem e opcionalmente arquivo.
   * @returns {Promise<Object>} A resposta de sucesso do servidor.
   */
  async enviarMensagem(dadosContato) {
    try {
      // Cria FormData para enviar arquivo e dados (Formulários com arquivos exigem FormData)
      const formData = new FormData();
      formData.append('nome', dadosContato.nome);
      formData.append('email', dadosContato.email);
      formData.append('telefone', dadosContato.telefone);
      formData.append('mensagem', dadosContato.mensagem);
      
      // Adiciona arquivo se existir
      if (dadosContato.arquivo) {
        formData.append('arquivo', dadosContato.arquivo);
      }

      console.log('Enviando para:', `${API_BASE_URL}/api/contato`);
      
      const response = await fetch(`${API_BASE_URL}/api/contato`, {
        method: 'POST',
        body: formData,
        // NÃO definir Content-Type ao usar FormData, o navegador faz isso automaticamente
      });

      // --- Início do Tratamento de Erros Robusto ---
      
      // 1. VERIFICAÇÃO DE ERRO HTTP (4xx ou 5xx)
      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        
        try {
          // Tenta ler o body como JSON (se o servidor enviou um JSON de erro)
          const errorJson = await response.json();
          // Usa a mensagem do JSON ou a mensagem padrão
          errorMessage = errorJson.message || `Erro no servidor (código ${response.status}).`;
        } catch (e) {
          // Se falhou a leitura do JSON, tenta ler o texto (HTML de erro do PHP)
          const errorText = await response.text();
          console.error("Resposta não-JSON do servidor:", errorText);
          // Mensagem genérica, pois o conteúdo é HTML de erro
          errorMessage = `Erro interno no servidor (código ${response.status}).`;
        }
        
        // Lança o erro para ser capturado pelo bloco catch
        throw new Error(errorMessage);
      }
      
      // 2. RESPOSTA BEM-SUCEDIDA (2xx)
      
      // Verifica se a resposta é JSON antes de tentar processar
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Resposta de Sucesso não-JSON:', textResponse);
        throw new Error('Resposta de sucesso inválida do servidor (não é JSON).');
      }

      const data = await response.json();
      return data;
      
      // --- Fim do Tratamento de Erros Robusto ---

    } catch (error) {
      console.error('Erro no serviço de contato:', error); // Linha 50 do service
      
      // Tratamento de erros de rede (ex: servidor offline ou CORS)
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou o status do serviço.');
      }
      
      // Se for um dos erros que lançamos
      if (error.message.includes('Erro HTTP') || error.message.includes('Erro interno no servidor')) {
         // Não alteramos a mensagem, apenas repassamos o erro lançado acima.
         throw error;
      }
      
      // Erro desconhecido
      throw new Error(`Ocorreu um erro inesperado: ${error.message}`);
    }
  }
};