import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AREA_POR_PERFIL } from './areas'

function RotaProtegida({ perfis }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (perfis && !perfis.includes(usuario.tipoUsuario)) {
    return <Navigate to={AREA_POR_PERFIL[usuario.tipoUsuario]} replace />
  }

  return <Outlet />
}

export default RotaProtegida