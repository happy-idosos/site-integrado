"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Home.css"

import carouselum from "../../assets/img/carousels/carousel-4.jpg"
import carouseldois from "../../assets/img/carousels/carousel-5.jpg"
import carouseltres from "../../assets/img/carousels/carousel-6.jpg"

// imagens do modal
import modalum from "../../assets/img/modal-1.png"
import modaldois from "../../assets/img/modal-1.png"

function Home() {
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    // Initialize Bootstrap carousel
    const carouselElement = document.querySelector("#heroCarousel")
    if (carouselElement && window.bootstrap) {
      new window.bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 6000,
        pause: "hover",
      })
    }
  }, [])

  return (
    <div className="home-page">
      <Header />

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
                src={carouselum || "/placeholder.svg"}
                className="d-block w-100"
                alt="Voluntárias trabalhando juntas"
                loading="eager"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Conectando Voluntários e Idosos</h2>
              <p className="text-pretty">
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-outline-primary btn">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-primary btn">
                  Ver Eventos
                </Link>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src={carouseldois || "/placeholder.svg"}
                className="d-block w-100"
                alt="Enfermeira cuidando de idosa"
                loading="lazy"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Conectando Voluntários e Idosos</h2>
              <p className="text-pretty">
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-outline-primary btn">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-primary btn">
                  Ver Eventos
                </Link>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-image-container">
              <img
                src={carouseltres || "/placeholder.svg"}
                className="d-block w-100"
                alt="Trabalho em equipe no asilo"
                loading="lazy"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel text-balance">Conectando Voluntários e Idosos</h2>
              <p className="text-pretty">
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-outline-primary btn">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-primary btn">
                  Ver Eventos
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

              {/* Como Funciona */}
        <section className="como-funciona" data-aos="fade-up">
          <div className="container">
            <h2 className="section-title text-balance">Como Funciona</h2>
            <div className="row g-4">
              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
                <div className="step-card">
                  <div className="step-number" aria-hidden="true">
                    1
                  </div>
                  <div className="step-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-balance">Encontre Asilos</h3>
                  <p className="text-pretty">
                    Busque por casas de repouso e centros de atividades para idosos próximos a você.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
                <div className="step-card">
                  <div className="step-number" aria-hidden="true">
                    2
                  </div>
                  <div className="step-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h3 className="text-balance">Participe de Eventos</h3>
                  <p className="text-pretty">
                    Inscreva-se em eventos organizados pelas instituições e compartilhe seus talentos.
                  </p>
                </div>
              </div>
              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
                <div className="step-card">
                  <div className="step-number" aria-hidden="true">
                    3
                  </div>
                  <div className="step-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 className="text-balance">Faça a Diferença</h3>
                  <p className="text-pretty">
                    Crie conexões significativas e troque experiências valiosas com os idosos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVIÇOS */}
        <section className="servicos" data-aos="fade-up">
          <div className="container">
            <h2 className="section-title">Nossos Serviços</h2>
            <div className="row g-4">
              <div className="col-md-6" data-aos="fade-right" data-aos-delay="100">
                <div className="service-card">
                  <div className="service-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div className="service-content">
                    <h3>Programa de Voluntariado</h3>
                    <p>Conectamos pessoas dispostas a ajudar com asilos que precisam de apoio.</p>
                    <button
                      className="btn btn-primary service-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#portfolioVoluntariadoModal"
                    >
                      Saiba Mais
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: "8px" }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6" data-aos="fade-left" data-aos-delay="200">
                <div className="service-card">
                  <div className="service-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="service-content">
                    <h3>Organização de Eventos</h3>
                    <p>Facilitamos a criação e divulgação de eventos especiais e culturais para os idosos.</p>
                    <button
                      className="btn btn-primary service-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#portfolioEventosModal"
                    >
                      Saiba Mais
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: "8px" }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

 {/* ======= MODAIS DE PORTFÓLIO DOS SERVIÇOS 1 ======= */}
