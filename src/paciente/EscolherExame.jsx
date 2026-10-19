import TelaEscolha from '../components/TelaEscolha'

const EXAMES_MOCK = [
  { id: 1, nome: 'Antígeno Prostático Específico' },
  { id: 2, nome: 'Avaliação Cardiológica' },
  { id: 3, nome: 'Avaliação Oftalmológica' },
  { id: 4, nome: 'Colonoscopia' },
  { id: 5, nome: 'Glicemia de Jejum/Hemoglobina' },
  { id: 6, nome: 'Hemograma Completo' },
  { id: 7, nome: 'Mamografia' },
]

function EscolherExame({ aoVoltar, aoSelecionar, aoNavegar }) {
  return (
    <TelaEscolha
      titulo="EXAMES"
      subtitulo="Escolher o tipo de Exame"
      etapaAtual={1}
      opcoes={EXAMES_MOCK}
      rotuloBusca="Pesquisar exame"
      mensagemVazia="Nenhum exame encontrado."
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherExame