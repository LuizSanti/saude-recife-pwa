import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TelaEscolha from '../components/TelaEscolha'
import { useAgendamento } from '../context/AgendamentoContext'

const ESPECIALIDADES_MOCK = [
  { id: 1, nome: 'Cardiologia' },
  { id: 2, nome: 'Clínica Geral' },
  { id: 3, nome: 'Endocrinologia' },
  { id: 4, nome: 'Fisioterapia' },
  { id: 5, nome: 'Geriatria' },
  { id: 6, nome: 'Neurologia' },
  { id: 7, nome: 'Ortopedia e Traumatologia' },
]

function EscolherEspecialidade({ aoVoltar, aoNavegar }) {
  const navigate = useNavigate()
  const { atualizar, limpar } = useAgendamento()

  // Esta tela inicia um agendamento novo: descarta escolhas anteriores
  useEffect(() => {
    limpar()
  }, [limpar])

  function selecionar(especialidade) {
    atualizar({ especialidade })
    navigate('/exames', { state: { veioDaEspecialidade: true } })
  }

  return (
    <TelaEscolha
      titulo="ESPECIALIDADE"
      subtitulo="Escolher Especialidade"
      etapaAtual={1}
      opcoes={ESPECIALIDADES_MOCK}
      rotuloBusca="Pesquisar especialidade"
      mensagemVazia="Nenhuma especialidade encontrada."
      aoVoltar={aoVoltar ?? (() => navigate('/inicio'))}
      aoSelecionar={selecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherEspecialidade