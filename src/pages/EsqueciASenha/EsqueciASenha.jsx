"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import "./EsqueciASenha.css"

// Componente Modal de Sucesso
const SuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  const handleAsiloLogin = () => {
    navigate("/loginasilo");
  };

  const handleVoluntarioLogin = () => {
    navigate("/loginvoluntario");
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        
        <h3 className="modal-title">Senha Redefinida com Sucesso!</h3>
        
        <p className="modal-message">
          Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
        </p>

        <div className="modal-buttons">
          <button className="modal-btn modal-btn-primary" onClick={handleVoluntarioLogin}>
            Login Voluntário
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleAsiloLogin}>
            Login Asilo
          </button>
        </div>
      </div>
    </div>
  );
};

const EsqueciASenha = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { forgotPassword, resetPassword, validateResetToken } = useAuth()
  
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 🎯 CAPTURAR EMAIL DA TELA ANTERIOR
  useEffect(() => {
    // Tenta pegar o email do localStorage
    const savedEmail = localStorage.getItem('recoveryEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Tenta pegar o email dos parâmetros da URL
    const urlParams = new URLSearchParams(location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }

    // Tenta pegar do state da navegação
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 100,
      })
    }
  }, [])

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(step - 1);
      // Limpa os campos ao voltar
      if (step === 2) {
        setToken("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()

    if (!email || !isValidEmail(email)) {
      showMessage("Por favor, digite um e-mail válido.", "danger")
      return
    }

    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const result = await forgotPassword(email)
      
      if (result.success) {
        showMessage("Token enviado com sucesso! Verifique seu e-mail.", "success")
        setTimeout(() => {
          setStep(2)
          setMessage({ text: "", type: "" })
        }, 2000)
      } else {
        showMessage(result.error || "Erro ao enviar token. Tente novamente.", "danger")
      }
    } catch (error) {
      console.error("Erro no envio do token:", error)
      showMessage("Erro de conexão. Tente novamente mais tarde.", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()

    if (!token || !newPassword || !confirmPassword) {
      showMessage("Por favor, preencha todos os campos.", "danger")
      return
    }

    if (newPassword !== confirmPassword) {
      showMessage("As senhas não coincidem.", "danger")
      return
    }

    if (newPassword.length < 6) {
      showMessage("A senha deve ter pelo menos 6 caracteres.", "danger")
      return
    }

    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      // Validação do token
      const validationResult = await validateResetToken(token)
      
      if (!validationResult.success) {
        showMessage(validationResult.error || "Token inválido ou expirado.", "danger")
        setLoading(false)
        return
      }

      // Redefinição da senha
      const result = await resetPassword(token, newPassword)
      
      if (result.success) {
        setShowSuccessModal(true)
        setToken("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        showMessage(result.error || "Erro ao redefinir senha. Tente novamente.", "danger")
      }
    } catch (error) {
      console.error("Erro na redefinição:", error)
      showMessage("Erro de conexão. Tente novamente mais tarde.", "danger")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 5000)
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const isEmailValid = email && isValidEmail(email)
  const isPasswordValid = newPassword.length >= 6
  const isConfirmPasswordValid = confirmPassword === newPassword
  const isFormStep1Valid = email && isValidEmail(email)
  const isFormStep2Valid = token && newPassword && confirmPassword && 
                          newPassword === confirmPassword && 
                          newPassword.length >= 6

  return (
    <div className="esquecid-a-senha">
      <button className="back-btn" onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <main>
        <section className="recuperacao-senha py-5" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div className="card shadow-lg border-0 recovery-card">
                  <div className="card-body p-4 p-md-5">
                    
                    {/* Indicador de progresso */}
                    <div className="progress-container mb-5">
                      <div className="progress-steps d-flex justify-content-between position-relative">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                          <div className="step-circle">
                            {step > 1 ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              "1"
                            )}
                          </div>
                          <span className="step-label">E-mail</span>
                        </div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                          <div className="step-circle">
                            {step > 2 ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              "2"
                            )}
                          </div>
                          <span className="step-label">Token</span>
                        </div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                          <div className="step-circle">3</div>
                          <span className="step-label">Nova Senha</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-5">
                      <div className="icon-wrapper mb-4">
                        <div className="recovery-icon">
                          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#244a96" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      </div>
                      <h2 className="recovery-title mb-3">
                        {step === 1 ? "Recuperar Senha" : "Redefinir Senha"}
                      </h2>
                      <p className="recovery-subtitle">
                        {step === 1 
                          ? "Digite seu e-mail para receber um token de recuperação" 
                          : "Use o token enviado para criar sua nova senha"}
                      </p>
                    </div>

                    {message.text && (
                      <div className={`alert alert-${message.type} mt-3`} role="alert">
                        <div className="d-flex align-items-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                            {message.type === 'success' ? (
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            ) : (
                              <circle cx="12" cy="12" r="10" />
                            )}
                          </svg>
                          {message.text}
                        </div>
                      </div>
                    )}

                    {/* Formulário de solicitação de token */}
                    {step === 1 && (
                      <form onSubmit={handleEmailSubmit} noValidate className="recovery-form">
                        <div className="form-group-custom mb-4">
                          <label htmlFor="email" className="form-label-custom">
                            E-mail
                          </label>
                          <div className="input-group-custom">
                            <input
                              type="email"
                              className={`form-control-custom ${email && !isValidEmail(email) ? 'is-invalid' : ''} ${isEmailValid ? 'is-valid' : ''}`}
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              placeholder="seu.email@exemplo.com"
                            />
                            <div className="input-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                            </div>
                          </div>
                          {email && !isValidEmail(email) && (
                            <div className="invalid-feedback-custom">
                              Por favor, digite um e-mail válido.
                            </div>
                          )}
                        </div>

                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-primary-custom btn-lg"
                            disabled={loading || !isFormStep1Valid}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Enviando Token...
                              </>
                            ) : (
                              <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                                Enviar Token
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Formulário de redefinição de senha */}
                    {step === 2 && (
                      <form onSubmit={handlePasswordReset} noValidate className="recovery-form">
                        <div className="form-group-custom mb-4">
                          <label htmlFor="token" className="form-label-custom">
                            Token de Verificação
                          </label>
                          <div className="input-group-custom">
                            <input
                              type="text"
                              className="form-control-custom"
                              id="token"
                              value={token}
                              onChange={(e) => setToken(e.target.value)}
                              required
                              placeholder="Digite o token de 6 dígitos"
                            />
                            <div className="input-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </div>
                          </div>
                          <div className="form-text-custom">
                            Token enviado para: <strong>{email}</strong>
                          </div>
                        </div>

                        <div className="form-group-custom mb-4">
                          <label htmlFor="newPassword" className="form-label-custom">
                            Nova Senha
                          </label>
                          <div className="input-group-custom password-field">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className={`form-control-custom ${newPassword && !isPasswordValid ? 'is-invalid' : ''} ${isPasswordValid ? 'is-valid' : ''}`}
                              id="newPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              placeholder="Mínimo 6 caracteres"
                            />
                            <button
                              type="button"
                              className="toggle-password"
                              onClick={toggleNewPasswordVisibility}
                              aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showNewPassword ? (
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
                          {newPassword && !isPasswordValid && (
                            <div className="invalid-feedback-custom">
                              A senha deve ter pelo menos 6 caracteres.
                            </div>
                          )}
                        </div>

                        <div className="form-group-custom mb-5">
                          <label htmlFor="confirmPassword" className="form-label-custom">
                            Confirmar Nova Senha
                          </label>
                          <div className="input-group-custom password-field">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control-custom ${confirmPassword && !isConfirmPasswordValid ? 'is-invalid' : ''} ${isConfirmPasswordValid ? 'is-valid' : ''}`}
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              placeholder="Digite a senha novamente"
                            />
                            <button
                              type="button"
                              className="toggle-password"
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
                          {confirmPassword && !isConfirmPasswordValid && (
                            <div className="invalid-feedback-custom">
                              As senhas não coincidem.
                            </div>
                          )}
                          {confirmPassword && isConfirmPasswordValid && (
                            <div className="valid-feedback-custom">
                              ✅ As senhas coincidem
                            </div>
                          )}
                        </div>

                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-primary-custom btn-lg"
                            disabled={loading || !isFormStep2Valid}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Redefinindo Senha...
                              </>
                            ) : (
                              <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Redefinir Senha
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="text-center mt-4">
                      <Link 
                        to="#" 
                        onClick={handleBack}
                        className="back-link" 
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Voltar para a página anterior
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="instrucoes py-5" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="text-center">
                  <h3 className="instrucoes-title mb-5">Como funciona a recuperação?</h3>
                  <div className="row g-4">
                    <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
                      <div className="instrucao-card">
                        <div className="instrucao-icon">
                          <div className="icon-circle">1</div>
                        </div>
                        <h5 className="instrucao-title">Digite seu e-mail</h5>
                        <p className="instrucao-text">Informe o e-mail cadastrado em sua conta</p>
                      </div>
                    </div>
                    <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
                      <div className="instrucao-card">
                        <div className="instrucao-icon">
                          <div className="icon-circle">2</div>
                        </div>
                        <h5 className="instrucao-title">Receba o token</h5>
                        <p className="instrucao-text">Um código será enviado para seu e-mail</p>
                      </div>
                    </div>
                    <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
                      <div className="instrucao-card">
                        <div className="instrucao-icon">
                          <div className="icon-circle">3</div>
                        </div>
                        <h5 className="instrucao-title">Redefina a senha</h5>
                        <p className="instrucao-text">Use o token para criar uma nova senha</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Sucesso */}
      <SuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  )
}

export default EsqueciASenha