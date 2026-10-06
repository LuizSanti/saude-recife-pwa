import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function InicioAdmin() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function aoSair() {
    sair()
    navigate('/login')
  }

  return (
    <main style={{ padding: 27 }}>
      <h1>Área do administrador</h1>
      <p>{usuario?.nome}</p>
      <button type="button" className="botao-principal" onClick={aoSair}>
        SAIR
      </button>
    </main>
  )
}

export default InicioAdmin