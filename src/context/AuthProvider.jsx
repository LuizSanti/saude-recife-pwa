import { useState } from 'react'
import { AuthContext } from './AuthContext'
import * as authService from '../services/authService'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

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