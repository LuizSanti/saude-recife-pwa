import { usuariosMock } from './mocks/usuarios'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_URL = import.meta.env.VITE_API_URL

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })
  if (!resposta.ok) throw new Error('E-mail ou senha incorretos')
  return resposta.json()
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

  const resposta = await fetch(`${API_URL}/auth/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  if (!resposta.ok) throw new Error('Não foi possível criar a conta')
  return resposta.json()
}