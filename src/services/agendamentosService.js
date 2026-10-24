const CHAVE = 'agendamentos'

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

const AGENDAMENTOS_INICIAIS = [
  {
    id: 1,
    dia: '24',
    mes: 'SET',
    horario: '9:30 da manhã',
    medico: 'Dr Antônio Costa',
    especialidade: 'Cardiologista',
    clinica: 'Clínica Boa Viagem',
    endereco: 'Av Conselheiro Aguiar, 123',
    status: 'CONFIRMADA',
  },
]

function ler() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? JSON.parse(salvo) : AGENDAMENTOS_INICIAIS
  } catch {
    return AGENDAMENTOS_INICIAIS
  }
}

function salvar(lista) {
  localStorage.setItem(CHAVE, JSON.stringify(lista))
}

function formatarHorario(data) {
  const h = data.getHours()
  const min = String(data.getMinutes()).padStart(2, '0')
  const periodo = h < 12 ? 'da manhã' : h < 18 ? 'da tarde' : 'da noite'
  return `${h}:${min} ${periodo}`
}

export async function listarAgendamentos() {
  return ler()
}

export async function criarAgendamento({
  profissional,
  unidade,
  especialidade,
  exame,
  dataHora,
}) {
  const data = new Date(dataHora)
  const nomeUnidade = typeof unidade === 'string' ? unidade : unidade?.nome

  const novo = {
    id: Date.now(),
    status: 'CONFIRMADA',
    dataHora,
    dia: String(data.getDate()),
    mes: MESES[data.getMonth()],
    horario: formatarHorario(data),
    medico: profissional?.nome ?? '',
    especialidade: profissional?.especialidade ?? especialidade?.nome ?? '',
    exame: exame?.nome ?? null,
    clinica: nomeUnidade ?? profissional?.unidade ?? '',
    endereco: profissional?.endereco ?? '',
  }

  salvar([...ler(), novo])
  return novo
}

export async function cancelarAgendamento(id) {
  const atualizados = ler().map((a) =>
    a.id === id ? { ...a, status: 'CANCELADA' } : a,
  )
  salvar(atualizados)
  return atualizados
}