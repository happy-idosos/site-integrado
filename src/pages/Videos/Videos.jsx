"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Videos.css"

import carouselum from "../../assets/img/carousels/carousel-2.jpg"
import { api } from "../../services/api"
import { API_BASE_URL } from "../../services/auth/auth.constants"

function Videos() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSearch, setCurrentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [notification, setNotification] = useState({ show: false, type: '', message: '', title: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  const videoPlayerModalRef = useRef(null)
  const uploadModalRef = useRef(null)
  const notificationModalRef = useRef(null)

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userDataStr = localStorage.getItem('user_data')
        const token = localStorage.getItem('auth_token')
        
        if (userDataStr && token) {
          const user = JSON.parse(userDataStr)
          setCurrentUser(user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Inicialização - SÓ quando estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) return

    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
    
    // Inicializar modais do Bootstrap
    const initModals = () => {
      if (window.bootstrap) {
        const videoModalEl = document.getElementById("videoPlayerModal")
        const uploadModalEl = document.getElementById("uploadModal")
        const notificationModalEl = document.getElementById("notificationModal")
        
        if (videoModalEl) videoPlayerModalRef.current = new window.bootstrap.Modal(videoModalEl)
        if (uploadModalEl) uploadModalRef.current = new window.bootstrap.Modal(uploadModalEl)
        if (notificationModalEl) notificationModalRef.current = new window.bootstrap.Modal(notificationModalEl)
      }
    }

    initModals()
    loadVideos(true)
  }, [isAuthenticated])

  // 🔹 Mostrar notificação
  const showNotification = (type, message, title = "") => {
    setNotification({ 
      show: true, 
      type, 
      message,
      title: title || (type === 'success' ? 'Sucesso!' : 'Erro!')
    })
    notificationModalRef.current?.show()
    
    if (type === 'success') {
      setTimeout(() => {
        hideNotification()
      }, 3000)
    }
  }

  // 🔹 Esconder notificação
  const hideNotification = () => {
    notificationModalRef.current?.hide()
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '', title: '' })
    }, 300)
  }

  // 🔹 Buscar vídeos
  const loadVideos = async (reset = true) => {
    if (!isAuthenticated) {
      showNotification('error', "Você precisa estar logado para acessar os vídeos.")
      return
    }

    if (isLoading) return
    setIsLoading(true)
    try {
      const response = await api.get("/api/videos")
      
      if (response.status === 200 && response.data) {
        let fetchedVideos = response.data

        // Filtro de busca
        if (currentSearch) {
          fetchedVideos = fetchedVideos.filter(v =>
            v.nome_midia?.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (v.descricao && v.descricao.toLowerCase().includes(currentSearch.toLowerCase()))
          )
        }

        const paginated = fetchedVideos.slice(0, currentPage * 6)
        setVideos(paginated)
        setHasMore(fetchedVideos.length > paginated.length)
      } else {
        throw new Error("Resposta inválida da API")
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error)
      showNotification('error', error.message || "Erro ao carregar vídeos")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreVideos = () => {
    if (!isAuthenticated) return
    setCurrentPage(prev => prev + 1)
    loadVideos(false)
  }

  const searchVideos = (q) => {
    if (!isAuthenticated) {
      showNotification('error', "Você precisa estar logado para buscar vídeos.")
      return
    }
    setCurrentSearch(q)
    setCurrentPage(1)
    loadVideos(true)
  }

  const openVideoPlayer = (video) => {
    if (!isAuthenticated) {
      showNotification('error', "Você precisa estar logado para assistir vídeos.")
      return
    }
    setSelectedVideo(video)
    videoPlayerModalRef.current?.show()
  }

  const showUploadModal = () => {
    if (!isAuthenticated) {
      showNotification('error', "Você precisa estar logado para enviar vídeos.")
      setTimeout(() => navigate('/login'), 2000)
      return
    }
    uploadModalRef.current?.show()
  }

  // 📤 Upload de vídeo - VERSÃO FINAL CORRIGIDA
  const handleVideoUpload = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      showNotification('error', "Você precisa estar logado para enviar vídeos.")
      return
    }

    setIsLoadingAction(true)
    const form = e.target
    const fileInput = form.querySelector("#videoFile")
    const file = fileInput.files[0]
    const titulo = form.querySelector("#videoTitle").value
    const descricao = form.querySelector("#videoDescription").value

    if (!validateVideoFile(file)) {
      setIsLoadingAction(false)
      return
    }

    try {
      setUploadProgress(10)
      
      const formData = new FormData()
      formData.append("video", file)
      formData.append("titulo", titulo)
      formData.append("descricao", descricao)

      console.log('📤 Iniciando upload do vídeo:', {
        titulo,
        descricao,
        file: file.name,
        size: file.size,
        type: file.type
      })

      // Simular progresso (em produção, isso seria com axios e onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Usar a API configurada que já inclui o token de autenticação
      const response = await api.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log('✅ Resposta do upload:', response)

      if (response.status === 200 || response.status === 201) {
        showNotification('success', "Vídeo enviado com sucesso!", "Upload Concluído!")
        uploadModalRef.current?.hide()
        form.reset()
        // Recarregar a lista de vídeos
        loadVideos(true)
      } else {
        throw new Error(response.message || "Erro ao enviar vídeo")
      }
    } catch (err) {
      console.error("❌ Erro no upload:", err)
      showNotification('error', err.message || "Erro ao enviar vídeo. Tente novamente.")
    } finally {
      setIsLoadingAction(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const validateVideoFile = (file) => {
    if (!file) {
      showNotification('error', "Por favor, selecione um arquivo de vídeo.")
      return false
    }
    
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      showNotification('error', "O arquivo é muito grande (máximo 100MB).")
      return false
    }
    
    const allowedTypes = [
      "video/mp4", 
      "video/avi", 
      "video/mov", 
      "video/quicktime", 
      "video/webm",
      "video/x-msvideo"
    ]
    
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', "Formato inválido. Use MP4, AVI, MOV ou WEBM.")
      return false
    }
    
    return true
  }

  const formatDate = (date) => {
    if (!date) return "Data não disponível"
    return new Date(date).toLocaleDateString("pt-BR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Se não estiver autenticado, mostrar mensagem
  if (!isAuthenticated) {
    return (
      <div className="videos-page">
        <Header />
        <div className="container text-center py-5">
          <div className="auth-required-message">
            <i className="fas fa-sign-in-alt fa-3x text-muted mb-3"></i>
            <h3 className="text-muted">Acesso Restrito</h3>
            <p className="text-muted mb-4">Você precisa estar logado para acessar a galeria de vídeos.</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/login')}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Fazer Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="videos-page">
      <Header />

      {/* Hero Section - Carousel */}
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
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={carouselum || "/placeholder.svg"} className="d-block w-100" alt="Galeria de Vídeos" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Nossa Galeria de Vídeos</h2>
              <p>Descubra momentos especiais, depoimentos emocionantes e conteúdos inspiradores</p>
              <button className="btn btn-outline-light btn-lg">
                Explorar Vídeos
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="divisor" />

      <main>
        <section
          className="videos-lista py-5"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="container">
            <h2 className="text-center mb-4 videos-main-title">Nossa Galeria de Vídeos</h2>

            <div className="text-center mb-5">
              <button 
                className="btn-criar-video" 
                onClick={showUploadModal}
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Carregando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle me-2"></i>
                    Enviar Novo Vídeo
                  </>
                )}
              </button>
            </div>

            {/* Filtros e Busca */}
            <div className="videos-filtros-card mb-5" data-aos="fade-up" data-aos-duration="800">
              <div className="row g-3">
                <div className="col-md-12 mb-3">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar vídeos por título ou descrição..."
                      value={currentSearch}
                      onChange={(e) => searchVideos(e.target.value)}
                      disabled={isLoading}
                    />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading spinner */}
            {isLoading && videos.length === 0 && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando vídeos...</p>
              </div>
            )}

            {/* Grid de Vídeos */}
            {!isLoading && videos.length > 0 && (
              <div className="row">
                {videos.map((video, index) => (
                  <div key={video.id_midia || index} className="col-lg-4 col-md-6 mb-4">
                    <div className="card video-card" data-aos="fade-up" data-aos-delay={index % 3 * 100}>
                      <div className="video-thumbnail-container" onClick={() => openVideoPlayer(video)}>
                        <video
                          src={`${API_BASE_URL}/${video.url}`}
                          className="video-thumbnail"
                          muted
                          preload="metadata"
                        />
                        <div className="video-overlay">
                          <div className="play-button">
                            <i className="fas fa-play"></i>
                          </div>
                        </div>
                        <div className="video-duration">2:30</div>
                      </div>
                      <div className="card-body text-center">
                        <div className="video-icon">
                          <i className="fas fa-play-circle"></i>
                        </div>
                        <h3 className="video-title">{video.nome_midia || "Vídeo Sem Título"}</h3>
                        {video.descricao && (
                          <p className="video-description">
                            {video.descricao.length > 120 
                              ? `${video.descricao.substring(0, 120)}...` 
                              : video.descricao}
                          </p>
                        )}
                        <ul className="video-details">
                          <li>
                            <i className="fas fa-user"></i> {video.autor_nome || "Autor Desconhecido"}
                          </li>
                          <li>
                            <i className="fas fa-calendar"></i> {formatDate(video.criado_em)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensagem quando não há vídeos */}
            {!isLoading && videos.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-video-slash fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Nenhum vídeo encontrado</h4>
                <p className="text-muted">
                  {currentSearch 
                    ? `Nenhum resultado para "${currentSearch}"` 
                    : "Ainda não há vídeos publicados. Seja o primeiro a compartilhar!"}
                </p>
                <button 
                  className="btn-criar-video"
                  onClick={showUploadModal}
                >
                  <i className="fas fa-plus-circle me-2"></i>
                  Enviar Primeiro Vídeo
                </button>
              </div>
            )}

            {/* Botão carregar mais */}
            {hasMore && !isLoading && videos.length > 0 && (
              <div className="text-center mt-4">
                <button className="btn btn-outline-primary btn-lg" onClick={loadMoreVideos}>
                  Carregar Mais Vídeos
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal Player de Vídeo */}
      <div className="modal fade video-player-modal" id="videoPlayerModal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedVideo?.nome_midia || "Reproduzindo Vídeo"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedVideo && (
                <div className="video-player-container">
                  <video
                    src={`${API_BASE_URL}/${selectedVideo.url}`}
                    controls
                    autoPlay
                    className="video-player"
                    style={{ width: '100%', maxHeight: '70vh' }}
                  />
                </div>
              )}
            </div>
            {selectedVideo?.descricao && (
              <div className="modal-footer">
                <div className="video-description-full">
                  <h6>Descrição:</h6>
                  <p className="mb-0">{selectedVideo.descricao}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      <div className="modal fade upload-modal" id="uploadModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enviar Novo Vídeo</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleVideoUpload}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="videoTitle" className="form-label">
                      Título do Vídeo *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="videoTitle"
                      placeholder="Digite um título descritivo..."
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="videoDescription" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      className="form-control"
                      id="videoDescription"
                      rows="3"
                      placeholder="Descreva o conteúdo do vídeo (opcional)..."
                      maxLength={500}
                    ></textarea>
                    <div className="form-text">Máximo 500 caracteres</div>
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="videoFile" className="form-label">
                      Arquivo de Vídeo *
                    </label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        className="form-control"
                        id="videoFile"
                        accept="video/*"
                        required
                      />
                      <div className="upload-placeholder">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Clique para selecionar ou arraste um arquivo</p>
                        <span>Formatos: MP4, AVI, MOV, WEBM (Max: 100MB)</span>
                      </div>
                    </div>
                  </div>
                </div>
                {uploadProgress > 0 && (
                  <div className="upload-progress-container">
                    <label className="progress-label">Progresso do Upload</label>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <span className="progress-text">{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    disabled={isLoadingAction}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoadingAction || uploadProgress > 0}
                  >
                    {isLoadingAction ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload me-2"></i>
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

      {/* Modal de Notificação */}
      <div className="modal fade notification-modal" id="notificationModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className={`notification-body ${notification.type}`}>
              <div className="notification-icon">
                {notification.type === 'success' ? (
                  <i className="fas fa-check-circle"></i>
                ) : (
                  <i className="fas fa-exclamation-circle"></i>
                )}
              </div>
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
              </div>
              {notification.type === 'error' && (
                <button 
                  type="button" 
                  className="btn btn-close-notification"
                  onClick={hideNotification}
                >
                  Fechar
                </button>
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