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

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}