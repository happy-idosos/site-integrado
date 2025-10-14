"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
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
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
    
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
 // 🔹 Buscar vídeos - VERSÃO CORRIGIDA
const loadVideos = async (reset = true) => {
  if (isLoading) return
  setIsLoading(true)
  try {
    // Use a função api com credentials configurada
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


// 📤 Upload de vídeo - VERSÃO COMPLETAMENTE CORRIGIDA
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
    
    const token = localStorage.getItem('token')
    
    // DEBUG - Verifique o que está sendo enviado
    console.log('🔐 Token:', token ? 'PRESENTE' : 'AUSENTE')
    console.log('📁 Arquivo:', file.name, file.size, file.type)
    console.log('🌐 URL:', `${API_BASE_URL}/api/videos`)

    const response = await fetch(`${API_BASE_URL}/api/videos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // ❌ NÃO inclua Content-Type - o browser define automaticamente para FormData
      },
      credentials: 'include', // ← CRÍTICO para CORS
      body: formData
    })

    console.log('✅ Status da resposta:', response.status)
    console.log('✅ Headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('📄 Resposta bruta:', responseText)
    
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
    console.error("❌ Erro completo no upload:", err)
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
                onClick={() => uploadModalRef.current?.show()}
              >
                <i className="fas fa-plus-circle me-2"></i>
                Enviar Novo Vídeo
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
              </div>
            )}

            {/* Grid de Vídeos */}
            {!isLoading && videos.length > 0 && (
              <div className="row">
                {videos.map((video, index) => (
                  <div key={video.id_midia} className="col-lg-4 col-md-6 mb-4">
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
                        <h3 className="video-title">{video.nome_midia}</h3>
                        {video.descricao && (
                          <p className="video-description">
                            {video.descricao.length > 120 
                              ? `${video.descricao.substring(0, 120)}...` 
                              : video.descricao}
                          </p>
                        )}
                        <ul className="video-details">
                          <li>
                            <i className="fas fa-user"></i> {video.autor_nome}
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
                  onClick={() => uploadModalRef.current?.show()}
                >
                  <i className="fas fa-plus-circle me-2"></i>
                  Enviar Primeiro Vídeo
                </button>
              </div>
            )}

            {/* Botão carregar mais */}
            {hasMore && !isLoading && (
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
              <h5 className="modal-title">{selectedVideo?.nome_midia}</h5>
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
                    ></textarea>
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
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploadProgress > 0}>
                    {uploadProgress > 0 ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
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