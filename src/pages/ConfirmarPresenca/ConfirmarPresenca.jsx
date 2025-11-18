"use client"

import { useState, useEffect } from "react"
import "./ConfirmarPresenca.css"

// Modal de Confirmação
const ConfirmacaoModal = ({ show, type, title, message, onClose, onConfirm }) => {
  useEffect(() => {
    if (!show) return

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div
        className={`cp-modal-content cp-modal-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cp-modal-header">
          <div className="cp-modal-icon">
            {type === "success" ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : type === "warning" ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <h3 className="cp-modal-title">{title}</h3>
        </div>

        <div className="cp-modal-body">
          <p className="cp-modal-message">{message}</p>
        </div>

        <div className="cp-modal-footer">
          {type === "warning" ? (
            <>
              <button className="cp-modal-btn cp-modal-btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="cp-modal-btn cp-modal-btn-warning" onClick={onConfirm}>
                Confirmar Presença
              </button>
            </>
          ) : (
            <button className={`cp-modal-btn cp-modal-btn-${type}`} onClick={onClose}>
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Componentes simplificados para substituir as dependências
const Header = () => {
  return (
    <header style={{ 
      padding: '1rem 0', 
      background: 'rgba(26, 31, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(90, 143, 216, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>VoluntariApp</h1>
          <nav>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'rgba(36, 74, 150, 0.2)',
                border: '1px solid rgba(90, 143, 216, 0.3)',
                color: '#5a8fd8',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Início
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

const Footer = () => {
  return (
    <footer style={{ 
      padding: '2rem 0', 
      background: 'rgba(26, 31, 46, 0.95)',
      borderTop: '1px solid rgba(90, 143, 216, 0.2)',
      color: '#9ca3af',
      textAlign: 'center'
    }}>
      <div className="container">
        <p style={{ margin: 0 }}>VoluntariApp © 2024 - Conectando voluntários a causas nobres</p>
      </div>
    </footer>
  )
}

// Hook de autenticação simplificado
const useAuth = () => {
  return {
    user: { 
      id: 1, 
      nome: "João Silva", 
      email: "joao.silva@email.com", 
      tipo: "voluntario" 
    },
    isAuthenticated: true,
    loading: false
  }
}

const ConfirmarPresenca = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
    eventoId: null,
  })

  useEffect(() => {
    // Simular inicialização do AOS
    const initAnimations = () => {
      // Simular AOS - adicionar classes de animação após um delay
      setTimeout(() => {
        const elements = document.querySelectorAll('[data-aos]')
        elements.forEach(el => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
      }, 100)
    }

    initAnimations()
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login"
    }
  }, [isAuthenticated, authLoading, user])

  useEffect(() => {
    if (isAuthenticated && user && user.tipo === "voluntario") {
      carregarEventos()
    }
  }, [isAuthenticated, user])

  const carregarEventos = async () => {
    setLoading(true)
    try {
      // Dados mockados
      const eventosMock = [
        {
          id: 1,
          titulo: "Tarde de Música e Poesia",
          descricao: "Apresentação musical com violão e recital de poesias clássicas",
          data: "2024-12-15",
          horario: "14:00",
          asilo: "Asilo Lar dos Idosos",
          local: "Salão Principal",
          endereco: "Rua das Flores, 123 - Centro",
          vagas: 30,
          confirmacao_presenca: false,
          data_confirmacao: null,
          dataInscricao: "2024-11-20",
          tipoEvento: "Cultural",
        },
        {
          id: 2,
          titulo: "Oficina de Artesanato",
          descricao: "Aprenda técnicas de crochê e tricô com os idosos",
          data: "2024-12-20",
          horario: "10:00",
          asilo: "Casa de Repouso Vida Plena",
          local: "Sala de Atividades",
          endereco: "Av. Principal, 456 - Jardim",
          vagas: 15,
          confirmacao_presenca: true,
          data_confirmacao: "2024-11-01T10:30:00",
          dataInscricao: "2024-11-22",
          tipoEvento: "Recreativo",
        },
        {
          id: 3,
          titulo: "Caminhada no Parque",
          descricao: "Atividade física leve ao ar livre com os residentes",
          data: "2024-12-10",
          horario: "08:00",
          asilo: "Residencial Feliz Idade",
          local: "Parque Municipal",
          endereco: "Rua do Parque, 789 - Vila Nova",
          vagas: 20,
          confirmacao_presenca: false,
          data_confirmacao: null,
          dataInscricao: "2024-11-25",
          tipoEvento: "Esportivo",
        },
        {
          id: 4,
          titulo: "Festa Junina",
          descricao: "Celebração tradicional com comidas típicas e quadrilha",
          data: "2024-11-25",
          horario: "15:00",
          asilo: "Asilo São José",
          local: "Pátio Externo",
          endereco: "Rua São José, 321 - Centro",
          confirmacao_presenca: true,
          compareceu: false,
          data_confirmacao: "2024-11-20T14:00:00",
          dataInscricao: "2024-11-10",
          tipoEvento: "Festivo",
        },
        {
          id: 5,
          titulo: "Bingo Beneficente",
          descricao: "Tarde de bingo com prêmios e muita diversão",
          data: "2024-11-18",
          horario: "14:30",
          asilo: "Lar Santa Clara",
          local: "Salão de Eventos",
          endereco: "Av. das Acácias, 555 - Jardim",
          confirmacao_presenca: true,
          compareceu: true,
          data_confirmacao: "2024-11-15T09:00:00",
          dataInscricao: "2024-11-05",
          tipoEvento: "Recreativo",
        },
        {
          id: 6,
          titulo: "Palestra sobre Saúde",
          descricao: "Orientações sobre cuidados com a saúde na terceira idade",
          data: "2024-11-12",
          horario: "10:00",
          asilo: "Casa de Repouso Vida Plena",
          local: "Auditório",
          endereco: "Av. Principal, 456 - Jardim",
          confirmacao_presenca: false,
          compareceu: null,
          data_confirmacao: null,
          dataInscricao: "2024-11-08",
          tipoEvento: "Educativo",
        },
      ]

      setEventos(eventosMock)
    } catch (error) {
      console.error("Erro ao carregar eventos:", error)
      showModalMessage("Erro", "Não foi possível carregar seus eventos. Tente novamente.", "error")
    } finally {
      setLoading(false)
    }
  }

  const confirmarPresenca = async (eventoId) => {
    try {
      setEventos((prev) =>
        prev.map((evento) =>
          evento.id === eventoId
            ? { ...evento, confirmacao_presenca: true, data_confirmacao: new Date().toISOString() }
            : evento,
        ),
      )

      showModalMessage(
        "Presença Confirmada!",
        "Sua presença foi confirmada com sucesso. O asilo foi notificado e aguardamos você no evento!",
        "success",
      )
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
      showModalMessage("Erro", "Não foi possível confirmar sua presença. Tente novamente.", "error")
    }
  }

  const showModalMessage = (title, message, type = "success", eventoId = null) => {
    setModal({
      show: true,
      title,
      message,
      type,
      eventoId,
    })
  }

  const closeModal = () => {
    setModal((prev) => ({ ...prev, show: false, eventoId: null }))
  }

  const handleConfirmarClick = (evento) => {
    const prazo = calcularPrazoHoras(evento.data, evento.horario)
    if (prazo < 0) {
      showModalMessage("Prazo Expirado", "O prazo para confirmar presença neste evento já passou.", "error")
      return
    }

    showModalMessage(
      "Confirmar Presença",
      `Deseja confirmar sua presença no evento "${evento.titulo}" no ${evento.asilo}?`,
      "warning",
      evento.id,
    )
  }

  const handleModalConfirm = () => {
    if (modal.eventoId) {
      confirmarPresenca(modal.eventoId)
    }
    closeModal()
  }

  const formatarData = (dataString) => {
    const data = new Date(dataString + "T00:00:00")
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatarDataCurta = (dataString) => {
    const data = new Date(dataString + "T00:00:00")
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  }

  const isEventoFuturo = (dataString) => {
    const dataEvento = new Date(dataString + "T00:00:00")
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return dataEvento >= hoje
  }

  const calcularPrazoHoras = (dataString, horario) => {
    const [ano, mes, dia] = dataString.split("-")
    const [hora, minuto] = horario.split(":")
    const dataEvento = new Date(ano, mes - 1, dia, hora, minuto)
    const agora = new Date()
    const diferencaMs = dataEvento - agora
    const diferencaHoras = Math.floor(diferencaMs / (1000 * 60 * 60))
    return diferencaHoras
  }

  const formatarPrazo = (horas) => {
    if (horas < 0) return "Prazo expirado"
    if (horas < 24) return `${horas}h restantes`
    const dias = Math.floor(horas / 24)
    const horasRestantes = horas % 24
    return `${dias}d ${horasRestantes}h restantes`
  }

  const eventosFuturos = eventos.filter((e) => isEventoFuturo(e.data))
  const eventosPassados = eventos.filter((e) => !isEventoFuturo(e.data))

  const eventosAguardando = eventosFuturos.filter((e) => !e.confirmacao_presenca)
  const eventosConfirmados = eventosFuturos.filter((e) => e.confirmacao_presenca)

  if (authLoading || loading) {
    return (
      <div className="confirmar-presenca-page">
        <Header />
        <div className="cp-loading">
          <div className="cp-spinner"></div>
          <p>Carregando eventos...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="confirmar-presenca-page">
      <Header />

      <main className="cp-main">
        <div className="container">
          {/* Header da Página */}
          <div className="cp-header" data-aos="fade-down">
            <div className="cp-header-content">
              <h1 className="cp-title">Confirmar Presença</h1>
              <p className="cp-subtitle">
                Confirme sua presença nos eventos aprovados pelos asilos e mantenha seu histórico atualizado
              </p>
            </div>
            <button 
              className="cp-back-btn"
              onClick={() => window.history.back()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Minhas Inscrições
            </button>
          </div>

          {/* Estatísticas */}
          <div className="cp-stats" data-aos="fade-up">
            <div className="cp-stat-card">
              <div className="cp-stat-icon cp-stat-icon-pending">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="cp-stat-content">
                <h3>{eventosAguardando.length}</h3>
                <p>Aguardando Confirmação</p>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon cp-stat-icon-confirmed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="cp-stat-content">
                <h3>{eventosConfirmados.length}</h3>
                <p>Confirmados</p>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon cp-stat-icon-total">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="cp-stat-content">
                <h3>{eventosFuturos.length}</h3>
                <p>Eventos Futuros</p>
              </div>
            </div>
          </div>

          <div className="cp-section" data-aos="fade-up">
            <div className="cp-section-header">
              <h2 className="cp-section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Aguardando Confirmação
              </h2>
              <span className="cp-section-badge">{eventosAguardando.length}</span>
            </div>

            {eventosAguardando.length === 0 ? (
              <div className="cp-empty-small">
                <p>Você não possui eventos aguardando confirmação.</p>
              </div>
            ) : (
              <div className="cp-grid">
                {eventosAguardando.map((evento, index) => {
                  const prazoHoras = calcularPrazoHoras(evento.data, evento.horario)
                  const prazoExpirado = prazoHoras < 48

                  return (
                    <div
                      key={evento.id}
                      className={`cp-card ${prazoExpirado ? "cp-card-urgent" : ""}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      style={{
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      <div className="cp-card-header">
                        <div className="cp-event-type">{evento.tipoEvento || "Evento"}</div>
                        <div className={`cp-deadline-badge ${prazoExpirado ? "cp-deadline-urgent" : ""}`}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {formatarPrazo(prazoHoras)}
                        </div>
                      </div>

                      <div className="cp-card-body">
                        <h3 className="cp-event-title">{evento.titulo}</h3>
                        {evento.descricao && <p className="cp-event-description">{evento.descricao}</p>}

                        <div className="cp-event-info">
                          <div className="cp-info-item">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            <span className="cp-info-nursing-home">{evento.asilo}</span>
                          </div>
                          <div className="cp-info-item">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{formatarData(evento.data)}</span>
                          </div>
                          <div className="cp-info-item">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{evento.horario}</span>
                          </div>
                          <div className="cp-info-item">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{evento.local}</span>
                          </div>
                          {evento.endereco && (
                            <div className="cp-info-item cp-info-full">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{evento.endereco}</span>
                            </div>
                          )}
                        </div>

                        {prazoExpirado && (
                          <div className="cp-deadline-alert">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>Confirme sua presença em até 48h antes do evento!</span>
                          </div>
                        )}
                      </div>

                      <div className="cp-card-footer">
                        <button className="cp-confirm-btn" onClick={() => handleConfirmarClick(evento)}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          Confirmar Presença
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {eventosConfirmados.length > 0 && (
            <div className="cp-section" data-aos="fade-up">
              <div className="cp-section-header">
                <h2 className="cp-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Presença Confirmada
                </h2>
                <span className="cp-section-badge">{eventosConfirmados.length}</span>
              </div>

              <div className="cp-grid">
                {eventosConfirmados.map((evento, index) => (
                  <div 
                    key={evento.id} 
                    className="cp-card" 
                    data-aos="fade-up" 
                    data-aos-delay={index * 100}
                    style={{
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                    }}
                  >
                    <div className="cp-card-header">
                      <div className="cp-event-type">{evento.tipoEvento || "Evento"}</div>
                      <div className="cp-status-badge cp-status-confirmed">Confirmado</div>
                    </div>

                    <div className="cp-card-body">
                      <h3 className="cp-event-title">{evento.titulo}</h3>
                      {evento.descricao && <p className="cp-event-description">{evento.descricao}</p>}

                      <div className="cp-event-info">
                        <div className="cp-info-item">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          </svg>
                          <span className="cp-info-nursing-home">{evento.asilo}</span>
                        </div>
                        <div className="cp-info-item">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{formatarData(evento.data)}</span>
                        </div>
                        <div className="cp-info-item">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{evento.horario}</span>
                        </div>
                        <div className="cp-info-item">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{evento.local}</span>
                        </div>
                      </div>
                    </div>

                    <div className="cp-card-footer">
                      <div className="cp-success-message">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Presença confirmada - Aguardamos você!
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {eventosPassados.length > 0 && (
            <div className="cp-section cp-history-section" data-aos="fade-up">
              <div className="cp-section-header">
                <h2 className="cp-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 8 10" />
                  </svg>
                  Histórico de Eventos
                </h2>
                <span className="cp-section-badge">{eventosPassados.length}</span>
              </div>

              <div className="cp-history-list">
                {eventosPassados.map((evento, index) => (
                  <div 
                    key={evento.id} 
                    className="cp-history-item" 
                    data-aos="fade-up" 
                    data-aos-delay={index * 50}
                    style={{
                      opacity: 0,
                      transform: 'translateX(-20px)',
                      animation: `fadeInLeft 0.6s ease-out ${index * 0.05}s forwards`
                    }}
                  >
                    <div className="cp-history-icon-wrapper">
                      {evento.confirmacao_presenca && evento.compareceu && (
                        <div className="cp-history-icon cp-history-icon-success">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                      )}
                      {evento.confirmacao_presenca && !evento.compareceu && (
                        <div className="cp-history-icon cp-history-icon-error">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                      )}
                      {!evento.confirmacao_presenca && (
                        <div className="cp-history-icon cp-history-icon-warning">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="cp-history-content">
                      <div className="cp-history-header">
                        <h4 className="cp-history-title">{evento.titulo}</h4>
                        <span className="cp-history-date">{formatarDataCurta(evento.data)}</span>
                      </div>
                      <div className="cp-history-info">
                        <span className="cp-history-nursing-home">{evento.asilo}</span>
                        <span className="cp-history-separator">•</span>
                        <span className="cp-history-time">{evento.horario}</span>
                      </div>
                      <div className="cp-history-status">
                        {evento.confirmacao_presenca && evento.compareceu && (
                          <span className="cp-status-text cp-status-text-success">Confirmado e compareceu</span>
                        )}
                        {evento.confirmacao_presenca && !evento.compareceu && (
                          <span className="cp-status-text cp-status-text-error">Confirmado mas ausente</span>
                        )}
                        {!evento.confirmacao_presenca && (
                          <span className="cp-status-text cp-status-text-warning">Não confirmou presença</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - Nenhum evento */}
          {eventos.length === 0 && (
            <div className="cp-empty" data-aos="fade-up">
              <div className="cp-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>Nenhum evento aprovado</h3>
              <p>Você ainda não foi aprovado em nenhum evento. Inscreva-se em eventos disponíveis!</p>
              <button 
                className="cp-primary-btn"
                onClick={() => window.location.href = '/eventos'}
              >
                Explorar Eventos
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {modal.show && <ConfirmacaoModal {...modal} onClose={closeModal} onConfirm={handleModalConfirm} />}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>
    </div>
  )
}

export default ConfirmarPresenca