"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./Login.css"

import logo from "../../assets/img/happyidosos.jpg"

// Componente Modal para Login
const LoginModal = ({ show, type, title, message, onClose }) => {
  useEffect(() => {
    if (!show) return

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div
        className={`login-modal-content login-modal-${type}`}
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        <div className="login-modal-header">
          <div className="login-modal-icon">
            {type === "success" ? (
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
          <h3 className="login-modal-title">{title}</h3>
        </div>

        <div className="login-modal-body">
          <p className="login-modal-message">{message}</p>
        </div>

        <div className="login-modal-footer">
          <button className={`login-modal-btn login-modal-btn-${type}`} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const { login, loading: authLoading, isAuthenticated } = useAuth()

  // Estado para tipo de login selecionado
  const [tipoLogin, setTipoLogin] = useState("asilo") // "asilo" ou "voluntario"

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  })
  const [errors, setErrors] = useState({})

  // Configurações dinâmicas baseadas no tipo selecionado
  const configs = {
    asilo: {
      titulo: "Login da Instituição",
      subtitulo: "Acesse sua conta e continue cuidando dos idosos",
      labelEmail: "E-mail da Instituição *",
      placeholderEmail: "Digite o e-mail da instituição",
      textoBotao: "Entrar como Instituição",
      linkCadastro: "/cadastroasilo",
      textoCadastro: "Cadastre sua instituição aqui",
      mensagensErro: {
        padrao: "E-mail ou senha incorretos. Tente novamente.",
        naoEncontrado: "Nenhuma instituição encontrada com este e-mail.",
      },
    },
    voluntario: {
      titulo: "Login do Voluntário",
      subtitulo: "Acesse sua conta e continue fazendo a diferença",
      labelEmail: "E-mail *",
      placeholderEmail: "Digite seu e-mail",
      textoBotao: "Entrar como Voluntário",
      linkCadastro: "/cadastrovoluntario",
      textoCadastro: "Cadastre-se aqui",
      mensagensErro: {
        padrao: "E-mail ou senha incorretos. Tente novamente.",
        naoEncontrado: "Nenhum voluntário encontrado com este e-mail.",
      },
    },
  }

  const config = configs[tipoLogin]

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })

    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateField = (name, value) => {
    let error = ""

    if (!value.trim()) {
      error = "Este campo é obrigatório."
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        error = "Digite um e-mail válido."
      }
    } else if (name === "senha") {
      if (value.length < 6) {
        error = "A senha deve ter pelo menos 6 caracteres."
      }
    }

    return error
  }

  const validateForm = () => {
    const newErrors = {}

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const showModalMessage = (title, message, type = "success") => {
    setModal({
      show: true,
      title,
      message,
      type,
    })
  }

  const closeModal = () => {
    setModal((prev) => ({ ...prev, show: false }))
  }

  // ✅ SUBMIT UNIFICADO - FUNCIONA PERFEITAMENTE COM SEUS SERVICES
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showModalMessage("Formulário Inválido", "Por favor, corrija os erros no formulário antes de continuar.", "error")
      return
    }

    setLoading(true)

    try {
      // ✅ USA SEU useAuth.login ATUAL - COMPROVADAMENTE FUNCIONAL
      const result = await login(formData.email, formData.senha)

      if (result.success) {
        showModalMessage("Login Realizado com Sucesso!", "Redirecionando para a Tela Inicial...", "success")

        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        // ✅ MENSAGENS ESPECÍFICAS BASEADAS NO TIPO SELECIONADO
        let errorMessage = config.mensagensErro.padrao

        if (result.error) {
          if (result.error.includes("credenciais")) {
            errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha."
          } else if (result.error.includes("encontrado") || result.error.includes("asilo")) {
            errorMessage = config.mensagensErro.naoEncontrado
          } else if (result.error.includes("voluntário") || result.error.includes("usuário")) {
            errorMessage = config.mensagensErro.naoEncontrado
          } else {
            errorMessage = result.error
          }
        }

        showModalMessage("Erro no Login", errorMessage, "error")

        setFormData((prev) => ({
          ...prev,
          senha: "",
        }))
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)

      let errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."

      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
      } else if (error.message.includes("servidor")) {
        errorMessage = "Erro interno do servidor. Tente novamente em alguns instantes."
      }

      showModalMessage("Erro de Conexão", errorMessage, "error")

      setFormData((prev) => ({
        ...prev,
        senha: "",
      }))
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBack = () => {
    navigate("/")
  }

  const isLoading = loading || authLoading

  return (
    <div className="login-page">
      <div className="login-split-container">
        {/* Left Side - Logo Section */}
        <div className="login-logo-side" data-aos="fade-right">
          <div className="login-logo-content">
            <img src={logo || "/placeholder.svg"} alt="Happy Idosos" className="login-brand-logo" />
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="login-form-side" data-aos="fade-left">
          <button className="login-back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Voltar
          </button>

          <div className="login-form-wrapper">
            {/* Mobile Logo - Hidden on Desktop */}
            <div className="login-mobile-logo" data-aos="fade-down">
              <img src={logo || "/placeholder.svg"} alt="Happy Idosos" />
            </div>

            <div className="login-form-header">
              <h1>{config.titulo}</h1>
              <p>{config.subtitulo}</p>
            </div>

            {/* ✅ SELETOR DE TIPO DE LOGIN */}
            <div className="login-type-selector" data-aos="fade-up">
              <button
                className={`login-type-btn ${tipoLogin === "asilo" ? "login-type-active" : ""}`}
                onClick={() => setTipoLogin("asilo")}
                type="button"
              >
                🏠 Instituição
              </button>
              <button
                className={`login-type-btn ${tipoLogin === "voluntario" ? "login-type-active" : ""}`}
                onClick={() => setTipoLogin("voluntario")}
                type="button"
              >
                👤 Voluntário
              </button>
            </div>

            <div className="login-form-container">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-form-section">
                  <div className="login-form-group">
                    <label htmlFor="email">{config.labelEmail}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={config.placeholderEmail}
                      className={errors.email ? "login-error" : formData.email ? "login-success" : ""}
                      disabled={isLoading}
                    />
                    {errors.email && <div className="login-error-message">{errors.email}</div>}
                  </div>

                  <div className="login-form-group">
                    <label htmlFor="senha">Senha *</label>
                    <div className="login-password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleInputChange}
                        placeholder="Digite sua senha"
                        className={errors.senha ? "login-error" : formData.senha ? "login-success" : ""}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={togglePasswordVisibility}
                        disabled={isLoading}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.senha && <div className="login-error-message">{errors.senha}</div>}
                  </div>

                  <div className="login-forgot-password">
                    <Link to="/esqueciasenha" className="login-link">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </div>

                <button type="submit" className="login-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <span className="login-btn-loading">
                      <div className="login-spinner"></div>
                      Entrando...
                    </span>
                  ) : (
                    <span>{config.textoBotao}</span>
                  )}
                </button>
              </form>

              <div className="login-register-link">
                <p>
                  Não tem conta?{" "}
                  <Link to={config.linkCadastro} className="login-link">
                    {config.textoCadastro}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal.show && <LoginModal type={modal.type} title={modal.title} message={modal.message} onClose={closeModal} />}
    </div>
  )
}

export default Login
