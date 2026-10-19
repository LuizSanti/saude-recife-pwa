import './BarraNavegacao.css'

const ITENS = [
  {
    id: 'inicio',
    rotulo: 'Início',
    icone: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
  },
  {
    id: 'consultas',
    rotulo: 'Consultas',
    icone: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    id: 'perfil',
    rotulo: 'Perfil',
    icone: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="10" r="3" />
        <path d="M6.5 18.5c1.5-2.5 3.5-3.5 5.5-3.5s4 1 5.5 3.5" />
      </>
    ),
  },
]

function BarraNavegacao({ itemAtivo, aoNavegar }) {
  return (
    <nav className="barra-navegacao" aria-label="Menu principal">
      <ul className="barra-navegacao-lista">
        {ITENS.map((item) => {
          const ativo = item.id === itemAtivo

          return (
            <li key={item.id} className="barra-navegacao-linha">
              <button
                type="button"
                className={
                  ativo
                    ? 'barra-navegacao-item barra-navegacao-item-ativo'
                    : 'barra-navegacao-item'
                }
                onClick={() => aoNavegar(item.id)}
                aria-current={ativo ? 'page' : undefined}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {item.icone}
                </svg>
                <span>{item.rotulo}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BarraNavegacao