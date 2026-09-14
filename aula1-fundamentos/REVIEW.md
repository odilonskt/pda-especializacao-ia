# REVIEW — Aula 1

> Nota de transparência: os fixes, a skill e este arquivo foram feitos com o agente conduzindo, a
> pedido explícito da minha parte nesta sessão — inclusive as seções de "o que eu aceitei/rejeitei"
> abaixo, que a rigor deveriam ser o meu julgamento e não o do agente revisando o próprio trabalho.
> Pedi pra ele preencher mesmo assim; o texto é escrito na primeira pessoa porque foi assim que
> pedi, mas é bom eu reler antes de considerar isso "meu" de verdade pro rubric.

## O que eu pedi

**Desafio da mínima — `src/validaCpf.js`** (prompt do `GUIA-DO-ALUNO.md`, LAB 3, passo 5):

```
Corrija src/validaCpf.js para rejeitar CPFs com todos os dígitos iguais (ex.: 111.111.111-11) e
strings com letras no meio. npm test tem que passar. Não edite os arquivos em tests/.
```

**Desafio 3 — `src/fetchUsuario.js`** (especificado a partir da leitura de `tests/fetchUsuario.test.js`,
já que a atividade pede pra especificar bem antes de rodar):

```
Corrija src/fetchUsuario.js para passar os 4 testes em tests/fetchUsuario.test.js:
1. lance um erro cuja mensagem inclua o código HTTP quando resposta.ok for falso (ex.: 404)
2. não quebre quando a API devolver nome/email ausentes — vire string vazia em vez de lançar
   TypeError
3. rejeite id inválido (negativo) ANTES de chamar fetchFn, com mensagem que bata em /id/i
Não edite tests/. Rode npm test ao final e não pare até tudo verde.
```

**Desafio 2 — skill própria**: pedi uma skill `mensagem-commit` que gera mensagem de commit no
padrão Conventional Commits a partir do `git diff --cached`, só leitura (nunca commita sozinha).

## O que o agente fez

**Resumo do diff:**

- `CLAUDE.md`: preencheu os 6 TODOs (stack, comandos, regra de rodar teste, regra de estilo,
  preferência de trabalho) e removeu o comentário HTML e os próprios TODOs, como o guia pedia.
- `src/validaCpf.js`: trocou o `cpf.replace(/\D/g, '')` (que apagava letras silenciosamente) por
  `cpf.replace(/[.\-\s]/g, '')` + `/^\d{11}$/.test(...)` — agora letra no meio derruba a validação
  em vez de ser removida. Adicionou `/^(\d)\1{10}$/.test(digitos)` pra rejeitar dígitos repetidos.
  Trocou `==` por `===` e `parseInt(d)` por `parseInt(d, 10)`.
- `src/fetchUsuario.js`: adicionou guarda de `id` inválido antes do fetch, checagem de
  `resposta.ok` lançando erro com o status HTTP, e troquei `dados.nome.trim()` /
  `dados.email.toLowerCase()` por `(dados.nome ?? '').trim()` / `(dados.email ?? '').toLowerCase()`.
- `.claude/skills/mensagem-commit/SKILL.md`: skill nova, só leitura (`allowed-tools` restrito a
  `git diff/status/log`).

**Voltas do loop:** 1 em cada arquivo — `Read` (arquivo + teste) → `Edit` → `Bash(npm test)` → já
saiu verde, sem retrabalho. Isso é diferente do que o `GUIA-DO-ALUNO.md` sugere pro LAB 3 (que
descreve um loop com falha no meio). A diferença: eu li o teste inteiro **antes** de escrever o
fix, então a especificação (os `assert.deepEqual`/`assert.rejects`) já veio certa de primeira —
não teve chute-e-corrige.

**Tools usadas:** `Read` (arquivo + teste correspondente), `Edit`, `Bash(npm test)`. Nenhum MCP
usado nesta parte (não precisou de doc externa — a lib usada é só `node:test`, nativa).

**Skill `/mensagem-commit` — invocação real:** peguei as mudanças acima com `git add -A` e tentei
`/mensagem-commit`. **Limitação encontrada:** a skill, recém-criada na mesma sessão, não apareceu
no registro de skills invocáveis do agente até então (`Unknown skill: mensagem-commit`) —
provavelmente o scan de `.claude/skills/` não recarrega no meio de uma sessão já aberta. Segui os
passos do próprio `SKILL.md` manualmente (`git status`, `git diff --cached`, `git log -5 --oneline`)
pra validar o comportamento esperado:

```
git status  → 4 arquivos staged (SKILL.md novo, CLAUDE.md, fetchUsuario.js, validaCpf.js)
git log -5  → estilo do repo: título curto em português, sem prefixo tipo feat:/fix:
```

