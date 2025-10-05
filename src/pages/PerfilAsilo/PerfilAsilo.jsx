// src/pages/PerfilAsilo/PerfilAsilo.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./PerfilAsilo.css"

function PerfilAsilo() {
  const { user, userName, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    responsavel: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    capacidade: "",
    tipo: "",
    descricao: "",
    necessidades: "",
    site: "",
    redesSociais: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || userName || "",
        email: user.email || "",
        telefone: user.telefone || "",
        cnpj: user.cnpj || "",
        responsavel: user.responsavel || "",
        endereco: user.endereco || "",
        cidade: user.cidade || "",
        estado: user.estado || "",
        cep: user.cep || "",
        capacidade: user.capacidade || "",
        tipo: user.tipo || "",
        descricao: user.descricao || "",
        necessidades: user.necessidades || "",
        site: user.site || "",
        redesSociais: user.redesSociais || ""
      })
    }
  }, [user, userName])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      await updateProfile(formData)
      setMessage("Perfil do asilo atualizado com sucesso!")
      setIsEditing(false)
    } catch (error) {
      setMessage("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome || userName || "",
        email: user.email || "",
        telefone: user.telefone || "",
        cnpj: user.cnpj || "",
        responsavel: user.responsavel || "",
        endereco: user.endereco || "",
        cidade: user.cidade || "",
        estado: user.estado || "",
        cep: user.cep || "",
        capacidade: user.capacidade || "",
        tipo: user.tipo || "",
        descricao: user.descricao || "",
        necessidades: user.necessidades || "",
        site: user.site || "",
        redesSociais: user.redesSociais || ""
      })
    }
    setIsEditing(false)
    setMessage("")
  }

  return (
    <div className="shelter-profile-page">
      <div className="shelter-profile-hero">
        <div className="shelter-profile-title">
          <h1>Meu Perfil - Asilo</h1>
          <p>Gerencie as informações da sua instituição</p>
        </div>
      </div>

      {message && (
        <div className={`shelter-profile-message ${message.includes('sucesso') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}

      <div className="shelter-profile-wrapper">
        <div className="shelter-profile-main">
          <div className="shelter-profile-card">
            <div className="shelter-profile-card-header">
              <h2>Informações da Instituição</h2>
              {!isEditing && (
                <button 
                  className="shelter-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  🏠 Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="shelter-profile-form">
              <div className="shelter-form-row">
                <div className="shelter-form-group">
                  <label htmlFor="nome">Nome do Asilo *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shelter-form-input"
                  />
                </div>
                <div className="shelter-form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shelter-form-input"
                  />
                </div>
              </div>

              <div className="shelter-form-row">
                <div className="shelter-form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shelter-form-input"
                  />
                </div>
                <div className="shelter-form-group">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shelter-form-input"
                  />
                </div>
              </div>

              <div className="shelter-form-group">
                <label htmlFor="responsavel">Responsável Legal</label>
                <input
                  type="text"
                  id="responsavel"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shelter-form-input"
                />
              </div>

              <div className="shelter-form-row">
                <div className="shelter-form-group">
                  <label htmlFor="cep">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shelter-form-input"
                  />
                </div>
                <div className="shelter-form-group">
                  <label htmlFor="capacidade">Capacidade</label>
                  <input
                    type="number"
                    id="capacidade"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Número de residentes"
                    className="shelter-form-input"
                  />
                </div>
              </div>

              <div className="shelter-form-group">
                <label htmlFor="endereco">Endereço Completo</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shelter-form-input"
                />
              </div>

              <div className="shelter-form-row">
                <div className="shelter-form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shelter-form-input"
                  />
                </div>
                <div className="shelter-form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shelter-form-select"
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
                </div>
              </div>

              <div className="shelter-form-group">
                <label htmlFor="tipo">Tipo de Instituição</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shelter-form-select"
                >
                  <option value="">Selecione</option>
                  <option value="publico">Público</option>
                  <option value="privado">Privado</option>
                  <option value="filantropico">Filantrópico</option>
                  <option value="religioso">Religioso</option>
                  <option value="assistencial">Assistencial</option>
                </select>
              </div>

              <div className="shelter-form-group">
                <label htmlFor="descricao">Descrição da Instituição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Conte sobre a história, missão e valores do seu asilo..."
                  rows="4"
                  className="shelter-form-textarea"
                />
              </div>

              <div className="shelter-form-group">
                <label htmlFor="necessidades">Necessidades de Voluntariado</label>
                <textarea
                  id="necessidades"
                  name="necessidades"
                  value={formData.necessidades}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Descreva as atividades onde precisa de voluntários..."
                  rows="3"
                  className="shelter-form-textarea"
                />
              </div>

              <div className="shelter-form-row">
                <div className="shelter-form-group">
                  <label htmlFor="site">Site</label>
                  <input
                    type="url"
                    id="site"
                    name="site"
                    value={formData.site}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://..."
                    className="shelter-form-input"
                  />
                </div>
                <div className="shelter-form-group">
                  <label htmlFor="redesSociais">Redes Sociais</label>
                  <input
                    type="text"
                    id="redesSociais"
                    name="redesSociais"
                    value={formData.redesSociais}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="@usuario"
                    className="shelter-form-input"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="shelter-form-actions">
                  <button 
                    type="button" 
                    className="shelter-cancel-btn"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    ❌ Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="shelter-save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "⏳ Salvando..." : "💾 Salvar Alterações"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="shelter-profile-sidebar">
          <div className="shelter-stats-card">
            <h3>👥 Voluntários Ativos</h3>
            <div className="shelter-stat-number">24</div>
            <p>pessoas</p>
          </div>
          <div className="shelter-stats-card">
            <h3>🎪 Eventos Realizados</h3>
            <div className="shelter-stat-number">8</div>
            <p>este mês</p>
          </div>
          <div className="shelter-stats-card">
            <h3>⭐ Avaliação</h3>
            <div className="shelter-stat-number">4.8</div>
            <p>estrelas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilAsilo