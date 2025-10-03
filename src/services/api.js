import axios from 'axios';

// ⬇️⬇️⬇️ USE ESTA URL AGORA ⬇️⬇️⬇️
const API_BASE_URL = 'http://localhost/api-php/api.php';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Serviços para Eventos
export const eventosService = {
    listar: () => api.get('/eventos'),
    criar: (dados) => api.post('/eventos/criar', dados),
    participar: (dados) => api.post('/eventos/participar', dados),
};

// Serviços para Autenticação
export const authService = {
    login: (credenciais) => api.post('/login', credenciais),
    cadastroUsuario: (dados) => api.post('/cadastro/usuario', dados),
    cadastroAsilo: (dados) => api.post('/cadastro/asilo', dados),
    esqueceuSenha: (email) => api.post('/esqueceu-senha', { email }),
};

// Serviços para Asilos
export const asilosService = {
    listar: () => api.get('/asilos'),
    filtrar: (filtros) => api.post('/filtra/asilos', filtros),
};

// Serviços para Contato
export const contatoService = {
    enviar: (dados, arquivo) => {
        const formData = new FormData();
        Object.keys(dados).forEach(key => formData.append(key, dados[key]));
        if (arquivo) formData.append('arquivo', arquivo);
        
        return api.post('/contato', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default api;