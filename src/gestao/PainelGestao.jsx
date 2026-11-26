import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BarraNavegacaoGestao from '../components/BarraNavegacaoGestao'
import { useAuth } from '../hooks/useAuth'
import PainelIndicadores from './PainelIndicadores'
import {
  atualizarPerfilProfissional,
  atualizarStatusAgendamento,
  buscarPerfilProfissional,
  criarArea,
  criarClinica,
  criarDisponibilidadeProfissional,
  inativarArea,
  inativarClinica,
  inativarDisponibilidadeProfissional,
  inativarUsuario,
  listarAgendamentosAdmin,
  listarAgendaProfissional,
  listarAreasAdmin,
  listarClinicasAdmin,
  listarDisponibilidadesProfissional,
  listarEquipeAdmin,
} from '../services/gestaoService'
import './PainelGestao.css'

const DATA_RECIFE = { timeZone: 'America/Recife' }

function formatarData(data, options = {}) {
  return new Intl.DateTimeFormat('pt-BR', {
    ...DATA_RECIFE,
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(data))
}

function dataRecifeISO(instante) {
  return new Date(instante).toLocaleDateString('sv-SE', DATA_RECIFE)
}

function secaoAtual(pathname, perfil) {
  const [, , secao] = pathname.split('/')
  return secao || (perfil === 'admin' ? 'inicio' : 'agenda')
}

function ErroCarregamento({ mensagem, tentarNovamente }) {
  return (
    <div className="gestao-estado gestao-erro" role="alert">
      <p>{mensagem}</p>
      <button type="button" onClick={tentarNovamente}>
        Tentar novamente
      </button>
    </div>
  )
}

function Carregando() {
  return (
    <p className="gestao-estado" role="status">
      Carregando informações...
    </p>
  )
}

function CartaoAgendamento({
  item,
  profissional,
  aoAlterarStatus,
  atualizando,
  instanteAtual,
}) {
  const podeCancelar =
    profissional &&
    item.status === 'CONFIRMADO' &&
    Date.parse(item.inicio) > instanteAtual
  const podeConcluir =
    profissional &&
    item.status === 'CONFIRMADO' &&
    Date.parse(item.fim) <= instanteAtual

  return (
    <article className="gestao-card gestao-agendamento">
      <div className="gestao-agendamento-cabecalho">
        <div>
          <p className="gestao-legenda">
            {formatarData(item.inicio)}
          </p>
          <h3>{profissional ? item.pacienteNome : item.profissionalNome}</h3>
        </div>
        <span className={`gestao-status gestao-status-${item.status.toLowerCase()}`}>
          {item.status === 'REALIZADO'
            ? 'Realizada'
            : item.status === 'CANCELADO'
              ? 'Cancelada'
              : 'Confirmada'}
        </span>
      </div>
      <p><strong>Especialidade:</strong> {item.especialidadeNome}</p>
      <p><strong>Clínica:</strong> {item.clinicaNome}</p>
      <p><strong>Paciente:</strong> {item.pacienteNome}</p>
      {podeCancelar && (
        <button
          type="button"
          className="gestao-botao gestao-botao-secundario"
          disabled={atualizando}
          onClick={() => aoAlterarStatus(item, 'CANCELADO')}
        >
          {atualizando ? 'Salvando...' : 'Desmarcar consulta'}
        </button>
      )}
      {podeConcluir && (
        <button
          type="button"
          className="gestao-botao"
          disabled={atualizando}
          onClick={() => aoAlterarStatus(item, 'REALIZADO')}
        >
          {atualizando ? 'Salvando...' : 'Marcar como realizada'}
        </button>
      )}
    </article>
  )
}

function FormularioClinica({ aoSalvar, salvando }) {
  const [dados, setDados] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: 'PE',
  })

  function atualizar(event) {
    setDados((atuais) => ({ ...atuais, [event.target.name]: event.target.value }))
  }

  async function enviar(event) {
    event.preventDefault()
    const sucesso = await aoSalvar(dados)
    if (!sucesso) return
    setDados({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: 'PE',
    })
  }

  return (
    <form className="gestao-formulario" onSubmit={enviar}>
      <h2>Cadastrar clínica</h2>
      <div className="gestao-formulario-grade">
        {[
          ['nome', 'Nome da clínica'],
          ['cnpj', 'CNPJ'],
          ['telefone', 'Telefone'],
          ['email', 'E-mail'],
          ['logradouro', 'Endereço'],
          ['numero', 'Número'],
          ['bairro', 'Bairro'],
          ['cidade', 'Cidade'],
          ['uf', 'UF'],
        ].map(([nome, rotulo]) => (
          <label key={nome}>
            {rotulo}
            <input
              name={nome}
              value={dados[nome]}
              onChange={atualizar}
              required
              maxLength={nome === 'uf' ? 2 : undefined}
            />
          </label>
        ))}
      </div>
      <button className="gestao-botao" disabled={salvando} type="submit">
        {salvando ? 'Salvando...' : 'Salvar clínica'}
      </button>
    </form>
  )
}

