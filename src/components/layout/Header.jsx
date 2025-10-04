"use client"

import { useLocation, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./Header.css"
import logoHappyIdosos from "../../assets/img/happyidosos.png"

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, userName, userType, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // ✅ FUNÇÃO DE LOGOUT MELHORADA
  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    navigate("/")
  }

  // ✅ FECHAR MENU MOBILE AO CLICAR EM LINK
  const handleNavClick = () => {
    setIsMobileMenu(false)
  }

  // ✅ OBTER TEXTO DO TIPO DE USUÁRIO
  const getUserTypeText = () => {
    switch(userType) {
      case 'usuario': return 'Voluntário'
      case 'asilo': return 'Asilo'
      default: return 'Usuário'
    }
  }

  // ✅ OBTER ICONE DO TIPO DE USUÁRIO
  const getUserTypeIcon = () => {
    switch(userType) {
      case 'usuario': return '👨‍⚕️'
      case 'asilo': return '🏠'
      default: return '👤'
    }
  }

  // ✅ TOGGLE MENU MOBILE
  const setIsMobileMenu = (isOpen) => {
    setIsMobileMenuOpen(isOpen)
    // Fechar menu quando clicar em um link
    if (!isOpen) {
      const navbarCollapse = document.getElementById('navbarNav')
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show')
      }
    }
  }

  return (
    <header>
      <nav className={`navbar navbar-expand-lg transparent-header ${scrolled ? "scrolled" : ""}`} id="mainNavbar">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={() => setIsMobileMenu(false)}>
            <img src={logoHappyIdosos || "/placeholder.svg"} alt="Logo Happy Idosos" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenu(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/")}`} 
                  to="/"
                  onClick={handleNavClick}
                >
                  Início
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/asilos")}`} 
                  to="/asilos"
                  onClick={handleNavClick}
                >
                  Buscar Asilos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/eventos")}`} 
                  to="/eventos"
                  onClick={handleNavClick}
                >
                  Eventos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/videos")}`} 
                  to="/videos"
                  onClick={handleNavClick}
                >
                  Vídeos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/sobrenos")}`} 
                  to="/sobrenos"
                  onClick={handleNavClick}
                >
                  Sobre Nós
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/contato")}`} 
                  to="/contato"
                  onClick={handleNavClick}
                >
                  Contato
                </Link>
              </li>
            </ul>
            
            <div className="header-buttons">
              {isAuthenticated ? (
                // ✅ USUÁRIO LOGADO - Mostrar informações e botão de sair
                <div className="d-flex align-items-center gap-3">
                  <div className="user-info">
                    <div className="user-welcome small">
                      <span className="user-icon">{getUserTypeIcon()}</span>
                      Olá, <strong>{userName}</strong>
                    </div>
                    <div className="user-type badge">
                      {getUserTypeText()}
                    </div>
                  </div>
                  
                  <Link 
                    to={userType === 'asilo' ? "/dashboard-asilo" : "/dashboard-voluntario"} 
                    className="btn btn-outline-light btn-sm"
                    onClick={handleNavClick}
                  >
                    Meu Perfil
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                    title="Sair da conta"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                // ✅ USUÁRIO NÃO LOGADO - Mostrar botões de cadastro/login
                <div className="d-flex align-items-center gap-2">
                  <Link 
                    to="/loginvoluntario" 
                    className="btn btn-outline-light btn-sm"
                    onClick={handleNavClick}
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastrovoluntario" 
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleNavClick}
                  >
                    Fazer Parte - Voluntário
                  </Link>
                  <Link 
                    to="/cadastroasilo" 
                    className="btn btn-primary btn-sm"
                    onClick={handleNavClick}
                  >
                    Fazer Parte - Asilo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header 