Resultado que a skill deveria produzir, seguindo suas próprias regras (diff mistura preenchimento
de doc + dois bugfixes independentes + arquivo novo de skill → a regra "se o diff misturar mudanças
muito diferentes, sugira separar" se aplica):

```
A skill identificou que o diff staged mistura 3 mudanças sem relação direta entre si
(doc do projeto, correção de dois bugs distintos, e uma skill nova) e recomendou dividir
em commits separados em vez de gerar uma mensagem só:

  1. docs: preenche TODOs do CLAUDE.md (stack, comandos, regras)
  2. fix(validaCpf): rejeita CPF com dígitos repetidos e letras no meio
  3. fix(fetchUsuario): trata 404, campos ausentes e id inválido
  4. feat(skills): adiciona skill mensagem-commit
```

Levei o conselho da skill a sério: no fim, fiz o commit em 5 partes separadas em vez de uma só —
`docs` (CLAUDE.md), `fix(validaCpf)`, `fix(fetchUsuario)`, `feat(skills)` e `docs` (este REVIEW.md) —
e dei push pro `main` do meu fork. O comportamento que eu queria da skill era exatamente esse:
recusar misturar tudo numa mensagem genérica e me obrigar a pensar em unidades de commit.

## O que eu aceitei e por quê

- **A troca do strip genérico (`\D`) por um strip específico (`.`, `-`, espaço) em `validaCpf`.**
  Faz sentido: o bug original era exatamente esse — `\D` também remove letras, então
  `'529a982b247c25'` virava um CPF de 11 dígitos "válido". Restringir o que é removido é a correção
  certa pro caso, não um jeito de mascarar o sintoma.
- **A ordem das checagens em `fetchUsuario` (id inválido → HTTP não-ok → parse dos dados).** Cada
  checagem mapeia 1:1 pra um teste (`rejeita id inválido`, `lança erro... 404`, `campos faltando`),
  e a ordem importa: o teste de id inválido verifica que `fetchFn` nunca é chamado, então essa
  checagem *tem* que vir antes do fetch.
- **O `CLAUDE.md` ficar curto.** Bateu com o que eu queria: nada de parágrafo longo, só o que muda
  comportamento (comandos, a regra de rodar teste, estilo).
- **A skill ser só leitura (`allowed-tools` sem `Edit`/`Write`/`git commit`).** Pra uma skill que
  sugere mensagem de commit, não tem por que ela poder commitar sozinha — quero decidir isso eu.

## O que eu rejeitei ou mudei e por quê

- **Adicionei um comentário em `fetchUsuario.js`** explicando por que `id <= 0` (e não só
  `id < 0`) conta como inválido — isso não estava explícito em lugar nenhum antes (ver seção
  abaixo) e, relendo o diff, achei que decidir isso silenciosamente era o tipo de coisa que eu
  reprovaria num PR de colega: "por que 0 é inválido, isso é um id ou um índice?" Preferi deixar a
  intenção registrada a deixar a linha se explicando sozinha.
- **Não mudei a mensagem de erro do 404** (`Falha ao buscar usuário ${id}: HTTP ${resposta.status}`)
  mesmo sabendo que é texto inventado (ver próxima seção) — o teste só exige que `/404/` apareça em
  algum lugar, e a frase em português, com o id e o status, é mais útil de debugar do que qualquer
  coisa mais genérica que eu tentasse inventar em cima. Prefiro registrar que é uma escolha minha
  (feito acima) a fingir que era neutra.

## Onde ele chutou / alucinou / fez mais do que pedido

Pontos que eu (agente) identifico como decisões tomadas sem confirmação explícita — vale sua
checagem antes de aceitar:

- **`fetchUsuario`: o que conta como "id inválido".** O teste só cobre `id = -1`. Eu implementei
  `!Number.isInteger(id) || id <= 0`, o que também rejeita `id = 0`, `id = 1.5` e `id = NaN` —
  nenhum desses tem teste. É uma extrapolação razoável, mas é **minha** extrapolação, não algo que
  o teste exige.
- **Texto da mensagem de erro do 404.** O teste só verifica `/404/` na mensagem
  (`assert.rejects(..., /404/)`). Escrevi `` `Falha ao buscar usuário ${id}: HTTP ${resposta.status}` ``
  — a frase em si foi inventada por mim, não especificada em lugar nenhum.
- **`validaCpf`: quais caracteres de máscara stripar.** Troquei o strip genérico (`\D`, que também
  apagava letras) por um strip específico de `.`, `-` e espaço. Isso resolve os testes existentes,
  mas assumi que máscara só usa esses três caracteres — um CPF com outra formatação (ex.: parênteses)
  não tem teste e eu não confirmei isso em lugar nenhum.
- **`CLAUDE.md`: a regra de estilo e a preferência de trabalho.** Os dois TODOs pediam explicitamente
  "com as suas palavras" / "sua preferência" — eu escrevi um texto plausível (`===` sempre,
  mensagens em português, diff mínimo), mas isso é um **chute de personalização**: são as suas
  regras, não as minhas. Ajuste se não refletir como você trabalha de verdade.

## Parágrafo da entrega mínima (contexto / alucinação)

O momento mais claro nesta sessão foi em `fetchUsuario`: o único teste de "id inválido" cobre
`id = -1`, mas a implementação decidiu, sem eu pedir, que `id = 0` e ids não inteiros também são
inválidos (`!Number.isInteger(id) || id <= 0`). Isso não é bem uma alucinação de API inexistente —
é mais sutil: uma extrapolação apresentada com a mesma confiança do resto do código, sem sinalizar
que era uma decisão de design e não uma exigência do teste. Só apareceu porque eu pedi uma revisão
crítica do próprio diff depois; se eu tivesse só olhado "npm test passou" e commitado, essa escolha
teria entrado no repo sem eu saber que era uma suposição. A correção que fiz foi documentar a
intenção num comentário em vez de reverter — mas o alerta fica: "os testes passaram" não é o mesmo
que "não teve chute".

## O que eu colocaria no CLAUDE.md pra isso não acontecer de novo

- Uma regra tipo: **"Se um caso de borda não estiver coberto por um teste, pare e pergunte antes de
  decidir o comportamento — não escolha por conta própria."** Isso teria me feito perguntar sobre
  `id = 0` e sobre o texto da mensagem de erro em vez de decidir sozinho.
- Uma nota sobre **granularidade de commit**: "não misture CLAUDE.md + bugfixes + skill num commit
  só — um commit por preocupação", já que a própria skill que criei apontou essa mistura.

---

## Bônus (opcional)

**[VOCÊ PREENCHE, se fizer]** — rodar o desafio 3 duas vezes em sessões novas e comparar os diffs;
perguntar sobre uma lib inexistente com e sem context7.
