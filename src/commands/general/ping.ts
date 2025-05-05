import { Message } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors } from '../../utils/embeds.js';

const command: Command = {
  data: {
    name: 'ping',
    description: 'Verifica a latência do bot',
    category: 'geral'
  },
  
  execute: async (message: Message) => {
    const sentMessage = await message.channel.send('Calculando ping...');
    
    const latency = sentMessage.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);
    
    const embed = createEmbed({
      title: '🏓 Pong!',
      description: `Latência do Bot: **${latency}ms**\nLatência da API: **${apiLatency}ms**`,
      color: Colors.PRIMARY,
      timestamp: true
    });
    
    await sentMessage.edit({ content: null, embeds: [embed] });
  }
};

export default command;