import { createContext, useContext, useState, useCallback } from 'react'

const ESTADO_INICIAL = {
  especialidade: null,
  exame: null,
  unidade: null,
  profissional: null,
  data: null,
  horario: null,
}

const AgendamentoContext = createContext(null)

export function AgendamentoProvider({ children }) {
  const [agendamento, setAgendamento] = useState(ESTADO_INICIAL)

  const atualizar = useCallback((campos) => {
    setAgendamento((atual) => ({ ...atual, ...campos }))
  }, [])

  const limpar = useCallback(() => setAgendamento(ESTADO_INICIAL), [])

  return (
    <AgendamentoContext.Provider value={{ agendamento, atualizar, limpar }}>
      {children}
    </AgendamentoContext.Provider>
  )
}

export function useAgendamento() {
  const ctx = useContext(AgendamentoContext)
  if (!ctx) {
    throw new Error('useAgendamento deve ser usado dentro de AgendamentoProvider')
  }
  return ctx
}
