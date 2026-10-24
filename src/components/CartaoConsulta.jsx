import CartaoProfissional from './CartaoProfissional'
import './CartaoConsulta.css'

// A API pode usar nomes diferentes para o mesmo estado
const STATUS = {
  AGENDADO: { tipo: 'agendado', rotulo: 'AGENDADO' },
  AGENDADA: { tipo: 'agendado', rotulo: 'AGENDADO' },
  CONFIRMADA: { tipo: 'agendado', rotulo: 'AGENDADO' },
  CONFIRMADO: { tipo: 'agendado', rotulo: 'AGENDADO' },
  CANCELADO: { tipo: 'cancelado', rotulo: 'CANCELADO' },
  CANCELADA: { tipo: 'cancelado', rotulo: 'CANCELADO' },
}

function formatarDataHora(iso) {
  const data = new Date(iso)
  if (!iso || Number.isNaN(data.getTime())) return 'Data não informada'
  const dia = data.toLocaleDateString('pt-BR')
  const hora = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${dia} às ${hora}`
}

function CartaoConsulta({
  consulta,
  confirmando,
  aoPedirCancelamento,
  aoConfirmarCancelamento,
  aoDesistir,
}) {
  const { id, dataHora, status, paciente } = consulta

  // O CartaoProfissional espera { nome, foto, distancia, especialidade, crm, unidade, endereco }
  const nomeProfissional =
    typeof consulta.profissional === 'string'
      ? consulta.profissional
      : (consulta.profissional?.nome ?? '')

  const profissional = {
    nome: nomeProfissional,
    foto: consulta.foto,
    distancia: consulta.distancia,
    especialidade: consulta.especialidade,
    crm: consulta.crm,
    unidade: consulta.unidade,
    endereco: consulta.endereco,
  }
  const visual = STATUS[status] ?? { tipo: 'outro', rotulo: status || '' }

  return (
    <article className={`consulta consulta-${visual.tipo}`}>
      <p className="consulta-data">{formatarDataHora(dataHora)}</p>
      <p className="consulta-status">{visual.rotulo}</p>

      {/* Mesmo cartão da tela de Profissional, sem o botão de agendar */}
      <CartaoProfissional profissional={profissional}>
        {paciente && <p className="consulta-paciente">Para: {paciente}</p>}

        {visual.tipo === 'agendado' &&
          (confirmando ? (
            <div role="group" aria-label="Confirmar cancelamento">
              <p className="consulta-pergunta">
                Tem certeza que quer cancelar esta consulta?
              </p>
              <button
                type="button"
                className="consulta-botao consulta-botao-perigo"
                onClick={() => aoConfirmarCancelamento(id)}
              >
                SIM, CANCELAR
              </button>
              <button
                type="button"
                className="consulta-botao consulta-botao-neutro"
                onClick={aoDesistir}
              >
                NÃO, MANTER
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="consulta-botao consulta-botao-perigo"
              onClick={() => aoPedirCancelamento(id)}
            >
              CANCELAR CONSULTA
            </button>
          ))}
      </CartaoProfissional>
    </article>
  )
}

export default CartaoConsulta