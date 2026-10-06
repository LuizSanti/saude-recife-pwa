import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'
import Inicio from './paciente/Inicio'
import InicioMedico from './medico/InicioMedico'
import InicioAdmin from './adm/InicioAdmin'
import SplashScreen from './components/SplashScreen'
import RotaProtegida from './routes/RotaProtegida'

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

      <Route element={<RotaProtegida perfis={['PACIENTE']} />}>
        <Route path="/inicio" element={<Inicio />} />
      </Route>

      <Route element={<RotaProtegida perfis={['PROFISSIONAL']} />}>
        <Route path="/profissional" element={<InicioMedico />} />
      </Route>

      <Route element={<RotaProtegida perfis={['ADMINISTRADOR']} />}>
        <Route path="/admin" element={<InicioAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App