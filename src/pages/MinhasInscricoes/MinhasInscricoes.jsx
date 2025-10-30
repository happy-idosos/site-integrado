"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./MinhasInscricoes.css"

// Dados mockados completos
const DADOS_VOLUNTARIO = {
  id: 1,
  nome: "João Silva",
  email: "joao.silva@email.com",
  foto: null,
  estatisticas: {
    totalInscricoes: 12,
    eventosConcluidos: 8,
    asilosVisitados: 5,
    horasVoluntariadas: 45,
  },
}

const INSCRICOES_MOCK = [
  {
    id: 1,
    evento: "Bingo Solidário",
    asilo: "Lar dos Idosos Felizes",
    asiloId: 1,
    data: "2024-03-15",
    hora: "14:00",
    local: "Rua das Flores, 123 - Centro",
    status: "pendente",
    dataInscricao: "2024-03-10",
    descricao: "Uma tarde de bingo com os idosos, com prêmios e muita diversão.",
    curtido: true,
  },
  {
    id: 2,
    evento: "Oficina de Artesanato",
    asilo: "Casa de Repouso Esperança",
    asiloId: 2,
    data: "2024-03-20",
    hora: "09:00",
    local: "Av. Principal, 456 - Jardim",
    status: "aprovado",
    dataInscricao: "2024-03-08",
    descricao: "Workshop de artesanato para estimular a criatividade dos idosos.",
    curtido: false,
  },
  {
    id: 3,
    evento: "Chá da Tarde Musical",
    asilo: "Lar dos Idosos Felizes",
    asiloId: 1,
    data: "2024-03-12",
    hora: "15:30",
    local: "Rua das Flores, 123 - Centro",
    status: "confirmado",
    dataInscricao: "2024-03-05",
    descricao: "Chá da tarde acompanhado de música ao vivo e conversas.",
    curtido: true,
  },
  {
    id: 4,
    evento: "Caminhada no Parque",
    asilo: "Asilo São Vicente",
    asiloId: 3,
    data: "2024-03-05",
    hora: "08:00",
    local: "Parque Central - Centro",
    status: "concluido",
    dataInscricao: "2024-02-28",
    descricao: "Passeio ao ar livre para promover a atividade física.",
    curtido: true,
    avaliacao: {
      nota: 4.5,
      comentario: "Voluntário muito dedicado e atencioso com todos.",
    },
  },
]

const ASILOS_CURTIDOS_MOCK = [
  {
    id: 1,
    nome: "Lar dos Idosos Felizes",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo",
    estado: "SP",
    foto: null,
    eventosAtivos: 3,
    curtido: true,
    descricao: "Asilo com foco em atividades recreativas e integração social.",
  },
  {
    id: 2,
    nome: "Casa de Repouso Esperança",
    endereco: "Av. Principal, 456 - Jardim",
    cidade: "São Paulo",
    estado: "SP",
    foto: null,
    eventosAtivos: 2,
    curtido: true,
    descricao: "Instituição com tradição de 20 anos no cuidado com idosos.",
  },
  {
    id: 3,
    nome: "Asilo São Vicente",
    endereco: "Rua das Palmeiras, 789 - Centro",
    cidade: "São Paulo",
    estado: "SP",
    foto: null,
    eventosAtivos: 1,
    curtido: true,
    descricao: "Focado em cuidados especiais e atividades terapêuticas.",
  },
]

const VIDEOS_MOCK = [
  {
    id: 1,
    titulo: "Bingo Solidário - Melhores Momentos",
    descricao: "Registro dos momentos mais divertidos do bingo com os vovôs e vovós",
    url: "https://youtube.com/embed/abc123",
    dataUpload: "2024-03-15",
    asilo: "Lar dos Idosos Felizes",
    evento: "Bingo Solidário",
    visualizacoes: 150,
    curtidas: 25,
  },
  {
    id: 2,
    titulo: "Oficina de Artesanato - Resultados",
    descricao: "Os lindos trabalhos produzidos na oficina de artesanato",
    url: "https://youtube.com/embed/def456",
    dataUpload: "2024-03-10",
    asilo: "Casa de Repouso Esperança",
    evento: "Oficina de Artesanato",
    visualizacoes: 89,
    curtidas: 18,
  },
]

