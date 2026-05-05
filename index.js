require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const painelHandlers = require('./commands/painel-handlers');
const painelCommand = require('./commands/painel');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'painel-handlers.js');

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) {
    client.commands.set(command.data.name, command);
  }
}

console.log(`✅ ${commandFiles.length} comandos carregados`);

// Event: Ready
client.on('ready', async () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);

  // Registrar comandos slash
  const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());

  try {
    const rest = new REST({ version: '10' }).setToken(config.token);

    console.log('📝 Registrando comandos slash...');
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }

  // Status do bot
  client.user.setActivity('🧹 Selfbot Manager', { type: 'WATCHING' });
});

// Event: Interaction
client.on('interactionCreate', async (interaction) => {
  try {
    const userId = interaction.user.id;

    // Slash Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('❌ Erro ao executar comando:', error);
        const reply = {
          content: `❌ Erro ao executar comando: ${error.message}`,
          ephemeral: true,
        };
        if (interaction.replied) {
          await interaction.editReply(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    }

    // Modal Submit
    if (interaction.isModalSubmit()) {
      const modalId = interaction.customId;

      // Token add modal
      if (modalId.startsWith('token_add_modal_')) {
        const command = client.commands.get('painel');
        if (command?.handleTokenAddModal) {
          await command.handleTokenAddModal(interaction, userId);
        }
      }

      // Limpeza servidor modal
      if (modalId.startsWith('limpeza_servidor_modal_')) {
        await painelHandlers.handleLimpezaServidorModal(interaction, userId);
      }

      // Call join modal
      if (modalId.startsWith('call_join_modal_')) {
        await painelHandlers.handleCallJoinModal(interaction, userId);
      }

      // Call leave modal
      if (modalId.startsWith('call_leave_modal_')) {
        await painelHandlers.handleCallLeaveModal(interaction, userId);
      }
    }

    // Select Menu
    if (interaction.isStringSelectMenu()) {
      const selectId = interaction.customId;

      // Painel main
      if (selectId.includes('painel_main_')) {
        await painelCommand.handleSelectMenu(interaction, userId);
      }

      // Token action
      if (selectId.includes('token_action_')) {
        const command = client.commands.get('painel');
        if (command?.handleTokenAction) {
          await command.handleTokenAction(interaction, userId);
        }
      }

      // Token remove select
      if (selectId.includes('token_remove_select_')) {
        const command = client.commands.get('painel');
        if (command?.handleTokenRemoveSelect) {
          await command.handleTokenRemoveSelect(interaction, userId);
        }
      }

      // Limpeza token select
      if (selectId.includes('limpeza_token_')) {
        await painelHandlers.handleLimpezaTokenSelect(interaction, userId);
      }

      // Limpeza type select
      if (selectId.includes('limpeza_type_')) {
        await painelHandlers.handleLimpezaTypeSelect(interaction, userId);
      }

      // Call token select
      if (selectId.includes('call_token_')) {
        await painelHandlers.handleCallTokenSelect(interaction, userId);
      }

      // Call action select
      if (selectId.includes('call_action_')) {
        await painelHandlers.handleCallActionSelect(interaction, userId);
      }
    }

    // Button Click
    if (interaction.isButton()) {
      const buttonId = interaction.customId;

      // Progresso buttons
      if (buttonId.includes('progress_')) {
        await painelHandlers.handleProgressoButton(interaction, userId);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao processar interação:', error);
  }
});

// Event: Error
client.on('error', error => {
  console.error('❌ Erro do cliente:', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ Promise rejeitada não tratada:', error);
});

// Login
client.login(config.token);
