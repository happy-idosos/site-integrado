"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Compras.css"

function Compras() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  const products = {
    camisetas: [
      {
        id: 1,
        name: "Camiseta Happy Idosos - Branca",
        price: 60,
        image: "/white-t-shirt-with-happy-idosos-logo.jpg",
        description: "Camiseta 100% algodão com estampa exclusiva do projeto",
      },
      {
        id: 2,
        name: "Camiseta Happy Idosos - Azul",
        price: 60,
        image: "/blue-t-shirt-with-happy-idosos-logo.jpg",
        description: "Camiseta premium com a cor oficial do projeto",
      },
      {
        id: 3,
        name: "Camiseta Happy Idosos - Preta",
        price: 60,
        image: "/black-t-shirt-with-happy-idosos-logo.jpg",
        description: "Camiseta elegante com design minimalista",
      },
    ],
    canecas: [
      {
        id: 4,
        name: "Caneca Happy Idosos - Clássica",
        price: 50,
        image: "/white-ceramic-mug-with-happy-idosos-logo.jpg",
        description: "Caneca de porcelana 325ml com estampa durável",
      },
      {
        id: 5,
        name: "Caneca Happy Idosos - Colorida",
        price: 50,
        image: "/colorful-ceramic-mug-with-happy-idosos-logo.jpg",
        description: "Caneca vibrante com cores do projeto",
      },
      {
        id: 6,
        name: "Caneca Happy Idosos - Premium",
        price: 50,
        image: "/premium-ceramic-mug-with-happy-idosos-logo.jpg",
        description: "Caneca premium com acabamento especial",
      },
    ],
  }

  const handleWhatsAppClick = () => {
    const message = selectedProduct
      ? `Olá! Gostaria de comprar: ${selectedProduct.name} - R$ ${selectedProduct.price},00`
      : "Olá! Gostaria de saber mais sobre os produtos do Happy Idosos!"

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="compras-page">
      <Header />

      {/* Hero Section */}
      <section className="compras-hero" data-aos="fade-up">
        <div className="container">
          <div className="compras-hero-content">
            <h1 className="compras-hero-title text-balance">Loja Happy Idosos</h1>
            <p className="compras-hero-subtitle text-pretty">
              Adquira produtos exclusivos e ajude a transformar a vida dos idosos. Cada compra contribui diretamente
              para nossos projetos sociais.
            </p>
          </div>
        </div>
      </section>

      <main>
        {/* Camisetas Section */}
        <section className="produtos-section" data-aos="fade-up">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title text-balance">Camisetas</h2>
              <p className="section-subtitle text-pretty">
                Camisetas de alta qualidade com design exclusivo do projeto Happy Idosos
              </p>
            </div>
            <div className="produtos-grid">
              {products.camisetas.map((product, index) => (
                <div key={product.id} className="produto-card" data-aos="zoom-in" data-aos-delay={index * 100}>
                  <div className="produto-image-wrapper">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="produto-image"
                      loading="lazy"
                    />
                    <div className="produto-badge">R$ {product.price},00</div>
                  </div>
                  <div className="produto-content">
                    <h3 className="produto-name text-balance">{product.name}</h3>
                    <p className="produto-description text-pretty">{product.description}</p>
                    <button
                      className="btn btn-primary produto-btn"
                      onClick={() => {
                        setSelectedProduct(product)
                        handleWhatsAppClick()
                      }}
                    >
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
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Comprar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Canecas Section */}
        <section className="produtos-section produtos-section-alt" data-aos="fade-up">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title text-balance">Canecas</h2>
              <p className="section-subtitle text-pretty">
                Canecas de porcelana premium com estampas exclusivas e duráveis
              </p>
            </div>
            <div className="produtos-grid">
              {products.canecas.map((product, index) => (
                <div key={product.id} className="produto-card" data-aos="zoom-in" data-aos-delay={index * 100}>
                  <div className="produto-image-wrapper">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="produto-image"
                      loading="lazy"
                    />
                    <div className="produto-badge">R$ {product.price},00</div>
                  </div>
                  <div className="produto-content">
                    <h3 className="produto-name text-balance">{product.name}</h3>
                    <p className="produto-description text-pretty">{product.description}</p>
                    <button
                      className="btn btn-primary produto-btn"
                      onClick={() => {
                        setSelectedProduct(product)
                        handleWhatsAppClick()
                      }}
                    >
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
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Comprar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como São Feitas Section */}
        <section className="processo-section" data-aos="fade-up">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title text-balance">Como São Feitas Nossas Camisetas</h2>
              <p className="section-subtitle text-pretty">
                Conheça o processo de produção artesanal e sustentável dos nossos produtos
              </p>
            </div>
            <div className="processo-grid">
              <div className="processo-card" data-aos="fade-right" data-aos-delay="100">
                <div className="processo-number">01</div>
                <div className="processo-content">
                  <h3 className="processo-title text-balance">Seleção de Materiais</h3>
                  <p className="processo-description text-pretty">
                    Utilizamos apenas algodão 100% premium, selecionado cuidadosamente para garantir conforto e
                    durabilidade. Nossos fornecedores seguem práticas sustentáveis e éticas.
                  </p>
                </div>
              </div>
              <div className="processo-card" data-aos="fade-left" data-aos-delay="200">
                <div className="processo-number">02</div>
                <div className="processo-content">
                  <h3 className="processo-title text-balance">Design Exclusivo</h3>
                  <p className="processo-description text-pretty">
                    Cada estampa é criada por nossa equipe de designers em parceria com os idosos, incorporando suas
                    histórias e experiências em arte visual única.
                  </p>
                </div>
              </div>
              <div className="processo-card" data-aos="fade-right" data-aos-delay="300">
                <div className="processo-number">03</div>
                <div className="processo-content">
                  <h3 className="processo-title text-balance">Impressão de Qualidade</h3>
                  <p className="processo-description text-pretty">
                    Utilizamos técnicas de serigrafia e sublimação de alta qualidade, garantindo cores vibrantes e
                    estampas que não desbotam mesmo após várias lavagens.
                  </p>
                </div>
              </div>
              <div className="processo-card" data-aos="fade-left" data-aos-delay="400">
                <div className="processo-number">04</div>
                <div className="processo-content">
                  <h3 className="processo-title text-balance">Controle de Qualidade</h3>
                  <p className="processo-description text-pretty">
                    Cada peça passa por rigorosa inspeção de qualidade antes de ser embalada. Garantimos que você receba
                    um produto perfeito e pronto para usar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impacto Social Section */}
        <section className="impacto-section" data-aos="fade-up">
          <div className="container">
            <div className="impacto-content">
              <div className="impacto-icon" aria-hidden="true">
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
              <h2 className="impacto-title text-balance">Seu Impacto Social</h2>
              <p className="impacto-description text-balance">
                100% do lucro das vendas é revertido para nossos projetos sociais. Ao comprar nossos produtos, você está
                contribuindo diretamente para melhorar a qualidade de vida dos idosos em todo o Brasil.
              </p>
              <div className="impacto-stats">
                <div className="impacto-stat" data-aos="zoom-in" data-aos-delay="100">
                  <div className="impacto-stat-number">500+</div>
                  <div className="impacto-stat-label">Idosos Beneficiados</div>
                </div>
                <div className="impacto-stat" data-aos="zoom-in" data-aos-delay="200">
                  <div className="impacto-stat-number">50+</div>
                  <div className="impacto-stat-label">Instituições Parceiras</div>
                </div>
                <div className="impacto-stat" data-aos="zoom-in" data-aos-delay="300">
                  <div className="impacto-stat-number">1000+</div>
                  <div className="impacto-stat-label">Produtos Vendidos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="compras-cta" data-aos="fade-up">
          <div className="container">
            <div className="compras-cta-content">
              <h2 className="compras-cta-title text-balance">Faça Seu Pedido Agora</h2>
              <p className="compras-cta-subtitle text-balance">
                Entre em contato conosco pelo WhatsApp ou através do nosso formulário de contato para fazer seu pedido
              </p>
              <div className="compras-cta-buttons" data-aos="zoom-in" data-aos-delay="200">
                <button className="btn btn-whatsapp" onClick={handleWhatsAppClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Comprar pelo WhatsApp
                </button>
                <Link to="/contato" className="btn btn-secondary">
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Página de Contato
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

export default Compras
