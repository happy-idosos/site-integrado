import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home/Home"
import Asilos from "../pages/Asilos/Asilos.jsx"
import Eventos from "../pages/Eventos/Eventos.jsx"
import Videos from "../pages/Videos/Videos.jsx"
import SobreNos from "../pages/SobreNos/SobreNos.jsx"
import Contato from "../pages/Contato/Contato.jsx"
import CadastroAsilo from "../pages/CadastroAsilo/CadastroAsilo.jsx"
import CadastroVoluntario from "../pages/CadastroVoluntario/CadastroVoluntario.jsx"
import LoginAsilo from "../pages/LoginAsilo/LoginAsilo.jsx"
import LoginVoluntario from "../pages/LoginVoluntario/LoginVoluntario.jsx"
import EsqueciASenha from "../pages/EsqueciASenha/EsqueciASenha.jsx"
import TermosDeUso from "../pages/TermosDeUso/TermosDeUso.jsx"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/asilos" element={<Asilos />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/sobrenos" element={<SobreNos />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/cadastroasilo" element={<CadastroAsilo />} />
      <Route path="/cadastrovoluntario" element={<CadastroVoluntario />} />
      <Route path="/loginasilo" element={<LoginAsilo />} />
      <Route path="/loginvoluntario" element={<LoginVoluntario />} />
      <Route path="/esqueciasenha" element={<EsqueciASenha />} />
      <Route path="/termosdeuso" element={<TermosDeUso />} />
    </Routes>
  )
}

export default AppRoutes
