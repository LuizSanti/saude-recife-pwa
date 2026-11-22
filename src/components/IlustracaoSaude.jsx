import './IlustracaoSaude.css'

function tipoIlustracao(nome = '') {
  const texto = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  if (texto.includes('cardio') || texto.includes('coracao')) return 'cardiologia'
  if (texto.includes('geriat')) return 'geriatria'
  if (texto.includes('neuro')) return 'neurologia'
  if (texto.includes('orto')) return 'ortopedia'
  if (texto.includes('fisio')) return 'fisioterapia'
  if (texto.includes('endocr')) return 'endocrinologia'
  if (texto.includes('exame') || texto.includes('glicemia') || texto.includes('hemograma') || texto.includes('mamografia') || texto.includes('colonoscopia')) return 'exame'
  if (texto.includes('clinica') || texto.includes('hospital') || texto.includes('upa')) return 'clinica'
  if (texto.includes('oftal')) return 'oftalmologia'

  return 'saude'
}

const DESENHOS = {
  cardiologia: (
    <>
      <path d="M24 43 9 28a9 9 0 0 1 13-13l2 2 2-2a9 9 0 0 1 13 13L24 43Z" />
      <path d="M10 28h8l4-8 6 16 4-8h7" />
    </>
  ),
  geriatria: (
    <>
      <circle cx="21" cy="15" r="7" />
      <path d="M10 43v-4a11 11 0 0 1 22 0v4M35 21v19a4 4 0 0 0 8 0V28" />
      <path d="M35 21h8" />
    </>
  ),
  neurologia: (
    <>
      <path d="M24 13a7 7 0 0 0-13 4 7 7 0 0 0 1 13 7 7 0 0 0 12 6V13Zm0 0a7 7 0 0 1 13 4 7 7 0 0 1-1 13 7 7 0 0 1-12 6V13Z" />
      <path d="M17 18c4 1 3 5 1 6m14-6c-4 1-3 5-1 6M18 32c3-2 5 0 6 2m14-2c-3-2-5 0-6 2" />
    </>
  ),
  ortopedia: (
    <>
      <path d="M16 14a6 6 0 1 0-5 10l13 13a6 6 0 1 0 10-5L21 19a6 6 0 0 0-5-5Z" />
      <path d="m18 21 5-5m1 18 5-5" />
    </>
  ),
  fisioterapia: (
    <>
      <circle cx="26" cy="12" r="6" />
      <path d="m22 20-8 8 8 5-5 10m8-23 7 7 8 1m-15 0 7 8-2 8" />
      <path d="M11 45h34" />
    </>
  ),
  endocrinologia: (
    <>
      <path d="M24 8c-5 8-13 16-13 24a13 13 0 0 0 26 0c0-8-8-16-13-24Z" />
      <path d="M18 32a6 6 0 0 0 6 6" />
    </>
  ),
  exame: (
    <>
      <path d="M18 8h12m-10 0v16l-7 12a5 5 0 0 0 4 8h14a5 5 0 0 0 4-8l-7-12V8" />
      <path d="M16 34h17M20 29h9" />
      <circle cx="22" cy="37" r="1" />
      <circle cx="28" cy="39" r="1" />
    </>
  ),
  clinica: (
    <>
      <path d="M10 43V13a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v30M6 43h36" />
      <path d="M21 16h6m-3-3v6m-9 5h4m8 0h4m-16 7h4m8 0h4m-9 12V35h6v8" />
    </>
  ),
  oftalmologia: (
    <>
      <path d="M5 26s7-13 19-13 19 13 19 13-7 13-19 13S5 26 5 26Z" />
      <circle cx="24" cy="26" r="7" />
      <circle cx="24" cy="26" r="2" />
    </>
  ),
  saude: (
    <>
      <path d="M24 8v32M8 24h32" />
      <circle cx="24" cy="24" r="18" />
    </>
  ),
}

function IlustracaoSaude({ nome }) {
  const tipo = tipoIlustracao(nome)

  return (
    <span className={`ilustracao-saude ilustracao-saude-${tipo}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        {DESENHOS[tipo]}
      </svg>
    </span>
  )
}

export default IlustracaoSaude
