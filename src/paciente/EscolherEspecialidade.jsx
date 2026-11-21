import { useEffect, useState } from 'react'
import TelaEscolha from '../components/TelaEscolha'
import { listarEspecialidades } from '../services/agendamentoService'

function EscolherEspecialidade({ aoVoltar, aoSelecionar, aoNavegar }) {
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
        const especialidades = await listarEspecialidades()
        if (ativa) {
          setOpcoes(especialidades.filter((item) => item.ativo))
        }
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
      titulo="ESPECIALIDADE"
      subtitulo="Escolher Especialidade"
      etapaAtual={1}
      opcoes={opcoes}
      rotuloBusca="Pesquisar especialidade"
      mensagemVazia="Nenhuma especialidade encontrada."
      carregando={carregando}
      erro={erro}
      aoTentarNovamente={() => setTentativa((valor) => valor + 1)}
      aoVoltar={aoVoltar}
      aoSelecionar={aoSelecionar}
      aoNavegar={aoNavegar}
    />
  )
}

export default EscolherEspecialidade
