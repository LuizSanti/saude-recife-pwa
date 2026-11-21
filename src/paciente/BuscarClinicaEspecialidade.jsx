import { useEffect, useMemo, useState } from 'react'
import BarraNavegacao from '../components/BarraNavegacao'
import voltaIcone from '../assets/voltaIcone.svg'
import lupaIcone from '../assets/lupaIcone.svg'
import {
  listarClinicas,
  listarEspecialidades,
} from '../services/agendamentoService'
import './BuscarClinicaEspecialidade.css'

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function enderecoClinica(clinica) {
  return [clinica.bairro, clinica.cidade, clinica.uf]
    .filter(Boolean)
    .join(', ')
}

function BuscarClinicaEspecialidade({
  termoInicial = '',
  aoVoltar,
  aoSelecionarEspecialidade,
  aoSelecionarClinica,
  aoNavegar,
}) {
  const [termo, setTermo] = useState(termoInicial)
  const [especialidades, setEspecialidades] = useState([])
  const [clinicas, setClinicas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativa = true

    async function carregarOpcoes() {
      setCarregando(true)
      setErro('')
      try {
        const [listaEspecialidades, listaClinicas] = await Promise.all([
          listarEspecialidades(),
          listarClinicas(),
        ])
        if (ativa) {
          setEspecialidades(listaEspecialidades.filter((item) => item.ativo))
          setClinicas(listaClinicas.filter((item) => item.ativo))
        }
      } catch (error) {
        if (ativa) setErro(error.message)
      } finally {
        if (ativa) setCarregando(false)
      }
    }

    carregarOpcoes()
    return () => {
      ativa = false
    }
  }, [tentativa])

  const { especialidadesFiltradas, clinicasFiltradas } = useMemo(() => {
    const busca = normalizar(termo.trim())
    return {
      especialidadesFiltradas: especialidades.filter((item) =>
        normalizar(item.nome).includes(busca)
      ),
      clinicasFiltradas: clinicas.filter((item) =>
        normalizar(`${item.nome} ${enderecoClinica(item)}`).includes(busca)
      ),
    }
  }, [clinicas, especialidades, termo])

  return (
    <main className="buscar-clinica-especialidade">
      <header className="buscar-topo">
        <button
          type="button"
          className="buscar-voltar"
          onClick={aoVoltar}
          aria-label="Voltar ao início"
        >
          <img src={voltaIcone} alt="" />
        </button>
        <h1>BUSCAR</h1>
      </header>

      <div className="buscar-conteudo">
        <label className="buscar-campo">
          <img src={lupaIcone} alt="" />
          <span className="buscar-leitor-tela">Buscar clínica ou especialidade</span>
          <input
            type="search"
            placeholder="Clínica ou especialidade"
            value={termo}
            onChange={(event) => setTermo(event.target.value)}
            autoComplete="off"
          />
        </label>

        {carregando ? (
          <p className="buscar-estado" role="status">
            Carregando clínicas e especialidades...
          </p>
        ) : erro ? (
          <div className="buscar-estado" role="alert">
            <p>{erro}</p>
            <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <section className="buscar-secao" aria-labelledby="buscar-especialidades">
              <h2 id="buscar-especialidades">Especialidades</h2>
              {especialidadesFiltradas.length ? (
                <ul>
                  {especialidadesFiltradas.map((especialidade) => (
                    <li key={especialidade.id}>
                      <button
                        type="button"
                        onClick={() =>
                          aoSelecionarEspecialidade(especialidade, termo)
                        }
                      >
                        <span>{especialidade.nome}</span>
                        <small>Especialidade</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="buscar-vazio">
                  Nenhuma especialidade encontrada.
                </p>
              )}
            </section>

            <section className="buscar-secao" aria-labelledby="buscar-clinicas">
              <h2 id="buscar-clinicas">Clínicas</h2>
              {clinicasFiltradas.length ? (
                <ul>
                  {clinicasFiltradas.map((clinica) => (
                    <li key={clinica.id}>
                      <button
                        type="button"
                        onClick={() => aoSelecionarClinica(clinica, termo)}
                      >
                        <span>{clinica.nome}</span>
                        <small>
                          {enderecoClinica(clinica) || 'Clínica'}
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="buscar-vazio">Nenhuma clínica encontrada.</p>
              )}
            </section>
          </>
        )}
      </div>

      <BarraNavegacao aoNavegar={aoNavegar} />
    </main>
  )
}

export default BuscarClinicaEspecialidade
