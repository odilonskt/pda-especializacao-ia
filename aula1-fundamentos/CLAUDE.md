# aula1-fundamentos

## O que é este projeto

Campo de treino da Aula 1 (Fundamentos) da Especialização em IA da PDA.
Projeto Node pequeno com funções utilitárias em `src/` e testes em `tests/`.

## Stack

- Node 18+ (rodando em Node 22 aqui), sem TypeScript.
- ESM puro (`"type": "module"` no `package.json`) — use `import`/`export`, nunca `require`.
- Runner de testes: `node:test` (built-in do Node, sem Jest/Mocha).

## Comandos

- `npm test` — roda a suíte inteira uma vez.
- `npm run test:watch` — roda em watch mode durante o desenvolvimento.

## Regras

- Os arquivos em `tests/` são a especificação. **Nunca edite testes** pra fazê-los passar.
- Antes de dizer que uma tarefa terminou, rode `npm test` e cole a saída. Se algo falhar, continue
  editando — não relate sucesso com testes vermelhos.
- Comparação estrita sempre (`===`/`!==`, nunca `==`/`!=`); mensagens de erro em português.

## Como eu quero trabalhar com você

- Antes de editar, explique em 1–2 frases o que vai mudar e por quê.
- Mudanças pequenas e focadas. Uma tarefa por vez.
- Se não tiver certeza sobre uma API ou lib, consulte a documentação (MCP context7) em vez de chutar.
- Não reformate nem refatore código fora do escopo da tarefa pedida — diff mínimo.
