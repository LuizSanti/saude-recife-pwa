import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import { cadastrar } from '../services/authService'
import {
  mascaraCpf,
  mascaraData,
  mascaraTelefone,
  somenteDigitos,
  dataParaIso,
} from '../utils/formatadores'
import { cpfValido, dataValida, emailValido } from '../utils/validacoes'
import './Cadastro.css'

const formInicial = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  senha: '',
  email: '',
  telefone: '',
}

function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState(formInicial)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function validar() {
    const novos = {}
    if (form.nome.trim().split(/\s+/).length < 2) {
      novos.nome = 'Digite seu nome completo'
    }
    if (!cpfValido(form.cpf)) novos.cpf = 'CPF inválido'
    if (!dataValida(form.dataNascimento)) {
      novos.dataNascimento = 'Data inválida (dd/mm/aaaa)'
    }
    if (form.senha.length < 6) {
      novos.senha = 'A senha precisa ter pelo menos 6 caracteres'
    }
    if (!emailValido(form.email)) novos.email = 'E-mail inválido'
    if (somenteDigitos(form.telefone).length < 10) {
      novos.telefone = 'Telefone inválido'
    }
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
      await cadastrar({
        nome: form.nome.trim(),
        cpf: somenteDigitos(form.cpf),
        dataNascimento: dataParaIso(form.dataNascimento),
        telefone: somenteDigitos(form.telefone),
        email: form.email.trim(),
        senha: form.senha,
      })
      navigate('/login', { state: { cadastrado: true } })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="cadastro">
      <h1 className="cadastro-titulo">Criar sua conta</h1>

      <form onSubmit={aoEnviar} noValidate>
        <Campo
          id="nome"
          rotulo="Nome completo"
          valor={form.nome}
          aoMudar={(v) => atualizar('nome', v)}
          placeholder="Digite seu nome completo"
          erro={erros.nome}
          autoComplete="name"
        />
        <Campo
          id="cpf"
          rotulo="CPF"
          valor={form.cpf}
          aoMudar={(v) => atualizar('cpf', mascaraCpf(v))}
          placeholder="000.000.000-00"
          erro={erros.cpf}
          inputMode="numeric"
        />
        <Campo
          id="dataNascimento"
          rotulo="Data de nascimento"
          valor={form.dataNascimento}
          aoMudar={(v) => atualizar('dataNascimento', mascaraData(v))}
          placeholder="dd/mm/aaaa"
          erro={erros.dataNascimento}
          inputMode="numeric"
          autoComplete="bday"
        />
        <Campo
          id="senha"
          rotulo="Senha"
          tipo="password"
          valor={form.senha}
          aoMudar={(v) => atualizar('senha', v)}
          placeholder="Digite sua senha"
          erro={erros.senha}
          autoComplete="new-password"
        />
        <Campo
          id="email"
          rotulo="Email"
          tipo="email"
          valor={form.email}
          aoMudar={(v) => atualizar('email', v)}
          placeholder="Digite seu E-mail"
          erro={erros.email}
          autoComplete="email"
        />
        <Campo
          id="telefone"
          rotulo="Número de telefone"
          tipo="tel"
          valor={form.telefone}
          aoMudar={(v) => atualizar('telefone', mascaraTelefone(v))}
          placeholder="Digite seu número de celular"
          erro={erros.telefone}
          inputMode="numeric"
          autoComplete="tel"
        />

        {erroGeral && (
          <p className="cadastro-erro" role="alert">
            {erroGeral}
          </p>
        )}

        <button type="submit" className="botao-principal" disabled={carregando}>
          {carregando ? 'CRIANDO...' : 'CRIAR CONTA'}
        </button>
      </form>

      <p className="cadastro-rodape">
        Já possui uma conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  )
}

export default Cadastro