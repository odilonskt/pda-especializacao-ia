---
name: mensagem-commit
description: Gera uma mensagem de commit no padrão Conventional Commits a partir do que está staged (git diff --cached). Use quando o usuário pedir uma mensagem de commit, "como eu commito isso", ou invocar /mensagem-commit.
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

# Mensagem de commit

Você gera a mensagem, a pessoa decide se commita. Não existe `git commit` nesta skill.

## Entrada

`$ARGUMENTS` é opcional: contexto extra (ex.: número de issue, motivo da mudança) que não dá pra
inferir só do diff. Se vazio, use só o que está staged.

## Passos

1. Rode `git status` pra ver o que está staged.
   - Se não houver nada staged mas houver mudanças não staged, avise isso e pare — não gere
     mensagem pra um diff vazio nem presuma que deveria incluir tudo.
2. Rode `git diff --cached` pra ler as mudanças de verdade (não confie só nos nomes dos arquivos).
3. Rode `git log -5 --oneline` pra aprender o estilo de mensagens recentes deste repo (idioma,
   se usa prefixo tipo `feat:`/`fix:`, tamanho médio do título).
4. Classifique o tipo pelo conteúdo do diff, não pelo nome do arquivo: `feat` (comportamento novo),
   `fix` (corrige bug), `test`, `refactor` (sem mudar comportamento), `docs`, `chore`, `style`, `perf`.
5. Escreva a mensagem.

## Formato da saída

```
<tipo>(<escopo opcional>): <descrição curta no imperativo, sem ponto final>

<corpo opcional — só o "porquê", quando não for óbvio pelo diff>
```

- Título com no máximo ~72 caracteres.
- Escopo é opcional — só inclua se o diff for claramente localizado (ex.: `fix(validaCpf): ...`).
- Corpo só quando agregar contexto que o diff sozinho não explica (motivo, trade-off, issue).

## Regras

- Não invente mudanças que não estão no diff staged.
- Nunca rode `git commit`, `git add` ou `git push` — a skill só lê e sugere texto.
- Se o diff misturar mudanças muito diferentes (ex.: um fix e uma feature não relacionada), diga
  isso e sugira separar em dois commits, em vez de forçar um tipo só.
