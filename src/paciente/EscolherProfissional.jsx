import TelaEscolha from '../components/TelaEscolha'
import CartaoProfissional from '../components/CartaoProfissional'
import fotoMedica1 from '../assets/foto_medica1.png'
import fotoMedica2 from '../assets/foto_medica2.png'

const PROFISSIONAIS_MOCK = [
  {
    id: 1,
    nome: 'Dra Manuela Padrão',
    foto: fotoMedica1,
    distancia: '0.9km',
    especialidade: 'Cardiologista',
    crm: '9909 - PE',
    unidade: 'Hospital das Clínicas',
    endereco: 'Av. Prof Moraes Rego, 1235 - Cidade Universitária',
  },
  {
    id: 2,
    nome: 'Dra Carla Minoria',
     foto: fotoMedica2,
    distancia: '2.0km',
    especialidade: 'Cardiologista',
    crm: '9909 - PE',
    unidade: 'Hospital Esperança',
    endereco: 'Av. Agamenon Magalhães, 3421 - Recife PE',
  },
]

function EscolherProfissional({ aoVoltar, aoAgendar, aoNavegar }) {
  return (
    <TelaEscolha
      titulo="PROFISSIONAL"
      subtitulo="Escolher profissional"
      etapaAtual={3}
      aoVoltar={aoVoltar}
      aoNavegar={aoNavegar}
    >
      {PROFISSIONAIS_MOCK.map((profissional) => (
        <CartaoProfissional
          key={profissional.id}
          profissional={profissional}
          aoAgendar={aoAgendar}
        />
      ))}
    </TelaEscolha>
  )
}

export default EscolherProfissional