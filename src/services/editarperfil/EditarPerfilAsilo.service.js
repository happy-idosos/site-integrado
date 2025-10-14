import { API_BASE_URL } from "../auth/auth.constants"
import { getToken } from "../auth/auth.helpers"

export const editarPerfilAsiloService = {
  async buscarPerfil() {
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/api/perfil`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.perfil && data.perfil.foto_perfil) {
        if (!data.perfil.foto_perfil.startsWith("http")) {
          data.perfil.logo_url = `${API_BASE_URL}/uploads/perfis/${data.perfil.foto_perfil}`
        } else {
          data.perfil.logo_url = data.perfil.foto_perfil
        }
      }

      console.log("📡 Resposta buscarPerfil asilo:", data)
      return data
    } catch (error) {
      console.error("❌ Erro ao buscar perfil asilo:", error)
      throw error
    }
  },

  async editarPerfilBasico(dados) {
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/api/perfil/editar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("📡 Resposta editarPerfilBasico asilo:", data)
      return data
    } catch (error) {
      console.error("❌ Erro ao editar perfil básico do asilo:", error)
      throw error
    }
  },

  async editarPerfilDetalhes(dados) {
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/api/perfil/editar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("📡 Resposta editarPerfilDetalhes asilo:", data)
      return data
    } catch (error) {
      console.error("❌ Erro ao editar perfil detalhado do asilo:", error)
      throw error
    }
  },

  async uploadLogo(arquivo) {
    try {
      console.log("🔄 Upload do logo:", arquivo.name)

      const token = getToken()
      const formData = new FormData()
      formData.append("foto_perfil", arquivo)

      console.log("📤 Enviando FormData para upload...")

      const response = await fetch(`${API_BASE_URL}/api/perfil/foto`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      console.log("📡 Status da resposta:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Erro HTTP:", response.status, errorText)
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("📡 Resposta uploadLogo:", data)
      return data
    } catch (error) {
      console.error("❌ Erro ao fazer upload do logo do asilo:", error)
      throw error
    }
  },
}
