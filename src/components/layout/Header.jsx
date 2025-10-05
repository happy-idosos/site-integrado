"use client"

import { useLocation, Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "../../hooks/useAuth"
import "./Header.css"
import logoHappyIdosos from "../../assets/img/happyidosos.png"
import LoginModal from "./LoginModal"
import LogoutModal from "./LogoutModal"

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, userName, userType, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const navbarRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // Fechar menu ao clicar fora
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    // Fechar menu ao pressionar ESC
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  // ✅ TOGGLE DO MENU MOBILE
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // ✅ FECHAR MENU AO CLICAR EM LINK
  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  // ✅ FUNÇÃO DE LOGOUT
  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    setIsLogoutModalOpen(false)
    navigate("/")
  }

  // ✅ ABRIR MODAL DE LOGOUT
  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  // ✅ ABRIR MODAL DE LOGIN
  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsMobileMenuOpen(false)
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

  // ✅ OBTER ROTA DO PERFIL
  const getProfileRoute = () => {
    switch(userType) {
      case 'usuario': return '/perfilvoluntario'
      case 'asilo': return '/perfilasilo'
      default: return '/'
    }
  }

  return (
    <header ref={navbarRef}>
      <nav className={`navbar navbar-expand-lg transparent-header ${scrolled ? "scrolled" : ""}`} id="mainNavbar">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={handleNavClick}>
            <img src={logoHappyIdosos || "/placeholder.svg"} alt="Logo Happy Idosos" />
          </Link>
          
          {/* ✅ BOTÃO TOGGLER MODERNO - APENAS MOBILE */}
<button
  className={`navbar-toggler simple-toggler ${isMobileMenuOpen ? 'active' : ''}`}
  type="button"
  aria-controls="navbarNav"
  aria-expanded={isMobileMenuOpen}
  aria-label="Toggle navigation"
  onClick={toggleMobileMenu}
>
  <span className="toggler-bar"></span>
  <span className="toggler-bar"></span>
  <span className="toggler-bar"></span>
</button>
          
          {/* ✅ MENU DESKTOP (ORIGINAL - SEM ALTERAÇÕES) */}
          <div className="collapse navbar-collapse desktop-menu" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/")}`} 
                  to="/"
                >
                  Início
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/asilos")}`} 
                  to="/asilos"
                >
                  Buscar Asilos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/eventos")}`} 
                  to="/eventos"
                >
                  Eventos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/videos")}`} 
                  to="/videos"
                >
                  Vídeos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/sobrenos")}`} 
                  to="/sobrenos"
                >
                  Sobre Nós
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/contato")}`} 
                  to="/contato"
                >
                  Contato
                </Link>
              </li>
            </ul>
            
            <div className="header-buttons">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="user-info">
                    <div className="user-welcome">
                      <span className="user-icon">{getUserTypeIcon()}</span>
                      Olá, <strong>{userName}</strong>
                    </div>
                    <div className="user-type badge">
                      {getUserTypeText()}
                    </div>
                  </div>
                  
                  <Link 
                    to={getProfileRoute()}
                    className="btn btn-outline-light btn"
                  >
                    Meu Perfil
                  </Link>
                  
                  <button 
                    onClick={handleOpenLogoutModal}
                    className="btn btn-outline-danger btn"
                    title="Sair da conta"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button 
                    onClick={handleOpenLoginModal}
                    className="btn btn-outline-light btn"
                  >
                    Entrar
                  </button>
                  <Link 
                    to="/cadastrovoluntario" 
                    className="btn btn-outline-primary btn"
                  >
                    Cadastrar - Voluntário
                  </Link>
                  <Link 
                    to="/cadastroasilo" 
                    className="btn btn-primary btn"
                  >
                    Cadastrar - Asilo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ MENU MOBILE - SIDEBAR DRAWER ANIMADO */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        {/* Cabeçalho do Drawer */}
        <div className="drawer-header">
          <div className="drawer-user-info">
            {isAuthenticated ? (
              <>
                <div className="drawer-avatar">
                  <span className="avatar-icon">{getUserTypeIcon()}</span>
                </div>
                <div className="drawer-user-details">
                  <div className="drawer-user-name">{userName}</div>
                  <div className="drawer-user-type">{getUserTypeText()}</div>
                </div>
              </>
            ) : (
              <>
                <div className="drawer-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="drawer-user-details">
                  <div className="drawer-user-name">Visitante</div>
                  <div className="drawer-user-type">Faça login para continuar</div>
                </div>
              </>
            )}
          </div>
          <button className="drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
            <span>×</span>
          </button>
        </div>

        {/* Navegação Principal - CORRIGIDO ALINHAMENTO */}
        <nav className="drawer-nav">
          <div className="nav-section">
            <div className="nav-section-label">Navegação</div>
            <Link to="/" className={`nav-item ${isActive("/")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Início</span>
            </Link>
            <Link to="/asilos" className={`nav-item ${isActive("/asilos")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Buscar Asilos</span>
            </Link>
            <Link to="/eventos" className={`nav-item ${isActive("/eventos")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Eventos</span>
            </Link>
            <Link to="/videos" className={`nav-item ${isActive("/videos")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Vídeos</span>
            </Link>
            <Link to="/sobrenos" className={`nav-item ${isActive("/sobrenos")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Sobre Nós</span>
            </Link>
            <Link to="/contato" className={`nav-item ${isActive("/contato")}`} onClick={handleNavClick}>
              <span className="nav-icon"></span>
              <span className="nav-text">Contato</span>
            </Link>
          </div>

          {/* Seção de Ações do Usuário - CORRIGIDO ALINHAMENTO */}
          <div className="nav-section">
            <div className="nav-section-label">Minha Conta</div>
            {isAuthenticated ? (
              <>
                <Link to={getProfileRoute()} className="nav-item" onClick={handleNavClick}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Meu Perfil</span>
                </Link>
                <button className="nav-item nav-button" onClick={handleOpenLogoutModal}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Sair</span>
                </button>
              </>
            ) : (
              <>
                <button className="nav-item nav-button" onClick={handleOpenLoginModal}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Entrar</span>
                </button>
                <Link to="/cadastrovoluntario" className="nav-item" onClick={handleNavClick}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Cadastrar - Voluntário</span>
                </Link>
                <Link to="/cadastroasilo" className="nav-item" onClick={handleNavClick}>
                  <span className="nav-icon"></span>
                  <span className="nav-text">Cadastrar - Asilo</span>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Rodapé do Drawer */}
        <div className="drawer-footer">
          <div className="drawer-brand">
            <img src={logoHappyIdosos || "/placeholder.svg"} alt="Happy Idosos" />
            <span className="brand-text">Happy Idosos</span>
          </div>
          <div className="drawer-tagline">
            Conectando voluntários e asilos
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        userName={userName}
        userType={userType}
      />
    </header>
  )
}

export default Header