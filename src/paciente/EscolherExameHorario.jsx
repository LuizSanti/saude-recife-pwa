import { useEffect, useState } from 'react'
import CalendarioAgendamento from '../components/CalendarioAgendamento'
import {
  agendarExame,
  listarDisponibilidadesExame,
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

function EscolherExameHorario({ exame, unidade, aoVoltar, aoIrInicio }) {
  const [data, setData] = useState(dataLocalAtual)
  const [horarios, setHorarios] = useState([])
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState('')
  const [erroAgendamento, setErroAgendamento] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [agendamento, setAgendamento] = useState(null)

  useEffect(() => {
    let ativa = true

    async function carregarHorarios() {
      setCarregando(true)
      setErro('')
      setHorarios([])
      setHorarioSelecionado(null)
      try {
        const resultado = await listarDisponibilidadesExame({
          data,
          clinicaId: unidade.id,
          exameId: exame.id,
        })
        if (ativa) setHorarios(resultado)
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
  }, [data, exame.id, tentativa, unidade.id])

  async function confirmarAgendamento() {
    if (!horarioSelecionado) return

    setConfirmando(true)
    setErroAgendamento('')
    try {
      const resultado = await agendarExame(horarioSelecionado)
      setAgendamento(resultado)
    } catch (error) {
      setErroAgendamento(error.message)
      setHorarioSelecionado(null)
      setTentativa((valor) => valor + 1)
    } finally {
      setConfirmando(false)
    }
  }

  if (agendamento) {
    return (
      <main className="agendamento-confirmado">
        <section role="status">
          <h1>Exame agendado!</h1>
          <p>{formatarDataHora(agendamento.inicio)}</p>
          <p>{exame.nome}</p>
          <p>{unidade.nome}</p>
          <p>
            Código de confirmação:{' '}
            <strong>{agendamento.codigoConfirmacao}</strong>
          </p>
          <button type="button" onClick={aoIrInicio}>
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
      horarios={horarios}
      horarioSelecionadoId={horarioSelecionado?.id}
      aoSelecionarHorario={(horario) => {
        setHorarioSelecionado(horario)
        setErroAgendamento('')
      }}
      carregando={carregando}
      erro={erro}
      erroAgendamento={erroAgendamento}
      mensagemVazia="Não há horários disponíveis para este exame e unidade nesta data."
      aoTentarNovamente={() => setTentativa((valor) => valor + 1)}
      aoConfirmar={confirmarAgendamento}
      confirmando={confirmando}
      aoVoltar={aoVoltar}
      titulo="Selecione Data e Horário"
      textoConfirmar="CONFIRMAR AGENDAMENTO"
    />
  )
}

export default EscolherExameHorario
