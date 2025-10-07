"use client"

import { asilosService } from '/src/services/asilos/asilos.service.js';
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Asilos.css"

import carouselum from "../../assets/img/carousels/carousel-9.jpg"
import carouseldois from "../../assets/img/carousels/carousel-7.jpg"
import carouseltres from "../../assets/img/carousels/carousel-8.jpg"

function Asilos() {
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [distancia, setDistancia] = useState("25")
  const [atividade, setAtividade] = useState("")
  const [loading, setLoading] = useState(false)
  const [asilosEncontrados, setAsilosEncontrados] = useState([])

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

  const buscarAsilos = async () => {
    setLoading(true)

    // Validação
    if (!cidade.trim() || !estado) {
      alert('Por favor, preencha cidade e estado.')
      setLoading(false)
      return
    }

    try {
      // Formata os dados EXATAMENTE como o backend espera
      const filtros = {
        cidade: cidade.trim(),
        estado: estado,
        distancia: parseInt(distancia) || 10
        // O backend não usa "atividade" - vamos filtrar no frontend
      }
      
      console.log('🎯 Enviando para backend:', filtros)
      
      const resultado = await asilosService.buscarAsilos(filtros)

      // O backend retorna {status: 200, asilos: [...]} ou {status: 400/404, message: "..."}
      if (resultado.status === 200) {
        let asilosDoBackend = resultado.asilos || []
        
        // Aplica filtro de atividade NO FRONTEND (backend não suporta)
        if (atividade) {
          asilosDoBackend = asilosDoBackend.filter(asilo => {
            if (!asilo.atividades) return false
            return asilo.atividades.toLowerCase().includes(atividade.toLowerCase())
          })
        }
        
        setAsilosEncontrados(asilosDoBackend)
        console.log('✅ Asilos encontrados:', asilosDoBackend)
        
        if (asilosDoBackend.length === 0) {
          alert('Nenhum asilo encontrado com os filtros aplicados.')
        }
      } else {
        // Erro do backend (400, 404, etc)
        alert(resultado.message || 'Erro na busca de asilos')
        setAsilosEncontrados([])
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error)
      alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
      setAsilosEncontrados([])
    } finally {
      setLoading(false)
    }
  }

  const carregarMaisAsilos = () => {
    console.log("Carregando mais asilos...")
    // Aqui você pode adicionar a lógica para carregar mais resultados
  }

  const interesseVoluntario = (asiloId) => {
    alert("Interesse registrado! Entraremos em contato em breve.")
    console.log("Interesse registrado para:", asiloId)
  }

  // Função para renderizar os asilos da API
  const renderAsilosAPI = () => {
    if (!asilosEncontrados || asilosEncontrados.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">Nenhum asilo encontrado</h4>
          <p className="text-muted">Tente ajustar os filtros de busca.</p>
        </div>
      )
    }
    
    return asilosEncontrados.map((asilo, index) => (
      <div key={asilo.id_asilo || index} className="asilo-card" data-aos="zoom-in" data-aos-delay={(index % 3) * 100}>
        <div className="asilo-header">
          <h3 className="text-balance">{asilo.nome || "Asilo Sem Nome"}</h3>
          <span className="badge bg-success">Disponível</span>
        </div>
        <div className="asilo-info">
          <p>
            <strong>
              <i className="fas fa-map-marker-alt text-primary"></i> Local:
            </strong>{" "}
            {asilo.cidade || "Cidade não informada"}, {asilo.estado || "Estado não informado"}
            {asilo.distancia_km && ` - ${asilo.distancia_km} km de distância`}
          </p>
          
          {asilo.endereco && (
            <p>
              <strong>
                <i className="fas fa-map text-primary"></i> Endereço:
              </strong>{" "}
              {asilo.endereco}
            </p>
          )}
          
          {asilo.descricao && (
            <p>
              <strong>
                <i className="fas fa-info-circle text-primary"></i> Descrição:
              </strong>{" "}
              {asilo.descricao}
            </p>
          )}

          {asilo.telefone && (
            <p>
              <strong>
                <i className="fas fa-phone text-primary"></i> Telefone:
              </strong>{" "}
              {asilo.telefone}
            </p>
          )}

          {asilo.email && (
            <p>
              <strong>
                <i className="fas fa-envelope text-primary"></i> Email:
              </strong>{" "}
              {asilo.email}
            </p>
          )}

          {asilo.atividades && (
            <>
              <p>
                <strong>
                  <i className="fas fa-hands-helping text-primary"></i> Atividades:
                </strong>
              </p>
              <ul className="lista-atividades">
                {asilo.atividades.split(',').map((atividade, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check"></i> {atividade.trim()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="asilo-actions">
          <button className="btn btn-primary" onClick={() => interesseVoluntario(asilo.id_asilo)}>
            <i className="fas fa-heart me-1"></i>Tenho Interesse
          </button>
        </div>
      </div>
    ))
  }

  return (
    <div className="home-page">
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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>
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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>
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

            {/* RESULTADOS DA API */}
            {asilosEncontrados && asilosEncontrados.length > 0 && (
              <div className="mb-5">
                <h3 className="text-center mb-4 text-success">
                  <i className="fas fa-search me-2"></i>
                  Resultados da Busca ({asilosEncontrados.length} asilos encontrados)
                </h3>
                <div className="asilos-container">
                  {renderAsilosAPI()}
                </div>
              </div>
            )}

            {!loading && asilosEncontrados.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-home fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Nenhum asilo para exibir</h4>
                <p className="text-muted">Use os filtros acima para encontrar asilos próximos a você.</p>
              </div>
            )}

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
                <Link to="/cadastrovoluntario" className="btn videos-btn-cta-secondary">
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
                  Tornar-se Voluntário
                </Link>
                <Link to="/cadastroasilo" className="btn videos-btn-cta-primary">
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
                    <path d="M21 15v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
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