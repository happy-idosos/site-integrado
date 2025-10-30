"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./MeusVoluntarios.css"

function MeusVoluntarios() {
  const navigate = useNavigate()
  const [voluntarios, setVoluntarios] = useState([])
  const [equipes, setEquipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVoluntario, setSelectedVoluntario] = useState(null)
  const [activeTab, setActiveTab] = useState("ativos")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFuncao, setFilterFuncao] = useState("")
  const [filterEquipe, setFilterEquipe] = useState("")
  const [isAsilo, setIsAsilo] = useState(false)
  const [accessChecked, setAccessChecked] = useState(false)

  // Estados para modais de gestão
  const [showEquipeModal, setShowEquipeModal] = useState(false)
  const [novaEquipe, setNovaEquipe] = useState({ nome: "", descricao: "", cor: "#244a96" })
  const [equipeEditando, setEquipeEditando] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    })

    // Verificar se usuário é asilo
    verificarAcessoAsilo()
  }, [])

  const verificarAcessoAsilo = async () => {
    try {
      // PARA DESENVOLVIMENTO: Permitir acesso sem verificação
      console.log('🔐 Verificando acesso...')
      
      // Simular verificação bem-sucedida para desenvolvimento
      setTimeout(() => {
        setIsAsilo(true)
        setAccessChecked(true)
        carregarDadosIniciais()
      }, 1000)
      
      /* 
      // CÓDIGO PARA PRODUÇÃO (descomente quando tiver backend)
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        console.log('❌ Token não encontrado, redirecionando para login...')
        navigate('/login')
        return
      }

      // Simulação de verificação
      try {
        const response = await fetch('/api/auth/verificar-asilo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsAsilo(true)
          carregarDadosIniciais()
        } else {
          console.log('❌ Acesso negado, redirecionando...')
          navigate('/')
        }
      } catch (error) {
        console.error('Erro na verificação:', error)
        // Em caso de erro, permitir acesso para desenvolvimento
        setIsAsilo(true)
        carregarDadosIniciais()
      }
      */
      
    } catch (error) {
      console.error('Erro ao verificar acesso:', error)
      // Em desenvolvimento, permitir acesso mesmo com erro
      setIsAsilo(true)
      setAccessChecked(true)
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
    // Dados mock para desenvolvimento
    const mockVoluntarios = [
      {
        id: 1,
        nome: "Ana Silva",
        foto: "/placeholder-avatar.jpg",
        email: "ana.silva@email.com",
        telefone: "(11) 99999-9999",
        funcao: "Música",
        equipe: "Equipe Musical",
        ultimoEvento: "Festa Junina - 15/06/2024",
        status: "ativo",
        participacoes: 12,
        avaliacao: 4.8,
        habilidades: ["Violão", "Canto", "Dança"],
        disponibilidade: ["Sábados", "Domingos"],
        dataCadastro: "2024-01-15"
      },
      {
        id: 2,
        nome: "Carlos Oliveira",
        foto: "/placeholder-avatar.jpg",
        email: "carlos.oliveira@email.com",
        telefone: "(11) 98888-8888",
        funcao: "Recreação",
        equipe: "Equipe de Recreação",
        ultimoEvento: "Bingo Beneficente - 08/06/2024",
        status: "ativo",
        participacoes: 8,
        avaliacao: 4.9,
        habilidades: ["Jogos", "Dinâmicas", "Contação de Histórias"],
        disponibilidade: ["Sextas", "Sábados"],
        dataCadastro: "2024-02-20"
      },
      {
        id: 3,
        nome: "Mariana Santos",
        foto: "/placeholder-avatar.jpg",
        email: "mariana.santos@email.com",
        telefone: "(11) 97777-7777",
        funcao: "Cuidados",
        equipe: "Equipe de Apoio",
        ultimoEvento: "Visita ao Parque - 01/06/2024",
        status: "ativo",
        participacoes: 15,
        avaliacao: 5.0,
        habilidades: ["Primeiros Socorros", "Acompanhamento"],
        disponibilidade: ["Todos os dias"],
        dataCadastro: "2024-01-10"
      }
    ]

    const mockEquipes = [
      {
        id: 1,
        nome: "Equipe Musical",
        descricao: "Responsável por atividades musicais e entretenimento",
        cor: "#244a96",
        voluntarios: [1],
        dataCriacao: "2024-01-20"
      },
      {
        id: 2,
        nome: "Equipe de Recreação",
        descricao: "Organiza jogos, dinâmicas e atividades recreativas",
        cor: "#10b981",
        voluntarios: [2],
        dataCriacao: "2024-02-25"
      },
      {
        id: 3,
        nome: "Equipe de Apoio",
        descricao: "Auxilia nos cuidados básicos e acompanhamento",
        cor: "#f59e0b",
        voluntarios: [3],
        dataCriacao: "2024-01-15"
      }
    ]

    setVoluntarios(mockVoluntarios)
    setEquipes(mockEquipes)
  }

  // Filtros
  const filteredVoluntarios = voluntarios.filter(voluntario => {
    const matchesSearch = voluntario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voluntario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFuncao = !filterFuncao || voluntario.funcao === filterFuncao
    const matchesEquipe = !filterEquipe || voluntario.equipe === filterEquipe
    const matchesStatus = activeTab === "ativos" ? voluntario.status === "ativo" : voluntario.status !== "ativo"
    
    return matchesSearch && matchesFuncao && matchesEquipe && matchesStatus
  })

  const funcoesUnicas = [...new Set(voluntarios.map(v => v.funcao))]
  const equipesUnicas = [...new Set(voluntarios.map(v => v.equipe))]

  // Funções para Gestão de Equipes
  const criarEquipe = async () => {
    try {
      // Simular criação de equipe
      const novaEquipeComId = {
        ...novaEquipe,
        id: Date.now(),
        voluntarios: [],
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      
      setEquipes([...equipes, novaEquipeComId])
      setShowEquipeModal(false)
      setNovaEquipe({ nome: "", descricao: "", cor: "#244a96" })
      
      alert('Equipe criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
      alert('Erro ao criar equipe')
    }
  }

  const editarEquipe = async (equipeId, dados) => {
    try {
      setEquipes(equipes.map(e => e.id === equipeId ? { ...e, ...dados } : e))
      setShowEquipeModal(false)
      setEquipeEditando(null)
      alert('Equipe atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao editar equipe:', error)
    }
  }

  const excluirEquipe = async (equipeId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta equipe?')) return

    try {
      setEquipes(equipes.filter(e => e.id !== equipeId))
      alert('Equipe excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir equipe:', error)
    }
  }

  // Funções para Gestão de Voluntários
  const adicionarVoluntarioEquipe = async (voluntarioId, equipeId) => {
    try {
      const equipeAtualizada = equipes.map(equipe => {
        if (equipe.id === equipeId && !equipe.voluntarios.includes(voluntarioId)) {
          return {
            ...equipe,
            voluntarios: [...equipe.voluntarios, voluntarioId]
          }
        }
        return equipe
      })
      setEquipes(equipeAtualizada)
      alert('Voluntário adicionado à equipe!')
    } catch (error) {
      console.error('Erro ao adicionar voluntário à equipe:', error)
    }
  }

  const removerVoluntarioEquipe = async (voluntarioId, equipeId) => {
    try {
      const equipeAtualizada = equipes.map(equipe => {
        if (equipe.id === equipeId) {
          return {
            ...equipe,
            voluntarios: equipe.voluntarios.filter(id => id !== voluntarioId)
          }
        }
        return equipe
      })
      setEquipes(equipeAtualizada)
      alert('Voluntário removido da equipe!')
    } catch (error) {
      console.error('Erro ao remover voluntário da equipe:', error)
    }
  }

  const enviarMensagem = async (voluntario) => {
    alert(`Mensagem enviada para: ${voluntario.nome}\nEmail: ${voluntario.email}`)
  }

  const exportarDados = () => {
    alert('Funcionalidade de exportação em desenvolvimento!')
  }

  // Mostrar loading enquanto verifica acesso
  if (!accessChecked) {
    return (
      <div className="meus-voluntarios-page">
        <Header />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Verificando acesso...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Se não for asilo (em desenvolvimento isso não deve acontecer)
  if (!isAsilo) {
    return (
      <div className="meus-voluntarios-page">
        <Header />
        <div className="container text-center py-5">
          <div className="alert alert-warning">
            <h4>Acesso Restrito</h4>
            <p>Esta página é exclusiva para asilos cadastrados.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate('/')}
            >
              Voltar para Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="meus-voluntarios-page">
      <Header />

      {/* Header da Página */}
      <section className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">Gestão de Voluntários</h1>
              <p className="page-subtitle">
                Gerencie sua equipe de voluntários, organize equipes e acompanhe o desempenho
              </p>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-primary me-2" onClick={exportarDados}>
                <i className="fas fa-download me-2"></i>
                Exportar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowEquipeModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Nova Equipe
              </button>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Métricas */}
        <section className="metrics-section">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="metric-content">
                    <h3>{voluntarios.filter(v => v.status === 'ativo').length}</h3>
                    <p>Voluntários Ativos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div className="metric-content">
                    <h3>{equipes.length}</h3>
                    <p>Equipes Formadas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="metric-content">
                    <h3>{voluntarios.reduce((acc, v) => acc + v.participacoes, 0)}</h3>
                    <p>Participações Totais</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="metric-content">
                    <h3>4.8</h3>
                    <p>Avaliação Média</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros e Busca */}
        <section className="filters-section">
          <div className="container">
            <div className="filters-card">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Buscar</label>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nome, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Função</label>
                  <select
                    className="form-select"
                    value={filterFuncao}
                    onChange={(e) => setFilterFuncao(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {funcoesUnicas.map(funcao => (
                      <option key={funcao} value={funcao}>{funcao}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Equipe</label>
                  <select
                    className="form-select"
                    value={filterEquipe}
                    onChange={(e) => setFilterEquipe(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {equipesUnicas.map(equipe => (
                      <option key={equipe} value={equipe}>{equipe}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Status</label>
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className={`btn ${activeTab === 'ativos' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('ativos')}
                    >
                      Ativos
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeTab === 'inativos' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('inativos')}
                    >
                      Inativos
                    </button>
                  </div>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setFilterFuncao('')
                      setFilterEquipe('')
                    }}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Voluntários */}
        <section className="volunteers-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Voluntários</h2>
              <p className="section-subtitle">
                {filteredVoluntarios.length} {filteredVoluntarios.length === 1 ? 'voluntário encontrado' : 'voluntários encontrados'}
              </p>
            </div>

            {loading ? (
              <div className="loading-state text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Carregando voluntários...</p>
              </div>
            ) : filteredVoluntarios.length === 0 ? (
              <div className="empty-state text-center py-5">
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Nenhum voluntário encontrado</h4>
                <p className="text-muted">Tente ajustar os filtros de busca.</p>
              </div>
            ) : (
              <div className="volunteers-table-container">
                <table className="volunteers-table">
                  <thead>
                    <tr>
                      <th>Voluntário</th>
                      <th>Função</th>
                      <th>Equipe</th>
                      <th>Contato</th>
                      <th>Participações</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVoluntarios.map((voluntario) => (
                      <tr key={voluntario.id}>
                        <td>
                          <div className="volunteer-info">
                            <div className="volunteer-avatar">
                              <i className="fas fa-user"></i>
                            </div>
                            <div>
                              <div className="volunteer-name">{voluntario.nome}</div>
                              <div className="volunteer-email">{voluntario.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">{voluntario.funcao}</span>
                        </td>
                        <td>{voluntario.equipe}</td>
                        <td>{voluntario.telefone}</td>
                        <td>
                          <div className="participations">
                            <span className="count">{voluntario.participacoes}</span>
                            <div className="rating">
                              {Array.from({ length: 5 }, (_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${i < Math.floor(voluntario.avaliacao) ? 'text-warning' : 'text-muted'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${voluntario.status}`}>
                            {voluntario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedVoluntario(voluntario)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => enviarMensagem(voluntario)}
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

        {/* Gestão de Equipes */}
        <section className="teams-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Equipes</h2>
              <p className="section-subtitle">Organize seus voluntários em equipes especializadas</p>
            </div>

            <div className="row g-4">
              {equipes.map((equipe) => (
                <div key={equipe.id} className="col-lg-4">
                  <div className="team-card">
                    <div className="team-header">
                      <div className="team-color" style={{ backgroundColor: equipe.cor }}></div>
                      <h3 className="team-name">{equipe.nome}</h3>
                      <div className="team-actions">
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            setEquipeEditando(equipe)
                            setShowEquipeModal(true)
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => excluirEquipe(equipe.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="team-description">
                      <p>{equipe.descricao}</p>
                    </div>
                    <div className="team-members">
                      <h6>Membros ({equipe.voluntarios.length})</h6>
                      <div className="members-list">
                        {voluntarios
                          .filter(v => equipe.voluntarios.includes(v.id))
                          .map(voluntario => (
                            <div key={voluntario.id} className="member-item">
                              <div className="member-avatar">
                                <i className="fas fa-user"></i>
                              </div>
                              <span>{voluntario.nome}</span>
                              <button
                                className="btn-remove"
                                onClick={() => removerVoluntarioEquipe(voluntario.id, equipe.id)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Card para nova equipe */}
              <div className="col-lg-4">
                <div 
                  className="team-card new-team-card"
                  onClick={() => setShowEquipeModal(true)}
                >
                  <div className="new-team-content">
                    <i className="fas fa-plus"></i>
                    <h4>Nova Equipe</h4>
                    <p>Criar nova equipe especializada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Nova Equipe */}
      {showEquipeModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{equipeEditando ? 'Editar Equipe' : 'Nova Equipe'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowEquipeModal(false)
                  setEquipeEditando(null)
                  setNovaEquipe({ nome: "", descricao: "", cor: "#244a96" })
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome da Equipe</label>
                <input
                  type="text"
                  className="form-control"
                  value={equipeEditando ? equipeEditando.nome : novaEquipe.nome}
                  onChange={(e) => equipeEditando 
                    ? setEquipeEditando({...equipeEditando, nome: e.target.value})
                    : setNovaEquipe({...novaEquipe, nome: e.target.value})
                  }
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={equipeEditando ? equipeEditando.descricao : novaEquipe.descricao}
                  onChange={(e) => equipeEditando
                    ? setEquipeEditando({...equipeEditando, descricao: e.target.value})
                    : setNovaEquipe({...novaEquipe, descricao: e.target.value})
                  }
                />
              </div>
              <div className="form-group">
                <label>Cor de Identificação</label>
                <input
                  type="color"
                  className="form-control"
                  value={equipeEditando ? equipeEditando.cor : novaEquipe.cor}
                  onChange={(e) => equipeEditando
                    ? setEquipeEditando({...equipeEditando, cor: e.target.value})
                    : setNovaEquipe({...novaEquipe, cor: e.target.value})
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowEquipeModal(false)
                  setEquipeEditando(null)
                  setNovaEquipe({ nome: "", descricao: "", cor: "#244a96" })
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={equipeEditando 
                  ? () => editarEquipe(equipeEditando.id, equipeEditando)
                  : criarEquipe
                }
              >
                {equipeEditando ? 'Salvar' : 'Criar'} Equipe
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default MeusVoluntarios