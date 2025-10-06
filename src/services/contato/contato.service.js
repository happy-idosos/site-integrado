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
      });

      // 🔥 CORREÇÃO: Extrai o JSON mesmo com warnings HTML
      const responseText = await response.text();
      console.log('Resposta completa do servidor:', responseText);
      
      // Procura por JSON na resposta (pode estar misturado com HTML)
      let data;
      const jsonMatch = responseText.match(/\{.*\}/s); // Encontra JSON mesmo com quebras
      
      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[0]);
          console.log('JSON extraído:', data);
        } catch (jsonError) {
          console.warn('Erro ao parsear JSON, mas continuando...');
          // Se não conseguir parsear, cria resposta padrão baseada no status
          data = response.ok 
            ? { status: 200, message: "Mensagem enviada com sucesso!" }
            : { status: 500, message: "Erro no servidor" };
        }
      } else {
        // Se não encontrou JSON, usa lógica baseada no status
        data = response.ok 
          ? { status: 200, message: "Mensagem enviada com sucesso!" }
          : { status: 500, message: "Erro no servidor" };
      }

      // Se temos um erro específico do PHP sobre arquivo, trata adequadamente
      if (data.status === 500 && data.message === "Erro ao enviar arquivo.") {
        throw new Error("Erro ao enviar arquivo. O arquivo pode ser muito grande ou estar corrompido.");
      }

      if (!response.ok && !data.status) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de contato:', error);
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
      
      throw error;
    }
  }
};