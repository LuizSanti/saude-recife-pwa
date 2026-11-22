import { requisitarApi } from './apiService'

export function listarAgendaProfissional() {
  return requisitarApi('/agendamentos/profissional/me')
}

export function listarAgendamentosAdmin() {
  return requisitarApi('/agendamentos/admin')
}

export function atualizarStatusAgendamento(id, status, motivoCancelamento) {
  return requisitarApi(`/agendamentos/profissional/${id}/status`, {
    metodo: 'PATCH',
    dados: { status, motivoCancelamento },
  })
}

export function buscarPerfilProfissional() {
  return requisitarApi('/profissionais/me')
}

export function atualizarPerfilProfissional(dados) {
  return requisitarApi('/profissionais/me', {
    metodo: 'PUT',
    dados,
  })
}

export function listarDisponibilidadesProfissional() {
  return requisitarApi('/disponibilidades/profissional/me')
}

export function criarDisponibilidadeProfissional(dados) {
  return requisitarApi('/disponibilidades/profissional/me', {
    metodo: 'POST',
    dados,
  })
}

export function inativarDisponibilidadeProfissional(id) {
  return requisitarApi(`/disponibilidades/profissional/me/${id}`, {
    metodo: 'DELETE',
  })
}

export function listarClinicasAdmin() {
  return requisitarApi('/clinicas')
}

export function criarClinica(dados) {
  return requisitarApi('/clinicas', { metodo: 'POST', dados })
}

export function inativarClinica(id) {
  return requisitarApi(`/clinicas/${id}`, { metodo: 'DELETE' })
}

export function listarEquipeAdmin() {
  return Promise.all([
    requisitarApi('/usuarios'),
    requisitarApi('/profissionais'),
  ])
}

export function inativarUsuario(id) {
  return requisitarApi(`/usuarios/${id}/desativar`, { metodo: 'PATCH' })
}

export function listarAreasAdmin() {
  return requisitarApi('/especialidades')
}

export function criarArea(dados) {
  return requisitarApi('/especialidades', { metodo: 'POST', dados })
}

export function inativarArea(id) {
  return requisitarApi(`/especialidades/${id}`, { metodo: 'DELETE' })
}

export function buscarPerfilPaciente() {
  return requisitarApi('/pacientes/me')
}

export function atualizarPerfilPaciente(dados) {
  return requisitarApi('/pacientes/me', { metodo: 'PUT', dados })
}
