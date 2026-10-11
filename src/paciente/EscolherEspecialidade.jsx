import TelaEscolha from '../components/TelaEscolha'

const ESPECIALIDADES_MOCK = [
  { id: 1, nome: 'Cardiologia' },
  { id: 2, nome: 'Clínica Geral' },
  { id: 3, nome: 'Endocrinologia' },
  { id: 4, nome: 'Fisioterapia' },
  { id: 5, nome: 'Geriatria' },
  { id: 6, nome: 'Neurologia' },
  { id: 7, nome: 'Ortopedia e Traumatologia' },
]

function EscolherEspecialidade({ aoVoltar, aoSelecionar, aoNavegar }) {
  return (
    <TelaEscolha
      titulo="ESPECIALIDADE"
      subtitulo="Escolher Especialidade"
      etapaAtual={1}
      opcoes={ESPECIALIDADES_MOCK}
      rotuloBusca="Pesquisar especialidade"
      mensagemVazia="Nenhuma especialidade encontrada."
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherEspecialidade