import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from './auth/Login'
import Cadastro from './auth/Cadastro'
import Inicio from './paciente/Inicio'
import PerfilPaciente from './paciente/PerfilPaciente'
import BuscarClinicaEspecialidade from './paciente/BuscarClinicaEspecialidade'
import PainelGestao from './gestao/PainelGestao'
import EscolherEspecialidade from './paciente/EscolherEspecialidade'
import EscolherExame from './paciente/EscolherExame'
import EscolherUnidade from './paciente/EscolherUnidade'
import EscolherProfissional from './paciente/EscolherProfissional'
import EscolherExameHorario from './paciente/EscolherExameHorario'
import Consultas from './paciente/Consultas'
import SplashScreen from './components/SplashScreen'
import RotaProtegida from './routes/RotaProtegida'

const TEMPO_SPLASH_MS = 3000

function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const selecao = location.state || {}

  useEffect(() => {
    const timer = setTimeout(() => setMostrarSplash(false), TEMPO_SPLASH_MS)
    return () => clearTimeout(timer)
  }, [])

  if (mostrarSplash) {
    return <SplashScreen />
  }

  function navegarPelaBarra(item) {
    if (item === 'inicio') navigate('/inicio')
    if (item === 'consultas') navigate('/consultas')
    if (item === 'perfil') navigate('/perfil')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida perfis={['PACIENTE']} />}>
        <Route path="/inicio" element={<Inicio aoNavegar={navegarPelaBarra} />} />
        <Route
          path="/perfil"
          element={<PerfilPaciente aoNavegar={navegarPelaBarra} />}
        />
        <Route
          path="/buscar"
          element={
            <BuscarClinicaEspecialidade
              termoInicial={selecao.termoBusca}
              aoVoltar={() => navigate('/inicio')}
              aoSelecionarEspecialidade={(especialidade, termoBusca) =>
                navigate('/unidade', {
                  state: {
                    especialidade,
                    origemBusca: 'especialidade',
                    termoBusca,
                  },
                })
              }
              aoSelecionarClinica={(unidade, termoBusca) =>
                navigate('/especialidade', {
                  state: {
                    unidade,
                    origemBusca: 'clinica',
                    termoBusca,
                  },
                })
              }
              aoNavegar={navegarPelaBarra}
            />
          }
        />
        <Route
          path="/consultas"
          element={<Consultas aoNavegar={navegarPelaBarra} />}
        />
        <Route
          path="/especialidade"
          element={
            <EscolherEspecialidade
              aoVoltar={() =>
                selecao.origemBusca
                  ? navigate('/buscar', {
                      state: { termoBusca: selecao.termoBusca },
                    })
                  : navigate('/inicio')
              }
              aoSelecionar={(especialidade) =>
                selecao.origemBusca === 'clinica'
                  ? navigate('/escolher-profissional', {
                      state: { ...selecao, especialidade },
                    })
                  : navigate('/unidade', {
                      state: { ...selecao, especialidade },
                    })
              }
              aoNavegar={navegarPelaBarra}
            />
          }
        />
        <Route
          path="/exames"
          element={
            <EscolherExame
              aoVoltar={() => navigate('/inicio')}
              aoSelecionar={(exame) =>
                navigate('/unidade', { state: { exame } })
              }
              aoNavegar={navegarPelaBarra}
            />
          }
        />
        <Route
          path="/unidade"
          element={
            selecao.especialidade || selecao.exame ? (
              <EscolherUnidade
                especialidade={selecao.especialidade}
                exame={selecao.exame}
                aoVoltar={() => {
                  if (selecao.origemBusca) {
                    navigate('/buscar', {
                      state: { termoBusca: selecao.termoBusca },
                    })
                    return
                  }
                  navigate(selecao.exame ? '/exames' : '/especialidade')
                }}
                aoSelecionar={(unidade) =>
                  selecao.exame
                    ? navigate('/horario-exame', {
                        state: { ...selecao, unidade },
                      })
                    : navigate('/escolher-profissional', {
                        state: { ...selecao, unidade },
                      })
                }
                aoNavegar={navegarPelaBarra}
              />
            ) : (
              <Navigate to="/especialidade" replace />
            )
          }
        />
        <Route
          path="/escolher-profissional"
          element={
            selecao.especialidade && selecao.unidade ? (
              <EscolherProfissional
                especialidade={selecao.especialidade}
                unidade={selecao.unidade}
                aoVoltar={() => {
                  if (selecao.origemBusca === 'clinica') {
                    navigate('/especialidade', {
                      state: {
                        unidade: selecao.unidade,
                        origemBusca: selecao.origemBusca,
                        termoBusca: selecao.termoBusca,
                      },
                    })
                    return
                  }
                  navigate('/unidade', {
                    state: {
                      especialidade: selecao.especialidade,
                      ...(selecao.origemBusca && {
                        origemBusca: selecao.origemBusca,
                        termoBusca: selecao.termoBusca,
                      }),
                    },
                  })
                }}
                aoNavegar={navegarPelaBarra}
                aoIrInicio={() => navigate('/inicio')}
                aoVerConsultas={() => navigate('/consultas')}
              />
            ) : (
              <Navigate to="/especialidade" replace />
            )
          }
        />
        <Route
          path="/horario-exame"
          element={
            selecao.exame && selecao.unidade ? (
              <EscolherExameHorario
                exame={selecao.exame}
                unidade={selecao.unidade}
                aoVoltar={() =>
                  navigate('/unidade', { state: { exame: selecao.exame } })
                }
                aoIrInicio={() => navigate('/inicio')}
              />
            ) : (
              <Navigate to="/exames" replace />
            )
          }
        />
      </Route>

      <Route element={<RotaProtegida perfis={['PROFISSIONAL']} />}>
        <Route path="/profissional/*" element={<PainelGestao perfil="profissional" />} />
      </Route>

      <Route element={<RotaProtegida perfis={['ADMINISTRADOR']} />}>
        <Route path="/admin/*" element={<PainelGestao perfil="admin" />} />
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