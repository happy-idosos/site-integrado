"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Videos.css"

import carouselum from "../../assets/img/carousel-1.jpg"
import carouseldois from "../../assets/img/carousel-2.jpg"
import carouseltres from "../../assets/img/carousel-3.jpg"

function Videos() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCategory, setCurrentCategory] = useState("todos")
  const [currentSearch, setCurrentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videoPlayerModalRef = useRef(null)
  const uploadModalRef = useRef(null)
  const videoPlayerRef = useRef(null)

  // Mock data para desenvolvimento - preparado para futura integração com API
  const mockVideos = [
    {
      id: "1",
      title: "Atividades Recreativas no Asilo São José",
      description: "Momentos especiais durante as atividades de pintura e música com os residentes.",
      category: "atividades",
      author: "Maria Silva",
      createdAt: "2025-01-15T10:00:00Z",
      duration: 225,
      views: 1200,
      likes: 89,
      thumbnail: carouselum,
      videoUrl: "/videos/1.mp4",
    },
    {
      id: "2",
      title: "Festa de Aniversário - 90 Anos da Dona Rosa",
      description: "Celebração especial dos 90 anos da querida Dona Rosa com toda a família do lar.",
      category: "eventos",
      author: "João Santos",
      createdAt: "2025-01-12T14:30:00Z",
      duration: 312,
      views: 856,
      likes: 124,
      thumbnail: carouseldois,
      videoUrl: "/videos/2.mp4",
    },
    {
      id: "3",
      title: "Depoimento: A Importância do Voluntariado",
      description: "Seu Antônio conta como o trabalho voluntário transformou sua vida no lar.",
      category: "depoimentos",
      author: "Ana Costa",
      createdAt: "2025-01-10T16:00:00Z",
      duration: 150,
      views: 2100,
      likes: 203,
      thumbnail: carouseltres,
      videoUrl: "/videos/3.mp4",
    },
  ]

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    const carouselElement = document.querySelector("#heroCarousel")
    if (carouselElement && window.bootstrap) {
      new window.bootstrap.Carousel(carouselElement, {
        ride: "carousel",
        interval: 6000,
        pause: "hover",
      })
    }

    if (window.bootstrap) {
      videoPlayerModalRef.current = new window.bootstrap.Modal(document.getElementById("videoPlayerModal"))
      uploadModalRef.current = new window.bootstrap.Modal(document.getElementById("uploadModal"))
    }

    loadVideos()
  }, [])

  const getMockVideos = (page, category, search) => {
    let filteredVideos = mockVideos

    if (category !== "todos") {
      filteredVideos = filteredVideos.filter((video) => video.category === category)
    }

    if (search) {
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const startIndex = (page - 1) * 6
    const endIndex = startIndex + 6
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex)

    return {
      videos: paginatedVideos,
      hasMore: endIndex < filteredVideos.length,
      totalPages: Math.ceil(filteredVideos.length / 6),
      currentPage: page,
    }
  }

  const loadVideos = async (reset = true) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const data = getMockVideos(reset ? 1 : currentPage, currentCategory, currentSearch)

      if (reset) {
        setVideos(data.videos)
        setCurrentPage(1)
      } else {
        setVideos((prev) => [...prev, ...data.videos])
      }

      setHasMore(data.hasMore)
      if (!reset) {
        setCurrentPage((prev) => prev + 1)
      }
    } catch (error) {
      showError("Erro ao carregar vídeos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreVideos = () => {
    setCurrentPage((prev) => prev + 1)
    loadVideos(false)
  }

  const filterVideos = (category) => {
    setCurrentCategory(category)
    setCurrentPage(1)
    loadVideos(true)
  }

  const searchVideos = (query) => {
    setCurrentSearch(query)
    setCurrentPage(1)
    loadVideos(true)
  }

  const openVideoPlayer = (video) => {
    setSelectedVideo(video)
    videoPlayerModalRef.current?.show()
  }

  const handleVideoUpload = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    try {
      setUploadProgress(0)

      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 100)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      showSuccess("Vídeo enviado com sucesso! Aguarde a aprovação.")
      uploadModalRef.current?.hide()
      e.target.reset()
      loadVideos(true)
    } catch (error) {
      showError("Erro ao enviar vídeo. Tente novamente.")
    } finally {
      setUploadProgress(0)
    }
  }

  const validateVideoFile = (file) => {
    if (!file) return true

    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      showError("O arquivo é muito grande. Tamanho máximo: 100MB")
      return false
    }

    const allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime"]
    if (!allowedTypes.includes(file.type)) {
      showError("Formato de arquivo não suportado. Use MP4, AVI ou MOV.")
      return false
    }

    return true
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  const showError = (message) => {
    alert(`Erro: ${message}`)
  }

  const showSuccess = (message) => {
    alert(`Sucesso: ${message}`)
  }

 return (
  <div className="videos-page-wrapper">
    <Header />

    {/* Hero Carousel */}
    <div
      id="heroCarousel"
      className="carousel slide hero-carousel"
      data-bs-ride="carousel"
      data-aos="fade-up"
      data-aos-duration="1200"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={carouselum || "/placeholder.svg"}
            className="d-block w-100"
            alt="Galeria de vídeos da comunidade"
            loading="eager"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2>Galeria de Vídeos da Comunidade</h2>
            <p>Compartilhe momentos especiais e inspire outras pessoas através dos vídeos da nossa comunidade de idosos</p>
            <div className="videos-hero-buttons">
              <a href="#videos-grid" className="btn btn-outline-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ver Vídeos
              </a>

            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src={carouseldois || "/placeholder.svg"}
            className="d-block w-100"
            alt="Momentos inesquecíveis"
            loading="lazy"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2>Momentos Inesquecíveis</h2>
            <p>Registre e compartilhe as atividades, eventos e depoimentos que fazem a diferença na vida dos idosos</p>
            <div className="videos-hero-buttons">
              <a href="#videos-grid" className="btn btn-outline-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ver Vídeos
              </a>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src={carouseltres || "/placeholder.svg"}
            className="d-block w-100"
            alt="Conectando gerações"
            loading="lazy"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2>Conectando Gerações</h2>
            <p>Através dos vídeos, criamos pontes entre diferentes gerações e compartilhamos experiências valiosas</p>
            <div className="videos-hero-buttons">
              <a href="#videos-grid" className="btn btn-outline-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Ver Vídeos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

      <hr className="divisor" />

      <main className="videos-main-content">
        {/* Header Section */}
        <section className="videos-header-section" data-aos="fade-up">
          <div className="container">
            <h2 className="text-center mb-4 videos-main-title">Vídeos da Comunidade</h2>

            {/* Prominent upload button outside header */}
            <div className="text-center mb-5">
              <button className="btn-enviar-video" onClick={() => uploadModalRef.current?.show()}>
                <i className="fas fa-plus-circle me-2"></i>
                Enviar Novo Vídeo
              </button>
            </div>

            {/* Moved filters to card container */}
            <div className="videos-filtros-card" data-aos="fade-up" data-aos-delay="200">
              <div className="row g-3">
                <div className="col-md-12 mb-3">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar vídeos por título, descrição ou autor..."
                      value={currentSearch}
                      onChange={(e) => searchVideos(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="videos-filter-buttons">
                    <button
                      className={`videos-btn-filter ${currentCategory === "todos" ? "active" : ""}`}
                      onClick={() => filterVideos("todos")}
                    >
                      <i className="fas fa-th"></i>
                      Todos
                    </button>
                    <button
                      className={`videos-btn-filter ${currentCategory === "atividades" ? "active" : ""}`}
                      onClick={() => filterVideos("atividades")}
                    >
                      <i className="fas fa-palette"></i>
                      Atividades
                    </button>
                    <button
                      className={`videos-btn-filter ${currentCategory === "eventos" ? "active" : ""}`}
                      onClick={() => filterVideos("eventos")}
                    >
                      <i className="fas fa-calendar"></i>
                      Eventos
                    </button>
                    <button
                      className={`videos-btn-filter ${currentCategory === "depoimentos" ? "active" : ""}`}
                      onClick={() => filterVideos("depoimentos")}
                    >
                      <i className="fas fa-comments"></i>
                      Depoimentos
                    </button>
                    <button
                      className={`videos-btn-filter ${currentCategory === "tutoriais" ? "active" : ""}`}
                      onClick={() => filterVideos("tutoriais")}
                    >
                      <i className="fas fa-book"></i>
                      Tutoriais
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Vídeos */}
        <section className="videos-section" id="videos-grid" data-aos="fade-up">
          <div className="container">
            {videos.length === 0 && !isLoading ? (
              <div className="videos-empty-state" data-aos="zoom-in">
                <div className="videos-empty-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <h3>Nenhum vídeo encontrado</h3>
                <p>Tente ajustar os filtros ou seja o primeiro a compartilhar um vídeo!</p>
                <button className="btn videos-btn-primary" onClick={() => uploadModalRef.current?.show()}>
                  Enviar Primeiro Vídeo
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {videos.map((video, index) => (
                  <div key={video.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="videos-video-card" onClick={() => openVideoPlayer(video)}>
                      <div className="videos-video-thumbnail">
                        <img src={video.thumbnail || "/img/placeholder.jpg"} alt={video.title} className="img-fluid" />
                        <div className="videos-play-overlay">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                        <span className="videos-video-duration">{formatDuration(video.duration)}</span>
                        <div className="videos-video-category">{video.category}</div>
                      </div>
                      <div className="videos-video-info">
                        <h5 className="videos-video-title">{video.title}</h5>
                        <p className="videos-video-description">{video.description}</p>
                        <div className="videos-video-meta">
                          <div className="videos-video-author">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="me-2"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            {video.author}
                          </div>
                          <div className="videos-video-date">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="me-2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {formatDate(video.createdAt)}
                          </div>
                        </div>
                        <div className="videos-video-stats">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="me-2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {formatNumber(video.views)}
                          </span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="me-2"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {formatNumber(video.likes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="videos-loading-state">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando vídeos...</p>
              </div>
            )}

            {hasMore && !isLoading && videos.length > 0 && (
              <div className="text-center mt-5" data-aos="fade-up">
                <button className="btn videos-btn-load-more" onClick={loadMoreVideos}>
                  Carregar Mais Vídeos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Seção de Estatísticas */}
        <section className="videos-statistics-section" data-aos="fade-up">
          <div className="container">
            <h2 className="videos-section-title">Estatísticas da Comunidade</h2>
            <div className="row g-4">
              <div className="col-md-3 col-sm-6" data-aos="zoom-in" data-aos-delay="100">
                <div className="videos-stat-card">
                  <div className="videos-stat-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div className="videos-stat-number">150+</div>
                  <div className="videos-stat-label">Vídeos Compartilhados</div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6" data-aos="zoom-in" data-aos-delay="200">
                <div className="videos-stat-card">
                  <div className="videos-stat-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="videos-stat-number">25k+</div>
                  <div className="videos-stat-label">Visualizações</div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6" data-aos="zoom-in" data-aos-delay="300">
                <div className="videos-stat-card">
                  <div className="videos-stat-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div className="videos-stat-number">3.2k+</div>
                  <div className="videos-stat-label">Curtidas</div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6" data-aos="zoom-in" data-aos-delay="400">
                <div className="videos-stat-card">
                  <div className="videos-stat-icon" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="videos-stat-number">80+</div>
                  <div className="videos-stat-label">Usuários Ativos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="videos-cta-section" data-aos="fade-up">
          <div className="container">
            <div className="videos-cta-content">
              <div className="videos-cta-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h2 className="videos-cta-title">Compartilhe Seus Momentos</h2>
              <p className="videos-cta-subtitle">
                Faça parte da nossa comunidade e compartilhe vídeos que inspiram e emocionam.
              </p>
              <div className="videos-cta-buttons" data-aos="zoom-in" data-aos-delay="200">
                <button className="btn videos-btn-cta-primary" onClick={() => uploadModalRef.current?.show()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Enviar Vídeo
                </button>
                <Link to="/cadastrovoluntario" className="btn videos-btn-cta-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Tornar-se Voluntário
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Upload de Vídeo */}
      <div className="modal fade" id="uploadModal" tabIndex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content videos-modal-content">
            <div className="modal-header videos-modal-header">
              <h5 className="modal-title" id="uploadModalLabel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                >
                  <path d="M21 15v-2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Enviar Novo Vídeo
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body videos-modal-body">
              <form id="uploadForm" onSubmit={handleVideoUpload}>
                <div className="mb-4">
                  <label htmlFor="videoFile" className="form-label">
                    Selecionar Vídeo
                  </label>
                  <input
                    type="file"
                    className="form-control videos-file-input"
                    id="videoFile"
                    accept="video/*"
                    required
                    onChange={(e) => validateVideoFile(e.target.files[0])}
                  />
                  <div className="form-text">Formatos aceitos: MP4, AVI, MOV. Tamanho máximo: 100MB</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="videoTitle" className="form-label">
                    Título do Vídeo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="videoTitle"
                    placeholder="Digite um título descritivo"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="videoDescription" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="videoDescription"
                    rows="4"
                    placeholder="Conte mais sobre este vídeo..."
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="videoCategory" className="form-label">
                    Categoria
                  </label>
                  <select className="form-select" id="videoCategory" required>
                    <option value="">Selecione uma categoria</option>
                    <option value="atividades">Atividades</option>
                    <option value="eventos">Eventos</option>
                    <option value="depoimentos">Depoimentos</option>
                    <option value="tutoriais">Tutoriais</option>
                  </select>
                </div>
                {uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="progress videos-upload-progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                    <p className="text-center mt-2 videos-upload-text">Enviando vídeo...</p>
                  </div>
                )}
                <div className="modal-footer videos-modal-footer">
                  <button type="button" className="btn videos-btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <button type="submit" className="btn videos-btn-primary" disabled={uploadProgress > 0}>
                    {uploadProgress > 0 ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Enviar Vídeo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Player de Vídeo */}
      <div
        className="modal fade"
        id="videoPlayerModal"
        tabIndex="-1"
        aria-labelledby="videoPlayerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content videos-modal-content">
            <div className="modal-header videos-modal-header">
              <h5 className="modal-title" id="videoPlayerModalLabel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-2"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Reproduzir Vídeo
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-0">
              {selectedVideo && (
                <>
                  <div className="videos-video-player-container">
                    <video ref={videoPlayerRef} className="w-100" controls>
                      <source src={selectedVideo.videoUrl} type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                  <div className="videos-video-details">
                    <h4>{selectedVideo.title}</h4>
                    <p>{selectedVideo.description}</p>
                    <div className="videos-video-meta-modal">
                      <span className="videos-video-author-modal">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-2"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {selectedVideo.author}
                      </span>
                      <span className="videos-video-date-modal">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatDate(selectedVideo.createdAt)}
                      </span>
                    </div>
                    <div className="videos-video-actions">
                      <button className="btn videos-btn-action">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span className="ms-2">Curtir ({formatNumber(selectedVideo.likes)})</span>
                      </button>
                      <button className="btn videos-btn-action">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        <span className="ms-2">Compartilhar</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Videos
