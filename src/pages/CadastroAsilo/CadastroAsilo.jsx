"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./CadastroAsilo.css"

import logo from "../../assets/img/happyidosos.jpg"

// Componente Modal separado
const CadastroModal = ({ show, type, title, message, onClose }) => {
  if (!show) return null

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="cadastro-modal-overlay" onClick={onClose}>
      <div 
        className={`cadastro-modal-content cadastro-modal-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cadastro-modal-header">
          <div className="cadastro-modal-icon">
            {type === 'success' ? (
              <i className="fas fa-check-circle"></i>
            ) : (
              <i className="fas fa-exclamation-triangle"></i>
            )}
          </div>
          <h3 className="cadastro-modal-title">{title}</h3>
        </div>
        
        <div className="cadastro-modal-body">
          <p className="cadastro-modal-message">{message}</p>
        </div>
        
        <div className="cadastro-modal-footer">
          <button className="cadastro-modal-btn" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CadastroAsilo() {
  const navigate = useNavigate()
  const { registerAsilo } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    email: "",
    senha: "",
    termos: false,
  })
  const [errors, setErrors] = useState({})
  const [modal, setModal] = useState({ 
    show: false, 
    title: "", 
    message: "", 
    type: "success" 
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleBack = () => {
    navigate("/")
  }

  const handleHome = () => {
    navigate("/")
  }

  // ===== MÁSCARAS =====
  const applyCnpjMask = (value) => {
    let maskedValue = value.replace(/\D/g, "")
    if (maskedValue.length <= 14) {
      maskedValue = maskedValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      )
    }
    return maskedValue
  }

  const applyPhoneMask = (value) => {
    let maskedValue = value.replace(/\D/g, "")
    if (maskedValue.length <= 11) {
      if (maskedValue.length === 11) {
        maskedValue = maskedValue.replace(
          /(\d{2})(\d{5})(\d{4})/,
          "($1) $2-$3"
        )
      } else {
        maskedValue = maskedValue.replace(
          /(\d{2})(\d{4})(\d{4})/,
          "($1) $2-$3"
        )
      }
    }
    return maskedValue
  }

  // ===== VALIDAÇÕES =====
  const validatePassword = (password) => {
    if (!password) return "Este campo é obrigatório."

    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres"
    }

    if (!/[a-zA-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra"
    }

    if (!/\d/.test(password)) {
      return "A senha deve conter pelo menos um número"
    }

    return ""
  }

  const isValidCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    
    const cnpjsTeste = [
      '12345678000190',
      '99999999999999', 
      '68493240000113',
      '33543167000180',
      '46963268000140',
      '11222333000181'
    ];
    
    if (cnpjsTeste.includes(cnpj)) {
      return true;
    }
    
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  const validateField = (name, value) => {
    let error = ""

    if (!value && name !== "termos") {
      error = "Este campo é obrigatório."
    }

    if (value) {
      switch (name) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            error = "Digite um e-mail válido."
          }
          break
        case "cnpj":
          const cnpjDigits = value.replace(/\D/g, "")
          if (cnpjDigits.length !== 14) {
            error = "CNPJ deve conter exatamente 14 dígitos."
          } else if (!isValidCNPJ(cnpjDigits)) {
            error = "CNPJ inválido."
          }
          break
        case "telefone":
          const phoneDigits = value.replace(/\D/g, "")
          if (phoneDigits.length !== 11) {
            error = "Telefone deve conter exatamente 11 dígitos (DDD + número)."
          }
          break
        case "senha":
          error = validatePassword(value)
          break
        default:
          break
      }
    }

    return error
  }

  // ===== FUNÇÕES DE FORMULÁRIO =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    let processedValue = value

    if (name === "cnpj") {
      processedValue = applyCnpjMask(value)
    } else if (name === "telefone") {
      processedValue = applyPhoneMask(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }))

    if (name === "senha") {
      const passwordError = validatePassword(processedValue)
      setErrors((prev) => ({
        ...prev,
        [name]: passwordError,
      }))
    } else if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      if (key !== "termos") {
        const error = validateField(key, formData[key])
        if (error) {
          newErrors[key] = error
          isValid = false
        }
      }
    })

    if (!formData.termos) {
      newErrors.termos = "Você deve aceitar os termos de uso para continuar."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const showModalMessage = (title, message, type = "success") => {
    setModal({
      show: true,
      title,
      message,
      type
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }))
  }

  // ===== SUBMIT INTEGRADO COM useAuth =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showModalMessage(
        "Erro no Formulário",
        "Por favor, corrija os erros no formulário antes de continuar.",
        "error"
      )
      return
    }

    setLoading(true)

    try {
      const submitData = {
        cnpj: formData.cnpj.replace(/\D/g, ""),
        nome: formData.nome.trim(),
        endereco: formData.endereco.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado,
        telefone: formData.telefone.replace(/\D/g, ""),
        email: formData.email.trim(),
        senha: formData.senha,
      }

      console.log("[v1] Data to send to API:", submitData)

      const result = await registerAsilo(submitData)
      
      if (result.success) {
        showModalMessage(
          "Cadastro Realizado!",
          "Cadastro da instituição realizado com sucesso! Redirecionando para login...",
          "success"
        )

        setFormData({
          nome: "",
          cnpj: "",
          telefone: "",
          endereco: "",
          cidade: "",
          estado: "",
          email: "",
          senha: "",
          termos: false,
        })

        setTimeout(() => {
          navigate("/loginasilo")
        }, 3000)
      } else {
        showModalMessage(
          "Erro no Cadastro",
          result.error || "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
          "error"
        )
      }
    } catch (error) {
      console.error("[v1] Erro ao enviar formulário:", error)
      showModalMessage(
        "Erro de Conexão",
        "Ocorreu um erro ao conectar com o servidor. Tente novamente.",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  // ===== RENDER =====
  return (
    <>
      <main className="cadastro-asilo-page">
        {/* Modal */}
        <CadastroModal
          show={modal.show}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={closeModal}
        />

        {/* HEADER PARA MOBILE/TABLET */}
        {isMobile && (
          <header className="cadastro-asilo-mobile-header">
            <button 
              className="cadastro-asilo-mobile-back-btn"
              onClick={handleHome}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </button>
            <h1 className="cadastro-asilo-mobile-title">Cadastro Asilo</h1>
            <div className="cadastro-asilo-mobile-spacer"></div>
          </header>
        )}

        {/* BOTÃO VOLTAR APENAS PARA DESKTOP */}
        {!isMobile && (
        <button className="cadastro-voluntario-back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Voltar
        </button>
        )}

        <div className={`cadastro-asilo-container ${isMobile ? 'mobile-layout' : ''}`}>
          <div className="cadastro-asilo-logo-section" data-aos="fade-down">
            <img
              src={logo || "/placeholder.svg"}
              alt="Happy Idosos"
              className="cadastro-asilo-logo"
            />
            {!isMobile && (
              <>
                <h1 className="text-balance">Cadastro de Asilo</h1>
                <p className="text-pretty">
                  Conecte sua instituição e ofereça o melhor cuidado aos idosos
                </p>
              </>
            )}
          </div>

          <div
            className="cadastro-asilo-form-container"
            data-aos="fade-up"
          >
            <form onSubmit={handleSubmit} className="cadastro-asilo-form">
              <div
                className="cadastro-asilo-form-section"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dados da Instituição
                </h3>

                <div className="cadastro-asilo-form-grid">
                  {/* Nome */}
                  <div className="cadastro-asilo-form-group cadastro-asilo-full-width">
                    <label htmlFor="nome">Nome da Instituição *</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className={
                        errors.nome
                          ? "cadastro-asilo-error"
                          : formData.nome
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      placeholder="Ex: Casa de Repouso Feliz Idade"
                      required
                    />
                    {errors.nome && (
                      <div className="cadastro-asilo-error-message">
                        {errors.nome}
                      </div>
                    )}
                  </div>

                  {/* CNPJ */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="cnpj">CNPJ *</label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      maxLength="18"
                      className={
                        errors.cnpj
                          ? "cadastro-asilo-error"
                          : formData.cnpj
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.cnpj && (
                      <div className="cadastro-asilo-error-message">
                        {errors.cnpj}
                      </div>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="telefone">Telefone *</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      maxLength="15"
                      className={
                        errors.telefone
                          ? "cadastro-asilo-error"
                          : formData.telefone
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.telefone && (
                      <div className="cadastro-asilo-error-message">
                        {errors.telefone}
                      </div>
                    )}
                  </div>

                  {/* Endereço */}
                  <div className="cadastro-asilo-form-group cadastro-asilo-full-width">
                    <label htmlFor="endereco">Endereço Completo *</label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua Exemplo, 123"
                      className={
                        errors.endereco
                          ? "cadastro-asilo-error"
                          : formData.endereco
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.endereco && (
                      <div className="cadastro-asilo-error-message">
                        {errors.endereco}
                      </div>
                    )}
                  </div>

                  {/* Cidade */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="cidade">Cidade *</label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Ex: São Paulo"
                      className={
                        errors.cidade
                          ? "cadastro-asilo-error"
                          : formData.cidade
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.cidade && (
                      <div className="cadastro-asilo-error-message">
                        {errors.cidade}
                      </div>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="estado">Estado *</label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className={
                        errors.estado
                          ? "cadastro-asilo-error"
                          : formData.estado
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    >
                      <option value="">Selecione o estado</option>
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
                    {errors.estado && (
                      <div className="cadastro-asilo-error-message">
                        {errors.estado}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contato@instituicao.com.br"
                      className={
                        errors.email
                          ? "cadastro-asilo-error"
                          : formData.email
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.email && (
                      <div className="cadastro-asilo-error-message">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="cadastro-asilo-form-group">
                    <label htmlFor="senha">Senha *</label>
                    <input
                      type="password"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      placeholder="Mínimo 8 caracteres, com letras e números"
                      minLength="8"
                      className={
                        errors.senha
                          ? "cadastro-asilo-error"
                          : formData.senha
                          ? "cadastro-asilo-success"
                          : ""
                      }
                      required
                    />
                    {errors.senha && (
                      <div className="cadastro-asilo-error-message">
                        {errors.senha}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Termos e Condições */}
              <div
                className="cadastro-asilo-form-section cadastro-asilo-terms-section"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="cadastro-asilo-terms-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#244a96" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <h4>Termos e Condições</h4>
                </div>
                <label className="cadastro-asilo-checkbox-group">
                  <input
                    type="checkbox"
                    id="termos"
                    name="termos"
                    checked={formData.termos}
                    onChange={handleInputChange}
                    required
                  />
                  <span>
                    Li e aceito os{" "}
                    <Link to="/termosdeuso" className="cadastro-asilo-link">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/politica-privacidade" className="cadastro-asilo-link">
                      Política de Privacidade
                    </Link>{" "}
                    da plataforma Happy Idosos *
                  </span>
                </label>
                {errors.termos && (
                  <div className="cadastro-asilo-error-message">
                    {errors.termos}
                  </div>
                )}
                <p className="cadastro-asilo-terms-notice">
                  ⚠️ Ao cadastrar sua instituição, você declara que possui autorização legal para representá-la e
                  compromete-se a fornecer informações verdadeiras e atualizadas.
                </p>
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                className="cadastro-asilo-submit-btn"
                disabled={loading}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                {!loading ? (
                  <span>Cadastrar Instituição</span>
                ) : (
                  <span className="cadastro-asilo-btn-loading">
                    <div className="cadastro-asilo-spinner"></div>
                    Processando...
                  </span>
                )}
              </button>
            </form>

            {/* Link para Login */}
            <div className="cadastro-asilo-login-link" data-aos="fade-up" data-aos-delay="400">
              <p>
                Já é cadastrado?{" "}
                <Link to="/loginasilo" className="cadastro-asilo-link">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}