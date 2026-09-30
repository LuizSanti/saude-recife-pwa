import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'
import Inicio from './paciente/Inicio'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App