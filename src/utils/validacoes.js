import { somenteDigitos } from './formatadores'

export function emailValido(email) {
  return /\S+@\S+\.\S+/.test(email)
}

export function cpfValido(cpf) {
  const d = somenteDigitos(cpf)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false

  const calcular = (base) => {
    let soma = 0
    for (let i = 0; i < base; i++) {
      soma += Number(d[i]) * (base + 1 - i)
    }
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  return calcular(9) === Number(d[9]) && calcular(10) === Number(d[10])
}

export function dataValida(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto)
  if (!m) return false

  const dia = Number(m[1])
  const mes = Number(m[2])
  const ano = Number(m[3])
  const data = new Date(ano, mes - 1, dia)

  const existe =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia

  return existe && data <= new Date() && ano >= 1900
}