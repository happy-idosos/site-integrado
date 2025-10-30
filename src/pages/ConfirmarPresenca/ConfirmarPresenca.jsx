"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
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
    <div className="confirmacao-modal-overlay" onClick={onClose}>
      <div
        className={`confirmacao-modal-content confirmacao-modal-${type}`}
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        <div className="confirmacao-modal-header">
          <div className="confirmacao-modal-icon">
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
          <h3 className="confirmacao-modal-title">{title}</h3>
        </div>

        <div className="confirmacao-modal-body">
          <p className="confirmacao-modal-message">{message}</p>
        </div>

        <div className="confirmacao-modal-footer">
          {type === "warning" ? (
            <>
              <button className="confirmacao-modal-btn confirmacao-modal-btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="confirmacao-modal-btn confirmacao-modal-btn-warning" onClick={onConfirm}>
                Confirmar Presença
              </button>
            </>
          ) : (
            <button className={`confirmacao-modal-btn confirmacao-modal-btn-${type}`} onClick={onClose}>
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const ConfirmarPresenca = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState("todos") // todos, pendente, confirmado
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
    eventoId: null,
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (isAuthenticated && user) {
      carregarEventos()
    }
  }, [isAuthenticated, user])

  // ========== INTEGRAÇÃO: CARREGAR EVENTOS ==========
  const carregarEventos = async () => {
    setLoading(true)
    try {
      // TODO: Substituir por chamada real à API
      // const response = await fetch(`/api/eventos/inscricoes/${user.id}`)
      // const data = await response.json()

      // Dados mockados para demonstração
      const eventosMock = [
        {
          id: 1,
          titulo: "Tarde de Música e Poesia",
          descricao: "Apresentação musical com violão e recital de poesias clássicas",
          data: "2025-11-15",
          horario: "14:00",
          local: "Asilo Lar dos Idosos",
          endereco: "Rua das Flores, 123 - Centro",
          vagas: 30,
          statusConfirmacao: "pendente", // pendente, confirmado, ausente
          dataInscricao: "2025-10-20",
          tipoEvento: "Cultural",
        },
        {
          id: 2,
          titulo: "Oficina de Artesanato",
          descricao: "Aprenda técnicas de crochê e tricô com os idosos",
          data: "2025-11-20",
          horario: "10:00",
          local: "Casa de Repouso Vida Plena",
          endereco: "Av. Principal, 456 - Jardim",
          vagas: 15,
          statusConfirmacao: "confirmado",
          dataInscricao: "2025-10-22",
          tipoEvento: "Recreativo",
        },
        {
          id: 3,
          titulo: "Caminhada no Parque",
          descricao: "Atividade física leve ao ar livre com os residentes",
          data: "2025-11-10",
          horario: "08:00",
          local: "Residencial Feliz Idade",
          endereco: "Rua do Parque, 789 - Vila Nova",
          vagas: 20,
          statusConfirmacao: "pendente",
          dataInscricao: "2025-10-25",
          tipoEvento: "Esportivo",
        },
        {
          id: 4,
          titulo: "Festa Junina",
          data: "2025-10-25",
          horario: "15:00",
          local: "Asilo São José",
          statusConfirmacao: "ausente",
          dataInscricao: "2025-10-10",
          tipoEvento: "Festivo",
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

  // ========== INTEGRAÇÃO: CONFIRMAR PRESENÇA ==========
  const confirmarPresenca = async (eventoId) => {
    try {
      // TODO: Substituir por chamada real à API
      // const response = await fetch(`/api/eventos/${eventoId}/confirmar-presenca`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ usuarioId: user.id })
      // })
      // const data = await response.json()

      // Simulação de sucesso
      setEventos((prev) =>
        prev.map((evento) => (evento.id === eventoId ? { ...evento, statusConfirmacao: "confirmado" } : evento)),
      )

      showModalMessage(
        "Presença Confirmada!",
        "Sua presença foi confirmada com sucesso. Aguardamos você no evento!",
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
    showModalMessage(
      "Confirmar Presença",
      `Deseja confirmar sua presença no evento "${evento.titulo}"?`,
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

  const isEventoFuturo = (dataString) => {
    const dataEvento = new Date(dataString + "T00:00:00")
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return dataEvento >= hoje
  }

  const eventosFiltrados = eventos.filter((evento) => {
    if (filtroStatus === "todos") return true
    return evento.statusConfirmacao === filtroStatus
  })

  const eventosPendentes = eventos.filter((e) => e.statusConfirmacao === "pendente" && isEventoFuturo(e.data))
  const eventosConfirmados = eventos.filter((e) => e.statusConfirmacao === "confirmado")

  if (authLoading || loading) {
    return (
      <div className="confirmacao-page">
        <Header />
        <div className="confirmacao-loading">
          <div className="confirmacao-spinner"></div>
          <p>Carregando eventos...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="confirmacao-page">
      <Header />

      <main className="confirmacao-main">
        <div className="container">
          {/* Header da Página */}
          <div className="confirmacao-header" data-aos="fade-down">
            <div className="confirmacao-header-content">
              <h1 className="confirmacao-title">Confirmar Presença</h1>
              <p className="confirmacao-subtitle">
                Gerencie suas confirmações de presença nos eventos em que você está inscrito
              </p>
            </div>
            <Link to="/minhasinscricoes" className="confirmacao-back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Minhas Inscrições
            </Link>
          </div>

          {/* Estatísticas */}
          <div className="confirmacao-stats" data-aos="fade-up">
            <div className="stat-card">
              <div className="stat-icon stat-icon-pending">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{eventosPendentes.length}</h3>
                <p>Pendentes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-confirmed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{eventosConfirmados.length}</h3>
                <p>Confirmados</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-total">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>{eventos.length}</h3>
                <p>Total de Eventos</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="confirmacao-filters" data-aos="fade-up">
            <button
              className={`filter-btn ${filtroStatus === "todos" ? "filter-active" : ""}`}
              onClick={() => setFiltroStatus("todos")}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${filtroStatus === "pendente" ? "filter-active" : ""}`}
              onClick={() => setFiltroStatus("pendente")}
            >
              Pendentes
            </button>
            <button
              className={`filter-btn ${filtroStatus === "confirmado" ? "filter-active" : ""}`}
              onClick={() => setFiltroStatus("confirmado")}
            >
              Confirmados
            </button>
            <button
              className={`filter-btn ${filtroStatus === "ausente" ? "filter-active" : ""}`}
              onClick={() => setFiltroStatus("ausente")}
            >
              Ausentes
            </button>
          </div>

          {/* Lista de Eventos */}
          {eventosFiltrados.length === 0 ? (
            <div className="confirmacao-empty" data-aos="fade-up">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>Nenhum evento encontrado</h3>
              <p>Você não possui eventos com este status.</p>
              <Link to="/eventos" className="btn-primary">
                Explorar Eventos
              </Link>
            </div>
          ) : (
            <div className="confirmacao-grid">
              {eventosFiltrados.map((evento, index) => (
                <div key={evento.id} className="confirmacao-card" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="confirmacao-card-header">
                    <div className="evento-tipo-badge">{evento.tipoEvento || "Evento"}</div>
                    <div className={`status-badge status-${evento.statusConfirmacao}`}>
                      {evento.statusConfirmacao === "pendente" && "Pendente"}
                      {evento.statusConfirmacao === "confirmado" && "Confirmado"}
                      {evento.statusConfirmacao === "ausente" && "Ausente"}
                    </div>
                  </div>

                  <div className="confirmacao-card-body">
                    <h3 className="evento-titulo">{evento.titulo}</h3>
                    {evento.descricao && <p className="evento-descricao">{evento.descricao}</p>}

                    <div className="evento-info">
                      <div className="info-item">
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
                      <div className="info-item">
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
                      <div className="info-item">
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
                        <div className="info-item info-item-full">
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
                          <span>{evento.endereco}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="confirmacao-card-footer">
                    {evento.statusConfirmacao === "pendente" && isEventoFuturo(evento.data) ? (
                      <button className="btn-confirmar" onClick={() => handleConfirmarClick(evento)}>
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
                    ) : evento.statusConfirmacao === "confirmado" ? (
                      <div className="confirmacao-success-message">
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
                        Presença confirmada
                      </div>
                    ) : (
                      <div className="confirmacao-info-message">Evento já realizado</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {modal.show && <ConfirmacaoModal {...modal} onClose={closeModal} onConfirm={handleModalConfirm} />}
    </div>
  )
}

export default ConfirmarPresenca
