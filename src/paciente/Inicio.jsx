import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraNavegacao from '../components/BarraNavegacao'
import {
  IconeHospital,
  IconeMicrofone,
  IconePrancheta,
  IconeRelogio,
  IconeSino,
} from '../components/icones'
import { useAuth } from '../hooks/useAuth'
import lupaIcone from '../assets/lupaIcone.svg'
import { listarConsultasComDetalhes } from '../services/agendamentoService'
import { buscarPerfilPaciente } from '../services/gestaoService'
import './Inicio.css'

const USAR_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function doisPrimeirosNomes(nome = '') {
  return nome.trim().split(/\s+/).slice(0, 2).join(' ')
}

function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}

function partesDataConsulta(inicio) {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'America/Recife',
  }).formatToParts(new Date(inicio))

  return {
    dia: partes.find((parte) => parte.type === 'day')?.value || '',
    mes: (partes.find((parte) => parte.type === 'month')?.value || '')
      .replace('.', '')
      .toUpperCase(),
  }
}

function enderecoClinica(clinica) {
  return [
    clinica?.logradouro,
    clinica?.numero,
    clinica?.bairro,
    clinica?.cidade,
    clinica?.uf,
  ]
    .filter(Boolean)
    .join(', ')
}

function Inicio({ aoNavegar }) {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [nomePerfil, setNomePerfil] = useState('')
  const [erroPerfil, setErroPerfil] = useState('')
  const [consulta, setConsulta] = useState(null)
  const [carregandoConsulta, setCarregandoConsulta] = useState(true)
  const [erroConsulta, setErroConsulta] = useState('')

  useEffect(() => {
    let ativa = true

    if (!USAR_MOCK) {
      buscarPerfilPaciente()
        .then((perfil) => {
          if (typeof perfil?.nome !== 'string' || !perfil.nome.trim()) {
            throw new Error('O perfil não retornou o nome completo.')
          }
          if (ativa) setNomePerfil(perfil.nome.trim())
        })
        .catch(() => {
          if (ativa) {
            setErroPerfil(
              'Não foi possível carregar seu nome completo. Confira seus dados no perfil.'
            )
          }
        })
    }

    listarConsultasComDetalhes()
      .then((consultas) => {
        const agora = Date.now()
        const proxima = consultas
          .filter(
            (item) =>
              item.status === 'CONFIRMADO' &&
              new Date(item.inicio).getTime() > agora
          )
          .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))[0]

        if (ativa) setConsulta(proxima || null)
      })
      .catch((error) => {
        if (ativa) setErroConsulta(error.message)
      })
      .finally(() => {
        if (ativa) setCarregandoConsulta(false)
      })

    return () => {
      ativa = false
    }
  }, [])

  const nomeUsuario = usuario?.nome?.trim()
  const nomeEmail = usuario?.email?.split('@')[0]
  const nomeExibicao =
    nomePerfil ||
    (USAR_MOCK || nomeUsuario !== nomeEmail ? nomeUsuario : '') ||
    'Paciente'

  return (
    <main className="inicio">
      <header className="inicio-topo">
        <div className="inicio-avatar" aria-hidden="true">
          {iniciais(nomeExibicao)}
        </div>
        <div className="inicio-saudacao">
          <p className="inicio-bemvindo">Bem vindo</p>
          <h1 className="inicio-nome">
            {doisPrimeirosNomes(nomeExibicao)}
          </h1>
        </div>
        <button type="button" className="inicio-sino" aria-label="Notificações">
          <IconeSino />
          <span className="inicio-sino-ponto" aria-hidden="true" />
        </button>
      </header>

      {erroPerfil && (
        <p className="inicio-perfil-aviso" role="status">
          {erroPerfil}
        </p>
      )}

      <button
        type="button"
        className="inicio-busca"
        onClick={() => navigate('/buscar')}
      >
        <img src={lupaIcone} alt="" className="inicio-busca-lupa" />
        <span className="inicio-busca-texto">Procurar clínica ou especialidade</span>
        <IconeMicrofone />
      </button>

      <section className="inicio-atalhos" aria-label="Atalhos">
        <button
          type="button"
          className="inicio-atalho"
          onClick={() => navigate('/especialidade')}
        >
          <IconePrancheta />
          <span>
            Marcar
            <br />
            Consulta
          </span>
        </button>
        <button
          type="button"
          className="inicio-atalho"
          onClick={() => navigate('/exames')}
        >
          <IconeHospital />
          <span>
            Marcar
            <br />
            Exame
          </span>
        </button>
      </section>

      <section className="inicio-triagem" aria-label="Triagem com IA">
        <h2>Triagem com IA</h2>
        <p>Descreva seus sintomas para a triagem inicial</p>
      </section>

      <section className="inicio-proxima" aria-labelledby="titulo-proxima">
        <h2 id="titulo-proxima" className="inicio-proxima-titulo">
          Sua Próxima consulta
        </h2>

        {carregandoConsulta ? (
          <p className="inicio-vazio" role="status">
            Carregando sua próxima consulta...
          </p>
        ) : erroConsulta ? (
          <div className="inicio-vazio inicio-consulta-erro" role="alert">
            <p>{erroConsulta}</p>
            <button type="button" onClick={() => navigate('/consultas')}>
              Ver consultas
            </button>
          </div>
        ) : consulta ? (
          <article className="inicio-consulta">
            <span className="inicio-consulta-status">CONFIRMADA</span>
            <div className="inicio-consulta-data">
              <span className="inicio-consulta-mes">
                {partesDataConsulta(consulta.inicio).mes}
              </span>
              <span className="inicio-consulta-dia">
                {partesDataConsulta(consulta.inicio).dia}
              </span>
            </div>
            <div className="inicio-consulta-info">
              <h3 className="inicio-consulta-medico">
                {consulta.profissional?.nome || 'Profissional não informado'}
              </h3>
              <p className="inicio-consulta-especialidade">
                {consulta.especialidade?.nome || 'Especialidade não informada'}
              </p>
              <p className="inicio-consulta-hora">
                <IconeRelogio />
                {new Intl.DateTimeFormat('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Recife',
                }).format(new Date(consulta.inicio))}
              </p>
              <p className="inicio-consulta-local">
                {consulta.clinica?.nome || 'Unidade não informada'}
                <br />
                {enderecoClinica(consulta.clinica) || 'Endereço não informado'}
              </p>
            </div>
          </article>
        ) : (
          <p className="inicio-vazio">Você ainda não tem consultas marcadas.</p>
        )}
      </section>

      <BarraNavegacao itemAtivo="inicio" aoNavegar={aoNavegar} />
    </main>
  )
}

export default Inicio