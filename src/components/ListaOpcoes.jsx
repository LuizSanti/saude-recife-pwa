import { useState } from 'react'
import './ListaOpcoes.css'

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function ListaOpcoes({ opcoes, aoSelecionar, rotulo = 'Pesquisar', mensagemVazia = 'Nenhum resultado encontrado.' }) {
  const [busca, setBusca] = useState('')

  const filtradas = opcoes.filter((opcao) =>
    normalizar(opcao.nome).includes(normalizar(busca.trim()))
  )

  return (
    <div className="lista-opcoes">
      <label htmlFor="lista-opcoes-busca" className="lista-opcoes-rotulo">
        {rotulo}
      </label>
      <input
        id="lista-opcoes-busca"
        type="search"
        className="lista-opcoes-busca"
        placeholder={rotulo}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        autoComplete="off"
      />

      <p className="lista-opcoes-status" aria-live="polite">
        {filtradas.length === 0 ? mensagemVazia : ''}
      </p>

      <ul className="lista-opcoes-itens">
        {filtradas.map((opcao) => (
          <li key={opcao.id}>
            <button
              type="button"
              className="lista-opcoes-botao"
              onClick={() => aoSelecionar(opcao)}
            >
              {opcao.nome}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListaOpcoes