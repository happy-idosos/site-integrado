"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./PainelAdministrador.css"

// const logo = "../../assets/img/happyidosos.jpg"

const PainelAdministrador = () => {
  const navigate = useNavigate()
  const [moduloAtivo, setModuloAtivo] = useState("dashboard")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modalTipo, setModalTipo] = useState("")
  const [itemSelecionado, setItemSelecionado] = useState(null)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)

  // Dados mockados para demonstração
  const [estatisticas] = useState({
    totalAsilos: 127,
    totalVoluntarios: 843,
    eventosAtivos: 45,
    eventosConcluidos: 312,
    taxaAprovacao: 87,
    denunciasPendentes: 3,
  })

  const [asilos] = useState([
    {
      id: 1,
      nome: "Lar dos Idosos São Francisco",
      cnpj: "12.345.678/0001-90",
      cidade: "São Paulo",
      status: "aprovado",
      dataRegistro: "2024-01-15",
    },
    {
      id: 2,
      nome: "Casa de Repouso Vida Plena",
      cnpj: "98.765.432/0001-10",
      cidade: "Rio de Janeiro",
      status: "pendente",
      dataRegistro: "2024-03-20",
    },
    {
      id: 3,
      nome: "Asilo Bom Jesus",
      cnpj: "45.678.901/0001-23",
      cidade: "Belo Horizonte",
      status: "aprovado",
      dataRegistro: "2024-02-10",
    },
  ])

  const [voluntarios] = useState([
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
      cidade: "São Paulo",
      eventosParticipados: 12,
      status: "ativo",
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao@email.com",
      cidade: "Rio de Janeiro",
      eventosParticipados: 8,
      status: "ativo",
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana@email.com",
      cidade: "Curitiba",
      eventosParticipados: 15,
      status: "suspenso",
    },
  ])

  const [eventos] = useState([
    {
      id: 1,
      nome: "Tarde de Música e Dança",
      asilo: "Lar dos Idosos São Francisco",
      data: "2024-04-15",
      voluntariosInscritos: 8,
      voluntariosConfirmados: 6,
      status: "ativo",
    },
    {
      id: 2,
      nome: "Oficina de Artesanato",
      asilo: "Casa de Repouso Vida Plena",
      data: "2024-04-20",
      voluntariosInscritos: 5,
      voluntariosConfirmados: 5,
      status: "ativo",
    },
    {
      id: 3,
      nome: "Bingo Beneficente",
      asilo: "Asilo Bom Jesus",
      data: "2024-03-10",
      voluntariosInscritos: 10,
      voluntariosConfirmados: 9,
      status: "concluido",
    },
  ])

  const [denuncias] = useState([
    {
      id: 1,
      tipo: "Comportamento Indevido",
      usuario: "João Santos",
      descricao: "Não compareceu ao evento sem justificativa",
      data: "2024-03-25",
      status: "pendente",
    },
    {
      id: 2,
      tipo: "Conteúdo Inapropriado",
      usuario: "Ana Costa",
      descricao: "Comentários inadequados no perfil",
      data: "2024-03-28",
      status: "investigando",
    },
    {
      id: 3,
      tipo: "Evento Cancelado",
      usuario: "Casa de Repouso Vida Plena",
      descricao: "Cancelamento sem aviso prévio",
      data: "2024-03-15",
      status: "resolvido",
    },
  ])

  const abrirModal = (tipo, item = null) => {
    setModalTipo(tipo)
    setItemSelecionado(item)
    setMostrarModal(true)
  }

  const fecharModal = () => {
    setMostrarModal(false)
    setModalTipo("")
    setItemSelecionado(null)
  }

  const voltarParaHome = () => {
    navigate("/")
  }

  const toggleMenuMobile = () => {
    setMenuMobileAberto(!menuMobileAberto)
  }

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        <div className="admin-stat-card" data-color="blue">
          <div className="admin-stat-icon">🏠</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.totalAsilos}</h3>
            <p>Asilos Cadastrados</p>
          </div>
        </div>

        <div className="admin-stat-card" data-color="green">
          <div className="admin-stat-icon">🤝</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.totalVoluntarios}</h3>
            <p>Voluntários Ativos</p>
          </div>
        </div>

        <div className="admin-stat-card" data-color="purple">
          <div className="admin-stat-icon">📅</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.eventosAtivos}</h3>
            <p>Eventos Ativos</p>
          </div>
        </div>

        <div className="admin-stat-card" data-color="orange">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.eventosConcluidos}</h3>
            <p>Eventos Concluídos</p>
          </div>
        </div>

        <div className="admin-stat-card" data-color="cyan">
          <div className="admin-stat-icon">📊</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.taxaAprovacao}%</h3>
            <p>Taxa de Aprovação</p>
          </div>
        </div>

        <div className="admin-stat-card" data-color="red">
          <div className="admin-stat-icon">⚠️</div>
          <div className="admin-stat-content">
            <h3>{estatisticas.denunciasPendentes}</h3>
            <p>Denúncias Pendentes</p>
          </div>
        </div>
      </div>

      <div className="admin-alerts-section">
        <h2 className="admin-section-title">Alertas Recentes</h2>
        <div className="admin-alerts-list">
          <div className="admin-alert" data-type="warning">
            <span className="admin-alert-icon">⚠️</span>
            <div className="admin-alert-content">
              <h4>Novo asilo aguardando aprovação documental</h4>
              <p>Casa de Repouso Vida Plena - Cadastrado há 2 dias</p>
            </div>
            <button className="admin-alert-btn" onClick={() => setModuloAtivo("usuarios")}>
              Ver Detalhes
            </button>
          </div>

          <div className="admin-alert" data-type="info">
            <span className="admin-alert-icon">📅</span>
            <div className="admin-alert-content">
              <h4>Evento sem voluntários suficientes</h4>
              <p>Tarde de Música e Dança - Faltam 2 voluntários</p>
            </div>
            <button className="admin-alert-btn" onClick={() => setModuloAtivo("eventos")}>
              Ver Detalhes
            </button>
          </div>

          <div className="admin-alert" data-type="danger">
            <span className="admin-alert-icon">🚨</span>
            <div className="admin-alert-content">
              <h4>Relato de comportamento indevido</h4>
              <p>Denúncia contra João Santos - Requer análise</p>
            </div>
            <button className="admin-alert-btn" onClick={() => setModuloAtivo("denuncias")}>
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsuarios = () => (
    <div className="admin-usuarios">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Gestão de Usuários</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => abrirModal("exportar")}>
          📊 Exportar Relatório
        </button>
      </div>

      <div className="admin-tabs">
        <button className="admin-tab admin-tab-active">Asilos ({asilos.length})</button>
        <button className="admin-tab">Voluntários ({voluntarios.length})</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Data Registro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {asilos.map((asilo) => (
              <tr key={asilo.id}>
                <td>{asilo.nome}</td>
                <td>{asilo.cnpj}</td>
                <td>{asilo.cidade}</td>
                <td>
                  <span className={`admin-badge admin-badge-${asilo.status}`}>
                    {asilo.status === "aprovado" ? "Aprovado" : "Pendente"}
                  </span>
                </td>
                <td>{new Date(asilo.dataRegistro).toLocaleDateString("pt-BR")}</td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn"
                      title="Ver Detalhes"
                      onClick={() => abrirModal("detalhes", asilo)}
                    >
                      👁️
                    </button>
                    <button className="admin-action-btn" title="Editar" onClick={() => abrirModal("editar", asilo)}>
                      ✏️
                    </button>
                    <button
                      className="admin-action-btn"
                      title="Suspender"
                      onClick={() => abrirModal("suspender", asilo)}
                    >
                      🚫
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderEventos = () => (
    <div className="admin-eventos">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Monitoramento de Eventos</h2>
        <div className="admin-filters">
          <select className="admin-select">
            <option>Todos os Status</option>
            <option>Ativos</option>
            <option>Concluídos</option>
            <option>Cancelados</option>
          </select>
          <select className="admin-select">
            <option>Todas as Cidades</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
            <option>Belo Horizonte</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome do Evento</th>
              <th>Asilo Organizador</th>
              <th>Data</th>
              <th>Inscritos</th>
              <th>Confirmados</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.nome}</td>
                <td>{evento.asilo}</td>
                <td>{new Date(evento.data).toLocaleDateString("pt-BR")}</td>
                <td>{evento.voluntariosInscritos}</td>
                <td>{evento.voluntariosConfirmados}</td>
                <td>
                  <span className={`admin-badge admin-badge-${evento.status}`}>
                    {evento.status === "ativo" ? "Ativo" : evento.status === "concluido" ? "Concluído" : "Cancelado"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-action-btn"
                      title="Ver Detalhes"
                      onClick={() => abrirModal("detalhes", evento)}
                    >
                      👁️
                    </button>
                    <button className="admin-action-btn" title="Editar" onClick={() => abrirModal("editar", evento)}>
                      ✏️
                    </button>
                    <button
                      className="admin-action-btn"
                      title="Encerrar"
                      onClick={() => abrirModal("encerrar", evento)}
                    >
                      🔒
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderRelatorios = () => (
    <div className="admin-relatorios">
      <h2 className="admin-section-title">Relatórios e Estatísticas</h2>

      <div className="admin-reports-grid">
        <div className="admin-report-card">
          <div className="admin-report-icon">📊</div>
          <h3>Engajamento Mensal</h3>
          <p>Análise de eventos e voluntários ativos no último mês</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("relatorio", "engajamento")}>
            Gerar Relatório
          </button>
        </div>

        <div className="admin-report-card">
          <div className="admin-report-icon">💬</div>
          <h3>Satisfação dos Asilos</h3>
          <p>Taxa média de aprovação e feedback dos asilos</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("relatorio", "satisfacao")}>
            Gerar Relatório
          </button>
        </div>

        <div className="admin-report-card">
          <div className="admin-report-icon">🧓</div>
          <h3>Impacto Social</h3>
          <p>Total de idosos beneficiados e atividades realizadas</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("relatorio", "impacto")}>
            Gerar Relatório
          </button>
        </div>

        <div className="admin-report-card">
          <div className="admin-report-icon">🔐</div>
          <h3>Conformidade LGPD</h3>
          <p>Logs de consentimento, exportações e exclusões</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("relatorio", "lgpd")}>
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  )

  const renderDenuncias = () => (
    <div className="admin-denuncias">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Denúncias e Segurança</h2>
        <div className="admin-filters">
          <select className="admin-select">
            <option>Todos os Status</option>
            <option>Pendente</option>
            <option>Investigando</option>
            <option>Resolvido</option>
          </select>
        </div>
      </div>

      <div className="admin-denuncias-list">
        {denuncias.map((denuncia) => (
          <div key={denuncia.id} className="admin-denuncia-card" data-status={denuncia.status}>
            <div className="admin-denuncia-header">
              <div className="admin-denuncia-tipo">
                <span className="admin-denuncia-icon">🚨</span>
                <h3>{denuncia.tipo}</h3>
              </div>
              <span className={`admin-badge admin-badge-${denuncia.status}`}>
                {denuncia.status === "pendente"
                  ? "Pendente"
                  : denuncia.status === "investigando"
                    ? "Investigando"
                    : "Resolvido"}
              </span>
            </div>
            <div className="admin-denuncia-body">
              <p>
                <strong>Usuário:</strong> {denuncia.usuario}
              </p>
              <p>
                <strong>Descrição:</strong> {denuncia.descricao}
              </p>
              <p>
                <strong>Data:</strong> {new Date(denuncia.data).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="admin-denuncia-actions">
              <button
                className="admin-btn admin-btn-small admin-btn-primary"
                onClick={() => abrirModal("analisar", denuncia)}
              >
                Analisar
              </button>
              <button
                className="admin-btn admin-btn-small admin-btn-outline"
                onClick={() => abrirModal("detalhes", denuncia)}
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderConteudo = () => (
    <div className="admin-conteudo">
      <h2 className="admin-section-title">Gestão de Conteúdo</h2>

      <div className="admin-content-grid">
        <div className="admin-content-card">
          <div className="admin-content-icon">📄</div>
          <h3>Termos de Uso</h3>
          <p>Última atualização: 15/03/2024</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "termos")}>
            Editar
          </button>
        </div>

        <div className="admin-content-card">
          <div className="admin-content-icon">🔒</div>
          <h3>Política de Privacidade</h3>
          <p>Última atualização: 15/03/2024</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "privacidade")}>
            Editar
          </button>
        </div>

        <div className="admin-content-card">
          <div className="admin-content-icon">📰</div>
          <h3>Notícias e Campanhas</h3>
          <p>3 campanhas ativas</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "noticias")}>
            Gerenciar
          </button>
        </div>

        <div className="admin-content-card">
          <div className="admin-content-icon">❓</div>
          <h3>FAQ</h3>
          <p>12 perguntas cadastradas</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "faq")}>
            Gerenciar
          </button>
        </div>

        <div className="admin-content-card">
          <div className="admin-content-icon">🖼️</div>
          <h3>Banners e Imagens</h3>
          <p>5 banners ativos</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "banners")}>
            Gerenciar
          </button>
        </div>

        <div className="admin-content-card">
          <div className="admin-content-icon">✉️</div>
          <h3>Mensagens Automáticas</h3>
          <p>8 templates configurados</p>
          <button className="admin-btn admin-btn-outline" onClick={() => abrirModal("editar-conteudo", "mensagens")}>
            Gerenciar
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button className="admin-menu-toggle" onClick={toggleMenuMobile}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="admin-logo">
            <span style={{ fontSize: "1.5rem" }}>🏠</span>
          </div>
          <h1 className="admin-header-title">Painel Administrativo</h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <span className="admin-user-name">Admin</span>
            <div className="admin-user-avatar">A</div>
          </div>
          <button className="admin-logout-btn" onClick={voltarParaHome} title="Sair">
            🚪
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${menuMobileAberto ? "admin-sidebar-open" : ""}`}>
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${moduloAtivo === "dashboard" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("dashboard")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">📊</span>
              <span className="admin-nav-text">Dashboard</span>
            </button>

            <button
              className={`admin-nav-item ${moduloAtivo === "usuarios" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("usuarios")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">👥</span>
              <span className="admin-nav-text">Usuários</span>
            </button>

            <button
              className={`admin-nav-item ${moduloAtivo === "eventos" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("eventos")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">📅</span>
              <span className="admin-nav-text">Eventos</span>
            </button>

            <button
              className={`admin-nav-item ${moduloAtivo === "relatorios" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("relatorios")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">📈</span>
              <span className="admin-nav-text">Relatórios</span>
            </button>

            <button
              className={`admin-nav-item ${moduloAtivo === "conteudo" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("conteudo")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">📝</span>
              <span className="admin-nav-text">Conteúdo</span>
            </button>

            <button
              className={`admin-nav-item ${moduloAtivo === "denuncias" ? "admin-nav-active" : ""}`}
              onClick={() => {
                setModuloAtivo("denuncias")
                setMenuMobileAberto(false)
              }}
            >
              <span className="admin-nav-icon">🚨</span>
              <span className="admin-nav-text">Denúncias</span>
              {estatisticas.denunciasPendentes > 0 && (
                <span className="admin-nav-badge">{estatisticas.denunciasPendentes}</span>
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {moduloAtivo === "dashboard" && renderDashboard()}
          {moduloAtivo === "usuarios" && renderUsuarios()}
          {moduloAtivo === "eventos" && renderEventos()}
          {moduloAtivo === "relatorios" && renderRelatorios()}
          {moduloAtivo === "conteudo" && renderConteudo()}
          {moduloAtivo === "denuncias" && renderDenuncias()}
        </main>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="admin-modal-overlay" onClick={fecharModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {modalTipo === "detalhes" && "Detalhes"}
                {modalTipo === "editar" && "Editar"}
                {modalTipo === "suspender" && "Suspender Usuário"}
                {modalTipo === "encerrar" && "Encerrar Evento"}
                {modalTipo === "analisar" && "Analisar Denúncia"}
                {modalTipo === "relatorio" && "Gerar Relatório"}
                {modalTipo === "exportar" && "Exportar Dados"}
                {modalTipo === "editar-conteudo" && "Editar Conteúdo"}
              </h3>
              <button className="admin-modal-close" onClick={fecharModal}>
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <p>Funcionalidade em desenvolvimento. Aqui você poderá realizar ações administrativas.</p>
              {itemSelecionado && (
                <div className="admin-modal-info">
                  <pre>{JSON.stringify(itemSelecionado, null, 2)}</pre>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={fecharModal}>
                Cancelar
              </button>
              <button className="admin-btn admin-btn-primary" onClick={fecharModal}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay do menu mobile */}
      {menuMobileAberto && <div className="admin-sidebar-overlay" onClick={toggleMenuMobile}></div>}
    </div>
  )
}

export default PainelAdministrador
