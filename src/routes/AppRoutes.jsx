import { Routes, Route } from "react-router-dom"

// Pages
import Home from "../pages/Home/Home"
import CadastroVoluntario from "../pages/CadastroVoluntario/CadastroVoluntario"
import CadastroAsilo from "../pages/CadastroAsilo/CadastroAsilo"
import Login from "../pages/Login/Login"
import LoginVoluntario from "../pages/LoginVoluntario/LoginVoluntario"
import LoginAsilo from "../pages/LoginAsilo/LoginAsilo"
import Asilos from "../pages/Asilos/Asilos"
import Eventos from "../pages/Eventos/Eventos"
import Videos from "../pages/Videos/Videos"
import SobreNos from "../pages/SobreNos/SobreNos"
import SobreProjeto from "../pages/SobreProjeto/SobreProjeto"
import Vendas from "../pages/Vendas/Vendas"
import Contato from "../pages/Contato/Contato"
import TermosDeUso from "../pages/TermosDeUso/TermosDeUso"
import PoliticaDePrivacidade from "../pages/PoliticaDePrivacidade/PoliticaDePrivacidade"
import EsqueciASenha from "../pages/EsqueciASenha/EsqueciASenha"
import PerfilAsilo from "../pages/PerfilAsilo/PerfilAsilo"
import PerfilVoluntario from "../pages/PerfilVoluntario/PerfilVoluntario"

//IMPORT DE NOVAS TELAS

import MeusVoluntarios from "../pages/MeusVoluntarios/MeusVoluntarios"
import MinhasInscricoes from "../pages/MinhasInscricoes/MinhasInscricoes"
import ConfirmarPresenca from "../pages/ConfirmarPresenca/ConfirmarPresenca"
import GerenciarVoluntarios from "../pages/GerenciarVoluntarios/GerenciarVoluntarios"
import PainelAdministrador from "../pages/PainelAdministrador/PainelAdministrador"

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/asilos" element={<Asilos />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/sobrenos" element={<SobreNos />} />
      <Route path="/sobreprojeto" element={<SobreProjeto />} />
      <Route path="/vendas" element={<Vendas />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/termosdeuso" element={<TermosDeUso />} />
      <Route path="/politicadeprivacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/esqueciasenha" element={<EsqueciASenha />} />
      <Route path="/perfilasilo" element={<PerfilAsilo />} />
      <Route path="/perfilvoluntario" element={<PerfilVoluntario />} />
      <Route path="/meusvoluntarios" element={<MeusVoluntarios />} />
      <Route path="/minhasinscricoes" element={<MinhasInscricoes />} />
      <Route path="/confirmarpresenca" element={<ConfirmarPresenca />} />
      <Route path="/gerenciarvoluntarios" element={<GerenciarVoluntarios />} />
      <Route path="/paineladministrador" element={<PainelAdministrador />} />


      {/* Auth Routes */}
      <Route path="/cadastrovoluntario" element={<CadastroVoluntario />} />
      <Route path="/cadastroasilo" element={<CadastroAsilo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loginvoluntario" element={<LoginVoluntario />} />
      <Route path="/loginasilo" element={<LoginAsilo />} />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes