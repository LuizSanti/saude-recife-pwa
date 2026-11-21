const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '') ||
  (import.meta.env.DEV ? '/api' : '')

export async function requisitarApi(caminho, { metodo = 'GET', dados } = {}) {
  if (!API_URL) {
    throw new Error(
      'API não configurada. Defina VITE_API_URL no arquivo .env.'
    )
  }

  const cabecalhos = { Accept: 'application/json' }
  const token = localStorage.getItem('token')
  if (token && !token.startsWith('token-falso-')) {
    cabecalhos.Authorization = `Bearer ${token}`
  }
  if (dados !== undefined) {
    cabecalhos['Content-Type'] = 'application/json'
  }

  let resposta
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: dados === undefined ? undefined : JSON.stringify(dados),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o back-end está ativo.'
    )
  }

  const texto = await resposta.text()
  let corpo = null
  if (texto) {
    try {
      corpo = JSON.parse(texto)
    } catch {
      corpo = { message: texto }
    }
  }

  if (!resposta.ok) {
    throw new Error(
      corpo?.detail ||
        corpo?.message ||
        corpo?.mensagem ||
        corpo?.erro ||
        `A API respondeu com erro HTTP ${resposta.status}.`
    )
  }

  return corpo
}
