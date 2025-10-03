import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>Happy Idosos</h5>
            <p>Conectando voluntários e idosos para um mundo melhor.</p>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Links Rápidos</h5>  
            <ul className="footer-links">
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/asilos">Buscar Asilos</Link>
              </li>
              <li>
                <Link to="/eventos">Eventos</Link>
              </li>
              <li>
                <Link to="/contato">Contato</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Contato</h5>
            <p>Email: contato@happyidosos.com.br</p>
            <p>Telefone: (11) 1234-5678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Happy Idosos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
