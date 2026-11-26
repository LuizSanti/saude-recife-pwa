import { usuariosMock } from './mocks/usuarios'
import { requisitarApi } from './apiService'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

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

  const dados = await requisitarApi('/auth/login', {
    metodo: 'POST',
    dados: { email, senha },
  })
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new Error(
      'A resposta de login da API está inválida.'
    )
  }
  const usuarioApi = dados.usuario ?? {}
  if (
    typeof usuarioApi !== 'object' ||
    Array.isArray(usuarioApi)
  ) {
    throw new Error('Os dados do usuário retornados pela API estão inválidos.')
  }
  const tipoUsuario =
    typeof dados.tipoUsuario === 'string'
      ? dados.tipoUsuario
      : usuarioApi.tipoUsuario
  if (typeof dados.token !== 'string' || typeof tipoUsuario !== 'string') {
    throw new Error(
      'A resposta de login da API deve conter token e tipoUsuario.'
    )
  }
  const perfil =
    tipoUsuario === 'ADMIN' ? 'ADMINISTRADOR' : tipoUsuario
  return {
    token: dados.token,
    usuario: {
      ...usuarioApi,
      nome: usuarioApi.nome || dados.nome || email.split('@')[0],
      email: usuarioApi.email || dados.email || email,
      tipoUsuario: perfil,
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

  return requisitarApi('/auth/cadastro', {
    metodo: 'POST',
    dados: {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      telefone: dados.telefone,
      cpf: dados.cpf,
      dataNascimento: dados.dataNascimento,
    },
  })
}