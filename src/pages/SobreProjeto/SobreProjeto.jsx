"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./SobreProjeto.css"

// Import das imagens do carousel
import carouselum from "../../assets/img/carousels/carousel-8.jpg"
import carouseldois from "../../assets/img/carousels/carousel-9.jpg"
import carouseltres from "../../assets/img/carousels/carousel-7.jpg"

// Import das ODS
import ods3 from "../../assets/img/ods3.png"
import ods16 from "../../assets/img/ods16.png"

// Import das imagens dos idosos
import idosos1 from "../../assets/img/sobreprojeto/idosos1.jpeg"
import idosos2 from "../../assets/img/sobreprojeto/idosos2.jpeg"
import idosos3 from "../../assets/img/sobreprojeto/idosos3.jpeg"
import idosos4 from "../../assets/img/sobreprojeto/idosos4.jpeg"
import idosos5 from "../../assets/img/sobreprojeto/idosos5.jpeg"
import idosos6 from "../../assets/img/sobreprojeto/idosos6.jpeg"

const SobreProjeto = () => {
  const carouselRef = useRef(null)

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    // Import e inicialização do Bootstrap de forma segura
    const initializeBootstrap = async () => {
      try {
        const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js")
        
        // Inicializa o carousel se existir
        if (carouselRef.current) {
          new bootstrap.Carousel(carouselRef.current, {
            interval: 6000,
            ride: "carousel",
            pause: "hover",
            wrap: true
          })
        }
      } catch (error) {
        console.error("Erro ao carregar Bootstrap:", error)
      }
    }

    initializeBootstrap()
  }, [])

  return (
    <div className="sobre-projeto-page">
      <Header />

      {/* Hero Carousel - IDÊNTICO AO CONTATO */}
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
              <h2 className="carrossel">Conectando Voluntários e Idosos</h2>
              <p>O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo bem-estar e alegria.</p>
              <div className="carousel-buttons">
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
            <img
              src={carouseldois || "/placeholder.svg"}
              className="d-block w-100"
              alt="Enfermeira cuidando de idosa"
              loading="lazy"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel">Cuidado e Companheirismo</h2>
              <p>Promovemos momentos de alegria, cuidado e companheirismo para idosos em instituições de longa permanência.</p>
              <div className="carousel-buttons">
                <Link to="/asilos" className="btn btn-outline-primary btn">
                  Encontrar Asilos
                </Link>
                <Link to="/eventos" className="btn btn-outline-primary btnn">
                  Ver Eventos
                </Link>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={carouseltres || "/placeholder.svg"}
              className="d-block w-100"
              alt="Voluntária conversando com idosa"
              loading="lazy"
            />
            <div className="carousel-caption d-none d-md-block">
              <h2 className="carrossel">Faça a Diferença</h2>
              <p>Junte-se a nós e leve alegria, cuidado e companheirismo para idosos em instituições de longa permanência.</p>
              <div className="carousel-buttons">
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

      <section className="galeria-projeto" data-aos="fade-up" data-aos-duration="1200">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
            Aplicação Real do Projeto
          </h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="200">
            Veja como o Happy Idosos está transformando vidas e levando alegria para instituições de longa permanência
          </p>
          <div className="galeria-grid">
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="300">
              <img src={idosos1 || "/placeholder.svg"} alt="Atividade com idosos" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Atividades Recreativas</h4>
                <p className="galeria-description">
                  Momentos de descontração e alegria através de jogos, música e atividades lúdicas.
                </p>
              </div>
              <div className="galeria-badge">Diversão</div>
            </div>
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="400">
              <img src={idosos2 || "/placeholder.svg"} alt="Acompanhamento emocional" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Acompanhamento Emocional</h4>
                <p className="galeria-description">
                  Suporte psicológico e emocional para promover saúde mental e bem-estar.
                </p>
              </div>
              <div className="galeria-badge">Cuidado</div>
            </div>
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="500">
              <img src={idosos3 || "/placeholder.svg"} alt="Celebrações especiais" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Celebrações Especiais</h4>
                <p className="galeria-description">
                  Festas de aniversário, datas comemorativas e momentos especiais compartilhados.
                </p>
              </div>
              <div className="galeria-badge">Celebração</div>
            </div>
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="600">
              <img src={idosos4 || "/placeholder.svg"} alt="Atividades físicas" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Exercícios Físicos</h4>
                <p className="galeria-description">
                  Atividades físicas adaptadas para manter a mobilidade e saúde dos idosos.
                </p>
              </div>
              <div className="galeria-badge">Saúde</div>
            </div>
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="700">
              <img src={idosos5 || "/placeholder.svg"} alt="Oficinas criativas" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Oficinas Criativas</h4>
                <p className="galeria-description">
                  Trabalhos manuais, artesanato e expressão artística para estimular a criatividade.
                </p>
              </div>
              <div className="galeria-badge">Criatividade</div>
            </div>
            <div className="galeria-item" data-aos="zoom-in" data-aos-delay="800">
              <img src={idosos6 || "/placeholder.svg"} alt="Integração social" className="galeria-image" />
              <div className="galeria-overlay">
                <h4 className="galeria-title">Integração Social</h4>
                <p className="galeria-description">
                  Promovendo a socialização e construção de novas amizades entre os participantes.
                </p>
              </div>
              <div className="galeria-badge">Socialização</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ods-section" data-aos="fade-up" data-aos-duration="1200">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
            Alinhamento com os ODS
          </h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="200">
            Nosso projeto está diretamente alinhado com os Objetivos de Desenvolvimento Sustentável da ONU
          </p>
          <div className="ods-grid">
            <div className="ods-card" data-aos="fade-up" data-aos-delay="300">
              <div className="ods-image-container">
                <img src={ods3 || "/placeholder.svg"} alt="ODS 3 - Saúde e Bem-Estar" className="ods-image" />
              </div>
              <div className="ods-content">
                <h3 className="ods-title">ODS 3 - Saúde e Bem-Estar</h3>
                <p className="ods-description">
                  Assegurar uma vida saudável e promover o bem-estar para todos, em todas as idades.
                </p>
                <ul className="ods-list">
                  <li>Promoção da saúde mental e emocional dos idosos</li>
                  <li>Atividades físicas adaptadas para a terceira idade</li>
                  <li>Acompanhamento psicológico e emocional</li>
                  <li>Prevenção de doenças através de hábitos saudáveis</li>
                </ul>
              </div>
            </div>
            <div className="ods-card" data-aos="fade-up" data-aos-delay="400">
              <div className="ods-image-container">
                <img src={ods16 || "/placeholder.svg"} alt="ODS 16 - Paz, Justiça e Instituições Eficazes" className="ods-image" />
              </div>
              <div className="ods-content">
                <h3 className="ods-title">ODS 16 - Paz, Justiça e Instituições Eficazes</h3>
                <p className="ods-description">
                  Promover sociedades pacíficas e inclusivas para o desenvolvimento sustentável.
                </p>
                <ul className="ods-list">
                  <li>Inclusão social da população idosa</li>
                  <li>Fortalecimento de instituições que cuidam de idosos</li>
                  <li>Promoção da igualdade e direitos dos idosos</li>
                  <li>Transparência e prestação de contas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sustentabilidade" data-aos="fade-up" data-aos-duration="1200">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
            Modelo de Sustentabilidade
          </h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="200">
            Conheça nosso compromisso com a sustentabilidade e o impacto positivo que geramos na vida dos idosos
          </p>
          <div className="sustentabilidade-content" data-aos="fade-up" data-aos-delay="300">
            <div className="sustentabilidade-grid">
              <div className="modelo-content">
                <h3 data-aos="fade-up" data-aos-delay="400">
                  Sustentabilidade que Transforma Vidas
                </h3>
                <p className="modelo-text" data-aos="fade-up" data-aos-delay="500">
                  Nosso modelo de sustentabilidade é baseado em três pilares fundamentais: impacto social positivo,
                  viabilidade econômica e responsabilidade ambiental. Através de parcerias estratégicas e do
                  engajamento da comunidade, garantimos a continuidade e o crescimento do projeto.
                </p>
                <div className="principios-grid">
                  <div className="principio-item" data-aos="fade-up" data-aos-delay="600">
                    <div className="principio-icon">🌱</div>
                    <div className="principio-content">
                      <h5>Sustentabilidade Social</h5>
                      <p>
                        Promovemos o bem-estar e a inclusão social dos idosos através de atividades regulares e
                        acompanhamento personalizado.
                      </p>
                    </div>
                  </div>
                  <div className="principio-item" data-aos="fade-up" data-aos-delay="700">
                    <div className="principio-icon">💚</div>
                    <div className="principio-content">
                      <h5>Viabilidade Econômica</h5>
                      <p>
                        Desenvolvemos um modelo de negócio sustentável que garante a continuidade do projeto através de
                        doações, parcerias e captação de recursos.
                      </p>
                    </div>
                  </div>
                  <div className="principio-item" data-aos="fade-up" data-aos-delay="800">
                    <div className="principio-icon">🌍</div>
                    <div className="principio-content">
                      <h5>Responsabilidade Ambiental</h5>
                      <p>
                        Implementamos práticas sustentáveis em todas as nossas atividades, reduzindo nosso impacto
                        ambiental e promovendo a conscientização.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="doacoes-section" data-aos="fade-up" data-aos-delay="400">
                <div className="doacoes-header">
                  <div className="doacoes-icon">💝</div>
                  <h3 className="doacoes-title">Faça Parte Dessa Transformação</h3>
                  <p className="doacoes-subtitle">
                    Sua doação é fundamental para mantermos e expandirmos nosso trabalho. Cada contribuição nos ajuda a
                    levar mais alegria, cuidado e dignidade para idosos em instituições de longa permanência.
                  </p>
                </div>

                <div className="doacao-info-box">
                  <div className="info-item" data-aos="fade-up" data-aos-delay="500">
                    <div className="info-icon">🏦</div>
                    <div className="info-content">
                      <h4>Transferência Bancária</h4>
                      <p>
                        Realize sua doação via transferência bancária para nossa conta corrente. Dados bancários
                        disponíveis abaixo.
                      </p>
                    </div>
                  </div>

                  <div className="info-item" data-aos="fade-up" data-aos-delay="600">
                    <div className="info-icon">📱</div>
                    <div className="info-content">
                      <h4>PIX Instantâneo</h4>
                      <p>
                        Utilize nossa chave PIX para doações rápidas e seguras. Escaneie o QR Code ou use a chave PIX
                        abaixo.
                      </p>
                    </div>
                  </div>

                  <div className="cnpj-box" data-aos="zoom-in" data-aos-delay="700">
                    <div className="cnpj-label">CNPJ para Doação</div>
                    <div className="cnpj-number">12.345.678/0001-90</div>
                    <div className="cnpj-subtitle">Associação Happy Idosos</div>
                  </div>

                  <div className="info-item" data-aos="fade-up" data-aos-delay="800">
                    <div className="info-icon">📄</div>
                    <div className="info-content">
                      <h4>Recibo para Dedução Fiscal</h4>
                      <p>
                        Emitimos recibo para todas as doações, permitindo dedução no imposto de renda de pessoas físicas
                        e jurídicas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="doacao-footer" data-aos="fade-up" data-aos-delay="900">
                  <p>
                    <strong>Transparência Total:</strong> Prestamos contas regularmente de todos os recursos
                    recebidos e aplicados.
                  </p>
                  <small>
                    Sua doação é 100% destinada aos projetos de cuidado e bem-estar dos idosos. Administração: máximo de
                    10% para custos operacionais.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" data-aos="fade-up" data-aos-duration="1200">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon" data-aos="zoom-in" data-aos-delay="200">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="cta-title" data-aos="fade-up" data-aos-delay="300">
              Pronto para Fazer a Diferença?
            </h2>
            <p className="cta-subtitle" data-aos="fade-up" data-aos-delay="400">
              Tem alguma dúvida? Entre em contato conosco e descubra como você pode ajudar a transformar a vida de idosos em instituições de longa permanência.
            </p>
            <div className="cta-buttons" data-aos="fade-up" data-aos-delay="500">
              <Link to="/contato" className="videos-btn-cta-secondary">
                <span>Entre em contato</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SobreProjeto