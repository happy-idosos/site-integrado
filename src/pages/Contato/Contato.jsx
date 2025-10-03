"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Contato.css"

import carouselum from "../../assets/img/carousel-1.jpg"
import carouseldois from "../../assets/img/carousel-2.jpg"
import carouseltres from "../../assets/img/carousel-3.jpg"


export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    arquivo: null,
  })

  const [fileName, setFileName] = useState("Nenhum arquivo escolhido")
  const carouselRef = useRef(null)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        arquivo: file,
      }))
      setFileName(file.name)
    }
  }

  const scrollToContato = (e) => {
    e.preventDefault()
    const contatoSection = document.getElementById("contato-form")
    if (contatoSection) {
      contatoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Dados do formulário:", formData)

    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")

    setFormData({
      nome: "",
      email: "",
      telefone: "",
      mensagem: "",
      arquivo: null,
    })
    setFileName("Nenhum arquivo escolhido")
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
                <button onClick={scrollToContato} className="btn btn-secondary">
                  Fale Conosco
                </button>
                <Link to="/asilos" className="btn btn-outline-light">
                  Buscar Asilos
                </Link>
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
                <button onClick={scrollToContato} className="btn btn-secondary">
                  Fale Conosco
                </button>
                <Link to="/eventos" className="btn btn-outline-light">
                  Ver Eventos
                </Link>
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
                <button onClick={scrollToContato} className="btn btn-secondary">
                  Fale Conosco
                </button>
                <Link to="/" className="btn btn-outline-light">
                  Página Inicial
                </Link>
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
                        placeholder="Nome completo"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group mb-4">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="E-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group mb-4">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group mb-4">
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <div className="file-upload">
                        <input type="file" id="arquivo" className="file-input" onChange={handleFileChange} />
                        <label htmlFor="arquivo" className="file-label">
                          <span className="file-button">Escolher arquivo</span>
                          <span className="file-text">{fileName}</span>
                        </label>
                      </div>
                    </div>

                    <div className="text-center">
                      <button type="submit" className="btn-enviar">
                        ENVIAR
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
