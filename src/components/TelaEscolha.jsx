import ListaOpcoes from './ListaOpcoes'
import BarraNavegacao from './BarraNavegacao'
import voltaIcone from '../assets/voltaIcone.svg'
import './TelaEscolha.css'

const TOTAL_ETAPAS = 3

function TelaEscolha({
  titulo,
  subtitulo,
  etapaAtual,
  opcoes,
  rotuloBusca,
  mensagemVazia,
  aoVoltar,
  aoSelecionar,
  aoNavegar,
  children,
}) {
  return (
    <main className="tela-escolha">
      <header className="tela-escolha-topo">
        <button
          type="button"
          className="tela-escolha-voltar"
          onClick={aoVoltar}
          aria-label="Voltar"
        >
          <img src={voltaIcone} alt="" className="tela-escolha-icone" />
        </button>
        <h1 className="tela-escolha-titulo">{titulo}</h1>
      </header>

      <h2 className="tela-escolha-subtitulo">{subtitulo}</h2>

      <div
        className="tela-escolha-etapas"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_ETAPAS}
        aria-valuenow={etapaAtual}
        aria-label={`Etapa ${etapaAtual} de ${TOTAL_ETAPAS}`}
      >
        {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
          <span
            key={i}
            className={
              i === etapaAtual - 1
                ? 'tela-escolha-etapa tela-escolha-etapa-ativa'
                : 'tela-escolha-etapa'
            }
          />
        ))}
      </div>

      {children ?? (
        <ListaOpcoes
          opcoes={opcoes}
          aoSelecionar={aoSelecionar}
          rotulo={rotuloBusca}
          mensagemVazia={mensagemVazia}
        />
      )}

      <BarraNavegacao aoNavegar={aoNavegar} />
    </main>
  )
}

export default TelaEscolha