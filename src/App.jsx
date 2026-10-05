import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'
import Inicio from './paciente/Inicio'
import EscolherEspecialidade from './paciente/EscolherEspecialidade'
import SplashScreen from './components/SplashScreen'

const TEMPO_SPLASH_MS = 3000

function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setMostrarSplash(false), TEMPO_SPLASH_MS)
    return () => clearTimeout(timer)
  }, [])

  if (mostrarSplash) {
    return <SplashScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/especialidades" element={<EscolherEspecialidade />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App