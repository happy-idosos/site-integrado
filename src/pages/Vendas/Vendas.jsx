"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Vendas.css"

// Camisetas - MODELOS DIFERENTES para cada cor
import camisetaBranca from "../../assets/img/Vendas/Camiseta Fundo Branco.png"
import camisetaPreta from "../../assets/img/Vendas/Camiseta Fundo Preto.png"

// Canecas Clássicas - MODELOS DIFERENTES para cada cor
import canecaClassicaBranca from "../../assets/img/Vendas/Caneca1 Fundo Branco.png"
import canecaClassicaPreta from "../../assets/img/Vendas/Caneca1 Fundo Preto.png"

// Canecas Premium - MODELOS DIFERENTES para cada cor
import canecaPremiumBranca from "../../assets/img/Vendas/Caneca2 Fundo Branco.png"
import canecaPremiumPreta from "../../assets/img/Vendas/Caneca2 Fundo Preto.png"

function Vendas() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeFilter, setActiveFilter] = useState("todos")
  const [selectedVariants, setSelectedVariants] = useState({})

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })
    window.scrollTo(0, 0)
  }, [])

  const products = {
    camisetas: [
      {
        id: 1,
        name: "Camiseta Happy Idosos",
        price: 60,
        description: "Camiseta 100% algodão com estampa exclusiva do projeto Happy Idosos",
        category: "camiseta",
        tag: "Mais Vendida",
        variants: [
          { 
            id: "white", 
            name: "Branca", 
            image: camisetaBranca, // MODELO BRANCO
            color: "#ffffff" 
          },
          { 
            id: "black", 
            name: "Preta", 
            image: camisetaPreta, // MODELO PRETO (IMAGEM DIFERENTE)
            color: "#1a1a1a" 
          },
        ],
      },
    ],
    canecas: [
      {
        id: 3,
        name: "Caneca Happy Idosos - Clássica",
        price: 50,
        description: "Caneca de porcelana 325ml com estampa durável e design clássico",
        category: "caneca",
        tag: "Clássica",
        variants: [
          { 
            id: "white", 
            name: "Branca", 
            image: canecaClassicaBranca, // MODELO BRANCO
            color: "#ffffff" 
          },
          { 
            id: "black", 
            name: "Preta", 
            image: canecaClassicaPreta, // MODELO PRETO (IMAGEM DIFERENTE)
            color: "#1a1a1a" 
          },
        ],
      },
      {
        id: 5,
        name: "Caneca Happy Idosos - Premium",
        price: 50,
        description: "Caneca premium com acabamento especial e design exclusivo",
        category: "caneca",
        tag: "Premium",
        variants: [
          { 
            id: "white", 
            name: "Branca", 
            image: canecaPremiumBranca, // MODELO BRANCO
            color: "#ffffff" 
          },
          { 
            id: "black", 
            name: "Preta", 
            image: canecaPremiumPreta, // MODELO PRETO (IMAGEM DIFERENTE)
            color: "#1a1a1a" 
          },
        ],
      },
    ],
  }

  const allProducts = [...products.camisetas, ...products.canecas]
  const filteredProducts =
    activeFilter === "todos" ? allProducts : allProducts.filter((p) => p.category === activeFilter)

  const getSelectedVariant = (productId) => {
    return selectedVariants[productId] || 0
  }

  const handleVariantSelect = (productId, variantIndex) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }

  const handleWhatsAppClick = (product) => {
    const selectedColor = selectedVariants[product.id] || 0
    const variant = product.variants[selectedColor]
    
    const message = `Olá! Gostaria de comprar: ${product.name} - Cor ${variant.name} - R$ ${product.price},00`
    const whatsappUrl = `https://wa.me/5511974731651?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="vendas-page">
      <Header />

      <section className="vendas-hero" data-aos="fade-up">
        <div className="container">
          <div className="vendas-hero-content">
            <h1 className="vendas-hero-title text-balance">Loja Happy Idosos</h1>
            <p className="vendas-hero-subtitle text-pretty">
              Adquira produtos exclusivos e ajude a transformar a vida dos idosos. Cada compra contribui diretamente
              para nossos projetos sociais.
            </p>
          </div>
        </div>
      </section>

      <main>
        <section className="vendas-filter-section">
          <div className="container">
            <div className="vendas-filter-container">
              <button
                className={`vendas-filter-btn ${activeFilter === "todos" ? "active" : ""}`}
                onClick={() => setActiveFilter("todos")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Todos os Produtos
              </button>
              <button
                className={`vendas-filter-btn ${activeFilter === "camiseta" ? "active" : ""}`}
                onClick={() => setActiveFilter("camiseta")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                </svg>
                Camisetas
              </button>
              <button
                className={`vendas-filter-btn ${activeFilter === "caneca" ? "active" : ""}`}
                onClick={() => setActiveFilter("caneca")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 010 8h-1" />
                  <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                Canecas
              </button>
            </div>
          </div>
        </section>

        <section className="vendas-produtos-section" data-aos="fade-up">
          <div className="container">
            <div className="vendas-section-header">
              <h2 className="vendas-section-title text-balance">
                {activeFilter === "todos" && "Nossos Produtos"}
                {activeFilter === "camiseta" && "Camisetas"}
                {activeFilter === "caneca" && "Canecas"}
              </h2>
              <p className="vendas-section-subtitle text-pretty">
                {activeFilter === "todos" && "Produtos de alta qualidade com design exclusivo do projeto Happy Idosos"}
                {activeFilter === "camiseta" &&
                  "Camisetas de alta qualidade com design exclusivo do projeto Happy Idosos"}
                {activeFilter === "caneca" && "Canecas de porcelana premium com estampas exclusivas e duráveis"}
              </p>
            </div>
            <div className="vendas-produtos-grid">
              {filteredProducts.map((product, index) => {
                const selectedVariantIndex = getSelectedVariant(product.id)
                const currentVariant = product.variants[selectedVariantIndex]
                
                return (
                  <div key={product.id} className="vendas-produto-card" data-aos="zoom-in" data-aos-delay={index * 100}>
                    <div className="vendas-produto-image-wrapper">
                      <img
                        src={currentVariant.image}
                        alt={`${product.name} - ${currentVariant.name}`}
                        className="vendas-produto-image"
                        loading="lazy"
                      />
                      <div className="vendas-produto-badge">R$ {product.price},00</div>
                      {product.tag && <div className="vendas-produto-tag">{product.tag}</div>}
                    </div>
                    <div className="vendas-produto-content">
                      <h3 className="vendas-produto-name text-balance">{product.name}</h3>
                      <p className="vendas-produto-description text-pretty">{product.description}</p>
                      
                      <div className="vendas-produto-variants">
                        <span className="vendas-variant-label">Cor: {currentVariant.name}</span>
                        <div className="vendas-variant-options">
                          {product.variants.map((variant, variantIndex) => (
                            <button
                              key={variant.id}
                              className={`vendas-variant-btn ${selectedVariantIndex === variantIndex ? "active" : ""}`}
                              onClick={() => handleVariantSelect(product.id, variantIndex)}
                              aria-label={`Selecionar cor ${variant.name}`}
                              title={variant.name}
                            >
                              <span 
                                className="vendas-variant-color" 
                                style={{ 
                                  backgroundColor: variant.color,
                                  border: variant.color === '#ffffff' ? '2px solid #e0e0e0' : 'none'
                                }}
                              />
                              {selectedVariantIndex === variantIndex && (
                                <svg 
                                  className="vendas-variant-check" 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        className="vendas-produto-btn"
                        onClick={() => handleWhatsAppClick(product)}
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
                        <span>Comprar Agora</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="vendas-processo-section" data-aos="fade-up">
          <div className="container">
            <div className="vendas-section-header">
              <h2 className="vendas-section-title text-balance">Como São Feitos Nossos Produtos</h2>
              <p className="vendas-section-subtitle text-pretty">
                Conheça o processo de produção artesanal e sustentável dos nossos produtos
              </p>
            </div>
            <div className="vendas-processo-grid">
              <div className="vendas-processo-card" data-aos="fade-right" data-aos-delay="100">
                <div className="vendas-processo-number">01</div>
                <div className="vendas-processo-content">
                  <h3 className="vendas-processo-title text-balance">Seleção de Materiais</h3>
                  <p className="vendas-processo-description text-pretty">
                    Utilizamos apenas algodão 100% premium e porcelana de alta qualidade, selecionados cuidadosamente
                    para garantir conforto e durabilidade. Nossos fornecedores seguem práticas sustentáveis e éticas.
                  </p>
                </div>
              </div>
              <div className="vendas-processo-card" data-aos="fade-left" data-aos-delay="200">
                <div className="vendas-processo-number">02</div>
                <div className="vendas-processo-content">
                  <h3 className="vendas-processo-title text-balance">Design Exclusivo</h3>
                  <p className="vendas-processo-description text-pretty">
                    Cada estampa é criada por nossa equipe de designers em parceria com os idosos, incorporando suas
                    histórias e experiências em arte visual única e significativa.
                  </p>
                </div>
              </div>
              <div className="vendas-processo-card" data-aos="fade-right" data-aos-delay="300">
                <div className="vendas-processo-number">03</div>
                <div className="vendas-processo-content">
                  <h3 className="vendas-processo-title text-balance">Impressão de Qualidade</h3>
                  <p className="vendas-processo-description text-pretty">
                    Utilizamos técnicas de serigrafia e sublimação de alta qualidade, garantindo cores vibrantes e
                    estampas que não desbotam mesmo após várias lavagens.
                  </p>
                </div>
              </div>
              <div className="vendas-processo-card" data-aos="fade-left" data-aos-delay="400">
                <div className="vendas-processo-number">04</div>
                <div className="vendas-processo-content">
                  <h3 className="vendas-processo-title text-balance">Controle de Qualidade</h3>
                  <p className="vendas-processo-description text-pretty">
                    Cada peça passa por rigorosa inspeção de qualidade antes de ser embalada. Garantimos que você receba
                    um produto perfeito e pronto para usar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vendas-impacto-section" data-aos="fade-up">
          <div className="container">
            <div className="vendas-impacto-content">
              <div className="vendas-impacto-icon" aria-hidden="true">
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
              <h2 className="vendas-impacto-title text-balance">Seu Impacto Social</h2>
              <p className="vendas-impacto-description text-balance">
                90% do lucro das vendas é revertido para nossos projetos sociais. Ao comprar nossos produtos, você está
                contribuindo diretamente para melhorar a qualidade de vida dos idosos em todo o Brasil. Os demais 10% são 
                revertidos para manter os custos operacionais mensais do projeto.              
              </p>
            </div>
          </div>
        </section>

       <section className="vendas-cta" data-aos="fade-up">
          <div className="container">
            <div className="vendas-cta-content">
              <h2 className="vendas-cta-title">Faça Seu Pedido Agora</h2>
              <p className="vendas-cta-subtitle">
                Entre em contato conosco pelo WhatsApp para fazer seu pedido
              </p>
              <div className="vendas-cta-buttons" data-aos="zoom-in" data-aos-delay="200">
                <button className="vendas-btn-whatsapp" onClick={() => window.open('https://wa.me/5511974731651', '_blank')}>
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Vendas