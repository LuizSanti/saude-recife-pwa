import { useNavigate } from 'react-router-dom'
import BarraNavegacao from '../components/BarraNavegacao'
import {
  IconeHospital,
  IconeMicrofone,
  IconePrancheta,
  IconeRelogio,
  IconeSino,
} from '../components/Icones'
import { useAuth } from '../hooks/useAuth'
import lupaIcone from '../assets/lupaIcone.svg'
import { proximaConsultaMock } from '../services/mocks/consultas'
import './Inicio.css'

// Por enquanto só o Início existe. Quando as telas de Consultas e Perfil
// forem criadas, é só colocar a rota delas aqui.
const ROTAS_DA_BARRA = { inicio: '/inicio' }

function doisPrimeirosNomes(nome = '') {
  return nome.trim().split(/\s+/).slice(0, 2).join(' ')
}

function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}

function Inicio() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()
  const consulta = proximaConsultaMock

  function aoNavegar(item) {
    const rota = ROTAS_DA_BARRA[item]
    if (rota) navigate(rota)
  }

  function aoSair() {
    sair()
    navigate('/login')
  }

  return (
    <main className="inicio">
      <header className="inicio-topo">
        <div className="inicio-avatar" aria-hidden="true">
          {iniciais(usuario?.nome)}
        </div>
        <div className="inicio-saudacao">
          <p className="inicio-bemvindo">Bem vindo</p>
          <h1 className="inicio-nome">{doisPrimeirosNomes(usuario?.nome)}</h1>
        </div>
        <button type="button" className="inicio-sino" aria-label="Notificações">
          <IconeSino />
          <span className="inicio-sino-ponto" aria-hidden="true" />
        </button>
      </header>

      <button
        type="button"
        className="inicio-busca"
        onClick={() => navigate('/especialidade')}
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

        {consulta ? (
          <article className="inicio-consulta">
            <span className="inicio-consulta-status">{consulta.status}</span>
            <div className="inicio-consulta-data">
              <span className="inicio-consulta-mes">{consulta.mes}</span>
              <span className="inicio-consulta-dia">{consulta.dia}</span>
            </div>
            <div className="inicio-consulta-info">
              <h3 className="inicio-consulta-medico">{consulta.medico}</h3>
              <p className="inicio-consulta-especialidade">{consulta.especialidade}</p>
              <p className="inicio-consulta-hora">
                <IconeRelogio />
                {consulta.horario}
              </p>
              <p className="inicio-consulta-local">
                {consulta.clinica}
                <br />
                {consulta.endereco}
              </p>
            </div>
          </article>
        ) : (
          <p className="inicio-vazio">Você ainda não tem consultas marcadas.</p>
        )}
      </section>

      {/* Provisório: sai quando a tela de Perfil existir */}
      <button type="button" className="inicio-sair" onClick={aoSair}>
        Sair
      </button>

      <BarraNavegacao itemAtivo="inicio" aoNavegar={aoNavegar} />
    </main>
  )
}

export default Inicio