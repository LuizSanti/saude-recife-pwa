import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import voltaIcone from '../assets/voltaIcone.svg'
import { criarAgendamento } from '../services/agendamentosService'
import './Escolherdatahorario.css'

const DIAS_SEMANA = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]
// Placeholder até existir disponibilidade vinda da API
const HORARIOS = ['10:00', '11:00', '12:00']

function inicioDoDia(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate())
}

// Semanas completas (domingo a sábado), com os dias dos meses vizinhos em cinza
function montarGrade(ano, mes) {
  const primeiro = new Date(ano, mes, 1)
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const total = Math.ceil((primeiro.getDay() + diasNoMes) / 7) * 7
  return Array.from({ length: total }, (_, i) => {
    const data = new Date(ano, mes, 1 - primeiro.getDay() + i)
    return { data, outroMes: data.getMonth() !== mes }
  })
}

function EscolherDataHorario() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { unidade, profissional } = state ?? {}

  const hoje = inicioDoDia(new Date())
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [horario, setHorario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const grade = useMemo(() => montarGrade(ano, mes), [ano, mes])
  const noMesAtual = ano === hoje.getFullYear() && mes === hoje.getMonth()

  const nomeMes = new Date(ano, mes, 1).toLocaleDateString('pt-BR', {
    month: 'long',
  })
  const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)

  function mudarMes(delta) {
    const novo = new Date(ano, mes + delta, 1)
    setAno(novo.getFullYear())
    setMes(novo.getMonth())
    setDiaSelecionado(null)
  }

  async function confirmar() {
    if (!diaSelecionado || !horario) return
    const [h, m] = horario.split(':').map(Number)
    const dataHora = new Date(
      diaSelecionado.getFullYear(),
      diaSelecionado.getMonth(),
      diaSelecionado.getDate(),
      h,
      m,
    ).toISOString()

    setEnviando(true)
    setErro('')
    try {
      await criarAgendamento({ unidade, profissional, dataHora })
      navigate('/agendamento/confirmado', {
        replace: true,
        state: { dataHora, unidade, profissional },
      })
    } catch {
      setErro('Não foi possível agendar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const podeConfirmar = Boolean(diaSelecionado && horario) && !enviando

  return (
    <main className="datahora">
      <button
        type="button"
        className="datahora-voltar"
        onClick={() => navigate(-1)}
        aria-label="Voltar"
      >
        <img src={voltaIcone} alt="" className="datahora-voltar-icone" />
      </button>

      <h1 className="datahora-titulo">Selecione data e horário</h1>

      <section className="datahora-calendario" aria-label="Calendário">
        <div className="datahora-mes">
          <span className="datahora-mes-nome">{nomeMesCapitalizado}</span>
          <span className="datahora-ano">{ano}</span>
          <div className="datahora-mes-nav">
            <button
              type="button"
              className="datahora-mes-seta"
              onClick={() => mudarMes(-1)}
              disabled={noMesAtual}
              aria-label="Mês anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="datahora-mes-seta"
              onClick={() => mudarMes(1)}
              aria-label="Próximo mês"
            >
              ›
            </button>
          </div>
        </div>

        <div className="datahora-grade" role="group" aria-label="Dias do mês">
          {DIAS_SEMANA.map((d) => (
            <abbr key={d} title={d} className="datahora-semana">
              {d[0]}
            </abbr>
          ))}

          {grade.map(({ data, outroMes }) => {
            const desabilitado = outroMes || data < hoje
            const selecionado =
              diaSelecionado && data.getTime() === diaSelecionado.getTime()
            return (
              <button
                key={data.getTime()}
                type="button"
                disabled={desabilitado}
                aria-pressed={Boolean(selecionado)}
                aria-label={data.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
                className={`datahora-dia${selecionado ? ' datahora-dia-ativo' : ''}`}
                onClick={() => setDiaSelecionado(data)}
              >
                <span className="datahora-dia-num">{data.getDate()}</span>
              </button>
            )
          })}
        </div>
      </section>

      <h2 className="datahora-subtitulo">Horários disponíveis</h2>
      <div
        className="datahora-horarios"
        role="group"
        aria-label="Horários disponíveis"
      >
        {HORARIOS.map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={horario === h}
            className={`datahora-horario${horario === h ? ' datahora-horario-ativo' : ''}`}
            onClick={() => setHorario(h)}
          >
            {h}
          </button>
        ))}
      </div>

      {erro && (
        <p role="alert" className="datahora-erro">
          {erro}
        </p>
      )}

      <button
        type="button"
        className="datahora-confirmar"
        disabled={!podeConfirmar}
        onClick={confirmar}
      >
        {enviando ? 'AGENDANDO...' : 'CONFIRMAR AGENDAMENTO'}
      </button>
    </main>
  )
}

export default EscolherDataHorario