function FormularioArea({ aoSalvar, salvando }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  async function enviar(event) {
    event.preventDefault()
    const sucesso = await aoSalvar({ nome, descricao })
    if (!sucesso) return
    setNome('')
    setDescricao('')
  }

  return (
    <form className="gestao-formulario" onSubmit={enviar}>
      <h2>Cadastrar área de saúde</h2>
      <label>
        Nome
        <input value={nome} onChange={(event) => setNome(event.target.value)} required />
      </label>
      <label>
        Descrição
        <textarea
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          rows="3"
        />
      </label>
      <button className="gestao-botao" disabled={salvando} type="submit">
        {salvando ? 'Salvando...' : 'Salvar área'}
      </button>
    </form>
  )
}

function FormularioDisponibilidade({
  clinicas,
  areas,
  aoSalvar,
  salvando,
  instanteAtual,
}) {
  const [dados, setDados] = useState({
    clinicaId: '',
    especialidadeId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
  })

  async function enviar(event) {
    event.preventDefault()
    const sucesso = await aoSalvar({
      ...dados,
      clinicaId: Number(dados.clinicaId),
      especialidadeId: Number(dados.especialidadeId),
      horaInicio: `${dados.horaInicio}:00`,
      horaFim: `${dados.horaFim}:00`,
    })
    if (sucesso) {
      setDados({
        clinicaId: '',
        especialidadeId: '',
        data: '',
        horaInicio: '',
        horaFim: '',
      })
    }
  }

  return (
    <form className="gestao-formulario" onSubmit={enviar}>
      <h2>Definir período de atendimento</h2>
      <p className="gestao-formulario-ajuda">
        O período será dividido automaticamente em consultas de 30 minutos.
      </p>
      <label>
        Clínica
        <select
          value={dados.clinicaId}
          onChange={(event) => setDados((atual) => ({ ...atual, clinicaId: event.target.value }))}
          required
        >
          <option value="">Selecione uma clínica</option>
          {clinicas.filter((item) => item.ativo).map((item) => (
            <option value={item.id} key={item.id}>{item.nome}</option>
          ))}
        </select>
      </label>
      <label>
        Área de saúde
        <select
          value={dados.especialidadeId}
          onChange={(event) => setDados((atual) => ({ ...atual, especialidadeId: event.target.value }))}
          required
        >
          <option value="">Selecione uma área</option>
          {areas.filter((item) => item.ativo).map((item) => (
            <option value={item.id} key={item.id}>{item.nome}</option>
          ))}
        </select>
      </label>
      <label>
        Data
        <input
          type="date"
          value={dados.data}
          onChange={(event) => setDados((atual) => ({ ...atual, data: event.target.value }))}
          min={dataRecifeISO(instanteAtual)}
          required
        />
      </label>
      <div className="gestao-formulario-grade">
        <label>
          Começa às
          <input
            type="time"
            value={dados.horaInicio}
            onChange={(event) => setDados((atual) => ({ ...atual, horaInicio: event.target.value }))}
            required
          />
        </label>
        <label>
          Termina às
          <input
            type="time"
            value={dados.horaFim}
            onChange={(event) => setDados((atual) => ({ ...atual, horaFim: event.target.value }))}
            required
          />
        </label>
      </div>
      <button className="gestao-botao" disabled={salvando} type="submit">
        {salvando ? 'Salvando...' : 'Salvar disponibilidade'}
      </button>
    </form>
  )
}

