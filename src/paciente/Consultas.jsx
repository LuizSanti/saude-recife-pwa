import { useEffect, useMemo, useState } from 'react'
import BarraNavegacao from '../components/BarraNavegacao'
import voltaIcone from '../assets/voltaIcone.svg'
import { useAuth } from '../hooks/useAuth'
import {
  cancelarConsulta,
  listarConsultasComDetalhes,
} from '../services/agendamentoService'
import './Consultas.css'

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function formatarData(dataHora, opcoes) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Recife',
    ...opcoes,
  }).format(new Date(dataHora))
}

function enderecoClinica(clinica) {
  return [
    clinica.logradouro,
    clinica.numero,
    clinica.bairro,
    clinica.cidade,
  ]
    .filter(Boolean)
    .join(', ')
}

function iniciais(nome = '') {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] || '')
    .join('')
    .toUpperCase()
}

function Consultas({ aoNavegar }) {
  const { usuario } = useAuth()
  const [instanteAtual] = useState(() => Date.now())
  const [itens, setItens] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [erroCancelamento, setErroCancelamento] = useState('')

  useEffect(() => {
    let ativa = true

    async function carregarConsultas() {
      setCarregando(true)
      setErro('')
      try {
        const agendamentos = await listarConsultasComDetalhes()
        if (ativa) {
          setItens(agendamentos)
        }
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregarConsultas()
    return () => {
      ativa = false
    }
  }, [tentativa])

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim())
    return itens
      .filter((item) => {
        if (!termo) return true
        return [
          item.profissional?.nome,
          item.profissional?.registroProfissional,
          item.especialidade?.nome,
          item.clinica?.nome,
          item.clinica?.logradouro,
          item.clinica?.bairro,
          item.status,
          item.codigoConfirmacao,
        ]
          .map(normalizar)
          .some((valor) => valor.includes(termo))
      })
      .sort((a, b) => {
        const aCancelada = a.status === 'CANCELADO'
        const bCancelada = b.status === 'CANCELADO'
        if (aCancelada !== bCancelada) return Number(aCancelada) - Number(bCancelada)
        return new Date(a.inicio) - new Date(b.inicio)
      })
  }, [busca, itens])

  async function cancelar(item) {
    if (
      !window.confirm(
        `Deseja cancelar a consulta de ${formatarData(item.inicio, {
          dateStyle: 'short',
          timeStyle: 'short',
        })}?`
      )
    ) {
      return
    }

    setCancelandoId(item.id)
    setErroCancelamento('')
    try {
      const atualizado = await cancelarConsulta(item.id)
      setItens((atuais) =>
        atuais.map((consulta) =>
          consulta.id === item.id ? { ...consulta, ...atualizado } : consulta
        )
      )
    } catch (error) {
      setErroCancelamento(error.message)
    } finally {
      setCancelandoId(null)
    }
  }

  return (
    <main className="consultas">
      <header className="consultas-topo">
        <button
          type="button"
          className="consultas-voltar"
          onClick={() => aoNavegar('inicio')}
          aria-label="Voltar ao início"
        >
          <img src={voltaIcone} alt="" />
        </button>
        <h1>CONSULTAS</h1>
      </header>

      <section className="consultas-conteudo">
        <label className="consultas-busca">
          <span className="sr-only">Pesquisar consultas</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            placeholder="Pesquisar consulta"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </label>

        {erroCancelamento && (
          <p className="consultas-erro" role="alert">
            {erroCancelamento}
          </p>
        )}

        {carregando ? (
          <p className="consultas-estado" role="status">
            Carregando consultas...
          </p>
        ) : erro ? (
          <div className="consultas-estado" role="alert">
            <p>{erro}</p>
            <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>
              Tentar novamente
            </button>
          </div>
        ) : filtradas.length === 0 ? (
          <p className="consultas-estado" role="status">
            {itens.length
              ? 'Nenhuma consulta corresponde à pesquisa.'
              : 'Você ainda não tem consultas agendadas.'}
          </p>
        ) : (
          <div className="consultas-lista">
            {filtradas.map((item) => {
              const cancelada = item.status === 'CANCELADO'
              const realizada = item.status === 'REALIZADO'
              const profissional = item.profissional
              const clinica = item.clinica
              const endereco = clinica ? enderecoClinica(clinica) : ''
              const crm = profissional
                ? [
                    profissional.conselho || 'CRM',
                    profissional.registroProfissional,
                    profissional.ufRegistro,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : ''

              return (
                <article className="consulta-card" key={item.id}>
                  <div
                    className={
                      cancelada
                        ? 'consulta-card-borda consulta-card-borda-cancelada'
                        : 'consulta-card-borda'
                    }
                  />
                  <div className="consulta-card-cabecalho">
                    <div className="consulta-card-data">
                      <span>
                        {formatarData(item.inicio, { month: 'short' }).replace(
                          '.',
                          ''
                        )}
                      </span>
                      <strong>{formatarData(item.inicio, { day: '2-digit' })}</strong>
                    </div>
                    <div className="consulta-card-titulo">
                      <span
                        className={
                          cancelada
                            ? 'consulta-status consulta-status-cancelada'
                            : realizada
                              ? 'consulta-status consulta-status-realizada'
                              : 'consulta-status'
                        }
                      >
                        {cancelada
                          ? 'CANCELADA'
                          : realizada
                            ? 'REALIZADA'
                            : 'CONFIRMADA'}
                      </span>
                      <p>
                        {formatarData(item.inicio, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="consulta-card-profissional">
                    <span className="consulta-avatar" aria-hidden="true">
                      {iniciais(profissional?.nome)}
                    </span>
                    <div>
                      <h2>{profissional?.nome || 'Profissional não informado'}</h2>
                      <p>{item.especialidade?.nome || 'Especialidade não informada'}</p>
                      {crm && <p>{crm}</p>}
                    </div>
                  </div>

                  <div className="consulta-card-detalhes">
                    <p>
                      <strong>Paciente:</strong> {usuario?.nome || 'Paciente'}
                    </p>
                    <p>
                      <strong>Clínica:</strong>{' '}
                      {clinica?.nome || 'Unidade não informada'}
                    </p>
                    <p>
                      <strong>Endereço:</strong>{' '}
                      {endereco || 'Endereço não informado'}
                    </p>
                    <p>
                      <strong>Código:</strong> {item.codigoConfirmacao || '—'}
                    </p>
                  </div>

                  {!cancelada &&
                    new Date(item.inicio).getTime() > instanteAtual && (
                      <button
                        type="button"
                        className="consulta-cancelar"
                        disabled={cancelandoId === item.id}
                        onClick={() => cancelar(item)}
                      >
                        {cancelandoId === item.id
                          ? 'CANCELANDO...'
                          : 'CANCELAR CONSULTA'}
                      </button>
                    )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      <BarraNavegacao
        itemAtivo="consultas"
        aoNavegar={aoNavegar}
      />
    </main>
  )
}

export default Consultas
