# Discord Selfbot Bot 🤖

Bot Discord completo para gerenciamento de selfbots com componentes V2 (buttons, selects, modals) e embeds bonitos.

## 🚀 Funcionalidades

- **Token Management** (`/token`)
  - Registrar novos tokens Discord
  - Validar tokens automaticamente
  - Listar todos os tokens registrados
  - Remover tokens

- **Limpeza** (`/limpar`)
  - Limpar mensagens de servidores
  - Limpar mensagens de DMs
  - Remover amigos

- **Call** (`/call`)
  - Entrar em canais de voz
  - Sair de canais de voz

- **Progresso** (`/progresso`)
  - Acompanhar operações em tempo real
  - Ver histórico de operações
  - Barra de progresso visual

## 📋 Requisitos

- Node.js 16.9.0 ou superior
- Token de Bot Discord
- Client ID do Bot

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd discord-selfbot-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com seus dados:
```env
TOKEN=seu_token_do_bot_aqui
CLIENT_ID=seu_client_id_aqui
OWNER_IDS=seu_id_discord,outro_id_discord
```

5. Inicie o bot:
```bash
npm start
```

## 🌐 Deploy no Discloud

### Pré-requisitos
- Conta no [Discloud](https://discloud.app)
- CLI do Discloud instalado

### Passos

1. Prepare o projeto:
```bash
npm install
```

2. Crie um arquivo `.env` com suas credenciais (não commit no git)

3. Faça o deploy:
```bash
discloud deploy
```

4. Ou faça upload do ZIP no painel do Discloud

### Estrutura para Discloud

O projeto já está otimizado para Discloud com:
- `package.json` com script `start`
- Armazenamento de dados em JSON (`/data`)
- Sem dependências pesadas

## 📝 Comandos

### /painel
- Abre o painel interativo com todas as funções
- Select menu principal para escolher: Token, Limpeza, Call ou Progresso
- Cada seção tem seus próprios selects e modals

### /setpainel (Owner Only)
- `/setpainel <canal>` - Configura o canal onde o painel permanente fica
- Apenas o owner pode usar
- Envia um painel interativo no canal escolhido

## 🎮 Como Usar o Painel

1. **Use `/painel`** para abrir o painel interativo
2. **Selecione uma função** no select menu principal
3. **Siga os prompts** com selects, modals e buttons
4. **Veja o progresso** em tempo real

### Funções Disponíveis:

**Token**
- Adicionar novo token (com validação automática)
- Listar tokens registrados
- Remover tokens

**Limpeza**
- Limpar mensagens de servidor
- Limpar DMs
- Remover amigos

**Call**
- Entrar em canal de voz
- Sair de canal de voz

**Progresso**
- Ver operações ativas
- Ver histórico completo

## 🎨 Componentes V2

O bot utiliza:
- **Buttons** - Interações rápidas
- **Select Menus** - Seleção de opções
- **Modals** - Formulários bonitos
- **Embeds** - Mensagens formatadas com cores

## 📁 Estrutura de Arquivos

```
discord-selfbot-bot/
├── index.js              # Arquivo principal
├── config.js             # Configurações
├── storage.js            # Sistema de armazenamento
├── utils.js              # Utilitários (embeds, componentes)
├── discord-api.js        # API do Discord
├── commands/
│   ├── token.js
│   ├── limpar.js
│   ├── call.js
│   └── progresso.js
├── data/                 # Dados (criado automaticamente)
│   ├── tokens.json
│   └── operations.json
├── package.json
├── .env.example
└── README.md
```

## ⚠️ Aviso Legal

Este bot é para fins educacionais. O uso de selfbots viola os Termos de Serviço do Discord e pode resultar em banimento de contas. Use por sua conta e risco.

## 📄 Licença

ISC

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📞 Suporte

Para suporte, abra uma issue no repositório.
