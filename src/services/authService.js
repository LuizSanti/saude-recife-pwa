import { usuariosMock } from './mocks/usuarios'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_URL = import.meta.env.VITE_API_URL

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const MSG_REDE = 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'

async function chamarApi(caminho, corpo) {
  try {
    return await fetch(`${API_URL}${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
  } catch {
    throw new Error(MSG_REDE)
  }
}

export async function login(email, senha) {
  if (USE_MOCK) {
    await esperar(500)
    const usuario = usuariosMock.find(
      (u) => u.email === email && u.senha === senha
    )
    if (!usuario) throw new Error('E-mail ou senha incorretos')

    return {
      token: 'token-falso-' + usuario.id,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
      },
    }
  }

  const resposta = await chamarApi('/auth/login', { email, senha })
  if (resposta.status === 401 || resposta.status === 403) {
    throw new Error('E-mail ou senha incorretos')
  }
  if (!resposta.ok) throw new Error('Não foi possível entrar. Tente novamente.')

  // A API devolve { token, tipoUsuario, ID e EMAIL } 
  const dados = await resposta.json()
  return {
    token: dados.token,
    usuario: {
      id: dados.id,
      nome: dados.nome,
      email: dados.email ?? email,
      tipoUsuario: dados.tipoUsuario,
    },
  }
}

export async function cadastrar(dados) {
  if (USE_MOCK) {
    await esperar(500)
    if (usuariosMock.some((u) => u.email === dados.email)) {
      throw new Error('Este e-mail já está cadastrado')
    }
    const novo = { id: usuariosMock.length + 1, ...dados, tipoUsuario: 'PACIENTE' }
    usuariosMock.push(novo)
    return { id: novo.id }
  }

  const { nome, email, senha, telefone, cpf, dataNascimento, sexo, observacoes } = dados

  // cria o usuário
  const respUsuario = await chamarApi('/usuarios', {
    nome,
    email,
    senha,
    telefone,
    tipoUsuario: 'PACIENTE',
  })
  if (respUsuario.status === 409) throw new Error('Este e-mail já está cadastrado')
  if (!respUsuario.ok) throw new Error('Não foi possível criar a conta')
  const usuario = await respUsuario.json()

  // cria o paciente ligado a esse usuário
  const respPaciente = await chamarApi('/pacientes', {
    cpf,
    dataNascimento,
    sexo,
    observacoes,
    idUsuario: usuario.id,
  })
  if (!respPaciente.ok) throw new Error('Não foi possível concluir o cadastro')

  return { id: usuario.id }
}