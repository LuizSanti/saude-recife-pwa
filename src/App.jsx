import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'
import Inicio from './paciente/Inicio'
import InicioMedico from './medico/InicioMedico'
import InicioAdmin from './adm/InicioAdmin'
import EscolherEspecialidade from './paciente/EscolherEspecialidade'
import EscolherExame from './paciente/EscolherExame'
import EscolherUnidade from './paciente/EscolherUnidade'
import EscolherProfissional from './paciente/EscolherProfissional'
import Escolherdatahorario from './paciente/Escolherdatahorario'
import ConfirmacaoAgendamento from './paciente/ConfirmacaoAgendamento'
import MeusAgendamentos from './paciente/MeusAgendamentos'
import SplashScreen from './components/SplashScreen'
import RotaProtegida from './routes/RotaProtegida'

const TEMPO_SPLASH_MS = 3000

const ROTAS_DA_BARRA = { inicio: '/inicio', consultas: '/consultas' }

function App() {
  const navigate = useNavigate()
  const [mostrarSplash, setMostrarSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setMostrarSplash(false), TEMPO_SPLASH_MS)
    return () => clearTimeout(timer)
  }, [])

  function voltar() {
    window.history.back()
  }

  function aoNavegar(item) {
    const rota = ROTAS_DA_BARRA[item]
    if (rota) navigate(rota)
  }

  function agendar(profissional) {
    navigate('/data-horario', {
      state: { profissional, unidade: profissional?.unidade },
    })
  }

  if (mostrarSplash) {
    return <SplashScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida perfis={['PACIENTE']} />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/consultas" element={<MeusAgendamentos />} />
        <Route
          path="/especialidade"
          element={
            <EscolherEspecialidade
              aoVoltar={voltar}
              aoSelecionar={console.log}
              aoNavegar={aoNavegar}
            />
          }
        />
        <Route
          path="/exames"
          element={
            <EscolherExame
              aoVoltar={voltar}
              aoSelecionar={console.log}
              aoNavegar={aoNavegar}
            />
          }
        />
        <Route
          path="/unidade"
          element={
            <EscolherUnidade
              aoVoltar={voltar}
              aoSelecionar={console.log}
              aoNavegar={aoNavegar}
            />
          }
        />
        <Route
          path="/escolher-profissional"
          element={
            <EscolherProfissional
              aoVoltar={voltar}
              aoAgendar={agendar}
              aoNavegar={aoNavegar}
            />
          }
        />
        <Route path="/data-horario" element={<Escolherdatahorario />} />
        <Route
          path="/agendamento/confirmado"
          element={<ConfirmacaoAgendamento />}
        />
      </Route>

      <Route element={<RotaProtegida perfis={['PROFISSIONAL']} />}>
        <Route path="/profissional" element={<InicioMedico />} />
      </Route>

      <Route element={<RotaProtegida perfis={['ADMIN']} />}>
        <Route path="/admin" element={<InicioAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

// http://localhost:xxxx/especialidade
// http://localhost:xxxx/exames
// http://localhost:xxxx/unidade
// http://localhost:xxxx/escolher-profissional
// http://localhost:xxxx/data-horario
// http://localhost:xxxx/agendamento/confirmado
// http://localhost:xxxx/consultas