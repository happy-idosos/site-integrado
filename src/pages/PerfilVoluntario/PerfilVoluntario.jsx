// src/pages/PerfilVoluntario/PerfilVoluntario.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfilVoluntario } from '../../hooks/usePerfilVoluntario';
import './PerfilVoluntario.css';

const PerfilVoluntario = () => {
  const navigate = useNavigate();
  const {
    perfil,
    carregando,
    erro,
    editarPerfilBasico,
    editarPerfilVoluntario,
    uploadFoto,
    atualizarPerfil
  } = usePerfilVoluntario();

  const [editando, setEditando] = React.useState(false);
  const [mostrarModal, setMostrarModal] = React.useState(false);
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false);
  const [fotoPerfil, setFotoPerfil] = React.useState(perfil?.foto_perfil || null);
  const [erroMensagem, setErroMensagem] = React.useState('');
  const [dadosForm, setDadosForm] = React.useState({
    nome: perfil?.nome || '',
    email: perfil?.email || '',
    telefone: perfil?.telefone || '',
    cpf: perfil?.cpf || '',
    data_nascimento: perfil?.data_nascimento || '',
    endereco: perfil?.endereco || '',
    cidade: perfil?.cidade || '',
    estado: perfil?.estado || '',
    cep: perfil?.cep || '',
    habilidades: perfil?.habilidades || '',
    disponibilidade: perfil?.disponibilidade || '',
    sobre_voce: perfil?.sobre_voce || ''
  });

  // Atualizar dados do formulário quando o perfil carregar
  React.useEffect(() => {
    if (perfil) {
      setDadosForm({
        nome: perfil.nome || '',
        email: perfil.email || '',
        telefone: perfil.telefone || '',
        cpf: perfil.cpf || '',
        data_nascimento: perfil.data_nascimento || '',
        endereco: perfil.endereco || '',
        cidade: perfil.cidade || '',
        estado: perfil.estado || '',
        cep: perfil.cep || '',
        habilidades: perfil.habilidades || '',
        disponibilidade: perfil.disponibilidade || '',
        sobre_voce: perfil.sobre_voce || ''
      });
      setFotoPerfil(perfil.foto_perfil || null);
    }
  }, [perfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErroMensagem('A imagem deve ter no máximo 5MB.');
        setMostrarModalErro(true);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErroMensagem('Por favor, selecione um arquivo de imagem válido.');
        setMostrarModalErro(true);
        return;
      }

      try {
        const resultado = await uploadFoto(file);
        if (resultado.success) {
          setFotoPerfil(resultado.foto_url);
        } else {
          setErroMensagem(resultado.message || 'Erro ao fazer upload da foto.');
          setMostrarModalErro(true);
        }
      } catch (error) {
        setErroMensagem('Erro ao carregar a imagem. Tente novamente.');
        setMostrarModalErro(true);
      }
    }
  };

  const validarFormulario = () => {
    if (!dadosForm.nome.trim()) {
      setErroMensagem('O nome completo é obrigatório.');
      return false;
    }

    if (!dadosForm.email.trim() || !dadosForm.email.includes('@')) {
      setErroMensagem('Por favor, insira um e-mail válido.');
      return false;
    }

    if (!dadosForm.telefone.trim()) {
      setErroMensagem('O telefone é obrigatório.');
      return false;
    }

    if (!dadosForm.cpf.trim()) {
      setErroMensagem('O CPF é obrigatório.');
      return false;
    }

    return true;
  };

  const salvarAlteracoes = async () => {
    if (!validarFormulario()) {
      setMostrarModalErro(true);
      return;
    }

    try {
      // Separar dados básicos e dados de perfil voluntário
      const dadosBasicos = {
        nome: dadosForm.nome,
        email: dadosForm.email,
        telefone: dadosForm.telefone,
        cpf: dadosForm.cpf,
        data_nascimento: dadosForm.data_nascimento,
        endereco: dadosForm.endereco,
        cidade: dadosForm.cidade,
        estado: dadosForm.estado,
        cep: dadosForm.cep
      };

      const dadosPerfil = {
        habilidades: dadosForm.habilidades,
        disponibilidade: dadosForm.disponibilidade,
        sobre_voce: dadosForm.sobre_voce
      };

      // Atualizar dados básicos
      await editarPerfilBasico(dadosBasicos);
      
      // Atualizar perfil voluntário
      await editarPerfilVoluntario(dadosPerfil);

      setEditando(false);
      setMostrarModal(true);
      
    } catch (error) {
      setErroMensagem(error.message || 'Erro ao salvar as alterações. Tente novamente.');
      setMostrarModalErro(true);
    }
  };

  const fecharModal = () => {
    setMostrarModal(false);
  };

  const fecharModalErro = () => {
    setMostrarModalErro(false);
  };

  const iniciarEdicao = () => {
    setEditando(true);
  };

  const voltarParaHome = () => {
    navigate('/');
  };

  if (carregando && !perfil) {
    return (
      <div className="pv-container">
        <div className="pv-loading">
          <span className="pv-icon">⏳</span>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-container">
      {/* Botão Voltar */}
      <button className="pv-back-btn" onClick={voltarParaHome}>
        <span className="pv-icon">←</span>
        Voltar
      </button>

      <div className="pv-wrapper">
        <header className="pv-header">
          <div className="pv-header-content">
            <h1 className="pv-title">Meu Perfil</h1>
            <p className="pv-subtitle">Gerencie suas informações de voluntário</p>
          </div>
        </header>

        <div className="pv-content">
          <div className="pv-sidebar">
            <div className="pv-photo-section">
              <div className="pv-photo-container">
                <div className="pv-photo">
                  {fotoPerfil ? (
                    <img src={fotoPerfil} alt="Foto do perfil" className="pv-photo-img" />
                  ) : (
                    <div className="pv-avatar">
                      <span>{dadosForm.nome ? dadosForm.nome.substring(0, 2).toUpperCase() : 'PV'}</span>
                    </div>
                  )}
                  <div className="pv-photo-overlay">
                    <label htmlFor="pv-photo-upload" className="pv-upload-label">
                      <span className="pv-icon">📷</span>
                      Alterar
                    </label>
                    <input
                      type="file"
                      id="pv-photo-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="pv-upload-input"
                    />
                  </div>
                </div>
              </div>
              <div className="pv-status">
                <div className="pv-status-indicator"></div>
                <span>Disponível para voluntariado</span>
              </div>
            </div>

            <div className="pv-stats">
              <div className="pv-stat-card">
                <div className="pv-stat-icon">
                  <span className="pv-icon">❤️</span>
                </div>
                <div className="pv-stat-content">
                  <div className="pv-stat-number">24</div>
                  <div className="pv-stat-label">Atividades</div>
                </div>
              </div>
              <div className="pv-stat-card">
                <div className="pv-stat-icon">
                  <span className="pv-icon">⏰</span>
                </div>
                <div className="pv-stat-content">
                  <div className="pv-stat-number">156h</div>
                  <div className="pv-stat-label">Horas Doadas</div>
                </div>
              </div>
              <div className="pv-stat-card">
                <div className="pv-stat-icon">
                  <span className="pv-icon">📅</span>
                </div>
                <div className="pv-stat-content">
                  <div className="pv-stat-number">2022</div>
                  <div className="pv-stat-label">Desde</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pv-main">
            <div className="pv-card">
              <div className="pv-card-header">
                <h2 className="pv-card-title">Informações Pessoais</h2>
                <div className="pv-card-actions">
                  {!editando ? (
                    <button 
                      className="pv-btn pv-btn-primary pv-btn-edit"
                      onClick={iniciarEdicao}
                    >
                      <span className="pv-icon">✏️</span>
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="pv-edit-indicator">
                      <span className="pv-editing-badge">Modo Edição</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pv-card-body">
                <div className="pv-form">
                  <div className="pv-form-grid">
                    <div className="pv-form-group">
                      <label className="pv-label">Nome Completo *</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="text"
                          name="nome"
                          value={dadosForm.nome}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="Digite seu nome completo"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">👤</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">E-mail *</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="email"
                          name="email"
                          value={dadosForm.email}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="seu.email@exemplo.com"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">✉️</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">Telefone *</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="tel"
                          name="telefone"
                          value={dadosForm.telefone}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="(00) 00000-0000"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">📱</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">Data de Nascimento</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="date"
                          name="data_nascimento"
                          value={dadosForm.data_nascimento}
                          onChange={handleChange}
                          className="pv-input"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">📅</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">CPF *</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="text"
                          name="cpf"
                          value={dadosForm.cpf}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="000.000.000-00"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">🆔</span>
                      </div>
                    </div>

                    <div className="pv-form-group pv-full-width">
                      <label className="pv-label">Endereço</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="text"
                          name="endereco"
                          value={dadosForm.endereco}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="Digite seu endereço completo"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">📍</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">Cidade</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="text"
                          name="cidade"
                          value={dadosForm.cidade}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="Sua cidade"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">🏙️</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">Estado</label>
                      <div className="pv-input-wrapper">
                        <select
                          name="estado"
                          value={dadosForm.estado}
                          onChange={handleChange}
                          className="pv-select"
                          disabled={!editando}
                        >
                          <option value="">Selecione</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                        <span className="pv-input-icon">🗺️</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">CEP</label>
                      <div className="pv-input-wrapper">
                        <input
                          type="text"
                          name="cep"
                          value={dadosForm.cep}
                          onChange={handleChange}
                          className="pv-input"
                          placeholder="00000-000"
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">📮</span>
                      </div>
                    </div>

                    <div className="pv-form-group pv-full-width">
                      <label className="pv-label">Habilidades</label>
                      <div className="pv-input-wrapper">
                        <textarea
                          name="habilidades"
                          value={dadosForm.habilidades}
                          onChange={handleChange}
                          className="pv-textarea"
                          rows="3"
                          placeholder="Descreva suas principais habilidades..."
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">💡</span>
                      </div>
                    </div>

                    <div className="pv-form-group">
                      <label className="pv-label">Disponibilidade</label>
                      <div className="pv-input-wrapper">
                        <select
                          name="disponibilidade"
                          value={dadosForm.disponibilidade}
                          onChange={handleChange}
                          className="pv-select"
                          disabled={!editando}
                        >
                          <option value="">Selecione</option>
                          <option value="Finais de semana">Finais de semana</option>
                          <option value="Durante a semana">Durante a semana</option>
                          <option value="Ambos">Ambos</option>
                          <option value="Horários flexíveis">Horários flexíveis</option>
                        </select>
                        <span className="pv-input-icon">⏰</span>
                      </div>
                    </div>

                    <div className="pv-form-group pv-full-width">
                      <label className="pv-label">Biografia</label>
                      <div className="pv-input-wrapper">
                        <textarea
                          name="sobre_voce"
                          value={dadosForm.sobre_voce}
                          onChange={handleChange}
                          className="pv-textarea"
                          rows="4"
                          placeholder="Conte um pouco sobre você e sua experiência com voluntariado..."
                          disabled={!editando}
                        />
                        <span className="pv-input-icon">📝</span>
                      </div>
                    </div>
                  </div>

                  {editando && (
                    <div className="pv-form-actions">
                      <button 
                        className="pv-btn pv-btn-success pv-btn-save"
                        onClick={salvarAlteracoes}
                        disabled={carregando}
                      >
                        <span className="pv-icon">{carregando ? "⏳" : "✅"}</span>
                        {carregando ? "Salvando..." : "Salvar Alterações"}
                      </button>
                      <button 
                        className="pv-btn pv-btn-outline pv-btn-cancel"
                        onClick={() => setEditando(false)}
                        disabled={carregando}
                      >
                        <span className="pv-icon">❌</span>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {mostrarModal && (
        <div className="pv-modal-overlay" onClick={fecharModal}>
          <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-content">
              <div className="pv-modal-header">
                <button className="pv-modal-close" onClick={fecharModal}>
                  ✕
                </button>
                <div className="pv-modal-icon pv-success">
                  <span className="pv-icon">✅</span>
                </div>
                <h3 className="pv-modal-title">Perfil Atualizado!</h3>
              </div>
              <div className="pv-modal-body">
                <p>Suas informações foram salvas com sucesso.</p>
                <p>Você será redirecionado para a página inicial.</p>
              </div>
              <div className="pv-modal-footer">
                <button 
                  className="pv-btn pv-btn-primary pv-modal-btn"
                  onClick={() => {
                    fecharModal();
                    setTimeout(() => navigate('/'), 1000);
                  }}
                >
                  <span className="pv-icon">🏠</span>
                  Ir para Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Erro */}
      {mostrarModalErro && (
        <div className="pv-modal-overlay" onClick={fecharModalErro}>
          <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-content">
              <div className="pv-modal-header">
                <button className="pv-modal-close" onClick={fecharModalErro}>
                  ✕
                </button>
                <div className="pv-modal-icon pv-error">
                  <span className="pv-icon">❌</span>
                </div>
                <h3 className="pv-modal-title">Ops! Algo deu errado</h3>
              </div>
              <div className="pv-modal-body">
                <p>{erroMensagem}</p>
                <p>Por favor, verifique os dados e tente novamente.</p>
              </div>
              <div className="pv-modal-footer">
                <button 
                  className="pv-btn pv-btn-primary pv-modal-btn"
                  onClick={fecharModalErro}
                >
                  <span className="pv-icon">🔄</span>
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilVoluntario;