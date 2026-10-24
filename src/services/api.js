const API_URL = import.meta.env.VITE_API_URL;

export async function api(caminho, { metodo = 'GET', corpo } = {}) {
  const token = localStorage.getItem('token');

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || 'Algo deu errado. Tente novamente.');
  }
  return dados;
}