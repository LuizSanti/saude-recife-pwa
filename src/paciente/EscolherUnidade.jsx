import TelaEscolha from '../components/TelaEscolha'

const UNIDADES_MOCK = [
  { id: 1, nome: 'Hospital Esperança' },
  { id: 2, nome: 'Hospital dos Veios' },
  { id: 3, nome: 'Upa Nossa Senhora Terezinha' },
  { id: 4, nome: 'Upa de NEW Discovery' },
  { id: 5, nome: 'Clínica Joana Bezerra' },
]

function EscolherUnidade({ aoVoltar, aoSelecionar, aoNavegar }) {
  return (
    <TelaEscolha
      titulo="UNIDADE"
      subtitulo="Escolher Unidade de atendimento"
      etapaAtual={2}
      opcoes={UNIDADES_MOCK}
      rotuloBusca="Pesquisar unidade"
      mensagemVazia="Nenhuma unidade encontrada."
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherUnidade