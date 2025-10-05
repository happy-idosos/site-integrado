"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "aos/dist/aos.css"
import AOS from "aos"
import "./TermosDeUso.css"

// Verifique o caminho correto da imagem
import logo from "../../assets/img/happyidosos.jpg"

export default function TermosDeUso() {
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

  const handleAcceptTerms = () => {
    // Fecha a janela/volta para a página anterior
    navigate(-1)
  }

  // Função para fallback da imagem
  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23244a96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='white'%3EHappy Idosos%3C/text%3E%3C/svg%3E"
  }

  return (
    <>
      <main className="termos-de-uso-page">
        <button className="termos-de-uso-back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar
        </button>

        <div className="termos-de-uso-container">
          <div className="termos-de-uso-header" data-aos="fade-down">
            <img 
              src={logo} 
              alt="Happy Idosos" 
              className="termos-de-uso-logo"
              onError={handleImageError}
            />
            <h1 className="text-balance">Termos de Uso</h1>
            <p className="text-pretty">Plataforma Happy Idosos</p>
            <div className="termos-de-uso-meta">
              <span className="termos-de-uso-update">Última atualização: 08/09/2025</span>
            </div>
          </div>

          <div className="termos-de-uso-content-container" data-aos="fade-up">
            <div className="termos-de-uso-content">
              {/* Índice Rápido */}
              <nav className="termos-de-uso-nav" data-aos="fade-up" data-aos-delay="100">
                <h3>Índice Rápido</h3>
                <ul>
                  <li><a href="#apresentacao">1. Apresentação</a></li>
                  <li><a href="#definicoes">2. Definições</a></li>
                  <li><a href="#objeto">3. Objeto e Escopo dos Serviços</a></li>
                  <li><a href="#cadastro">4. Cadastro e Elegibilidade</a></li>
                  <li><a href="#obrigacoes">5. Obrigações e Conduta dos Usuários</a></li>
                  <li><a href="#propriedade">6. Propriedade Intelectual</a></li>
                  <li><a href="#privacidade">7. Privacidade e Proteção de Dados</a></li>
                  <li><a href="#responsabilidade">8. Limitação de Responsabilidade</a></li>
                  <li><a href="#alteracoes">9. Alterações dos Termos</a></li>
                  <li><a href="#duracao">10. Duração e Rescisão</a></li>
                  <li><a href="#legislacao">11. Legislação Aplicável e Foro</a></li>
                  <li><a href="#comunicacao">12. Canal de Comunicação</a></li>
                  <li><a href="#politica">13. Política de Privacidade e Cookies</a></li>
                </ul>
              </nav>

              {/* Conteúdo dos Termos */}
              <article className="termos-de-uso-article">
                <section id="apresentacao" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="150">
                  <h2>1. APRESENTAÇÃO</h2>
                  <p>
                    Este Termo de Uso ("Termos") estabelece as condições gerais para utilização da plataforma digital Happy Idosos, 
                    disponível no endereço eletrônico happyidosos.com.br e seus subdomínios ("Plataforma"), propriedade de 
                    [Nome Empresarial], inscrita no CNPJ sob o n° [Número do CNPJ], com sede em [Endereço Completo]. 
                    Ao acessar ou utilizar a Plataforma, o usuário aceita integralmente estes Termos e compromete-se a cumpri-los. 
                    Caso não concorde com quaisquer disposições aqui previstas, o usuário deve abster-se de utilizar nossos serviços.
                  </p>
                </section>

                <section id="definicoes" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="200">
                  <h2>2. DEFINIÇÕES</h2>
                  <p>Para fins destes Termos, consideram-se:</p>
                  <dl className="termos-de-uso-definitions">
                    <dt>Plataforma:</dt>
                    <dd>website, aplicativo e demais interfaces digitais do Happy Idosos;</dd>
                    
                    <dt>Usuário Parceiro:</dt>
                    <dd>instituição legalmente constituída (asilos, ONGs, entidades de acolhimento) devidamente cadastrada e habilitada a gerenciar atividades e voluntários;</dd>
                    
                    <dt>Voluntário Vinculado:</dt>
                    <dd>pessoa física maior de 18 anos, devidamente vinculada a uma instituição parceira para realização de atividades com idosos;</dd>
                    
                    <dt>Conteúdo Próprio:</dt>
                    <dd>todo material criado e publicado diretamente pela equipe Happy Idosos;</dd>
                    
                    <dt>Conteúdo de Terceiros:</dt>
                    <dd>materiais gerados ou enviados por usuários parceiros ou voluntários;</dd>
                    
                    <dt>Serviços:</dt>
                    <dd>funcionalidades oferecidas pela Plataforma para gestão de atividades voluntárias, divulgação de eventos e intermediação de ações socioculturais.</dd>
                  </dl>
                </section>

                <section id="objeto" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="250">
                  <h2>3. OBJETO E ESCOPO DOS SERVIÇOS</h2>
                  <p>
                    A Plataforma tem como objetivo exclusivo facilitar a intermediação entre instituições dedicadas ao acolhimento 
                    de idosos e voluntários interessados em atividades recreativas, culturais e de inclusão digital. É vedado o 
                    cadastro direto de idosos. As instituições parceiras são integralmente responsáveis pela seleção, capacitação 
                    e supervisão dos voluntários, assim como pela execução das atividades presenciais ou virtuais.
                  </p>
                </section>

                <section id="cadastro" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="300">
                  <h2>4. CADASTRO E ELEGIBILIDADE</h2>
                  <p><strong>4.1.</strong> O cadastro é permitido apenas para instituições legalmente constituídas, que deverão fornecer informações verídicas e documentação comprobatória de regularidade.</p>
                  <p><strong>4.2.</strong> O Happy Idosos reserva-se o direito de recusar, suspender ou cancelar cadastros que:</p>
                  <ul>
                    <li>Apresentem informações inconsistentes ou falsas;</li>
                    <li>Infrinjam estes Termos ou a legislação aplicável;</li>
                    <li>Possam comprometer a integridade ou segurança dos idosos.</li>
                  </ul>
                </section>

                <section id="obrigacoes" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="350">
                  <h2>5. OBRIGAÇÕES E CONDUTA DOS USUÁRIOS</h2>
                  
                  <h3>5.1. Das Instituições Parceiras:</h3>
                  <ul>
                    <li>Zelar pela idoneidade e capacitação dos voluntários vinculados;</li>
                    <li>Garantir que todas as atividades realizadas respeitem a dignidade e os direitos dos idosos;</li>
                    <li>Assegurar ambientes seguros e adequados durante as interações.</li>
                  </ul>

                  <h3>5.2. Dos Voluntários:</h3>
                  <ul>
                    <li>Agir com respeito, ética e empatia durante todas as interações;</li>
                    <li>Respeitar normas de conduta estabelecidas pelas instituições;</li>
                    <li>Não divulgar informações ou imagens dos idosos sem autorização expressa.</li>
                  </ul>

                  <h3>5.3. Condutas Vedadas:</h3>
                  <p>É estritamente proibido:</p>
                  <ul>
                    <li>Publicar conteúdo ilegal, ofensivo, discriminatório ou contrário à moral;</li>
                    <li>Utilizar a Plataforma para fins comerciais não autorizados;</li>
                    <li>Violar direitos de propriedade intelectual ou de imagem;</li>
                    <li>Praticar qualquer forma de assédio ou divulgar informações falsas.</li>
                  </ul>
                </section>

                <section id="propriedade" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="400">
                  <h2>6. PROPRIEDADE INTELECTUAL</h2>
                  <p><strong>6.1.</strong> Todo Conteúdo Próprio é de propriedade exclusiva do Happy Idosos, protegido por direitos autorais (Lei nº 9.610/98).</p>
                  <p><strong>6.2.</strong> Conteúdos de terceiros permanecem de propriedade de seus autores, que concedem licença não exclusiva para utilização na Plataforma.</p>
                  <p><strong>6.3.</strong> É vedada a reprodução, distribuição ou comercialização de qualquer conteúdo sem autorização prévia por escrito.</p>
                </section>

                <section id="privacidade" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="450">
                  <h2>7. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
                  <p><strong>7.1.</strong> O tratamento de dados pessoais obedece à Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e à nossa Política de Privacidade.</p>
                  <p><strong>7.2.</strong> Dados de idosos não são coletados ou armazenados na Plataforma.</p>
                  <p><strong>7.3.</strong> Dados de usuários parceiros e voluntários são utilizados exclusivamente para fins previstos nestes Termos, com garantia de confidencialidade e segurança.</p>
                </section>

                <section id="responsabilidade" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="500">
                  <h2>8. LIMITAÇÃO DE RESPONSABILIDADE</h2>
                  <p><strong>8.1.</strong> O Happy Idosos atua como mero intermediador digital, não se responsabilizando por:</p>
                  <ul>
                    <li>Danos decorrentes de atividades realizadas fora do ambiente virtual;</li>
                    <li>Condutas inadequadas de usuários ou terceiros;</li>
                    <li>Conteúdos publicados por instituições ou voluntários.</li>
                  </ul>
                  <p><strong>8.2.</strong> As instituições parceiras são integralmente responsáveis pela gestão e supervisão de todas as atividades presenciais.</p>
                </section>

                <section id="alteracoes" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="550">
                  <h2>9. ALTERAÇÕES DOS TERMOS</h2>
                  <p><strong>9.1.</strong> Estes Termos poderão ser atualizados periodicamente para adequação legal ou melhoria de serviços.</p>
                  <p><strong>9.2.</strong> Alterações significativas serão comunicadas por e-mail ou notificação na Plataforma.</p>
                  <p><strong>9.3.</strong> O uso continuado da Plataforma após alterações implica aceitação tácita das novas condições.</p>
                </section>

                <section id="duracao" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="600">
                  <h2>10. DURAÇÃO E RESCISÃO</h2>
                  <p><strong>10.1.</strong> Estes Termos vigoram por tempo indeterminado.</p>
                  <p><strong>10.2.</strong> O Happy Idosos poderá suspender ou cancelar o acesso de usuários que descumprirem quaisquer disposições aqui previstas.</p>
                </section>

                <section id="legislacao" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="650">
                  <h2>11. LEGISLAÇÃO APLICÁVEL E FORO</h2>
                  <p><strong>11.1.</strong> Estes Termos regem-se pelas leis brasileiras, em especial o Marco Civil da Internet (Lei nº 12.965/2014).</p>
                  <p><strong>11.2.</strong> Eventuais disputas serão resolvidas no Foro da Comarca de [Cidade/UF], com renúncia expressa a qualquer outro.</p>
                </section>

                <section id="comunicacao" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="700">
                  <h2>12. CANAL DE COMUNICAÇÃO</h2>
                  <p>Dúvidas, sugestões ou reclamações devem ser dirigidas ao e-mail: <a href="mailto:contato@happyidosos.com.br">contato@happyidosos.com.br</a></p>
                </section>

                <section id="politica" className="termos-de-uso-section" data-aos="fade-up" data-aos-delay="750">
                  <h2>13. POLÍTICA DE PRIVACIDADE E COOKIES</h2>
                  <p>
                    O uso de dados pessoais e cookies está detalhado em nossa Política de Privacidade, disponível em 
                    <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer"> [link para a política]</a>, 
                    parte integrante destes Termos.
                  </p>
                </section>

                <footer className="termos-de-uso-footer" data-aos="fade-up" data-aos-delay="800">
                  <p>
                    Este documento foi elaborado em conformidade com a Lei nº 12.965/2014 (Marco Civil da Internet), 
                    Lei nº 13.709/2018 (LGPD) e Lei nº 9.610/98 (Direito Autoral).
                  </p>
                </footer>
              </article>
            </div>

            {/* Botão de Aceitação Fixo */}
            <div className={`termos-de-uso-actions ${isScrolled ? 'scrolled' : ''}`}>
              <button 
                className="termos-de-uso-accept-btn" 
                onClick={handleAcceptTerms}
                data-aos="fade-up"
                data-aos-delay="850"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Entendi e Aceito os Termos
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}