import { useEffect, useState } from 'react'
import TelaEscolha from '../components/TelaEscolha'
import { listarExames } from '../services/agendamentoService'

function EscolherExame({ aoVoltar, aoSelecionar, aoNavegar }) {
  const [exames, setExames] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativa = true

    async function carregarExames() {
      setCarregando(true)
      setErro('')
      try {
        const resultado = await listarExames()
        if (ativa) setExames(resultado.filter((exame) => exame.ativo))
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregarExames()
    return () => {
      ativa = false
    }
  }, [tentativa])

  return (
    <TelaEscolha
      titulo="EXAMES"
      subtitulo="Escolher o tipo de exame"
      etapaAtual={1}
      opcoes={exames}
      rotuloBusca="Pesquisar exame"
      mensagemVazia="Nenhum exame encontrado."
      mensagemSemOpcoes="Não há exames ativos cadastrados no momento. Entre em contato com o suporte."
      carregando={carregando}
      erro={erro}
      aoTentarNovamente={() => setTentativa((valor) => valor + 1)}
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherExame
