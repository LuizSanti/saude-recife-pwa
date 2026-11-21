import { useEffect, useState } from 'react'
import CalendarioAgendamento from '../components/CalendarioAgendamento'
import {
  agendarConsulta,
  listarDisponibilidades,
  listarProfissionais,
} from '../services/agendamentoService'
import './EscolherProfissional.css'

function dataLocalAtual() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function formatarDataHora(dataHora) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Recife',
  }).format(new Date(dataHora))
}

function EscolherProfissional({
  especialidade,
  unidade,
  aoVoltar,
  aoIrInicio,
  aoVerConsultas,
}) {
  const [data, setData] = useState(dataLocalAtual)
  const [profissionais, setProfissionais] = useState([])
  const [erroProfissionais, setErroProfissionais] = useState('')
  const [disponibilidades, setDisponibilidades] = useState([])
  const [disponibilidadeSelecionada, setDisponibilidadeSelecionada] =
    useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroAgendamento, setErroAgendamento] = useState('')
  const [tentativaHorarios, setTentativaHorarios] = useState(0)
  const [agendamento, setAgendamento] = useState(null)
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    let ativa = true

    listarProfissionais()
      .then((resultado) => {
        if (ativa) setProfissionais(resultado.filter((item) => item.ativo))
      })
      .catch((error) => {
        if (ativa) setErroProfissionais(error.message)
      })

    return () => {
      ativa = false
    }
  }, [])

  useEffect(() => {
    let ativa = true

    async function carregarHorarios() {
      setCarregando(true)
      setErro('')
      setDisponibilidades([])
      setDisponibilidadeSelecionada(null)
      try {
        const resultado = await listarDisponibilidades({
          data,
          clinicaId: unidade.id,
          especialidadeId: especialidade.id,
        })
        if (ativa) setDisponibilidades(resultado)
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregarHorarios()
    return () => {
      ativa = false
    }
  }, [data, especialidade.id, tentativaHorarios, unidade.id])

  async function confirmarAgendamento() {
    if (!disponibilidadeSelecionada) return

    setConfirmando(true)
    setErroAgendamento('')
    try {
      const resultado = await agendarConsulta(disponibilidadeSelecionada)
      setAgendamento(resultado)
    } catch (error) {
      setErroAgendamento(error.message)
      setDisponibilidadeSelecionada(null)
      setTentativaHorarios((valor) => valor + 1)
    } finally {
      setConfirmando(false)
    }
  }

  const profissionalPorId = new Map(
    profissionais.map((profissional) => [profissional.id, profissional])
  )

  if (agendamento) {
    return (
      <main className="agendamento-confirmado">
        <section role="status">
          <h1>Consulta agendada!</h1>
          <p>{formatarDataHora(agendamento.inicio)}</p>
          <p>
            {profissionalPorId.get(agendamento.profissionalId)?.nome ||
              'Profissional selecionado'}
          </p>
          <p>{unidade.nome}</p>
          <p>
            Código de confirmação:{' '}
            <strong>{agendamento.codigoConfirmacao}</strong>
          </p>
          <button type="button" onClick={aoVerConsultas}>
            Ver minhas consultas
          </button>
          <button type="button" className="agendamento-voltar-inicio" onClick={aoIrInicio}>
            Voltar ao início
          </button>
        </section>
      </main>
    )
  }

  return (
    <CalendarioAgendamento
      data={data}
      aoMudarData={(novaData) => {
        setData(novaData)
        setErroAgendamento('')
      }}
      horarios={disponibilidades}
      horarioSelecionadoId={disponibilidadeSelecionada?.id}
      aoSelecionarHorario={(horario) => {
        setDisponibilidadeSelecionada(horario)
        setErroAgendamento('')
      }}
      carregando={carregando}
      erro={erro}
      aviso={
        erroProfissionais
          ? 'Os horários foram carregados, mas não foi possível buscar os dados dos profissionais.'
          : ''
      }
      erroAgendamento={erroAgendamento}
      mensagemVazia="Não há horários disponíveis para esta unidade e especialidade nesta data."
      aoTentarNovamente={() => setTentativaHorarios((valor) => valor + 1)}
      aoConfirmar={confirmarAgendamento}
      confirmando={confirmando}
      aoVoltar={aoVoltar}
    />
  )
}

export default EscolherProfissional
