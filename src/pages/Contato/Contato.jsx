"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Contato.css"
import { contatoService } from "../../services/contato/contato.service"

import carouselum from "../../assets/img/carousels/carousel-10.jpg"
import carouseldois from "../../assets/img/carousels/carousel-2.jpg"
import carouseltres from "../../assets/img/carousels/carousel-3.jpg"

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    arquivo: null,
  })

  const [fileName, setFileName] = useState("Nenhum arquivo escolhido")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [showModal, setShowModal] = useState(false)
  const [charCount, setCharCount] = useState(0)
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
  }, [])

  // Formatação do telefone em tempo real
  const formatPhoneNumber = (value) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '')
    
    // Aplica a formatação (XX) XXXXX-XXXX
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
      // Limita a 256 caracteres
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
    const file = e.target.files[0]
    if (file) {
      // Validação básica do arquivo
      if (file.size > 10 * 1024 * 1024) { // 10MB
        showMessage("Arquivo muito grande. Tamanho máximo: 10MB", "error")
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

  const showMessage = (text, type = "success") => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: "", type: "" }), 5000)
  }

  const showSuccessModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: "", type: "" })

    // Validação básica do frontend
    if (!formData.nome || !formData.email || !formData.telefone || !formData.mensagem) {
      showMessage("Por favor, preencha todos os campos obrigatórios.", "error")
      setIsLoading(false)
      return
    }

    // Validação do telefone (pelo menos 10 dígitos)
    const phoneDigits = formData.telefone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      showMessage("Por favor, insira um número de telefone válido.", "error")
      setIsLoading(false)
      return
    }

    try {
      console.log("Enviando dados para o backend:", formData)
      
      const resultado = await contatoService.enviarMensagem(formData)
      
      console.log("Resposta do servidor:", resultado)
      
      // Mostra o modal de sucesso
      showSuccessModal()

      // Reset do formulário
      setFormData({
        nome: "",
        email: "",
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
      showMessage(error.message || "Erro ao enviar mensagem. Tente novamente.", "error")
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
                <p>Estamos aqui para ajudar você a conectar-se com asilos e fazer a diferença na vida dos idosos.</p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  Fale Conosco
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
                <p>Nossa equipe está pronta para esclarecer suas dúvidas sobre voluntariado e parcerias.</p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  Fale Conosco
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
                <p>Conte conosco para construir pontes entre voluntários e instituições de cuidado aos idosos.</p>
                <button onClick={scrollToContato} className="btn btn-outline-primary btn">
                  Fale Conosco
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

        {/* Mensagem de feedback */}
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show m-3`} role="alert" style={{maxWidth: '600px', margin: '20px auto'}}>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
          </div>
        )}

        {/* Modal de sucesso */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Mensagem Enviada!
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body text-center py-4">
                  <i className="fas fa-paper-plane fa-3x text-primary mb-3"></i>
                  <h4 className="mb-3">Obrigado pelo seu contato!</h4>
                  <p className="text-muted">
                    Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em breve.
                  </p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  <button type="button" className="btn btn-primary px-4" onClick={closeModal}>
                    Entendido
                  </button>
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
                  <h2 className="section-title text-balance">Faça seu registro abaixo e entraremos em contato</h2>
                </div>

                <div className="contato-form-container">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                          disabled={isLoading}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="arquivo" className="file-label">
                          <span className="file-button">Escolher arquivo</span>
                          <span className="file-text">{fileName}</span>
                          {formData.arquivo && (
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
                          'ENVIAR'
                        )}
                      </button>
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