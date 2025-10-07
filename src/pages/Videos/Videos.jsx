"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import "./Videos.css"

import carouselum from "../../assets/img/carousels/carousel-8.jpg"
import { api } from "../../services/api"
import { API_BASE_URL } from "../../services/auth/auth.constants"

function Videos() {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSearch, setCurrentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  const videoPlayerModalRef = useRef(null)
  const uploadModalRef = useRef(null)
  const notificationModalRef = useRef(null)

  // Inicialização
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out-cubic", once: true })
    if (window.bootstrap) {
      videoPlayerModalRef.current = new window.bootstrap.Modal(document.getElementById("videoPlayerModal"))
      uploadModalRef.current = new window.bootstrap.Modal(document.getElementById("uploadModal"))
      notificationModalRef.current = new window.bootstrap.Modal(document.getElementById("notificationModal"))
    }
    loadVideos(true)
  }, [])

  // 🔹 Mostrar notificação
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    notificationModalRef.current?.show()
    
    // Auto close para sucesso após 3 segundos
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
      setNotification({ show: false, type: '', message: '' })
    }, 300)
  }

  // 🔹 Buscar vídeos
  const loadVideos = async (reset = true) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const data = await api.get("/api/videos")
      if (!data?.data) throw new Error("Resposta inválida da API")

      let fetchedVideos = data.data

      // Filtro de busca apenas (categorias removidas)
      if (currentSearch) {
        fetchedVideos = fetchedVideos.filter(v =>
          v.nome_midia.toLowerCase().includes(currentSearch.toLowerCase()) ||
          (v.descricao && v.descricao.toLowerCase().includes(currentSearch.toLowerCase()))
        )
      }

      const paginated = fetchedVideos.slice(0, currentPage * 6)
      setVideos(paginated)
      setHasMore(fetchedVideos.length > paginated.length)
    } catch (error) {
      console.error(error)
      showNotification('error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreVideos = () => {
    setCurrentPage(prev => prev + 1)
    loadVideos(false)
  }

  const searchVideos = (q) => {
    setCurrentSearch(q)
    setCurrentPage(1)
    loadVideos(true)
  }

  const openVideoPlayer = (video) => {
    setSelectedVideo(video)
    videoPlayerModalRef.current?.show()
  }

  // 📤 Upload de vídeo
  const handleVideoUpload = async (e) => {
    e.preventDefault()
    const form = e.target
    const fileInput = form.querySelector("#videoFile")
    const file = fileInput.files[0]
    const titulo = form.querySelector("#videoTitle").value
    const descricao = form.querySelector("#videoDescription").value

    if (!validateVideoFile(file)) return

    const formData = new FormData()
    formData.append("video", file)
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)

    try {
      setUploadProgress(15)
      
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const responseText = await response.text()
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}...`)
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`)
      }

      setUploadProgress(100)
      showNotification('success', "Vídeo enviado com sucesso!")
      uploadModalRef.current?.hide()
      form.reset()
      loadVideos(true)
    } catch (err) {
      console.error("❌ Erro no upload:", err)
      showNotification('error', err.message || "Erro desconhecido no upload.")
    } finally {
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const validateVideoFile = (file) => {
    if (!file) {
      showNotification('error', "Por favor, selecione um arquivo de vídeo.")
      return false
    }
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      showNotification('error', "O arquivo é muito grande (máximo 100MB).")
      return false
    }
    const allowed = ["video/mp4", "video/avi", "video/mov", "video/quicktime", "video/webm"]
    if (!allowed.includes(file.type)) {
      showNotification('error', "Formato inválido. Use MP4, AVI, MOV ou WEBM.")
      return false
    }
    return true
  }

  const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR")

  return (
    <div className="videos-page">
      <Header />

      {/* Hero Section */}
      <section className="video-hero">
        <div className="container">
          <div className="hero-content">
            <h1 data-aos="fade-up">Nossa Galeria de Vídeos</h1>
            <p data-aos="fade-up" data-aos-delay="200">
              Descubra momentos especiais, depoimentos emocionantes e conteúdos inspiradores
            </p>
          </div>
        </div>
      </section>

      {/* Search and Upload Section */}
      <section className="search-upload-section">
        <div className="container">
          <div className="section-content">
            <div className="search-upload-grid">
              <div className="search-container" data-aos="fade-right">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="🔍 Buscar vídeos por título ou descrição..."
                    className="search-input"
                    onChange={(e) => searchVideos(e.target.value)}
                  />
                  <div className="search-icon">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
              </div>
              <div className="upload-container" data-aos="fade-left">
                <button
                  className="upload-btn-primary"
                  onClick={() => uploadModalRef.current?.show()}
                >
                  <span className="btn-icon">📹</span>
                  <span className="btn-text">Enviar Vídeo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="video-grid-section">
        <div className="container">
          <div className="section-content">
            {isLoading && videos.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Carregando vídeos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="empty-state" data-aos="fade-up">
                <div className="empty-icon">🎬</div>
                <h3>Nenhum vídeo encontrado</h3>
                <p>
                  {currentSearch 
                    ? `Nenhum resultado para "${currentSearch}"` 
                    : "Ainda não há vídeos publicados. Seja o primeiro a compartilhar!"}
                </p>
                <button 
                  className="upload-btn-secondary"
                  onClick={() => uploadModalRef.current?.show()}
                >
                  📹 Enviar Primeiro Vídeo
                </button>
              </div>
            ) : (
              <>
                <div className="video-grid">
                  {videos.map((v, index) => (
                    <div 
                      key={v.id_midia} 
                      className="video-card"
                      data-aos="fade-up" 
                      data-aos-delay={index % 3 * 100}
                    >
                      <div className="video-card-inner">
                        <div className="video-thumbnail-container" onClick={() => openVideoPlayer(v)}>
                          <video
                            src={`${API_BASE_URL}/${v.url}`}
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
                        <div className="video-card-content">
                          <h3 className="video-title">{v.nome_midia}</h3>
                          {v.descricao && (
                            <p className="video-description">
                              {v.descricao.length > 120 
                                ? `${v.descricao.substring(0, 120)}...` 
                                : v.descricao}
                            </p>
                          )}
                          <div className="video-meta">
                            <div className="meta-item">
                              <i className="fas fa-user"></i>
                              <span>{v.autor_nome}</span>
                            </div>
                            <div className="meta-item">
                              <i className="fas fa-calendar"></i>
                              <span>{formatDate(v.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && !isLoading && (
                  <div className="load-more-container" data-aos="fade-up">
                    <button className="load-more-btn" onClick={loadMoreVideos}>
                      <span>Carregar Mais Vídeos</span>
                      <i className="fas fa-arrow-down"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      <div className="modal fade video-player-modal" id="videoPlayerModal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedVideo?.nome_midia}</h3>
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
                  />
                </div>
              )}
            </div>
            {selectedVideo?.descricao && (
              <div className="modal-footer">
                <div className="video-description-full">
                  <p>{selectedVideo.descricao}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <div className="modal fade upload-modal" id="uploadModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleVideoUpload}>
              <div className="modal-header">
                <h3 className="modal-title">Enviar Novo Vídeo</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Título do Vídeo *</label>
                  <input 
                    id="videoTitle" 
                    className="form-control" 
                    placeholder="Digite um título descritivo..." 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea 
                    id="videoDescription" 
                    className="form-control" 
                    placeholder="Descreva o conteúdo do vídeo (opcional)..."
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Arquivo de Vídeo *</label>
                  <div className="file-upload-area">
                    <input 
                      id="videoFile" 
                      type="file" 
                      className="file-input" 
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploadProgress > 0}>
                  {uploadProgress > 0 ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload"></i>
                      Enviar Vídeo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
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
                <h4 className="notification-title">
                  {notification.type === 'success' ? 'Sucesso!' : 'Erro!'}
                </h4>
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