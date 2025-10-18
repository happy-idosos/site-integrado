"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { usePerfilAsilo } from "../../hooks/usePerfilAsilo"
import "./PerfilAsilo.css"

const PerfilAsilo = () => {
  const navigate = useNavigate()
  const { perfil, carregando, erro, editarPerfil, uploadLogo } = usePerfilAsilo()

  const [editando, setEditando] = React.useState(false)
  const [mostrarModal, setMostrarModal] = React.useState(false)
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false)
  const [logo, setLogo] = React.useState(null)
  const [erroMensagem, setErroMensagem] = React.useState("")
  const [dadosForm, setDadosForm] = React.useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    responsavel_legal: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    capacidade: "",
    tipo_instituicao: "",
    descricao: "",
    necessidades_voluntariado: "",
    site: "",
    redes_sociais: "",
  })

  React.useEffect(() => {
    if (perfil) {
      console.log("[v0] Perfil carregado:", perfil)
      setDadosForm({
        nome: perfil.nome || "",
        email: perfil.email || "",
        telefone: perfil.telefone || "",
        cnpj: perfil.cnpj || "",
        responsavel_legal: perfil.responsavel_legal || "",
        endereco: perfil.endereco || "",
        cidade: perfil.cidade || "",
        estado: perfil.estado || "",
        cep: perfil.cep || "",
        capacidade: perfil.capacidade || "",
        tipo_instituicao: perfil.tipo_instituicao || "",
        descricao: perfil.descricao || "",
        necessidades_voluntariado: perfil.necessidades_voluntariado || "",
        site: perfil.site || "",
        redes_sociais: perfil.redes_sociais || "",
      })
      setLogo(perfil.logo_url || null)
      console.log("[v0] Logo URL definido:", perfil.logo_url)
    }
  }, [perfil])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDadosForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = async (e) => {
    if (!editando) {
      setErroMensagem("Ative o modo de edição para alterar a foto.")
      setMostrarModalErro(true)
      return
    }

    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErroMensagem("A imagem deve ter no máximo 5MB.")
        setMostrarModalErro(true)
        return
      }

      if (!file.type.startsWith("image/")) {
        setErroMensagem("Por favor, selecione um arquivo de imagem válido.")
        setMostrarModalErro(true)
        return
      }

      try {
        const resultado = await uploadLogo(file)
        if (resultado.success) {
          setLogo(resultado.logo_url)
          console.log("✅ Logo atualizado na UI:", resultado.logo_url)
        } else {
          setErroMensagem(resultado.message || "Erro ao fazer upload da logo.")
          setMostrarModalErro(true)
        }
      } catch (error) {
        console.error("❌ Erro ao carregar a imagem:", error)
        setErroMensagem("Erro ao carregar a imagem. Tente novamente.")
        setMostrarModalErro(true)
      }
    }
  }

  const validarFormulario = () => {
    if (!dadosForm.nome.trim()) {
      setErroMensagem("O nome do asilo é obrigatório.")
      return false
    }

    if (!dadosForm.email.trim() || !dadosForm.email.includes("@")) {
      setErroMensagem("Por favor, insira um e-mail válido.")
      return false
    }

    return true
  }

  const salvarAlteracoes = async () => {
    if (!validarFormulario()) {
      setMostrarModalErro(true)
      return
    }

    try {
      console.log("[v0] Salvando alterações:", dadosForm)

      const resultado = await editarPerfil(dadosForm)

      if (resultado.success) {
        setEditando(false)
        setMostrarModal(true)
      } else {
        throw new Error(resultado.message || "Erro ao salvar as alterações")
      }
    } catch (error) {
      console.error("❌ Erro ao salvar alterações:", error)
      setErroMensagem(error.message || "Erro ao salvar as alterações. Tente novamente.")
      setMostrarModalErro(true)
    }
  }

  const fecharModal = () => {
    setMostrarModal(false)
  }

  const fecharModalErro = () => {
    setMostrarModalErro(false)
  }

  const iniciarEdicao = () => {
    setEditando(true)
  }

  const cancelarEdicao = () => {
    if (perfil) {
      setDadosForm({
        nome: perfil.nome || "",
        email: perfil.email || "",
        telefone: perfil.telefone || "",
        cnpj: perfil.cnpj || "",
        responsavel_legal: perfil.responsavel_legal || "",
        endereco: perfil.endereco || "",
        cidade: perfil.cidade || "",
        estado: perfil.estado || "",
        cep: perfil.cep || "",
        capacidade: perfil.capacidade || "",
        tipo_instituicao: perfil.tipo_instituicao || "",
        descricao: perfil.descricao || "",
        necessidades_voluntariado: perfil.necessidades_voluntariado || "",
        site: perfil.site || "",
        redes_sociais: perfil.redes_sociais || "",
      })
      setLogo(perfil.logo_url || null)
    }
    setEditando(false)
  }

  const voltarParaHome = () => {
    navigate("/")
  }

  if (carregando && !perfil) {
    return (
      <div className="pa-container">
        <div className="pa-loading">
          <div className="pa-loading-spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pa-container">
      {/* Botão Voltar */}
      <button className="pa-back-btn" onClick={voltarParaHome}>
        <span className="pa-icon">←</span>
        Voltar
      </button>

      <div className="pa-wrapper">
        <header className="pa-header">
          <div className="pa-header-content">
            <h1 className="pa-title">Meu Perfil</h1>
            <p className="pa-subtitle">Gerencie as informações da sua instituição</p>
          </div>
        </header>

        <div className="pa-content">
          <div className="pa-sidebar">
            <div className="pa-photo-section">
              <div className="pa-photo-container">
                <div className={`pa-photo ${editando ? "pa-photo-editable" : ""}`}>
                  {logo ? (
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Logo do asilo"
                      className="pa-photo-img"
                      onError={(e) => {
                        console.error("❌ Erro ao carregar logo:", logo)
                        console.error("❌ Elemento:", e.target)
                        setLogo(null)
                      }}
                    />
                  ) : (
                    <div className="pa-avatar">
                      <span>{dadosForm.nome ? dadosForm.nome.substring(0, 2).toUpperCase() : "AE"}</span>
                    </div>
                  )}
                  {editando && (
                    <div className="pa-photo-overlay">
                      <label htmlFor="pa-photo-upload" className="pa-upload-label">
                        <span className="pa-icon">📷</span>
                        Alterar Foto
                      </label>
                      <input
                        type="file"
                        id="pa-photo-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="pa-upload-input"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="pa-status">
                <div className="pa-status-indicator"></div>
                <span>Aceitando voluntários</span>
              </div>
            </div>

            <div className="pa-stats">
              <div className="pa-stat-card">
                <div className="pa-stat-icon">
                  <span className="pa-icon">👥</span>
                </div>
                <div className="pa-stat-content">
                  <div className="pa-stat-number">24</div>
                  <div className="pa-stat-label">Voluntários Ativos</div>
                </div>
              </div>
              <div className="pa-stat-card">
                <div className="pa-stat-icon">
                  <span className="pa-icon">🎪</span>
                </div>
                <div className="pa-stat-content">
                  <div className="pa-stat-number">8</div>
                  <div className="pa-stat-label">Eventos/Mês</div>
                </div>
              </div>
              <div className="pa-stat-card">
                <div className="pa-stat-icon">
                  <span className="pa-icon">⭐</span>
                </div>
                <div className="pa-stat-content">
                  <div className="pa-stat-number">4.8</div>
                  <div className="pa-stat-label">Avaliação</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pa-main">
            <div className="pa-card">
              <div className="pa-card-header">
                <h2 className="pa-card-title">Informações da Instituição</h2>
                <div className="pa-card-actions">
                  {!editando ? (
                    <button className="pa-btn pa-btn-primary pa-btn-edit" onClick={iniciarEdicao}>
                      <span className="pa-icon">✏️</span>
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="pa-edit-indicator">
                      <span className="pa-editing-badge">
                        <span className="pa-badge-icon">✏️</span>
                        Modo Edição
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pa-card-body">
                <div className="pa-form">
                  <div className="pa-form-grid">
                    <div className="pa-form-group">
                      <label className="pa-label">
                        Nome do Asilo <span className="pa-required">*</span>
                      </label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="nome"
                          value={dadosForm.nome}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="Digite o nome do asilo"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">🏠</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">
                        E-mail <span className="pa-required">*</span>
                      </label>
                      <div className="pa-input-wrapper">
                        <input
                          type="email"
                          name="email"
                          value={dadosForm.email}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="asilo@email.com"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">✉️</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Telefone</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="tel"
                          name="telefone"
                          value={dadosForm.telefone}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="(00) 00000-0000"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">📱</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">CNPJ</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="cnpj"
                          value={dadosForm.cnpj}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="00.000.000/0000-00"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">🏢</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Responsável Legal</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="responsavel_legal"
                          value={dadosForm.responsavel_legal}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="Nome do responsável"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">👤</span>
                      </div>
                    </div>

                    <div className="pa-form-group pa-full-width">
                      <label className="pa-label">Endereço Completo</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="endereco"
                          value={dadosForm.endereco}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="Digite o endereço completo"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">📍</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Cidade</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="cidade"
                          value={dadosForm.cidade}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="Cidade"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">🏙️</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Estado</label>
                      <div className="pa-input-wrapper">
                        <select
                          name="estado"
                          value={dadosForm.estado}
                          onChange={handleChange}
                          className="pa-select"
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
                        <span className="pa-input-icon">🗺️</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">CEP</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="cep"
                          value={dadosForm.cep}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="00000-000"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">📮</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Capacidade</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="number"
                          name="capacidade"
                          value={dadosForm.capacidade}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="Número de idosos"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">👵</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Tipo de Instituição</label>
                      <div className="pa-input-wrapper">
                        <select
                          name="tipo_instituicao"
                          value={dadosForm.tipo_instituicao}
                          onChange={handleChange}
                          className="pa-select"
                          disabled={!editando}
                        >
                          <option value="">Selecione</option>
                          <option value="publico">Público</option>
                          <option value="privado">Privado</option>
                          <option value="filantropico">Filantrópico</option>
                          <option value="religioso">Religioso</option>
                          <option value="assistencial">Assistencial</option>
                        </select>
                        <span className="pa-input-icon">🏛️</span>
                      </div>
                    </div>

                    <div className="pa-form-group pa-full-width">
                      <label className="pa-label">Descrição da Instituição</label>
                      <div className="pa-input-wrapper">
                        <textarea
                          name="descricao"
                          value={dadosForm.descricao}
                          onChange={handleChange}
                          className="pa-textarea"
                          rows="4"
                          placeholder="Conte sobre a história, missão e valores do seu asilo..."
                          disabled={!editando}
                        />
                        <span className="pa-input-icon pa-textarea-icon">📝</span>
                      </div>
                    </div>

                    <div className="pa-form-group pa-full-width">
                      <label className="pa-label">Necessidades de Voluntariado</label>
                      <div className="pa-input-wrapper">
                        <textarea
                          name="necessidades_voluntariado"
                          value={dadosForm.necessidades_voluntariado}
                          onChange={handleChange}
                          className="pa-textarea"
                          rows="3"
                          placeholder="Descreva as atividades onde precisa de voluntários..."
                          disabled={!editando}
                        />
                        <span className="pa-input-icon pa-textarea-icon">💡</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Site</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="url"
                          name="site"
                          value={dadosForm.site}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="https://..."
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">🌐</span>
                      </div>
                    </div>

                    <div className="pa-form-group">
                      <label className="pa-label">Redes Sociais</label>
                      <div className="pa-input-wrapper">
                        <input
                          type="text"
                          name="redes_sociais"
                          value={dadosForm.redes_sociais}
                          onChange={handleChange}
                          className="pa-input"
                          placeholder="@usuario"
                          disabled={!editando}
                        />
                        <span className="pa-input-icon">📱</span>
                      </div>
                    </div>
                  </div>

                  {editando && (
                    <div className="pa-form-actions">
                      <button
                        className="pa-btn pa-btn-success pa-btn-save"
                        onClick={salvarAlteracoes}
                        disabled={carregando}
                      >
                        <span className="pa-icon">{carregando ? "⏳" : "✅"}</span>
                        {carregando ? "Salvando..." : "Salvar Alterações"}
                      </button>
                      <button
                        className="pa-btn pa-btn-outline pa-btn-cancel"
                        onClick={cancelarEdicao}
                        disabled={carregando}
                      >
                        <span className="pa-icon">❌</span>
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
        <div className="pa-modal-overlay" onClick={fecharModal}>
          <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pa-modal-content">
              <div className="pa-modal-header">
                <button className="pa-modal-close" onClick={fecharModal}>
                  <span className="pa-icon">×</span>
                </button>
                <div className="pa-modal-icon pa-success">
                  <span className="pa-icon">✅</span>
                </div>
                <h3 className="pa-modal-title">Perfil Atualizado!</h3>
              </div>
              <div className="pa-modal-body">
                <p>As informações do seu asilo foram salvas com sucesso.</p>
              </div>
              <div className="pa-modal-footer">
                <button className="pa-btn pa-btn-primary pa-modal-btn" onClick={fecharModal}>
                  <span className="pa-icon">👍</span>
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Erro */}
      {mostrarModalErro && (
        <div className="pa-modal-overlay" onClick={fecharModalErro}>
          <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pa-modal-content">
              <div className="pa-modal-header">
                <button className="pa-modal-close" onClick={fecharModalErro}>
                  <span className="pa-icon">×</span>
                </button>
                <div className="pa-modal-icon pa-error">
                  <span className="pa-icon">❌</span>
                </div>
                <h3 className="pa-modal-title">Ops! Algo deu errado</h3>
              </div>
              <div className="pa-modal-body">
                <p>{erroMensagem}</p>
                <p>Por favor, verifique os dados e tente novamente.</p>
              </div>
              <div className="pa-modal-footer">
                <button className="pa-btn pa-btn-primary pa-modal-btn" onClick={fecharModalErro}>
                  <span className="pa-icon">🔄</span>
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfilAsilo
