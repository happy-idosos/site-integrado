"use client"

import { useState, useEffect, useCallback } from "react"
import { editarPerfilAsiloService } from "../services/editarperfil/EditarPerfilAsilo.service"
import { API_BASE_URL } from "../services/auth/auth.constants"
import { useAuth } from "./useAuth" // ✅ NOVO IMPORT

export const usePerfilAsilo = () => {
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const { updateUserPhoto } = useAuth() // ✅ NOVO: Acesso ao contexto de autenticação

  const buscarPerfil = useCallback(async () => {
    try {
      setCarregando(true)
      setErro(null)
      console.log("🔄 Buscando perfil do asilo...")

      const response = await editarPerfilAsiloService.buscarPerfil()

      if (response.status === 200) {
        const perfilData = response.perfil || response.data?.perfil || response.data

        if (perfilData.foto_perfil && !perfilData.logo_url) {
          perfilData.logo_url = `${API_BASE_URL}${perfilData.foto_url || `/uploads/perfis/${perfilData.foto_perfil}`}`
        } else if (perfilData.logo_url && !perfilData.logo_url.startsWith("http")) {
          perfilData.logo_url = `${API_BASE_URL}${perfilData.logo_url}`
        }

        setPerfil(perfilData)
        console.log("✅ Perfil asilo carregado:", perfilData)
        return perfilData
      } else {
        throw new Error(response.message || "Erro ao carregar perfil do asilo")
      }
    } catch (error) {
      console.error("❌ Erro ao buscar perfil asilo:", error)
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  const editarPerfil = useCallback(
    async (dados) => {
      try {
        setCarregando(true)
        setErro(null)
        console.log("🔄 Editando perfil do asilo:", dados)

        const response = await editarPerfilAsiloService.editarPerfilBasico(dados)

        if (response.status === 200) {
          await buscarPerfil()
          console.log("✅ Perfil do asilo atualizado")
          return {
            success: true,
            message: response.message || "Perfil atualizado com sucesso",
          }
        } else {
          throw new Error(response.message || "Erro ao atualizar perfil do asilo")
        }
      } catch (error) {
        console.error("❌ Erro ao editar perfil do asilo:", error)
        setErro(error.message)
        return {
          success: false,
          message: error.message || "Erro ao atualizar perfil",
        }
      } finally {
        setCarregando(false)
      }
    },
    [buscarPerfil],
  )

  const uploadLogo = useCallback(async (arquivo) => {
    try {
      setErro(null)
      setCarregando(true)
      console.log("🔄 Fazendo upload do logo:", arquivo.name)

      const response = await editarPerfilAsiloService.uploadLogo(arquivo)

      console.log("✅ Resposta upload:", response)

      if (response.status === 200) {
        const logoUrl = response.foto_url
          ? `${API_BASE_URL}${response.foto_url}`
          : response.foto
            ? `${API_BASE_URL}/uploads/perfis/${response.foto}`
            : null

        console.log("🖼️ URL ABSOLUTA do logo:", logoUrl)

        // ✅ ATUALIZAR PERFIL LOCALMENTE
        setPerfil((prev) => ({
          ...prev,
          foto_perfil: response.foto,
          logo_url: logoUrl,
        }))

        // ✅ NOVO: ATUALIZAR NO CONTEXTO DE AUTENTICAÇÃO PARA O HEADER
        updateUserPhoto(logoUrl)
        console.log("✅ Logo atualizado no contexto de autenticação")

        console.log("✅ Logo atualizado com sucesso:", logoUrl)
        return {
          success: true,
          message: response.message || "Logo atualizado com sucesso",
          logo_url: logoUrl,
        }
      } else {
        throw new Error(response.message || "Erro ao fazer upload do logo")
      }
    } catch (error) {
      console.error("❌ Erro ao fazer upload do logo:", error)
      setErro(error.message)
      return {
        success: false,
        message: error.message || "Erro ao fazer upload do logo",
      }
    } finally {
      setCarregando(false)
    }
  }, [updateUserPhoto]) // ✅ NOVO: Adicionar dependência

  const limparErro = useCallback(() => setErro(null), [])

  useEffect(() => {
    buscarPerfil()
  }, [buscarPerfil])

  return {
    perfil,
    carregando,
    erro,
    buscarPerfil,
    editarPerfil,
    uploadLogo,
    limparErro,
    recarregarPerfil: buscarPerfil,
  }
}