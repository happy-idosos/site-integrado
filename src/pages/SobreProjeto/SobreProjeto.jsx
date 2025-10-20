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
import ods4 from "../../assets/img/ods4.png"
import ods9 from "../../assets/img/ods9.png"
import ods10 from "../../assets/img/ods10.png"

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
            wrap: true,
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
              <p>
                O projeto Happy Idosos facilita o acesso entre voluntários e entidades que cuidam de idosos, promovendo
                bem-estar e alegria.
              </p>

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
              <p>
                Promovemos momentos de alegria, cuidado e companheirismo para idosos em instituições de longa
                permanência.
              </p>

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
              <p>
                Junte-se a nós e leve alegria, cuidado e companheirismo para idosos em instituições de longa
                permanência.
              </p>

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
                <h4 className="galeria-title">Celebrações Especiais</h4>
                <p className="galeria-description">
                  Suporte psicológico e emocional para promover saúde mental e bem-estar.
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
                  <li>Promoção da saúde física, mental e emocional dos idosos</li>
                  <li>Incentivo a interações sociais e atividades culturais</li>
                  <li>Combate à solidão e depressão através da troca geracional</li>
                  <li>Estímulo a hábitos saudáveis e fortalecimento da autoestima</li>
                </ul>
              </div>
            </div>

            <div className="ods-card" data-aos="fade-up" data-aos-delay="400">
              <div className="ods-image-container">
                <img src={ods4 || "/placeholder.svg"} alt="ODS 4 - Educação de Qualidade" className="ods-image" />
              </div>
              <div className="ods-content">
                <h3 className="ods-title">ODS 4 - Educação de Qualidade</h3>
                <p className="ods-description">
                  Assegurar a educação inclusiva e equitativa de qualidade, e promover oportunidades de aprendizagem ao
                  longo da vida.
                </p>
                <ul className="ods-list">
                  <li>Compartilhamento de saberes entre jovens e idosos</li>
                  <li>Valorização do conhecimento tradicional e tecnológico</li>
                  <li>Aprendizagem ao longo da vida através de oficinas</li>
                  <li>Inclusão digital e cultural para a terceira idade</li>
                </ul>
              </div>
            </div>

            <div className="ods-card" data-aos="fade-up" data-aos-delay="500">
              <div className="ods-image-container">
                <img
                  src={ods9 || "/placeholder.svg"}
                  alt="ODS 9 - Indústria, Inovação e Infraestrutura"
                  className="ods-image"
                />
              </div>
              <div className="ods-content">
                <h3 className="ods-title">ODS 9 - Indústria, Inovação e Infraestrutura</h3>
                <p className="ods-description">
                  Construir infraestruturas resilientes, promover a industrialização inclusiva e sustentável e fomentar
                  a inovação.
                </p>
                <ul className="ods-list">
                  <li>Tecnologias web modernas e acessíveis</li>
                  <li>Ambiente digital inovador e sustentável</li>
                  <li>Recursos como mapas interativos e áreas de comunidade</li>
                  <li>Fortalecimento da infraestrutura digital do projeto</li>
                </ul>
              </div>
            </div>

            <div className="ods-card" data-aos="fade-up" data-aos-delay="600">
              <div className="ods-image-container">
                <img src={ods10 || "/placeholder.svg"} alt="ODS 10 - Redução das Desigualdades" className="ods-image" />
              </div>
              <div className="ods-content">
                <h3 className="ods-title">ODS 10 - Redução das Desigualdades</h3>
                <p className="ods-description">
                  Reduzir a desigualdade dentro dos países e entre eles, promovendo a inclusão social, econômica e
                  política.
                </p>
                <ul className="ods-list">
                  <li>Redução de barreiras sociais e geracionais</li>
                  <li>Aproximação entre jovens e idosos em espaço de respeito</li>
                  <li>Visibilidade e voz para grupos marginalizados</li>
                  <li>Promoção da equidade e reconhecimento da diversidade</li>
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
                  viabilidade econômica e responsabilidade ambiental. Através de parcerias estratégicas e do engajamento
                  da comunidade, garantimos a continuidade e o crescimento do projeto.
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

                <div className="doacao-methods">
                  <h4 className="methods-title">Como Doar</h4>

                  <div className="method-card" data-aos="fade-up" data-aos-delay="500">
                    <div className="method-header">
                      <div className="method-icon">🏦</div>
                      <h5>Transferência Bancária</h5>
                    </div>
                    <p className="method-description">
                      Realize sua doação via transferência bancária diretamente para nossa conta.
                    </p>
                    <div className="method-details">
                      <div className="detail-item">
                        <span className="detail-label">Banco:</span>
                        <span className="detail-value">Banco do Brasil</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Agência:</span>
                        <span className="detail-value">1234-5</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Conta:</span>
                        <span className="detail-value">67890-1</span>
                      </div>
                    </div>
                  </div>

                  <div className="method-card" data-aos="fade-up" data-aos-delay="600">
                    <div className="method-header">
                      <div className="method-icon">📱</div>
                      <h5>PIX Instantâneo</h5>
                    </div>
                    <p className="method-description">Utilize nossa chave PIX para doações rápidas e seguras.</p>
                    <div className="pix-key-box">
                      <span className="pix-label">Chave PIX (CNPJ)</span>
                      <span className="pix-key">12.345.678/0001-90</span>
                      <button className="copy-button" onClick={() => navigator.clipboard.writeText("12345678000190")}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div className="cnpj-highlight" data-aos="zoom-in" data-aos-delay="700">
                    <div className="cnpj-content">
                      <div className="cnpj-label">CNPJ da Instituição</div>
                      <div className="cnpj-number">12.345.678/0001-90</div>
                      <div className="cnpj-subtitle">Associação Happy Idosos</div>
                    </div>
                  </div>

                  <div className="benefits-box" data-aos="fade-up" data-aos-delay="800">
                    <h5 className="benefits-title">Benefícios Fiscais</h5>
                    <div className="benefit-item">
                      <svg
                        className="benefit-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Recibo para dedução no Imposto de Renda</span>
                    </div>
                    <div className="benefit-item">
                      <svg
                        className="benefit-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Válido para pessoas físicas e jurídicas</span>
                    </div>
                    <div className="benefit-item">
                      <svg
                        className="benefit-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Transparência total na prestação de contas</span>
                    </div>
                  </div>
                </div>

                <div className="doacao-footer" data-aos="fade-up" data-aos-delay="900">
                  <div className="impact-message">
                    <strong>100% do valor doado</strong> é destinado aos projetos de cuidado e bem-estar dos idosos.
                  </div>
                  <small className="transparency-note">
                    Prestamos contas regularmente de todos os recursos recebidos e aplicados. Máximo de 10% para custos
                    operacionais.
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
              Tem alguma dúvida? Entre em contato conosco e descubra como você pode ajudar a transformar a vida de
              idosos em instituições de longa permanência.
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