const MinhasInscricoes = () => {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState("inscricoes")
  const [inscricoes, setInscricoes] = useState([])
  const [asilosCurtidos, setAsilosCurtidos] = useState([])
  const [videos, setVideos] = useState([])
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroAsilo, setFiltroAsilo] = useState("todos")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalVideoAberto, setModalVideoAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState(null)
  const [videoSelecionado, setVideoSelecionado] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Estatísticas calculadas
  const estatisticas = {
    totalInscricoes: inscricoes.length,
    pendentes: inscricoes.filter((i) => i.status === "pendente").length,
    aprovadas: inscricoes.filter((i) => i.status === "aprovado").length,
    confirmadas: inscricoes.filter((i) => i.status === "confirmado").length,
    concluidas: inscricoes.filter((i) => i.status === "concluido").length,
    recusadas: inscricoes.filter((i) => i.status === "recusado").length,
    taxaAprovacao: Math.round(
      (inscricoes.filter((i) => ["aprovado", "confirmado", "concluido"].includes(i.status)).length /
        Math.max(inscricoes.length, 1)) *
        100,
    ),
    engajamento: calcularEngajamento(inscricoes),
    asilosCurtidos: asilosCurtidos.length,
    videosUpload: videos.length,
    totalVisualizacoes: videos.reduce((acc, video) => acc + video.visualizacoes, 0),
  }

  function calcularEngajamento(inscricoes) {
    const concluidas = inscricoes.filter((i) => i.status === "concluido")
    if (concluidas.length === 0) return 0

    const somaNotas = concluidas.reduce((acc, curr) => acc + (curr.avaliacao?.nota || 0), 0)
    return Math.round((somaNotas / concluidas.length) * 20)
  }

  useEffect(() => {
    // Simular carregamento de dados da API
    setTimeout(() => {
      setInscricoes(INSCRICOES_MOCK)
      setAsilosCurtidos(ASILOS_CURTIDOS_MOCK)
      setVideos(VIDEOS_MOCK)
      setCarregando(false)
    }, 1000)
  }, [])

  // Filtragem das inscrições
  const inscricoesFiltradas = inscricoes.filter((inscricao) => {
    const statusMatch = filtroStatus === "todos" || inscricao.status === filtroStatus
    const asiloMatch = filtroAsilo === "todos" || inscricao.asilo === filtroAsilo
    const dataMatch = (!dataInicio || inscricao.data >= dataInicio) && (!dataFim || inscricao.data <= dataFim)

    return statusMatch && asiloMatch && dataMatch
  })

  // Obter asilos únicos para o filtro
  const asilosUnicos = [...new Set(inscricoes.map((i) => i.asilo))]

  const abrirModal = (item, tipo) => {
    setItemSelecionado(item)
    setModalAberto(true)
  }

  const abrirModalVideo = (video) => {
    setVideoSelecionado(video)
    setModalVideoAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setItemSelecionado(null)
  }

  const fecharModalVideo = () => {
    setModalVideoAberto(false)
    setVideoSelecionado(null)
  }

  const cancelarInscricao = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta inscrição?")) {
      return
    }

    setCancelando(true)

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setInscricoes((prev) =>
        prev.map((inscricao) => (inscricao.id === id ? { ...inscricao, status: "cancelado" } : inscricao)),
      )

      alert("Inscrição cancelada com sucesso!")
    } catch (error) {
      alert("Erro ao cancelar inscrição. Tente novamente.")
    } finally {
      setCancelando(false)
    }
  }

  const confirmarPresenca = async (id) => {
    setCancelando(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      setInscricoes((prev) =>
        prev.map((inscricao) => (inscricao.id === id ? { ...inscricao, status: "confirmado" } : inscricao)),
      )

      alert("Presença confirmada com sucesso!")
    } catch (error) {
      alert("Erro ao confirmar presença. Tente novamente.")
    } finally {
      setCancelando(false)
    }
  }

  const toggleCurtirAsilo = async (asiloId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAsilosCurtidos((prev) =>
        prev
          .map((asilo) => (asilo.id === asiloId ? { ...asilo, curtido: !asilo.curtido } : asilo))
          .filter((asilo) => asilo.curtido),
      )

      // Atualizar também nas inscrições
      setInscricoes((prev) =>
        prev.map((inscricao) =>
          inscricao.asiloId === asiloId ? { ...inscricao, curtido: !inscricao.curtido } : inscricao,
        ),
      )
    } catch (error) {
      alert("Erro ao atualizar curtida. Tente novamente.")
    }
  }

  const handleUploadVideo = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const titulo = formData.get("titulo")
    const descricao = formData.get("descricao")
    const url = formData.get("url")
    const asilo = formData.get("asilo")
    const evento = formData.get("evento")

    if (!titulo || !url) {
      alert("Preencha pelo menos o título e URL do vídeo")
      return
    }

    setUploadingVideo(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const novoVideo = {
        id: videos.length + 1,
        titulo,
        descricao,
        url,
        asilo,
        evento,
        dataUpload: new Date().toISOString().split("T")[0],
        visualizacoes: 0,
        curtidas: 0,
      }

      setVideos((prev) => [novoVideo, ...prev])
      event.target.reset()
      alert("Vídeo enviado com sucesso!")
    } catch (error) {
      alert("Erro ao enviar vídeo. Tente novamente.")
    } finally {
      setUploadingVideo(false)
    }
  }

  const excluirVideo = async (videoId) => {
    if (!window.confirm("Tem certeza que deseja excluir este vídeo?")) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setVideos((prev) => prev.filter((video) => video.id !== videoId))
      alert("Vídeo excluído com sucesso!")
    } catch (error) {
      alert("Erro ao excluir vídeo. Tente novamente.")
    }
  }

  const voltarParaHome = () => {
    navigate("/")
  }

  const formatarData = (data) => {
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pendente: { texto: "Pendente", classe: "mi-status-pendente", icone: "⏳" },
      aprovado: { texto: "Aprovado", classe: "mi-status-aprovado", icone: "✅" },
      confirmado: { texto: "Confirmado", classe: "mi-status-confirmado", icone: "📅" },
      concluido: { texto: "Concluído", classe: "mi-status-concluido", icone: "🎉" },
      recusado: { texto: "Recusado", classe: "mi-status-recusado", icone: "❌" },
      cancelado: { texto: "Cancelado", classe: "mi-status-cancelado", icone: "🚫" },
    }
    return statusMap[status] || { texto: status, classe: "mi-status-default", icone: "❓" }
  }

  const getBadgeNivel = (engajamento) => {
    if (engajamento >= 90) return { texto: "Excelente", classe: "mi-badge-excelente" }
    if (engajamento >= 70) return { texto: "Bom", classe: "mi-badge-bom" }
    if (engajamento >= 50) return { texto: "Regular", classe: "mi-badge-regular" }
    return { texto: "Iniciante", classe: "mi-badge-iniciante" }
  }

  const badgeNivel = getBadgeNivel(estatisticas.engajamento)

  if (carregando) {
    return (
      <div className="mi-container">
        <div className="mi-loading">
          <div className="mi-loading-spinner"></div>
          <p>Carregando sua central...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mi-container">
      {/* Header Mobile */}
      <div className="mi-mobile-header">
        <button className="mi-mobile-back-btn" onClick={voltarParaHome}>
          <span className="mi-icon">←</span>
          Voltar
        </button>
        <h1 className="mi-mobile-header-title">Minha Central</h1>
      </div>

      {/* Botão Voltar Desktop */}
      <button className="mi-back-btn" onClick={voltarParaHome}>
        <span className="mi-icon">←</span>
        Voltar
      </button>

      <div className="mi-wrapper">
        <header className="mi-header">
          <div className="mi-header-content">
            <h1 className="mi-title">Minha Central</h1>
            <p className="mi-subtitle">Gerencie suas inscrições, asilos curtidos e vídeos</p>
          </div>
        </header>

        <div className="mi-content">
          {/* Sidebar com Estatísticas */}
          <div className="mi-sidebar">
            <div className="mi-profile-card">
              <div className="mi-profile-header">
                <div className="mi-avatar">
                  {DADOS_VOLUNTARIO.foto ? (
                    <img src={DADOS_VOLUNTARIO.foto || "/placeholder.svg"} alt={DADOS_VOLUNTARIO.nome} />
                  ) : (
                    <span>{DADOS_VOLUNTARIO.nome.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="mi-profile-info">
                  <h3 className="mi-profile-name">{DADOS_VOLUNTARIO.nome}</h3>
                  <p className="mi-profile-email">{DADOS_VOLUNTARIO.email}</p>
                </div>
              </div>
            </div>

            <div className="mi-stats-card">
              <h3 className="mi-stats-title">Estatísticas</h3>

              <div className="mi-stats-grid">
                <div className="mi-stat-item">
                  <span className="mi-stat-number">{estatisticas.totalInscricoes}</span>
                  <span className="mi-stat-label">Inscrições</span>
                </div>

                <div className="mi-stat-item">
                  <span className="mi-stat-number">{estatisticas.asilosCurtidos}</span>
                  <span className="mi-stat-label">Asilos</span>
                </div>

                <div className="mi-stat-item">
                  <span className="mi-stat-number">{estatisticas.videosUpload}</span>
                  <span className="mi-stat-label">Vídeos</span>
                </div>
              </div>

              <div className="mi-stats-details">
                <div className="mi-stat-detail">
                  <span className="mi-stat-detail-label">Taxa de Aprovação</span>
                  <div className="mi-progress-bar">
                    <div className="mi-progress-fill" style={{ width: `${estatisticas.taxaAprovacao}%` }}></div>
                  </div>
                  <span className="mi-stat-percentage">{estatisticas.taxaAprovacao}%</span>
                </div>

                <div className="mi-stat-detail">
                  <span className="mi-stat-detail-label">Nível de Engajamento</span>
                  <div className={`mi-badge ${badgeNivel.classe}`}>{badgeNivel.texto}</div>
                  <span className="mi-stat-percentage">{estatisticas.engajamento}%</span>
                </div>
              </div>
            </div>

            <div className="mi-quick-actions">
              <h4 className="mi-actions-title">Ações Rápidas</h4>
              <button className="mi-action-btn mi-btn-primary" onClick={() => navigate("/asilos")}>
                <span className="mi-icon">🔍</span>
                Buscar Eventos
              </button>
              <button className="mi-action-btn mi-btn-outline" onClick={() => navigate("/perfil")}>
                <span className="mi-icon">👤</span>
                Meu Perfil
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="mi-main">
            {/* Abas de Navegação */}
            <div className="mi-tabs">
              <button
                className={`mi-tab ${abaAtiva === "inscricoes" ? "mi-tab-active" : ""}`}
                onClick={() => setAbaAtiva("inscricoes")}
              >
                <span className="mi-tab-icon">📋</span>
                Inscrições
                {estatisticas.pendentes > 0 && <span className="mi-tab-badge">{estatisticas.pendentes}</span>}
              </button>

              <button
                className={`mi-tab ${abaAtiva === "asilos" ? "mi-tab-active" : ""}`}
                onClick={() => setAbaAtiva("asilos")}
              >
                <span className="mi-tab-icon">❤️</span>
                Asilos Curtidos
                <span className="mi-tab-badge">{estatisticas.asilosCurtidos}</span>
              </button>

              <button
                className={`mi-tab ${abaAtiva === "videos" ? "mi-tab-active" : ""}`}
                onClick={() => setAbaAtiva("videos")}
              >
                <span className="mi-tab-icon">🎥</span>
                Meus Vídeos
                <span className="mi-tab-badge">{estatisticas.videosUpload}</span>
              </button>
            </div>

            {/* Conteúdo das Abas */}
            {abaAtiva === "inscricoes" && (
              <>
                {/* Filtros */}
                <div className="mi-filters-card">
                  <h3 className="mi-filters-title">Filtrar Inscrições</h3>

                  <div className="mi-filters-grid">
                    <div className="mi-filter-group">
                      <label className="mi-filter-label">Status</label>
                      <select
                        className="mi-filter-select"
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                      >
                        <option value="todos">Todos os Status</option>
                        <option value="pendente">Pendentes</option>
                        <option value="aprovado">Aprovados</option>
                        <option value="confirmado">Confirmados</option>
                        <option value="concluido">Concluídos</option>
                        <option value="recusado">Recusados</option>
                      </select>
                    </div>

                    <div className="mi-filter-group">
                      <label className="mi-filter-label">Asilo</label>
                      <select
                        className="mi-filter-select"
                        value={filtroAsilo}
                        onChange={(e) => setFiltroAsilo(e.target.value)}
                      >
                        <option value="todos">Todos os Asilos</option>
                        {asilosUnicos.map((asilo) => (
                          <option key={asilo} value={asilo}>
                            {asilo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mi-filter-group">
                      <label className="mi-filter-label">Data Início</label>
                      <input
                        type="date"
                        className="mi-filter-input"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                      />
                    </div>

                    <div className="mi-filter-group">
                      <label className="mi-filter-label">Data Fim</label>
                      <input
                        type="date"
                        className="mi-filter-input"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mi-filters-actions">
                    <button
                      className="mi-btn mi-btn-outline"
                      onClick={() => {
                        setFiltroStatus("todos")
                        setFiltroAsilo("todos")
                        setDataInicio("")
                        setDataFim("")
                      }}
                    >
                      <span className="mi-icon">🔄</span>
                      Limpar Filtros
                    </button>
                  </div>
                </div>

                {/* Lista de Inscrições */}
                <div className="mi-inscricoes-section">
                  <div className="mi-section-header">
                    <h3 className="mi-section-title">Minhas Inscrições ({inscricoesFiltradas.length})</h3>
                  </div>

                  {inscricoesFiltradas.length === 0 ? (
                    <div className="mi-empty-state">
                      <div className="mi-empty-icon">📋</div>
                      <h4 className="mi-empty-title">Nenhuma inscrição encontrada</h4>
                      <p className="mi-empty-text">
                        {inscricoes.length === 0
                          ? "Você ainda não possui inscrições. Que tal buscar por eventos disponíveis?"
                          : "Nenhuma inscrição corresponde aos filtros aplicados."}
                      </p>
                      {inscricoes.length === 0 && (
                        <button className="mi-btn mi-btn-primary" onClick={() => navigate("/asilos")}>
                          <span className="mi-icon">🔍</span>
                          Buscar Eventos
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mi-inscricoes-grid">
                      {inscricoesFiltradas.map((inscricao) => {
                        const statusInfo = getStatusInfo(inscricao.status)

                        return (
                          <div key={inscricao.id} className="mi-inscricao-card">
                            <div className="mi-card-header">
                              <h4 className="mi-card-title">{inscricao.evento}</h4>
                              <div className="mi-card-header-actions">
                                <span className={`mi-status ${statusInfo.classe}`}>
                                  <span className="mi-status-icon">{statusInfo.icone}</span>
                                  {statusInfo.texto}
                                </span>
                                <button
                                  className={`mi-btn-curtir ${inscricao.curtido ? "mi-curtido" : ""}`}
                                  onClick={() => toggleCurtirAsilo(inscricao.asiloId)}
                                  title={inscricao.curtido ? "Descurtir asilo" : "Curtir asilo"}
                                >
                                  {inscricao.curtido ? "❤️" : "🤍"}
                                </button>
                              </div>
                            </div>

                            <div className="mi-card-body">
                              <div className="mi-card-info">
                                <div className="mi-info-item">
                                  <span className="mi-info-icon">🏠</span>
                                  <span className="mi-info-text">{inscricao.asilo}</span>
                                </div>

                                <div className="mi-info-item">
                                  <span className="mi-info-icon">📅</span>
                                  <span className="mi-info-text">
                                    {formatarData(inscricao.data)} às {inscricao.hora}
                                  </span>
                                </div>

                                <div className="mi-info-item">
                                  <span className="mi-info-icon">📍</span>
                                  <span className="mi-info-text">{inscricao.local}</span>
                                </div>
                              </div>

                              {inscricao.avaliacao && (
                                <div className="mi-avaliacao">
                                  <div className="mi-avaliacao-header">
                                    <span className="mi-avaliacao-label">Avaliação do Asilo:</span>
                                    <div className="mi-rating">
                                      <span className="mi-rating-stars">
                                        {"★".repeat(Math.floor(inscricao.avaliacao.nota))}
                                        {"☆".repeat(5 - Math.floor(inscricao.avaliacao.nota))}
                                      </span>
                                      <span className="mi-rating-value">{inscricao.avaliacao.nota}</span>
                                    </div>
                                  </div>
                                  <p className="mi-avaliacao-comentario">"{inscricao.avaliacao.comentario}"</p>
                                </div>
                              )}
                            </div>

                            <div className="mi-card-actions">
                              <button
                                className="mi-action mi-action-details"
                                onClick={() => abrirModal(inscricao, "inscricao")}
                                title="Ver detalhes"
                              >
                                <span className="mi-action-icon">👁️</span>
                                Detalhes
                              </button>

                              {inscricao.status === "pendente" && (
                                <button
                                  className="mi-action mi-action-cancel"
                                  onClick={() => cancelarInscricao(inscricao.id)}
                                  disabled={cancelando}
                                  title="Cancelar inscrição"
                                >
                                  <span className="mi-action-icon">🗑️</span>
                                  {cancelando ? "Cancelando..." : "Cancelar"}
                                </button>
                              )}

                              {inscricao.status === "aprovado" && (
                                <button
                                  className="mi-action mi-action-confirm"
                                  onClick={() => confirmarPresenca(inscricao.id)}
                                  disabled={cancelando}
                                  title="Confirmar presença"
                                >
                                  <span className="mi-action-icon">📅</span>
                                  {cancelando ? "Confirmando..." : "Confirmar"}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {abaAtiva === "asilos" && (
              <div className="mi-asilos-section">
                <div className="mi-section-header">
                  <h3 className="mi-section-title">Asilos Curtidos ({asilosCurtidos.length})</h3>
                </div>

                {asilosCurtidos.length === 0 ? (
                  <div className="mi-empty-state">
                    <div className="mi-empty-icon">🏠</div>
                    <h4 className="mi-empty-title">Nenhum asilo curtido</h4>
                    <p className="mi-empty-text">Comece a curtir asilos para acompanhar suas atividades e eventos!</p>
                    <button className="mi-btn mi-btn-primary" onClick={() => navigate("/asilos")}>
                      <span className="mi-icon">🔍</span>
                      Explorar Asilos
                    </button>
                  </div>
                ) : (
                  <div className="mi-asilos-grid">
                    {asilosCurtidos.map((asilo) => (
                      <div key={asilo.id} className="mi-asilo-card">
                        <div className="mi-asilo-header">
                          <h4 className="mi-asilo-title">{asilo.nome}</h4>
                          <button
                            className="mi-btn-curtir mi-curtido"
                            onClick={() => toggleCurtirAsilo(asilo.id)}
                            title="Descurtir asilo"
                          >
                            ❤️
                          </button>
                        </div>

                        <div className="mi-asilo-info">
                          <div className="mi-info-item">
                            <span className="mi-info-icon">📍</span>
                            <span className="mi-info-text">{asilo.endereco}</span>
                          </div>

                          <div className="mi-info-item">
                            <span className="mi-info-icon">🏙️</span>
                            <span className="mi-info-text">
                              {asilo.cidade} - {asilo.estado}
                            </span>
                          </div>

                          <div className="mi-info-item">
                            <span className="mi-info-icon">🎯</span>
                            <span className="mi-info-text">{asilo.eventosAtivos} eventos ativos</span>
                          </div>
                        </div>

                        <p className="mi-asilo-descricao">{asilo.descricao}</p>

                        <div className="mi-asilo-actions">
                          <button className="mi-btn mi-btn-outline" onClick={() => navigate(`/asilos/${asilo.id}`)}>
                            <span className="mi-icon">👁️</span>
                            Ver Detalhes
                          </button>

                          <button
                            className="mi-btn mi-btn-primary"
                            onClick={() => navigate(`/asilos/${asilo.id}#eventos`)}
                          >
                            <span className="mi-icon">📅</span>
                            Ver Eventos
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {abaAtiva === "videos" && (
              <div className="mi-videos-section">
                <div className="mi-section-header">
                  <h3 className="mi-section-title">Meus Vídeos ({videos.length})</h3>
                  <button
                    className="mi-btn mi-btn-primary"
                    onClick={() => document.getElementById("mi-upload-form").scrollIntoView({ behavior: "smooth" })}
                  >
                    <span className="mi-icon">📤</span>
                    Novo Vídeo
                  </button>
                </div>

                {/* Formulário de Upload */}
                <div className="mi-upload-card" id="mi-upload-form">
                  <h4 className="mi-upload-title">Enviar Novo Vídeo</h4>
                  <form onSubmit={handleUploadVideo} className="mi-upload-form">
                    <div className="mi-form-grid">
                      <div className="mi-form-group">
                        <label className="mi-form-label">Título do Vídeo *</label>
                        <input
                          type="text"
                          name="titulo"
                          className="mi-form-input"
                          placeholder="Ex: Bingo Solidário - Melhores Momentos"
                          required
                        />
                      </div>

                      <div className="mi-form-group">
                        <label className="mi-form-label">URL do Vídeo (YouTube) *</label>
                        <input
                          type="url"
                          name="url"
                          className="mi-form-input"
                          placeholder="https://youtube.com/embed/..."
                          required
                        />
                      </div>

                      <div className="mi-form-group">
                        <label className="mi-form-label">Asilo</label>
                        <select name="asilo" className="mi-form-select">
                          <option value="">Selecione o asilo</option>
                          {asilosCurtidos.map((asilo) => (
                            <option key={asilo.id} value={asilo.nome}>
                              {asilo.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mi-form-group">
                        <label className="mi-form-label">Evento</label>
                        <input type="text" name="evento" className="mi-form-input" placeholder="Nome do evento" />
                      </div>

                      <div className="mi-form-group mi-full-width">
                        <label className="mi-form-label">Descrição</label>
                        <textarea
                          name="descricao"
                          className="mi-form-textarea"
                          rows="3"
                          placeholder="Descreva o conteúdo do vídeo..."
                        />
                      </div>
                    </div>

                    <div className="mi-form-actions">
                      <button type="submit" className="mi-btn mi-btn-success" disabled={uploadingVideo}>
                        <span className="mi-icon">{uploadingVideo ? "⏳" : "📤"}</span>
                        {uploadingVideo ? "Enviando..." : "Enviar Vídeo"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lista de Vídeos */}
                {videos.length === 0 ? (
                  <div className="mi-empty-state">
                    <div className="mi-empty-icon">🎥</div>
                    <h4 className="mi-empty-title">Nenhum vídeo enviado</h4>
                    <p className="mi-empty-text">
                      Compartilhe seus momentos especiais enviando vídeos das suas atividades voluntárias!
                    </p>
                  </div>
                ) : (
                  <div className="mi-videos-grid">
                    {videos.map((video) => (
                      <div key={video.id} className="mi-video-card">
                        <div className="mi-video-header">
                          <h4 className="mi-video-title">{video.titulo}</h4>
                          <button
                            className="mi-btn mi-btn-danger mi-btn-sm"
                            onClick={() => excluirVideo(video.id)}
                            title="Excluir vídeo"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="mi-video-preview">
                          <div className="mi-video-placeholder">
                            <span className="mi-video-icon">🎬</span>
                            <p>Pré-visualização do Vídeo</p>
                            <small>{video.url}</small>
                          </div>
                        </div>

                        <div className="mi-video-info">
                          <div className="mi-video-meta">
                            <span className="mi-video-asilo">🏠 {video.asilo}</span>
                            <span className="mi-video-data">📅 {formatarData(video.dataUpload)}</span>
                          </div>

                          <p className="mi-video-descricao">{video.descricao}</p>

                          <div className="mi-video-stats">
                            <span className="mi-video-stat">👁️ {video.visualizacoes} visualizações</span>
                            <span className="mi-video-stat">❤️ {video.curtidas} curtidas</span>
                          </div>
                        </div>

                        <div className="mi-video-actions">
                          <button className="mi-btn mi-btn-outline" onClick={() => abrirModalVideo(video)}>
                            <span className="mi-icon">👁️</span>
                            Assistir
                          </button>

                          <button
                            className="mi-btn mi-btn-outline"
                            onClick={() => navigator.clipboard.writeText(video.url)}
                          >
                            <span className="mi-icon">📋</span>
                            Copiar Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalAberto && itemSelecionado && (
        <div className="mi-modal-overlay" onClick={fecharModal}>
          <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mi-modal-content">
              <div className="mi-modal-header">
                <button className="mi-modal-close" onClick={fecharModal}>
                  ✕
                </button>
                <h3 className="mi-modal-title">{itemSelecionado.evento}</h3>
                <span className={`mi-status ${getStatusInfo(itemSelecionado.status).classe}`}>
                  {getStatusInfo(itemSelecionado.status).texto}
                </span>
              </div>

              <div className="mi-modal-body">
                <div className="mi-modal-info">
                  <div className="mi-modal-info-item">
                    <strong>Asilo:</strong> {itemSelecionado.asilo}
                  </div>
                  <div className="mi-modal-info-item">
                    <strong>Data e Hora:</strong> {formatarData(itemSelecionado.data)} às {itemSelecionado.hora}
                  </div>
                  <div className="mi-modal-info-item">
                    <strong>Local:</strong> {itemSelecionado.local}
                  </div>
                  <div className="mi-modal-info-item">
                    <strong>Data da Inscrição:</strong> {formatarData(itemSelecionado.dataInscricao)}
                  </div>
                </div>

                <div className="mi-modal-description">
                  <h4>Descrição do Evento</h4>
                  <p>{itemSelecionado.descricao}</p>
                </div>

                {itemSelecionado.avaliacao && (
                  <div className="mi-modal-avaliacao">
                    <h4>Avaliação do Asilo</h4>
                    <div className="mi-rating-large">
                      <span className="mi-rating-stars-large">
                        {"★".repeat(Math.floor(itemSelecionado.avaliacao.nota))}
                        {"☆".repeat(5 - Math.floor(itemSelecionado.avaliacao.nota))}
                      </span>
                      <span className="mi-rating-value-large">{itemSelecionado.avaliacao.nota}/5</span>
                    </div>
                    <p className="mi-avaliacao-comentario-large">"{itemSelecionado.avaliacao.comentario}"</p>
                  </div>
                )}
              </div>

              <div className="mi-modal-footer">
                <button className="mi-btn mi-btn-outline" onClick={fecharModal}>
                  Fechar
                </button>

                {itemSelecionado.status === "pendente" && (
                  <button
                    className="mi-btn mi-btn-danger"
                    onClick={() => {
                      cancelarInscricao(itemSelecionado.id)
                      fecharModal()
                    }}
                    disabled={cancelando}
                  >
                    {cancelando ? "Cancelando..." : "Cancelar Inscrição"}
                  </button>
                )}

                {itemSelecionado.status === "aprovado" && (
                  <button
                    className="mi-btn mi-btn-success"
                    onClick={() => {
                      confirmarPresenca(itemSelecionado.id)
                      fecharModal()
                    }}
                    disabled={cancelando}
                  >
                    {cancelando ? "Confirmando..." : "Confirmar Presença"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vídeo */}
      {modalVideoAberto && videoSelecionado && (
        <div className="mi-modal-overlay" onClick={fecharModalVideo}>
          <div className="mi-modal mi-modal-video" onClick={(e) => e.stopPropagation()}>
            <div className="mi-modal-content">
              <div className="mi-modal-header">
                <button className="mi-modal-close" onClick={fecharModalVideo}>
                  ✕
                </button>
                <h3 className="mi-modal-title">{videoSelecionado.titulo}</h3>
              </div>

              <div className="mi-modal-body">
                <div className="mi-video-player">
                  <div className="mi-video-placeholder-large">
                    <span className="mi-video-icon-large">🎬</span>
                    <p>Player de Vídeo</p>
                    <small>URL: {videoSelecionado.url}</small>
                    <div className="mi-video-actions-large">
                      <button
                        className="mi-btn mi-btn-primary"
                        onClick={() => window.open(videoSelecionado.url, "_blank")}
                      >
                        <span className="mi-icon">▶️</span>
                        Assistir no YouTube
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mi-video-details">
                  <div className="mi-video-info-large">
                    <div className="mi-info-item">
                      <strong>Asilo:</strong> {videoSelecionado.asilo}
                    </div>
                    <div className="mi-info-item">
                      <strong>Evento:</strong> {videoSelecionado.evento}
                    </div>
                    <div className="mi-info-item">
                      <strong>Data de Upload:</strong> {formatarData(videoSelecionado.dataUpload)}
                    </div>
                  </div>

                  <div className="mi-video-stats-large">
                    <span className="mi-video-stat-large">👁️ {videoSelecionado.visualizacoes} visualizações</span>
                    <span className="mi-video-stat-large">❤️ {videoSelecionado.curtidas} curtidas</span>
                  </div>

                  <div className="mi-video-descricao-large">
                    <h4>Descrição</h4>
                    <p>{videoSelecionado.descricao}</p>
                  </div>
                </div>
              </div>

              <div className="mi-modal-footer">
                <button className="mi-btn mi-btn-outline" onClick={fecharModalVideo}>
                  Fechar
                </button>
                <button
                  className="mi-btn mi-btn-primary"
                  onClick={() => navigator.clipboard.writeText(videoSelecionado.url)}
                >
                  <span className="mi-icon">📋</span>
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MinhasInscricoes