<div className="portfolio-modal modal fade" id="portfolioVoluntariadoModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <button type="button" className="btn-close-modal" data-bs-dismiss="modal" aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div className="modal-body">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-8">
              <div className="portfolio-modal-image">
              <img
                src={modalum || "/placeholder.svg"}
                className="d-block w-100"
                alt="Enfermeira cuidando de idosa"
                loading="lazy"
              />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-modal-info">
                <h2 className="text-uppercase">Programa de Voluntariado</h2>
                <p className="item-intro text-muted">Conectando gerações através do voluntariado</p>

                <div className="portfolio-details">
                  <h4>Como Funciona</h4>
                  <ul className="portfolio-list">
                    <li>Cadastro simples e rápido de voluntários</li>
                    <li>Escolha de instituições próximas a você</li>
                    <li>Flexibilidade total de horários</li>
                    <li>Diversas atividades disponíveis</li>
                    <li>Acompanhamento e suporte contínuo</li>
                  </ul>

                  <h4>Atividades Oferecidas</h4>
                  <ul className="portfolio-list">
                    <li>Conversas e companhia</li>
                    <li>Leitura e contação de histórias</li>
                    <li>Jogos e atividades recreativas</li>
                    <li>Passeios e caminhadas</li>
                    <li>Oficinas de artesanato</li>
                  </ul>
                  <button className="btn btn-primary btn-block mt-4" data-bs-dismiss="modal">
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* ======= MODAL DE ORGANIZAÇÃO DE EVENTOS ======= */}
<div className="portfolio-modal modal fade" id="portfolioEventosModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <button type="button" className="btn-close-modal" data-bs-dismiss="modal" aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div className="modal-body">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-8">
              <div className="portfolio-modal-image">
                <img
                  src={modaldois || "/placeholder.svg"}
                  className="d-block w-100"
                  alt="Evento comunitário para idosos"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-modal-info">
                <h2 className="text-uppercase">Organização de Eventos</h2>
                <p className="item-intro text-muted">Criando momentos especiais para a melhor idade</p>

                <div className="portfolio-details">
                  <h4>Nossos Serviços</h4>
                  <ul className="portfolio-list">
                    <li>Planejamento completo de eventos</li>
                    <li>Decoração temática personalizada</li>
                    <li>Coordenação de todas as atividades</li>
                    <li>Gestão de fornecedores e parceiros</li>
                    <li>Suporte durante todo o evento</li>
                  </ul>

                  <h4>Tipos de Eventos</h4>
                  <ul className="portfolio-list">
                    <li>Festas comemorativas e aniversários</li>
                    <li>Encontros intergeracionais</li>
                    <li>Oficinas e workshops</li>
                    <li>Eventos culturais e musicais</li>
                    <li>Feiras e bazares beneficentes</li>
                    <li>Celebrações sazonais (Natal, Páscoa, etc.)</li>
                  </ul>

                  <h4>Vantagens</h4>
                  <ul className="portfolio-list">
                    <li>Ambiente adaptado e acessível</li>
                    <li>Atividades inclusivas para todas as idades</li>
                    <li>Segurança e conforto garantidos</li>
                    <li>Memórias inesquecíveis</li>
                    <li>Fortalecimento de vínculos comunitários</li>
                  </ul>

                  <button className="btn btn-primary btn-block mt-4" data-bs-dismiss="modal">
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Benefícios */}
        <section className="beneficios" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Benefícios</h2>
            <div className="row g-4">
              <div className="col-md-6" data-aos="slide-right" data-aos-delay="100">
                <div className="benefit-card">
                  <div className="benefit-header">
                    <div className="benefit-icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-balance">Para os Idosos</h3>
                  </div>
                  <ul className="benefit-list">
                    <li>Maior interação social e redução da solidão</li>
                    <li>Acesso a atividades culturais e recreativas</li>
                    <li>Oportunidade de compartilhar conhecimentos e experiências</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6" data-aos="slide-left" data-aos-delay="200">
                <div className="benefit-card">
                  <div className="benefit-header">
                    <div className="benefit-icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <h3 className="text-balance">Para os Voluntários</h3>
                  </div>
                  <ul className="benefit-list">
                    <li>Experiência enriquecedora de troca intergeracional</li>
                    <li>Oportunidade de desenvolver habilidades sociais e empáticas</li>
                    <li>Satisfação pessoal por contribuir com uma causa social</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Localização */}
        <section className="localizacao" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Encontre Asilos Próximos a Você</h2>
            <p className="localizacao-subtitle text-balance">
              Conectamos voluntários com asilos em todo o Brasil. Selecione seu estado e descubra oportunidades de
              voluntariado.
            </p>

            <div className="row g-4">
              <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
                <div className="region-card">
                  <h4 className="region-title text-balance">Região Sudeste</h4>
                  <div className="estados-grid">
                    <Link to="/asilos?estado=sp" className="estado-link">
                      São Paulo <span className="badge-count">45</span>
                    </Link>
                    <Link to="/asilos?estado=rj" className="estado-link">
                      Rio de Janeiro <span className="badge-count">32</span>
                    </Link>
                    <Link to="/asilos?estado=mg" className="estado-link">
                      Minas Gerais <span className="badge-count">28</span>
                    </Link>
                    <Link to="/asilos?estado=es" className="estado-link">
                      Espírito Santo <span className="badge-count">12</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
                <div className="region-card">
                  <h4 className="region-title text-balance">Região Nordeste</h4>
                  <div className="estados-grid">
                    <Link to="/asilos?estado=ba" className="estado-link">
                      Bahia <span className="badge-count">18</span>
                    </Link>
                    <Link to="/asilos?estado=pe" className="estado-link">
                      Pernambuco <span className="badge-count">15</span>
                    </Link>
                    <Link to="/asilos?estado=ce" className="estado-link">
                      Ceará <span className="badge-count">12</span>
                    </Link>
                    <Link to="/asilos?estado=pb" className="estado-link">
                      Paraíba <span className="badge-count">8</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
                <div className="region-card">
                  <h4 className="region-title text-balance">Região Sul</h4>
                  <div className="estados-grid">
                    <Link to="/asilos?estado=rs" className="estado-link">
                      Rio Grande do Sul <span className="badge-count">22</span>
                    </Link>
                    <Link to="/asilos?estado=pr" className="estado-link">
                      Paraná <span className="badge-count">19</span>
                    </Link>
                    <Link to="/asilos?estado=sc" className="estado-link">
                      Santa Catarina <span className="badge-count">16</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="localizacao-cta" data-aos="zoom-in" data-aos-delay="400">
              <Link to="/asilos" className="btn btn-primary btn-lg">
                Ver Todos os Asilos
              </Link>
            </div>
          </div>
        </section>

        {/* Integrantes */}
        <section className="integrantes" id="equipe" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Nossa Equipe</h2>
            <div className="row g-4">
              <div className="col-md-6" data-aos="flip-left" data-aos-delay="100">
                <div className="team-card">
                  <div className="team-header">
                    <div className="team-icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-balance">Equipe de Recursos Humanos</h3>
                  </div>
                  <p className="team-description text-pretty">
                    Responsável pela gestão de voluntários, treinamentos e relacionamento com as instituições.
                  </p>
                  <ul className="team-list">
                    <li>Ana Caroline da Silva Santos</li>
                    <li>Evellyn Soares Ferreira</li>
                    <li>Giovanna Queiroz Carvalho</li>
                    <li>Heloisa Emanuele Gonçalves Godinho</li>
                    <li>Heloysa Beatriz Santos</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6" data-aos="flip-right" data-aos-delay="200">
                <div className="team-card">
                  <div className="team-header">
                    <div className="team-icon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h3 className="text-balance">Equipe de Informática</h3>
                  </div>
                  <p className="team-description text-pretty">
                    Responsável pelo desenvolvimento e manutenção da plataforma digital.
                  </p>
                  <ul className="team-list">
                    <li>Lucas Martins Pereira</li>
                    <li>Pedro Henrique Assunção Medeiros</li>
                    <li>Tiago de Carvalho Estrada</li>
                    <li>Vinícius Araujo Ramos</li>
                    <li>Wesley Mendes de Sousa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
            <div className="localizacao-cta" data-aos="zoom-in" data-aos-delay="400">
              <Link to="/sobrenos" className="btn btn-primary btn-lg">
                Conhecer a Equipe
              </Link>
          </div>
          
        </section>

        {/* Call to Action */}
        <section className="cta" data-aos="fade-up">
          <div className="container">
            <div className="cta-content">
              <div className="cta-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 className="cta-title text-balance">Junte-se a Nós</h2>
              <p className="cta-subtitle text-balance">
                Faça parte dessa iniciativa e nos ajude a transformar a vida dos idosos. Juntos, podemos criar momentos
                especiais e levar alegria para quem mais precisa.
              </p>
              <div className="cta-buttons" data-aos="zoom-in" data-aos-delay="200">
                <Link to="/asilos" className="btn videos-btn-cta-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Encontrar Asilos
                </Link>
                <Link to="/contato" className="btn videos-btn-cta-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Contate-nos
                </Link>
              </div>
              <div className="cta-stats">
                <div className="cta-stat-item">
                  <div className="cta-stat-number">500+</div>
                  <div className="cta-stat-label">Voluntários Ativos</div>
                </div>
                <div className="cta-stat-divider"></div>
                <div className="cta-stat-item">
                  <div className="cta-stat-number">150+</div>
                  <div className="cta-stat-label">Asilos Parceiros</div>
                </div>
                <div className="cta-stat-divider"></div>
                <div className="cta-stat-item">
                  <div className="cta-stat-number">1000+</div>
                  <div className="cta-stat-label">Idosos Atendidos</div>
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

export default Home
