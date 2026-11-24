import { useState } from 'react'
import { AuthContext } from './AuthContext'
import * as authService from '../services/authService'

function carregarUsuario() {
  const salvo = localStorage.getItem('usuario')
  if (!salvo) return null

  try {
    const usuario = JSON.parse(salvo)
    if (
      !usuario ||
      typeof usuario !== 'object' ||
      typeof usuario.tipoUsuario !== 'string'
    ) {
      throw new Error('Dados de usuário inválidos')
    }
    return usuario
  } catch {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(carregarUsuario)

  async function entrar(email, senha) {
    const dados = await authService.login(email, senha)
    if (
      !dados ||
      typeof dados.token !== 'string' ||
      !dados.usuario ||
      typeof dados.usuario !== 'object' ||
      Array.isArray(dados.usuario) ||
      typeof dados.usuario.tipoUsuario !== 'string'
    ) {
      throw new Error('A resposta de login não contém um usuário válido.')
    }

    localStorage.setItem('token', dados.token)
    localStorage.setItem('usuario', JSON.stringify(dados.usuario))
    setUsuario(dados.usuario)
    return dados.usuario
  }

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  function atualizarUsuario(dadosAtualizados) {
    setUsuario((atual) => {
      if (!atual) return atual
      const atualizado = { ...atual, ...dadosAtualizados }
      localStorage.setItem('usuario', JSON.stringify(atualizado))
      return atualizado
    })
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}