const CABECALHO_CSV = 'id,data,especialidade,clinica,status'

function dataValida(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false
  const parsed = new Date(`${data}T00:00:00Z`)
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === data
  )
}

function normalizarTexto(valor, padrao) {
  return typeof valor === 'string' && valor.trim()
    ? valor.trim()
    : padrao
}

function nomeRelacionado(valor, nomeDireto, padrao) {
  if (typeof valor === 'string') return normalizarTexto(valor, padrao)
  return normalizarTexto(valor?.nome || nomeDireto, padrao)
}

function normalizarAgendamento(item, indice) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`O agendamento na posição ${indice + 1} é inválido.`)
  }

  const valorData =
    typeof item.data === 'string' ? item.data : item.inicio
  const data = typeof valorData === 'string' ? valorData.slice(0, 10) : ''
  if (!dataValida(data)) {
    throw new Error(
      `O agendamento na posição ${indice + 1} não contém uma data válida.`
    )
  }

  const status = normalizarTexto(item.status, '')
  if (!status) {
    throw new Error(
      `O agendamento na posição ${indice + 1} não contém um status.`
    )
  }

  return {
    id: item.id ?? indice + 1,
    data,
    especialidade: nomeRelacionado(
      item.especialidade,
      item.especialidadeNome,
      'Especialidade não informada'
    ),
    clinica: nomeRelacionado(
      item.clinica,
      item.clinicaNome,
      'Clínica não informada'
    ),
    status: status.toUpperCase(),
  }
}

export function lerBaseAgendamentosCsv(conteudo) {
  if (typeof conteudo !== 'string' || !conteudo.trim()) {
    throw new Error('A base de demonstração está vazia.')
  }

  const [cabecalho, ...linhas] = conteudo.trim().split(/\r?\n/)
  if (cabecalho !== CABECALHO_CSV) {
    throw new Error('O formato da base de demonstração é inválido.')
  }

  return linhas
    .filter((linha) => linha.trim())
    .map((linha, indice) => {
      const colunas = linha.split(',')
      if (colunas.length !== 5) {
        throw new Error(
          `A linha ${indice + 2} da base de demonstração está inválida.`
        )
      }

      const [id, data, especialidade, clinica, status] = colunas
      return normalizarAgendamento(
        { id, data, especialidade, clinica, status },
        indice
      )
    })
}

export function normalizarAgendamentosApi(agendamentos) {
  if (!Array.isArray(agendamentos)) {
    throw new Error('A API retornou uma lista de agendamentos inválida.')
  }
  return agendamentos.map(normalizarAgendamento)
}

export function filtrarAgendamentos(
  agendamentos,
  { dataInicio = '', dataFim = '', especialidade = '' } = {}
) {
  return agendamentos.filter(
    (item) =>
      (!dataInicio || item.data >= dataInicio) &&
      (!dataFim || item.data <= dataFim) &&
      (!especialidade || item.especialidade === especialidade)
  )
}

export function calcularIndicadoresAgendamentos(agendamentos) {
  const porEspecialidade = new Map()
  const canceladosPorEspecialidade = new Map()
  let cancelados = 0

  for (const agendamento of agendamentos) {
    if (agendamento.status === 'CANCELADO') {
      cancelados += 1
      canceladosPorEspecialidade.set(
        agendamento.especialidade,
        (canceladosPorEspecialidade.get(agendamento.especialidade) || 0) + 1
      )
    }
    porEspecialidade.set(
      agendamento.especialidade,
      (porEspecialidade.get(agendamento.especialidade) || 0) + 1
    )
  }

  const total = agendamentos.length
  const especialidades = [...porEspecialidade.entries()]
    .map(([nome, quantidade]) => ({
      nome,
      quantidade,
      proporcao: total ? quantidade / total : 0,
      cancelados: canceladosPorEspecialidade.get(nome) || 0,
    }))
    .sort(
      (a, b) =>
        b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, 'pt-BR')
    )

  return {
    total,
    cancelados,
    taxaCancelamento: total ? cancelados / total : 0,
    especialidades,
  }
}
