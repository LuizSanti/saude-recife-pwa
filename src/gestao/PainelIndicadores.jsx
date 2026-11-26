import { useEffect, useMemo, useState } from 'react'
import baseDemonstracaoCsv from '../data/agendamentos-dashboard-demo.csv?raw'
import { listarAgendamentosAdmin } from '../services/gestaoService'
import {
  calcularIndicadoresAgendamentos,
  filtrarAgendamentos,
  lerBaseAgendamentosCsv,
  normalizarAgendamentosApi,
} from '../utils/indicadoresAgendamentos'
import './PainelIndicadores.css'

const BASE_DEMONSTRACAO = lerBaseAgendamentosCsv(baseDemonstracaoCsv)
const formatarPercentual = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 1,
})

function PainelIndicadores() {
  const [fonte, setFonte] = useState('api')
  const [agendamentosApi, setAgendamentosApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [especialidade, setEspecialidade] = useState('')

  useEffect(() => {
    let ativo = true

    listarAgendamentosAdmin()
      .then(normalizarAgendamentosApi)
      .then((resultado) => {
        if (ativo) setAgendamentosApi(resultado)
      })
      .catch((error) => {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os agendamentos da API.'
          )
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const registros = fonte === 'demo' ? BASE_DEMONSTRACAO : agendamentosApi
  const especialidades = useMemo(
    () =>
      [...new Set(registros.map((item) => item.especialidade))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
      ),
    [registros]
  )
  const registrosFiltrados = useMemo(
    () =>
      filtrarAgendamentos(registros, {
        dataInicio,
        dataFim,
        especialidade,
      }),
    [registros, dataInicio, dataFim, especialidade]
  )
  const indicadores = useMemo(
    () => calcularIndicadoresAgendamentos(registrosFiltrados),
    [registrosFiltrados]
  )
  const maiorQuantidade = Math.max(
    1,
    ...indicadores.especialidades.map((item) => item.quantidade)
  )
  const periodoBase = registros.length
    ? `${registros[0].data} a ${registros.reduce(
        (ultima, item) => (item.data > ultima ? item.data : ultima),
        registros[0].data
      )}`
    : 'sem registros'
  const filtroPeriodoInvalido = dataInicio && dataFim && dataInicio > dataFim

  return (
    <div className="indicadores">
      <section className="indicadores-introducao">
        <h2>Agendamentos e procura por especialidade</h2>
        <p>
          Acompanhe o volume de agendamentos, compare especialidades e observe
          cancelamentos para apoiar a avaliação da oferta de horários.
        </p>
        <div className="indicadores-origens" aria-label="Fonte dos dados">
          <button
            type="button"
            aria-pressed={fonte === 'api'}
            onClick={() => setFonte('api')}
          >
            Dados da aplicação
          </button>
          <button
            type="button"
            aria-pressed={fonte === 'demo'}
            onClick={() => setFonte('demo')}
          >
            Base sintética para demonstração
          </button>
        </div>
        <small>
          {fonte === 'demo'
            ? `Dados sintéticos, criados para a atividade; não representam pacientes nem a operação real. Período da base: ${periodoBase}.`
            : 'Fonte: API administrativa de agendamentos. O período considera a data da consulta.'}
        </small>
      </section>

      {fonte === 'api' && carregando ? (
        <p className="indicadores-estado" role="status">
          Carregando dados da aplicação...
        </p>
      ) : fonte === 'api' && erro ? (
        <p className="indicadores-estado indicadores-erro" role="alert">
          Não foi possível carregar os dados reais: {erro} Selecione a base
          sintética para demonstrar o funcionamento do painel.
        </p>
      ) : (
        <>
          <section className="indicadores-filtros" aria-label="Filtros do painel">
            <label>
              Data inicial
              <input
                type="date"
                value={dataInicio}
                onChange={(event) => setDataInicio(event.target.value)}
              />
            </label>
            <label>
              Data final
              <input
                type="date"
                value={dataFim}
                onChange={(event) => setDataFim(event.target.value)}
              />
            </label>
            <label>
              Especialidade
              <select
                value={especialidade}
                onChange={(event) => setEspecialidade(event.target.value)}
              >
                <option value="">Todas</option>
                {especialidades.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {filtroPeriodoInvalido ? (
            <p className="indicadores-estado indicadores-erro" role="alert">
              A data inicial precisa ser anterior ou igual à data final.
            </p>
          ) : !registros.length ? (
            <p className="indicadores-estado" role="status">
              A API não retornou agendamentos. Selecione a base sintética para
              demonstrar filtros e cálculos com dados de exemplo.
            </p>
          ) : (
            <>
              <section className="indicadores-resumos" aria-label="Indicadores">
                <article className="indicadores-resumo">
                  <span>Agendamentos no período</span>
                  <strong>{indicadores.total}</strong>
                  <small>Registros após aplicar os filtros.</small>
                </article>
                <article className="indicadores-resumo">
                  <span>Cancelados</span>
                  <strong>{indicadores.cancelados}</strong>
                  <small>Agendamentos com status CANCELADO.</small>
                </article>
                <article className="indicadores-resumo">
                  <span>Taxa de cancelamento</span>
                  <strong>
                    {formatarPercentual.format(indicadores.taxaCancelamento)}
                  </strong>
                  <small>Cancelados ÷ total de agendamentos.</small>
                </article>
              </section>

              {indicadores.total ? (
                <>
                  <section className="indicadores-grafico">
                    <h2>Distribuição por especialidade</h2>
                    <small>
                      Cada barra representa a quantidade de agendamentos no
                      recorte selecionado.
                    </small>
                    {indicadores.especialidades.map((item) => (
                      <div className="indicadores-grafico-item" key={item.nome}>
                        <span>{item.nome}</span>
                        <span
                          className="indicadores-barra-fundo"
                          aria-hidden="true"
                        >
                          <span
                            className="indicadores-barra"
                            style={{
                              width: `${(item.quantidade / maiorQuantidade) * 100}%`,
                            }}
                          />
                        </span>
                        <strong>{item.quantidade}</strong>
                      </div>
                    ))}
                  </section>

                  <section className="indicadores-tabela">
                    <h2>Detalhamento por especialidade</h2>
                    <div className="indicadores-tabela-conteiner">
                      <table>
                        <thead>
                          <tr>
                            <th scope="col">Especialidade</th>
                            <th scope="col">Agendamentos</th>
                            <th scope="col">Cancelados</th>
                            <th scope="col">Participação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {indicadores.especialidades.map((item) => (
                            <tr key={item.nome}>
                              <th scope="row">{item.nome}</th>
                              <td>{item.quantidade}</td>
                              <td>{item.cancelados}</td>
                              <td>{formatarPercentual.format(item.proporcao)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : (
                <p className="indicadores-estado" role="status">
                  Não há agendamentos para os filtros selecionados.
                </p>
              )}
            </>
          )}
        </>
      )}

      <section className="indicadores-decisao">
        <h2>Como interpretar</h2>
        <p>
          Um volume maior pode indicar procura registrada e ajudar a priorizar
          uma análise de oferta de horários. O indicador não mede fila de espera,
          necessidade clínica nem disponibilidade; considere esses dados antes
          de tomar decisões operacionais.
        </p>
      </section>

      <section className="indicadores-fonte">
        <strong>Base e validação</strong>
        <small>
          A taxa é calculada como quantidade de agendamentos CANCELADOS dividida
          pelo total de registros do recorte. O filtro considera a data da
          consulta. Confirme os totais e o efeito dos filtros comparando-os com
          a base utilizada.
        </small>
        {fonte === 'demo' && (
          <a
            className="indicadores-baixar"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(baseDemonstracaoCsv)}`}
            download="agendamentos-dashboard-demo.csv"
          >
            Baixar base sintética (CSV)
          </a>
        )}
      </section>
    </div>
  )
}

export default PainelIndicadores
