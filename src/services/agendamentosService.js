const CHAVE = 'agendamentos'

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

export async function listarAgendamentos() {
  return ler()
}

export async function criarAgendamento(dados) {
  const novo = { id: Date.now(), status: 'CONFIRMADA', ...dados }
  salvar([...ler(), novo])
  return novo
}

export async function cancelarAgendamento(id) {
  salvar(ler().map((a) => (a.id === id ? { ...a, status: 'CANCELADA' } : a)))
}