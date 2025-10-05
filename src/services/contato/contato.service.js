// src/services/contato/contato.service.js
import { API_BASE_URL } from '../auth/auth.constants';

export const contatoService = {
  async enviarMensagem(dadosContato) {
    try {
      // Cria FormData para enviar arquivo e dados
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
      console.log('Dados do formulário:', {
        nome: dadosContato.nome,
        email: dadosContato.email,
        telefone: dadosContato.telefone,
        mensagem: dadosContato.mensagem,
        arquivo: dadosContato.arquivo ? dadosContato.arquivo.name : 'Nenhum'
      });

      const response = await fetch(`${API_BASE_URL}/api/contato`, {
        method: 'POST',
        body: formData,
        // Não definir Content-Type aqui - o browser vai definir automaticamente com boundary para FormData
      });

      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Resposta não-JSON do servidor:', textResponse);
        throw new Error('Resposta inválida do servidor');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de contato:', error);
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
      
      if (error.message.includes('Resposta inválida')) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      }
      
      throw error;
    }
  }
};