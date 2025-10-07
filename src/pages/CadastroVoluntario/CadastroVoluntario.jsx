"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./CadastroVoluntario.css"

import logo from "../../assets/img/happyidosos.jpg"

// Componente Modal Atualizado
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
        data-aos="zoom-in"
      >
        <div className="cadastro-modal-header">
          <div className="cadastro-modal-icon">
            {type === 'success' ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <h3 className="cadastro-modal-title">{title}</h3>
        </div>
        
        <div className="cadastro-modal-body">
          <p className="cadastro-modal-message">{message}</p>
        </div>
        
        <div className="cadastro-modal-footer">
          <button className={`cadastro-modal-btn cadastro-modal-btn-${type}`} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CadastroVoluntario() {
  const navigate = useNavigate()
  const { registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    email: "",
    senha: "",
    confirmarSenha: "",
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
  const applyCpfMask = (value) => {
    let maskedValue = value.replace(/\D/g, "")
    if (maskedValue.length <= 11) {
      maskedValue = maskedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return maskedValue
  }

  const applyPhoneMask = (value) => {
    let maskedValue = value.replace(/\D/g, "")
    if (maskedValue.length <= 11) {
      if (maskedValue.length === 11) {
        maskedValue = maskedValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      } else {
        maskedValue = maskedValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      }
    }
    return maskedValue
  }

  // ===== VALIDAÇÕES DE SENHA =====
  const validatePassword = (password) => {
    if (!password) return "Este campo é obrigatório."
    
    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres"
    }
    
    if (!/[a-z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra minúscula"
    }
    
    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula"
    }
    
    if (!/\d/.test(password)) {
      return "A senha deve conter pelo menos um número"
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "A senha deve conter pelo menos um caractere especial (!@#$%^&*(), etc.)"
    }
    
    return ""
  }

  // ===== MANIPULAÇÃO DE INPUTS =====
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    let processedValue = value

    if (name === "nome" && value.length > 128) {
      return
    }
    
    if (name === "email" && value.length > 96) {
      return
    }

    if (name === "cpf") {
      processedValue = applyCpfMask(value)
    } else if (name === "telefone") {
      processedValue = applyPhoneMask(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }))

    // Validação em tempo real para senhas
    if (name === "senha" || name === "confirmarSenha") {
      if (name === "senha") {
        const passwordError = validatePassword(processedValue)
        setErrors((prev) => ({
          ...prev,
          senha: passwordError,
        }))
      }
      
      // Validação de confirmação de senha em tempo real
      if (name === "confirmarSenha" || (name === "senha" && formData.confirmarSenha)) {
        if (processedValue && formData.confirmarSenha && processedValue !== formData.confirmarSenha) {
          setErrors((prev) => ({
            ...prev,
            confirmarSenha: "As senhas não coincidem."
          }))
        } else if (errors.confirmarSenha) {
          setErrors((prev) => ({
            ...prev,
            confirmarSenha: ""
          }))
        }
      }
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // ===== VALIDAÇÕES =====
  const validateField = (name, value) => {
    let error = ""

    if (!value && name !== "termos") {
      error = "Este campo é obrigatório."
    }

    if (value) {
      switch (name) {
        case "nome":
          if (value.length > 128) {
            error = "Nome deve ter no máximo 128 caracteres."
          }
          break
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            error = "Digite um e-mail válido."
          } else if (value.length > 96) {
            error = "E-mail deve ter no máximo 96 caracteres."
          }
          break
        case "cpf":
          const cpfDigits = value.replace(/\D/g, "")
          if (cpfDigits.length !== 11) {
            error = "CPF deve conter exatamente 11 dígitos."
          } else if (!isValidCPF(cpfDigits)) {
            error = "CPF inválido."
          }
          break
        case "telefone":
          const phoneDigits = value.replace(/\D/g, "")
          if (phoneDigits.length !== 11) {
            error = "Telefone deve conter exatamente 11 dígitos (DDD + número)."
          }
          break
        case "data_nascimento":
          const birthDate = new Date(value)
          const today = new Date()
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }

          if (age < 16) {
            error = "Idade mínima é 16 anos."
          } else if (age > 100) {
            error = "Idade máxima é 100 anos."
          }
          break
        case "senha":
          error = validatePassword(value)
          break
        case "confirmarSenha":
          if (value !== formData.senha) {
            error = "As senhas não coincidem."
          }
          break
        default:
          break
      }
    }

    return error
  }

  const isValidCPF = (cpf) => {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === Number.parseInt(cpf.charAt(10))
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem."
      isValid = false
    }

    if (!formData.termos) {
      newErrors.termos = "Você deve aceitar os termos de uso para continuar."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
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
        nome: formData.nome.trim(),
        cpf: formData.cpf.replace(/\D/g, ""),
        telefone: formData.telefone.replace(/\D/g, ""),
        data_nascimento: formData.data_nascimento,
        email: formData.email.trim(),
        senha: formData.senha,
      }

      console.log("[v2] Data to send to API:", submitData)

      // ✅ INTEGRAÇÃO COMPLETA COM useAuth
      const result = await registerUser(submitData)
      
      if (result.success) {
        showModalMessage(
          "Cadastro Realizado com Sucesso!", 
          "Seu cadastro foi realizado com sucesso! Redirecionando para login...", 
          "success"
        )

        // Limpar formulário após sucesso
        setFormData({
          nome: "",
          cpf: "",
          telefone: "",
          data_nascimento: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          termos: false,
        })

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate("/loginvoluntario")
        }, 3000)
      } else {
        showModalMessage(
          "Erro no Cadastro",
          result.error || "Ocorreu um erro ao processar seu cadastro. Tente novamente.", 
          "error"
        )
      }
    } catch (error) {
      console.error("[v2] Erro ao enviar formulário:", error)
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
      <main className="cadastro-voluntario-page">
        {/* HEADER PARA MOBILE/TABLET */}
        {isMobile && (
          <header className="cadastro-voluntario-mobile-header">
            <button 
              className="cadastro-voluntario-mobile-back-btn"
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
            <h1 className="cadastro-voluntario-mobile-title">Cadastro Voluntário</h1>
            <div className="cadastro-voluntario-mobile-spacer"></div>
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

        <div className={`cadastro-voluntario-container ${isMobile ? 'mobile-layout' : ''}`}>
          <div className="cadastro-voluntario-logo-section" data-aos="fade-down">
            <img src={logo || "/placeholder.svg"} alt="Happy Idosos" className="cadastro-voluntario-logo" />
            {!isMobile && (
              <>
                <h1 className="text-balance">Cadastro de Voluntário</h1>
                <p className="text-pretty">Transforme vidas e faça a diferença na vida dos idosos</p>
              </>
            )}
          </div>

          <div className="cadastro-voluntario-form-container" data-aos="fade-up">
            <form onSubmit={handleSubmit} className="cadastro-voluntario-form">
              <div className="cadastro-voluntario-form-section" data-aos="fade-up" data-aos-delay="100">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Dados Pessoais
                </h3>
                <div className="cadastro-voluntario-form-grid">
                  <div className="cadastro-voluntario-form-group cadastro-voluntario-full-width">
                    <label htmlFor="nome">Nome Completo *</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className={
                        errors.nome ? "cadastro-voluntario-error" : formData.nome ? "cadastro-voluntario-success" : ""
                      }
                      placeholder="Ex: Maria Silva Santos"
                      maxLength="128"
                      required
                    />
                    {errors.nome && <div className="cadastro-voluntario-error-message">{errors.nome}</div>}
                    <div className="cadastro-voluntario-char-counter">
                      {formData.nome.length} de 128 caracteres utilizados
                    </div>
                  </div>

                  <div className="cadastro-voluntario-form-group">
                    <label htmlFor="cpf">CPF *</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      className={
                        errors.cpf ? "cadastro-voluntario-error" : formData.cpf ? "cadastro-voluntario-success" : ""
                      }
                      required
                    />
                    {errors.cpf && <div className="cadastro-voluntario-error-message">{errors.cpf}</div>}
                  </div>

                  <div className="cadastro-voluntario-form-group">
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
                          ? "cadastro-voluntario-error"
                          : formData.telefone
                            ? "cadastro-voluntario-success"
                            : ""
                      }
                      required
                    />
                    {errors.telefone && <div className="cadastro-voluntario-error-message">{errors.telefone}</div>}
                  </div>

                  <div className="cadastro-voluntario-form-group">
                    <label htmlFor="data_nascimento">Data de Nascimento *</label>
                    <input
                      type="date"
                      id="data_nascimento"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={handleInputChange}
                      className={
                        errors.data_nascimento
                          ? "cadastro-voluntario-error"
                          : formData.data_nascimento
                            ? "cadastro-voluntario-success"
                            : ""
                      }
                      required
                    />
                    {errors.data_nascimento && (
                      <div className="cadastro-voluntario-error-message">{errors.data_nascimento}</div>
                    )}
                  </div>

                  <div className="cadastro-voluntario-form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seuemail@exemplo.com"
                      maxLength="96"
                      className={
                        errors.email ? "cadastro-voluntario-error" : formData.email ? "cadastro-voluntario-success" : ""
                      }
                      required
                    />
                    {errors.email && <div className="cadastro-voluntario-error-message">{errors.email}</div>}
                    <div className="cadastro-voluntario-char-counter">
                      {formData.email.length} de 96 caracteres utilizados
                    </div>
                  </div>

                  <div className="cadastro-voluntario-form-group">
                    <label htmlFor="senha">Senha *</label>
                    <div className="cadastro-voluntario-password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Mínimo 8 caracteres com letras, números e caracteres especiais"
                        minLength="8"
                        className={
                          errors.senha ? "cadastro-voluntario-error" : formData.senha ? "cadastro-voluntario-success" : ""
                        }
                        required
                      />
                      <button
                        type="button"
                        className="cadastro-voluntario-toggle-password"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.senha && <div className="cadastro-voluntario-error-message">{errors.senha}</div>}
                    <div className="cadastro-voluntario-password-requirements">
                      <strong>Requisitos da senha:</strong>
                      <ul>
                        <li className={formData.senha.length >= 8 ? "valid" : ""}>Mínimo 8 caracteres</li>
                        <li className={/[a-z]/.test(formData.senha) ? "valid" : ""}>1 letra minúscula</li>
                        <li className={/[A-Z]/.test(formData.senha) ? "valid" : ""}>1 letra maiúscula</li>
                        <li className={/\d/.test(formData.senha) ? "valid" : ""}>1 número</li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.senha) ? "valid" : ""}>1 caractere especial</li>
                      </ul>
                    </div>
                  </div>

                  {/* Campo Confirmar Senha */}
                  <div className="cadastro-voluntario-form-group">
                    <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                    <div className="cadastro-voluntario-password-field">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmarSenha"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        placeholder="Digite novamente sua senha"
                        minLength="8"
                        className={
                          errors.confirmarSenha ? "cadastro-voluntario-error" : formData.confirmarSenha ? "cadastro-voluntario-success" : ""
                        }
                        required
                      />
                      <button
                        type="button"
                        className="cadastro-voluntario-toggle-password"
                        onClick={toggleConfirmPasswordVisibility}
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmarSenha && <div className="cadastro-voluntario-error-message">{errors.confirmarSenha}</div>}
                    {formData.senha && formData.confirmarSenha && formData.senha === formData.confirmarSenha && (
                      <div className="cadastro-voluntario-success-message">
                        ✅ As senhas coincidem
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="cadastro-voluntario-form-section cadastro-voluntario-terms-section"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="cadastro-voluntario-terms-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#244a96" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <h4>Termos e Condições</h4>
                </div>
                <label className="cadastro-voluntario-checkbox-group">
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
                    <Link to="/termosdeuso" className="cadastro-voluntario-link">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/politica-privacidade" className="cadastro-voluntario-link">
                      Política de Privacidade
                    </Link>{" "}
                    da plataforma Happy Idosos *
                  </span>
                </label>
                {errors.termos && <div className="cadastro-voluntario-error-message">{errors.termos}</div>}
                <p className="cadastro-voluntario-terms-notice">
                  ⚠️ Ao se cadastrar, você concorda em seguir nossas diretrizes de conduta e compromete-se a tratar os
                  idosos com respeito e dignidade.
                </p>
              </div>

              <button
                type="submit"
                className="cadastro-voluntario-submit-btn"
                disabled={loading}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                {!loading ? (
                  <span>Cadastrar como Voluntário</span>
                ) : (
                  <span className="cadastro-voluntario-btn-loading">
                    <div className="cadastro-voluntario-spinner"></div>
                    Processando...
                  </span>
                )}
              </button>
            </form>

            <div className="cadastro-voluntario-login-link" data-aos="fade-up" data-aos-delay="400">
              <p>
                Já é cadastrado?{" "}
                <Link to="/loginvoluntario" className="cadastro-voluntario-link">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <CadastroModal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  )
}