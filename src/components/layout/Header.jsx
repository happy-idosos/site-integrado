"use client"

import { useLocation, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./Header.css"
import logoHappyIdosos from "../../assets/img/happyidosos.png"

function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <header>
      <nav className={`navbar navbar-expand-lg transparent-header ${scrolled ? "scrolled" : ""}`} id="mainNavbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logoHappyIdosos || "/placeholder.svg"} alt="Logo Happy Idosos" style={{ height: "80px" }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/")}`} to="/">
                  Início
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/asilos")}`} to="/asilos">
                  Buscar Asilos
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/eventos")}`} to="/eventos">
                  Eventos
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/videos")}`} to="/videos">
                  Vídeos
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/sobrenos")}`} to="/sobrenos">
                  Sobre Nós
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/contato")}`} to="/contato">
                  Contato
                </Link>
              </li>
            </ul>
            <div className="header-buttons">
              <Link to="/cadastrovoluntario" className="btn btn-outline-primary">
                Fazer Parte - Voluntário
              </Link>
              <Link to="/cadastroasilo" className="btn btn-primary">
                Fazer Parte - Asilo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
