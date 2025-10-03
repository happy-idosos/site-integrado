"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import "./EsqueciASenha.css"

const EsquecidASenha = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !isValidEmail(email)) {
      showMessage("Por favor, digite um e-mail válido.", "danger")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/esqueci-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage("Token enviado com sucesso! Verifique seu e-mail.", "success")
        setEmail("")
      } else {
        showMessage(data.message || "Erro ao enviar token. Tente novamente.", "danger")
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
        Voltar para Home
      </button>

      <main>
        <section className="recuperacao-senha py-5" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
                  <div className="card-body p-5">
                    <div className="text-center mb-4">
                      <div className="icon-wrapper mb-3">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#244a96" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <h2 className="mb-2" style={{ color: "#244a96" }}>
                        Esqueci a Senha
                      </h2>
                      <p className="text-muted">Digite seu e-mail para receber um token de recuperação</p>
                    </div>

                    {message.text && (
                      <div className={`alert alert-${message.type} mt-3`} role="alert">
                        {message.text}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-semibold">
                          E-mail
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Digite seu e-mail cadastrado"
                          style={{ borderRadius: "15px", border: "2px solid #e9ecef", padding: "15px" }}
                        />
                      </div>

                      <div className="d-grid mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={loading}
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
              <div className="col-md-8">
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
