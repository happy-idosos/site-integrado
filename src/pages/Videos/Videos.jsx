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
  const [sortBy, setSortBy] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [videoToDelete, setVideoToDelete] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false) // Adicione este estado

  const fileInputRef = useRef(null)

  // Adicione esta função
  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    // Se você tem um modal de login global, você pode disparar um evento ou usar contexto
    // Por enquanto, vamos redirecionar para a página de login como fallback
    navigate("/login");
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userDataStr = localStorage.getItem("user_data")
        const token = localStorage.getItem("auth_token")

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

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })

    if (isAuthenticated) {
      loadVideos(true)
    }
  }, [isAuthenticated, sortBy, categoryFilter])

  const showModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement)
      modal.show()
    }
  }

  const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElement)
      if (modal) {
        modal.hide()
      }
    }
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    showModal("notificationModal")

    if (type === "success") {
      setTimeout(() => {
        hideNotification()
      }, 3000)
    }
  }

  const hideNotification = () => {
    hideModal("notificationModal")
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 300)
  }

  const loadVideos = async (reset = true) => {
    if (isLoading || !isAuthenticated) return
    setIsLoading(true)
    try {
      const data = await api.get("/api/videos")
      if (!data?.data) throw new Error("Resposta inválida da API")

      let fetchedVideos = data.data

      if (currentSearch) {
        fetchedVideos = fetchedVideos.filter(
          (v) =>
            v.nome_midia.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (v.descricao && v.descricao.toLowerCase().includes(currentSearch.toLowerCase())),
        )
      }

      if (categoryFilter !== "all") {
        fetchedVideos = fetchedVideos.filter((v) => v.categoria === categoryFilter)
      }

      if (sortBy === "newest") {
        fetchedVideos.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
      } else if (sortBy === "oldest") {
        fetchedVideos.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em))
      } else if (sortBy === "title") {
        fetchedVideos.sort((a, b) => a.nome_midia.localeCompare(b.nome_midia))
      }

      const paginated = fetchedVideos.slice(0, currentPage * 6)
      setVideos(paginated)
      setHasMore(fetchedVideos.length > paginated.length)
    } catch (error) {
      console.error(error)
      showNotification("error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreVideos = () => {
    if (!isAuthenticated) return
    setCurrentPage((prev) => prev + 1)
    loadVideos(false)
  }

  const searchVideos = (q) => {
    if (!isAuthenticated) return
    setCurrentSearch(q)
    setCurrentPage(1)
    loadVideos(true)
  }

  const clearFilters = () => {
    setCurrentSearch("")
    setSortBy("newest")
    setCategoryFilter("all")
    setCurrentPage(1)
  }

  const openVideoPlayer = (video) => {
    if (!isAuthenticated) return
    setSelectedVideo(video)
    showModal("videoPlayerModal")
  }

  const openUploadModal = () => {
    if (!isAuthenticated) {
      showNotification("error", "Você precisa estar logado para enviar vídeos.")
      setTimeout(() => handleOpenLoginModal(), 2000) // Alterado para usar handleOpenLoginModal
      return
    }
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    const form = document.querySelector("#uploadModal form")
    if (form) {
      form.reset()
    }
    showModal("uploadModal")
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && validateVideoFile(file)) {
      setSelectedFile({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
        preview: URL.createObjectURL(file),
      })
    }
  }

  const handleVideoUpload = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      showNotification("error", "Você precisa estar logado para enviar vídeos.")
      setTimeout(() => handleOpenLoginModal(), 2000) // Alterado para usar handleOpenLoginModal
      return
    }

    const form = e.target
    const file = selectedFile?.file
    const titulo = form.querySelector("#videoTitle").value
    const descricao = form.querySelector("#videoDescription").value

    if (!file) {
      showNotification("error", "Por favor, selecione um arquivo de vídeo.")
      return
    }

    const formData = new FormData()
    formData.append("video", file)
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)

    try {
      setUploadProgress(15)

      const token = localStorage.getItem("auth_token")

      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
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
      showNotification("success", "Vídeo enviado com sucesso!")
      hideModal("uploadModal")
      form.reset()
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      loadVideos(true)
    } catch (err) {
      console.error("Erro no upload:", err)
      showNotification("error", err.message || "Erro desconhecido no upload.")
    } finally {
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const validateVideoFile = (file) => {
    if (!file) {
      showNotification("error", "Por favor, selecione um arquivo de vídeo.")
      return false
    }
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      showNotification("error", "O arquivo é muito grande (máximo 100MB).")
      return false
    }
    const allowed = ["video/mp4", "video/avi", "video/mov", "video/quicktime", "video/webm"]
    if (!allowed.includes(file.type)) {
      showNotification("error", "Formato inválido. Use MP4, AVI, MOV ou WEBM.")
      return false
    }
    return true
  }

  const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR")

  const NotificationModal = () => (
    <div
      className="modal fade"
      id="notificationModal"
      tabIndex="-1"
      aria-labelledby="notificationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className={`notification-body ${notification.type}`}>
            <div className="notification-icon">
              {notification.type === "success" ? (
                <i className="fas fa-check-circle"></i>
              ) : (
                <i className="fas fa-exclamation-circle"></i>
              )}
            </div>
            <div className="notification-content">
              <h4 className="notification-title">{notification.type === "success" ? "Sucesso!" : "Erro!"}</h4>
              <p className="notification-message">{notification.message}</p>
            </div>
            {notification.type === "error" && (
              <button type="button" className="btn btn-close-notification" onClick={hideNotification}>
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const handleDeleteVideo = async (videoId) => {
    if (!isAuthenticated) return

    try {
      await api.delete(`/api/videos/${videoId}`)
      showNotification("success", "Vídeo excluído com sucesso!")
      hideModal("deleteConfirmModal")
      setVideoToDelete(null)
      loadVideos(true)
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error)
      showNotification("error", error.message || "Erro ao excluir vídeo.")
    }
  }

  const openDeleteConfirmModal = (video) => {
    setVideoToDelete(video)
    showModal("deleteConfirmModal")
  }

  const isVideoOwner = (video) => {
    return currentUser && video.id_usuario === currentUser.id_usuario
  }

  const DeleteConfirmModal = () => (
    <div
      className="modal fade"
      id="deleteConfirmModal"
      tabIndex="-1"
      aria-labelledby="deleteConfirmModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirmar Exclusão
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>
              Tem certeza que deseja excluir o vídeo <strong>"{videoToDelete?.nome_midia}"</strong>?
            </p>
            <p className="text-muted mb-0">Esta ação não pode ser desfeita.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              <i className="fas fa-times me-2"></i>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={() => handleDeleteVideo(videoToDelete?.id_midia)}>
              <i className="fas fa-trash me-2"></i>
              Excluir Vídeo
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="videos-page">
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
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={carouselum || "/placeholder.svg"} className="d-block w-100" alt="Galeria de Vídeos" />
            <div className="carousel-caption d-none d-md-block">
              <h2>Nossa Galeria de Vídeos</h2>
              <p>Descubra momentos especiais, depoimentos emocionantes e conteúdos inspiradores</p>
                <button className="btn btn-outline-light btn-lg" >
                Ver Vídeos
              </button>
              {!isAuthenticated && (
                <button className="btn btn-outline-light btn-lg" onClick={handleOpenLoginModal}>
                  Fazer Login para Acessar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="divisor" />

      <main>
        <section className="videos-lista py-5" data-aos="fade-up" data-aos-duration="800">
          <div className="container">
            <h2 className="text-center mb-4 videos-main-title">Nossa Galeria de Vídeos</h2>

            {isAuthenticated && (
              <div className="text-center mb-5">
                <button className="videos-btn-criar" onClick={openUploadModal}>
                  <i className="fas fa-plus-circle"></i>
                  Enviar Novo Vídeo
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="videos-login-prompt-container" data-aos="fade-up">
                <div className="videos-login-prompt-card">
                  <div className="videos-login-prompt-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <h3 className="videos-login-prompt-title">Acesso Restrito</h3>
                  <p className="videos-login-prompt-text">
                    Faça login para acessar nossa galeria completa de vídeos e compartilhar seus próprios conteúdos.
                  </p>
                  <div className="videos-login-prompt-features">
                    <div className="videos-feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Assista vídeos exclusivos</span>
                    </div>
                    <div className="videos-feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Envie seus próprios vídeos</span>
                    </div>
                    <div className="videos-feature-item">
                      <i className="fas fa-check-circle"></i>
                      <span>Interaja com a comunidade</span>
                    </div>
                  </div>
                  <div className="videos-login-prompt-actions">
                    <button className="videos-btn-login-primary" onClick={handleOpenLoginModal}>
                      <i className="fas fa-sign-in-alt"></i>
                      Fazer Login
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="videos-filtros-card mb-5" data-aos="fade-up" data-aos-duration="800">
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <label className="videos-filter-label">
                      <i className="fas fa-search"></i>
                      Buscar Vídeos
                    </label>
                    <div className="videos-search-box">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por título ou descrição..."
                        value={currentSearch}
                        onChange={(e) => searchVideos(e.target.value)}
                      />
                      <i className="fas fa-search videos-search-icon"></i>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="videos-filter-label">
                      <i className="fas fa-sort"></i>
                      Ordenar Por
                    </label>
                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="newest">Mais Recentes</option>
                      <option value="oldest">Mais Antigos</option>
                      <option value="title">Título (A-Z)</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="videos-filter-label">
                      <i className="fas fa-filter"></i>
                      Categoria
                    </label>
                    <select
                      className="form-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">Todas</option>
                      <option value="eventos">Eventos</option>
                      <option value="depoimentos">Depoimentos</option>
                      <option value="tutoriais">Tutoriais</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  <div className="col-md-1">
                    <button className="videos-btn-clear-filters" onClick={clearFilters} title="Limpar filtros">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                {(currentSearch || sortBy !== "newest" || categoryFilter !== "all") && (
                  <div className="videos-active-filters">
                    <span className="videos-filter-badge-label">Filtros ativos:</span>
                    {currentSearch && (
                      <span className="videos-filter-badge">
                        Busca: "{currentSearch}"<i className="fas fa-times" onClick={() => searchVideos("")}></i>
                      </span>
                    )}
                    {sortBy !== "newest" && (
                      <span className="videos-filter-badge">
                        Ordem: {sortBy === "oldest" ? "Mais Antigos" : "Título"}
                        <i className="fas fa-times" onClick={() => setSortBy("newest")}></i>
                      </span>
                    )}
                    {categoryFilter !== "all" && (
                      <span className="videos-filter-badge">
                        Categoria: {categoryFilter}
                        <i className="fas fa-times" onClick={() => setCategoryFilter("all")}></i>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {isLoading && isAuthenticated && (
              <div className="row">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="col-lg-4 col-md-6 mb-4">
                    <div className="videos-card videos-skeleton-card">
                      <div className="videos-skeleton-thumbnail"></div>
                      <div className="card-body">
                        <div className="videos-skeleton-icon"></div>
                        <div className="videos-skeleton-title"></div>
                        <div className="videos-skeleton-text"></div>
                        <div className="videos-skeleton-text short"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && isAuthenticated && videos.length > 0 && (
              <div className="row">
                {videos.map((video, index) => (
                  <div key={video.id_midia} className="col-lg-4 col-md-6 mb-4">
                    <div className="card videos-card" data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
                      <div className="videos-thumbnail-container" onClick={() => openVideoPlayer(video)}>
                        <video
                          src={`${API_BASE_URL}/${video.url}#t=0.1`}
                          className="videos-thumbnail"
                          muted
                          preload="metadata"
                        />
                        <div className="videos-overlay">
                          <div className="videos-play-button">
                            <i className="fas fa-play"></i>
                          </div>
                        </div>
                        <div className="videos-duration">2:30</div>
                      </div>
                      <div className="card-body text-center">
                        {isVideoOwner(video) && (
                          <button
                            className="videos-btn-delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteConfirmModal(video)
                            }}
                            title="Excluir vídeo"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                        <div className="videos-icon">
                          <i className="fas fa-play-circle"></i>
                        </div>
                        <h3 className="videos-title">{video.nome_midia}</h3>
                        {video.descricao && (
                          <p className="videos-description">
                            {video.descricao.length > 120 ? `${video.descricao.substring(0, 120)}...` : video.descricao}
                          </p>
                        )}
                        <ul className="videos-details">
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

            {!isLoading && isAuthenticated && videos.length === 0 && (
              <div className="videos-empty-state" data-aos="fade-up">
                <div className="videos-empty-state-icon">
                  <i className="fas fa-video-slash"></i>
                </div>
                <h4 className="videos-empty-state-title">Nenhum vídeo encontrado</h4>
                <p className="videos-empty-state-text">
                  {currentSearch
                    ? `Nenhum resultado para "${currentSearch}". Tente outros termos de busca.`
                    : "Ainda não há vídeos publicados. Seja o primeiro a compartilhar!"}
                </p>
                {!currentSearch && (
                  <button className="videos-btn-criar" onClick={openUploadModal}>
                    <i className="fas fa-plus-circle"></i>
                    Enviar Primeiro Vídeo
                  </button>
                )}
              </div>
            )}

            {hasMore && !isLoading && isAuthenticated && (
              <div className="text-center mt-5">
                <button className="videos-btn-load-more" onClick={loadMoreVideos}>
                  <i className="fas fa-chevron-down"></i>
                  Carregar Mais Vídeos
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="modal fade videos-player-modal" id="videoPlayerModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedVideo?.nome_midia}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-0">
              {selectedVideo && (
                <div className="videos-player-container">
                  <video src={`${API_BASE_URL}/${selectedVideo.url}`} controls autoPlay className="videos-player" />
                </div>
              )}
            </div>
            {selectedVideo?.descricao && (
              <div className="modal-footer">
                <div className="videos-description-full">
                  <p>{selectedVideo.descricao}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modal fade videos-upload-modal" id="uploadModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-cloud-upload-alt"></i>
                Enviar Novo Vídeo
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleVideoUpload}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="videoTitle" className="form-label">
                      <i className="fas fa-heading"></i>
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
                      <i className="fas fa-align-left"></i>
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
                      <i className="fas fa-file-video"></i>
                      Arquivo de Vídeo *
                    </label>
                    <div className="videos-file-upload-area" onClick={() => fileInputRef.current?.click()}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="form-control videos-file-input"
                        id="videoFile"
                        accept="video/*"
                        onChange={handleFileSelect}
                        required
                      />
                      {!selectedFile ? (
                        <div className="videos-upload-placeholder">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <p>Clique para selecionar ou arraste um arquivo</p>
                          <span>Formatos: MP4, AVI, MOV, WEBM (Max: 100MB)</span>
                        </div>
                      ) : (
                        <div className="videos-file-preview">
                          <div className="videos-file-preview-video">
                            <video src={selectedFile.preview} muted />
                            <div className="videos-file-preview-overlay">
                              <i className="fas fa-play-circle"></i>
                            </div>
                          </div>
                          <div className="videos-file-preview-info">
                            <div className="videos-file-preview-name">
                              <i className="fas fa-file-video"></i>
                              {selectedFile.name}
                            </div>
                            <div className="videos-file-preview-details">
                              <span className="videos-file-size">{selectedFile.size} MB</span>
                              <span className="videos-file-type">{selectedFile.type.split("/")[1].toUpperCase()}</span>
                            </div>
                            <button
                              type="button"
                              className="videos-btn-remove-file"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedFile(null)
                                if (fileInputRef.current) fileInputRef.current.value = ""
                              }}
                            >
                              <i className="fas fa-times"></i>
                              Remover
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {uploadProgress > 0 && (
                  <div className="videos-upload-progress-container">
                    <label className="videos-progress-label">
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando vídeo...
                    </label>
                    <div className="videos-progress-bar-container">
                      <div className="videos-progress-bar-fill" style={{ width: `${uploadProgress}%` }}>
                        <span className="videos-progress-text">{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    <i className="fas fa-times"></i>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploadProgress > 0 || !selectedFile}>
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
      </div>

      <NotificationModal />
      <DeleteConfirmModal />

      <Footer />
    </div>
  )
}

export default Videos