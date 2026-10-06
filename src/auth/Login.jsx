import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import { useAuth } from '../hooks/useAuth'
import { AREA_POR_PERFIL } from '../routes/areas'
import './Login.css'

function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)

  function validar() {
    const novos = {}
    if (!email.trim()) novos.email = 'Digite seu e-mail'
    else if (!/\S+@\S+\.\S+/.test(email)) novos.email = 'E-mail inválido'
    if (!senha) novos.senha = 'Digite sua senha'
    return novos
  }

  async function aoEnviar(e) {
    e.preventDefault()
    setErroGeral('')

    const novos = validar()
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setCarregando(true)
    try {
      const logado = await entrar(email.trim(), senha)
      navigate(AREA_POR_PERFIL[logado.tipoUsuario])
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login">
      <h1 className="login-saudacao">Bem vindo(a)</h1>
      <h2 className="login-titulo">Entrar</h2>
      <p className="login-subtitulo">Digite seu email e sua senha para entrar</p>

      {location.state?.cadastrado && (
        <p className="login-sucesso" role="status">
          Conta criada! Entre com seu e-mail e senha.
        </p>
      )}

      <form onSubmit={aoEnviar} noValidate>
        <Campo
          id="email"
          rotulo="Email"
          tipo="email"
          valor={email}
          aoMudar={setEmail}
          placeholder="Digite seu E-mail"
          erro={erros.email}
          autoComplete="email"
        />
        <Campo
          id="senha"
          rotulo="Senha"
          tipo="password"
          valor={senha}
          aoMudar={setSenha}
          placeholder="Digita a sua senha"
          erro={erros.senha}
          autoComplete="current-password"
        />

        {erroGeral && (
          <p className="login-erro" role="alert">
            {erroGeral}
          </p>
        )}

        <button type="submit" className="botao-principal" disabled={carregando}>
          {carregando ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </form>

      <p className="login-rodape">
        Não possui uma conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </main>
  )
}

export default Login