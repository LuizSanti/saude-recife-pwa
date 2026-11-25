import { useEffect, useState } from 'react'
import TelaEscolha from '../components/TelaEscolha'
import { listarClinicas } from '../services/agendamentoService'

function EscolherUnidade({
  especialidade,
  exame,
  aoVoltar,
  aoSelecionar,
  aoNavegar,
}) {
  const itemSelecionado = exame || especialidade
  const [opcoes, setOpcoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativa = true

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const clinicas = await listarClinicas()
        if (ativa) setOpcoes(clinicas.filter((item) => item.ativo))
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativa = false
    }
  }, [tentativa])

  return (
    <TelaEscolha
      titulo="UNIDADE"
      subtitulo={`Escolher unidade para ${itemSelecionado.nome}`}
      etapaAtual={2}
      opcoes={opcoes}
      rotuloBusca="Pesquisar unidade"
      mensagemVazia="Nenhuma unidade encontrada."
      carregando={carregando}
      erro={erro}
      aoTentarNovamente={() => setTentativa((valor) => valor + 1)}
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherUnidade
