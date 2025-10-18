"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./Footer.css"

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="footer">
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="footer-brand">
              <h5>Happy Idosos</h5>
              <p>Conectando voluntários e idosos para um mundo melhor.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Links Rápidos</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/asilos">Buscar Asilos</Link>
              </li>
              <li>
                <Link to="/eventos">Eventos</Link>
              </li>
              <li>
                <Link to="/contato">Contato</Link>
              </li>
              <li>
                <Link to="/termosdeuso">Termos de Uso</Link>
              </li>
              <li>
                <Link to="/politicadeprivacidade">Política de Privacidade</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Contato</h5>
            <div className="contact-info">
              <p>
                <svg
                  className="contact-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email: happyidosos@gmail.com
              </p>
              <p>
                <svg
                  className="contact-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Telefone: (11) 1234-5678
              </p>
              <div className="social-media">
                <a
                  href="https://www.instagram.com/happyidosos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-link"
                  aria-label="Siga-nos no Instagram"
                >
                  <svg className="instagram-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></rect>
                    <path
                      d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <line
                      x1="17.5"
                      y1="6.5"
                      x2="17.51"
                      y2="6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></line>
                  </svg>
                  Siga-nos no Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Happy Idosos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
