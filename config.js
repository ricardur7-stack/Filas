require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  
  // Cores para embeds
  colors: {
    primary: 0x7c3aed,      // Roxo
    success: 0x10b981,      // Verde
    warning: 0xf59e0b,      // Âmbar
    error: 0xef4444,        // Vermelho
    info: 0x3b82f6,         // Azul
  },

  // Emojis
  emojis: {
    token: '🔑',
    clean: '🧹',
    call: '📞',
    progress: '⚡',
    success: '✅',
    error: '❌',
    loading: '⏳',
    info: 'ℹ️',
    warning: '⚠️',
  },
};
