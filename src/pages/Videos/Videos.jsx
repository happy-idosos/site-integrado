"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Videos.css"

// Import do service
import { videoService } from "../../services/videos/videos.service"

import carouselum from "../../assets/img/carousels/carousel-8.jpg"
import carouseldois from "../../assets/img/carousels/carousel-7.jpg"
import carouseltres from "../../assets/img/carousels/carousel-11.jpg"

// URL base para desenvolvimento
const API_BASE_URL = 'http://localhost/api-php';

function Videos() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSearch, setCurrentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isBootstrapLoaded, setIsBootstrapLoaded] = useState(false)

  const videoPlayerModalRef = useRef(null)
  const uploadModalRef = useRef(null)
  const videoPlayerRef = useRef(null)

  useEffect(() => {
    // Verificar se Bootstrap está disponível
    const checkBootstrap = () => {
      if (window.bootstrap) {
        setIsBootstrapLoaded(true)
        initializeModals()
      } else {
        // Tentar novamente após um delay
        setTimeout(checkBootstrap, 100)
      }
    }

    checkBootstrap()

    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
      delay: 100,
    })

    loadVideos()
  }, [])

  const initializeModals = () => {
    try {
      const videoModalElement = document.getElementById("videoPlayerModal")
      const uploadModalElement = document.getElementById("uploadModal")
      
      if (videoModalElement && window.bootstrap?.Modal) {
        videoPlayerModalRef.current = new window.bootstrap.Modal(videoModalElement)
      }
      
      if (uploadModalElement && window.bootstrap?.Modal) {
        uploadModalRef.current = new window.bootstrap.Modal(uploadModalElement)
      }

      // Inicializar carousel
      const carouselElement = document.querySelector("#heroCarousel")
      if (carouselElement && window.bootstrap?.Carousel) {
        new window.bootstrap.Carousel(carouselElement, {
          ride: "carousel",
          interval: 6000,
          pause: "hover",
        })
      }
    } catch (error) {
      console.error("Erro ao inicializar modals:", error)
    }
  }

  // Função para carregar vídeos da API
const loadVideos = async (reset = true) => {
  if (isLoading) return

  setIsLoading(true)

  try {
    console.log('🔄 Carregando vídeos...')
    const response = await videoService.listVideos()
    
    console.log('📊 Resposta completa:', response)
    
    // Se a API retornar erro 500, usar dados mockados
    if (response.status === 500) {
      console.warn('⚠️ API retornou erro 500, usando dados mockados')
      loadMockVideos()
      return
    }
    
    if (response.status === 200 && response.data) {
      console.log('🎥 Vídeos encontrados:', response.data.length)
      
      // Mapear os dados da API
      const apiVideos = response.data.map(video => ({
        id: video.id_midia || video.id || `video-${Math.random()}`,
        title: video.nome_midia || video.titulo || 'Vídeo sem título',
        description: video.descricao || 'Sem descrição disponível',
        author: "Usuário",
        createdAt: new Date().toISOString(),
        duration: 0,
        views: 0,
        likes: 0,
        thumbnail: carouselum,
        videoUrl: video.url ? `${API_BASE_URL}/${video.url}` : '#'
      }))

      // Resto da lógica de paginação...
      let filteredVideos = apiVideos
      if (currentSearch) {
        filteredVideos = apiVideos.filter(
          (video) =>
            video.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            video.description.toLowerCase().includes(currentSearch.toLowerCase()),
        )
      }

      const pageToUse = reset ? 1 : currentPage
      const startIndex = (pageToUse - 1) * 6
      const endIndex = startIndex + 6
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex)

      if (reset) {
        setVideos(paginatedVideos)
        setCurrentPage(1)
      } else {
        setVideos((prev) => [...prev, ...paginatedVideos])
      }

      setHasMore(endIndex < filteredVideos.length)
      console.log('✅ Vídeos carregados com sucesso')
    } else {
      console.warn('⚠️ Estrutura de resposta inesperada, usando dados mockados')
      loadMockVideos()
    }

  } catch (error) {
    console.error("💥 Erro ao carregar vídeos:", error)
    showError("Erro ao carregar vídeos. Usando dados de exemplo.")
    loadMockVideos()
  } finally {
    setIsLoading(false)
  }
}

  // Fallback com dados mockados (apenas para desenvolvimento)
  const loadMockVideos = () => {
    const mockVideos = [
      {
        id: "1",
        title: "Atividades Recreativas",
        description: "Momentos especiais durante as atividades com os residentes.",
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
        title: "Festa de Aniversário",
        description: "Celebração dos 90 anos da Dona Rosa",
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
        title: "Depoimento Voluntariado",
        description: "Seu Antônio conta como o trabalho voluntário transformou sua vida",
        author: "Ana Costa",
        createdAt: "2025-01-10T16:00:00Z",
        duration: 150,
        views: 2100,
        likes: 203,
        thumbnail: carouseltres,
        videoUrl: "/videos/3.mp4",
      }
    ]
    setVideos(mockVideos)
    setHasMore(false)
  }

  const loadMoreVideos = () => {
    if (!hasMore || isLoading) return
    setCurrentPage((prev) => prev + 1)
    loadVideos(false)
  }

  const searchVideos = (query) => {
    setCurrentSearch(query)
    setCurrentPage(1)
    loadVideos(true)
  }

  const openVideoPlayer = (video) => {
    setSelectedVideo(video)
    if (videoPlayerModalRef.current) {
      videoPlayerModalRef.current.show()
    } else {
      const modalElement = document.getElementById("videoPlayerModal")
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement)
        modal.show()
      }
    }
  }

  const openUploadModal = () => {
    if (uploadModalRef.current) {
      uploadModalRef.current.show()
    } else {
      const modalElement = document.getElementById("uploadModal")
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement)
        modal.show()
      }
    }
  }

