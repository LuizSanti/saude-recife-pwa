import { useNavigate } from 'react-router-dom'
import './ConfirmacaoAgendamento.css'

function ConfirmacaoAgendamento() {
  const navigate = useNavigate()

  return (
    <main className="confirmacao">
      <div className="confirmacao-centro">
        <div className="confirmacao-icone" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="confirmacao-titulo">Agendado!</h1>
        <p role="status" className="confirmacao-texto">
          Consulta marcada com sucesso.
        </p>
      </div>

      <button
        type="button"
        className="confirmacao-voltar"
        onClick={() => navigate('/inicio', { replace: true })}
      >
        VOLTAR
      </button>
    </main>
  )
}

export default ConfirmacaoAgendamento