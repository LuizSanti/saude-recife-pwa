import mapaIcone from '../assets/mapaIcone.svg'
import './CartaoProfissional.css'

function pegarIniciais(nome) {
  return nome
    .split(' ')
    .filter((parte) => parte.length > 2)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

function CartaoProfissional({ profissional, aoAgendar }) {
  const { nome, foto, distancia, especialidade, crm, unidade, endereco } = profissional

  return (
    <article className="cartao-profissional">
      <div className="cartao-profissional-cabecalho">
        {foto ? (
          <img src={foto} alt="" className="cartao-profissional-foto" />
        ) : (
          <span className="cartao-profissional-foto cartao-profissional-iniciais" aria-hidden="true">
            {pegarIniciais(nome)}
          </span>
        )}

        <div className="cartao-profissional-dados">
          <div className="cartao-profissional-linha">
            <h3 className="cartao-profissional-nome">{nome}</h3>
            <span className="cartao-profissional-distancia">{distancia}</span>
          </div>
          <p className="cartao-profissional-especialidade">{especialidade}</p>
          <p className="cartao-profissional-crm">
            <span className="cartao-profissional-crm-rotulo">CRM:</span> {crm}
          </p>
        </div>
      </div>

      <div className="cartao-profissional-local">
        <p className="cartao-profissional-unidade">
          <img src={mapaIcone} alt="" className="cartao-profissional-icone" />
          {unidade}
        </p>
        <p className="cartao-profissional-endereco">{endereco}</p>
      </div>

      <button
        type="button"
        className="cartao-profissional-botao"
        onClick={() => aoAgendar(profissional)}
        aria-label={`Agendar consulta com ${nome}`}
      >
        AGENDAR CONSULTA
      </button>
    </article>
  )
}

export default CartaoProfissional