import { requisitarApi } from './apiService'
import {
  clinicasMock,
  examesMock,
  especialidadesMock,
  profissionaisMock,
} from './mocks/agendamento'
import {
  agendamentosMock,
  cancelarAgendamentoMock,
} from './mocks/consultas'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const agendamentosExameMock = []

function horarioFuturo(data, horaInicio) {
  return new Date(`${data}T${horaInicio}-03:00`).getTime() > Date.now()
}

function consultaMockConflita(disponibilidade) {
  const inicio = new Date(
    `${disponibilidade.data}T${disponibilidade.horaInicio}-03:00`
  ).getTime()
  const fim = new Date(
    `${disponibilidade.data}T${disponibilidade.horaFim}-03:00`
  ).getTime()

  return agendamentosMock.some(
    (agendamento) =>
      agendamento.status === 'CONFIRMADO' &&
      agendamento.profissionalId === disponibilidade.profissionalId &&
      new Date(agendamento.inicio).getTime() < fim &&
      new Date(agendamento.fim).getTime() > inicio
  )
}

export async function listarEspecialidades() {
  if (USE_MOCK) return especialidadesMock
  return requisitarApi('/especialidades')
}

export async function listarClinicas() {
  if (USE_MOCK) return clinicasMock
  return requisitarApi('/clinicas')
}

export async function listarProfissionais() {
  if (USE_MOCK) return profissionaisMock
  return requisitarApi('/profissionais')
}

export async function listarExames() {
  if (USE_MOCK) return examesMock
  return requisitarApi('/exames')
}

export async function listarDisponibilidades({
  data,
  clinicaId,
  especialidadeId,
}) {
  if (USE_MOCK) {
    const horario = {
      id: `demo-consulta-${clinicaId}-${especialidadeId}-${data}`,
      profissionalId: 1,
      clinicaId,
      especialidadeId,
      data,
      horaInicio: '09:00:00',
      horaFim: '09:30:00',
    }

    return horarioFuturo(data, horario.horaInicio) &&
      !consultaMockConflita(horario)
      ? [horario]
      : []
  }

  const parametros = new URLSearchParams({
    data,
    clinicaId: String(clinicaId),
    especialidadeId: String(especialidadeId),
  })
  return requisitarApi(`/disponibilidades?${parametros}`)
}

export async function listarDisponibilidadesExame({
  data,
  clinicaId,
  exameId,
}) {
  if (USE_MOCK) {
    return ['10:00:00', '11:00:00', '12:00:00'].map(
      (horaInicio, index) => ({
        id: `demo-exame-${exameId}-${data}-${index}`,
        exameId,
        clinicaId,
        data,
        horaInicio,
        horaFim: `${horaInicio.slice(0, 2)}:30:00`,
      })
    ).filter(
      (horario) =>
        horarioFuturo(data, horario.horaInicio) &&
        !agendamentosExameMock.some(
          (agendamento) =>
            agendamento.disponibilidadeId === horario.id &&
            agendamento.status === 'CONFIRMADO'
        )
    )
  }

  const parametros = new URLSearchParams({
    data,
    clinicaId: String(clinicaId),
    exameId: String(exameId),
  })
  return requisitarApi(`/disponibilidades-exame?${parametros}`)
}

export async function agendarConsulta(disponibilidade) {
  if (USE_MOCK) {
    if (
      !horarioFuturo(disponibilidade.data, disponibilidade.horaInicio) ||
      consultaMockConflita(disponibilidade)
    ) {
      throw new Error('Este horário não está mais disponível.')
    }

    const timestamp = Date.now()
    const id = `demo-consulta-${timestamp}`
    const agendamento = {
      id,
      codigoConfirmacao: `DEMO-${String(timestamp).slice(-6)}`,
      status: 'CONFIRMADO',
      profissionalId: disponibilidade.profissionalId,
      clinicaId: disponibilidade.clinicaId,
      especialidadeId: disponibilidade.especialidadeId,
      inicio: `${disponibilidade.data}T${disponibilidade.horaInicio}-03:00`,
      fim: `${disponibilidade.data}T${disponibilidade.horaFim}-03:00`,
    }
    agendamentosMock.unshift(agendamento)
    return { ...agendamento }
  }

  return requisitarApi('/agendamentos', {
    metodo: 'POST',
    dados: { disponibilidadeId: disponibilidade.id },
  })
}

export async function agendarExame(disponibilidade) {
  if (USE_MOCK) {
    if (
      !horarioFuturo(disponibilidade.data, disponibilidade.horaInicio) ||
      agendamentosExameMock.some(
        (agendamento) =>
          agendamento.disponibilidadeId === disponibilidade.id &&
          agendamento.status === 'CONFIRMADO'
      )
    ) {
      throw new Error('Este horário não está mais disponível.')
    }

    const agendamento = {
      id: Date.now(),
      disponibilidadeId: disponibilidade.id,
      codigoConfirmacao: `DEMO-EXAME-${String(Date.now()).slice(-6)}`,
      status: 'CONFIRMADO',
      exameId: disponibilidade.exameId,
      clinicaId: disponibilidade.clinicaId,
      inicio: `${disponibilidade.data}T${disponibilidade.horaInicio}-03:00`,
    }
    agendamentosExameMock.push(agendamento)
    return { ...agendamento }
  }

  return requisitarApi('/agendamentos-exame', {
    metodo: 'POST',
    dados: { disponibilidadeId: disponibilidade.id },
  })
}

export async function listarMeusAgendamentos() {
  if (USE_MOCK) return agendamentosMock.map((item) => ({ ...item }))
  return requisitarApi('/agendamentos/me')
}

export async function listarConsultasComDetalhes() {
  const [agendamentos, profissionais, clinicas, especialidades] =
    await Promise.all([
      listarMeusAgendamentos(),
      listarProfissionais(),
      listarClinicas(),
      listarEspecialidades(),
    ])

  return agendamentos.map((agendamento) => ({
    ...agendamento,
    profissional: profissionais.find(
      (item) => item.id === agendamento.profissionalId
    ),
    clinica: clinicas.find((item) => item.id === agendamento.clinicaId),
    especialidade: especialidades.find(
      (item) => item.id === agendamento.especialidadeId
    ),
  }))
}

export async function cancelarConsulta(id) {
  if (USE_MOCK) return cancelarAgendamentoMock(id)
  return requisitarApi(`/agendamentos/${id}/cancelar`, {
    metodo: 'PATCH',
  })
}
