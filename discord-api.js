const axios = require('axios');

const API_BASE = 'https://discord.com/api/v10';

class DiscordAPI {
  constructor(token) {
    this.token = token;
    // Detectar se é bot token ou user token (selfbot)
    // Bot tokens: MTA... (base64 decoded = "10") e têm 3 partes separadas por ponto
    // User tokens: têm 2 partes separadas por ponto (user_id.token_hash)
    const parts = token.split('.');
    const isBot = parts.length === 3 || token.startsWith('MTA');
    const authHeader = isBot ? `Bot ${token}` : token;
    
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
  }

  // Validar token
  async validateToken() {
    try {
      // Verificar formato do token
      const parts = this.token.split('.');
      if (parts.length < 2) {
        return {
          valid: false,
          error: 'Formato de token inválido. Use um token de usuário (selfbot) válido.',
          isBot: false,
        };
      }

      // Se tiver 3 partes, é bot token
      if (parts.length === 3) {
        return {
          valid: false,
          error: '❌ Este é um BOT TOKEN! Use um USER TOKEN (selfbot) em vez disso.',
          isBot: true,
        };
      }

      const response = await this.client.get('/users/@me');
      return {
        valid: true,
        username: response.data.username,
        id: response.data.id,
        discriminator: response.data.discriminator,
        isBot: false,
      };
    } catch (error) {
      const status = error.response?.status;
      let errorMsg = error.message;

      if (status === 401) {
        errorMsg = '❌ Token inválido ou expirado';
      } else if (status === 403) {
        errorMsg = '❌ Token não autorizado (pode ser um bot token)';
      } else if (status === 429) {
        errorMsg = '⏳ Muitas tentativas. Aguarde um pouco.';
      }

      return {
        valid: false,
        error: errorMsg,
        isBot: false,
      };
    }
  }

  // Listar servidores
  async getGuilds() {
    try {
      const response = await this.client.get('/users/@me/guilds');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar servidores:', error.message);
      return [];
    }
  }

  // Listar canais de um servidor
  async getGuildChannels(guildId) {
    try {
      const response = await this.client.get(`/guilds/${guildId}/channels`);
      return response.data.filter(c => c.type === 0 || c.type === 2); // Text e Voice
    } catch (error) {
      console.error('Erro ao listar canais:', error.message);
      return [];
    }
  }

  // Listar mensagens de um canal
  async getChannelMessages(channelId, limit = 100) {
    try {
      const response = await this.client.get(`/channels/${channelId}/messages`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar mensagens:', error.message);
      return [];
    }
  }

  // Deletar mensagem
  async deleteMessage(channelId, messageId) {
    try {
      await this.client.delete(`/channels/${channelId}/messages/${messageId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Listar amigos
  async getFriends() {
    try {
      // Nota: Esta é uma rota não-oficial que pode não funcionar com bot tokens
      const response = await this.client.get('/users/@me/relationships');
      return response.data.filter(r => r.type === 1); // Amigos
    } catch (error) {
      console.error('Erro ao listar amigos:', error.message);
      return [];
    }
  }

  // Remover amigo
  async removeFriend(userId) {
    try {
      await this.client.delete(`/users/@me/relationships/${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover amigo:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Entrar em call (voice state update)
  async joinVoiceChannel(guildId, channelId) {
    try {
      const response = await this.client.patch(`/guilds/${guildId}/voice-states/@me`, {
        channel_id: channelId,
        self_mute: false,
        self_deaf: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Erro ao entrar em call:', errorMsg);
      
      // Mensagens de erro mais descritivas
      let userFriendlyError = errorMsg;
      if (error.response?.status === 403) {
        userFriendlyError = 'Sem permissão para entrar neste canal';
      } else if (error.response?.status === 404) {
        userFriendlyError = 'Servidor ou canal não encontrado';
      } else if (error.response?.status === 401) {
        userFriendlyError = 'Token inválido ou expirado';
      }
      
      return { success: false, error: userFriendlyError };
    }
  }

  // Sair de call
  async leaveVoiceChannel(guildId) {
    try {
      const response = await this.client.patch(`/guilds/${guildId}/voice-states/@me`, {
        channel_id: null,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Erro ao sair de call:', errorMsg);
      
      let userFriendlyError = errorMsg;
      if (error.response?.status === 403) {
        userFriendlyError = 'Sem permissão para sair deste canal';
      } else if (error.response?.status === 404) {
        userFriendlyError = 'Servidor não encontrado';
      } else if (error.response?.status === 401) {
        userFriendlyError = 'Token inválido ou expirado';
      }
      
      return { success: false, error: userFriendlyError };
    }
  }

  // Listar DMs
  async getDMChannels() {
    try {
      const response = await this.client.get('/users/@me/channels');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar DMs:', error.message);
      return [];
    }
  }
}

module.exports = DiscordAPI;
