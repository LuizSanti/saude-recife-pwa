import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraNavegacao from '../components/BarraNavegacao'
import { useAuth } from '../hooks/useAuth'
import {
  atualizarPerfilPaciente,
  buscarPerfilPaciente,
} from '../services/gestaoService'
import './PerfilPaciente.css'

function formatarData(data) {
  if (!data) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    dateStyle: 'long',
  }).format(new Date(`${data}T12:00:00Z`))
}

function PerfilPaciente({ aoNavegar }) {
  const { atualizarUsuario, sair } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativa = true
    async function carregarPerfil() {
      setCarregando(true)
      setErro('')
      try {
        const resultado = await buscarPerfilPaciente()
        if (ativa) setPerfil(resultado)
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregarPerfil()
    return () => {
      ativa = false
    }
  }, [tentativa])

  async function salvar(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSalvando(true)
    setErro('')
    setAviso('')
    try {
      const atualizado = await atualizarPerfilPaciente({
        nome: form.get('nome'),
        telefone: form.get('telefone'),
      })
      setPerfil(atualizado)
      atualizarUsuario({
        nome: atualizado.nome,
        email: atualizado.email,
        telefone: atualizado.telefone,
      })
      setAviso('Seus dados foram atualizados.')
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  function encerrarSessao() {
    sair()
    navigate('/login', { replace: true })
  }

  return (
    <main className="perfil-paciente">
      <header className="perfil-paciente-topo">
        <h1>Meu perfil</h1>
        <p>Consulte e atualize seus dados pessoais.</p>
      </header>

      <section className="perfil-paciente-conteudo">
        {aviso && <p className="perfil-paciente-aviso" role="status">{aviso}</p>}
        {erro && (
          <div className="perfil-paciente-erro" role="alert">
            <p>{erro}</p>
            {!perfil && (
              <button
                type="button"
                onClick={() => setTentativa((valor) => valor + 1)}
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {carregando ? (
          <p className="perfil-paciente-estado" role="status">
            Carregando seus dados...
          </p>
        ) : perfil ? (
          <>
            <form className="perfil-paciente-formulario" onSubmit={salvar}>
              <label>
                Nome completo
                <input name="nome" defaultValue={perfil.nome} required maxLength={150} />
              </label>
              <label>
                E-mail
                <input value={perfil.email || ''} readOnly aria-describedby="perfil-email-ajuda" />
                <small id="perfil-email-ajuda">O e-mail não pode ser alterado por esta tela.</small>
              </label>
              <label>
                Telefone
                <input
                  name="telefone"
                  type="tel"
                  defaultValue={perfil.telefone || ''}
                  maxLength={20}
                />
              </label>
              <label>
                CPF
                <input value={perfil.cpf || ''} readOnly />
              </label>
              <label>
                Data de nascimento
                <input value={formatarData(perfil.dataNascimento)} readOnly />
              </label>
              {perfil.sexo && (
                <label>
                  Sexo
                  <input value={perfil.sexo} readOnly />
                </label>
              )}
              <button className="perfil-paciente-botao" type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>

            <button
              className="perfil-paciente-sair"
              type="button"
              onClick={encerrarSessao}
            >
              Sair da conta
            </button>
          </>
        ) : null}
      </section>

      <BarraNavegacao itemAtivo="perfil" aoNavegar={aoNavegar} />
    </main>
  )
}

export default PerfilPaciente