function PainelGestao({ perfil }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { usuario, sair } = useAuth()
  const [instanteAtual] = useState(() => Date.now())
  const secao = secaoAtual(pathname, perfil)
  const chaveSecao = `${perfil}:${secao}`
  const profissional = perfil === 'profissional'
  const [dados, setDados] = useState(null)
  const [secaoCarregada, setSecaoCarregada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [atualizandoId, setAtualizandoId] = useState(null)

  useEffect(() => {
    let ativa = true
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        let resultado
        if (profissional && secao === 'perfil') {
          resultado = await buscarPerfilProfissional()
        } else if (profissional && secao === 'agenda') {
          const [agendamentos, disponibilidades, clinicas, areas] = await Promise.all([
            listarAgendaProfissional(),
            listarDisponibilidadesProfissional(),
            listarClinicasAdmin(),
            listarAreasAdmin(),
          ])
          resultado = { agendamentos, disponibilidades, clinicas, areas }
        } else if (profissional) {
          resultado = await listarAgendaProfissional()
        } else if (secao === 'indicadores') {
          resultado = {}
        } else if (secao === 'clinicas') {
          resultado = await listarClinicasAdmin()
        } else if (secao === 'equipe') {
          const [usuarios, profissionaisLista] = await listarEquipeAdmin()
          resultado = { usuarios, profissionais: profissionaisLista }
        } else if (secao === 'areas') {
          resultado = await listarAreasAdmin()
        } else if (secao === 'perfil') {
          resultado = usuario
        } else {
          const [agendamentos, clinicas, areas] = await Promise.all([
            listarAgendamentosAdmin(),
            listarClinicasAdmin(),
            listarAreasAdmin(),
          ])
          resultado = { agendamentos, clinicas, areas }
        }
        if (ativa) {
          setDados(resultado)
          setSecaoCarregada(chaveSecao)
        }
      } catch (error) {
        if (ativa) {
          setDados(null)
          setErro(error.message)
          setSecaoCarregada(chaveSecao)
        }
      } finally {
        if (ativa) setCarregando(false)
      }
    }
    carregar()
    return () => { ativa = false }
  }, [chaveSecao, profissional, secao, tentativa, usuario])

  const titulo = useMemo(() => {
    const titulos = {
      inicio: 'Início',
      indicadores: 'Indicadores',
      clinicas: 'Clínicas',
      equipe: 'Equipe',
      areas: 'Áreas de saúde',
      pacientes: 'Pacientes',
      agenda: 'Agenda',
      historico: 'Histórico',
      perfil: 'Meu perfil',
    }
    return titulos[secao] || 'Painel'
  }, [secao])

  async function executarAcao(acao, mensagem) {
    setSalvando(true)
    setErro('')
    setAviso('')
    try {
      await acao()
      setAviso(mensagem)
      setTentativa((valor) => valor + 1)
      return true
    } catch (error) {
      setErro(error.message)
      return false
    } finally {
      setSalvando(false)
    }
  }

  function encerrarSessao() {
    sair()
    navigate('/login', { replace: true })
  }

  async function alterarStatus(item, status) {
    let motivoCancelamento
    if (status === 'CANCELADO') {
      motivoCancelamento = window.prompt('Informe o motivo para desmarcar esta consulta:')
      if (!motivoCancelamento?.trim()) return
    }
    setAtualizandoId(item.id)
    setErro('')
    try {
      await atualizarStatusAgendamento(item.id, status, motivoCancelamento)
      setAviso(status === 'REALIZADO' ? 'Consulta marcada como realizada.' : 'Consulta desmarcada.')
      setTentativa((valor) => valor + 1)
    } catch (error) {
      setErro(error.message)
    } finally {
      setAtualizandoId(null)
    }
  }

  function conteudo() {
    if (!profissional && secao === 'indicadores') {
      return <PainelIndicadores />
    }

    if (carregando) return <Carregando />
    if (erro && !dados) return <ErroCarregamento mensagem={erro} tentarNovamente={() => setTentativa((v) => v + 1)} />

    if (profissional && secao === 'perfil') {
      return (
        <form
          className="gestao-formulario gestao-perfil"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            executarAcao(
              () => atualizarPerfilProfissional({
                nome: form.get('nome'),
                telefone: form.get('telefone'),
              }),
              'Perfil atualizado com sucesso.'
            )
          }}
        >
          <p><strong>E-mail:</strong> {dados?.email}</p>
          <p><strong>CPF:</strong> {dados?.cpf}</p>
          <p><strong>Registro:</strong> {[dados?.conselho, dados?.registroProfissional, dados?.ufRegistro].filter(Boolean).join(' ')}</p>
          <label>Nome<input name="nome" defaultValue={dados?.nome} required /></label>
          <label>Telefone<input name="telefone" defaultValue={dados?.telefone || ''} required /></label>
          <button className="gestao-botao" disabled={salvando} type="submit">
            {salvando ? 'Salvando...' : 'Salvar perfil'}
          </button>
          <button
            className="gestao-botao gestao-botao-secundario"
            type="button"
            onClick={encerrarSessao}
          >
            Sair da conta
          </button>
        </form>
      )
    }

    if (profissional) {
      const lista = Array.isArray(dados) ? dados : (dados?.agendamentos || [])
      const consultas = lista.filter((item) => {
        if (secao === 'historico') {
          return item.status !== 'CONFIRMADO' || Date.parse(item.fim) <= instanteAtual
        }
        if (secao === 'agenda') {
          return item.status === 'CONFIRMADO' && Date.parse(item.fim) > instanteAtual
        }
        return true
      }).sort((a, b) => secao === 'historico'
        ? Date.parse(b.inicio) - Date.parse(a.inicio)
        : Date.parse(a.inicio) - Date.parse(b.inicio))
      if (secao === 'pacientes') {
        const pacientes = [...new Set(lista.map((item) => item.pacienteNome).filter(Boolean))]
        return pacientes.length ? (
          <div className="gestao-lista">
            {pacientes.map((nome) => (
              <article className="gestao-card gestao-paciente" key={nome}>
                <span aria-hidden="true">{nome.trim().slice(0, 1).toUpperCase()}</span>
                <div><h3>{nome}</h3><p>Paciente atendido em sua agenda</p></div>
              </article>
            ))}
          </div>
        ) : <p className="gestao-estado">Ainda não há pacientes na agenda.</p>
      }
      if (secao === 'agenda') {
        const disponibilidades = (dados?.disponibilidades || []).filter(
          (item) => item.ativo
        )

        return (
          <>
            <section className="gestao-agenda-consultas" aria-labelledby="gestao-consultas-titulo">
              <div className="gestao-secao-cabecalho">
                <div>
                  <h2 id="gestao-consultas-titulo" className="gestao-subtitulo">
                    Consultas agendadas
                  </h2>
                  <p className="gestao-legenda">
                    {consultas.length === 1
                      ? '1 consulta confirmada'
                      : `${consultas.length} consultas confirmadas`}
                  </p>
                </div>
                <span className="gestao-contagem-consultas" aria-hidden="true">
                  {consultas.length}
                </span>
              </div>
            {consultas.length ? (
              <div className="gestao-lista">
                {consultas.map((item) => (
                  <CartaoAgendamento
                    key={item.id}
                    item={item}
                    profissional
                    atualizando={atualizandoId === item.id}
                    instanteAtual={instanteAtual}
                    aoAlterarStatus={alterarStatus}
                  />
                ))}
              </div>
            ) : <p className="gestao-estado">Não há consultas próximas.</p>}
            </section>

            <details className="gestao-disponibilidades">
              <summary>
                <span className="gestao-disponibilidades-titulo">
                  <strong>Horários disponíveis</strong>
                  <small>
                    {disponibilidades.length === 1
                      ? '1 horário de 30 minutos'
                      : `${disponibilidades.length} horários de 30 minutos`}
                  </small>
                </span>
                <span className="gestao-disponibilidades-indicador" aria-hidden="true" />
              </summary>
              <div className="gestao-disponibilidades-conteudo">
                <FormularioDisponibilidade
                  clinicas={dados?.clinicas || []}
                  areas={dados?.areas || []}
                  salvando={salvando}
                  instanteAtual={instanteAtual}
                  aoSalvar={(disponibilidade) => executarAcao(
                    () => criarDisponibilidadeProfissional(disponibilidade),
                    'Disponibilidade adicionada.'
                  )}
                />
                <div className="gestao-lista">
                  {disponibilidades.map((item) => (
                    <article className="gestao-card" key={item.id}>
                      <div className="gestao-agendamento-cabecalho">
                        <h3>{formatarData(`${item.data}T${item.horaInicio}`, { timeStyle: undefined, dateStyle: 'full' })}</h3>
                        <span className="gestao-legenda">{item.horaInicio.slice(0, 5)}–{item.horaFim.slice(0, 5)}</span>
                      </div>
                      <p>{dados.clinicas.find((clinica) => clinica.id === item.clinicaId)?.nome || 'Clínica'}</p>
                      <p>{dados.areas.find((area) => area.id === item.especialidadeId)?.nome || 'Área de saúde'}</p>
                      <button
                        className="gestao-botao gestao-botao-secundario"
                        type="button"
                        disabled={salvando}
                        onClick={() => {
                          if (window.confirm('Remover esta disponibilidade?')) {
                            executarAcao(
                              () => inativarDisponibilidadeProfissional(item.id),
                              'Disponibilidade removida.'
                            )
                          }
                        }}
                      >
                        Remover horário
                      </button>
                    </article>
                  ))}
                  {!disponibilidades.length && (
                    <p className="gestao-estado">Nenhum horário disponível cadastrado.</p>
                  )}
                </div>
              </div>
            </details>
          </>
        )
      }
      return consultas.length ? (
        <div className="gestao-lista">
          {consultas.map((item) => (
            <CartaoAgendamento
              key={item.id}
              item={item}
              profissional
              atualizando={atualizandoId === item.id}
              instanteAtual={instanteAtual}
              aoAlterarStatus={alterarStatus}
            />
          ))}
        </div>
      ) : <p className="gestao-estado">Não há consultas nesta seção.</p>
    }

    if (secao === 'inicio') {
      const agendamentos = dados?.agendamentos || []
      const hoje = dataRecifeISO(instanteAtual)
      const deHoje = agendamentos.filter((item) => item.inicio.startsWith(hoje) && item.status === 'CONFIRMADO')
      return (
        <>
          <div className="gestao-resumos">
            <article><span>Consultas</span><strong>{agendamentos.length}</strong></article>
            <article><span>Hoje</span><strong>{deHoje.length}</strong></article>
            <article><span>Clínicas ativas</span><strong>{(dados?.clinicas || []).filter((item) => item.ativo).length}</strong></article>
            <article><span>Áreas cadastradas</span><strong>{(dados?.areas || []).filter((item) => item.ativo).length}</strong></article>
          </div>
          <h2 className="gestao-subtitulo">Consultas recentes</h2>
          {agendamentos.slice(0, 5).map((item) => (
            <CartaoAgendamento key={item.id} item={item} />
          ))}
          {!agendamentos.length && <p className="gestao-estado">Ainda não há consultas registradas.</p>}
        </>
      )
    }

    if (secao === 'clinicas') {
      const clinicas = Array.isArray(dados) ? dados : []
      return (
        <>
          <FormularioClinica
            salvando={salvando}
            aoSalvar={(dadosClinica) => executarAcao(() => criarClinica(dadosClinica), 'Clínica cadastrada.')}
          />
          <div className="gestao-lista">
            {clinicas.map((clinica) => (
              <article className="gestao-card" key={clinica.id}>
                <div className="gestao-agendamento-cabecalho">
                  <h3>{clinica.nome}</h3><span className="gestao-legenda">{clinica.ativo ? 'Ativa' : 'Inativa'}</span>
                </div>
                <p>{[clinica.logradouro, clinica.numero, clinica.bairro, clinica.cidade, clinica.uf].filter(Boolean).join(', ')}</p>
                <p>{clinica.telefone} · {clinica.email}</p>
                {clinica.ativo && <button className="gestao-botao gestao-botao-secundario" type="button" onClick={() => {
                  if (window.confirm(`Inativar a clínica ${clinica.nome}?`)) executarAcao(() => inativarClinica(clinica.id), 'Clínica inativada.')
                }}>Inativar clínica</button>}
              </article>
            ))}
          </div>
        </>
      )
    }

    if (secao === 'areas') {
      const areas = Array.isArray(dados) ? dados : []
      return (
        <>
          <FormularioArea
            salvando={salvando}
            aoSalvar={(area) => executarAcao(() => criarArea(area), 'Área cadastrada.')}
          />
          <div className="gestao-lista">
            {areas.map((area) => (
              <article className="gestao-card" key={area.id}>
                <div className="gestao-agendamento-cabecalho">
                  <h3>{area.nome}</h3><span className="gestao-legenda">{area.ativo ? 'Ativa' : 'Inativa'}</span>
                </div>
                {area.descricao && <p>{area.descricao}</p>}
                {area.ativo && <button className="gestao-botao gestao-botao-secundario" type="button" onClick={() => {
                  if (window.confirm(`Inativar a área ${area.nome}?`)) executarAcao(() => inativarArea(area.id), 'Área inativada.')
                }}>Inativar área</button>}
              </article>
            ))}
          </div>
        </>
      )
    }

    if (secao === 'equipe') {
      const profissionaisIds = new Set((dados?.profissionais || []).map((item) => item.idUsuario))
      const usuarios = (dados?.usuarios || []).filter((item) => ['PROFISSIONAL', 'ADMIN'].includes(item.tipoUsuario))
      return (
        <div className="gestao-lista">
          {usuarios.map((membro) => (
            <article className="gestao-card" key={membro.id}>
              <div className="gestao-agendamento-cabecalho">
                <h3>{membro.nome}</h3><span className="gestao-legenda">{membro.tipoUsuario === 'ADMIN' ? 'Administrador' : 'Profissional'}</span>
              </div>
              <p>{membro.email}</p><p>{membro.telefone || 'Telefone não cadastrado'}</p>
              {membro.tipoUsuario === 'PROFISSIONAL' && !profissionaisIds.has(membro.id) && (
                <p className="gestao-feedback-erro">Cadastro profissional ainda não vinculado.</p>
              )}
              {membro.ativo && membro.id !== usuario?.id && (
                <button className="gestao-botao gestao-botao-secundario" type="button" onClick={() => {
                  if (window.confirm(`Desativar o acesso de ${membro.nome}?`)) executarAcao(() => inativarUsuario(membro.id), 'Acesso desativado.')
                }}>Desativar acesso</button>
              )}
            </article>
          ))}
          {!usuarios.length && <p className="gestao-estado">Nenhum membro cadastrado.</p>}
        </div>
      )
    }

    return (
      <section className="gestao-card gestao-perfil">
        <h2>{usuario?.nome || 'Administrador'}</h2>
        <p><strong>E-mail:</strong> {usuario?.email}</p>
        <p>As informações deste perfil são gerenciadas pela conta de acesso.</p>
        <button
          className="gestao-botao gestao-botao-secundario"
          type="button"
          onClick={encerrarSessao}
        >
          Sair da conta
        </button>
      </section>
    )
  }

  return (
    <main className="painel-gestao">
      <header className="painel-gestao-topo">
        <p>Saúde Sênior</p>
        <h1>{titulo}</h1>
        <span>Olá, {(profissional && secao === 'perfil' && dados?.nome) || usuario?.nome || 'usuário'}</span>
      </header>
      <section className="painel-gestao-conteudo" aria-live="polite">
        {erro && dados && <p className="gestao-feedback gestao-feedback-erro" role="alert">{erro}</p>}
        {aviso && <p className="gestao-feedback" role="status">{aviso}</p>}
        {carregando || secaoCarregada !== chaveSecao
          ? <Carregando />
          : conteudo()}
      </section>
      <BarraNavegacaoGestao perfil={perfil} />
    </main>
  )
}

export default PainelGestao
