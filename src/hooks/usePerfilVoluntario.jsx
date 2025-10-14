"use client"

// hooks/usePerfilVoluntario.jsx
import { useState, useEffect, useCallback } from "react"
import { perfilService } from "../services/editarperfil/perfilService"
import { API_BASE_URL } from "../services/auth/auth.constants" // ✅ IMPORTAR AQUI

export const usePerfilVoluntario = () => {
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // Buscar perfil do backend
  const buscarPerfil = useCallback(async () => {
    try {
      setCarregando(true)
      setErro(null)
      console.log("🔄 Buscando perfil do voluntário...")

      const response = await perfilService.buscarPerfil()

      if (response.status === 200 && response.perfil) {
        setPerfil(response.perfil)
        console.log("✅ Perfil carregado:", response.perfil)
        return response.perfil
      } else {
        throw new Error(response.message || "Erro ao carregar perfil")
      }
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error)
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  // Editar perfil básico
  const editarPerfilBasico = useCallback(
    async (dados) => {
      try {
        setErro(null)
        setCarregando(true)
        console.log("🔄 Editando perfil básico:", dados)

        const dadosCompletos = {
          nome: dados.nome || perfil?.nome,
          email: dados.email || perfil?.email,
          ...dados,
        }

        const response = await perfilService.editarPerfil(dadosCompletos)

        if (response.status === 200) {
          setPerfil((prev) => ({ ...prev, ...dadosCompletos }))
          return {
            success: true,
            message: response.message || "Perfil atualizado com sucesso",
          }
        } else {
          throw new Error(response.message || "Erro ao atualizar perfil")
        }
      } catch (error) {
        console.error("❌ Erro ao editar perfil básico:", error)
        setErro(error.message)
        return {
          success: false,
          message: error.message || "Erro ao atualizar perfil",
        }
      } finally {
        setCarregando(false)
      }
    },
    [perfil],
  )

  // Editar perfil voluntário
  const editarPerfilVoluntario = useCallback(
    async (dados) => {
      try {
        setErro(null)
        setCarregando(true)
        console.log("🔄 Editando perfil voluntário:", dados)

        const dadosCompletos = {
          nome: perfil?.nome,
          email: perfil?.email,
          ...dados,
        }

        const response = await perfilService.editarPerfil(dadosCompletos)

        if (response.status === 200) {
          setPerfil((prev) => ({ ...prev, ...dados }))
          return {
            success: true,
            message: response.message || "Perfil atualizado com sucesso",
          }
        } else {
          throw new Error(response.message || "Erro ao atualizar perfil")
        }
      } catch (error) {
        console.error("❌ Erro ao editar perfil voluntário:", error)
        setErro(error.message)
        return {
          success: false,
          message: error.message || "Erro ao atualizar perfil",
        }
      } finally {
        setCarregando(false)
      }
    },
    [perfil],
  )

  const uploadFoto = useCallback(async (arquivo) => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("🔄 Fazendo upload da foto:", arquivo.name)

      let response

      try {
        console.log("🔄 Tentando com rota específica de foto...")
        response = await perfilService.uploadFoto(arquivo)
      } catch (error) {
        console.log("🔄 Rota específica falhou, tentando com rota de editar perfil...", error.message)
        response = await perfilService.uploadFotoComDados(arquivo)
      }

      console.log("✅ Resposta upload:", response)

      if (response.status === 200 && response.foto) {
        // ✅ CORREÇÃO: Construir URL ABSOLUTA
        const fotoUrl = response.foto_url
          ? `${API_BASE_URL}${response.foto_url}`
          : `${API_BASE_URL}/uploads/perfis/${response.foto}`

        console.log("🖼️ URL ABSOLUTA da foto:", fotoUrl)

        // Atualizar perfil localmente
        setPerfil((prev) => ({
          ...prev,
          foto_perfil: response.foto,
          foto_url: fotoUrl,
        }))

        console.log("✅ Foto atualizada com sucesso:", fotoUrl)
        return {
          success: true,
          message: response.message || "Foto atualizada com sucesso",
          foto_url: fotoUrl,
        }
      } else {
        throw new Error(response.message || "Erro ao fazer upload da foto")
      }
    } catch (error) {
      console.error("❌ Erro ao fazer upload da foto:", error)
      setErro(error.message)
      return {
        success: false,
        message: error.message || "Erro ao fazer upload da foto",
      }
    } finally {
      setCarregando(false)
    }
  }, [])

  // Limpar erro
  const limparErro = useCallback(() => {
    setErro(null)
  }, [])

  // Carregar perfil na inicialização
  useEffect(() => {
    buscarPerfil()
  }, [buscarPerfil])

  return {
    perfil,
    carregando,
    erro,
    buscarPerfil,
    editarPerfilBasico,
    editarPerfilVoluntario,
    uploadFoto,
    limparErro,
    recarregarPerfil: buscarPerfil,
  }
}
