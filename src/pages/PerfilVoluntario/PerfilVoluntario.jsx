"use client"

// src/pages/PerfilVoluntario/PerfilVoluntario.jsx
import React from "react"
import { useNavigate } from "react-router-dom"
import { usePerfilVoluntario } from "../../hooks/usePerfilVoluntario"
import "./PerfilVoluntario.css"

// Limites de caracteres
const LIMITES = {
  nome: 128,
  endereco: 128,
  habilidades: 64,
  sobre_voce: 128,
  telefone: 15,
  cpf: 14,
  cep: 9,
}

const PerfilVoluntario = () => {
  const navigate = useNavigate()
  const { perfil, carregando, erro, editarPerfilBasico, editarPerfilVoluntario, uploadFoto, recarregarPerfil } =
    usePerfilVoluntario()

  const [editando, setEditando] = React.useState(false)
  const [mostrarModal, setMostrarModal] = React.useState(false)
  const [mostrarModalErro, setMostrarModalErro] = React.useState(false)
  const [fotoPerfil, setFotoPerfil] = React.useState(perfil?.foto_url || null)
  const [erroMensagem, setErroMensagem] = React.useState("")
  const [salvando, setSalvando] = React.useState(false)

  const [dadosForm, setDadosForm] = React.useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    habilidades: "",
    disponibilidade: "",
    sobre_voce: "",
  })

  React.useEffect(() => {
    if (perfil) {
      setDadosForm({
        nome: perfil.nome || "",
        email: perfil.email || "",
        telefone: perfil.telefone || "",
        cpf: perfil.cpf || "",
        data_nascimento: perfil.data_nascimento || "",
        endereco: perfil.endereco || "",
        cidade: perfil.cidade || "",
        estado: perfil.estado || "",
        cep: perfil.cep || "",
        habilidades: perfil.habilidades || "",
        disponibilidade: perfil.disponibilidade || "",
        sobre_voce: perfil.sobre_voce || "",
      })
      setFotoPerfil(perfil.foto_url || null)
      console.log("✅ Foto URL carregada:", perfil.foto_url)
    }
  }, [perfil])

  const handleChange = (e) => {
    const { name, value } = e.target
    let valorFormatado = value

    if (LIMITES[name]) {
      valorFormatado = value.slice(0, LIMITES[name])
    }

    switch (name) {
      case "telefone":
        valorFormatado = formatarTelefone(value)
        break
      case "cpf":
        valorFormatado = formatarCPF(value)
        break
      case "cep":
        valorFormatado = formatarCEP(value)
        break
      default:
        break
    }

    setDadosForm((prev) => ({
      ...prev,
      [name]: valorFormatado,
    }))
  }

  const formatarTelefone = (valor) => {
    const numbers = valor.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
    }
  }

  const formatarCPF = (valor) => {
    const numbers = valor.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4")
  }

  const formatarCEP = (valor) => {
    const numbers = valor.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{0,3})/, "$1-$2")
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    console.log("📁 Arquivo selecionado:", file)

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
        console.log("📤 Iniciando upload do arquivo:", file.name, file.size, file.type)
        const resultado = await uploadFoto(file)
        if (resultado.success) {
          setFotoPerfil(resultado.foto_url)
          console.log("✅ Foto atualizada com URL completa:", resultado.foto_url)
        } else {
          setErroMensagem(resultado.message || "Erro ao fazer upload da foto.")
          setMostrarModalErro(true)
        }
      } catch (error) {
        setErroMensagem("Erro ao carregar a imagem. Tente novamente.")
        setMostrarModalErro(true)
      }
    }
  }

  const validarFormulario = () => {
    if (!dadosForm.nome.trim()) {
      setErroMensagem("O nome completo é obrigatório.")
      return false
    }

    if (dadosForm.nome.length > LIMITES.nome) {
      setErroMensagem(`Nome deve ter no máximo ${LIMITES.nome} caracteres.`)
      return false
    }

    if (!dadosForm.email.trim() || !dadosForm.email.includes("@")) {
      setErroMensagem("Por favor, insira um e-mail válido.")
      return false
    }

    if (!dadosForm.telefone.trim()) {
      setErroMensagem("O telefone é obrigatório.")
      return false
    }

    if (!dadosForm.cpf.trim()) {
      setErroMensagem("O CPF é obrigatório.")
      return false
    }

    if (dadosForm.endereco.length > LIMITES.endereco) {
      setErroMensagem(`Endereço deve ter no máximo ${LIMITES.endereco} caracteres.`)
      return false
    }

    if (dadosForm.habilidades.length > LIMITES.habilidades) {
      setErroMensagem(`Habilidades deve ter no máximo ${LIMITES.habilidades} caracteres.`)
      return false
    }

    if (dadosForm.sobre_voce.length > LIMITES.sobre_voce) {
      setErroMensagem(`Biografia deve ter no máximo ${LIMITES.sobre_voce} caracteres.`)
      return false
    }

    return true
  }

  const salvarAlteracoes = async () => {
    if (!validarFormulario()) {
      setMostrarModalErro(true)
      return
    }

    setSalvando(true)

    try {
      const dadosCompletos = {
        nome: dadosForm.nome.trim(),
        email: dadosForm.email.trim(),
        telefone: dadosForm.telefone,
        cpf: dadosForm.cpf,
        data_nascimento: dadosForm.data_nascimento,
        endereco: dadosForm.endereco.trim(),
        cidade: dadosForm.cidade.trim(),
        estado: dadosForm.estado,
        cep: dadosForm.cep,
        habilidades: dadosForm.habilidades.trim(),
        disponibilidade: dadosForm.disponibilidade,
        sobre_voce: dadosForm.sobre_voce.trim(),
      }

      await editarPerfilBasico(dadosCompletos)

      setEditando(false)
      setMostrarModal(true)
    } catch (error) {
      setErroMensagem(error.message || "Erro ao salvar as alterações. Tente novamente.")
      setMostrarModalErro(true)
    } finally {
      setSalvando(false)
    }
  }

  const fecharModal = () => {
    setMostrarModal(false)
    recarregarPerfil()
  }

  const fecharModalErro = () => {
    setMostrarModalErro(false)
  }

  const iniciarEdicao = () => {
    setEditando(true)
  }

  const voltarParaHome = () => {
    navigate("/")
  }

  const renderContadorCaracteres = (campo, valor) => {
    const limite = LIMITES[campo]
    if (!limite) return null

    const usado = valor.length
    const restante = limite - usado

    return (
      <div className="pv-contador-caracteres">
        <small className={restante < 20 ? "pv-texto-alerta" : ""}>{restante} caracteres restantes</small>
      </div>
    )
  }

  if (carregando && !perfil) {
    return (
      <div className="pv-container">
        <div className="pv-loading">
          <span className="pv-icon">⏳</span>
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pv-container">
      <button className="pv-back-btn" onClick={() => navigate("/")}>
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
                    <>
                      <img
                        src={fotoPerfil || "/placeholder.svg"}
                        alt="Foto do perfil"
                        className="pv-photo-img"
                        onError={(e) => {
                          console.error("❌ Erro ao carregar imagem:", fotoPerfil)
                          console.error("❌ URL tentada:", e.target.src)
                          e.target.style.display = "none"
                          setFotoPerfil(null)
                        }}
                        onLoad={() => console.log("✅ Imagem carregada com sucesso:", fotoPerfil)}
                      />
                    </>
                  ) : (
                    <div className="pv-avatar">
                      <span>{dadosForm.nome ? dadosForm.nome.substring(0, 2).toUpperCase() : "PV"}</span>
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
          </div>

          <div className="pv-main">
            <div className="pv-card">
              <div className="pv-card-header">
                <h2 className="pv-card-title">Informações Pessoais</h2>
                <div className="pv-card-actions">
                  {!editando ? (
                    <button className="pv-btn pv-btn-primary pv-btn-edit" onClick={iniciarEdicao}>
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
                          maxLength={LIMITES.nome}
                        />
                        <span className="pv-input-icon">👤</span>
                      </div>
                      {renderContadorCaracteres("nome", dadosForm.nome)}
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
                          maxLength={LIMITES.telefone}
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
                          maxLength={LIMITES.cpf}
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
                          maxLength={LIMITES.endereco}
                        />
                        <span className="pv-input-icon">📍</span>
                      </div>
                      {renderContadorCaracteres("endereco", dadosForm.endereco)}
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
                          maxLength={LIMITES.cep}
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
                          maxLength={LIMITES.habilidades}
                        />
                        <span className="pv-input-icon">💡</span>
                      </div>
                      {renderContadorCaracteres("habilidades", dadosForm.habilidades)}
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
                          maxLength={LIMITES.sobre_voce}
                        />
                        <span className="pv-input-icon">📝</span>
                      </div>
                      {renderContadorCaracteres("sobre_voce", dadosForm.sobre_voce)}
                    </div>
                  </div>

                  {editando && (
                    <div className="pv-form-actions">
                      <button
                        className="pv-btn pv-btn-success pv-btn-save"
                        onClick={salvarAlteracoes}
                        disabled={salvando}
                      >
                        <span className="pv-icon">{salvando ? "⏳" : "✅"}</span>
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                      </button>
                      <button
                        className="pv-btn pv-btn-outline pv-btn-cancel"
                        onClick={() => setEditando(false)}
                        disabled={salvando}
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
                <p>Suas informações foram salvas com sucesso no banco de dados.</p>
              </div>
              <div className="pv-modal-footer">
                <button className="pv-btn pv-btn-primary pv-modal-btn" onClick={fecharModal}>
                  <span className="pv-icon">👌</span>
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <button className="pv-btn pv-btn-primary pv-modal-btn" onClick={fecharModalErro}>
                  <span className="pv-icon">🔄</span>
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

export default PerfilVoluntario
