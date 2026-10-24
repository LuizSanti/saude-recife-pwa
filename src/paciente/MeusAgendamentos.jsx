import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TelaEscolha from '../components/TelaEscolha'
import CartaoConsulta from '../components/CartaoConsulta'
import lupaIcone from '../assets/lupaIcone.svg'
import {
  listarAgendamentos,
  cancelarAgendamento,
} from '../services/agendamentosService'
import './MeusAgendamentos.css'

const ROTAS_DA_BARRA = { inicio: '/inicio', consultas: '/consultas' }

function MeusAgendamentos() {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [confirmandoId, setConfirmandoId] = useState(null)

  useEffect(() => {
    listarAgendamentos()
      .then(setAgendamentos)
      .catch(() =>
        setErro('Não foi possível carregar suas consultas. Tente novamente.'),
      )
      .finally(() => setCarregando(false))
  }, [])

  function aoNavegar(item) {
    const rota = ROTAS_DA_BARRA[item]
    if (rota) navigate(rota)
  }

  async function confirmarCancelamento(id) {
    try {
      const atualizados = await cancelarAgendamento(id)
      setAgendamentos(atualizados)
      setAviso('Consulta cancelada.')
    } catch {
      setAviso('Não foi possível cancelar. Tente novamente.')
    } finally {
      setConfirmandoId(null)
    }
  }

  const termo = busca.trim().toLowerCase()
  const filtrados = agendamentos.filter((a) =>
    [a.profissional, a.especialidade, a.unidade]
      .join(' ')
      .toLowerCase()
      .includes(termo),
  )

  return (
    <TelaEscolha
      titulo="CONSULTAS"
      itemAtivo="consultas"
      aoVoltar={() => navigate('/inicio')}
      aoNavegar={aoNavegar}
    >
      <div className="consultas-conteudo">
        <label className="consultas-busca">
          <img src={lupaIcone} alt="" className="consultas-busca-lupa" />
          <input
            type="search"
            className="consultas-busca-campo"
            placeholder="Pesquisar"
            aria-label="Pesquisar consulta"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>

        <p role="status" className="consultas-aviso">
          {aviso}
        </p>

        {carregando && <p role="status">Carregando suas consultas...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!carregando && !erro && filtrados.length === 0 && (
          <p className="consultas-vazio">Nenhuma consulta encontrada.</p>
        )}

        <div className="consultas-lista">
          {filtrados.map((a) => (
            <CartaoConsulta
              key={a.id}
              consulta={a}
              confirmando={confirmandoId === a.id}
              aoPedirCancelamento={setConfirmandoId}
              aoConfirmarCancelamento={confirmarCancelamento}
              aoDesistir={() => setConfirmandoId(null)}
            />
          ))}
        </div>
      </div>
    </TelaEscolha>
  )
}

export default MeusAgendamentos