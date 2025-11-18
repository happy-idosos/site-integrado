"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./SobreNos.css"

import carouselum from "../../assets/img/carousels/carousel-1.jpg"
import carouseldois from "../../assets/img/carousels/carousel-2.jpg"
import carouseltres from "../../assets/img/carousels/carousel-3.jpg"

//Imagens da Equipe
import equipe from "../../assets/img/equipefoto.jpg"

//Imagens dos Integrantes TI.
import lucas from "../../assets/img/sobrenos_integrantes/Lucas Martins.jpeg"
import tiago from "../../assets/img/sobrenos_integrantes/Tiago de Carvalho.jpeg"
import pedro from "../../assets/img/sobrenos_integrantes/Pedro Henrique.jpeg"
import vinicius from "../../assets/img/sobrenos_integrantes/Vinicius Araujo.jpeg"
import wesley from "../../assets/img/sobrenos_integrantes/Wesley Mendes.jpeg"

//Imagens dos Integrantes RH
import ana from "../../assets/img/sobrenos_integrantes/Ana Caroline.jpeg"
import evellyn from "../../assets/img/sobrenos_integrantes/Evellyn Soares.png"
import giovanna from "../../assets/img/sobrenos_integrantes/Giovanna Queiroz.jpeg"
import heloisa from "../../assets/img/sobrenos_integrantes/Heloisa Emanuele.jpeg"
import heloysa from "../../assets/img/sobrenos_integrantes/Heloysa Beatriz.png"

const teamMembers = [
  {
    name: "Ana Caroline da Silva Santos",
    role: "Recursos Humanos",
    image: ana,
    instagram: "https://www.instagram.com/anacarolinessz_",
  },
  {
    name: "Evellyn Soares Ferreira",
    role: "Recursos Humanos",
    image: evellyn,
    instagram: "https://www.instagram.com/srzevllyn_",
  },
  {
    name: "Giovanna Queiroz Carvalho",
    role: "Recursos Humanos",
    image: giovanna,
    instagram: "https://www.instagram.com/gqueirozz__",
  },
  {
    name: "Heloisa Emanuele Gonçalves",
    role: "Recursos Humanos",
    image: heloisa,
    instagram: "https://www.instagram.com/helo_por_um_dia",
  },
  {
    name: "Heloysa Beatriz Santos",
    role: "Recursos Humanos",
    image: heloysa,
    instagram: "https://www.instagram.com/hel0_santos",
  },
  {
    name: "Lucas Martins Pereira",
    role: "Desenvolvedor Frontend",
    image: lucas,
    instagram: "https://www.instagram.com/_martins_lucas_",
  },
  {
    name: "Pedro Henrique Medeiros",
    role: "Desenvolvedor Backend",
    image: pedro,
    instagram: "https://www.instagram.com/phmedeirxs",
  },
  {
    name: "Tiago de Carvalho Estrada",
    role: "Desenvolvedor Frontend",
    image: tiago,
    instagram: "https://www.instagram.com/tiago_estrad",
  },
  {
    name: "Vinícius Araujo Ramos",
    role: "Analista de Sistemas",
    image: vinicius,
    instagram: "https://www.instagram.com/ramosvini_",
  },
  {
    name: "Wesley Mendes de Sousa",
    role: "DevOps e Infraestrutura",
    image: wesley,
    instagram: "https://www.instagram.com/wesmendesss",
  },
]

