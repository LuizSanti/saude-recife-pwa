import { useMemo, useState } from 'react'
import voltaIcone from '../assets/voltaIcone.svg'
import './CalendarioAgendamento.css'

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function dataIso(data) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function obterHoje() {
  return dataIso(new Date())
}

function criarDiasDoMes(mesVisivel) {
  const inicio = new Date(
    mesVisivel.getFullYear(),
    mesVisivel.getMonth(),
    1
  )
  const deslocamento = inicio.getDay()
  return Array.from({ length: 42 }, (_, indice) => {
    const data = new Date(
      mesVisivel.getFullYear(),
      mesVisivel.getMonth(),
      indice - deslocamento + 1
    )
    return {
      data,
      iso: dataIso(data),
      noMes: data.getMonth() === mesVisivel.getMonth(),
    }
  })
}

function CalendarioAgendamento({
  data,
  aoMudarData,
  horarios,
  horarioSelecionadoId,
  aoSelecionarHorario,
  carregando,
  erro,
  aviso,
  erroAgendamento,
  mensagemVazia,
  aoTentarNovamente,
  aoConfirmar,
  confirmando,
  aoVoltar,
  titulo = 'Selecione Data e Horário',
  textoConfirmar = 'CONFIRMAR AGENDAMENTO',
}) {
  const [hoje] = useState(obterHoje)
  const [mesVisivel, setMesVisivel] = useState(
    () => new Date(`${data}T12:00:00`)
  )

  const dias = useMemo(() => criarDiasDoMes(mesVisivel), [mesVisivel])
  const dataSelecionada = new Date(`${data}T12:00:00`)
  const dataNoMesVisivel =
    dataSelecionada.getFullYear() === mesVisivel.getFullYear() &&
    dataSelecionada.getMonth() === mesVisivel.getMonth()
  const mesAnteriorDisponivel =
    new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), 1) >
    new Date(`${hoje.slice(0, 7)}-01T00:00:00`)

  function mudarMes(deslocamento) {
    setMesVisivel(
      (mesAtual) =>
        new Date(
          mesAtual.getFullYear(),
          mesAtual.getMonth() + deslocamento,
          1
        )
    )
  }

  const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
    mesVisivel
  )

  return (
    <main className="calendario-agendamento">
      <header className="calendario-agendamento-topo">
        <button
          type="button"
          className="calendario-agendamento-voltar"
          onClick={aoVoltar}
          aria-label="Voltar"
        >
          <img src={voltaIcone} alt="" />
        </button>
        <h1>{titulo}</h1>
      </header>

      {aviso && (
        <p className="calendario-agendamento-aviso" role="status">
          {aviso}
        </p>
      )}

      <section className="calendario-agendamento-conteudo">
        <div className="calendario-agendamento-mes">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            disabled={!mesAnteriorDisponivel}
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <p>
            <span>{mes}</span>
            <strong>{mesVisivel.getFullYear()}</strong>
          </p>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>

        <div className="calendario-agendamento-grade" role="grid">
          {DIAS_SEMANA.map((dia, indice) => (
            <span
              className="calendario-agendamento-dia-semana"
              key={`${dia}-${indice}`}
              role="columnheader"
            >
              {dia}
            </span>
          ))}
          {dias.map(({ data: dia, iso, noMes }) => {
            const desabilitado = !noMes || iso < hoje
            const selecionado = iso === data
            return (
              <button
                type="button"
                className={[
                  'calendario-agendamento-dia',
                  !noMes && 'calendario-agendamento-dia-fora',
                  selecionado && 'calendario-agendamento-dia-selecionado',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={iso}
                role="gridcell"
                aria-selected={selecionado}
                disabled={desabilitado}
                onClick={() => aoMudarData(iso)}
              >
                {dia.getDate()}
              </button>
            )
          })}
        </div>

        <section
          className="calendario-agendamento-horarios"
          aria-labelledby="horarios-disponiveis"
        >
          <h2 id="horarios-disponiveis">Horários disponíveis</h2>
          {!dataNoMesVisivel ? (
            <p className="calendario-agendamento-mensagem" role="status">
              Selecione uma data deste mês para ver os horários.
            </p>
          ) : carregando ? (
            <p className="calendario-agendamento-mensagem" role="status">
              Buscando horários...
            </p>
          ) : erro ? (
            <div className="calendario-agendamento-mensagem" role="alert">
              <p>{erro}</p>
              <button type="button" onClick={aoTentarNovamente}>
                Tentar novamente
              </button>
            </div>
          ) : horarios.length === 0 ? (
            <p className="calendario-agendamento-mensagem" role="status">
              {mensagemVazia}
            </p>
          ) : (
            <div className="calendario-agendamento-opcoes">
              {horarios.map((horario) => (
                <button
                  type="button"
                  className={
                    horario.id === horarioSelecionadoId
                      ? 'calendario-agendamento-horario calendario-agendamento-horario-selecionado'
                      : 'calendario-agendamento-horario'
                  }
                  key={horario.id}
                  aria-pressed={horario.id === horarioSelecionadoId}
                  onClick={() => aoSelecionarHorario(horario)}
                >
                  {horario.horaInicio.slice(0, 5)}
                </button>
              ))}
            </div>
          )}

          {erroAgendamento && (
            <p className="calendario-agendamento-erro" role="alert">
              {erroAgendamento}
            </p>
          )}
        </section>
      </section>

      <footer className="calendario-agendamento-rodape">
        <button
          type="button"
          onClick={aoConfirmar}
          disabled={
            !dataNoMesVisivel ||
            !horarioSelecionadoId ||
            carregando ||
            confirmando
          }
        >
          {confirmando ? 'AGENDANDO...' : textoConfirmar}
        </button>
      </footer>
    </main>
  )
}

export default CalendarioAgendamento
