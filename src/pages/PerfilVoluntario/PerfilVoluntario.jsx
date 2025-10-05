// src/pages/PerfilVoluntario/PerfilVoluntario.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./PerfilVoluntario.css"

function PerfilVoluntario() {
  const { user, userName, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    habilidades: "",
    disponibilidade: "",
    sobre: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || userName || "",
        email: user.email || "",
        telefone: user.telefone || "",
        dataNascimento: user.dataNascimento || "",
        cpf: user.cpf || "",
        endereco: user.endereco || "",
        cidade: user.cidade || "",
        estado: user.estado || "",
        cep: user.cep || "",
        habilidades: user.habilidades || "",
        disponibilidade: user.disponibilidade || "",
        sobre: user.sobre || ""
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
      setMessage("Perfil atualizado com sucesso!")
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
        dataNascimento: user.dataNascimento || "",
        cpf: user.cpf || "",
        endereco: user.endereco || "",
        cidade: user.cidade || "",
        estado: user.estado || "",
        cep: user.cep || "",
        habilidades: user.habilidades || "",
        disponibilidade: user.disponibilidade || "",
        sobre: user.sobre || ""
      })
    }
    setIsEditing(false)
    setMessage("")
  }

  return (
    <div className="volunteer-profile-page">
      <div className="volunteer-profile-hero">
        <div className="volunteer-profile-title">
          <h1>Meu Perfil - Voluntário</h1>
          <p>Gerencie suas informações pessoais e preferências</p>
        </div>
      </div>

      {message && (
        <div className={`volunteer-profile-message ${message.includes('sucesso') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}

      <div className="volunteer-profile-wrapper">
        <div className="volunteer-profile-main">
          <div className="volunteer-profile-card">
            <div className="volunteer-profile-card-header">
              <h2>Informações Pessoais</h2>
              {!isEditing && (
                <button 
                  className="volunteer-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="volunteer-profile-form">
              <div className="volunteer-form-row">
                <div className="volunteer-form-group">
                  <label htmlFor="nome">Nome Completo *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="volunteer-form-input"
                  />
                </div>
                <div className="volunteer-form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="volunteer-form-input"
                  />
                </div>
              </div>

              <div className="volunteer-form-row">
                <div className="volunteer-form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-input"
                  />
                </div>
                <div className="volunteer-form-group">
                  <label htmlFor="dataNascimento">Data de Nascimento</label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-input"
                  />
                </div>
              </div>

              <div className="volunteer-form-row">
                <div className="volunteer-form-group">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-input"
                  />
                </div>
                <div className="volunteer-form-group">
                  <label htmlFor="cep">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-input"
                  />
                </div>
              </div>

              <div className="volunteer-form-group">
                <label htmlFor="endereco">Endereço</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="volunteer-form-input"
                />
              </div>

              <div className="volunteer-form-row">
                <div className="volunteer-form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-input"
                  />
                </div>
                <div className="volunteer-form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="volunteer-form-select"
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

              <div className="volunteer-form-group">
                <label htmlFor="habilidades">Habilidades e Competências</label>
                <textarea
                  id="habilidades"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ex: Cuidados com idosos, atividades recreativas, música, artesanato..."
                  rows="3"
                  className="volunteer-form-textarea"
                />
              </div>

              <div className="volunteer-form-group">
                <label htmlFor="disponibilidade">Disponibilidade</label>
                <select
                  id="disponibilidade"
                  name="disponibilidade"
                  value={formData.disponibilidade}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="volunteer-form-select"
                >
                  <option value="">Selecione</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                  <option value="finais_semana">Finais de semana</option>
                  <option value="flexivel">Horário flexível</option>
                </select>
              </div>

              <div className="volunteer-form-group">
                <label htmlFor="sobre">Sobre você</label>
                <textarea
                  id="sobre"
                  name="sobre"
                  value={formData.sobre}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você, sua experiência e motivação para ser voluntário..."
                  rows="4"
                  className="volunteer-form-textarea"
                />
              </div>

              {isEditing && (
                <div className="volunteer-form-actions">
                  <button 
                    type="button" 
                    className="volunteer-cancel-btn"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    ❌ Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="volunteer-save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "⏳ Salvando..." : "💾 Salvar Alterações"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="volunteer-profile-sidebar">
          <div className="volunteer-stats-card">
            <h3>📊 Atividades Realizadas</h3>
            <div className="volunteer-stat-number">12</div>
            <p>voluntariados</p>
          </div>
          <div className="volunteer-stats-card">
            <h3>⏰ Horas Doadas</h3>
            <div className="volunteer-stat-number">48</div>
            <p>horas</p>
          </div>
          <div className="volunteer-stats-card">
            <h3>🎉 Desde</h3>
            <div className="volunteer-stat-number">2024</div>
            <p>membro</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilVoluntario