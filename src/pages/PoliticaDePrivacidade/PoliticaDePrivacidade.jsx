"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./PoliticaDePrivacidade.css"

// Verifique o caminho correto da imagem
import logo from "../../assets/img/happyidosos.jpg"

export default function PoliticaDePrivacidade() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleAcceptPolicy = () => {
    // Fecha a janela/volta para a página anterior
    navigate(-1)
  }

  // Função para fallback da imagem
  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23244a96'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='Arial' fontSize='18' fill='white'%3EHappy Idosos%3C/text%3E%3C/svg%3E"
  }

  return (
    <>
      <main className="politica-de-privacidade-page">
        <button className="politica-de-privacidade-back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar
        </button>

        <div className="politica-de-privacidade-container">
          <div className="politica-de-privacidade-header" data-aos="fade-down">
            <img
              src={logo || "/placeholder.svg"}
              alt="Happy Idosos"
              className="politica-de-privacidade-logo"
              onError={handleImageError}
            />
            <h1 className="text-balance">Política de Privacidade</h1>
            <p className="text-pretty">Plataforma Happy Idosos</p>
            <div className="politica-de-privacidade-meta">
              <span className="politica-de-privacidade-update">Última atualização: 08/09/2025</span>
            </div>
          </div>

          <div className="politica-de-privacidade-content-container" data-aos="fade-up">
            <div className="politica-de-privacidade-content">
              {/* Índice Rápido */}
              <nav className="politica-de-privacidade-nav" data-aos="fade-up" data-aos-delay="100">
                <h3>Índice Rápido</h3>
                <ul>
                  <li>
                    <a href="#apresentacao">1. Apresentação</a>
                  </li>
                  <li>
                    <a href="#coleta">2. Coleta de Dados Pessoais</a>
                  </li>
                  <li>
                    <a href="#finalidade">3. Finalidade do Tratamento</a>
                  </li>
                  <li>
                    <a href="#base-legal">4. Base Legal</a>
                  </li>
                  <li>
                    <a href="#compartilhamento">5. Compartilhamento de Dados</a>
                  </li>
                  <li>
                    <a href="#cookies">6. Cookies e Tecnologias</a>
                  </li>
                  <li>
                    <a href="#seguranca">7. Armazenamento e Segurança</a>
                  </li>
                  <li>
                    <a href="#direitos">8. Direitos do Titular</a>
                  </li>
                  <li>
                    <a href="#retencao">9. Retenção dos Dados</a>
                  </li>
                  <li>
                    <a href="#alteracoes">10. Alterações desta Política</a>
                  </li>
                  <li>
                    <a href="#contato">11. Contato e Dúvidas</a>
                  </li>
                  <li>
                    <a href="#disposicoes">12. Disposições Finais</a>
                  </li>
                </ul>
              </nav>

              {/* Conteúdo da Política */}
              <article className="politica-de-privacidade-article">
                <section
                  id="apresentacao"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <h2>1. APRESENTAÇÃO</h2>
                  <p>
                    Esta Política de Privacidade descreve como o projeto <strong>Happy Idosos</strong> coleta, utiliza,
                    armazena e protege as informações pessoais de seus usuários — instituições parceiras, voluntários e
                    visitantes — em conformidade com a{" "}
                    <strong>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD)</strong>.
                  </p>
                  <p>
                    Nosso compromisso é garantir que o uso da Plataforma seja seguro, ético e transparente, respeitando
                    a dignidade e a privacidade de todas as pessoas envolvidas.
                  </p>
                </section>

                <section
                  id="coleta"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <h2>2. COLETA DE DADOS PESSOAIS</h2>
                  <p>Coletamos apenas as informações estritamente necessárias para o funcionamento dos serviços:</p>

                  <div className="politica-de-privacidade-highlight">
                    <h3>Voluntários:</h3>
                    <p>nome completo, e-mail, telefone, cidade, estado e senha de acesso.</p>
                  </div>

                  <div className="politica-de-privacidade-highlight">
                    <h3>Instituições parceiras:</h3>
                    <p>razão social, CNPJ, e-mail, telefone e endereço.</p>
                  </div>

                  <div className="politica-de-privacidade-highlight">
                    <h3>Navegação:</h3>
                    <p>
                      dados técnicos como endereço IP, tipo de navegador, e páginas visitadas (coletados automaticamente
                      por cookies).
                    </p>
                  </div>

                  <div className="politica-de-privacidade-important">
                    <strong>📌 Importante:</strong> A Plataforma não coleta dados pessoais de idosos nem informações
                    sensíveis de saúde, religião ou orientação política.
                  </div>
                </section>

                <section
                  id="finalidade"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="250"
                >
                  <h2>3. FINALIDADE DO TRATAMENTO DE DADOS</h2>
                  <p>Os dados coletados são utilizados exclusivamente para:</p>
                  <ul>
                    <li>Identificação e autenticação de usuários;</li>
                    <li>Comunicação entre voluntários e instituições;</li>
                    <li>Gerenciamento de eventos e atividades;</li>
                    <li>Emissão de certificados e relatórios sociais;</li>
                    <li>Melhoria da experiência do usuário e segurança do sistema.</li>
                  </ul>
                </section>

                <section
                  id="base-legal"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <h2>4. BASE LEGAL PARA O TRATAMENTO</h2>
                  <p>O tratamento de dados é realizado com base nas hipóteses legais da LGPD, especialmente:</p>
                  <ul>
                    <li>
                      <strong>Consentimento do titular</strong> (art. 7º, I);
                    </li>
                    <li>
                      <strong>Cumprimento de obrigação legal ou regulatória</strong> (art. 7º, II);
                    </li>
                    <li>
                      <strong>Execução de contrato ou de procedimentos preliminares</strong> (art. 7º, V);
                    </li>
                    <li>
                      <strong>Legítimo interesse do controlador</strong> (art. 7º, IX), sempre que compatível com os
                      direitos do usuário.
                    </li>
                  </ul>
                </section>

                <section
                  id="compartilhamento"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="350"
                >
                  <h2>5. COMPARTILHAMENTO DE DADOS</h2>
                  <p>
                    O <strong>Happy Idosos não comercializa, aluga ou compartilha dados pessoais com terceiros</strong>.
                  </p>
                  <p>Informações poderão ser compartilhadas apenas quando:</p>
                  <ul>
                    <li>Exigido por lei, ordem judicial ou autoridade competente;</li>
                    <li>Necessário para garantir a segurança de usuários e do sistema;</li>
                    <li>
                      Com empresas de hospedagem e segurança digital contratadas, sob cláusula de confidencialidade.
                    </li>
                  </ul>
                </section>

                <section
                  id="cookies"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <h2>6. COOKIES E TECNOLOGIAS DE NAVEGAÇÃO</h2>
                  <p>
                    Utilizamos cookies essenciais para garantir o funcionamento da Plataforma e aprimorar a experiência
                    de uso.
                  </p>

                  <h3>Tipos de cookies:</h3>
                  <dl className="politica-de-privacidade-definitions">
                    <dt>Essenciais:</dt>
                    <dd>necessários para login e segurança;</dd>

                    <dt>De desempenho:</dt>
                    <dd>usados para medir tráfego e uso anônimo do site;</dd>

                    <dt>De preferência:</dt>
                    <dd>lembram idioma e configurações escolhidas.</dd>
                  </dl>

                  <p>
                    O usuário pode, a qualquer momento, gerenciar ou desativar cookies nas configurações do navegador.
                  </p>
                </section>

                <section
                  id="seguranca"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="450"
                >
                  <h2>7. ARMAZENAMENTO E SEGURANÇA DOS DADOS</h2>
                  <p>
                    Todos os dados são armazenados em{" "}
                    <strong>servidores seguros e protegidos por criptografia, firewall e controle de acesso</strong>.
                  </p>
                  <p>
                    A equipe do Happy Idosos adota práticas rigorosas para prevenir acesso não autorizado, perda ou
                    alteração indevida das informações.
                  </p>
                </section>

                <section
                  id="direitos"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <h2>8. DIREITOS DO TITULAR DOS DADOS</h2>
                  <p>O usuário tem o direito de, a qualquer momento:</p>
                  <ul>
                    <li>Confirmar a existência de tratamento de seus dados;</li>
                    <li>Solicitar acesso, correção ou exclusão;</li>
                    <li>Revogar o consentimento previamente concedido;</li>
                    <li>Solicitar portabilidade dos dados;</li>
                    <li>Opor-se ao uso de dados em determinadas situações.</li>
                  </ul>
                  <p>
                    As solicitações podem ser feitas pelo e-mail:
                    <a href="mailto:privacidade@happyidosos.com.br"> privacidade@happyidosos.com.br</a>
                  </p>
                </section>

                <section
                  id="retencao"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="550"
                >
                  <h2>9. RETENÇÃO DOS DADOS</h2>
                  <p>
                    Os dados pessoais serão mantidos apenas pelo tempo necessário ao cumprimento das finalidades
                    descritas ou conforme exigido por lei.
                  </p>
                  <p>Após o encerramento da conta, os dados serão anonimizados ou excluídos de forma segura.</p>
                </section>

                <section
                  id="alteracoes"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <h2>10. ALTERAÇÕES DESTA POLÍTICA</h2>
                  <p>
                    Podemos atualizar esta Política periodicamente para refletir melhorias nos serviços ou alterações
                    legais.
                  </p>
                  <p>
                    Recomenda-se a leitura periódica. Alterações significativas serão comunicadas por e-mail ou aviso na
                    Plataforma.
                  </p>
                </section>

                <section
                  id="contato"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="650"
                >
                  <h2>11. CONTATO E DÚVIDAS</h2>
                  <p>
                    Para qualquer solicitação relacionada a privacidade, entre em contato com nosso Encarregado de Dados
                    (DPO):
                  </p>
                  <div className="politica-de-privacidade-contact">
                    <p>
                      📧 <a href="mailto:privacidade@happyidosos.com.br">privacidade@happyidosos.com.br</a>
                    </p>
                    <p>📍 [Endereço Completo da Instituição]</p>
                  </div>
                </section>

                <section
                  id="disposicoes"
                  className="politica-de-privacidade-section"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <h2>12. DISPOSIÇÕES FINAIS</h2>
                  <p>
                    Ao utilizar a Plataforma, o usuário declara estar ciente e de acordo com esta Política de
                    Privacidade, parte integrante dos <a href="/termos-de-uso">Termos de Uso</a>.
                  </p>
                  <p>
                    Esta Política foi elaborada de acordo com a <strong>Lei nº 13.709/2018 (LGPD)</strong>,
                    <strong>Lei nº 12.965/2014 (Marco Civil da Internet)</strong> e
                    <strong>Lei nº 9.610/1998 (Direito Autoral)</strong>.
                  </p>
                </section>

                <footer className="politica-de-privacidade-footer" data-aos="fade-up" data-aos-delay="750">
                  <p>
                    Este documento foi elaborado em conformidade com a Lei nº 13.709/2018 (LGPD), Lei nº 12.965/2014
                    (Marco Civil da Internet) e Lei nº 9.610/98 (Direito Autoral).
                  </p>
                </footer>
              </article>
            </div>

            {/* Botão de Aceitação Fixo */}
            <div className={`politica-de-privacidade-actions ${isScrolled ? "scrolled" : ""}`}>
              <button
                className="politica-de-privacidade-accept-btn"
                onClick={handleAcceptPolicy}
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Entendi e Aceito a Política
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
