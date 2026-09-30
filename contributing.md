# Guia de Contribuição — Projeto Saúde na Palma da Mão

Este documento define como trabalhamos neste repositório. O objetivo é evitar conflitos, perda de código e retrabalho — não é burocracia por burocracia.

## 1. Antes de começar a codar

- Confirme que existe uma tarefa correspondente no Jira. Não crie funcionalidades que não estejam no backlog sem antes alinhar com o responsável pela organização do projeto — isso evita trabalho fora de escopo ou duplicado.
- Puxe a branch `develop` atualizada antes de criar sua branch.
- Nunca trabalhe direto na `main`. Sem exceções, mesmo para "correções pequenas".

## 2. Nomeação de branches

Sempre referencie o ID da tarefa do Jira — isso conecta automaticamente commits e Pull Requests ao ticket correspondente.

Padrão: `tipo/SCRUM-XX-descricao-curta`

Exemplos:
- `feature/SCRUM-13-cadastro-clinica`
- `fix/SCRUM-17-erro-validacao-agendamento`
- `docs/SCRUM-9-diagramas-uml`

Tipos permitidos:
| Prefixo | Quando usar |
|---|---|
| `feature/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `refactor/` | Melhoria de código sem mudar comportamento |
| `docs/` | Documentação |
| `test/` | Testes |
| `chore/` | Configuração, dependências, tarefas de manutenção |

## 3. Commits

- Mensagens em português, no imperativo, descrevendo o que o commit faz: `Adiciona validação de CPF no cadastro de paciente`, não `mudanças` ou `ajustes`.
- Prefira commits pequenos e frequentes a um commit gigante no fim do dia — facilita reverter algo específico se der problema.
- Referencie o ticket quando fizer sentido: `SCRUM-13: adiciona endpoint de cadastro de clínica`.

## 4. Pull Requests

- **Nunca faça merge direto na `main` sem revisão**, mesmo que você tenha permissão técnica para isso.
- Todo PR precisa de **pelo menos 1 aprovação** de outra pessoa da equipe antes do merge.
- Descreva no PR: o que foi feito, qual ticket do Jira resolve, e como testar (se aplicável).
- Se o PR ainda não está pronto para revisão, marque como *draft*.
- PRs muito grandes (muitos arquivos, muitas funcionalidades misturadas) devem ser quebrados em partes menores sempre que possível — são mais difíceis de revisar e mais arriscados de mergear.

## 5. Antes de abrir o PR, confirme

- [ ] O código builda/roda sem erros localmente
- [ ] Não há credenciais, senhas ou chaves de API commitadas
- [ ] Arquivos de configuração local (`.env`, `application-local.properties`, etc.) **não** estão inclusos — confira o `.gitignore`
- [ ] O que foi implementado bate com o que a tarefa do Jira pede

## 6. Conflitos e sincronização

- Atualize sua branch com a `main` regularmente (`git pull` ou `rebase`) para evitar conflitos grandes no fim.
- Se um conflito aparecer, resolva com calma e, em caso de dúvida sobre qual versão do código está correta, converse com quem escreveu o outro trecho antes de decidir sozinho.

## 7. O que nunca fazer

- Não dar `force push` na `main` ou em branches compartilhadas.
- Não commitar arquivos de build, dependências (`node_modules/`, `target/`) ou arquivos de IDE — devem estar no `.gitignore`.
- Não deixar código comentado "por precaução" — se não está sendo usado, remova (o histórico do Git já guarda isso).
- Não mergear um PR com testes falhando ou build quebrado, mesmo sob pressão de prazo.
- Não trabalhar em uma funcionalidade que já está sendo feita por outra pessoa sem alinhar antes — verifique o Jira e o board antes de começar algo.

## 8. Dúvidas

Se não tiver certeza sobre padrão de código, estrutura de pastas ou qualquer decisão técnica, pergunte antes de implementar do seu jeito. É mais barato alinhar 5 minutos antes do que refazer depois.