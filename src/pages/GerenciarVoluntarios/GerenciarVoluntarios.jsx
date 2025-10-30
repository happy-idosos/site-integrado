"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./GerenciarVoluntarios.css"

function GerenciarVoluntarios() {
  const navigate = useNavigate()
  const [inscricoes, setInscricoes] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInscricao, setSelectedInscricao] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState("") // "aprovar" ou "recusar"
  const [modalData, setModalData] = useState({})
  const [showPerfilModal, setShowPerfilModal] = useState(false)

  // Filtros
  const [filtroEvento, setFiltroEvento] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [filtroData, setFiltroData] = useState("")
  const [buscaNome, setBuscaNome] = useState("")

  // Estatísticas
  const [stats, setStats] = useState({
    totalPendentes: 0,
    aprovadosMes: 0,
    taxaAprovacao: 0,
    confirmados: 0
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    })

    // Verificar acesso e carregar dados
    verificarAcessoECarregar()
  }, [])

  const verificarAcessoECarregar = async () => {
    try {
      // Para desenvolvimento - permitir acesso
      console.log('🔐 Carregando dashboard de gestão...')
      carregarDadosIniciais()
    } catch (error) {
      console.error('Erro ao carregar:', error)
      carregarDadosIniciais()
    }
  }

  const carregarDadosIniciais = async () => {
    setLoading(true)
    try {
      // Dados mock para desenvolvimento
      carregarDadosMock()
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      carregarDadosMock()
    } finally {
      setLoading(false)
    }
  }

  const carregarDadosMock = () => {
    const mockEventos = [
      {
        id: 1,
        titulo: "Festa Junina Solidária",
        data: "2024-06-15",
        local: "Pátio do Asilo"
      },
      {
        id: 2,
        titulo: "Bingo Beneficente",
        data: "2024-06-08",
        local: "Salão Principal"
      },
      {
        id: 3,
        titulo: "Oficina de Artesanato",
        data: "2024-06-22",
        local: "Sala de Atividades"
      }
    ]

    const mockInscricoes = [
      {
        id: 1,
        id_evento: 1,
        id_voluntario: 1,
        status: "pendente",
        mensagem_justificativa: "",
        data_inscricao: "2024-05-20",
        data_resposta: null,
        funcao_designada: "",
        voluntario: {
          id: 1,
          nome: "Ana Silva",
          foto: "/placeholder-avatar.jpg",
          email: "ana.silva@email.com",
          telefone: "(11) 99999-9999",
          idade: 28,
          descricao: "Adoro trabalhar com idosos e tocar violão nas atividades.",
          habilidades: ["Violão", "Canto", "Dança", "Conversação"],
          historico: [
            { evento: "Festa de Natal", data: "2023-12-20", status: "confirmado" },
            { evento: "Passeio no Parque", data: "2024-03-15", status: "confirmado" }
          ]
        },
        evento: mockEventos[0],
        mensagem_motivacao: "Tenho experiência com eventos comunitários e adoraria contribuir com minha musicalidade para alegrar os idosos."
      },
      {
        id: 2,
        id_evento: 1,
        id_voluntario: 2,
        status: "pendente",
        mensagem_justificativa: "",
        data_inscricao: "2024-05-18",
        data_resposta: null,
        funcao_designada: "",
        voluntario: {
          id: 2,
          nome: "Carlos Oliveira",
          foto: "/placeholder-avatar.jpg",
          email: "carlos.oliveira@email.com",
          telefone: "(11) 98888-8888",
          idade: 32,
          descricao: "Educador físico com paixão por atividades recreativas para a melhor idade.",
          habilidades: ["Jogos", "Dinâmicas", "Alongamento", "Primeiros Socorros"],
          historico: [
            { evento: "Aula de Alongamento", data: "2024-02-10", status: "confirmado" }
          ]
        },
        evento: mockEventos[0],
        mensagem_motivacao: "Como educador físico, posso organizar atividades recreativas adequadas para os idosos."
      },
      {
        id: 3,
        id_evento: 2,
        id_voluntario: 3,
        status: "aprovado",
        mensagem_justificativa: "",
        data_inscricao: "2024-05-15",
        data_resposta: "2024-05-16",
        funcao_designada: "Organizador de Jogos",
        voluntario: {
          id: 3,
          nome: "Mariana Santos",
          foto: "/placeholder-avatar.jpg",
          email: "mariana.santos@email.com",
          telefone: "(11) 97777-7777",
          idade: 25,
          descricao: "Psicóloga com especialização em gerontologia.",
          habilidades: ["Acompanhamento", "Conversação", "Primeiros Socorros"],
          historico: [
            { evento: "Grupo de Conversa", data: "2024-01-20", status: "confirmado" },
            { evento: "Bingo Mensal", data: "2024-04-05", status: "confirmado" }
          ]
        },
        evento: mockEventos[1],
        mensagem_motivacao: "Acredito que posso contribuir criando um ambiente acolhedor e divertido."
      },
      {
        id: 4,
        id_evento: 3,
        id_voluntario: 4,
        status: "recusado",
        mensagem_justificativa: "Não há vagas disponíveis para esta oficina no momento.",
        data_inscricao: "2024-05-12",
        data_resposta: "2024-05-13",
        funcao_designada: "",
        voluntario: {
          id: 4,
          nome: "João Pereira",
          foto: "/placeholder-avatar.jpg",
          email: "joao.pereira@email.com",
          telefone: "(11) 96666-6666",
          idade: 30,
          descricao: "Artista plástico com experiência em oficinas para terceira idade.",
          habilidades: ["Pintura", "Artesanato", "Desenho"],
          historico: []
        },
        evento: mockEventos[2],
        mensagem_motivacao: "Sou artista plástico e gostaria de ministrar uma oficina de pintura para os idosos."
      }
    ]

    setEventos(mockEventos)
    setInscricoes(mockInscricoes)
    calcularEstatisticas(mockInscricoes)
  }

  const calcularEstatisticas = (inscricoesData) => {
    const totalPendentes = inscricoesData.filter(i => i.status === 'pendente').length
    const aprovadosMes = inscricoesData.filter(i => 
      i.status === 'aprovado' && 
      new Date(i.data_resposta).getMonth() === new Date().getMonth()
    ).length
    const totalRespondidas = inscricoesData.filter(i => i.status !== 'pendente').length
    const taxaAprovacao = totalRespondidas > 0 ? 
      (inscricoesData.filter(i => i.status === 'aprovado').length / totalRespondidas) * 100 : 0
    const confirmados = inscricoesData.filter(i => i.status === 'confirmado').length

    setStats({
      totalPendentes,
      aprovadosMes,
      taxaAprovacao: Math.round(taxaAprovacao),
      confirmados
    })
  }

  // Filtros combinados
  const inscricoesFiltradas = inscricoes.filter(inscricao => {
    const matchesEvento = !filtroEvento || inscricao.id_evento.toString() === filtroEvento
    const matchesStatus = !filtroStatus || inscricao.status === filtroStatus
    const matchesData = !filtroData || inscricao.data_inscricao === filtroData
    const matchesNome = !buscaNome || 
      inscricao.voluntario.nome.toLowerCase().includes(buscaNome.toLowerCase())

    return matchesEvento && matchesStatus && matchesData && matchesNome
  })

  // Funções de Ação
  const abrirModalAcao = (inscricao, tipo) => {
    setSelectedInscricao(inscricao)
    setActionType(tipo)
    setModalData({
      funcao: "",
      mensagem: tipo === 'aprovar' ? 
        `Olá ${inscricao.voluntario.nome}! Sua inscrição para o evento "${inscricao.evento.titulo}" foi aprovada. Estamos ansiosos para tê-lo conosco!` :
        `Olá ${inscricao.voluntario.nome}. Infelizmente sua inscrição para o evento "${inscricao.evento.titulo}" não pôde ser aceita no momento.`
    })
    setShowActionModal(true)
  }

  const executarAcao = async () => {
    if (!selectedInscricao) return

    try {
      // Simular API call
      console.log(`Executando ação: ${actionType} para inscrição ${selectedInscricao.id}`)
      
      // Atualizar estado local
      const inscricoesAtualizadas = inscricoes.map(inscricao => 
        inscricao.id === selectedInscricao.id ? {
          ...inscricao,
          status: actionType === 'aprovar' ? 'aprovado' : 'recusado',
          data_resposta: new Date().toISOString().split('T')[0],
          funcao_designada: actionType === 'aprovar' ? modalData.funcao : '',
          mensagem_justificativa: actionType === 'recusar' ? modalData.mensagem : ''
        } : inscricao
      )

      setInscricoes(inscricoesAtualizadas)
      calcularEstatisticas(inscricoesAtualizadas)
      setShowActionModal(false)
      setSelectedInscricao(null)

      alert(`Inscrição ${actionType === 'aprovar' ? 'aprovada' : 'recusada'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      alert('Erro ao processar a ação')
    }
  }

  const abrirPerfilVoluntario = (inscricao) => {
    setSelectedInscricao(inscricao)
    setShowPerfilModal(true)
  }

  const enviarMensagem = (voluntario) => {
    alert(`Abrindo chat com ${voluntario.nome}\nEmail: ${voluntario.email}\nTelefone: ${voluntario.telefone}`)
  }

  const limparFiltros = () => {
    setFiltroEvento("")
    setFiltroStatus("")
    setFiltroData("")
    setBuscaNome("")
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      pendente: "status-pendente",
      aprovado: "status-aprovado",
      recusado: "status-recusado",
      confirmado: "status-confirmado",
      ausente: "status-ausente"
    }
    return classes[status] || "status-pendente"
  }

  const getStatusText = (status) => {
    const textos = {
      pendente: "Pendente",
      aprovado: "Aprovado",
      recusado: "Recusado",
      confirmado: "Confirmado",
      ausente: "Ausente"
    }
    return textos[status] || status
  }

  return (
    <div className="gerenciar-voluntarios-page">
      <Header />

      {/* Header da Página */}
      <section className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">Gerenciar Inscrições</h1>
              <p className="page-subtitle">
                Gerencie todas as inscrições de voluntários para seus eventos
              </p>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-primary" onClick={limparFiltros}>
                <i className="fas fa-sync-alt me-2"></i>
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Estatísticas Rápidas */}
        <section className="stats-section">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalPendentes}</h3>
                    <p>Pendentes</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="stat-icon approved">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.aprovadosMes}</h3>
                    <p>Aprovados (Mês)</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="stat-icon rate">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.taxaAprovacao}%</h3>
                    <p>Taxa de Aprovação</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="stat-icon confirmed">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.confirmados}</h3>
                    <p>Confirmados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros Avançados */}
        <section className="filters-section">
          <div className="container">
            <div className="filters-card">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-calendar me-2"></i>
                    Evento
                  </label>
                  <select
                    className="form-select"
                    value={filtroEvento}
                    onChange={(e) => setFiltroEvento(e.target.value)}
                  >
                    <option value="">Todos os Eventos</option>
                    {eventos.map(evento => (
                      <option key={evento.id} value={evento.id}>
                        {evento.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-filter me-2"></i>
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="ausente">Ausente</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-calendar-day me-2"></i>
                    Data
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-search me-2"></i>
                    Buscar Voluntário
                  </label>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nome do voluntário..."
                      value={buscaNome}
                      onChange={(e) => setBuscaNome(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="results-count">
                    <span className="count">{inscricoesFiltradas.length}</span>
                    <span className="label">resultados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Inscrições */}
        <section className="inscricoes-section">
          <div className="container">
            {loading ? (
              <div className="loading-state text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando inscrições...</p>
              </div>
            ) : inscricoesFiltradas.length === 0 ? (
              <div className="empty-state text-center py-5">
                <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Nenhuma inscrição encontrada</h4>
                <p className="text-muted">Tente ajustar os filtros de busca.</p>
              </div>
            ) : (
              <div className="inscricoes-table-container">
                <table className="inscricoes-table">
                  <thead>
                    <tr>
                      <th>Voluntário</th>
                      <th>Evento</th>
                      <th>Data Inscrição</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscricoesFiltradas.map((inscricao) => (
                      <tr key={inscricao.id} className="inscricao-row">
                        <td>
                          <div 
                            className="volunteer-info clickable"
                            onClick={() => abrirPerfilVoluntario(inscricao)}
                          >
                            <div className="volunteer-avatar">
                              <i className="fas fa-user"></i>
                            </div>
                            <div>
                              <div className="volunteer-name">{inscricao.voluntario.nome}</div>
                              <div className="volunteer-email">{inscricao.voluntario.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="evento-info">
                            <div className="evento-titulo">{inscricao.evento.titulo}</div>
                            <div className="evento-data">{inscricao.evento.data}</div>
                          </div>
                        </td>
                        <td>
                          <div className="data-inscricao">
                            {new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(inscricao.status)}`}>
                            {getStatusText(inscricao.status)}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => abrirPerfilVoluntario(inscricao)}
                              title="Ver perfil"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            
                            {inscricao.status === 'pendente' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={() => abrirModalAcao(inscricao, 'aprovar')}
                                  title="Aprovar inscrição"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => abrirModalAcao(inscricao, 'recusar')}
                                  title="Recusar inscrição"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </>
                            )}
                            
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={() => enviarMensagem(inscricao.voluntario)}
                              title="Enviar mensagem"
                            >
                              <i className="fas fa-envelope"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Ação (Aprovar/Recusar) */}
      {showActionModal && selectedInscricao && (
        <div className="modal-overlay">
          <div className="modal-container action-modal">
            <div className="modal-header">
              <h3>
                {actionType === 'aprovar' ? 'Aprovar Inscrição' : 'Recusar Inscrição'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowActionModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="inscricao-info">
                <h5>Detalhes da Inscrição</h5>
                <p><strong>Voluntário:</strong> {selectedInscricao.voluntario.nome}</p>
                <p><strong>Evento:</strong> {selectedInscricao.evento.titulo}</p>
                <p><strong>Data:</strong> {selectedInscricao.evento.data}</p>
              </div>

              {actionType === 'aprovar' && (
                <div className="form-group">
                  <label>Função Designada</label>
                  <select
                    className="form-select"
                    value={modalData.funcao}
                    onChange={(e) => setModalData({...modalData, funcao: e.target.value})}
                  >
                    <option value="">Selecione uma função</option>
                    <option value="Recreação">Recreação</option>
                    <option value="Música">Música</option>
                    <option value="Apoio">Apoio</option>
                    <option value="Cuidados">Cuidados</option>
                    <option value="Organização">Organização</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>
                  {actionType === 'aprovar' ? 'Mensagem de Boas-Vindas' : 'Justificativa da Recusa'}
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={modalData.mensagem}
                  onChange={(e) => setModalData({...modalData, mensagem: e.target.value})}
                  placeholder={
                    actionType === 'aprovar' ? 
                    "Mensagem que será enviada ao voluntário..." :
                    "Explique o motivo da recusa..."
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowActionModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`btn ${actionType === 'aprovar' ? 'btn-success' : 'btn-danger'}`}
                onClick={executarAcao}
                disabled={actionType === 'aprovar' && !modalData.funcao}
              >
                <i className={`fas ${actionType === 'aprovar' ? 'fa-check' : 'fa-times'} me-2`}></i>
                {actionType === 'aprovar' ? 'Aprovar' : 'Recusar'} Inscrição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Perfil do Voluntário */}
      {showPerfilModal && selectedInscricao && (
        <div className="modal-overlay">
          <div className="modal-container perfil-modal">
            <div className="modal-header">
              <h3>Perfil do Voluntário</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPerfilModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="perfil-header">
                <div className="volunteer-avatar large">
                  <i className="fas fa-user"></i>
                </div>
                <div className="perfil-info">
                  <h4>{selectedInscricao.voluntario.nome}</h4>
                  <p className="volunteer-age">{selectedInscricao.voluntario.idade} anos</p>
                  <p className="volunteer-description">{selectedInscricao.voluntario.descricao}</p>
                </div>
              </div>

              <div className="perfil-details">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Contato</h5>
                    <div className="contact-info">
                      <p><i className="fas fa-envelope"></i> {selectedInscricao.voluntario.email}</p>
                      <p><i className="fas fa-phone"></i> {selectedInscricao.voluntario.telefone}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Habilidades</h5>
                    <div className="skills-list">
                      {selectedInscricao.voluntario.habilidades.map((habilidade, index) => (
                        <span key={index} className="skill-tag">
                          {habilidade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <h5>Mensagem de Motivação</h5>
                    <div className="motivation-message">
                      <p>{selectedInscricao.mensagem_motivacao}</p>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <h5>Histórico de Participações</h5>
                    <div className="historico-list">
                      {selectedInscricao.voluntario.historico.length > 0 ? (
                        selectedInscricao.voluntario.historico.map((participacao, index) => (
                          <div key={index} className="historico-item">
                            <span className="evento-name">{participacao.evento}</span>
                            <span className="evento-date">{participacao.data}</span>
                            <span className={`status-badge ${getStatusBadgeClass(participacao.status)}`}>
                              {getStatusText(participacao.status)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Nenhuma participação anterior</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => enviarMensagem(selectedInscricao.voluntario)}
              >
                <i className="fas fa-envelope me-2"></i>
                Enviar Mensagem
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPerfilModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default GerenciarVoluntarios