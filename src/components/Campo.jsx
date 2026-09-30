import { useState } from 'react'
import './Campo.css'

function Campo({ id, rotulo, tipo = 'text', valor, aoMudar, placeholder, erro, autoComplete }) {
  const [mostrar, setMostrar] = useState(false)
  const ehSenha = tipo === 'password'
  const tipoReal = ehSenha && mostrar ? 'text' : tipo

  return (
    <div className="campo">
      <label htmlFor={id} className="campo-rotulo">
        {rotulo}
      </label>
      <div className="campo-caixa">
        <input
          id={id}
          type={tipoReal}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={erro ? 'true' : 'false'}
          aria-describedby={erro ? `${id}-erro` : undefined}
        />
        {ehSenha && (
          <button
            type="button"
            className="campo-olho"
            onClick={() => setMostrar(!mostrar)}
            aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {mostrar ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
      {erro && (
        <p id={`${id}-erro`} className="campo-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

export default Campo