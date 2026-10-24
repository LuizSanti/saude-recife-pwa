import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraNavegacao from '../components/BarraNavegacao'
import lupaIcone from '../assets/lupaIcone.svg'
import {
  listarAgendamentos,
  cancelarAgendamento,
} from '../services/agendamentosService'
import './MeusAgendamentos.css'

const ROTAS_DA_BARRA = { inicio: '/inicio', consultas: '/consultas' }

function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}

function formatarDataHora(iso) {
  const data = new Date(iso)
  const dia = data.toLocaleDateString('pt-BR')
  const hora = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${dia} às ${hora}`
}

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
    `${a.profissional} ${a.especialidade} ${a.unidade}`
      .toLowerCase()
      .includes(termo),
  )

  return (
    <main className="agendamentos">
      <header className="agendamentos-topo">
        <button
          type="button"
          className="agendamentos-voltar"
          onClick={() => navigate('/inicio')}
          aria-label="Voltar"
        >
          ←
        </button>
        <h1 className="agendamentos-titulo">CONSULTAS</h1>
      </header>

      <div className="agendamentos-conteudo">
        <label className="agendamentos-busca">
          <img src={lupaIcone} alt="" className="agendamentos-busca-lupa" />
          <span className="agendamentos-busca-rotulo">Pesquisar consulta</span>
          <input
            type="search"
            className="agendamentos-busca-campo"
            placeholder="Pesquisar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>

        <p role="status" className="agendamentos-aviso">
          {aviso}
        </p>

        {carregando && <p role="status">Carregando suas consultas...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!carregando && !erro && filtrados.length === 0 && (
          <p className="agendamentos-vazio">Nenhuma consulta encontrada.</p>
        )}

        <ul className="agendamentos-lista">
          {filtrados.map((a) => (
            <li key={a.id} className="agendamentos-card">
              <p className="agendamentos-data">{formatarDataHora(a.dataHora)}</p>
              <p
                className={`agendamentos-status agendamentos-status-${a.status.toLowerCase()}`}
              >
                {a.status}
              </p>

              <div className="agendamentos-profissional">
                <span className="agendamentos-avatar" aria-hidden="true">
                  {iniciais(a.profissional)}
                </span>
                <div className="agendamentos-profissional-info">
                  <h2 className="agendamentos-nome">{a.profissional}</h2>
                  <p>{a.especialidade}</p>
                  <p>{a.distancia}</p>
                </div>
              </div>

              <p className="agendamentos-detalhe">Para: {a.paciente}</p>
              <p className="agendamentos-detalhe">{a.unidade}</p>

              {a.status === 'AGENDADO' && confirmandoId !== a.id && (
                <button
                  type="button"
                  className="agendamentos-botao agendamentos-botao-perigo"
                  onClick={() => setConfirmandoId(a.id)}
                >
                  CANCELAR CONSULTA
                </button>
              )}

              {confirmandoId === a.id && (
                <div role="group" aria-label="Confirmar cancelamento">
                  <p className="agendamentos-pergunta">
                    Tem certeza que quer cancelar esta consulta?
                  </p>
                  <button
                    type="button"
                    className="agendamentos-botao agendamentos-botao-perigo"
                    onClick={() => confirmarCancelamento(a.id)}
                  >
                    SIM, CANCELAR
                  </button>
                  <button
                    type="button"
                    className="agendamentos-botao agendamentos-botao-neutro"
                    onClick={() => setConfirmandoId(null)}
                  >
                    NÃO, MANTER
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <BarraNavegacao itemAtivo="consultas" aoNavegar={aoNavegar} />
    </main>
  )
}

export default MeusAgendamentos