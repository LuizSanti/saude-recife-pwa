import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Inicio() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function aoSair() {
    sair()
    navigate('/login')
  }

  return (
    <main style={{ padding: 27 }}>
      <h1>Bem-vindo, {usuario?.nome}</h1>
      <button type="button" className="botao-principal" onClick={aoSair}>
        SAIR
      </button>
    </main>
  )
}

export default Inicio