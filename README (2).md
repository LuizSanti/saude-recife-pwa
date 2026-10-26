# Saúde Sênior — Frontend (PWA)

> Repositório: `saude-recife-pwa` · Projeto Integrador "Saúde na Palma da Mão" (referenciado como "Saúde Recife" no material do professor)

Progressive Web App de **pré-triagem e agendamento de consultas** em clínicas parceiras do Recife, pensado para o **público idoso (60+ anos)**: poucos toques por fluxo, fontes grandes, alto contraste e linguagem clara.

Repositório irmão: `saude-palma-backend` (API REST).

> Este README descreve a branch `main` no commit `9a6c389` (26/10/2026). O build de produção passa e gera manifest e service worker.

---

## Sumário

1. [Estado atual do projeto](#1-estado-atual-do-projeto)
2. [Stack](#2-stack)
3. [Como rodar](#3-como-rodar)
4. [Scripts e variáveis de ambiente](#4-scripts-e-variáveis-de-ambiente)
5. [Estrutura do projeto](#5-estrutura-do-projeto)
6. [Rotas e perfis](#6-rotas-e-perfis)
7. [Autenticação](#7-autenticação)
8. [Dados mockados e contas de teste](#8-dados-mockados-e-contas-de-teste)
9. [Telas e componentes](#9-telas-e-componentes)
10. [Acessibilidade](#10-acessibilidade)
11. [PWA](#11-pwa)
12. [Integração com a API](#12-integração-com-a-api)
13. [Build e deploy](#13-build-e-deploy)
14. [Problemas conhecidos](#14-problemas-conhecidos)
15. [Histórico recente](#15-histórico-recente)
16. [Roadmap](#16-roadmap)
17. [Contribuição](#17-contribuição)
18. [Equipe e entregas](#18-equipe-e-entregas)

---

## 1. Estado atual do projeto

| Área | Situação |
|---|---|
| Splash, Login e Cadastro | Funcionando (com máscaras, validação e mensagens em português) |
| Autenticação com rotas protegidas por perfil | Funcionando (com dados mockados) |
| Home do paciente | Funcionando (dados mockados) |
| Telas de escolha (Especialidade, Exame, Unidade, Profissional) | Telas prontas; **ainda não estão ligadas entre si** |
| Consultas e Perfil (barra de navegação) | Ainda sem tela |
| Área do profissional e do administrador | Placeholders (nome + botão Sair) |
| PWA (manifest, service worker, ícones) | Configurado com `vite-plugin-pwa` (SCRUM-23); build gera `sw.js` com 68 arquivos em cache |
| Build de produção | Passando (import de ícones corrigido em 26/10) |
| Login do administrador | **Com bug**: ver [Problemas conhecidos](#14-problemas-conhecidos) |
| Integração com a API real | Preparada em `authService.js`; desligada por `VITE_USE_MOCK=true` |

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Biblioteca de UI | React 19 |
| Build tool | Vite 8 |
| Rotas | react-router-dom 7 |
| PWA | vite-plugin-pwa (Workbox) |
| Estilos | CSS puro, um arquivo por componente, variáveis CSS em `index.css` |
| Fontes | DM Sans e Open Sans via `@fontsource` (empacotadas no app, sem depender do Google Fonts) |
| Linter | Oxlint |
| Geração de ícones | sharp (script `scripts/gerar-icones.mjs`) |
| Comunicação com a API | REST / JSON com `fetch` |
| Deploy | Vercel |

---

## 3. Como rodar

Pré-requisito: Node.js e npm instalados.

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd saude-recife-pwa

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
```

Com `VITE_USE_MOCK=true` (padrão do `.env.example`) o app funciona sem backend. Use as [contas de teste](#8-dados-mockados-e-contas-de-teste).

### Testando o PWA

O service worker só é gerado no build, então para testar instalação e modo offline:

```bash
npm run build
npm run preview
```

Depois abra o DevTools do navegador em **Application** e confira **Manifest** e **Service Workers**. Marque **Offline** e recarregue para testar o funcionamento sem rede.

---

## 4. Scripts e variáveis de ambiente

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento do Vite |
| `npm run build` | Build de produção em `dist/` (gera também manifest e service worker) |
| `npm run preview` | Serve o build localmente para testar PWA |
| `npm run lint` | Roda o Oxlint |
| `node scripts/gerar-icones.mjs` | Regera os ícones do PWA em `public/` a partir de `src/assets/logoSaudeSenior.svg` |

### Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API backend | `http://localhost:8080` |
| `VITE_USE_MOCK` | `true` usa os dados mockados; qualquer outro valor chama a API | `true` |

O Vite só expõe ao navegador variáveis que começam com `VITE_`. Nunca commite arquivos `.env` reais: use o `.env.example` como referência.

---

## 5. Estrutura do projeto

```
saude-recife-pwa/
├── public/                     # Ícones do PWA (64, 192, 512, maskable, apple-touch) e favicon
├── scripts/
│   └── gerar-icones.mjs        # Gera os ícones PNG com sharp
├── src/
│   ├── main.jsx                # StrictMode > BrowserRouter > AuthProvider > App
│   ├── App.jsx                 # Splash e definição das rotas
│   ├── index.css               # Variáveis (cores, medidas) e estilos globais
│   ├── assets/                 # Logos, fotos e ícones SVG
│   ├── auth/                   # Login e Cadastro (+ CSS)
│   ├── paciente/               # Home e telas de escolha do paciente
│   ├── medico/                 # Área do profissional (placeholder)
│   ├── adm/                    # Área do administrador (placeholder)
│   ├── components/             # Componentes reutilizáveis
│   ├── context/                # AuthContext e AuthProvider
│   ├── hooks/                  # useAuth
│   ├── routes/                 # RotaProtegida e mapa de áreas por perfil
│   ├── services/               # authService e mocks
│   └── utils/                  # formatadores (máscaras) e validações
├── index.html
├── vite.config.js              # React + VitePWA
├── .env.example
├── .oxlintrc.json
├── contributing.md
└── package.json
```

### Organização por responsabilidade

- **Por perfil:** `paciente/`, `medico/`, `adm/` e `auth/`.
- **Por função:** `components/`, `services/`, `utils/`, `context/`, `hooks/` e `routes/`.

---

## 6. Rotas e perfis

O app tem três perfis: `PACIENTE`, `PROFISSIONAL` e `ADMINISTRADOR`. Qualquer rota desconhecida redireciona para `/login`.

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/cadastro` | Cadastro de paciente | Público |
| `/inicio` | Home do paciente | `PACIENTE` |
| `/especialidade` | Escolher especialidade | `PACIENTE` |
| `/exames` | Escolher exame | `PACIENTE` |
| `/unidade` | Escolher unidade | `PACIENTE` |
| `/escolher-profissional` | Escolher profissional | `PACIENTE` |
| `/profissional` | Início do profissional (placeholder) | `PROFISSIONAL` |
| `/admin` | Início do administrador (placeholder) | `ADMINISTRADOR` |

A splash aparece por 3 segundos ao abrir o app (timer fixo em `App.jsx`).

---

## 7. Autenticação

Três peças em `src/context/`, `src/hooks/` e `src/routes/`:

- **`AuthContext`**: apenas o `createContext`.
- **`AuthProvider`**: guarda o estado `usuario` e expõe `entrar` e `sair`. O estado inicial é lido do `localStorage` com inicialização preguiçosa (`useState(() => ...)`), por isso recarregar a página (F5) não desloga. Token e usuário ficam nas chaves `token` e `usuario`.
- **`useAuth`**: atalho para ler o contexto.
- **`RotaProtegida`**: sem usuário, redireciona ao login; com perfil errado, redireciona para a área do próprio perfil (mapa em `routes/areas.js`); caso contrário renderiza `<Outlet />`. Os redirecionamentos usam `replace` para a rota bloqueada não entrar no histórico.

> A rota protegida protege a **tela**, não os dados. A segurança real depende do backend validar o token em cada requisição.

---

## 8. Dados mockados e contas de teste

Com `VITE_USE_MOCK=true`, `authService.js` consulta `src/services/mocks/usuarios.js`, com 500 ms de espera artificial para simular rede.

| Perfil | E-mail | Senha |
|---|---|---|
| Paciente | `paciente@teste.com` | `123456` |
| Profissional | `medico@teste.com` | `123456` |
| Administrador | `admin@teste.com` | `123456` |

Observações:

- No mock, um usuário criado pelo Cadastro fica **apenas em memória** e some ao recarregar a página.
- O token do mock é falso (`'token-falso-' + id`).
- Os cartões de próxima consulta vêm de `src/services/mocks/consultas.js`.
- As listas de especialidades, exames, unidades e profissionais são constantes `*_MOCK` dentro de cada tela `Escolher*`.

---

## 9. Telas e componentes

### Telas de entrada

- **SplashScreen**: logo e nome do app. Aceita `autoAdvanceMs`, `showContinueButton` e `onContinue`; por padrão **não** avança sozinha (WCAG 2.2.1, tempo limite). Respeita `env(safe-area-inset-*)`, `prefers-reduced-motion` e `forced-colors`.
- **Login**: estados `email`, `senha`, `erros` (por campo), `erroGeral` (resposta do servidor) e `carregando`. Fluxo: valida no front, chama `entrar()`, navega para a área do perfil. O `finally` garante que o botão destrava em caso de erro. Usa `noValidate` para exibir mensagens próprias em português.
- **Cadastro**: um único objeto de estado `form` com `atualizar(campo, valor)`. Aplica máscara durante a digitação, valida tudo no envio e envia dados "limpos" (CPF e telefone só com dígitos, data em ISO). Em caso de sucesso vai ao `/login` com `state: { cadastrado: true }`, e o Login mostra "Conta criada!" com `role="status"`.

### Área do paciente

- **Inicio (Home)**: avatar com iniciais, saudação com os dois primeiros nomes, busca, atalhos grandes (Marcar Consulta e Marcar Exame), área de Triagem com IA (apenas visual) e cartão da próxima consulta com renderização condicional.
- **TelaEscolha**: esqueleto das telas de escolha (botão voltar, título, subtítulo, indicador de 3 etapas com `role="progressbar"`, conteúdo e barra de navegação). Renderiza `children` ou, se não houver, uma `ListaOpcoes`.
- **EscolherEspecialidade / EscolherExame / EscolherUnidade**: passam uma lista mock e textos para a `TelaEscolha`.
- **EscolherProfissional**: usa `children` para listar `CartaoProfissional`.

### Componentes compartilhados (`src/components/`)

| Componente | Função |
|---|---|
| `Campo` | Input controlado com rótulo (`htmlFor`), mostrar/ocultar senha com `aria-label` e erro com `role="alert"` e `aria-describedby` |
| `ListaOpcoes` | Busca que ignora acento e maiúscula (`normalize('NFD')`) e lista de botões grandes; mensagem de vazio em `aria-live="polite"` |
| `CartaoProfissional` | Foto (ou iniciais), nome, distância, especialidade, CRM, unidade, endereço e botão "Agendar consulta" |
| `BarraNavegacao` | Menu fixo inferior; itens num array `ITENS`; item atual com `aria-current="page"`; respeita `safe-area-inset-bottom` |
| `SplashScreen` | Tela inicial |
| `icones.jsx` | Ícones SVG como componentes (herdam `currentColor`, `aria-hidden`) |

Os componentes não navegam sozinhos: recebem `aoVoltar`, `aoSelecionar`, `aoNavegar` e `aoAgendar` por props, e quem decide a rota é o `App.jsx`.

### Utilitários (`src/utils/`)

| Arquivo | Funções |
|---|---|
| `formatadores.js` | `somenteDigitos`, `mascaraCpf`, `mascaraTelefone` (10 ou 11 dígitos), `mascaraData`, `dataParaIso` |
| `validacoes.js` | `emailValido`, `cpfValido` (dois dígitos verificadores; recusa sequências repetidas), `dataValida` (existe, não é futura, ano ≥ 1900) |

---

## 10. Acessibilidade

Requisito não funcional crítico do projeto. Decisões já implementadas:

- **Fonte base em porcentagem** (`112.5%`, equivalente a 18px) para respeitar o zoom de fonte configurado no celular.
- **Alvos de toque grandes**: botões com `--altura-botao: 60px`, barra de navegação com 67px e itens de lista com 64px.
- **Foco visível** com `:focus-visible` e contorno grosso.
- **`100dvh`** no lugar de `100vh`, para lidar com a barra do navegador no celular.
- **`viewport-fit=cover`** e `env(safe-area-inset-*)` para notch e barra de gestos.
- **Teclado certo no celular**: `inputMode="numeric"`, `type="email"`, `type="tel"` e `autoComplete` apropriado (`email`, `current-password`, `new-password`, `bday`, `tel`).
- **Leitores de tela**: erros com `role="alert"`, estados com `role="status"`, `aria-live`, `aria-current` e ícones decorativos com `aria-hidden`.
- **Preferências do sistema**: `prefers-reduced-motion` e `forced-colors`.
- **Idioma** `pt-BR` no `index.html`.

---

## 11. PWA

Configurado em `vite.config.js` com `vite-plugin-pwa`:

- **Registro:** `registerType: 'autoUpdate'` (o service worker atualiza sozinho).
- **Manifest:** nome e nome curto "Saúde Sênior", `lang: pt-BR`, `display: standalone`, `start_url` e `scope` em `/`, `theme_color: #00985d`, `background_color: #ffffff`.
- **Ícones:** 64, 192 e 512 px, mais um ícone `maskable` de 512 px e `apple-touch-icon` de 180 px, todos em `public/` (gerados por `scripts/gerar-icones.mjs`).
- **Cache (Workbox):** pré-cache de `js, css, html, svg, png, woff, woff2` e `navigateFallback` para `/index.html`.

O build gera `manifest.webmanifest`, `sw.js` e `registerSW.js`. Depois da primeira visita, o app abre sem rede.

**O que ainda não existe:** cache de respostas da API, tratamento offline específico das telas e notificações push.

> Em `npm run dev` o service worker não é ativado. Para testar o PWA use `npm run build && npm run preview`. Durante os testes, se a tela mostrar uma versão antiga, limpe o service worker em Application > Service Workers.

---

## 12. Integração com a API

Com `VITE_USE_MOCK` diferente de `true`, `src/services/authService.js` usa `VITE_API_URL`:

| Função | Requisição | Corpo | Resposta esperada |
|---|---|---|---|
| `login(email, senha)` | `POST {VITE_API_URL}/auth/login` | `{ email, senha }` | `{ token, usuario: { id, nome, email, tipoUsuario } }` |
| `cadastrar(dados)` | `POST {VITE_API_URL}/auth/cadastro` | dados do formulário (CPF e telefone só com dígitos, data em ISO) | `{ id }` |

`tipoUsuario` deve ser `PACIENTE`, `PROFISSIONAL` ou `ADMINISTRADOR`. Alinhe o formato com o time de backend; as telas não mudam quando o backend ficar pronto, só o `authService`.

Para trocar os mocks das telas de escolha pela API: criar services com `fetch` (como o `authService`) e carregar as listas em um `useEffect` com estados de carregamento e erro.

---

## 13. Build e deploy

```bash
npm run build     # gera dist/
npm run preview   # serve dist/ localmente
```

Ambiente de deploy: **Vercel**. A aplicação deve estar publicada e acessível para demonstração da 1ª entrega (14/10/2026).

Como o app usa `BrowserRouter`, verifique se abrir uma rota diretamente (por exemplo `/inicio`) funciona no deploy. O projeto ainda não tem `vercel.json`; se necessário, adicione um com rewrite das rotas para `/index.html`.

---

## 14. Problemas conhecidos

Itens conferidos no código da `main` (commit `9a6c389`):

| # | Problema | Onde | Correção |
|---|---|---|---|
| 1 | **Login do administrador não redireciona:** `AREA_POR_PERFIL` tem a chave `ADMIN`, mas o perfil é `ADMINISTRADOR` em `App.jsx` (`RotaProtegida`) e em `mocks/usuarios.js`; `AREA_POR_PERFIL['ADMINISTRADOR']` é `undefined` | `routes/areas.js`, `App.jsx`, `services/mocks/usuarios.js` | Padronizar o nome. Se o backend devolve `ADMIN`, trocar para `ADMIN` no `App.jsx` e no mock; se devolve `ADMINISTRADOR`, voltar `areas.js` para `ADMINISTRADOR` |
| 2 | `aria-labelledby="splashTitle"` não bate com o `id` do título (`splashTitulo`) | `components/SplashScreen.jsx` | Usar o mesmo id nos dois |
| 3 | `JSON.parse` sem `try/catch`: localStorage corrompido quebra o app ao abrir | `context/AuthProvider.jsx` | Envolver em `try/catch` e limpar o storage se falhar |
| 4 | `@fontsource/open-sans/700.css` importado duas vezes | `main.jsx` | Remover a repetição |
| 5 | Fluxo de agendamento não ligado: `aoSelecionar` e `aoNavegar` são `console.log` e `aoVoltar` usa `window.history.back()` | `App.jsx` | Ligar as etapas (especialidade, unidade, profissional) |
| 6 | CSS sem uso (`.escolher-especialidade*`) | `index.css` | Apagar |
| 7 | Fonte em `px` em alguns CSS de formulário, o que ignora o tamanho de fonte do aparelho | `Campo.css`, `Login.css`, `Cadastro.css` | Trocar por `rem` |
| 8 | Validação de e-mail duplicada (regex própria no Login, `emailValido` no Cadastro) | `auth/` | Usar `emailValido` nos dois |
| 9 | Sem "esqueci minha senha" e sem confirmação de senha no cadastro | `auth/` | Implementar |
| 10 | Token no `localStorage` é vulnerável a XSS; não há verificação de token expirado | `context/AuthProvider.jsx` | Com a API real, preferir cookie `httpOnly` e tratar expiração |
| 11 | A tela de profissional mostra sempre os mesmos 2 profissionais mock, sem filtrar pelo que foi escolhido antes | `paciente/EscolherProfissional.jsx` | Filtrar pelas escolhas |
| 12 | Não há `vercel.json`: abrir uma rota direto (por exemplo `/inicio`) pode retornar 404 no deploy antes do service worker assumir | raiz do projeto | Verificar no deploy e, se necessário, adicionar rewrite das rotas para `/index.html` |

### Já resolvido

- **Build quebrava no Linux** por causa do import `../components/Icones` (o arquivo é `icones.jsx`). Corrigido em 26/10 (commit `a8c214f`).
- **PWA ausente** (sem manifest, service worker e ícones) e `index.html` com `lang="en"`. Resolvido pelo SCRUM-23 (24/10).

---

## 15. Histórico recente

| Data | Mudança |
|---|---|
| 07/10 | SCRUM-20: telas de escolha (especialidade, exame, unidade, profissional) e componentes `TelaEscolha` e `CartaoProfissional` |
| 16/10 | SCRUM-21: tela inicial do paciente com layout responsivo |
| 24/10 | SCRUM-23: PWA com manifest, service worker e ícones |
| 24/10 | Ajuste da chave de perfil admin em `areas.js` (deixou o login do admin com bug, ver problema 1) |
| 26/10 | Correção do import de ícones; build passa |

---

## 16. Roadmap

- [ ] Corrigir o login do administrador (item 1 de [Problemas conhecidos](#14-problemas-conhecidos)).
- [ ] Ligar o fluxo de agendamento (especialidade, unidade, profissional, confirmação).
- [ ] Telas **Consultas** (meus agendamentos) e **Perfil** da barra de navegação.
- [ ] Disponibilidade e confirmação de agendamento.
- [ ] Área do profissional (minha disponibilidade) e painel do administrador (clínicas, profissionais, especialidades e usuários).
- [ ] Integração com a API real, substituindo os mocks.
- [ ] Cache offline de dados e notificações push.
- [ ] Busca real na Home e Triagem com IA.
- [ ] 2ª entrega: versão React Native e IA.

---

## 17. Contribuição

Leia o [`contributing.md`](./contributing.md) antes de abrir um Pull Request. Resumo:

- Tenha uma tarefa correspondente no Jira e atualize a `develop` antes de criar sua branch.
- Nunca trabalhe direto na `main`.
- Branches no padrão `tipo/SCRUM-XX-descricao-curta` (`feature/`, `fix/`, `refactor/`, `docs/`, `test/`, `chore/`), com PR para `develop`.
- Commits em português, no imperativo, e pequenos. Referencie o ticket quando fizer sentido.
- Todo PR precisa de pelo menos 1 aprovação. Descreva o que foi feito, o ticket e como testar.
- Antes do PR: o código builda sem erros, não há credenciais commitadas e `.env` não está incluído.
- Sem `force push` na `main` ou em branches compartilhadas, e sem merge com build quebrado.

---

## 18. Equipe e entregas

| Área | Responsáveis |
|---|---|
| Front-end | Vinicius, Allany |
| UX/UI | Victoria |
| Gestão do projeto | Luiz Gabriel |

| Entrega | Data | Escopo |
|---|---|---|
| 1ª | 14/10/2026 | MVP Web (PWA) + Backend + Banco de Dados |
| 2ª | 09/12/2026 | React Native + Backend + Banco de Dados + IA |