const handleVideoUpload = async (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const videoFile = formData.get('videoFile')
  const description = formData.get('videoDescription')

  console.log('📁 Arquivo selecionado:', videoFile)
  console.log('📝 Descrição:', description)

  // Validação do arquivo
  if (!validateVideoFile(videoFile)) {
    return
  }

  try {
    setUploadProgress(0)

    // Simular progresso de upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    // Preparar FormData - VERSÃO CORRIGIDA
    const uploadFormData = new FormData()
    uploadFormData.append('video', videoFile)
    uploadFormData.append('descricao', description)
    
    // Adicionar título (muitos backends esperam um campo 'titulo')
    const title = description.length > 50 ? description.substring(0, 47) + '...' : description
    uploadFormData.append('titulo', title)

    console.log('🔄 Enviando vídeo para o backend...')
    console.log('📦 Dados do FormData:')
    for (let [key, value] of uploadFormData.entries()) {
      console.log(`  ${key}:`, value)
    }
    
    // Enviar para a API
    const result = await videoService.uploadVideo(uploadFormData)
    
    clearInterval(progressInterval)
    setUploadProgress(100)

    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('📨 Resposta do upload:', result)

    // Tratar diferentes respostas de sucesso
    if (result.status === 201 || result.status === 200) {
      showSuccess("Vídeo enviado com sucesso! Aguarde a aprovação.")
      
      if (uploadModalRef.current) {
        uploadModalRef.current.hide()
      }
      
      e.target.reset()
      loadVideos(true)
    } else if (result.status === 400) {
      // Tratar erro 400 especificamente
      if (result.message.includes('Nenhum vídeo enviado')) {
        throw new Error('O arquivo de vídeo não foi recebido pelo servidor. Tente novamente.')
      } else {
        throw new Error(result.message || 'Erro no envio do vídeo')
      }
    } else {
      throw new Error(result.message || "Erro ao enviar vídeo")
    }
  } catch (error) {
    console.error("❌ Erro ao enviar vídeo:", error)
    showError(error.message || "Erro ao enviar vídeo. Tente novamente.")
  } finally {
    setUploadProgress(0)
  }
}

  const validateVideoFile = (file) => {
  if (!file) {
    showError("Por favor, selecione um arquivo de vídeo.")
    return false
  }

  console.log('🔍 Validando arquivo:', {
    name: file.name,
    size: file.size,
    type: file.type
  })

  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    showError("O arquivo é muito grande. Tamanho máximo: 100MB")
    return false
  }

  if (file.size === 0) {
    showError("O arquivo está vazio. Selecione um arquivo válido.")
    return false
  }

  const allowedTypes = [
    "video/mp4", 
    "video/webm", 
    "video/ogg", 
    "video/avi", 
    "video/mov", 
    "video/quicktime",
    "video/x-msvideo"
  ]
  
  if (!allowedTypes.includes(file.type)) {
    showError(`Formato de arquivo não suportado. Tipo detectado: ${file.type}. Use MP4, WEBM ou OGG.`)
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

  // Renderização condicional enquanto o Bootstrap carrega
  if (!isBootstrapLoaded) {
    return (
      <div className="videos-page-wrapper">
        <Header />
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando...</p>
        </div>
        <Footer />
      </div>
    )
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
                <a href="#videos-grid" className="btn btn-outline-primary btn">
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
                <a href="#videos-grid" className="btn btn-outline-primary btn">
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
                <a href="#videos-grid" className="btn btn-outline-primary btn">
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
              <button className="btn-enviar-video" onClick={openUploadModal}>
                <i className="fas fa-plus-circle me-2"></i>
                Enviar Novo Vídeo
              </button>
            </div>

            {/* Filtro de busca */}
            <div className="videos-filtros-card" data-aos="fade-up" data-aos-delay="200">
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar vídeos por título ou descrição..."
                      value={currentSearch}
                      onChange={(e) => searchVideos(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
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
                <p>Tente ajustar a busca ou seja o primeiro a compartilhar um vídeo!</p>
                <button className="btn videos-btn-primary" onClick={openUploadModal}>
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
                        {video.duration > 0 && (
                          <span className="videos-video-duration">{formatDuration(video.duration)}</span>
                        )}
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
                <button className="btn videos-btn-cta-primary" onClick={openUploadModal}>
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
                    name="videoFile"
                    accept="video/*"
                    required
                  />
                  <div className="form-text">Formatos aceitos: MP4, WEBM, OGG. Tamanho máximo: 100MB</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="videoDescription" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="videoDescription"
                    name="videoDescription"
                    rows="4"
                    placeholder="Conte mais sobre este vídeo..."
                    required
                  ></textarea>
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