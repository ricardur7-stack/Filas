const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle } = require('discord.js');
const config = require('./config');

// ========== EMBEDS ==========

function createEmbed(title, description, color = config.colors.primary, fields = []) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .addFields(fields)
    .setTimestamp()
    .setFooter({ text: 'Discord Selfbot Bot' });
}

function createSuccessEmbed(title, description, fields = []) {
  return createEmbed(title, description, config.colors.success, fields);
}

function createErrorEmbed(title, description, fields = []) {
  return createEmbed(title, description, config.colors.error, fields);
}

function createWarningEmbed(title, description, fields = []) {
  return createEmbed(title, description, config.colors.warning, fields);
}

function createInfoEmbed(title, description, fields = []) {
  return createEmbed(title, description, config.colors.info, fields);
}

// ========== BUTTONS ==========

function createPrimaryButton(label, customId) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Primary);
}

function createSecondaryButton(label, customId) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary);
}

function createSuccessButton(label, customId) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Success);
}

function createDangerButton(label, customId) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Danger);
}

// ========== ACTION ROWS ==========

function createButtonRow(...buttons) {
  return new ActionRowBuilder().addComponents(buttons);
}

function createSelectMenuRow(customId, placeholder, options) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(options)
  );
}

// ========== FORMATTERS ==========

function formatTokenStatus(status) {
  const statusMap = {
    'valid': `${config.emojis.success} Válido`,
    'invalid': `${config.emojis.error} Inválido`,
    'unknown': `${config.emojis.info} Desconhecido`,
  };
  return statusMap[status] || status;
}

function formatOperationType(type) {
  const typeMap = {
    'clean_server': '🧹 Limpeza Servidor',
    'clean_dm': '💬 Limpeza DM',
    'remove_friends': '👥 Remover Amigos',
    'join_call': '📞 Entrar em Call',
  };
  return typeMap[type] || type;
}

function formatOperationStatus(status) {
  const statusMap = {
    'pending': `${config.emojis.loading} Aguardando`,
    'running': `⚡ Em execução`,
    'completed': `${config.emojis.success} Concluído`,
    'failed': `${config.emojis.error} Falhou`,
    'cancelled': `⏹️ Cancelado`,
  };
  return statusMap[status] || status;
}

module.exports = {
  createEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createPrimaryButton,
  createSecondaryButton,
  createSuccessButton,
  createDangerButton,
  createButtonRow,
  createSelectMenuRow,
  formatTokenStatus,
  formatOperationType,
  formatOperationStatus,
};
