"use client"

import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Contato.css"
import { contatoService } from "../../services/contato/contato.service"
import { authService } from "../../services/auth/auth.service" 

import carouselum from "../../assets/img/carousels/carousel-10.jpg"
import carouseldois from "../../assets/img/carousels/carousel-12.jpg"
import carouseltres from "../../assets/img/carousels/carousel-3.jpg"

export default function Contato() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    arquivo: null,
  })

  const [fileName, setFileName] = useState("Nenhum arquivo escolhido")
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // "success", "error" ou "auth_required"
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  })
  const carouselRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        ride: "carousel",
        interval: 6000,
        pause: "hover",
      })
    }

    // ✅ USA O MÉTODO checkAuth() DO SEU SERVIÇO QUE JÁ FUNCIONA
    checkAuthentication()
  }, [])

  // ✅ FUNÇÃO QUE USA SEU auth.service.js EXISTENTE
  const checkAuthentication = () => {
    const authData = authService.checkAuth()
    setAuthState({
      isAuthenticated: authData.isAuthenticated,
      user: authData.user
    })

    // Preenche automaticamente os dados do usuário logado
    if (authData.isAuthenticated && authData.user) {
      setFormData(prev => ({
        ...prev,
        nome: authData.user.nome || "",
        email: authData.user.email || ""
      }))
    }
  }

  // Formatação do telefone em tempo real
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length <= 2) {
      return `(${cleaned}`
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === "telefone") {
      const formattedPhone = formatPhoneNumber(value)
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedPhone,
      }))
    } else if (name === "mensagem") {
      if (value.length <= 256) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }))
        setCharCount(value.length)
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handleFileChange = (e) => {
    // ✅ VERIFICA AUTENTICAÇÃO USANDO SEU SERVIÇO
    if (!authState.isAuthenticated) {
      showAuthRequiredModal()
      return
    }

    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showErrorModal(
          "Arquivo muito grande", 
          "O tamanho máximo permitido é 10MB. Por favor, escolha um arquivo menor."
        )
        return
      }
      
      setFormData((prevState) => ({
        ...prevState,
        arquivo: file,
      }))
      setFileName(file.name)
    }
  }

  const handleRemoveFile = () => {
    setFormData((prevState) => ({
      ...prevState,
      arquivo: null,
    }))
    setFileName("Nenhum arquivo escolhido")
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const scrollToContato = (e) => {
    e.preventDefault()
    const contatoSection = document.getElementById("contato-form")
    if (contatoSection) {
      contatoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const showSuccessModal = () => {
    setModalType("success")
    setModalTitle("Mensagem Enviada!")
    setModalMessage("Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em breve.")
    setShowModal(true)
  }

  const showErrorModal = (title, message) => {
    setModalType("error")
    setModalTitle(title)
    setModalMessage(message)
    setShowModal(true)
  }

  // ✅ MODAL PARA AUTENTICAÇÃO NECESSÁRIA
  const showAuthRequiredModal = () => {
    setModalType("auth_required")
    setModalTitle("Login Necessário")
    setModalMessage("Para enviar mensagens e anexar arquivos, você precisa estar logado em sua conta.")
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType("")
    setModalMessage("")
    setModalTitle("")
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ✅ REDIRECIONAMENTOS PARA SUAS PÁGINAS EXISTENTES
  const redirectToLogin = () => {
    navigate('/login')
  }

  const redirectToRegister = () => {
    navigate('/cadastro')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ✅ BLOQUEIA SE NÃO ESTIVER LOGADO (USA SEU auth.service)
    if (!authState.isAuthenticated) {
      showAuthRequiredModal()
      return
    }

    setIsLoading(true)

    // Validação básica do frontend
    if (!formData.nome || !formData.email || !formData.telefone || !formData.mensagem) {
      showErrorModal(
        "Campos obrigatórios", 
        "Por favor, preencha todos os campos obrigatórios marcados com *."
      )
      setIsLoading(false)
      return
    }

    // Validação do email
    if (!validateEmail(formData.email)) {
      showErrorModal(
        "E-mail inválido", 
        "Por favor, insira um endereço de e-mail válido."
      )
      setIsLoading(false)
      return
    }

    // Validação do telefone (pelo menos 10 dígitos)
    const phoneDigits = formData.telefone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      showErrorModal(
        "Telefone inválido", 
        "Por favor, insira um número de telefone válido com DDD."
      )
      setIsLoading(false)
      return
    }

    try {
      console.log("Enviando dados para o backend:", formData)
      
      // ✅ ADICIONA O ID DO USUÁRIO LOGADO AOS DADOS
      const formDataWithUser = {
        ...formData,
        usuarioId: authState.user?.id,
        usuarioTipo: authState.user?.tipo // ✅ INCLUI O TIPO DO USUÁRIO
      }
      
      const resultado = await contatoService.enviarMensagem(formDataWithUser)
      
      console.log("Resposta do servidor:", resultado)
      
      // Mostra o modal de sucesso
      showSuccessModal()

      // Reset do formulário (mantém nome e email do usuário logado)
      setFormData({
        nome: authState.user?.nome || "",
        email: authState.user?.email || "",
        telefone: "",
        mensagem: "",
        arquivo: null,
      })
      setFileName("Nenhum arquivo escolhido")
      setCharCount(0)
      
      // Reset do input file
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      showErrorModal(
        "Erro no envio", 
        error.message || "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="home-page">
      <Header />

      <main>
        {/* Hero Carousel */}
        <div
          ref={carouselRef}
          id="carouselExampleCaptions"
          className="carousel slide hero-carousel"
          data-bs-ride="carousel"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={carouselum || "/placeholder.svg"}
                className="d-block w-100"
                alt="Voluntárias trabalhando juntas"
                loading="eager"
              />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="carrossel">Entre em Contato Conosco</h2>
                <p>
                  {authState.isAuthenticated 
                    ? "Envie sua mensagem para nossa equipe. Estamos aqui para ajudar!"
                    : "Faça login para enviar mensagens e entrar em contato com nossa equipe."
                  }
                </p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  {authState.isAuthenticated ? "Enviar Mensagem" : "Ver Formulário"}
                </button>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src={carouseldois || "/placeholder.svg"}
                className="d-block w-100"
                alt="Enfermeira cuidando de idosa"
                loading="lazy"
              />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="carrossel">Suporte e Orientação</h2>
                <p>
                  {authState.isAuthenticated 
                    ? "Nossa equipe está pronta para esclarecer suas dúvidas."
                    : "Acesse sua conta para falar com nossa equipe de suporte."
                  }
                </p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  {authState.isAuthenticated ? "Fale Conosco" : "Fazer Login"}
                </button>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src={carouseltres || "/placeholder.svg"}
                className="d-block w-100"
                alt="Trabalho em equipe no asilo"
                loading="lazy"
              />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="carrossel">Juntos Fazemos a Diferença</h2>
                <p>
                  {authState.isAuthenticated 
                    ? "Conte conosco para construir pontes e fazer a diferença."
                    : "Junte-se a nós! Crie uma conta para começar a fazer a diferença."
                  }
                </p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  {authState.isAuthenticated ? "Continuar" : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Modal de sucesso/erro/auth */}
        {showModal && (
          <div className={`modal fade show d-block ${
            modalType === 'error' ? 'modal-error' : 
            modalType === 'auth_required' ? 'modal-auth' : 
            'modal-success'
          }`} tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title">
                    {modalType === 'error' ? (
                      <i className="fas fa-exclamation-circle me-2"></i>
                    ) : modalType === 'auth_required' ? (
                      <i className="fas fa-lock me-2"></i>
                    ) : (
                      <i className="fas fa-check-circle me-2"></i>
                    )}
                    {modalTitle}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body text-center py-4">
                  <div className="modal-icon">
                    {modalType === 'error' ? (
                      <i className="fas fa-exclamation-triangle"></i>
                    ) : modalType === 'auth_required' ? (
                      <i className="fas fa-user-lock"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </div>
                  <h4 className="mb-3">{modalTitle}</h4>
                  <p className="text-muted mb-0">
                    {modalMessage}
                  </p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  {modalType === 'auth_required' ? (
                    <div className="d-flex gap-3">
                      <button 
                        type="button" 
                        className="btn btn-outline-primary px-4" 
                        onClick={redirectToLogin}
                      >
                        Fazer Login
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary px-4" 
                        onClick={redirectToRegister}
                      >
                        Cadastrar
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className={`btn ${
                        modalType === 'error' ? 'btn-warning' : 'btn-primary'
                      } px-4`} 
                      onClick={closeModal}
                    >
                      {modalType === 'error' ? 'Tentar Novamente' : 'Entendido'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Contato */}
        <section className="contato-section" id="contato-form" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6">
                <div className="contato-header text-center mb-5">
                  <h2 className="section-title text-balance">
                    {authState.isAuthenticated 
                      ? "Envie sua mensagem" 
                      : "Faça login para entrar em contato"
                    }
                  </h2>
                  {!authState.isAuthenticated && (
                    <p className="text-muted mt-3">
                      Você precisa estar logado para enviar mensagens para nossa equipe.
                    </p>
                  )}
                </div>

                <div className="contato-form-container">
                  {/* Indicador de Status de Login */}
                  {!authState.isAuthenticated && (
                    <div className="alert alert-warning text-center mb-4">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Login necessário</strong> - Faça login ou cadastre-se para enviar mensagens
                    </div>
                  )}

                  {authState.isAuthenticated && (
                    <div className="alert alert-success text-center mb-4">
                      <i className="fas fa-check-circle me-2"></i>
                      <strong>Logado como:</strong> {authState.user?.nome} ({authState.user?.email})
                      {authState.user?.tipo && (
                        <span className="badge bg-primary ms-2">
                          {authState.user.tipo === 'asilo' ? 'Asilo' : 'Voluntário'}
                        </span>
                      )}
                    </div>
                  )}

                  <form className="contato-form" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
                    <div className="form-group mb-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nome completo *"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || !authState.isAuthenticated}
                      />
                    </div>

                    <div className="form-group mb-4">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="E-mail *"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || !authState.isAuthenticated}
                      />
                    </div>

                    <div className="form-group mb-4">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Telefone *"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || !authState.isAuthenticated}
                        maxLength={15}
                      />
                      <small className="text-muted">Formato: (11) 99999-9999</small>
                    </div>

                    <div className="form-group mb-4 position-relative">
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Mensagem *"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || !authState.isAuthenticated}
                        maxLength={256}
                      ></textarea>
                      <div className="position-absolute bottom-0 end-0 p-2">
                        <small className={`${charCount === 256 ? 'text-danger' : 'text-muted'}`}>
                          {charCount}/256
                        </small>
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <div className="file-upload">
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          id="arquivo" 
                          className="file-input" 
                          onChange={handleFileChange}
                          disabled={isLoading || !authState.isAuthenticated}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="arquivo" className="file-label">
                          <span className="file-button">
                            {authState.isAuthenticated ? "Escolher arquivo" : "Login Necessário"}
                          </span>
                          <span className="file-text">{fileName}</span>
                          {formData.arquivo && authState.isAuthenticated && (
                            <button 
                              type="button" 
                              className="btn-close ms-2"
                              onClick={handleRemoveFile}
                              aria-label="Remover arquivo"
                            ></button>
                          )}
                        </label>
                      </div>
                      <small className="text-muted">Formatos aceitos: PDF, DOC, JPG, PNG (Máx. 10MB)</small>
                    </div>

                    <div className="text-center">
                      {authState.isAuthenticated ? (
                        <button 
                          type="submit" 
                          className="btn-enviar"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              ENVIANDO...
                            </>
                          ) : (
                            'ENVIAR MENSAGEM'
                          )}
                        </button>
                      ) : (
                        <div className="d-flex gap-3 justify-content-center">

                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}