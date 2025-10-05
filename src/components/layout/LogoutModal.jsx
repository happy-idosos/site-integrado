import "./LogoutModal.css"

const LogoutModal = ({ isOpen, onClose, onConfirm, userName, userType }) => {
  if (!isOpen) return null

  const getUserTypeText = () => {
    switch(userType) {
      case 'usuario': return 'Voluntário'
      case 'asilo': return 'Asilo'
      default: return 'Usuário'
    }
  }

  const getUserTypeIcon = () => {
    switch(userType) {
      case 'usuario': return '👨‍⚕️'
      case 'asilo': return '🏠'
      default: return '👤'
    }
  }

  return (
    <div className="happy-map-logout-overlay" onClick={onClose}>
      <div className="happy-map-logout-content" onClick={(e) => e.stopPropagation()}>
        <div className="happy-map-logout-header">
          <div className="happy-map-logout-icon">🚪</div>
          <h2 className="happy-map-logout-title">Sair da Conta</h2>
          <p className="happy-map-logout-subtitle">
            Tem certeza que deseja sair?
          </p>
        </div>

        <div className="happy-map-user-info">
          <div className="happy-map-current-user">
            <span className="happy-map-user-avatar">{getUserTypeIcon()}</span>
            <div className="happy-map-user-details">
              <span className="happy-map-user-name">{userName}</span>
              <span className="happy-map-user-type">{getUserTypeText()}</span>
            </div>
          </div>
        </div>

        <div className="happy-map-logout-warning">
          <div className="happy-map-warning-icon">⚠️</div>
          <p>Você precisará fazer login novamente para acessar recursos exclusivos.</p>
        </div>

        <div className="happy-map-logout-actions">
          <button 
            className="happy-map-logout-btn happy-map-logout-cancel"
            onClick={onClose}
          >
            <span className="happy-map-btn-icon">←</span>
            Continuar Logado
          </button>
          <button 
            className="happy-map-logout-btn happy-map-logout-confirm"
            onClick={onConfirm}
          >
            <span className="happy-map-btn-icon"></span>
            Sim, Sair Agora
          </button>
        </div>

        <div className="happy-map-logout-footer">
          <p>Volte sempre! Sua ajuda faz a diferença. 💙</p>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal