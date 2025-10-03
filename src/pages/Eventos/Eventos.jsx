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

// Importações de bibliotecas
import carouselum from "../../assets/img/carousel-1.jpg"
import carouseldois from "../../assets/img/carousel-2.jpg"
import carouseltres from "../../assets/img/carousel-3.jpg"

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

  // API Configuration
  const API_BASE_URL = "https://api.happyidosos.com" // Substitua pela URL da sua API

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/events`)
      const data = await response.json()
      setEvents(data.events)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const inscreverEvento = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: "POST",
      })
      if (response.ok) {
        alert("Inscrição realizada com sucesso!")
        loadEvents()
      } else {
        alert("Erro ao se inscrever no evento.")
      }
    } catch (error) {
      console.error("Error registering for event:", error)
    }
  }

  const scrollToEvents = () => {
    eventosSectionRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const showCreateEventModal = () => {
    setShowModal(true)
  }

  const createEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventForm),
      })
      if (response.ok) {
        alert("Evento criado com sucesso!")
        setShowModal(false)
        loadEvents()
      } else {
        alert("Erro ao criar o evento.")
      }
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  const loadMoreEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/events?more=true`)
      const data = await response.json()
      setEvents([...events, ...data.events])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error("Error loading more events:", error)
    } finally {
      setIsLoading(false)
    }
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
            return eventDate >= today && eventDate <= weekLater
          } else if (selectedDate === "mes") {
            return eventDate >= today && eventDate <= monthLater
          }
          return true
        })
      }
      setFilteredEvents(filtered)
    }

    filterEvents()
  }, [events, searchTerm, selectedCategory, selectedDate])

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
              disabled={event.status === "lotado" || event.status === "cancelado"}
            >
              {event.status === "lotado"
                ? "Evento Lotado"
                : event.status === "cancelado"
                  ? "Evento Cancelado"
                  : "Inscrever-se"}
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
              <button className="btn btn-outline-light" onClick={scrollToEvents}>
                Ver Eventos
              </button>
            </div>
          </div>
          <div className="carousel-item">
            <img src={carouseldois || "/placeholder.svg"} className="d-block w-100" alt="Cuidado com idosos" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Conecte-se Através de Eventos</h2>
              <p>Descubra oportunidades únicas de voluntariado e participe de atividades significativas</p>
              <button className="btn btn-outline-light" onClick={scrollToEvents}>
                Ver Eventos
              </button>
            </div>
          </div>
          <div className="carousel-item">
            <img src={carouseltres || "/placeholder.svg"} className="d-block w-100" alt="Trabalho em equipe" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Faça a Diferença</h2>
              <p>Organize eventos especiais e crie momentos inesquecíveis para nossa comunidade</p>
              <button className="btn btn-outline-light" onClick={scrollToEvents}>
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
                        Categoria *
                      </label>
                      <select
                        className="form-select"
                        id="eventCategory"
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        required
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
                        Horário *
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="eventTime"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="eventLocation" className="form-label">
                        Local *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="eventLocation"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        required
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
                      Contato do Organizador *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="eventContact"
                      value={eventForm.contact}
                      onChange={(e) => setEventForm({ ...eventForm, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>Criar Evento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Eventos
