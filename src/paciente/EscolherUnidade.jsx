import { useNavigate } from 'react-router-dom'
import TelaEscolha from '../components/TelaEscolha'
import { useAgendamento } from '../context/AgendamentoContext'

const UNIDADES_MOCK = [
  { id: 1, nome: 'Hospital Esperança' },
  { id: 2, nome: 'Hospital dos Veios' },
  { id: 3, nome: 'Upa Nossa Senhora Terezinha' },
  { id: 4, nome: 'Upa de NEW Discovery' },
  { id: 5, nome: 'Clínica Joana Bezerra' },
]

function EscolherUnidade({ aoVoltar, aoNavegar }) {
  const navigate = useNavigate()
  const { atualizar } = useAgendamento()

  function selecionar(unidade) {
    atualizar({ unidade })
    navigate('/escolher-profissional')
  }

  return (
    <TelaEscolha
      titulo="UNIDADE"
      subtitulo="Escolher Unidade de atendimento"
      etapaAtual={2}
      opcoes={UNIDADES_MOCK}
      rotuloBusca="Pesquisar unidade"
      mensagemVazia="Nenhuma unidade encontrada."
      aoVoltar={aoVoltar ?? (() => navigate(-1))}
      aoSelecionar={selecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherUnidade