"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Asilos.css"

import carouselum from "../../assets/img/carousel-1.jpg"
import carouseldois from "../../assets/img/carousel-2.jpg"
import carouseltres from "../../assets/img/carousel-3.jpg"

function Asilos() {
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [distancia, setDistancia] = useState("25")
  const [atividade, setAtividade] = useState("")
  const [loading, setLoading] = useState(false)

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
  }, [])

  const buscarAsilos = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      console.log("Buscando asilos com filtros:", { cidade, estado, distancia, atividade })
    }, 2000)
  }

  const interesseVoluntario = (asiloId) => {
    alert("Interesse registrado! Entraremos em contato em breve.")
    console.log("Interesse registrado para:", asiloId)
  }

  const carregarMaisAsilos = () => {
    console.log("Carregando mais asilos...")
  }

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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-secondary">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-light">
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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-secondary">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-light">
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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>
              <div className="hero-buttons">
                <Link to="/asilos" className="btn btn-secondary">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-light">
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
        {/* Busca e Filtros */}
        <section className="busca-asilos" id="busca-asilos" data-aos="fade-up">
          <div className="container">
            <h2 className="section-title text-balance">Encontre Asilos Próximos</h2>
            <p className="text-center lead mb-5 text-pretty">
              Use nossa ferramenta de busca para encontrar asilos que precisam de voluntários na sua região.
            </p>

            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="search-container">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="cidade" className="form-label fw-bold">
                        Cidade
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cidade"
                        placeholder="Digite sua cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="estado" className="form-label fw-bold">
                        Estado
                      </label>
                      <select
                        className="form-select"
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <option value="">Selecione o estado</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="PR">Paraná</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="BA">Bahia</option>
                        <option value="PE">Pernambuco</option>
                        <option value="CE">Ceará</option>
                        <option value="ES">Espírito Santo</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="distancia" className="form-label fw-bold">
                        Distância máxima
                      </label>
                      <select
                        className="form-select"
                        id="distancia"
                        value={distancia}
                        onChange={(e) => setDistancia(e.target.value)}
                      >
                        <option value="5">Até 5 km</option>
                        <option value="10">Até 10 km</option>
                        <option value="25">Até 25 km</option>
                        <option value="50">Até 50 km</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="atividade" className="form-label fw-bold">
                        Tipo de Atividade
                      </label>
                      <select
                        className="form-select"
                        id="atividade"
                        value={atividade}
                        onChange={(e) => setAtividade(e.target.value)}
                      >
                        <option value="">Todas as atividades</option>
                        <option value="musica">Música</option>
                        <option value="leitura">Leitura</option>
                        <option value="conversa">Conversação</option>
                        <option value="jogos">Jogos</option>
                        <option value="artesanato">Artesanato</option>
                      </select>
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-lg px-5"
                        onClick={buscarAsilos}
                        disabled={loading}
                      >
                        <i className="fas fa-search me-2"></i>
                        {loading ? "Buscando..." : "Buscar Asilos"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asilos Disponíveis */}
        <section className="asilos-section" id="asilos-proximos" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Asilos Disponíveis</h2>
            <p className="text-center text-muted mb-5 text-pretty">
              Instituições que estão buscando voluntários na sua região
            </p>

            {loading && (
              <div className="loading-indicator text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Buscando asilos próximos...</p>
              </div>
            )}

            <div className="asilos-container">
              {/* Card 1 - Lar Vicentino */}
              <div className="asilo-card" data-aos="zoom-in" data-aos-delay="100">
                <div className="asilo-header">
                  <h3 className="text-balance">Lar Vicentino</h3>
                  <span className="badge bg-success">Ativo</span>
                </div>
                <div className="asilo-info">
                  <p>
                    <strong>
                      <i className="fas fa-map-marker-alt text-primary"></i> Local:
                    </strong>{" "}
                    São Paulo, SP - 2.5 km
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-info-circle text-primary"></i> Descrição:
                    </strong>{" "}
                    Entidade sem fins lucrativos, fundada em 1972 por um grupo de Vicentinos preocupados com idosos em
                    situação de risco social e abandono.
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-hands-helping text-primary"></i> Precisamos de:
                    </strong>
                  </p>
                  <ul className="lista-atividades">
                    <li>
                      <i className="fas fa-utensils"></i> Mantimentos
                    </li>
                    <li>
                      <i className="fas fa-soap"></i> Materiais de limpeza e higiene
                    </li>
                    <li>
                      <i className="fas fa-gift"></i> Doações para bazar
                    </li>
                  </ul>
                </div>
                <div className="asilo-actions">
                  <a
                    href="https://www.larvicentino.org.br/"
                    className="btn btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>Ver Site
                  </a>
                  <button className="btn btn-primary" onClick={() => interesseVoluntario("lar-vicentino")}>
                    <i className="fas fa-heart me-1"></i>Tenho Interesse
                  </button>
                </div>
              </div>

              {/* Card 2 - Casa Luz do Caminho */}
              <div className="asilo-card" data-aos="zoom-in" data-aos-delay="200">
                <div className="asilo-header">
                  <h3 className="text-balance">Casa Luz do Caminho</h3>
                  <span className="badge bg-success">Ativo</span>
                </div>
                <div className="asilo-info">
                  <p>
                    <strong>
                      <i className="fas fa-map-marker-alt text-primary"></i> Local:
                    </strong>{" "}
                    São Paulo, SP - 4.1 km
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-info-circle text-primary"></i> Descrição:
                    </strong>{" "}
                    A "Casa Luz do Caminho" foi fundada em 08 de setembro de 1999, é uma Entidade civil beneficente,
                    filantrópica, assistencial, educacional e cultural, sem fins lucrativos.
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-hands-helping text-primary"></i> Precisamos de:
                    </strong>
                  </p>
                  <ul className="lista-atividades">
                    <li>
                      <i className="fas fa-broom"></i> Itens de limpeza
                    </li>
                    <li>
                      <i className="fas fa-soap"></i> Itens de higiene
                    </li>
                    <li>
                      <i className="fas fa-utensils"></i> Mantimentos
                    </li>
                  </ul>
                </div>
                <div className="asilo-actions">
                  <a
                    href="https://casaluzdocaminho.org.br/"
                    className="btn btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>Ver Site
                  </a>
                  <button className="btn btn-primary" onClick={() => interesseVoluntario("casa-luz-caminho")}>
                    <i className="fas fa-heart me-1"></i>Tenho Interesse
                  </button>
                </div>
              </div>

              {/* Card 3 - Casa Odina Lobo */}
              <div className="asilo-card" data-aos="zoom-in" data-aos-delay="300">
                <div className="asilo-header">
                  <h3 className="text-balance">Casa Odina Lobo</h3>
                  <span className="badge bg-warning">Urgente</span>
                </div>
                <div className="asilo-info">
                  <p>
                    <strong>
                      <i className="fas fa-map-marker-alt text-primary"></i> Local:
                    </strong>{" "}
                    São Paulo, SP - 6.8 km
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-info-circle text-primary"></i> Descrição:
                    </strong>{" "}
                    É uma instituição de longa permanência para idosos (ILPI), sem fins lucrativos, fundada em 1950.
                    Somos uma entidade totalmente Filantrópica.
                  </p>
                  <p>
                    <strong>
                      <i className="fas fa-hands-helping text-primary"></i> Precisamos de:
                    </strong>
                  </p>
                  <ul className="lista-atividades">
                    <li>
                      <i className="fas fa-donate"></i> Doações financeiras
                    </li>
                    <li>
                      <i className="fas fa-music"></i> Atividades musicais
                    </li>
                  </ul>
                </div>
                <div className="asilo-actions">
                  <a
                    href="https://casa.ondinalobo.org.br/"
                    className="btn btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>Ver Site
                  </a>
                  <button className="btn btn-primary" onClick={() => interesseVoluntario("casa-odina-lobo")}>
                    <i className="fas fa-heart me-1"></i>Tenho Interesse
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <button className="btn btn-outline-primary btn-lg" onClick={carregarMaisAsilos} disabled={loading}>
                <i className="fas fa-plus me-2"></i>Carregar Mais Asilos
              </button>
            </div>
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
              <h2 className="cta-title text-balance">Seja a Mudança na Vida de Alguém!</h2>
              <p className="cta-subtitle text-balance">
                Se você é um jovem artista, um bom ouvinte ou simplesmente quer dedicar um tempo para sorrir com um
                idoso, cadastre-se agora.
              </p>
              <div className="cta-buttons" data-aos="zoom-in" data-aos-delay="200">
                <Link to="/cadastro-voluntario" className="btn btn-primary btn-lg">
                  Cadastrar como Voluntário
                </Link>
                <Link to="/cadastro-asilo" className="btn btn-primary btn-lg">
                  Cadastrar seu Asilo
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

export default Asilos
