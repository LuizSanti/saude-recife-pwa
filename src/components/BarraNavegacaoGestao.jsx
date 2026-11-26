import { useLocation, useNavigate } from 'react-router-dom'
import './BarraNavegacaoGestao.css'

const ITENS_POR_PERFIL = {
  admin: [
    { id: 'inicio', rotulo: 'Início', rota: '/admin', icone: 'inicio' },
    {
      id: 'indicadores',
      rotulo: 'Análise',
      rota: '/admin/indicadores',
      icone: 'indicadores',
    },
    {
      id: 'clinicas',
      rotulo: 'Clínicas',
      rota: '/admin/clinicas',
      icone: 'clinicas',
    },
    { id: 'equipe', rotulo: 'Equipe', rota: '/admin/equipe', icone: 'equipe' },
    { id: 'areas', rotulo: 'Áreas', rota: '/admin/areas', icone: 'areas' },
    {
      id: 'perfil',
      rotulo: 'Perfil',
      rota: '/admin/perfil',
      icone: 'perfil',
    },
  ],
  profissional: [
    {
      id: 'pacientes',
      rotulo: 'Pacientes',
      rota: '/profissional/pacientes',
      icone: 'pacientes',
    },
    {
      id: 'agenda',
      rotulo: 'Agenda',
      rota: '/profissional/agenda',
      icone: 'agenda',
    },
    {
      id: 'historico',
      rotulo: 'Histórico',
      rota: '/profissional/historico',
      icone: 'historico',
    },
    {
      id: 'perfil',
      rotulo: 'Perfil',
      rota: '/profissional/perfil',
      icone: 'perfil',
    },
  ],
}

function IconeNavegacao({ nome }) {
  const conteudo = {
    inicio: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-7h6v7" />
      </>
    ),
    clinicas: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
        <path d="M2 21h20M9 7h2m2 0h2m-6 4h2m2 0h2m-6 4h2m2 0h2M10 21v-3h4v3" />
      </>
    ),
    equipe: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 5v1" />
      </>
    ),
    areas: (
      <>
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    perfil: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    pacientes: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 8h5m-2.5-2.5v5" />
      </>
    ),
    agenda: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h2m4 0h2m-8 3h2" />
      </>
    ),
    indicadores: (
      <>
        <path d="M4 20V10m5 10V4m5 16v-7m5 7V7M2 20h20" />
      </>
    ),
    historico: (
      <>
        <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
        <path d="M3 3v5h5m4-1v5l3 2" />
      </>
    ),
  }[nome]

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {conteudo}
    </svg>
  )
}

function BarraNavegacaoGestao({ perfil }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const itens = ITENS_POR_PERFIL[perfil] || []

  return (
    <nav
      className="barra-gestao"
      aria-label={perfil === 'admin' ? 'Menu do administrador' : 'Menu profissional'}
    >
      <ul className="barra-gestao-lista">
        {itens.map((item) => {
          const ativo =
            pathname === item.rota ||
            (item.id !== 'inicio' && pathname.startsWith(`${item.rota}/`)) ||
            (perfil === 'profissional' &&
              item.id === 'agenda' &&
              pathname === '/profissional')

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`barra-gestao-item${ativo ? ' barra-gestao-item-ativo' : ''}`}
                onClick={() => navigate(item.rota)}
                aria-current={ativo ? 'page' : undefined}
              >
                <IconeNavegacao nome={item.icone} />
                <span>{item.rotulo}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BarraNavegacaoGestao
