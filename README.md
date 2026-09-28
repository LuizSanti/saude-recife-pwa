## 📁 Estrutura do Projeto

```
saudeNaPalmaDaMao/
│
├── 📄 index.html                    # Tela de splash e seleção de perfil
├── 📄 login.html                    # Autenticação unificada
├── 📄 cadastro.html                 # Criação de conta
│
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── variables.css            # Variáveis globais (WCAG - Acessibilidade)
│   │   ├── global.css               # Estilos base e utilitários
│   │   └── components.css           # Componentes reutilizáveis
│   ├── 🔧 js/
│   │   └── main.js                  # Controle de rotas e interações
│   └── 🖼️  img/                     # Ícones e ilustrações
│
├── 📁 paciente/                     👤 FLUXO DO PACIENTE
│   ├── 📄 dashboardPaciente.html    # Início: marcar consulta/exame
│   ├── 📄 especialidadeMedica.html  # Seleção de especialidade
│   ├── 📄 tiposExame.html           # Seleção de tipo de exame
│   ├── 📄 unidadeAtendimento.html   # Seleção de unidade
│   ├── 📄 escolherProfissional.html # Seleção de profissional
│   ├── 📄 dataHorario.html          # Seleção de data e horário
│   ├── 📄 confirmacaoAgendamento.html # Confirmação de sucesso
│   ├── 📄 minhasConsultas.html      # Histórico de consultas
│   ├── 📄 triagemIa.html            # Chat/voz com assistente
│   ├── 📄 perfilPaciente.html       # Dados e configurações
│   └── 📄 centralNotificacoes.html  # Avisos e lembretes
│
├── 📁 medico/                       🩺 FLUXO MÉDICO
│   ├── 📄 dashboardMedico.html      # Agenda do dia
│   ├── 📄 prontuarioAtendimento.html # Prontuário eletrônico
│   ├── 📄 historicoPaciente.html    # Histórico médico
│   └── 📄 perfilMedico.html         # Configurações do médico
│
└── 📁 adm/                          ⚙️ FLUXO ADMINISTRATIVO
    ├── 📄 dashboardAdm.html         # Visão geral e métricas
    ├── 📄 gestaoUnidades.html       # Gestão de unidades
    ├── 📄 gestaoProfissionais.html  # Gestão de equipes
    └── 📄 relatoriosUso.html        # Relatórios de triagens
```

---