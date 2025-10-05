"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import "./EsqueciASenha.css"

const EsquecidASenha = () => {
  const navigate = useNavigate()
  const { forgotPassword, resetPassword, validateResetToken } = useAuth()
  
  const [step, setStep] = useState(1) // 1 = email, 2 = token e senha
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [emailSent, setEmailSent] = useState(false)

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
    navigate("/")
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

    try {
      const result = await forgotPassword(email)
      
      if (result.success) {
        showMessage("Token enviado com sucesso! Verifique seu e-mail.", "success")
        setEmailSent(true)
        setTimeout(() => {
          setStep(2)
        }, 2000)
      } else {
        showMessage(result.error || "Erro ao enviar token. Tente novamente.", "danger")
      }
    } catch (error) {
      console.error("Erro:", error)
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

    try {
      // Primeiro valida o token
      const validationResult = await validateResetToken(token)
      
      if (!validationResult.success) {
        showMessage(validationResult.error || "Token inválido ou expirado.", "danger")
        return
      }

      // Se token é válido, redefine a senha
      const result = await resetPassword(token, newPassword)
      
      if (result.success) {
        showMessage("Senha redefinida com sucesso! Redirecionando para login...", "success")
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } else {
        showMessage(result.error || "Erro ao redefinir senha. Tente novamente.", "danger")
      }
    } catch (error) {
      console.error("Erro:", error)
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

  return (
    <div className="esquecid-a-senha">
      <button className="back-btn" onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Voltar
      </button>

      <main>
        <section className="recuperacao-senha py-5" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
                  <div className="card-body p-5">
                    
                    {/* Indicador de progresso */}
                    <div className="progress-container mb-5">
                      <div className="progress-steps d-flex justify-content-between position-relative">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                          <div className="step-circle">1</div>
                          <span className="step-label">E-mail</span>
                        </div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                          <div className="step-circle">2</div>
                          <span className="step-label">Token</span>
                        </div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                          <div className="step-circle">3</div>
                          <span className="step-label">Nova Senha</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="icon-wrapper mb-3">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#244a96" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <h2 className="mb-2" style={{ color: "#244a96" }}>
                        {step === 1 ? "Esqueci a Senha" : "Redefinir Senha"}
                      </h2>
                      <p className="text-muted">
                        {step === 1 
                          ? "Digite seu e-mail para receber um token de recuperação" 
                          : "Use o token enviado para redefinir sua senha"}
                      </p>
                    </div>

                    {message.text && (
                      <div className={`alert alert-${message.type} mt-3`} role="alert">
                        {message.text}
                      </div>
                    )}

                    {/* Formulário de solicitação de token */}
                    {step === 1 && (
                      <form onSubmit={handleEmailSubmit} noValidate>
                        <div className="mb-4">
                          <label htmlFor="email" className="form-label fw-semibold">
                            E-mail
                          </label>
                          <input
                            type="email"
                            className={`form-control form-control-lg ${email && isValidEmail(email) ? 'is-valid' : ''}`}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Digite seu e-mail cadastrado"
                            style={{ borderRadius: "15px", border: "2px solid #e9ecef", padding: "15px" }}
                          />
                          {email && !isValidEmail(email) && (
                            <div className="invalid-feedback d-block">
                              Por favor, digite um e-mail válido.
                            </div>
                          )}
                        </div>

                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading || !email || !isValidEmail(email)}
                            style={{ borderRadius: "15px", padding: "15px", fontWeight: "600" }}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Enviando...
                              </>
                            ) : (
                              "Enviar Token"
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Formulário de redefinição de senha */}
                    {step === 2 && (
                      <form onSubmit={handlePasswordReset} noValidate>
                        <div className="mb-4">
                          <label htmlFor="token" className="form-label fw-semibold">
                            Token de Verificação
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            placeholder="Digite o token recebido por e-mail"
                            style={{ borderRadius: "15px", border: "2px solid #e9ecef", padding: "15px" }}
                          />
                          <small className="text-muted">
                            O token foi enviado para: <strong>{email}</strong>
                          </small>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="newPassword" className="form-label fw-semibold">
                            Nova Senha
                          </label>
                          <input
                            type="password"
                            className={`form-control form-control-lg ${newPassword && newPassword.length >= 6 ? 'is-valid' : ''}`}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Digite sua nova senha (mín. 6 caracteres)"
                            style={{ borderRadius: "15px", border: "2px solid #e9ecef", padding: "15px" }}
                          />
                          {newPassword && newPassword.length < 6 && (
                            <div className="invalid-feedback d-block">
                              A senha deve ter pelo menos 6 caracteres.
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="form-label fw-semibold">
                            Confirmar Nova Senha
                          </label>
                          <input
                            type="password"
                            className={`form-control form-control-lg ${confirmPassword && confirmPassword === newPassword ? 'is-valid' : ''}`}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Digite novamente sua nova senha"
                            style={{ borderRadius: "15px", border: "2px solid #e9ecef", padding: "15px" }}
                          />
                          {confirmPassword && confirmPassword !== newPassword && (
                            <div className="invalid-feedback d-block">
                              As senhas não coincidem.
                            </div>
                          )}
                        </div>

                        <div className="d-grid mb-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading || !token || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                            style={{ borderRadius: "15px", padding: "15px", fontWeight: "600" }}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Redefinindo...
                              </>
                            ) : (
                              "Redefinir Senha"
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="text-center">
                      <Link to="/" className="text-decoration-none" style={{ color: "#244a96", fontWeight: "600" }}>
                        Voltar para a página inicial
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="instrucoes py-5 bg-light" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="text-center">
                  <h3 className="text-primary mb-4">Como funciona a recuperação?</h3>
                  <div className="row">
                    <div className="col-md-4 mb-3" data-aos="zoom-in" data-aos-delay="100">
                      <div className="p-3">
                        <div
                          className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "60px", height: "60px", fontSize: "24px", fontWeight: "bold" }}
                        >
                          1
                        </div>
                        <h5>Digite seu e-mail</h5>
                        <p className="text-muted">Informe o e-mail cadastrado em sua conta</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3" data-aos="zoom-in" data-aos-delay="200">
                      <div className="p-3">
                        <div
                          className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "60px", height: "60px", fontSize: "24px", fontWeight: "bold" }}
                        >
                          2
                        </div>
                        <h5>Receba o token</h5>
                        <p className="text-muted">Um código será enviado para seu e-mail</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3" data-aos="zoom-in" data-aos-delay="300">
                      <div className="p-3">
                        <div
                          className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "60px", height: "60px", fontSize: "24px", fontWeight: "bold" }}
                        >
                          3
                        </div>
                        <h5>Redefina a senha</h5>
                        <p className="text-muted">Use o token para criar uma nova senha</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer bg-dark text-white text-center py-3" data-aos="fade-up">
        <div className="container">
          <p className="mb-0">Happy Idosos &copy; 2025. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default EsquecidASenha