const SobreNos = () => {
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

  return (
    <div className="sobre-nos-page">
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
              <h2 className="carrossel text-balance">Nossa História</h2>
              <p className="text-pretty">Conheça a trajetória do Happy Idosos e nossa missão de conectar gerações...</p>
              <div className="hero-buttons">
                <a href="#historia" className="btn btn-outline-primary btn">
                  Nossa História
                </a>
                <a href="#equipe" className="btn btn-outline-primary btn">
                  Conheça a Equipe
                </a>
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
              <h2 className="carrossel text-balance">Nossa Missão</h2>
              <p className="text-pretty">
                Promover o bem-estar dos idosos através do voluntariado e conexões humanas...
              </p>
              <div className="hero-buttons">
                <a href="#missao" className="btn btn-outline-primary btn">
                  Nossa Missão
                </a>
                <a href="#valores" className="btn btn-outline-primary btn">
                  Nossos Valores
                </a>
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
              <h2 className="carrossel text-balance">Nosso Impacto</h2>
              <p className="text-pretty">Veja os resultados do nosso trabalho e como estamos transformando vidas...</p>
              <div className="hero-buttons">
                <Link to="/contato" className="btn btn-outline-primary btn">
                  Fale Conosco
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
        <section className="historia" id="historia" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">História do Projeto</h2>
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="historia-content" data-aos="fade-up" data-aos-delay="100">
                  <p className="text-pretty">
                    O Happy Idosos nasceu em 2023 com o Grupo de Recursos Humanos da Etec Profª Maria Cristina Medeiros.
                    A ideia surgiu da observação das dificuldades enfrentadas por idosos em instituições de longa
                    permanência, especialmente a solidão e a carência de vínculos afetivos. Desde o início, o projeto se
                    propôs a refletir sobre formas de integração entre gerações, reconhecendo o valor da escuta, da
                    convivência e do afeto como ferramentas de transformação social.
                  </p>

                  <p className="text-pretty">
                    Em 2025, o projeto ganhou força ao se conectar com os alunos da equipe de Técnico em Informática,
                    que trouxeram a contribuição tecnológica necessária para ampliar o alcance da iniciativa por meio da
                    internet. Essa união interdisciplinar entre Recursos Humanos e Informática possibilitou não apenas
                    discutir o aspecto humano da questão, mas também construir uma solução prática e inovadora: o
                    desenvolvimento de uma aplicação digital voltada à interação entre jovens e idosos.
                  </p>

                  <p className="text-pretty">
                    Antes disso, foi realizada uma pesquisa de campo com alunos e professores da Etec Profª Maria
                    Cristina Medeiros, que contribuíram com opiniões diversas sobre o tema da interação intergeracional.
                    A pluralidade das respostas, oriunda de diferentes faixas etárias, enriqueceu significativamente a
                    construção do projeto, proporcionando um panorama mais amplo sobre as percepções juvenis a respeito
                    dos idosos institucionalizados.
                  </p>

                  <p className="text-pretty">
                    A problemática principal que orientou todo o processo foi a carência de vínculos afetivos vivida
                    pelos idosos em instituições de longa permanência. A ausência de contato significativo com outras
                    gerações revelou a necessidade de criar espaços de diálogo e troca, onde a juventude pudesse
                    contribuir com acolhimento, atenção e voluntariado, ao mesmo tempo em que aprendia com as
                    experiências e histórias dos mais velhos.
                  </p>

                  <p className="text-pretty">
                    Para dar sustentação ao projeto, três vertentes metodológicas foram fundamentais: a investigação
                    teórica (bibliográfica e exploratória), a observação direta da realidade (pesquisa de campo,
                    incluindo visitas a asilos) e a experimentação prática por meio do desenvolvimento da aplicação
                    digital. Essa combinação permitiu unir teoria e prática, sensibilidade social e inovação
                    tecnológica, consolidando o Happy Idosos como uma proposta de impacto real e transformador.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="integrantes" id="equipe" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <div className="text-center" data-aos="zoom-in" data-aos-delay="200">
              <img src={equipe || "/placeholder.svg"} alt="Equipe Happy Idosos" className="img-fluid team-photo" />
              <p className="team-photo-caption text-balance">
                Nossa equipe multidisciplinar trabalhando juntos para transformar vidas
              </p>
            </div>
          </div>
        </section>

        <section className="team-unified" id="perfis" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Conheça Nossa Equipe</h2>
            <p className="section-subtitle text-balance">
              Profissionais dedicados trabalhando juntos para transformar vidas através da conexão entre gerações
            </p>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-member-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="800"
                >
                  <div className="member-image-container">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="member-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="member-overlay">
                      <a
                        href={member.instagram}
                        className="member-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram de ${member.name}`}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name text-balance">{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="missao-visao-valores" id="missao" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="section-title text-balance">Missão, Visão e Valores</h2>
            <div className="row g-4">
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="mvv-card">
                  <div className="mvv-icon" aria-hidden="true">
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
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-balance">Nossa Missão</h3>
                  <p className="text-pretty">
                    Conectar voluntários jovens com idosos em asilos, promovendo interações significativas que
                    enriquecem a vida de ambas as gerações através de tecnologia acessível e humanizada.
                  </p>
                </div>
              </div>
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                <div className="mvv-card">
                  <div className="mvv-icon" aria-hidden="true">
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-balance">Nossa Visão</h3>
                  <p className="text-pretty">
                    Ser a principal plataforma de conexão intergeracional no Brasil, transformando a realidade dos
                    idosos institucionalizados e criando uma sociedade mais empática e conectada.
                  </p>
                </div>
              </div>
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
                <div className="mvv-card">
                  <div className="mvv-icon" aria-hidden="true">
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
                  <h3 className="text-balance">Nossos Valores</h3>
                  <ul className="valores-list">
                    <li>
                      <strong>Empatia:</strong> Compreender e valorizar cada história
                    </li>
                    <li>
                      <strong>Respeito:</strong> Dignidade em todas as interações
                    </li>
                    <li>
                      <strong>Inovação:</strong> Tecnologia a serviço do humano
                    </li>
                    <li>
                      <strong>Transparência:</strong> Processos claros e confiáveis
                    </li>
                  </ul>
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

export default SobreNos
