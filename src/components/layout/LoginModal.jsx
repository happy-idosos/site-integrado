import { useNavigate } from "react-router-dom"
import "./LoginModal.css"

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleLoginSelection = (userType) => {
    onClose()
    if (userType === 'voluntario') {
      navigate('/loginvoluntario')
    } else if (userType === 'asilo') {
      navigate('/loginasilo')
    }
  }

  const handleCadastroSelection = (userType) => {
    onClose()
    if (userType === 'voluntario') {
      navigate('/cadastrovoluntario')
    } else if (userType === 'asilo') {
      navigate('/cadastroasilo')
    }
  }

  if (!isOpen) return null

  return (
    <div className="happy-map-modal-overlay" onClick={onClose}>
      <div className="happy-map-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="happy-map-close-button" onClick={onClose} aria-label="Fechar">
          <span>×</span>
        </button>
        
        <div className="happy-map-modal-header">
          <h2 className="happy-map-modal-title">Bem-vindo ao Happy Idosos!</h2>
          <p className="happy-map-modal-subtitle">Como você deseja acessar sua conta?</p>
        </div>
        
        <div className="happy-map-login-options">
          <div 
            className="happy-map-option happy-map-volunteer-option"
            onClick={() => handleLoginSelection('voluntario')}
          >
            <div className="happy-map-option-icon">👨‍⚕️</div>
            <div className="happy-map-option-content">
              <h3 className="happy-map-option-title">Voluntário</h3>
              <p className="happy-map-option-description">Pessoas que desejam ajudar idosos e fazer a diferença</p>
            </div>
            <div className="happy-map-option-arrow">→</div>
          </div>
          
          <div 
            className="happy-map-option happy-map-asilo-option"
            onClick={() => handleLoginSelection('asilo')}
          >
            <div className="happy-map-option-icon">🏠</div>
            <div className="happy-map-option-content">
              <h3 className="happy-map-option-title">Asilo/Instituição</h3>
              <p className="happy-map-option-description">Instituições que cuidam de idosos e precisam de voluntários</p>
            </div>
            <div className="happy-map-option-arrow">→</div>
          </div>
        </div>
        
        <div className="happy-map-modal-divider">
          <span className="happy-map-divider-text">ou</span>
        </div>
        
        <div className="happy-map-cadastro-section">
          <p className="happy-map-cadastro-text">Ainda não tem uma conta?</p>
          <div className="happy-map-cadastro-buttons">
            <button 
              className="happy-map-btn happy-map-btn-outline"
              onClick={() => handleCadastroSelection('voluntario')}
            >
              Cadastrar como Voluntário
            </button>
            <button 
              className="happy-map-btn btn btn-primary btn"
              onClick={() => handleCadastroSelection('asilo')}
            >
              Cadastrar como Asilo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal