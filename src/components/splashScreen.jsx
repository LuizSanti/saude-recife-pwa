import { useEffect } from 'react'
import logoSaudeSenior from '../assets/logoSaudeSenior.svg'
import './splashScreen.css'

function SplashScreen({
  title = 'Saúde Sênior',
  appName = 'Saúde Recife',
  onContinue,
  autoAdvanceMs = 0,
  showContinueButton = false,
  buttonLabel = 'Começar',
}) {
  // Avanço automático é opcional (WCAG 2.2.1). Por padrão fica desligado.
  useEffect(() => {
    if (!onContinue || autoAdvanceMs <= 0) return undefined
    const timer = setTimeout(onContinue, autoAdvanceMs)
    return () => clearTimeout(timer)
  }, [onContinue, autoAdvanceMs])

  return (
    <main className="splashScreen" role="main" aria-label={`Tela inicial do ${appName}`}>
      <section className="splashContent" aria-labelledby="splashTitle">
        {/* Logo decorativo: o nome do app já está no título em texto */}
        <img
          className="splashLogo"
          src={logoSaudeSenior}
          alt=""
          width="104"
          height="104"
        />

        <h1 id="splashTitulo" className="splashTitulo">
          {title}
        </h1>

        {showContinueButton && onContinue && (
          <button type="button" className="splashBotao" onClick={onContinue}>
            {buttonLabel}
          </button>
        )}
      </section>
    </main>
  )
}

export default SplashScreen