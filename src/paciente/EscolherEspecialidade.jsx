import ListaOpcoes from '../components/ListaOpcoes'
import './EscolherEspecialidade.css'
import BarraNavegacao from '../components/BarraNavegacao'

const ESPECIALIDADES_MOCK = [
  { id: 1, nome: 'Cardiologia' },
  { id: 2, nome: 'Clínica Geral' },
  { id: 3, nome: 'Endocrinologia' },
  { id: 4, nome: 'Fisioterapia' },
  { id: 5, nome: 'Geriatria' },
  { id: 6, nome: 'Neurologia' },
  { id: 7, nome: 'Ortopedia e Traumatologia' },
]

const TOTAL_ETAPAS = 3

function EscolherEspecialidade({ aoVoltar, aoSelecionar, aoNavegar }) {
  return (
    <main className="escolher-especialidade">
      <header className="escolher-especialidade-topo">
        <button
          type="button"
          className="escolher-especialidade-voltar"
          onClick={aoVoltar}
          aria-label="Voltar"
        >
          ←
        </button>
        <h1 className="escolher-especialidade-titulo">ESPECIALIDADE</h1>
      </header>

      <h2 className="escolher-especialidade-subtitulo">Escolher Especialidade</h2>

      <div
        className="escolher-especialidade-etapas"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_ETAPAS}
        aria-valuenow={1}
        aria-label="Etapa 1 de 3"
      >
        {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
          <span
            key={i}
            className={
              i === 0
                ? 'escolher-especialidade-etapa escolher-especialidade-etapa-ativa'
                : 'escolher-especialidade-etapa'
            }
          />
        ))}
      </div>

      <ListaOpcoes
        opcoes={ESPECIALIDADES_MOCK}
        aoSelecionar={aoSelecionar}
        rotulo="Pesquisar especialidade"
        mensagemVazia="Nenhuma especialidade encontrada."
      />

      <BarraNavegacao itemAtivo="consultas" aoNavegar={aoNavegar} />
    </main>
  )
}

export default EscolherEspecialidade