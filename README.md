# Saúde na Palma da Mão — Frontend (PWA)

> Nome do repositório: `saude-recife-pwa`

Progressive Web App do Projeto Integrador "Saúde na Palma da Mão" (também referenciado como "Saúde Recife" no material do professor), voltado à pré-triagem e agendamento de consultas, com foco inicial no público idoso (60+ anos).

## Sobre o projeto

Interface web responsiva (PWA) para cadastro, consulta de clínicas/profissionais/especialidades, consulta de disponibilidade e agendamento de consultas. Consome a API REST do repositório de backend.

Repositório irmão: `saude-palma-backend` (API).

⚠️ **Requisito não funcional crítico:** a interface deve priorizar acessibilidade para usuários idosos — fontes grandes, alto contraste, navegação simplificada, linguagem clara e poucos passos por fluxo. Ver documento de Análise de Sistemas, seção 0 e 1.6, para os requisitos completos.

## Stack

- **Biblioteca:** React
- **Build tool:** Vite
- **Linter:** Oxlint
- **Tipo de aplicação:** PWA (Progressive Web App)
- **Comunicação com API:** REST / JSON
- **Deploy:** Vercel

## Estrutura do projeto

```
src/
├── pages/ (ou screens/)   # Telas: login, cadastro, agendamento, etc.
├── components/            # Elementos reutilizáveis (botões, cards, formulários)
├── services/              # Chamadas centralizadas à API (ex: axios/fetch)
├── hooks/                 # Hooks customizados, se necessário
├── styles/                # Estilos globais
public/
├── manifest.json          # Configuração da PWA
└── service-worker.js      # Cache/funcionamento offline básico
```

## Telas principais (visão geral)

| Perfil | Telas |
|---|---|
| Paciente | Login/Cadastro, Home, Buscar clínicas/profissionais/especialidades, Disponibilidade, Confirmar agendamento, Meus agendamentos, Perfil |
| Profissional | Login, Minha disponibilidade |
| Administrador | Login, Painel administrativo, Gerenciar clínicas/profissionais/especialidades/usuários |

## Como rodar localmente

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd saude-recife-pwa

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite com a URL da API local

# Rodar em modo desenvolvimento (Vite)
npm run dev
```

## Lint

```bash
npm run lint
```

Este projeto usa **Oxlint**. Para type-checking mais rigoroso (recomendado à medida que o projeto cresce), considerar adotar TypeScript — ver [template oficial Vite + React + TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).

## Variáveis de configuração necessárias

| Variável | Descrição |
|---|---|
| `VITE_API_URL` (ou equivalente) | URL base da API backend (ex: `http://localhost:8080`) |

Nunca commitar arquivos `.env` reais — usar `.env.example` como referência.

## Desenvolvimento em paralelo ao backend

Enquanto endpoints da API ainda não estiverem prontos, usar dados mockados (JSON local ou ferramenta como `json-server`/MSW) — importante alinhar o formato desses dados com o time de backend para bater com o retorno real da API quando disponível.

## Build para produção

```bash
npm run build
```

Vite gera a build otimizada em `dist/`. Para pré-visualizar localmente:

```bash
npm run preview
```

## Deploy

Ambiente de deploy: **Vercel**. A aplicação deve estar publicada em ambiente acessível para demonstração da 1ª entrega (14/10/2026).

## Fluxo de contribuição

Antes de abrir um Pull Request, leia o [`CONTRIBUTING.md`](./CONTRIBUTING.md) — cobre padrão de branches, commits, revisão de PRs e cuidados obrigatórios antes de mergear.

## Equipe

| Área | Responsáveis |
|---|---|
| Front-end | Vinicius, Allany |
| UX/UI | Victoria |
| Gestão do projeto | Luiz Gabriel |

## Entregas

| Entrega | Data | Escopo |
|---|---|---|
| 1ª | 14/10/2026 | MVP Web (PWA) + Backend + Banco de Dados |
| 2ª | 09/12/2026 | React Native + Backend + Banco de Dados + IA |