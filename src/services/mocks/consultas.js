function dataComDeslocamento(dias, hora) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}T${hora}:00-03:00`
}

export const agendamentosMock = [
  {
    id: 101,
    status: 'CONFIRMADO',
    profissionalId: 1,
    clinicaId: 1,
    especialidadeId: 1,
    inicio: dataComDeslocamento(7, '16:00'),
    fim: dataComDeslocamento(7, '16:30'),
    codigoConfirmacao: 'DEMO-CONS-01',
  },
  {
    id: 102,
    status: 'CANCELADO',
    profissionalId: 1,
    clinicaId: 1,
    especialidadeId: 7,
    inicio: dataComDeslocamento(-30, '16:00'),
    fim: dataComDeslocamento(-30, '16:30'),
    codigoConfirmacao: 'DEMO-CONS-02',
  },
]

export function cancelarAgendamentoMock(id) {
  const agendamento = agendamentosMock.find((item) => item.id === id)
  if (!agendamento) {
    throw new Error('Consulta não encontrada.')
  }
  agendamento.status = 'CANCELADO'
  return { ...agendamento }
}