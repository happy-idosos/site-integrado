"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "aos/dist/aos.css"
import AOS from "aos"
import "./Eventos.css"
import { api } from "../../services/api"
import { API_BASE_URL } from "../../services/auth/auth.constants"

// Importações de bibliotecas
import carouselum from "../../assets/img/carousels/carousel-12.jpg"
import carouseldois from "../../assets/img/carousels/carousel-11.jpg"
import carouseltres from "../../assets/img/carousels/carousel-10.jpg"

const Eventos = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    time: "",
    location: "",
    contact: "",
    capacity: 1,
  })
  const eventosSectionRef = useRef(null)

  // Função para mapear categorias baseadas na descrição
  const mapCategory = (description) => {
    if (!description) return 'conversa'
    
    const desc = description.toLowerCase()
    if (desc.includes('música') || desc.includes('musica') || desc.includes('cantar') || desc.includes('canto')) return 'musica'
    if (desc.includes('arte') || desc.includes('pintura') || desc.includes('artesanato') || desc.includes('craft')) return 'arte'
    if (desc.includes('conversa') || desc.includes('bate-papo') || desc.includes('palestra') || desc.includes('debate')) return 'conversa'
    if (desc.includes('exercício') || desc.includes('exercicio') || desc.includes('yoga') || desc.includes('caminhada') || desc.includes('alongamento')) return 'exercicio'
    if (desc.includes('culinária') || desc.includes('culinaria') || desc.includes('cooking') || desc.includes('culinaria') || desc.includes('receita')) return 'culinaria'
    return 'conversa'
  }

  // Função para determinar status do evento
  const getEventStatus = (event) => {
    const eventDate = new Date(event.data_evento)
    const today = new Date()
    
    if (eventDate < today) return 'cancelado'
    
    // Simular lotação baseada em algum critério
    const isFull = Math.random() > 0.7 // 30% de chance de estar lotado
    return isFull ? 'lotado' : 'disponivel'
  }

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const data = await api.get('/api/eventos')
      console.log("Dados recebidos da API:", data)
      
      if (data.status === 200) {
        // Mapear dados do backend para o formato esperado no frontend
        const formattedEvents = data.eventos.map(event => {
          const category = mapCategory(event.descricao)
          const status = getEventStatus(event)
          
          return {
            id: event.id_evento,
            title: event.titulo,
            category: category,
            description: event.descricao,
            date: event.data_evento,
            time: "14:00", // Valor padrão
            location: event.nome_asilo || "Local a definir",
            contact: event.email_asilo || "",
            capacity: 50, // Valor padrão
            registered: Math.floor(Math.random() * 50), // Simular inscrições
            status: status
          }
        })
        
        setEvents(formattedEvents)
        setHasMore(false) // Backend atual não suporta paginação
      } else {
        console.error("Erro ao carregar eventos:", data.message)
        setEvents([])
      }
    } catch (error) {
      console.error("Error loading events:", error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const eventData = await api.get('/api/eventos')
      if (eventData.status === 200) {
        const today = new Date()
        const availableEvents = eventData.eventos.filter(e => new Date(e.data_evento) >= today)
        
        setStats({
          totalEvents: eventData.eventos.length,
          availableEvents: availableEvents.length
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
      setStats({ totalEvents: 0, availableEvents: 0 })
    }
  }

  const inscreverEvento = async (eventId) => {
    setIsLoadingAction(true)
    try {
      const response = await api.post('/api/eventos/participar', {
        id_evento: eventId
      })
      
      if (response.status === 200) {
        showModalSuccess("Inscrição realizada com sucesso!", "Sucesso!")
        loadEvents() // Recarregar eventos para atualizar contagem
      } else {
        showModalError(response.message || "Erro ao se inscrever no evento.")
      }
    } catch (error) {
      console.error("Error registering for event:", error)
      showModalError(error.message || "Erro ao se inscrever no evento.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const scrollToEvents = () => {
    if (eventosSectionRef.current) {
      eventosSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const showCreateEventModal = () => {
    // Verificação mais robusta
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    
    console.log('🔐 Modal - Token:', token ? 'PRESENTE' : 'AUSENTE');
    console.log('👤 Modal - User Data:', userDataStr);
    
    if (!token || !userDataStr) {
      showModalError("Você precisa estar logado para criar um evento.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
  
    try {
      const user = JSON.parse(userDataStr);
      console.log('👤 Modal - User object:', user);
      console.log('👤 Modal - Tipo de usuário:', user.tipo);
      
      // Debug do token
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔐 Modal - Payload do token:', payload);
          console.log('🔐 Modal - Tem campo data?:', !!payload.data);
          console.log('🔐 Modal - Data content:', payload.data);
        } catch (e) {
          console.log('🔐 Modal - Erro ao decodificar token:', e);
        }
      }
      
      if (user.tipo !== 'asilo') {
        showModalError(`Somente asilos podem criar eventos. Seu tipo é: ${user.tipo || 'não definido'}`);
        return;
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      showModalError('Erro ao verificar permissões. Tente fazer login novamente.');
    }
  }

  const showModalSuccess = (message, title = "Sucesso!") => {
    setModalTitle(title)
    setModalMessage(message)
    setShowSuccessModal(true)
  }

  const showModalError = (message, title = "Erro!") => {
    setModalTitle(title)
    setModalMessage(message)
    setShowErrorModal(true)
  }

  const createEvent = async () => {
    setIsLoadingAction(true)
    try {
      // DEBUG: Verificar autenticação detalhadamente
      const token = localStorage.getItem('auth_token');
      const userDataStr = localStorage.getItem('user_data');
      
      console.log('🔐 DEBUG - Token:', token);
      console.log('👤 DEBUG - User Data string:', userDataStr);
      
      if (!token || !userDataStr) {
        showModalError("Você precisa estar logado para criar um evento.");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const user = JSON.parse(userDataStr);
      console.log('👤 DEBUG - User object:', user);
      console.log('👤 DEBUG - Tipo de usuário:', user.tipo);
      
      if (user.tipo !== 'asilo') {
        showModalError("Somente asilos podem criar eventos. Seu tipo é: " + (user.tipo || 'não definido'));
        return;
      }

      // DEBUG: Verificar o que há no token JWT
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔐 DEBUG - Payload do token:', payload);
        } catch (e) {
          console.log('🔐 DEBUG - Não foi possível decodificar o token:', e);
        }
      }

      // Validar campos obrigatórios
      if (!eventForm.title || !eventForm.description || !eventForm.date) {
        showModalError("Preencha todos os campos obrigatórios: título, descrição e data.");
        return;
      }

      const eventData = {
        titulo: eventForm.title,
        descricao: eventForm.description,
        data_evento: eventForm.date
      }

      console.log('📤 DEBUG - Enviando dados:', eventData);

      const response = await api.post('/api/eventos/criar', eventData);
      
      console.log('📥 DEBUG - Resposta:', response);
      
      if (response.status === 201) {
        showModalSuccess("Evento criado com sucesso!", "Evento Criado!")
        setShowModal(false)
        setEventForm({
          title: "",
          category: "",
          description: "",
          date: "",
          time: "",
          location: "",
          contact: "",
          capacity: 1,
        })
        loadEvents()
      } else {
        showModalError(response.message || "Erro ao criar o evento.")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      showModalError(error.message || "Erro ao criar o evento. Verifique se você está logado como asilo.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const loadMoreEvents = async () => {
    // Backend atual não suporta paginação
    console.warn("Paginação não implementada no backend")
  }

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })

    loadEvents()
    loadStats()
  }, [])

  useEffect(() => {
    const filterEvents = () => {
      let filtered = events
      if (searchTerm) {
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
      if (selectedCategory) {
        filtered = filtered.filter((event) => event.category === selectedCategory)
      }
      if (selectedDate) {
        const today = new Date().toISOString().split("T")[0]
        const weekLater = new Date(today)
        weekLater.setDate(weekLater.getDate() + 7)
        const monthLater = new Date(today)
        monthLater.setMonth(monthLater.getMonth() + 1)

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date).toISOString().split("T")[0]
          if (selectedDate === "hoje") {
            return eventDate === today
          } else if (selectedDate === "semana") {
            return eventDate >= today && eventDate <= weekLater.toISOString().split("T")[0]
          } else if (selectedDate === "mes") {
            return eventDate >= today && eventDate <= monthLater.toISOString().split("T")[0]
          }
          return true
        })
      }
      setFilteredEvents(filtered)
    }

    filterEvents()
  }, [events, searchTerm, selectedCategory, selectedDate])

  // Modal de Sucesso
  const SuccessModal = () => (
    <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-confirm">
        <div className="modal-content">
          <div className="modal-header">
            <div className="icon-box success">
              <i className="fas fa-check"></i>
            </div>
            <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
          </div>
          <div className="modal-body text-center">
            <h4>{modalTitle}</h4>
            <p>{modalMessage}</p>
            <button className="btn btn-success" onClick={() => setShowSuccessModal(false)}>
              <i className="fas fa-thumbs-up me-2"></i>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal de Erro
  const ErrorModal = () => (
    <div className={`modal fade ${showErrorModal ? 'show' : ''}`} style={{ display: showErrorModal ? 'block' : 'none' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-confirm">
        <div className="modal-content">
          <div className="modal-header">
            <div className="icon-box error">
              <i className="fas fa-times"></i>
            </div>
            <button type="button" className="btn-close" onClick={() => setShowErrorModal(false)}></button>
          </div>
          <div className="modal-body text-center">
            <h4>{modalTitle}</h4>
            <p>{modalMessage}</p>
            <button className="btn btn-error" onClick={() => setShowErrorModal(false)}>
              <i className="fas fa-redo me-2"></i>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Event card component
  const EventCard = ({ event }) => {
    const categoryIcons = {
      musica: "fas fa-music",
      arte: "fas fa-palette",
      conversa: "fas fa-comments",
      exercicio: "fas fa-dumbbell",
      culinaria: "fas fa-utensils",
    }

    const statusText = {
      disponivel: "Disponível",
      lotado: "Lotado",
      cancelado: "Cancelado",
    }

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    }

    const formatTime = (timeStr) => {
      return timeStr.substring(0, 5)
    }

    return (
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card event-card">
          <div className={`event-status ${event.status}`}>{statusText[event.status]}</div>
          <div className="card-body text-center">
            <div className="event-icon">
              <i className={categoryIcons[event.category] || "fas fa-calendar"}></i>
            </div>
            <div className="event-category">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <ul className="event-details">
              <li>
                <i className="fas fa-calendar-days"></i> {formatDate(event.date)}
              </li>
              <li>
                <i className="fas fa-clock"></i> {formatTime(event.time)}
              </li>
              <li>
                <i className="fas fa-location-dot"></i> {event.location}
              </li>
              <li>
                <i className="fas fa-users"></i> {event.registered}/{event.capacity} inscritos
              </li>
            </ul>
            <button
              className="btn-inscricao"
              onClick={() => inscreverEvento(event.id)}
              disabled={event.status === "lotado" || event.status === "cancelado" || isLoadingAction}
            >
              {isLoadingAction ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processando...
                </>
              ) : event.status === "lotado" ? (
                "Evento Lotado"
              ) : event.status === "cancelado" ? (
                "Evento Cancelado"
              ) : (
                "Inscrever-se"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="eventos-page">
      <Header />

      <div
        id="carouselExampleCaptions"
        className="carousel slide hero-carousel"
        data-bs-ride="carousel"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={carouselum || "/placeholder.svg"} className="d-block w-100" alt="Voluntários em atividade" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Eventos para Voluntários e Idosos</h2>
              <p>Participe de eventos ou crie o seu próprio para promover a interação entre voluntários e idosos</p>
              <button className="btn btn-outline-primary btn" onClick={scrollToEvents}>
                Ver Eventos
              </button>
            </div>
          </div>
          <div className="carousel-item">
            <img src={carouseldois || "/placeholder.svg"} className="d-block w-100" alt="Cuidado com idosos" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Conecte-se Através de Eventos</h2>
              <p>Descubra oportunidades únicas de voluntariado e participe de atividades significativas</p>
              <button className="btn btn-outline-primary btn" onClick={scrollToEvents}>
                Ver Eventos
              </button>
            </div>
          </div>
          <div className="carousel-item">
            <img src={carouseltres || "/placeholder.svg"} className="d-block w-100" alt="Trabalho em equipe" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Faça a Diferença</h2>
              <p>Organize eventos especiais e crie momentos inesquecíveis para nossa comunidade</p>
              <button className="btn btn-outline-primary btn" onClick={scrollToEvents}>
                Ver Eventos
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="divisor" />

      <main>
        <section
          className="eventos-lista py-5"
          id="eventosSection"
          ref={eventosSectionRef}
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="container">
            <h2 className="text-center mb-4 eventos-main-title">Próximos Eventos</h2>

            <div className="text-center mb-5">
              <button className="btn-criar-evento" onClick={showCreateEventModal}>
                <i className="fas fa-plus-circle me-2"></i>
                Criar Novo Evento
              </button>
            </div>

            <div className="eventos-filtros-card mb-5" data-aos="fade-up" data-aos-duration="800">
              <div className="row g-3">
                <div className="col-md-12 mb-3">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar eventos por título, descrição ou local..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    <option value="musica">Música</option>
                    <option value="arte">Arte</option>
                    <option value="conversa">Conversa</option>
                    <option value="exercicio">Exercício</option>
                    <option value="culinaria">Culinária</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Todas as datas</option>
                    <option value="hoje">Hoje</option>
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mês</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading spinner */}
            {isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            )}

            {/* Container para os eventos */}
            {!isLoading && filteredEvents.length > 0 && (
              <div className="row">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {/* Mensagem quando não há eventos */}
            {!isLoading && filteredEvents.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Nenhum evento encontrado</h4>
                <p className="text-muted">Tente ajustar os filtros ou criar um novo evento.</p>
              </div>
            )}

            {/* Botão carregar mais */}
            {hasMore && (
              <div className="text-center mt-4">
                <button className="btn btn-outline-primary btn-lg" onClick={loadMoreEvents}>
                  Carregar Mais Eventos
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal para Criar Evento */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Criar Novo Evento</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    createEvent()
                  }}
                >
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventTitle" className="form-label">
                        Título do Evento *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="eventTitle"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventCategory" className="form-label">
                        Categoria
                      </label>
                      <select
                        className="form-select"
                        id="eventCategory"
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="musica">Música</option>
                        <option value="arte">Arte</option>
                        <option value="conversa">Conversa</option>
                        <option value="exercicio">Exercício</option>
                        <option value="culinaria">Culinária</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="eventDescription" className="form-label">
                      Descrição *
                    </label>
                    <textarea
                      className="form-control"
                      id="eventDescription"
                      rows="3"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventDate" className="form-label">
                        Data *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="eventDate"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventTime" className="form-label">
                        Horário
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="eventTime"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="eventLocation" className="form-label">
                        Local
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="eventLocation"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="eventCapacity" className="form-label">
                        Capacidade
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="eventCapacity"
                        min="1"
                        value={eventForm.capacity}
                        onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="eventContact" className="form-label">
                      Contato do Organizador
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="eventContact"
                      value={eventForm.contact}
                      onChange={(e) => setEventForm({ ...eventForm, contact: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoadingAction}>
                      {isLoadingAction ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Criando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>Criar Evento
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Feedback */}
      <SuccessModal />
      <ErrorModal />

      <Footer />
    </div>
  )
}

export default Eventos