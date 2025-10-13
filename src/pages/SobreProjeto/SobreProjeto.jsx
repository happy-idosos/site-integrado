"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./SobreProjeto.css"

// Imagens do carousel
import projeto1 from "../../assets/img/carousels/carousel-1.jpg"
import projeto2 from "../../assets/img/carousels/carousel-2.jpg"
import projeto3 from "../../assets/img/carousels/carousel-3.jpg"

// Imagens das ODS
import ods3 from "../../assets/img/ods3.png"
import ods16 from "../../assets/img/ods16.png"

// Imagens ilustrativas
import impacto from "../../assets/img/equipefoto.jpg"
import tecnologia from "../../assets/img/sobrenos_integrantes/Lucas Martins.jpeg"
import comunidade from "../../assets/img/sobrenos_integrantes/Ana Caroline.jpeg"

const SobreProjeto = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    const carouselElement = document.querySelector("#heroCarousel")
    if (carouselElement && window.bootstrap) {
      new window.bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 6000,
        pause: "hover",
      })
    }

    // Carousel functionality for features
    class FeaturesCarousel {
      constructor(carouselId, trackId, prevBtnId, nextBtnId) {
        this.carousel = document.getElementById(carouselId)
        this.track = document.getElementById(trackId)
        this.prevBtn = document.getElementById(prevBtnId)
        this.nextBtn = document.getElementById(nextBtnId)
        this.cards = this.track.querySelectorAll(".feature-card")
        this.currentIndex = 0
        this.cardsPerView = this.getCardsPerView()

        this.init()
        this.updateButtons()

        window.addEventListener("resize", () => {
          this.cardsPerView = this.getCardsPerView()
          this.currentIndex = Math.min(this.currentIndex, this.cards.length - this.cardsPerView)
          this.updateCarousel()
          this.updateButtons()
        })
      }

      getCardsPerView() {
        if (window.innerWidth <= 768) return 1
        if (window.innerWidth <= 991) return 2
        return 3
      }

      init() {
        this.prevBtn.addEventListener("click", () => this.prev())
        this.nextBtn.addEventListener("click", () => this.next())
      }

      prev() {
        if (this.currentIndex > 0) {
          this.currentIndex--
          this.updateCarousel()
          this.updateButtons()
        }
      }

      next() {
        if (this.currentIndex < this.cards.length - this.cardsPerView) {
          this.currentIndex++
          this.updateCarousel()
          this.updateButtons()
        }
      }

      updateCarousel() {
        const cardWidth = this.cards[0].offsetWidth
        const gap = 20
        const translateX = -(this.currentIndex * (cardWidth + gap))
        this.track.style.transform = `translateX(${translateX}px)`
      }

      updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0
        this.nextBtn.disabled = this.currentIndex >= this.cards.length - this.cardsPerView
      }
    }

    // Initialize carousels
    const featuresCarousel = new FeaturesCarousel("featuresCarousel", "featuresTrack", "featuresPrev", "featuresNext")

    return () => {
      window.removeEventListener("resize", () => {})
    }
  }, [])

  return (
    <div className="sobre-projeto-page">
      <Header />

      {/* Hero Carousel */}
      <div
        id="heroCarousel"
        className="carousel slide hero-carousel"
        data-bs-ride="carousel"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-image-container">
              <img
                src={projeto1 || "/placeholder.svg"}
                className="d-block w-100"
                alt="Projeto Happy Idosos em ação"
                loading="eager"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Happy Idosos</h2>
              <p className="text-pretty">Conectando gerações, transformando vidas através da tecnologia e empatia</p>
              <div className="hero-buttons">
                <a href="#sobre" className="btn btn-outline-primary btn">
                  Sobre o Projeto
                </a>
                <a href="#impacto" className="btn btn-outline-primary btn">
                  Nosso Impacto
                </a>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src={projeto2 || "/placeholder.svg"}
                className="d-block w-100"
                alt="Tecnologia a serviço da comunidade"
                loading="lazy"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Tecnologia Social</h2>
              <p className="text-pretty">
                Inovação digital para promover inclusão social e bem-estar da terceira idade
              </p>
              <div className="hero-buttons">
                <a href="#tecnologia" className="btn btn-outline-primary btn">
                  Nossa Tecnologia
                </a>
                <a href="#ods" className="btn btn-outline-primary btn">
                  Compromisso ODS
                </a>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src={projeto3 || "/placeholder.svg"}
                className="d-block w-100"
                alt="Comunidade unida pelo bem-estar"
                loading="lazy"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Sem Fins Lucrativos</h2>
              <p className="text-pretty">100% voluntário, 100% comprometido com o bem-estar social</p>
              <div className="hero-buttons">
                <Link to="/cadastrovoluntario" className="btn btn-outline-primary btn">
                  Seja Voluntário
                </Link>
                <Link to="/contato" className="btn btn-outline-primary btn">
                  Apoie o Projeto
                </Link>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>

      <main>
        {/* Sobre o Projeto */}
        <section className="sobre-projeto" id="sobre" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Sobre o Happy Idosos</h2>
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="projeto-content" data-aos="fade-up" data-aos-delay="100">
                  <p className="text-pretty">
                    O <strong>Happy Idosos</strong> é uma iniciativa social inovadora que utiliza tecnologia para 
                    conectar jovens voluntários com idosos em instituições de longa permanência. Lorem ipsum dolor 
                    sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>

                  <p className="text-pretty">
                    Nosso propósito é combater a solidão na terceira idade através de interações significativas 
                    e atividades recreativas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>

                  <div className="projeto-highlights">
                    <div className="row">
                      <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="highlight-card">
                          <div className="highlight-icon">🎯</div>
                          <h4>Missão Clara</h4>
                          <p>Promover bem-estar através da conexão intergeracional</p>
                        </div>
                      </div>
                      <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
                        <div className="highlight-card">
                          <div className="highlight-icon">💝</div>
                          <h4>Sem Fins Lucrativos</h4>
                          <p>Iniciativa 100% voluntária e comunitária</p>
                        </div>
                      </div>
                      <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
                        <div className="highlight-card">
                          <div className="highlight-icon">🌍</div>
                          <h4>Impacto Social</h4>
                          <p>Transformando realidades em escala nacional</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel de Funcionalidades */}
        <section className="funcionalidades" id="tecnologia" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Nossa Plataforma</h2>
            <p className="section-subtitle text-balance">
              Tecnologia desenvolvida para conectar, engajar e transformar
            </p>

            <div className="features-carousel-container">
              <div className="team-carousel" id="featuresCarousel">
                <div className="carousel-track" id="featuresTrack">
                  <div className="feature-card">
                    <div className="feature-image">
                      <img
                        src={tecnologia || "/placeholder.svg"}
                        alt="Sistema de Match Inteligente"
                        loading="lazy"
                      />
                    </div>
                    <div className="feature-content">
                      <h4 className="text-balance">Match Inteligente</h4>
                      <p className="feature-description text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                      </p>
                      <div className="feature-tags">
                        <span className="feature-tag">Algoritmo</span>
                        <span className="feature-tag">Compatibilidade</span>
                      </div>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-image">
                      <img
                        src={comunidade || "/placeholder.svg"}
                        alt="Comunidade Engajada"
                        loading="lazy"
                      />
                    </div>
                    <div className="feature-content">
                      <h4 className="text-balance">Comunidade Ativa</h4>
                      <p className="feature-description text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                      </p>
                      <div className="feature-tags">
                        <span className="feature-tag">Rede Social</span>
                        <span className="feature-tag">Interação</span>
                      </div>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-image">
                      <img
                        src={impacto || "/placeholder.svg"}
                        alt="Gestão de Eventos"
                        loading="lazy"
                      />
                    </div>
                    <div className="feature-content">
                      <h4 className="text-balance">Eventos Programados</h4>
                      <p className="feature-description text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                      </p>
                      <div className="feature-tags">
                        <span className="feature-tag">Agenda</span>
                        <span className="feature-tag">Atividades</span>
                      </div>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-image">
                      <img
                        src={tecnologia || "/placeholder.svg"}
                        alt="Relatórios de Impacto"
                        loading="lazy"
                      />
                    </div>
                    <div className="feature-content">
                      <h4 className="text-balance">Métricas de Impacto</h4>
                      <p className="feature-description text-pretty">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                      </p>
                      <div className="feature-tags">
                        <span className="feature-tag">Analytics</span>
                        <span className="feature-tag">Resultados</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-controls">
                <button className="carousel-btn" id="featuresPrev" aria-label="Anterior">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
                <button className="carousel-btn" id="featuresNext" aria-label="Próximo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seção ODS Expandida */}
        <section className="ods-section" id="ods" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Alinhamento com os ODS da ONU</h2>
            <p className="section-subtitle text-balance">
              Contribuindo ativamente para a Agenda 2030 de Desenvolvimento Sustentável
            </p>

            <div className="row">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="ods-grid">
                  <div className="ods-item" data-aos="zoom-in" data-aos-delay="200">
                    <img src={ods3 || "/placeholder.svg"} alt="ODS 3 - Saúde e Bem-Estar" />
                    <div className="ods-overlay">
                      <h5>ODS 3</h5>
                      <p>Saúde e Bem-Estar</p>
                    </div>
                  </div>
                  <div className="ods-item" data-aos="zoom-in" data-aos-delay="300">
                    <div className="ods-overlay">
                      <h5>ODS 10</h5>
                      <p>Redução das Desigualdades</p>
                    </div>
                  </div>
                  <div className="ods-item" data-aos="zoom-in" data-aos-delay="400">
                    <img src={ods16 || "/placeholder.svg"} alt="ODS 16 - Paz, Justiça e Instituições Eficazes" />
                    <div className="ods-overlay">
                      <h5>ODS 16</h5>
                      <p>Paz e Justiça</p>
                    </div>
                  </div>
                  <div className="ods-item" data-aos="zoom-in" data-aos-delay="500">
                    <div className="ods-overlay">
                      <h5>ODS 17</h5>
                      <p>Parcerias</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ods-content">
                  <div className="ods-detail">
                    <h4 className="ods-title">ODS 3 - Saúde e Bem-Estar</h4>
                    <p className="ods-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                  </div>
                  
                  <div className="ods-detail">
                    <h4 className="ods-title">ODS 10 - Redução das Desigualdades</h4>
                    <p className="ods-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                  </div>
                  
                  <div className="ods-detail">
                    <h4 className="ods-title">ODS 16 - Paz, Justiça e Instituições Eficazes</h4>
                    <p className="ods-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                  </div>

                  <div className="impact-stats">
                    <div className="row text-center">
                      <div className="col-6 col-md-3">
                        <div className="stat-item">
                          <div className="stat-number">+500</div>
                          <div className="stat-label">Vidas Impactadas</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-item">
                          <div className="stat-number">+100</div>
                          <div className="stat-label">Voluntários</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-item">
                          <div className="stat-number">+50</div>
                          <div className="stat-label">Instituições</div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="stat-item">
                          <div className="stat-number">4</div>
                          <div className="stat-label">ODS Atendidos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Sem Fins Lucrativos */}
        <section className="sem-fins-lucrativos" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="nonprofit-content">
                  <h2 className="section-title text-start text-balance">Projeto Sem Fins Lucrativos</h2>
                  <p className="nonprofit-text">
                    O <strong>Happy Idosos</strong> é uma iniciativa 100% voluntária e comunitária. Lorem ipsum 
                    dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et 
                    dolore magna aliqua.
                  </p>
                  
                  <div className="nonprofit-features">
                    <div className="nonprofit-feature">
                      <span className="feature-icon">🎁</span>
                      <div>
                        <h5>Totalmente Gratuito</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </div>
                    </div>
                    
                    <div className="nonprofit-feature">
                      <span className="feature-icon">🤝</span>
                      <div>
                        <h5>Voluntariado Puro</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </div>
                    </div>
                    
                    <div className="nonprofit-feature">
                      <span className="feature-icon">🌱</span>
                      <div>
                        <h5>Sustentabilidade Social</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="nonprofit-visual" data-aos="zoom-in" data-aos-delay="300">
                  <div className="impact-circle">
                    <div className="circle-content">
                      <div className="circle-main">100%</div>
                      <div className="circle-label">Voluntário</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chamada para Ação */}
        <section className="cta-section" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="cta-content text-center">
              <h2 className="cta-title text-balance">Junte-se a Esta Causa</h2>
              <p className="cta-text text-pretty">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <div className="cta-buttons">
                <Link to="/cadastrovoluntario" className="btn btn-primary btn-lg">
                  Seja Voluntário
                </Link>
                <Link to="/contato" className="btn btn-outline-primary btn-lg">
                  Saiba Mais
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SobreProjeto