// Gerado por IA. Colado sem ler. (ATIVIDADE — desafio 3)
//
// Busca um usuário por id numa API e devolve { id, nome, email }.
// A função recebe um `fetchFn` pra facilitar teste (injeção de dependência).

export async function fetchUsuario(id, fetchFn = fetch) {
  // O teste só cobre id negativo, mas id=0 também não é um id de usuário válido.
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`id inválido: ${id}`);
  }

  const resposta = await fetchFn(`https://api.exemplo.com/usuarios/${id}`);
  if (!resposta.ok) {
    throw new Error(`Falha ao buscar usuário ${id}: HTTP ${resposta.status}`);
  }
  const dados = await resposta.json();

  return {
    id: dados.id,
    nome: (dados.nome ?? '').trim(),
    email: (dados.email ?? '').toLowerCase(),
  };
}
