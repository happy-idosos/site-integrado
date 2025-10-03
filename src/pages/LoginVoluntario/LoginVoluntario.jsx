"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./LoginVoluntario.css"

import logo from "../../assets/img/happyidosos.jpg"

const LoginVoluntario = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Limite de caracteres para email (coerente com CadastroVoluntario)
    if (name === "email" && value.length > 96) {
      return
    }

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
      } else if (value.length > 96) {
        error = "E-mail deve ter no máximo 96 caracteres."
      }
    } else if (name === "senha") {
      if (value.length < 8) {
        error = "A senha deve ter pelo menos 8 caracteres."
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
        error = "Senha deve conter pelo menos 1 letra e 1 número."
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

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" })
    }, 5000)
  }

  // Função para simular chamada à API (substituir pela real depois)
  const mockApiLogin = async (loginData) => {
    // Simulação de delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Simulação de resposta da API
    // TODO: Substituir por chamada real à API
    const mockResponse = {
      success: true,
      user: {
        id: 1,
        nome: "Voluntário Teste",
        email: loginData.email,
        tipo: "voluntario"
      },
      token: "mock-jwt-token-here"
    }

    // Simulação de erro para credenciais inválidas
    if (loginData.email === "erro@exemplo.com" || loginData.senha === "erro123") {
      throw new Error("Credenciais inválidas")
    }

    return mockResponse
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showAlert("Por favor, corrija os erros no formulário antes de continuar.", "error")
      return
    }

    setLoading(true)

    try {
      const loginData = {
        email: formData.email.trim(),
        senha: formData.senha,
        tipoUsuario: "voluntario",
      }

      console.log("Login data ready for API:", loginData)

      // TODO: Substituir por chamada real à API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(loginData)
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erro ao fazer login');
      // }
      // 
      // const data = await response.json();

      // Usando mock enquanto API não está implementada
      const data = await mockApiLogin(loginData)

      // Salvar token e dados do usuário (exemplo)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))

      showAlert("Login realizado com sucesso! Redirecionando...", "success")

      setTimeout(() => {
        navigate("/dashboard-voluntario")
      }, 1500)

    } catch (error) {
      console.error("Erro ao fazer login:", error)
      
      // Tratamento específico de erros da API
      const errorMessage = error.message.includes("Credenciais inválidas") 
        ? "E-mail ou senha incorretos. Tente novamente."
        : "Erro ao conectar com o servidor. Tente novamente."

      showAlert(errorMessage, "error")
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

  // Efeito para limpar alertas quando o componente desmontar
  useEffect(() => {
    return () => {
      if (alert.show) {
        setAlert({ show: false, message: "", type: "" })
      }
    }
  }, [alert.show])

  return (
    <div className="login-voluntario-page">
        <button className="cadastro-voluntario-back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Voltar
        </button>

      <div className="login-voluntario-container">
        <div className="login-voluntario-logo-section" data-aos="fade-down">
          <img src={logo || "/placeholder.svg"} alt="Happy Idosos" className="login-voluntario-logo" />
          <h1>Bem-vindo de volta!</h1>
          <p>Acesse sua conta e continue fazendo a diferença</p>
        </div>

        <div className="login-voluntario-form-container" data-aos="fade-up" data-aos-delay="200">
          <form onSubmit={handleSubmit} className="login-voluntario-form">
            {alert.show && (
              <div className={`login-voluntario-alert login-voluntario-alert-${alert.type}`} data-aos="fade-in">
                {alert.message}
              </div>
            )}

            <div className="login-voluntario-form-section">
              <div className="login-voluntario-form-group">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Digite seu e-mail"
                  maxLength="96"
                  className={errors.email ? "login-voluntario-error" : formData.email ? "login-voluntario-success" : ""}
                />
                {errors.email && <div className="login-voluntario-error-message">{errors.email}</div>}
                <div className="login-voluntario-char-counter">
                  {formData.email.length}/96 caracteres
                </div>
              </div>

              <div className="login-voluntario-form-group">
                <label htmlFor="senha">Senha *</label>
                <div className="login-voluntario-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Digite sua senha"
                    className={
                      errors.senha ? "login-voluntario-error" : formData.senha ? "login-voluntario-success" : ""
                    }
                  />
                  <button
                    type="button"
                    className="login-voluntario-toggle-password"
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
                {errors.senha && <div className="login-voluntario-error-message">{errors.senha}</div>}
                <div className="login-voluntario-password-requirements">
                  • Mínimo 8 caracteres • Pelo menos 1 letra • Pelo menos 1 número
                </div>
              </div>

              <div className="login-voluntario-forgot-password">
                <Link to="/esqueciasenha" className="login-voluntario-link">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-voluntario-submit-btn" 
              disabled={loading}
              data-aos="fade-up" 
              data-aos-delay="300"
            >
              {loading ? (
                <span className="login-voluntario-btn-loading">
                  <div className="login-voluntario-spinner"></div>
                  Entrando...
                </span>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </form>

          <div className="login-voluntario-register-link" data-aos="fade-up" data-aos-delay="400">
            <p>
              Não tem conta?{" "}
              <Link to="/cadastrovoluntario" className="login-voluntario-link">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginVoluntario