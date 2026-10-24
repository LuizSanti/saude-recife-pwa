import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TelaEscolha from '../components/TelaEscolha'
import { useAgendamento } from '../context/AgendamentoContext'

const EXAMES_MOCK = [
  { id: 1, nome: 'Antígeno Prostático Específico' },
  { id: 2, nome: 'Avaliação Cardiológica' },
  { id: 3, nome: 'Avaliação Oftalmológica' },
  { id: 4, nome: 'Colonoscopia' },
  { id: 5, nome: 'Glicemia de Jejum/Hemoglobina' },
  { id: 6, nome: 'Hemograma Completo' },
  { id: 7, nome: 'Mamografia' },
]

function EscolherExame({ aoVoltar, aoNavegar }) {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { atualizar, limpar } = useAgendamento()

  // Entrada direta por "Marcar Exame": começa um agendamento do zero
  useEffect(() => {
    if (!state?.veioDaEspecialidade) limpar()
  }, [state, limpar])

  function selecionar(exame) {
    atualizar({ exame })
    navigate('/unidade')
  }

  return (
    <TelaEscolha
      titulo="EXAMES"
      subtitulo="Escolher o tipo de Exame"
      etapaAtual={1}
      opcoes={EXAMES_MOCK}
      rotuloBusca="Pesquisar exame"
      mensagemVazia="Nenhum exame encontrado."
      aoVoltar={aoVoltar ?? (() => navigate(-1))}
      aoSelecionar={selecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherExame