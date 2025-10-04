import { Routes, Route } from "react-router-dom"

// Pages
import Home from "../pages/Home/Home"
import CadastroVoluntario from "../pages/CadastroVoluntario/CadastroVoluntario"
import CadastroAsilo from "../pages/CadastroAsilo/CadastroAsilo"
import LoginVoluntario from "../pages/LoginVoluntario/LoginVoluntario"
import LoginAsilo from "../pages/LoginAsilo/LoginAsilo"
import Asilos from "../pages/Asilos/Asilos"
import Eventos from "../pages/Eventos/Eventos"
import Videos from "../pages/Videos/Videos"
import SobreNos from "../pages/SobreNos/SobreNos"
import Contato from "../pages/Contato/Contato"
import TermosDeUso from "../pages/TermosDeUso/TermosDeUso"
import EsqueciASenha from "../pages/EsqueciASenha/EsqueciASenha"

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/asilos" element={<Asilos />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/sobrenos" element={<SobreNos />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/termosdeuso" element={<TermosDeUso />} />
      <Route path="/esqueciasenha" element={<EsqueciASenha />} />
      
      {/* Auth Routes */}
      <Route path="/cadastrovoluntario" element={<CadastroVoluntario />} />
      <Route path="/cadastroasilo" element={<CadastroAsilo />} />
      <Route path="/loginvoluntario" element={<LoginVoluntario />} />
      <Route path="/loginasilo" element={<LoginAsilo />} />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes