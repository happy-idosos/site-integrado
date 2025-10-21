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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("scroll", handleScroll)
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleAcceptPolicy = () => {
    navigate(-1)
  }

  // Função para fallback da imagem
  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23244a96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='white'%3EHappy Idosos%3C/text%3E%3C/svg%3E"
  }

  return (
    <>
      <main className="politica-privacidade-page">
        {/* HEADER PARA MOBILE/TABLET */}
        {isMobile && (
          <header className="politica-privacidade-mobile-header">
            <button 
              className="politica-privacidade-mobile-back-btn"
              onClick={handleHome}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </button>
            <h1 className="politica-privacidade-mobile-title">Política de Privacidade</h1>
            <div className="politica-privacidade-mobile-spacer"></div>
          </header>
        )}

        {/* BOTÃO VOLTAR APENAS PARA DESKTOP */}
        {!isMobile && (
          <button className="politica-privacidade-back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Voltar
          </button>
        )}

        <div className={`politica-privacidade-container ${isMobile ? 'mobile-layout' : ''}`}>
          <div className="politica-privacidade-header" data-aos="fade-down">
            <img 
              src={logo} 
              alt="Happy Idosos" 
              className="politica-privacidade-logo"
              onError={handleImageError}
            />
            {!isMobile && (
              <>
                <h1 className="text-balance">Política de Privacidade</h1>
                <p className="text-pretty">Plataforma Happy Idosos</p>
              </>
            )}
            <div className="politica-privacidade-meta">
              <span className="politica-privacidade-update">Última atualização: 08/09/2025</span>
            </div>
          </div>

          <div className="politica-privacidade-content-container" data-aos="fade-up">
            <div className="politica-privacidade-content">
              {/* Índice Rápido */}
              <nav className="politica-privacidade-nav" data-aos="fade-up" data-aos-delay="100">
                <h3>Índice Rápido</h3>
                <ul>
                  <li><a href="#introducao">1. Introdução</a></li>
                  <li><a href="#definicoes">2. Definições</a></li>
                  <li><a href="#coleta">3. Coleta de Dados</a></li>
                  <li><a href="#finalidade">4. Finalidade do Tratamento</a></li>
                  <li><a href="#compartilhamento">5. Compartilhamento de Dados</a></li>
                  <li><a href="#direitos">6. Direitos do Titular</a></li>
                  <li><a href="#seguranca">7. Segurança de Dados</a></li>
                  <li><a href="#retencao">8. Prazo de Retenção</a></li>
                  <li><a href="#cookies">9. Cookies e Tecnologias</a></li>
                  <li><a href="#menores">10. Proteção de Menores</a></li>
                  <li><a href="#alteracoes">11. Alterações da Política</a></li>
                  <li><a href="#contato">12. Contato do Encarregado</a></li>
                </ul>
              </nav>

              {/* Conteúdo da Política */}
              <article className="politica-privacidade-article">
                <section id="introducao" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="150">
                  <h2>1. INTRODUÇÃO</h2>
                  <p>
                    A presente Política de Privacidade ("Política") tem como objetivo esclarecer como a plataforma 
                    Happy Idosos ("nós", "nosso" ou "Plataforma") coleta, utiliza, armazena e protege os dados 
                    pessoais dos usuários ("você" ou "titular"), em conformidade com a Lei Geral de Proteção de 
                    Dados Pessoais (Lei nº 13.709/2018 - LGPD) e demais normativas aplicáveis.
                  </p>
                  <p>
                    Esta Política aplica-se a todos os usuários da Plataforma, incluindo instituições parceiras, 
                    voluntários e visitantes. Ao utilizar nossos serviços, você consente com as práticas descritas 
                    neste documento.
                  </p>
                </section>

                <section id="definicoes" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="200">
                  <h2>2. DEFINIÇÕES</h2>
                  <dl className="politica-privacidade-definitions">
                    <dt>Dados Pessoais:</dt>
                    <dd>informação relacionada a pessoa natural identificada ou identificável;</dd>
                    
                    <dt>Tratamento:</dt>
                    <dd>toda operação realizada com dados pessoais (coleta, produção, recepção, utilização, etc.);</dd>
                    
                    <dt>Titular:</dt>
                    <dd>pessoa natural a quem se referem os dados pessoais tratados;</dd>
                    
                    <dt>Controlador:</dt>
                    <dd>Happy Idosos, responsável pelas decisões referentes ao tratamento de dados;</dd>
                    
                    <dt>Operador:</dt>
                    <dd>pessoa física ou jurídica que realiza o tratamento em nome do controlador;</dd>
                    
                    <dt>ANPD:</dt>
                    <dd>Autoridade Nacional de Proteção de Dados;</dd>
                    
                    <dt>Cookies:</dt>
                    <dd>pequenos arquivos de texto armazenados no dispositivo do usuário.</dd>
                  </dl>
                </section>

                <section id="coleta" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="250">
                  <h2>3. COLETA DE DADOS</h2>
                  
                  <h3>3.1. Dados Coletados Automaticamente</h3>
                  <ul>
                    <li><strong>Dados de Navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, tempo de permanência;</li>
                    <li><strong>Informações do Dispositivo:</strong> sistema operacional, resolução de tela, idioma;</li>
                    <li><strong>Cookies e Tecnologias Similares:</strong> para melhorar a experiência do usuário.</li>
                  </ul>

                  <h3>3.2. Dados Fornecidos Voluntariamente</h3>
                  <p><strong>Instituições Parceiras:</strong></p>
                  <ul>
                    <li>Razão social, CNPJ, endereço completo;</li>
                    <li>Telefone, e-mail, responsável legal;</li>
                    <li>Documentos comprobatórios de regularidade.</li>
                  </ul>

                  <p><strong>Voluntários:</strong></p>
                  <ul>
                    <li>Nome completo, CPF, data de nascimento;</li>
                    <li>Endereço, telefone, e-mail;</li>
                    <li>Formação acadêmica, experiência profissional;</li>
                    <li>Certidões negativas e documentos de identidade.</li>
                  </ul>

                  <h3>3.3. Dados Sensíveis</h3>
                  <p>
                    <strong>Não coletamos dados sensíveis de idosos.</strong> Em relação a voluntários, apenas 
                    coletamos certidões negativas criminais quando exigido pelas instituições parceiras, com 
                    consentimento explícito e para finalidade específica.
                  </p>
                </section>

                <section id="finalidade" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="300">
                  <h2>4. FINALIDADE DO TRATAMENTO</h2>
                  <p>Seus dados são utilizados para:</p>
                  <ul>
                    <li>Cadastro e verificação de elegibilidade de instituições e voluntários;</li>
                    <li>Intermediação segura entre instituições e voluntários;</li>
                    <li>Comunicação sobre atividades, eventos e atualizações da Plataforma;</li>
                    <li>Melhoria contínua de nossos serviços e experiência do usuário;</li>
                    <li>Cumprimento de obrigações legais e regulatórias;</li>
                    <li>Prevenção de fraudes e garantia da segurança da Plataforma.</li>
                  </ul>
                  <p>
                    <strong>Base Legal:</strong> O tratamento é fundamentado no consentimento (art. 7º, I, LGPD), 
                    cumprimento de obrigação legal (art. 7º, II) e legítimo interesse (art. 7º, IX).
                  </p>
                </section>

                <section id="compartilhamento" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="350">
                  <h2>5. COMPARTILHAMENTO DE DADOS</h2>
                  <p>Seus dados poderão ser compartilhados apenas nas seguintes hipóteses:</p>
                  <ul>
                    <li><strong>Com instituições parceiras:</strong> dados de voluntários são compartilhados apenas com a instituição à qual estão vinculados;</li>
                    <li><strong>Prestadores de serviço:</strong> empresas que nos auxiliam na operação da Plataforma (hospedagem, segurança, etc.), sob contrato de confidencialidade;</li>
                    <li><strong>Determinação legal:</strong> por requisição judicial ou autoridades competentes;</li>
                    <li><strong>Proteção de direitos:</strong> quando necessário para defender nossos direitos ou segurança dos usuários.</li>
                  </ul>
                  <p>
                    <strong>Transferência Internacional:</strong> Seus dados são armazenados em servidores localizados 
                    no Brasil. Eventuais transferências internacionais observarão as garantias previstas na LGPD.
                  </p>
                </section>

                <section id="direitos" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="400">
                  <h2>6. DIREITOS DO TITULAR</h2>
                  <p>Conforme a LGPD, você tem direito a:</p>
                  <ul>
                    <li><strong>Confirmação e Acesso:</strong> confirmar a existência de tratamento e acessar seus dados;</li>
                    <li><strong>Correção:</strong> retificar dados incompletos, inexatos ou desatualizados;</li>
                    <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> solicitar a limitação do tratamento ou eliminação de dados desnecessários;</li>
                    <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado e interoperável;</li>
                    <li><strong>Eliminação:</strong> solicitar a exclusão de dados tratados com base no consentimento;</li>
                    <li><strong>Informação sobre Compartilhamento:</strong> obter informações sobre entidades com quem compartilhamos seus dados;</li>
                    <li><strong>Revogação do Consentimento:</strong> revogar o consentimento a qualquer momento.</li>
                  </ul>
                  <p>
                    Para exercer seus direitos, entre em contato através do e-mail: 
                    <a href="mailto:privacidade@happyidosos.com.br"> privacidade@happyidosos.com.br</a>
                  </p>
                </section>

                <section id="seguranca" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="450">
                  <h2>7. SEGURANÇA DE DADOS</h2>
                  <p>Adotamos medidas técnicas e administrativas para proteger seus dados, incluindo:</p>
                  <ul>
                    <li>Criptografia de dados em trânsito e em repouso;</li>
                    <li>Sistemas de firewall e proteção contra invasões;</li>
                    <li>Controle de acesso baseado em função (princípio do mínimo privilégio);</li>
                    <li>Backups regulares e planos de recuperação de desastres;</li>
                    <li>Treinamento regular da equipe em proteção de dados;</li>
                    <li>Análise periódica de riscos e vulnerabilidades.</li>
                  </ul>
                  <p>
                    Embora empreguemos todos os esforços para garantir a segurança, nenhum sistema é completamente 
                    invulnerável. Em caso de incidente de segurança que possa causar risco ou dano relevante, 
                    comunicaremos os titulares e a ANPD em conformidade com a LGPD.
                  </p>
                </section>

                <section id="retencao" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="500">
                  <h2>8. PRAZO DE RETENÇÃO</h2>
                  <p>Mantemos seus dados pessoais apenas pelo tempo necessário para:</p>
                  <ul>
                    <li><strong>Atividade do usuário:</strong> enquanto mantiver conta ativa na Plataforma;</li>
                    <li><strong>Obrigações legais:</strong> prazos estabelecidos em lei (ex: documentos fiscais - 5 anos);</li>
                    <li><strong>Exercício de direitos:</strong> proteção em processos judiciais ou administrativos;</li>
                    <li><strong>Interesse legítimo:</strong> melhoria de serviços e segurança, respeitando seus direitos.</li>
                  </ul>
                  <p>
                    Após o término do prazo de retenção, os dados serão eliminados ou anonimizados, 
                    exceto nas hipóteses legalmente permitidas.
                  </p>
                </section>

                <section id="cookies" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="550">
                  <h2>9. COOKIES E TECNOLOGIAS SIMILARES</h2>
                  
                  <h3>9.1. O que são Cookies</h3>
                  <p>
                    Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita 
                    nossa Plataforma. Eles nos ajudam a fornecer uma experiência personalizada e eficiente.
                  </p>

                  <h3>9.2. Tipos de Cookies Utilizados</h3>
                  <ul>
                    <li><strong>Essenciais:</strong> necessários para funcionamento básico da Plataforma;</li>
                    <li><strong>Desempenho:</strong> coletam informações sobre uso para melhorar nossos serviços;</li>
                    <li><strong>Funcionalidade:</strong> lembram suas preferências e personalizam a experiência;</li>
                    <li><strong>Analíticos:</strong> nos ajudam a entender como os usuários interagem com a Plataforma.</li>
                  </ul>

                  <h3>9.3. Gerenciamento de Cookies</h3>
                  <p>
                    Você pode configurar seu navegador para recusar cookies ou alertá-lo quando eles estiverem 
                    sendo enviados. No entanto, algumas funcionalidades da Plataforma podem não funcionar 
                    corretamente sem cookies essenciais.
                  </p>
                </section>

                <section id="menores" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="600">
                  <h2>10. PROTEÇÃO DE MENORES</h2>
                  <p>
                    <strong>Nossa Plataforma não é destinada a menores de 18 anos.</strong> Não coletamos 
                    intencionalmente dados de crianças ou adolescentes. Caso tomemos conhecimento de que 
                    coletamos dados de menor sem o consentimento adequado, eliminaremos imediatamente 
                    tais informações.
                  </p>
                  <p>
                    Voluntários devem ter pelo menos 18 anos completos. Instituições parceiras são 
                    responsáveis por verificar a idade dos voluntários vinculados.
                  </p>
                </section>

                <section id="alteracoes" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="650">
                  <h2>11. ALTERAÇÕES DA POLÍTICA</h2>
                  <p>
                    Esta Política poderá ser atualizada periodicamente para refletir mudanças em nossas 
                    práticas ou exigências legais. Alterações significativas serão comunicadas por:
                  </p>
                  <ul>
                    <li>Notificação na Plataforma;</li>
                    <li>Comunicação por e-mail (para usuários cadastrados);</li>
                    <li>Banner de destaque na página inicial.</li>
                  </ul>
                  <p>
                    O uso continuado da Plataforma após alterações implica aceitação da nova versão 
                    da Política. A data da última atualização sempre constará no início deste documento.
                  </p>
                </section>

                <section id="contato" className="politica-privacidade-section" data-aos="fade-up" data-aos-delay="700">
                  <h2>12. CONTATO DO ENCARREGADO</h2>
                  <p>
                    Para exercer seus direitos, esclarecer dúvidas ou apresentar reclamações sobre 
                    o tratamento de seus dados pessoais, entre em contato com nosso Encarregado 
                    de Proteção de Dados (DPO):
                  </p>
                  <div className="politica-privacidade-contact-info">
                    <p><strong>E-mail:</strong> <a href="mailto:privacidade@happyidosos.com.br">privacidade@happyidosos.com.br</a></p>
                    <p><strong>Endereço Postal:</strong> [Endereço completo para correspondência]</p>
                    <p><strong>Prazo de Resposta:</strong> Até 15 (quinze) dias úteis</p>
                  </div>
                  <p>
                    Você também pode apresentar reclamações diretamente à Autoridade Nacional 
                    de Proteção de Dados (ANPD) através do site: 
                    <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer"> www.gov.br/anpd</a>
                  </p>
                </section>

                <footer className="politica-privacidade-footer" data-aos="fade-up" data-aos-delay="750">
                  <p>
                    Esta Política de Privacidade foi elaborada em estrita conformidade com a Lei Geral 
                    de Proteção de Dados (Lei nº 13.709/2018) e demais normativas aplicáveis à 
                    proteção de dados pessoais no Brasil.
                  </p>
                </footer>
              </article>
            </div>

            {/* Botão de Aceitação Fixo */}
            <div className={`politica-privacidade-actions ${isScrolled ? 'scrolled' : ''}`}>
              <button 
                className="politica-privacidade-accept-btn" 
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